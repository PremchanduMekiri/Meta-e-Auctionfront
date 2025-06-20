import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { formatCurrency, calculateBidSuggestions } from '../../utils/formatters';
import { hasEnded } from '../../utils/dateUtils';
import { useAuth } from '../../context/AuthContext';
import { useAuctions } from '../../context/AuctionContext';
import axios from 'axios';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/solid'; 

interface BidFormProps {
  auctionId: string;
  currentBid: number;
  endDate: string;
  startDate: string;
  onSuccess?: () => void;
  auctionName?: string;
  auctionDescription?: string;
  auctionStatus?: string;
  hasAutoBid?: boolean;
  bidStatus?: string; // New prop
}

const BidForm: React.FC<BidFormProps> = ({
  auctionId,
  currentBid,
  endDate,
  startDate,
  onSuccess,
  auctionName,
  auctionDescription,
  auctionStatus,
  hasAutoBid = false,
  bidStatus,
}) => {
  const { user, isAuthenticated } = useAuth();
  
  const [liveHighestBid, setLiveHighestBid] = useState<number>(currentBid);
  const [userHighestBid, setUserHighestBid] = useState<number | null>(null);
  const [totalBids, setTotalBids] = useState<number>(0);
  const { placeBid } = useAuctions();
  const [bidAmount, setBidAmount] = useState<number>(Math.ceil(liveHighestBid * 1.1));
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<any>(null);
  const [autoMax, setAutoMax] = useState<number>(Math.ceil(liveHighestBid * 1.5));
  const [autoHike, setAutoHike] = useState<number>(Math.ceil(liveHighestBid * 0.05));
  const [autobid, setAutobid] = useState<any | null>(null);
  const [maxa, setMaxa] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      setUsers(JSON.parse(storedUser));
    }
  }, []);

