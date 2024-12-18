import { OrderItemsDTO } from './OrderItems';

export interface OrderDTO {
  orderNumber: number; // رقم الطلب
  userId: string; // معرف العميل
  userName: string; // اسم العميل
  orderDate: string; // سيتم تمثيل التاريخ كـ string (ISO format)
  totalAmount: number; // المجموع الكلي
  orderItems: OrderItemsDTO[]; // قائمة عناصر الطلب
}
