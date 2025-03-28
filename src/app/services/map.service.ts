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
  
  
  

  generateRandomRoutes(): Route[] {

    for (let i = 0; i < 10; i++) {
      let random1 = Math.floor(Math.random() * this.airports.length);
      let random2 = Math.floor(Math.random() * this.airports.length);
      let random3 = Math.floor(Math.random() * 2000) + 1000;

      // Ensure different airports for "from" and "to"
      while (random1 === random2) {
        random2 = Math.floor(Math.random() * this.airports.length);
      }

      this.routes.push({
        flightNumber: random3.toString(),
        to: {
          iata: this.airports[random1].iata,
        },
        from: {
          iata: this.airports[random2].iata,
        }
      });
    }

    return this.routes;
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