useEffect(() => {
  if (!users?.id || !auctionId) return;

  const fetchUserHighestBid = () => {
    axios
      .get<{ bidAmount: number | string }[]>(
        `https://meta-e-auction.infororg.com/bids/getBids/${users.id}/${auctionId}`,
        { withCredentials: true }
      )
      .then((res) => {
        const amounts = res.data.map(b => Number(b.bidAmount));
        const highest = amounts.length ? Math.max(...amounts) : null;
        setUserHighestBid(highest);
      })
      .catch((err) => {
        console.error('Error fetching user bids:', err);
        setUserHighestBid(null);
      });
  };

  fetchUserHighestBid(); // initial fetch

  const interval = setInterval(fetchUserHighestBid, 2000); // refresh every 2 seconds

  return () => clearInterval(interval); // cleanup on unmount or dependency change
}, [users?.id, auctionId]);



  // Update manual bid amount when live highest bid changes
  useEffect(() => {
    setBidAmount(Math.ceil(liveHighestBid * 1.1));
  }, [liveHighestBid]);

  useEffect(() => {
    const fetchLiveBids = async () => {
      try {
        const res = await axios.get<{ bidAmount: number }[]>(
          `https://meta-e-auction.infororg.com/bids/getAllBids/${auctionId}`,
          { withCredentials: true }
        );
        const bids = res.data || [];
        const highest = bids.length > 0 ? Math.max(...bids.map(b => b.bidAmount)) : currentBid;
        setLiveHighestBid(highest);
        setTotalBids(bids.length);
      } catch (err) {
        console.error("Error fetching bids:", err);
      }
    };

    fetchLiveBids();
    const interval = setInterval(fetchLiveBids, 2000);
    return () => clearInterval(interval);
  }, [auctionId]);

  const bidSuggestions = calculateBidSuggestions(liveHighestBid);
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

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !users) {
      setError('You must be logged in to place a bid');
      return;
    }

    if (users.status === 'not_uploaded') {
      setError('Upload your documents to do the bidding');
      return;
    }

    if (users.status === 'pending') {
      setError('Wait until your documents are verified');
      return;
    }

    if (auctionEnded) {
      setError('This auction has ended');
      return;
    }

    if (bidAmount <= liveHighestBid) {
      setError(`Bid must be higher than the current bid ${formatCurrency(liveHighestBid)}`);
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        auctionId,
        bidAmount,
        userId: users.id,
        username: users.username,
        email: users.email,
      };

      const response = await axios.post(
        `https://meta-e-auction.infororg.com/bids/bid/${payload.userId}/${payload.auctionId}/${payload.bidAmount}`,
        payload,
        { withCredentials: true }
      );
      setMaxa(response.data);

      if (response.status === 200) {
        setSuccess(`Your bid of ${formatCurrency(bidAmount)} was successful!`);
        onSuccess?.();
      } else {
        setError('Failed to place bid. Please try again.');
      }
    } catch (error: any) {
      console.error('Bid error:', error);
      const message =
        error.response?.status === 403
          ? 'Unauthorized to bid. Please log in or verify your account.'
          : error.response?.data?.message || 'An error occurred while placing your bid.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

const handleAutoBidSetup = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!isAuthenticated || !users) {
    setError('You must be logged in to schedule auto-bids');
    return;
  }

  if (users.status !== 'verified') {
    setError('Your documents must be verified to use auto-bidding');
    return;
  }

  if (autoMax <= liveHighestBid) {
    setError('Max amount must be greater than the current bid.');
    return;
  }

  if (autoHike <= 0) {
    setError('Hike amount must be positive.');
    return;
  }

  setIsLoading(true);
  setError('');
  setSuccess('');

  try {
    const payload = {
      auctionId,
      userId: users.id,
      maxAmt: autoMax,
      riseAmt: autoHike,
    };

    console.log('Auto-bid setup payload:', payload);

    const response = await axios.post(
      'https://meta-e-auction.infororg.com/bids/auto-bid/setup',
      payload,
      { withCredentials: true }
    );

    // Only update success message if POST request is successful
    if (response.status === 200 || response.status === 201) {
      setAutobid(response.data);
      setSuccess('Your auto-bid settings were saved successfully!');
      setAutoMax(response.data.maxAmt || Math.ceil(liveHighestBid * 1.2));
      setAutoHike(response.data.riseAmt || Math.ceil(liveHighestBid * 0.05));
    } else {
      setError('Failed to set up auto-bid. Please try again.');
    }
  } catch (err: any) {
    console.error('Auto-bid setup error:', err.response?.data);
    const message =
      err.response?.status === 400 && err.response?.data?.message?.includes('auto-bid already exists')
        ? 'An auto-bid already exists for this auction. Please use the edit form to update your auto-bid.'
        : err.response?.data?.message ||
          (err.response?.status === 403
            ? 'Unauthorized to set auto-bid. Please check your login or verification status.'
            : 'An error occurred while setting up auto-bid.');
    setError(message);
  } finally {
    setIsLoading(false);
  }
};

const handleAutoBidUpdate = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!isAuthenticated || !users) {
    setError('You must be logged in to update auto-bids');
    return;
  }

  if (users.status !== 'verified') {
    setError('Your documents must be verified to use auto-bidding');
    return;
  }

  if (autoMax <= liveHighestBid) {
    setError('Max amount must be greater than the current bid.');
    return;
  }

  if (autoHike <= 0) {
    setError('Hike amount must be positive.');
    return;
  }

  setIsLoading(true);
  setError('');
  setSuccess('');

  try {
    const payload = {
      auctionId,
      userId: users.id,
      maxAmt: autoMax,
      riseAmt: autoHike,
    };

    console.log('Auto-bid update payload:', payload);

    const response = await axios.post(
      'https://meta-e-auction.infororg.com/bids/update/auto-bid',
      payload,
      { withCredentials: true }
    );

    // Only update success message if POST request is successful
    if (response.status === 200) {
      setAutobid(response.data);
      setSuccess('Your auto-bid settings were updated successfully!');
    } else {
      setError('Failed to update auto-bid. Please try again.');
    }
  } catch (err: any) {
    console.error('Auto-bid update error:', err.response?.data);
    const message =
      err.response?.data?.message ||
      (err.response?.status === 403
        ? 'Unauthorized to update auto-bid. Please check your login or verification status.'
        : 'An error occurred while updating auto-bid.');
    setError(message);
  } finally {
    setIsLoading(false);
  }
};

const normalizedStatus = bidStatus?.toLowerCase().trim();

