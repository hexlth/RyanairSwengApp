import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list',
  imports: [CommonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
  // the stock of current flight number passed in
  @Input() stock: any[] = [];
  //category for list
  category: String = "all";

  //function to choose category from dropdown
  getCategory(event: Event) {
    this.category = (event.target as HTMLInputElement).value;
    console.log(this.category);
  }

  // function to assign class which will dicate the background colour
  getClass(quantity: number) {
    if(quantity > 30) {
      return "high-stock";
    }
    else if(quantity > 10) {
      return "med-stock";
    }
    else {
      if(quantity === 0) {
        return "no-stock";
      }
      else {
        return "low-stock";
      }
    }
  }
}
