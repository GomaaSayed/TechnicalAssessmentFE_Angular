import { BaseDTO } from './BaseDTO';

export interface ProductDTO extends BaseDTO {
  name: string;
  description: string;
  price: number;
  quantity: number;
  isVisible: boolean;
  imageUrl: string;
  categoryId: string;
  categoryName?: string;
}
