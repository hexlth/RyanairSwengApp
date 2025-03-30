import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-warnings',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './warnings.component.html',
  styleUrl: './warnings.component.css'
})
export class WarningsComponent implements OnInit {
  flightNumbers: string[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.fetchLowStockFlights();
  }

  fetchLowStockFlights() {
    this.http.get<string[]>('http://localhost:8080/low-stock')
      .subscribe({
        next: (flights) => this.flightNumbers = flights,
        error: (err) => console.error('Failed to fetch low-stock flights:', err)
      });
  }

  goToFlight(flightNumber: string): void {
    this.router.navigate(['/trolley'], { queryParams: { flightNum: flightNumber } });
  }
}
