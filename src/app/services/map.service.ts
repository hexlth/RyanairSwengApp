import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Airport } from '../models/airport.model';
import { Route } from '../models/route.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  // keep log of all routes and airport data
  routes: Route[] = [];
  airports: Airport[] = [];

  // constructor to create the httpClient
  constructor(private http: HttpClient) { }

  // asynchronous function which returns airport data via a promise
  async filterRyanairAirports(): Promise<Airport[]> {
  
    // endpoint where airport data is
    const ryanairUrl = 'https://www.ryanair.com/api/views/locate/5/airports/en/active';
  
    // use a try catch, try to get the data and if error we catch the error and log error
    try {
      // await the respone from the url
      const response = await firstValueFrom(this.http.get<any[]>(ryanairUrl));
  
      if (!response) {
        console.error("API Response is null or undefined.");
        return [];
      }
  
      // if the response was ok, we filter the airport data to align with Airport structure
      this.airports = response
        .filter(airport => airport.code && airport.coordinates?.latitude && airport.coordinates?.longitude) // Ensure valid data
        .map(airport => ({
          iata: airport.code,
          name: airport.name,
          latitude: airport.coordinates.latitude,
          longitude: airport.coordinates.longitude
        }));
  
      // return the filtered airport data
      return this.airports;
    } catch (error) {
      console.error("API Error:", error);
      // Return an empty array to prevent breaking the app
      return [];
    }
  }
  
  
  

  generateRoute(fromIATA: string, toIATA: string): Route[] {
    const flightNumber = (Math.floor(Math.random() * 2000) + 1000).toString();
  
    // Clearly ensure both airports exist
    const fromAirport = this.airports.find(a => a.iata === fromIATA);
    const toAirport = this.airports.find(a => a.iata === toIATA);
  
    if (!fromAirport || !toAirport || fromIATA === toIATA) {
      console.warn("Invalid airports selected.");
      return [];
    }
  
    return [{
      flightNumber: flightNumber,
      from: { iata: fromIATA },
      to: { iata: toIATA }
    }];
  }
  

  // filter function which filters which routes to display on the map using 3 search parameters
  filter(flightNumberSearch: String, destSearch: String, departureSearch: String): [Route[], Airport[]] {
    // Filter airports and routes based on all search terms
    let filteredRoutes = this.routes.filter(route =>
      route.flightNumber.toLocaleLowerCase().includes(flightNumberSearch.toLocaleLowerCase()) &&
      route.to.iata.toLocaleLowerCase().includes(destSearch.toLocaleLowerCase()) &&
      route.from.iata.toLocaleLowerCase().includes(departureSearch.toLocaleLowerCase()));

    let filteredAirports = this.airports.filter(airport =>
      filteredRoutes.find(route => route.to.iata === airport.iata || route.from.iata === airport.iata));
    
    return [filteredRoutes, filteredAirports]
  }
}
