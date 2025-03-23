import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Item } from '../../models/item.model';

@Component({
  selector: 'app-warnings',
  standalone: true,
  imports: [CommonModule], // ✅ Add FormsModule here
  templateUrl: './warnings.component.html',
  styleUrl: './warnings.component.css'
})
export class WarningsComponent {
  @Input() stock: Item[] = [];

  lowStockThreshold: number = 10;

   get getLowStockItems(): Item[] 
    {
      const filteredItems = this.stock.filter(item => item.quantity < this.lowStockThreshold);
      return filteredItems.sort((a, b) => a.quantity - b.quantity);
    }
 
  getClass(quantity: number)
   {
    if (quantity > 30) return "high-stock";
    if (quantity > 10) return "med-stock";
    return quantity === 0 ? "no-stock" : "low-stock";
  }
}
