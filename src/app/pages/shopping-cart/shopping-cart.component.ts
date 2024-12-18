import { Component, OnInit } from '@angular/core';
import { CartService } from '../../Services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
})
export class ShoppingCartComponent implements OnInit {
  cartItems: any[] = []; // Array to store cart items

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    // Get cart items from the CartService
    this.cartItems = this.cartService.getCart();
  }

  // Method to handle removing a product from the cart
  removeFromCart(product: any): void {
    this.cartService.removeFromCart(product);
    this.cartItems = this.cartService.getCart(); // Refresh the cart items after removal
  }

  // Method to handle clearing the entire cart
  clearCart(): void {
    this.cartService.clearCart();
    this.cartItems = []; // Clear the local cart items array
  }

  // Method to handle updating the quantity
  updateQuantity(product: any, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(product);
    } else {
      this.cartService.updateQuantity(product, quantity);
      this.cartItems = this.cartService.getCart(); // Refresh the cart items after updating quantity
    }
  }
  // Method to calculate the total price of the cart
  getTotalPrice(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }
}
