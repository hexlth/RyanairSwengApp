import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListComponent } from "../list/list.component";
import { ChartComponent } from '../chart/chart.component';
import { ScanComponent } from '../Upload-Scan/scan.component';
import { FormsModule } from '@angular/forms';
import { WarningsComponent } from "../warnings/warnings.component";


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
  imports: [ListComponent, ChartComponent, ScanComponent, FormsModule, WarningsComponent],
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
  flightNum: string = "";
  stock: { name: string; quantity: number; epc: string }[] = [];

  // array of screen options to choose from and declaration of current option string
  options: string[] = ["Overview", "Products", "Graphs", "Warnings", "Scan"];
  currentOption: string = "";

  // boolean to toggle sidebar
  isSidebarOpen: boolean = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  ngOnInit() {
    this.flightNum = this.route.snapshot.queryParamMap.get("flightNum") || "";
  
    // Then call loadFetchedData and update stock
    this.loadFetchedData();
    this.stock = this.searchForData();
  }  

  loadFetchedData(): void {
    fetch(`http://localhost:8080/data?flightNum=${this.flightNum}`)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((fetchedData: Data[]) => {
        console.log('Fetched data:', fetchedData);
  
        // Update or add current flight data
        let currentFlight = this.flightStock.find(flight => flight.flightNum === this.flightNum);
        const newItems = fetchedData.map(item => ({
          name: item.type,
          quantity: item.totalcount,
          epc: item.epc
        }));
  
        if (currentFlight) {
          currentFlight.stock = newItems;
        } else {
          this.flightStock.push({
            flightNum: this.flightNum!,
            stock: newItems
          });
        }
  
        // Update displayed stock
        this.stock = newItems;
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
