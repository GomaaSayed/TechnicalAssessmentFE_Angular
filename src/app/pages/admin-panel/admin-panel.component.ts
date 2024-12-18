import { Component } from '@angular/core';
import { ProductDTO } from '../../DTOs/ProductDTO';
import { FormBuilder, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ManageProductService } from '../../Services/manage-product.service';
import { CategoryDTO } from '../../DTOs/CategoryDTO';
import { ConfigService } from '../../shared/services/config-service';
import { AlertComponent } from '../../shared/Components/alert/alert.component';
declare const bootstrap: any; // Declare Bootstrap globally for Modals

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, AlertComponent],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss',
})
export class AdminPanelComponent {
  products: ProductDTO[] = []; // Array to hold products
  editingProductId: string | null = null; // Track the product being edited
  newProduct: boolean = false; // Flag for adding new product
  public config!: any;
  categories: CategoryDTO[] = []; // List of categories
  selectedProduct: ProductDTO | null = null; // Product selected for edit
  isEditMode = false; // Track if it's edit mode
  productIdToDelete: string | null = null; // ID of the product to delete
  alertMessage: string = ''; // الرسالة التي سيتم عرضها
  alertType: 'success' | 'danger' | 'warning' | 'info' = 'success'; // نوع التنبيه
  isVisible: boolean = true;
  constructor(
    private fb: FormBuilder,
    private productService: ManageProductService,
    private configService: ConfigService
  ) {
    this.configService.getConfig().subscribe((config) => {
      this.config = config;
    });
  }

  ngOnInit(): void {
    this.getCategories(); // Get categories on initialization
    this.getProducts(); // Load produ cts on initialization
  }
  // Fetch all categories from the service
  getCategories() {
    this.productService.getCategories().subscribe(
      (data: CategoryDTO[]) => {
        this.categories = data;
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }
  // Fetch all products from the service
  getProducts() {
    this.productService.getAllProducts().subscribe(
      (data) => {
        this.products = data;
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }
  // Handle inline adding of a new product
  addProductInline(): void {
    const newProduct: ProductDTO = {
      id: (this.products.length + 1).toString(),
      name: '',
      description: '',
      price: 0,
      quantity: 0,
      isVisible: true,
      imageUrl: 'images/products/test-product.JPG',
      categoryId: '',
    };
    this.products.push(newProduct);
    this.editingProductId = newProduct.id;
    this.newProduct = true;
  }

  // Handle inline editing of an existing product
  editProductInline(productId: string): void {
    this.editingProductId = productId;
    this.newProduct = false;
  }

  // Save changes after inline editing
  saveProductInline(productId: string): void {
    debugger;
    const product = this.products.find((p) => p.id === productId);

    if (product) {
      // Validation checks for product fields
      if (!product.name || product.name.trim() === '') {
        this.showAlert('Product name is required!', 'danger');
        return; // Stop further execution
      }

      if (!product.description || product.description.trim() === '') {
        this.showAlert('Product description is required!', 'danger');
        return; // Stop further execution
      }

      if (!product.price || isNaN(product.price) || product.price <= 0) {
        this.showAlert(
          'Product price is required and must be greater than 0!',
          'danger'
        );
        return; // Stop further execution
      }

      if (
        !product.quantity ||
        isNaN(product.quantity) ||
        product.quantity <= 0
      ) {
        this.showAlert(
          'Product quantity is required and must be greater than 0!',
          'danger'
        );
        return; // Stop further execution
      }

      if (!product.categoryId || product.categoryId.trim() === '') {
        this.showAlert('Product category is required!', 'danger');
        return; // Stop further execution
      }

      // Proceed with saving the product if all validations pass
      if (!this.newProduct) {
        // Update product
        this.productService
          .updateProduct({ ...this.selectedProduct, ...product })
          .subscribe(
            (response) => {
              if (response.message === 'OK') {
                this.showAlert('Saved successfully!', 'success');
                this.getProducts();
              } else {
                this.showAlert(response.message, 'danger');
              }
            },
            (error) => {
              this.showAlert('Error updating product!', 'danger');
            }
          );
      } else {
        // Add product
        product.id = '00000000-0000-0000-0000-000000000000'; // Set default ID for new products
        this.productService.addProduct(product).subscribe(
          (response) => {
            if (response.message === 'OK') {
              this.showAlert('Saved successfully!', 'success');
              this.getProducts();
            } else {
              this.showAlert(response.message, 'danger');
            }
          },
          (error) => {
            this.showAlert('Error adding product!', 'danger');
          }
        );
      }

      this.editingProductId = null; // Close editing mode
    }
  }

  // Cancel inline editing
  cancelEdit(productId: string): void {
    this.editingProductId = null; // Close editing mode
    if (this.newProduct) {
      this.products = this.products.filter((p) => p.id !== productId); // Remove the new product if canceled
    }
  }
  confirmDelete(productId: string) {
    debugger;
    this.productIdToDelete = productId;
    const modal = new bootstrap.Modal(
      document.getElementById('deleteConfirmModal')!
    );
    modal.show();
  }
  deleteProduct() {
    if (this.productIdToDelete) {
      this.productService
        .deleteProduct(this.productIdToDelete)
        .subscribe((response) => {
          if (response) {
            if (response.message == 'OK') {
              this.showAlert('deleted successfully!', 'success');
              this.getProducts();
            } else {
              this.showAlert(response.message, 'danger');
            }
          } else {
            this.showAlert('Error at delete product!', 'danger');
          }
        });
      this.productIdToDelete = null;
      this.closeModal('deleteConfirmModal'); // إخفاء المودال بعد الحذف
    }
  }
  // Close modal by ID
  closeModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    const modalInstance = bootstrap.Modal.getInstance(modalElement!);
    modalInstance?.hide();
  }
  // دالة لعرض التنبيه
  showAlert(message: string, type: 'success' | 'danger' | 'warning' | 'info') {
    this.alertMessage = message;
    this.alertType = type;

    // إعادة ضبط الرسالة بعد وقت معين
    setTimeout(() => {
      this.alertMessage = '';
    }, 3000);
  }
}
