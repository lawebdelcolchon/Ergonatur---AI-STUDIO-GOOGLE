

export interface ProductImage {
  src: string;
  alt: string;
  associatedColor?: string;
}

export interface RelatedProduct {
  id: number | string;
  name: string;
  price: number;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
  description: string;
  images: ProductImage[];
  colors: string[]; // Hex codes
  legsOptions: string[];
  sizes: string[];
}

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

export interface CartItem {
  uniqueId: string; // Composite ID for variants
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
  selectedLegs: string;
}

export type PaymentMethod = 'credit_card' | 'paypal' | 'bizum' | 'cod' | 'pickup';

export interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  identityDocument: string; // DNI/ID
  address: string;
  city: string;
  zipCode: string;
  country: string;
  
  // Payment Fields
  paymentMethod: PaymentMethod;
  cardName?: string;
  cardNumber?: string;
  expDate?: string;
  cvc?: string;
  bizumPhone?: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  phone?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: CartItem[];
  shippingAddress: string;
  paymentMethod: PaymentMethod;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  avatar?: string;
  verified: boolean;
}