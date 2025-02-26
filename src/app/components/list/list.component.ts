import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Item } from '../../models/item.model';

@Component({
  selector: 'app-list',
  imports: [CommonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnChanges  {
  // constructor to inject dataService to 

  // the stock of current flight number passed in
  @Input() stock: Item[] = [];
  //category for list
  category: String = "all";

  ngOnChanges() {
    if (this.stock) {
      this.stock = [...this.stock].sort((a, b) => b.quantity - a.quantity);
    }
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
