import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TrolleyComponent } from './trolley/trolley.component';

export const routes: Routes = [
    {path: "", component: HomeComponent },
    {path: "trolley", component: TrolleyComponent}
];
