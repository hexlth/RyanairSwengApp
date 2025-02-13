import { Component, Input} from '@angular/core';
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

  // method to update input value to new value entered by user
  onInputChange(event: Event) {
    this.inputValue = (event.target as HTMLInputElement).value;
  }

  // create an input to pass the method checking flightNum from homepage
  @Input() searchFunction!: (searchQuery : string) => void;
}
