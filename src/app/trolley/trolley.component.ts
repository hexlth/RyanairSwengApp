import { Component, OnInit } from '@angular/core';
import { HomeComponent } from '../home/home.component';
import { ActivatedRoute } from '@angular/router';
import { ListComponent } from "../list/list.component";

@Component({
  selector: 'app-trolley',
  imports: [ListComponent],
  templateUrl: './trolley.component.html',
  styleUrl: './trolley.component.css'
})
export class TrolleyComponent {
  // demo hardcoded array of stock
  flightStock = [
    {
      flightNum: "0000",
      stock: [
              // Drinks
      { name: "Coke", quantity: 40 },
      { name: "Pepsi", quantity: 30 },
      { name: "Fanta", quantity: 20 },
      { name: "Sprite", quantity: 25 },
      { name: "Heineken", quantity: 15 },
      { name: "Budweiser", quantity: 12 },
      { name: "Red Wine", quantity: 10 },
      { name: "White Wine", quantity: 8 },
      { name: "Whiskey", quantity: 5 },
      { name: "Orange Juice", quantity: 18 },
      { name: "Apple Juice", quantity: 16 },
      { name: "Still Water", quantity: 0 },
      { name: "Sparkling Water", quantity: 30 },

      // Snacks
      { name: "Pringles", quantity: 6 },
      { name: "Peanuts", quantity: 12 },
      { name: "Almonds", quantity: 10 },
      { name: "Cashews", quantity: 0 },
      { name: "Chocolate Bar", quantity: 14 },
      { name: "Gummy Bears", quantity: 9 },
      { name: "Protein Bar", quantity: 7 },
      { name: "Cookies", quantity: 15 },

      // Hot Meals
      { name: "Chicken Curry with Rice", quantity: 10 },
      { name: "Beef Lasagna", quantity: 12 },
      { name: "Vegetarian Pasta", quantity: 8 },
      { name: "Grilled Salmon with Vegetables", quantity: 6 },
      { name: "Cheese Omelette", quantity: 5 },
      { name: "Pancakes with Maple Syrup", quantity: 7 },
      { name: "Mushroom Risotto", quantity: 4 },

      // Perfumes
      { name: "Chanel No. 5", quantity: 3 },
      { name: "Dior Sauvage", quantity: 51 },
      { name: "Gucci Bloom", quantity: 4 },
      { name: "Armani Code", quantity: 0 },
      { name: "YSL Black Opium", quantity: 7 },
      { name: "Versace Eros", quantity: 5 },
      { name: "Hugo Boss Bottled", quantity: 16 },
      ]
    },
    {
      flightNum: "0001",
      stock: [
        { name: "Coke", quantity: 25 },
        { name: "Heineken", quantity: 0 },
        { name: "Pringles", quantity: 8 },
        { name: "Peanuts", quantity: 12 }
      ]
    },
    {
      flightNum: "0002",
      stock: [
        { name: "Coke", quantity: 10 },
        { name: "Heineken", quantity: 12 },
        { name: "Pringles", quantity: 5 },
        { name: "Juice", quantity: 20 }
      ]
    }
  ];

  // initializing flightNum in trolley page
  flightNum : string | null = "";
  stock : any[] = [];

  // setting the route to the current activated route
  constructor(private route: ActivatedRoute) {}

  //reading in the flightNumber when trolley page initialized
  ngOnInit() {
    this.flightNum = this.route.snapshot.queryParamMap.get("flightNum");
    this.stock = this.searchForData();
  }

  //search function to get data associated with flightNum
  searchForData() {
    //find flight and return stock, if undefined return empty array
    return this.flightStock.find(flight => flight.flightNum === this.flightNum)?.stock ?? [];
  }
}
