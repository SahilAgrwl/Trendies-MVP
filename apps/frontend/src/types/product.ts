export interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  imageUrl: string;
  sellerName: string;
  sellerEmail: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  productId: number;
  buyerName: string;
  paymentMethod: string;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
} 