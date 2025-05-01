import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { formatCurrency, calculateBidSuggestions } from '../../utils/formatters';
import { hasEnded } from '../../utils/dateUtils';
import { useAuth } from '../../context/AuthContext';
import { useAuctions } from '../../context/AuctionContext';
import axios from 'axios'; // 👈 Make sure you have imported axios!
import { useParams } from 'react-router-dom';

interface BidFormProps {
  auctionId: string;
  currentBid: number;
  endDate: string;
  onSuccess?: () => void;
}

const BidForm: React.FC<BidFormProps> = ({
  auctionId,
  currentBid,
  endDate,
  onSuccess
}) => {
  const { user, isAuthenticated } = useAuth();
  const { placeBid } = useAuctions();
  const [bidAmount, setBidAmount] = useState<number>(Math.ceil(currentBid * 1.1));
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();
  
  const userData = localStorage.getItem('userData') 
    ? JSON.parse(localStorage.getItem('userData') as string) 
    : null;

  const bidSuggestions = calculateBidSuggestions(currentBid);
  const auctionEnded = hasEnded(endDate);

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !userData) {
      setError('You must be logged in to place a bid');
      return;
    }

    if (auctionEnded) {
      setError('This auction has ended');
      return;
    }

    if (bidAmount <= currentBid) {
      setError(`Bid must be higher than the current bid ${formatCurrency(currentBid)}`);
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        auctionId,
        bidAmount,
        userId: userData.id,
        username: userData.username,
        email: userData.email,
      };

      console.log('Sending payload:', payload);
      
      // Update the axios URL with the correct endpoint and add any necessary headers for CORS handling
      const response = await axios.post(`https://metaauction.onrender.com/bids/bid/${payload.userId}/${payload.auctionId}/${payload.bidAmount}`, payload, {
        withCredentials: true, // Make sure CORS and credentials are handled correctly
      });
      
      console.log('Response:', response);

      if (response.status === 200) {
        setSuccess(`Your bid of ${formatCurrency(bidAmount)} was successful!`);
        onSuccess?.();
      } else {
        setError('Failed to place bid. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while placing your bid.');
    } finally {
      setIsLoading(false);
    }
  };

  if (auctionEnded) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg text-center">
        <p className="text-gray-700">This auction has ended</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Place Your Bid</h3>

      {!isAuthenticated && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-md mb-4">
          Please login to place a bid on this auction.
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-md mb-4">
          {success}
        </div>
      )}

      <div className="mb-4">
        <p className="text-gray-600 mb-1">Current Bid:</p>
        <p className="text-xl font-bold text-blue-800">{formatCurrency(currentBid)}</p>
      </div>

      <form onSubmit={handleBidSubmit}>
        <div className="mb-4">
          <Input
            label="Your Bid Amount"
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(Number(e.target.value))}
            min={currentBid + 1}
            step="1"
            required
            disabled={isLoading || !isAuthenticated}
          />
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Suggested Bids:</p>
          <div className="flex flex-wrap gap-2">
            {bidSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setBidAmount(suggestion)}
                disabled={isLoading || !isAuthenticated}
              >
                {formatCurrency(suggestion)}
              </Button>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
          disabled={!isAuthenticated}
        >
          Place Bid
        </Button>
      </form>

      <div className="mt-4 text-xs text-gray-500">
        <p>By placing a bid, you agree to the terms and conditions of this auction.</p>
      </div>
    </div>
  );
};

export default BidForm;
