import { Component, Input, Output, OnInit } from '@angular/core';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MapComponent } from "../map/map.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SearchBarComponent, CommonModule, MapComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  // creating a flightNum input to be passed to searchBar
  flightNum: string = "";
  toIata: string = "";
  fromIata: string = "";

  // valid boolean to be passed to searchbar
  invalid: boolean = false;

  flightNumbers: string[] = ["0000", "0001", "0002","0003","0004","0005"];

  // Inject the Router
  constructor(private router: Router) {}

  // function to update the search parameters
  updateFlightNum(input: string) {
    this.flightNum = input;
    console.log(this.flightNum);
  }

  updateToIata(e: Event) {
    this.toIata = (e.target as HTMLInputElement).value;
  }

  updateFromIata(e: Event) {
    this.fromIata = (e.target as HTMLInputElement).value;
  }

  // creating method to be called by search button to check for flight numbers
  searchForFlightNum(searchQuery: string) {
    this.flightNum = searchQuery.trim();

    if(this.flightNum.match(/^[A-Z]{3}-[A-Z]{3}$/)) { // validate pattern like "AAL-AAR"
        this.router.navigate(["/trolley"], {queryParams: {flightNum: this.flightNum}});
    } else {
        alert("INVALID FLIGHT NUMBER FORMAT (Use format: ABC-DEF)");
        this.invalid = true;
        setTimeout(() => this.invalid = false, 2000);
    }
  }

    // create array of imagePaths used to set src of background
    imagePaths: string[] = ["images/array/image0.jpg", "images/array/image1.jpg", "images/array/image2.jpg", "images/array/image3.jpg"];

  //create currentPath and current index variable
  currentPath: string = this.imagePaths[0];
  currentIndex: number = 0;


  //method to dynamically change the image path to make animation for background
  ngOnInit() {
    // use setInterval to change the currentIndex every given seconds
    setInterval(() => {
      if(this.currentIndex == this.imagePaths.length - 1) {
        this.currentIndex = 0;
      }
      else {
        this.currentIndex++;
      }
      this.currentPath = this.imagePaths[this.currentIndex];
    }, 3000);
  }
}
