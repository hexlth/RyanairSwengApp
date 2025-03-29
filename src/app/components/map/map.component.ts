import { Component, Input, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from '../../services/map.service';
import { Airport } from '../../models/airport.model';
import { Route } from '../../models/route.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Define a custom icon with explicit image paths
const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41], // Default size
  iconAnchor: [12, 41], // Position relative to the point
  popupAnchor: [1, -34], // Position of the popup relative to the icon
  shadowSize: [41, 41]
});

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  // the whole airports and routes arrary and map
  airports: Airport[] = [];
  routes: Route[] = [];
  map!: L.Map; 

  // filtered airports and routes
  filteredAirports: Airport[] = [];
  filteredRoutes: Route[] = [];

  // Define the input search parameters to map
  @Input() fligthNumberSearch: String = "";
  @Input() departureSearch: string = "";
  @Input() destSearch: string = "";
  

  markers: L.Marker[] = []; // Store markers for easy removal
  polylines: L.Polyline[] = []; // Store polylines for easy removal

  constructor(private mapService: MapService) {
  }
  
  // run this when component initialized
  ngOnInit() {
    this.loadAirportsAndInitialize();
  }
  
  // asynchronous function which awaits for the promise to fetch airport data
  // once airport data fetched, we initialize the map
  async loadAirportsAndInitialize() {
    try {
      // assign the airports array as the return of the promise
      this.airports = await this.mapService.filterRyanairAirports(); // ✅ Wait for API call to finish
  
      // we then generate random routes for testing
      this.routes = this.mapService.generateRoute(this.departureSearch, this.destSearch);
  
      // initialize the map
      this.initMap();
  
      // Apply filters AFTER airports and routes exist
      [this.filteredRoutes, this.filteredAirports] = this.mapService.filter(
        this.fligthNumberSearch, this.destSearch, this.departureSearch
      );
  
      // update the map with new current filtered routes and airports
      this.updateMap();
    } catch (error) {
      console.error("Error in initialization:", error);
    }
  }
  

  // called anytime that the search inputs change
  ngOnChanges() {
    if (this.departureSearch && this.destSearch) {
      this.routes = this.mapService.generateRoute(this.departureSearch, this.destSearch);

      this.filteredAirports = this.airports.filter(airport =>
        airport.iata === this.departureSearch || airport.iata === this.destSearch
      );

      this.filteredRoutes = this.routes;
  
      this.updateMap();
    } else {
      this.clearMap();
    }
  }
  
  // initialize the map on screen
  initMap() {
    this.map = L.map('map', {
      center: [51.505, -0.09], // Default center (London)
      zoom: 5 // Default zoom level
    });
  
    // Add a tile layer (this is needed for the map to be visible)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  }

  // function which resets the filtered routes back to all the routes
  resetMap() {
    this.filteredRoutes = this.routes;

    this.filteredAirports = this.airports.filter(airport =>
      this.filteredRoutes.find(route => route.to.iata === airport.iata || route.from.iata === airport.iata));
  }

  // updates the current routes to be displayed on screen using filteredRoutes and filteredAirports
  updateMap() {
    // Clear existing markers and polylines
    this.clearMap();

    // Re-add filtered markers and routes
    this.addAirportMarkers(this.filteredAirports);
    this.addFlightRoutes(this.filteredRoutes, this.filteredAirports);
  }

  // add the airport markers onto the map, add only ones needed for routes
  addAirportMarkers(filteredAirports: Airport[]) {
    filteredAirports.forEach(airport => {
      let marker = L.marker([airport.latitude, airport.longitude], { icon: customIcon })
        .addTo(this.map)
        .bindPopup(`<b>${airport.name}</b><br>IATA: ${airport.iata}`);

      this.markers.push(marker);
    });
  }

  // add the red lines to map corresponding to flight routes
  addFlightRoutes(filteredRoutes: Route[], filteredAirports: Airport[]) {
    filteredRoutes.forEach(route => {
      const fromAirport = filteredAirports.find(airport => airport.iata === route.from.iata);
      const toAirport = filteredAirports.find(airport => airport.iata === route.to.iata);

      if (!fromAirport || !toAirport) {
        console.warn(`Skipping route: ${route.from.iata} → ${route.to.iata} (Airport data missing)`);
        return;  // Skip this iteration if either airport is missing
      }

      const latlngs: [number, number][] = [
        [fromAirport.latitude, fromAirport.longitude],  // ✅ Safe usage
        [toAirport.latitude, toAirport.longitude]       // ✅ Safe usage
      ];

      let polyline = L.polyline(latlngs, {
        color: 'red',
        weight: 4,
        opacity: 0.8,
        interactive: true
      }).addTo(this.map);

      polyline.bindPopup(`FlightNumber: ${route.flightNumber} Route: ${route.from.iata} → ${route.to.iata}`);
      polyline.on('click', e => polyline.openPopup(e.latlng));

       // Hover effect to change color on mouseover and revert on mouseout
      polyline.on('mouseover', () => {
      polyline.setStyle({
        color: 'blue',  // Change the color to blue on hover
        weight: 6,      // Optionally make the line thicker on hover
        });
      });

      // Revert the colour after hover
      polyline.on('mouseout', () => {
        polyline.setStyle({
          color: 'red',   // Revert to the original color
          weight: 4,      // Reset the line thickness
        });
      });

      this.polylines.push(polyline);
    });
  }

  // removes all markers/ route lines, used to re-add new ones after any changes made
  clearMap() {
    // Remove markers
    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = [];

    // Remove polylines
    this.polylines.forEach(polyline => this.map.removeLayer(polyline));
    this.polylines = [];
  }
  }
