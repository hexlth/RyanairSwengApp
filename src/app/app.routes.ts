import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TrolleyComponent } from './components/trolley/trolley.component';

export const routes: Routes = [
    {path: "", component: HomeComponent },
    {path: "trolley", component: TrolleyComponent}
];
