import React from 'react';
import AuctionCard from './AuctionCard';
import { Auction } from '../../types';

interface AuctionListProps {
  auctions: Auction[];
  title?: string;
  emptyMessage?: string;
  columns?: 1 | 2 | 3 | 4;
}

const AuctionList: React.FC<AuctionListProps> = ({ 
  auctions, 
  title, 
  emptyMessage = "No auctions found", 
  columns = 3 
}) => {
  const columnConfig = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };
  
  return (
    <div>
      {title && (
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">{title}</h2>
      )}
      
      {auctions.length > 0 ? (
        <div className={`grid ${columnConfig[columns]} gap-4 md:gap-6`}>
          {auctions.map(auction => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
};

export default AuctionList;