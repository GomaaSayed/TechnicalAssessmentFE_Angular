import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductDTO } from '../DTOs/ProductDTO';
import { Observable } from 'rxjs';
import { CategoryDTO } from '../DTOs/CategoryDTO';
import { ConfigService } from '../shared/services/config-service';

@Injectable({
  providedIn: 'root',
})
export class ManageProductService {
  private config: any;
  constructor(
    private http: HttpClient,
    private configService: ConfigService // Inject ConfigService
  ) {
    this.configService.getConfig().subscribe((config) => {
      this.config = config;
    });
  }

  // إضافة منتج
  addProduct(product: ProductDTO): Observable<any> {
    console.log(product);
    return this.http.post(`${this.config.baseUrl}Product/AddProduct`, product);
  }

  // تحديث منتج
  updateProduct(product: ProductDTO): Observable<any> {
    return this.http.post(
      `${this.config.baseUrl}Product/UpdateProduct`,
      product
    );
  }

  // الحصول على جميع المنتجات
  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.config.baseUrl}Product/GetAllProducts`);
  }

  // الحصول على جميع المنتجات
  getAllVisibleProducts(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.config.baseUrl}Product/GetAllVisibleProduct`
    );
  }

  // الحصول على منتج بناءً على ProductId
  getProductById(productId: string): Observable<any> {
    return this.http.get<any>(
      `${this.config.baseUrl}Product/GetByProductId/${productId}`
    );
  }

  // حذف منتج
  deleteProduct(productId: string): Observable<any> {
    return this.http.delete(
      `${this.config.baseUrl}Product/DeleteProduct/${productId}`
    );
  }
  // Get all categories
  getCategories(): Observable<CategoryDTO[]> {
    return this.http.get<CategoryDTO[]>(
      this.config.baseUrl + 'Product/GetAllCategories'
    );
  }
}
