import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root', // Ensures the service is available globally in the app
})
export class CartService {
  private cart: any[] = []; // Array to store cart items
  private cartCountSubject = new BehaviorSubject<number>(0);
  private cartTotalSubject = new BehaviorSubject<number>(0);

  cartCount$ = this.cartCountSubject.asObservable();
  cartTotal$ = this.cartTotalSubject.asObservable();
  constructor() {
    if (this.isLocalStorageAvailable()) {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.cart = JSON.parse(savedCart);
        this.updateCartState();
      }
    }
  }

  private isLocalStorageAvailable(): boolean {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  saveCart() {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
  }

  // Add product to the cart
  addToCart(product: any): void {
    this.cart.push(product); // Add the product to the cart array
    this.saveCart(); // Save the updated cart to localStorage
    this.updateCartState();
  }

  // Retrieve the cart items
  getCart(): any[] {
    return this.cart;
  }

  // Optionally, clear the cart
  clearCart(): void {
    this.cart = [];
    this.saveCart();
    this.updateCartState();
  }
  // Remove a product from the cart
  removeFromCart(product: any): void {
    this.cart = this.cart.filter((item) => item.id !== product.id); // Filter out the product
    this.saveCart();
  }
  // Update the quantity of a product in the cart
  updateQuantity(product: any, quantity: number): void {
    const existingProduct = this.cart.find((item) => item.id === product.id);
    if (existingProduct) {
      existingProduct.quantity = quantity;
      this.saveCart();
      this.updateCartState();
    }
  }
  // Get the count of items in the cart
  getCartCount(): number {
    return this.cart.length;
  }

  // Get the total price of the cart
  getCartTotal(): number {
    return this.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }
  private updateCartState() {
    const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = this.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    this.cartCountSubject.next(totalItems);
    this.cartTotalSubject.next(totalPrice);
  }
}
