import { Component } from '@angular/core';
import { CartService } from '../../../Services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  cartCount: number = 0;
  cartTotal: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cartCount$.subscribe((count) => {
      this.cartCount = count;
    });

    this.cartService.cartTotal$.subscribe((total) => {
      this.cartTotal = total;
    });
  }
}
