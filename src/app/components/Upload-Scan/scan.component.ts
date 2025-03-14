import { Component } from '@angular/core';

@Component({
  selector: 'app-scan',
  standalone: true,  
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css']
})
export class ScanComponent {
  selectedFileName: string | null = null;

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      this.selectedFileName = file.name;

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const csvContent = e.target?.result as string;
        console.log('CSV file content:', csvContent);

        // You can process your CSV content here
      };

      reader.readAsText(file);
    }
  }
}
