import { Injectable } from '@angular/core';
import { Item } from '../models/item.model';

@Injectable({
  providedIn: 'root'
})
export class ChartDataService {

  constructor() { }

  // create variable for the chart data
  data: Item[] = [];

  // create arrays for the labels and values to be updated
  values: number[] = [];
  labels: string[] = [];


  // function to set the data
  setData(data: Item[]) {
    this.data = data;
  }

  // initialize the chart data
  // Input the Item[] array and return the values and labels arrays as a tuple
  // return format: 1st values, 2nd labels
  initializeChartData(data: Item[]): [number[], string[]] {
    // assign the current flights stock to data
    this.data = data;

    // map the values and labels from this data array
    this.values = this.data.map(item => item.quantity);
    this.labels = this.data.map(item => item.name);

    // return the values and labels arrays
    return [this.values, this.labels];
  }

  // get data in a range of values
  getDataRange(minValue: number, maxValue: number): [number[], string[], Item[]] {
    // create filteredData array which filters all points in between the slider values
    const filteredData = this.data.filter(item => item.quantity >= minValue && item.quantity <= maxValue);

    // set the new values and labels from this filtered data
    this.values = filteredData.map(item => item.quantity);
    this.labels = filteredData.map(item => item.name);

    // return the values and labels as tuple
    return [this.values, this.labels, filteredData];
  }

  // get the largest quantity inside the data
  getLargestValue(): number {
    // create reference to largest number
    let largest: number = -1;

    // loop through the data and find the largest quantity
    for(let item of this.data) {
      if(item.quantity > largest) {
        largest = item.quantity;
      }
    }
    // return largest value
    return largest;
  }
}
