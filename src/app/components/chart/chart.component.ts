import { Component, Input } from '@angular/core';
import { Item } from '../../models/item.model';
import { Chart, registerables } from 'chart.js';
import { ChartDataService } from '../../services/chart-data.service';
import { SliderComponent } from '../slider/slider.component';

Chart.register(...registerables);
@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [SliderComponent],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponent {
  // constructor to inject the chartDataService
  constructor(private chartDataService : ChartDataService) {}

  // Inputting stock from parent trolley page
  @Input() stock : Item[] = [];
  
    // arrays for the values and labels and String for graph type
    values: number[] = [];
    labels: string[] = [];
    chartType: string = "bar";
  
    // declaring chart object and its config to be used for rendering
    config: any = {};
    chart: any = {};
  
    // min and max values for sliders
    minSliderValue: number = 0;
    maxSliderValue: number = 0;
  
    // maximum value to cap the sliders (highest quantity from stock)
    maxValue: number = 0;

    

  ngOnInit() {
      [this.values, this.labels] = this.chartDataService.initializeChartData(this.stock);
      this.maxValue = this.chartDataService.getLargestValue();
      this.maxSliderValue = this.maxValue;
      this.setConfig();
      this.chart = new Chart("chart", this.config);
    }

  // update chart with new values
  updateChart() {
    [this.values, this.labels, this.stock] = this.chartDataService.getDataRange(this.minSliderValue, this.maxSliderValue);
    this.chart.destroy();
    this.setConfig();
    this.chart = new Chart("chart", this.config);
  }

  // set the chart type
  setChartType(event: Event) {
    this.chartType = (event.target as HTMLInputElement).value;
  }

  // setting the configurations for the chart
  setConfig() {
    this.config = {
      // setting chart type
      type: this.chartType,

      data: {
        // setting the labels
        labels: this.labels,
        // setting datasets, only need 1
        datasets: [
          {
            label: "Quantity",
            data: this.values,
            backgroundColour: "blue"
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: {
              font: {
                size: 18 // Change this to your desired font size
              }
            }
          },
          y: {
            ticks: {
              font: {
                size: 18
              }
            }
          }
        }
      }
    };
  }

  // functions to update the min value and max values respectively
  updateMinValue(value: number) {
      this.minSliderValue = value;
  }
  updateMaxValue(value: number) {;
    this.maxSliderValue = value;
  }
}
