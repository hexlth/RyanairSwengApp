import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Item } from '../../models/item.model';
import { Route } from '../../models/route.model';

const mockRoutes: Route[] = [
  {
    flightNumber: "AA123",
    to: { iata: "LAX" },
    from: { iata: "JFK" },
    isLow: true
  },
  {
    flightNumber: "DL456",
    to: { iata: "ORD" },
    from: { iata: "ATL" },
    isLow: true
  },
  {
    flightNumber: "UA789",
    to: { iata: "SFO" },
    from: { iata: "DEN" },
    isLow: true
  },
  {
    flightNumber: "BA101",
    to: { iata: "LHR" },
    from: { iata: "CDG" },
    isLow: true
  },
  {
    flightNumber: "EK202",
    to: { iata: "DXB" },
    from: { iata: "SIN" },
    isLow: true
  },
  {
    flightNumber: "AA123",
    to: { iata: "LAX" },
    from: { iata: "JFK" },
    isLow: true
  },
  {
    flightNumber: "DL456",
    to: { iata: "ORD" },
    from: { iata: "ATL" },
    isLow: true
  },
  {
    flightNumber: "UA789",
    to: { iata: "SFO" },
    from: { iata: "DEN" },
    isLow: true
  },
  {
    flightNumber: "BA101",
    to: { iata: "LHR" },
    from: { iata: "CDG" },
    isLow: true
  },
  {
    flightNumber: "EK202",
    to: { iata: "DXB" },
    from: { iata: "SIN" },
    isLow: true
  },
  {
    flightNumber: "AA123",
    to: { iata: "LAX" },
    from: { iata: "JFK" },
    isLow: true
  },
  {
    flightNumber: "DL456",
    to: { iata: "ORD" },
    from: { iata: "ATL" },
    isLow: true
  },
  {
    flightNumber: "UA789",
    to: { iata: "SFO" },
    from: { iata: "DEN" },
    isLow: true
  },
  {
    flightNumber: "BA101",
    to: { iata: "LHR" },
    from: { iata: "CDG" },
    isLow: true
  },
  {
    flightNumber: "EK202",
    to: { iata: "DXB" },
    from: { iata: "SIN" },
    isLow: true
  }
];

@Component({
  selector: 'app-warnings',
  standalone: true,
  imports: [CommonModule], // Add FormsModule here
  templateUrl: './warnings.component.html',
  styleUrl: './warnings.component.css'
})
export class WarningsComponent implements OnInit {
  // create the array of route info used to display info in each warning popup
  routes: Route[] = [];

  // method to reinitialize the routes array each time the component is rendered to the screen
  ngOnInit() {
    this.routes = mockRoutes.filter(route => route.isLow === true);
  }
}
