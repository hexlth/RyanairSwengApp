import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-scan',
  standalone: true,  
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css'],
  imports: [],
})
export class ScanComponent {
  selectedFileName: string | null = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      this.selectedFileName = file.name;

      const formData = new FormData();
      formData.append('file', file);

      // Upload CSV to Go backend
      this.http.post('http://localhost:8080/upload', formData, { responseType: 'text' })
        .subscribe({
          next: (response) => {
            console.log('Upload successful:', response);
            // Immediately refresh products after upload
            this.refreshProducts();
          },
          error: (err) => console.error('Upload failed:', err)
        });
    }
  }

  refreshProducts(): void {
    this.http.get('http://localhost:8080/data').subscribe((products) => {
      console.log('Updated products:', products);
      // Update your products page/UI here
    });
  }
}
