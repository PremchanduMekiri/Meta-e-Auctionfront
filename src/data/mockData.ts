import { Auction, User, Category, Notification } from '../types';

// Mock Categories
export const categories: Category[] = [
  { id: '1', name: 'Metals', icon: 'tool' },
  { id: '2', name: 'Plastics', icon: 'flask' },
  { id: '3', name: 'Electronics', icon: 'cpu' },
  { id: '4', name: 'Automotive', icon: 'car' },
  { id: '5', name: 'Construction', icon: 'hard-hat' },
  { id: '6', name: 'Textiles', icon: 'scissors' }
];

// Mock Users
export const users: User[] = [
  {
    id: '1',
    username: 'metalscrap',
    email: 'supplier@metalscrap.com',
    role: 'supplier',
    company: 'Metal Reclaim Industries',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '2',
    username: 'greenrecycle',
    email: 'buyer@greenrecycle.com',
    role: 'buyer',
    company: 'Green Recycling Co.',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150'
  }
];

// Generate random end dates (between 1 and 14 days from now)
const getRandomEndDate = () => {
  const today = new Date();
  const daysToAdd = Math.floor(Math.random() * 14) + 1;
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + daysToAdd);
  return endDate.toISOString();
};

// Mock Auctions
export const auctions: Auction[] = [
  {
    id: '1',
    title: 'Industrial Aluminum Scrap - High Grade',
    description: 'High-quality aluminum scrap from manufacturing facility. Clean and sorted. Ideal for recycling and repurposing into new products.',
    material: 'Aluminum',
    category: '1',
    quantity: 500,
    unit: 'kg',
    location: 'Detroit, MI',
    startingPrice: 1200,
    currentBid: 1550,
    startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: getRandomEndDate(),
    images: [
      'https://images.pexels.com/photos/2547565/pexels-photo-2547565.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/693017/pexels-photo-693017.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    sellerId: '1',
    sellerName: 'Metal Reclaim Industries',
    status: 'active',
    featured: true,
    bids: [
      { id: 'b1', auctionId: '1', userId: '2', username: 'greenrecycle', amount: 1300, timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'b2', auctionId: '1', userId: '2', username: 'greenrecycle', amount: 1550, timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: '2',
    title: 'Copper Wire Scrap - 99% Pure',
    description: 'Pure copper wire scrap from electrical installations. Clean and stripped of insulation. High conductivity and purity.',
    material: 'Copper',
    category: '1',
    quantity: 200,
    unit: 'kg',
    location: 'Phoenix, AZ',
    startingPrice: 2000,
    currentBid: 2200,
    startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: getRandomEndDate(),
    images: [
      'https://images.pexels.com/photos/2881232/pexels-photo-2881232.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    sellerId: '1',
    sellerName: 'Metal Reclaim Industries',
    status: 'active',
    featured: true,
    bids: [
      { id: 'b3', auctionId: '2', userId: '2', username: 'greenrecycle', amount: 2100, timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'b4', auctionId: '2', userId: '2', username: 'greenrecycle', amount: 2200, timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: '3',
    title: 'Electronic PCB Scrap - Mixed Grade',
    description: 'Printed circuit boards from various electronic devices. Contains valuable metals including gold, silver, and copper. Mixed quality.',
    material: 'PCB',
    category: '3',
    quantity: 150,
    unit: 'kg',
    location: 'San Jose, CA',
    startingPrice: 3000,
    currentBid: 3500,
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: getRandomEndDate(),
    images: [
      'https://images.pexels.com/photos/3971985/pexels-photo-3971985.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3846033/pexels-photo-3846033.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    sellerId: '1',
    sellerName: 'Metal Reclaim Industries',
    status: 'active',
    featured: false,
    bids: [
      { id: 'b5', auctionId: '3', userId: '2', username: 'greenrecycle', amount: 3200, timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'b6', auctionId: '3', userId: '2', username: 'greenrecycle', amount: 3500, timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: '4',
    title: 'Stainless Steel Scrap - Industrial Grade',
    description: 'High-quality stainless steel scrap from manufacturing. Low carbon content, excellent for recycling into new stainless steel products.',
    material: 'Stainless Steel',
    category: '1',
    quantity: 1000,
    unit: 'kg',
    location: 'Pittsburgh, PA',
    startingPrice: 1800,
    currentBid: 2100,
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: getRandomEndDate(),
    images: [
      'https://images.pexels.com/photos/3802602/pexels-photo-3802602.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    sellerId: '1',
    sellerName: 'Metal Reclaim Industries',
    status: 'active',
    featured: true,
    bids: [
      { id: 'b7', auctionId: '4', userId: '2', username: 'greenrecycle', amount: 1900, timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'b8', auctionId: '4', userId: '2', username: 'greenrecycle', amount: 2100, timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: '5',
    title: 'Plastic HDPE Scrap - Post-Industrial',
    description: 'Clean HDPE plastic scrap from manufacturing process. Uncontaminated and ready for processing. Suitable for various recycling applications.',
    material: 'HDPE Plastic',
    category: '2',
    quantity: 800,
    unit: 'kg',
    location: 'Houston, TX',
    startingPrice: 600,
    currentBid: 750,
    startDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: getRandomEndDate(),
    images: [
      'https://images.pexels.com/photos/802221/pexels-photo-802221.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    sellerId: '1',
    sellerName: 'Metal Reclaim Industries',
    status: 'active',
    featured: false,
    bids: [
      { id: 'b9', auctionId: '5', userId: '2', username: 'greenrecycle', amount: 650, timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'b10', auctionId: '5', userId: '2', username: 'greenrecycle', amount: 750, timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: '6',
    title: 'Automotive Catalytic Converters - Mixed Lot',
    description: 'Used catalytic converters from various vehicle makes. Contains valuable platinum group metals. Sold as-is in current condition.',
    material: 'Catalytic Converters',
    category: '4',
    quantity: 50,
    unit: 'pieces',
    location: 'Chicago, IL',
    startingPrice: 5000,
    currentBid: 5500,
    startDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: getRandomEndDate(),
    images: [
      'https://images.pexels.com/photos/3807319/pexels-photo-3807319.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    sellerId: '1',
    sellerName: 'Metal Reclaim Industries',
    status: 'active',
    featured: false,
    bids: [
      { id: 'b11', auctionId: '6', userId: '2', username: 'greenrecycle', amount: 5200, timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'b12', auctionId: '6', userId: '2', username: 'greenrecycle', amount: 5500, timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  }
];

// Mock Notifications
export const notifications: Notification[] = [
  {
    id: 'n1',
    userId: '2',
    type: 'bid',
    message: 'You have been outbid on "Industrial Aluminum Scrap"',
    read: false,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    linkTo: '/auction/1'
  },
  {
    id: 'n2',
    userId: '1',
    type: 'auction',
    message: 'Your auction "Copper Wire Scrap" has a new bid',
    read: true,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    linkTo: '/auction/2'
  },
  {
    id: 'n3',
    userId: '2',
    type: 'message',
    message: 'New message from Metal Reclaim Industries',
    read: false,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }
];