import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Auction, Bid } from '../types';
import { auctions as mockAuctions } from '../data/mockData';

interface AuctionContextType {
  auctions: Auction[];
  featuredAuctions: Auction[];
  getAuctionById: (id: string) => Auction | undefined;
  searchAuctions: (query: string, filters: AuctionFilters) => Auction[];
  placeBid: (auctionId: string, userId: string, username: string, amount: number) => Promise<boolean>;
  createAuction: (auction: Omit<Auction, 'id' | 'bids'>) => Promise<boolean>;
}

export interface AuctionFilters {
  category?: string;
  material?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  status?: 'active' | 'pending' | 'closed';
}

const AuctionContext = createContext<AuctionContextType | undefined>(undefined);

export const AuctionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [auctions, setAuctions] = useState<Auction[]>(mockAuctions);

  const featuredAuctions = auctions.filter(auction => auction.featured && auction.status === 'active');
  
  const getAuctionById = (id: string) => {
    return auctions.find(auction => auction.id === id);
  };

  const searchAuctions = (query: string, filters: AuctionFilters) => {
    return auctions.filter(auction => {
      // Search by query
      const matchesQuery = query 
        ? auction.title.toLowerCase().includes(query.toLowerCase()) || 
          auction.description.toLowerCase().includes(query.toLowerCase()) ||
          auction.material.toLowerCase().includes(query.toLowerCase())
        : true;
      
      // Apply filters
      const matchesCategory = filters.category ? auction.category === filters.category : true;
      const matchesMaterial = filters.material ? auction.material.toLowerCase().includes(filters.material.toLowerCase()) : true;
      const matchesMinPrice = filters.minPrice ? auction.currentBid >= filters.minPrice : true;
      const matchesMaxPrice = filters.maxPrice ? auction.currentBid <= filters.maxPrice : true;
      const matchesLocation = filters.location ? auction.location.toLowerCase().includes(filters.location.toLowerCase()) : true;
      const matchesStatus = filters.status ? auction.status === filters.status : true;
      
      return matchesQuery && matchesCategory && matchesMaterial && 
             matchesMinPrice && matchesMaxPrice && matchesLocation && matchesStatus;
    });
  };

  const placeBid = async (auctionId: string, userId: string, username: string, amount: number): Promise<boolean> => {
    try {
      // In a real app, we would make an API call here
      const auctionIndex = auctions.findIndex(a => a.id === auctionId);
      
      if (auctionIndex === -1) return false;
      if (auctions[auctionIndex].currentBid >= amount) return false;
      
      const newBid: Bid = {
        id: `bid-${Date.now()}`,
        auctionId,
        userId,
        username,
        amount,
        timestamp: new Date().toISOString()
      };
      
      const updatedAuction = {
        ...auctions[auctionIndex],
        currentBid: amount,
        bids: [...auctions[auctionIndex].bids, newBid]
      };
      
      const updatedAuctions = [...auctions];
      updatedAuctions[auctionIndex] = updatedAuction;
      
      setAuctions(updatedAuctions);
      return true;
    } catch (error) {
      console.error("Bid error:", error);
      return false;
    }
  };

  const createAuction = async (auctionData: Omit<Auction, 'id' | 'bids'>): Promise<boolean> => {
    try {
      // In a real app, we would make an API call here
      const newAuction: Auction = {
        ...auctionData,
        id: `auction-${Date.now()}`,
        bids: [],
      };
      
      setAuctions([...auctions, newAuction]);
      return true;
    } catch (error) {
      console.error("Create auction error:", error);
      return false;
    }
  };

  return (
    <AuctionContext.Provider value={{ 
      auctions, 
      featuredAuctions,
      getAuctionById, 
      searchAuctions, 
      placeBid,
      createAuction
    }}>
      {children}
    </AuctionContext.Provider>
  );
};

export const useAuctions = () => {
  const context = useContext(AuctionContext);
  if (context === undefined) {
    throw new Error('useAuctions must be used within an AuctionProvider');
  }
  return context;
};