import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Airport } from '../models/airport.model';
import { Route } from '../models/route.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  // all routes and airports
  routes: Route[] = [];
  airports: Airport[] = [];

  constructor(private http: HttpClient) { }

  async filterRyanairAirports(): Promise<Airport[]> {
    const url = 'https://www.ryanair.com/api/views/locate/5/airports/en/active';
    const response = await firstValueFrom(this.http.get<any[]>(url));
  
    this.airports = response
      .filter(airport => airport.code && airport.coordinates)
      .map(airport => ({
        iata: airport.code,
        name: airport.name,
        latitude: airport.coordinates.latitude,
        longitude: airport.coordinates.longitude
      }));
  
    return this.airports;
  }  

  generateRoute(departureSearch: string, destSearch: string): Route[] {
    this.routes = [{
      flightNumber: `${departureSearch}-${destSearch}`,
      from: { iata: departureSearch },
      to: { iata: destSearch }
    }];
  
    return this.routes;
  }  

  filter(flightNumberSearch: string, destSearch: string, departureSearch: string): [Route[], Airport[]] {
    let filteredRoutes = this.routes.filter(route =>
      (!flightNumberSearch || route.flightNumber.toLowerCase().includes(flightNumberSearch.toLowerCase())) &&
      (!destSearch || route.to.iata.toLowerCase().includes(destSearch.toLowerCase())) &&
      (!departureSearch || route.from.iata.toLowerCase().includes(departureSearch.toLowerCase()))
    );
  
    let filteredAirports = this.airports.filter(airport =>
      filteredRoutes.some(route => route.to.iata === airport.iata || route.from.iata === airport.iata)
    );
  
    return [filteredRoutes, filteredAirports];
  }  
}
