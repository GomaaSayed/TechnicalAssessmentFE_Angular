import { Component } from '@angular/core';
import { ViewProductsComponent } from '../view-products/view-products.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ViewProductsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
