
import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { formatCurrency, calculateBidSuggestions } from '../../utils/formatters';
import { hasEnded } from '../../utils/dateUtils';
import { useAuth } from '../../context/AuthContext';
import { useAuctions } from '../../context/AuctionContext';
import axios from 'axios';

interface BidFormProps {
  auctionId: string;
  currentBid: number;
  endDate: string;
  startDate: string;
  onSuccess?: () => void;
}

const BidForm: React.FC<BidFormProps> = ({
  auctionId,
  currentBid,
  endDate,
  startDate,
  onSuccess
}) => {
  const { user, isAuthenticated } = useAuth();
  const { placeBid } = useAuctions();
  const [bidAmount, setBidAmount] = useState<number>(Math.ceil(currentBid * 1.1));
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<any>(null);
  const [autoMax, setAutoMax] = useState<number>(Math.ceil(currentBid * 1.5));
  const [autoHike, setAutoHike] = useState<number>(Math.ceil(currentBid * 0.05));
  const [autobid, setAutobid] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      setUsers(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (autobid) {
      console.log("Auto-bid response received:", autobid);
    }
  }, [autobid]);

  const userData = users;
  const bidSuggestions = calculateBidSuggestions(currentBid);
  const auctionEnded = hasEnded(endDate);
  const auctionStarted = new Date() >= new Date(startDate);

  const formattedEndDate = new Date(endDate).toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });


  const[maxa,setMaxa]=useState()
  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !userData) {
      setError('You must be logged in to place a bid');
      return;
    }

    if (userData.status === 'not_uploaded') {
      setError('Upload your documents to do the bidding');
      return;
    }

    if (userData.status === 'pending') {
      setError('Wait until your documents are verified');
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

      const response = await axios.post(
        `https://metaauction.onrender.com/bids/bid/${payload.userId}/${payload.auctionId}/${payload.bidAmount}`,
        payload,
        { withCredentials: true }
      );
      setMaxa(response.data)

      if (response.status === 200) {
        setSuccess(`Your bid of ${formatCurrency(bidAmount)} was successful!`);
        onSuccess?.();
      } else {
        setError('Failed to place bid. Please try again.');
      }
    } catch (error: any) {
      console.error(error);
      const message =
        error.response?.status === 403
          ? 'Unauthorized to bid. Please log in or verify your account.'
          : 'An error occurred while placing your bid.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(()=>{
    console.log("maaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",{maxa})
  })

  const handleAutoBidSettings = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !userData) {
      setError('You must be logged in to schedule auto-bids');
      return;
    }

    if (userData.status !== 'verified') {
      setError('Your documents must be verified to use auto-bidding');
      return;
    }

    if (autoMax <= currentBid || autoHike <= 0) {
      setError('Enter a valid Max amount (greater than current bid) and positive hike.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        auctionId,
        userId: userData.id,
        maxAmt: autoMax,
        riseAmt: autoHike,
      };

      const response = await axios.post(
        `https://metaauction.onrender.com/bids/auto-bid/setup`,
        payload,
        { withCredentials: true }
      );

      setAutobid(response.data);

      if (response.status === 200) {
        setSuccess('Your auto-bid settings were saved successfully!');
      } else {
        setError('Failed to schedule auto-bid.');
      }
    } catch (err: any) {
      console.error(err);
      const message =
        err.response?.data || 
        (err.response?.status === 403
          ? 'Unauthorized to set auto-bid. Please check your login or verification status.'
          : 'An error occurred while scheduling auto-bid.');
      setError(message);
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

      <div className="text-sm text-gray-600 mb-2">
        Auction ends on: <strong>{formattedEndDate}</strong>
      </div>

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
            disabled={isLoading || !isAuthenticated || userData?.status !== 'verified'}
          />
        </div>

        <div className="mb-4">
          <p className="text-gray-600 mb-2">Suggested Bids:</p>
          <div className="grid grid-cols-3 gap-2">
            {bidSuggestions.map((suggestedBid, index) => (
              <Button
                key={index}
                type="button"
                variant="outline"
                onClick={() => setBidAmount(suggestedBid)}
              >
                {formatCurrency(suggestedBid)}
              </Button>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
          disabled={!isAuthenticated || userData?.status !== 'verified'}
          className="bg-blue-800 text-white hover:bg-blue-700 focus:ring-blue-600"
        >
          Place Bid
        </Button>
      </form>

      {auctionStarted && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Automate Your Bidding</h3>
          <form onSubmit={handleAutoBidSettings}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                label="Max Amount"
                type="number"
                value={autoMax}
                onChange={(e) => setAutoMax(Number(e.target.value))}
                min={currentBid + 1}
                step="1"
                required
              />
              <Input
                label="Hike Amount"
                type="number"
                value={autoHike}
                onChange={(e) => setAutoHike(Number(e.target.value))}
                min={1}
                step="1"
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              disabled={!isAuthenticated || userData?.status !== 'verified'}
              className="bg-blue-800 text-white hover:bg-blue-700 focus:ring-blue-600"
            >
              Automate my Bid
            </Button>
          </form>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p>By placing a bid, you agree to the terms and conditions of this auction.</p>
      </div>
    </div>
  );
};

export default BidForm;



