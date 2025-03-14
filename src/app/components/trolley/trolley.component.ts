import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListComponent } from "../list/list.component";
import { ChartComponent } from '../chart/chart.component';
import { ScanComponent } from '../Upload-Scan/scan.component';

// The structure for each flight in your component
interface FlightStock {
  flightNum: string;
  stock: { name: string; quantity: number; epc: string }[];
}

//
interface Data {
  index: number;
  type: string;
  epc: string;
  readtime: string;
  inserttime: string;
  id: number;
  userdata: string;
  reserveddata: string;
  totalcount: number;
}

@Component({
  selector: 'app-trolley',
  imports: [ListComponent, ChartComponent, ScanComponent],
  standalone: true,
  templateUrl: './trolley.component.html',
  styleUrls: ['./trolley.component.css']
})
export class TrolleyComponent implements OnInit {
  // Initially, hardcoded flightStock with flight "0000"
  flightStock: FlightStock[] = [
    {
      flightNum: "0000",
      stock: [
        { name: "Coke", quantity: 40, epc: "sgvadfbdfab" },
        { name: "Pepsi", quantity: 30, epc: "ffbadfbfdb" },
        // ...other items if needed
      ]
    }
    // Other flights can be added here if needed
  ];

  // setting the route to the current activated route
  constructor(private route: ActivatedRoute) {}

  // initializing flightNum in trolley page and array of Items for stock
  flightNum: string | null = "";
  stock: { name: string; quantity: number; epc: string }[] = [];

  // array of screen options to choose from and declaration of current option string
  options: string[] = ["Overview", "Products", "Graphs", "Warnings", "Scan"];
  currentOption: string = "";

  ngOnInit() {
    // Get flight number from query parameters (if used)
    this.flightNum = this.route.snapshot.queryParamMap.get("flightNum");

    // Load fetched data and add it to flight "0000"
    this.loadFetchedData();

    // Update the displayed stock for the current flight
    this.stock = this.searchForData();
  }

  // Fetches data from the API and adds it to flight "0000"
  loadFetchedData(): void {
    fetch('http://localhost:8080/data')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((fetchedData: Data[]) => {
        console.log('Fetched data:', fetchedData);
        // Find flight "0000" in your flightStock array
        const flight0000 = this.flightStock.find(flight => flight.flightNum === "0000");
        if (flight0000) {
          // Map each fetched Data item to a stock item
          const newItems = fetchedData.map(item => ({
            name: item.type,
            quantity: item.totalcount,
            epc: item.epc
          }));
          // Add the new items to the existing stock.
          flight0000.stock = flight0000.stock.concat(newItems);

          // If your component is showing data for flight "0000", update the displayed stock.
          if (this.flightNum === "0000" || !this.flightNum) {
            this.stock = flight0000.stock;
          }
        }
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
  }

  // Searches the flightStock for data matching the flightNum from the URL.
  searchForData(): { name: string; quantity: number; epc: string }[] {
    return this.flightStock.find(flight => flight.flightNum === this.flightNum)?.stock ?? [];
  }

  // Change the current option to be displayed
  onOptionClick(option: string): void {
    this.currentOption = option;
  }
}
