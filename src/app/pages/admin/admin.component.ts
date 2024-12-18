import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ManageProductService } from '../../Services/manage-product.service';
import { ProductDTO } from '../../DTOs/ProductDTO';
import { CommonModule } from '@angular/common';
import { CategoryDTO } from '../../DTOs/CategoryDTO';
import { AlertComponent } from '../../shared/Components/alert/alert.component';
import { ConfigService } from '../../shared/services/config-service';
declare const bootstrap: any; // Declare Bootstrap globally for Modals
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AlertComponent, FormsModule],

  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  public config!: any;
  products: ProductDTO[] = []; // List of products
  categories: CategoryDTO[] = []; // List of categories
  selectedProduct: ProductDTO | null = null; // Product selected for edit
  productForm!: FormGroup; // Form for adding/editing products
  isEditMode = false; // Track if it's edit mode
  productIdToDelete: string | null = null; // ID of the product to delete
  alertMessage: string = ''; // الرسالة التي سيتم عرضها
  alertType: 'success' | 'danger' | 'warning' | 'info' = 'success'; // نوع التنبيه
  isVisible: boolean = true;

  constructor(
    private productService: ManageProductService,
    private fb: FormBuilder,
    private configService: ConfigService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(0)]],
      isVisible: [true],
      imageUrl: [''],
      categoryId: ['', Validators.required],
    });
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

  // Open the product modal for Add or Edit
  openProductModal(mode: 'add' | 'edit', product?: ProductDTO) {
    debugger;
    this.isEditMode = mode === 'edit';
    if (this.isEditMode && product) {
      console.log('for edit ' + product);
      this.selectedProduct = product;
      this.productForm.patchValue(product);
    } else {
      this.selectedProduct = null;
      this.productForm.reset();
    }

    const modal = new bootstrap.Modal(document.getElementById('productModal')!);
    modal.show();
  }

  // Add or update the product
  saveProduct() {
    debugger;
    if (this.productForm.valid) {
      const product: ProductDTO = this.productForm.value;
      product.imageUrl = 'images/products/test-product.JPG';
      product.isVisible =
        product.isVisible === null ? false : product.isVisible;
      console.log(product);
      if (this.isEditMode && this.selectedProduct) {
        // Update product
        this.productService
          .updateProduct({ ...this.selectedProduct, ...product })
          .subscribe(
            (response) => {
              if (response.message == 'OK') {
                this.showAlert('Saved successfully!', 'success');
                this.getProducts();
                this.closeModal('productModal');
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
        this.productService.addProduct(product).subscribe(
          (response) => {
            if (response.message == 'OK') {
              this.showAlert('Saved successfully!', 'success');
              this.getProducts();
              this.closeModal('productModal');
            } else {
              this.showAlert(response.message, 'danger');
            }
          },
          (error) => {
            this.showAlert('Error!', 'danger');
          }
        );
      }
    }
  }

  // Handle file upload for the image
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.productForm.patchValue({ imageUrl: file.name });
    }
  }

  // Close modal by ID
  closeModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    const modalInstance = bootstrap.Modal.getInstance(modalElement!);
    modalInstance?.hide();
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
