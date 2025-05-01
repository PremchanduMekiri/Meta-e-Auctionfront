import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Tag } from 'lucide-react';
import Card from '../ui/Card';
import { Auction } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { formatTimeRemaining, isEndingSoon } from '../../utils/dateUtils';

interface AuctionCardProps {
  auction: Auction;
  size?: 'sm' | 'md' | 'lg';
}

const AuctionCard: React.FC<AuctionCardProps> = ({ auction, size = 'md' }) => {
  const { 
    id, title, material, location, currentBid, 
    images, endDate, featured 
  } = auction;
  
  const timeRemaining = formatTimeRemaining(endDate);
  const endingSoon = isEndingSoon(endDate);
  
  // Card sizing config
  const sizeConfig = {
    sm: {
      height: 'h-36',
      imageSize: 'h-36 w-36',
      titleClass: 'text-sm line-clamp-1',
      infoClass: 'text-xs',
      padding: 'p-3'
    },
    md: {
      height: 'h-48',
      imageSize: 'h-48 w-48',
      titleClass: 'text-base line-clamp-2',
      infoClass: 'text-sm',
      padding: 'p-4'
    },
    lg: {
      height: 'h-60',
      imageSize: 'h-60 w-60',
      titleClass: 'text-lg line-clamp-2',
      infoClass: 'text-base',
      padding: 'p-5'
    }
  };
  
  const config = sizeConfig[size];
  
  return (
    <Link to={`/auction/${id}`}>
      <Card 
        className={`flex overflow-hidden ${config.height} h-full group transition-all duration-300`}
        hoverEffect={true}
        padding="none"
      >
        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-0 left-0 bg-amber-600 text-white z-10 px-2 py-1 text-xs font-semibold">
            Featured
          </div>
        )}
        
        {/* Image */}
        <div className={`${config.imageSize} min-w-[33%] relative overflow-hidden`}>
          <img 
            src={images[0]} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Ending soon badge */}
          {endingSoon && (
            <div className="absolute bottom-0 left-0 right-0 bg-red-600 text-white text-center py-1 text-xs font-semibold">
              Ending Soon
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className={`flex-1 flex flex-col justify-between ${config.padding}`}>
          <div>
            <h3 className={`font-medium ${config.titleClass} text-gray-900`}>
              {title}
            </h3>
            
            <div className={`flex items-center mt-2 text-gray-500 ${config.infoClass}`}>
              <Tag className="h-3.5 w-3.5 mr-1" />
              <span>{material}</span>
            </div>
            
            <div className={`flex items-center mt-1 text-gray-500 ${config.infoClass}`}>
              <MapPin className="h-3.5 w-3.5 mr-1" />
              <span>{location}</span>
            </div>
          </div>
          
          <div className="mt-2">
            <div className={`flex items-center justify-between ${config.infoClass}`}>
              <div className="flex items-center text-amber-600">
                <Clock className="h-3.5 w-3.5 mr-1" />
                <span>{timeRemaining}</span>
              </div>
            </div>
            
            <div className="mt-2 flex items-center justify-between">
              <span className="text-gray-700 font-semibold">Current Bid:</span>
              <span className="text-blue-800 font-bold">{formatCurrency(currentBid)}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default AuctionCard;