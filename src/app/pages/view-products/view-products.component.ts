import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ManageProductService } from '../../Services/manage-product.service';
import { ProductDTO } from '../../DTOs/ProductDTO';
import { CartService } from '../../Services/cart.service';
import { ConfigService } from '../../shared/services/config-service';

@Component({
  selector: 'app-view-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-products.component.html',
  styleUrl: './view-products.component.scss',
})
export class ViewProductsComponent {
  products: ProductDTO[] = []; // Store products here
  public config!: any;
  constructor(
    private productService: ManageProductService,
    private cartService: CartService,
    private configService: ConfigService
  ) {
    this.configService.getConfig().subscribe((config) => {
      this.config = config;
    });
  }

  ngOnInit(): void {
    // Call the service to get all products when the component is initialized
    this.productService.getAllVisibleProducts().subscribe(
      (data) => {
        this.products = data; // Assign data to products
      },
      (error) => {
        console.error('Error fetching products', error);
      }
    );
  }

  // Method to handle adding product to cart
  addToCart(product: ProductDTO): void {
    product.quantity = 1;
    this.cartService.addToCart(product); // Use CartService to add the product to the cart
  }
}
