import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { Item } from '../../models/item.model';
import { Action } from 'rxjs/internal/scheduler/Action';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule], // Add FormsModule here
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnChanges {
  @Input() stock: Item[] = [];
  searchTerm: string = ""; // Holds the search input value

  // Inputting the refresh method
  @Input() action!: () => void;

  // Call the refresh method
  refresh() {
    this.action();
  }

  get filteredStock(): Item[] {
    if (!this.searchTerm) {
      return this.stock.sort((a, b) => b.quantity - a.quantity); // Show all if no search term
    }

    // Allow partial matches in search
    return this.stock
      .filter(item => 
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
      .sort((a, b) => b.quantity - a.quantity);
  }

  ngOnChanges() {
    if (this.stock) {
      this.stock = [...this.stock].sort((a, b) => b.quantity - a.quantity);
    }
  }

  getClass(quantity: number) {
    if (quantity > 30) return "high-stock";
    if (quantity > 10) return "med-stock";
    return quantity === 0 ? "no-stock" : "low-stock";
  }
}
