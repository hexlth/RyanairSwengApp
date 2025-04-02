import { Component, Input } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scan',
  standalone: true,  
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css'],
  imports: [HttpClientModule, CommonModule],
})
export class ScanComponent {
  @Input() flightNum?: string; // Clearly indicate flightNum may initially be undefined
  selectedFile: File | null = null;
  selectedFileName: string | null = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedFile = inputElement.files[0];
      this.selectedFileName = this.selectedFile.name;
    }
  }

  uploadFile(): void {
    // Clearly handle possible undefined flightNum
    if (!this.selectedFile || !this.flightNum || !this.flightNum.trim()) {
      alert("You must select a CSV file and have a valid flight number!");
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('flightNum', this.flightNum.trim());
    const backendURL = 'https://ryanairbackend.onrender.com'; 

    this.http.post(`${backendURL}/upload`, formData, { responseType: 'text' })
      .subscribe({
        next: (response) => {
          alert(`Upload successful for flight ${this.flightNum}!`);
          this.refreshProducts();
          this.selectedFileName = null; // Reset after successful upload
        },
        error: (err) => console.error('Upload failed:', err)
      });    
  }

  refreshProducts(): void {
    const backendURL = 'https://ryanairbackend.onrender.com'; 
    if (!this.flightNum) {
      console.error('Flight number is missing during refresh.');
      return;
    }

    this.http.get(`${backendURL}/data?flightNum=${this.flightNum.trim()}`)
    .subscribe((products) => {
      console.log('Updated products:', products);
      // Update your UI clearly here
    }, err => {
      console.error('Error fetching refreshed products:', err);
    });
  
  }
}
