/**
 * Types & Interfaces for Alike-ND E-Commerce Platform
 */

export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  mrp: number;
  rating: number;
  reviewsCount: number;
  image: string;
  images?: string[];
  category: string;
  badge?: 'SALE' | 'HOT' | 'NEW' | 'TRENDING' | 'LIMITED';
  description: string;
  specifications: Record<string, string>;
  isWholesale?: boolean;
  wholesaleMinQty?: number;
  wholesalePrice?: number;
  colors?: string[];
  sizes?: string[];
}

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: 'Full-time' | 'Part-time' | 'Remote';
  logo: string;
  description: string;
  requirements: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  delivery: number;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  address: Address;
  paymentMethod: string;
  trackingStep: number; // 1: Order Placed, 2: Processing, 3: Shipped, 4: Delivered
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'contact';
  timestamp: string;
  attachment?: {
    name: string;
    url: string;
  };
  image?: string;
  isSending?: boolean;
  isDelivered?: boolean;
}

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  messages: Message[];
  isBlocked?: boolean;
  isMuted?: boolean;
}

export interface Notification {
  id: string;
  type: 'order' | 'promotion' | 'system';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
}

export interface WalletTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
}
