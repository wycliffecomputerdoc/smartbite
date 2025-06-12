
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  preferences?: {
    dietary: string[];
    favoriteCategories: string[];
    allergies: string[];
  };
  created_at: string;
}

export interface Order {
  id: string;
  user_id?: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  customer_info: {
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  special_instructions?: string;
}

export interface Reservation {
  id: string;
  user_id?: string;
  customer_info: {
    name: string;
    email: string;
    phone: string;
  };
  date: string;
  time: string;
  guests: number;
  special_requests?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

export interface Review {
  id: string;
  user_id?: string;
  customer_name: string;
  rating: number;
  comment: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  sentiment_score?: number;
  order_id?: string;
  created_at: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  dietary: string[];
  rating: number;
  ingredients?: string[];
  allergens?: string[];
  available: boolean;
  created_at: string;
}
