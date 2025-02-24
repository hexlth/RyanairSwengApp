import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { NgxSliderModule, Options} from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [NgxSliderModule],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css',
})
export class SliderComponent {
  // the min and max values for slider
  @Input() minValue: number = 0;
  @Input() maxValue: number = 0;

  // input the cap (i.e largest value) from the parent and title of slider
  @Input() cap: number = 0;

  // input a title and a value to be displayed by slider
  @Input() title: string = "";

  // define output to output value back to parent
  @Output() minChange = new EventEmitter<number>();
  @Output() maxChange = new EventEmitter<number>();

  // created options for ngx-slider (used to initialize ngx-slider)
  options!: Options;

  ngOnInit() {
    // Initialize options using the correct cap value
    this.options = {
      floor: 0,
      ceil: this.cap,
      step: 1,
    };
  }

  // output min value back to component
  onMinChange(value: number) {
    this.minChange.emit(value);
  }

  // output max value back to component
  onMaxChange(value: number) {
    this.maxChange.emit(value);
  }
}
