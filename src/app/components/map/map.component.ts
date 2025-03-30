import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from '../../services/map.service';
import { Airport } from '../../models/airport.model';
import { Route } from '../../models/route.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnChanges {
  airports: Airport[] = [];
  routes: Route[] = [];
  map!: L.Map; 

  filteredAirports: Airport[] = [];
  filteredRoutes: Route[] = [];

  @Input() flightNumberSearch: string = "";
  @Input() departureSearch: string = "";
  @Input() destSearch: string = "";

  markers: L.Marker[] = [];
  polylines: L.Polyline[] = [];

  constructor(private mapService: MapService) { }
  
  async ngOnInit() {
    this.airports = await this.mapService.filterRyanairAirports();
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['departureSearch'] || changes['destSearch'] || changes['flightNumberSearch']) {
      if (this.departureSearch && this.destSearch) {
        this.routes = this.mapService.generateRoute(this.departureSearch, this.destSearch);
        [this.filteredRoutes, this.filteredAirports] = this.mapService.filter(
          this.flightNumberSearch, this.destSearch, this.departureSearch
        );
        this.updateMap();
      } else {
        this.clearMap();
      }
    }
  }

  initMap() {
    this.map = L.map('map', { center: [51.505, -0.09], zoom: 5 });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  }

  updateMap() {
    this.clearMap();
    this.addAirportMarkers(this.filteredAirports);
    this.addFlightRoutes(this.filteredRoutes, this.filteredAirports);
  }

  addAirportMarkers(filteredAirports: Airport[]) {
    filteredAirports.forEach(airport => {
      let marker = L.marker([airport.latitude, airport.longitude], { icon: customIcon })
        .addTo(this.map)
        .bindPopup(`<b>${airport.name}</b><br>IATA: ${airport.iata}`);
      this.markers.push(marker);
    });
  }

  addFlightRoutes(filteredRoutes: Route[], filteredAirports: Airport[]) {
    filteredRoutes.forEach(route => {
      const fromAirport = filteredAirports.find(a => a.iata === route.from.iata);
      const toAirport = filteredAirports.find(a => a.iata === route.to.iata);

      if (!fromAirport || !toAirport) {
        console.warn(`Skipping route: ${route.from.iata} → ${route.to.iata} (Airport data missing)`);
        return;
      }

      const latlngs: [number, number][] = [
        [fromAirport.latitude, fromAirport.longitude],
        [toAirport.latitude, toAirport.longitude]
      ];

      let polyline = L.polyline(latlngs, { color: 'red', weight: 4, opacity: 0.8 })
        .addTo(this.map)
        .bindPopup(`FlightNumber: ${route.flightNumber} Route: ${route.from.iata} → ${route.to.iata}`);

      polyline.on('mouseover', () => polyline.setStyle({ color: 'blue', weight: 6 }));
      polyline.on('mouseout', () => polyline.setStyle({ color: 'red', weight: 4 }));

      this.polylines.push(polyline);
    });
  }

  clearMap() {
    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = [];

    this.polylines.forEach(polyline => this.map.removeLayer(polyline));
    this.polylines = [];
  }
}
