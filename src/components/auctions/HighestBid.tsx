import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Props {
  auctionId: string;
}

const BidStatus: React.FC<Props> = ({ auctionId }) => {
  const [highestBid, setHighestBid] = useState<number>(0);
  const [highestBidder, setHighestBidder] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const fetchHighestBid = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/bids/getAllBids/${auctionId}`, {
          withCredentials: true,
        });

        if (isMounted) {
          // Assuming API returns { highestBid: number, highestBidderUsername: string }
          setHighestBid(res.data.highestBid || 0);
          setHighestBidder(res.data.highestBidderUsername || null);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to fetch highest bid.');
          setLoading(false);
        }
      }
    };

    // Initial fetch
    fetchHighestBid();

    // Poll every 5 seconds
    const intervalId = setInterval(fetchHighestBid, 5000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [auctionId]);

  const formatCurrency = (amount: number) =>
    amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

  if (loading) {
    return <div>Loading highest bid...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-sm mx-auto p-4 border rounded shadow bg-white text-center">
      <h2 className="text-xl font-semibold mb-2">Live Highest Bid</h2>
      <p className="text-3xl font-bold text-blue-700 mb-1">{formatCurrency(highestBid)}</p>
      {highestBidder && (
        <p className="text-gray-600 text-sm">Highest Bidder: <span className="font-medium">{highestBidder}</span></p>
      )}
    </div>
  );
};

export default BidStatus;
