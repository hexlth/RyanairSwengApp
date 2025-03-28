import { Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  // input value of searchbar
  inputValue: string = "";

  // boolean to show if value entered is valid or not
  @Input() isInvalid: boolean = false;

  // Placeholder string
  @Input() placeholder: string = "";

  // Error message string
  @Input() errorMessage: string = "";

  // Output the search input when it changes
  @Output() inputValueChange = new EventEmitter<String>();

  // method to update input value to new value entered by user
  onInputChange(e: Event) {
    this.inputValue = (e.target as HTMLInputElement).value;
    this.inputValueChange.emit(this.inputValue);
  }

  // create an input to pass the method checking flightNum from homepage
  @Input() searchFunction!: (searchQuery : string) => void;
}
