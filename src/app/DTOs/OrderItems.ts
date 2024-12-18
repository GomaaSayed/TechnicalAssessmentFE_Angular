import { BaseDTO } from './BaseDTO';

export interface OrderItemsDTO extends BaseDTO {
  orderId: string;
  orderNumber: number;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
