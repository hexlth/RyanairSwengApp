import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-scan',
  standalone: true,  
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css'],
  imports: [],
})
export class ScanComponent {
  @Input() flightNum!: string; // Flight number clearly received from trolley.component
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
    if (!this.selectedFile || !this.flightNum.trim()) {
      alert("You must select a CSV file and have a valid flight number!");
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('flightNum', this.flightNum.trim());

    this.http.post('http://localhost:8080/upload', formData, { responseType: 'text' })
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
    this.http.get(`http://localhost:8080/data?flightNum=${this.flightNum.trim()}`).subscribe((products) => {
      console.log('Updated products:', products);
      // Update your UI here
    });
  }
}