if (normalizedStatus === 'accepted' || normalizedStatus === 'rejected') {
  return (
    <div className="bg-gray-100 p-4 rounded-lg text-center">
      <p className="text-gray-700">
        Your bid has been {normalizedStatus}.
      </p>
    </div>
  );
}



  const isAutoBidActive = hasAutoBid || autobid?.status?.toLowerCase() === 'auto';

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Place Your Bid</h3>

      <h2 className="text-xl font-semibold mb-2">{auctionName ?? 'Auction'}</h2>
      <p className="mb-2 text-gray-600">{auctionDescription}</p>
      <p className="mb-2">
        Current Highest Bid: <strong>{formatCurrency(liveHighestBid)}</strong>
      </p>
      <p className="mb-2">
        Your Highest Bid: {userHighestBid !== null ? formatCurrency(userHighestBid) : 'No bids yet'}
      </p>

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

      {/* Show Place Bid form only if auto-bid is not active */}
      {!isAutoBidActive && (
        <form onSubmit={handleBidSubmit}>
          <div className="mb-4">
            <Input
              label="Your Bid Amount"
              type="number"
              value={bidAmount || ''}
              onChange={(e) => {
                const value = e.target.value ? Number(e.target.value) : '';
                setBidAmount(value);
              }}
              onBlur={() => {
                if (bidAmount <= liveHighestBid) {
                  setBidAmount(liveHighestBid + 1);
                }
              }}
              min={liveHighestBid + 1}
              step="any"
              required
              inputMode="numeric"
              pattern="[0-9]*"
              disabled={isLoading || !isAuthenticated || users?.status !== 'verified'}
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
            disabled={!isAuthenticated || users?.status !== 'verified'}
            className="bg-blue-800 text-white hover:bg-blue-700 focus:ring-blue-600"
          >
            Place Bid
          </Button>
        </form>
      )}

      {/* Show Auto Bid or Update Auto Bid form based on isAutoBidActive */}
      {auctionStarted && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          {isAutoBidActive ? (
            <form onSubmit={handleAutoBidUpdate}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Auto Bid Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  label="Max Amount"
                  type="number"
                  value={autoMax || ''}
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : '';
                    setAutoMax(value);
                  }}
                  onBlur={() => {
                    if (!autoMax || autoMax <= liveHighestBid) {
                      setAutoMax(liveHighestBid + 1);
                    }
                  }}
                  min={liveHighestBid + 1}
                  step="any"
                  required
                />
                <Input
                  label="Hike Amount"
                  type="number"
                  value={autoHike || ''}
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : '';
                    setAutoHike(value);
                  }}
                  onBlur={() => {
                    if (!autoHike || autoHike <= 0) {
                      setAutoHike(1);
                    }
                  }}
                  min={1}
                  step="any"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
                disabled={!isAuthenticated || users?.status !== 'verified'}
                className="bg-blue-800 text-white hover:bg-blue-700 focus:ring-blue-600"
              >
                Update Auto Bid
              </Button>
            </form>
          ) : (
            <form onSubmit={handleAutoBidSetup}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Automate Your Bidding</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  label="Max Amount"
                  type="number"
                  value={autoMax || ''}
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : '';
                    setAutoMax(value);
                  }}
                  onBlur={() => {
                    if (!autoMax || autoMax <= liveHighestBid) {
                      setAutoMax(liveHighestBid + 1);
                    }
                  }}
                  min={liveHighestBid + 1}
                  step="any"
                  required
                />
                <Input
                  label="Hike Amount"
                  type="number"
                  value={autoHike || ''}
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : '';
                    setAutoHike(value);
                  }}
                  onBlur={() => {
                    if (!autoHike || autoHike <= 0) {
                      setAutoHike(1);
                    }
                  }}
                  min={1}
                  step="any"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
                disabled={!isAuthenticated || users?.status !== 'verified'}
                className="bg-blue-800 text-white hover:bg-blue-700 focus:ring-blue-600"
              >
                Automate my Bid
              </Button>
            </form>
          )}
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p>By placing a bid, you agree to the terms and conditions of this auction.</p>
      </div>
    </div>
  );
};

export default BidForm;