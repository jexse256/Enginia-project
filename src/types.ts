export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  specifications: Record<string, string>;
  stock: number;
  rating: number;
  reviews: Review[];
  featured?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  savedForLater?: boolean;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  vat: number;
  discount: number;
  total: number;
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  paymentMethod: 'Mobile Money' | 'Credit/Debit Card' | 'Cash on Delivery' | 'Bank Transfer';
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
  };
  trackingLogs: { time: string; status: string; description: string }[];
}

export interface Notification {
  id: string;
  type: 'promo' | 'alert' | 'order';
  title: string;
  body: string;
  date: string;
  read: boolean;
}

export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  count: number;
}
