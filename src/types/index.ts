// Type definitions for the application

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'supplier' | 'buyer';
  company?: string;
  avatar?: string;
}

export interface Auction {
  id: number;
  title: string;
  description: string;
  material: string;
  category: string;
  quantity: number;
  startDate: string;
  endDate: string;
  startingPrice: number;
  status: string;
  highestBidderId: number | null;
  createdByAdminId: number;
  createdAt: string;
  user: any;
  unit: string;
  location: string;
  currentBid: number;
  images: string[];
}


export interface Bid {
  id: string;
  auctionId: string;
  userId: string;
  username: string;
  amount: number;
  timestamp: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'bid' | 'auction' | 'message';
  message: string;
  read: boolean;
  timestamp: string;
  linkTo?: string;
}