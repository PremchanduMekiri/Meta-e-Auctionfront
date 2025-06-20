import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Clock, Calendar, User
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import BidForm from '../components/auctions/BidForm';
import { formatCurrency } from '../utils/formatters';
import { formatDate } from '../utils/dateUtils';
import axios from 'axios';

type Auction = {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  startingPrice: number;
  status: string;
  highestBidderId: number | null;
  createdByAdminId: number;
  createdAt: string;
  image?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  bids?: Array<{
    id: number;
    amount: number;
    createdAt: string;
    user: {
      id: number;
      name: string;
    };
  }>;
};

type UserBid = {
  id: number;
  auction: Auction;
  bidAmount: number;
  bidStatus: string;
  bidTime: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
};

const AuctionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [endTimestamp, setEndTimestamp] = useState<number | null>(null);
  const [auctions, setAuctions] = useState<UserBid[]>([]);

  // Fetch auction details every 1 second
  useEffect(() => {
    if (!id) return;

    const fetchAuction = async () => {
      try {
        const res = await axios.get<Auction>(`https://meta-e-auction.infororg.com/auction/auctionBy/${id}`);
        const newAuction = res.data;
        setAuction(newAuction);

        const newEndTime = new Date(newAuction.endDate).getTime();
        if (!endTimestamp || newEndTime !== endTimestamp) {
          setEndTimestamp(newEndTime);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching auction:", err);
        setError('Failed to load auction details');
        setAuction(null);
      } finally {
        setLoading(false);
      }
    };

    const interval = setInterval(fetchAuction, 1000);
    fetchAuction(); // Initial call

    return () => clearInterval(interval);
  }, [id, endTimestamp]);

  // Countdown timer
  useEffect(() => {
    if (!endTimestamp) return;

    const updateTime = () => {
      const now = Date.now();
      const diff = endTimestamp - now;

      if (diff <= 0) {
        setTimeRemaining('');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [endTimestamp]);

  // Fetch bids every 2 seconds
  useEffect(() => {
    if (!auction) return;

    const userId = localStorage.getItem('userId');
    if (!userId) return;

    const fetchBids = async () => {
      try {
        const res = await axios.get<UserBid[]>(`https://meta-e-auction.infororg.com/bids/getBids/${userId}/${auction.id}`);
        const fetchedBids = res.data;
        setAuctions(fetchedBids);
        localStorage.setItem('userAuctionBids', JSON.stringify(fetchedBids));
      } catch (err) {
        console.error("Failed to fetch bids for this user:", err);
        setAuctions([]);
      }
    };

    const interval = setInterval(fetchBids, 1000);
    fetchBids(); // Initial call

    return () => clearInterval(interval);
  }, [auction]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <p>Loading auction details...</p>
        </div>
      </Layout>
    );
  }

  if (error || !auction) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Auction Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'The auction you requested could not be found.'}</p>
          <Link to="/"><Button variant="primary">Back to Home</Button></Link>
        </div>
      </Layout>
    );
  }

  const auctionEnded = timeRemaining === '';
  const defaultImage = '/scrap.jpg';
  const auctionImage = auction.image || defaultImage;

  const hasAutoBid = auctions.some(bid => bid.bidStatus?.toLowerCase() === 'auto');
  const bidStatus = auctions.length > 0
    ? auctions.find(bid => bid.bidStatus?.toLowerCase() === 'auto')?.bidStatus ||
      auctions[auctions.length - 1].bidStatus
    : undefined;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-blue-800 hover:text-blue-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          {/* Left Side */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 w-full max-w-xl mx-auto">
              <div className="relative bg-gray-100 h-80">
                <img
                  src={auctionImage}
                  alt={auction.name}
                  className="w-4/4 object-contain mx-auto h-full rounded-lg shadow-md border-4 border-gray-200"
                />
                {auctionEnded && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-red-600 text-white py-2 px-4 rounded-md font-bold text-lg">
                      Auction Ended
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Card className="mb-6" padding="lg">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{auction.name}</h1>
              <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-4 gap-y-2 mb-4">
                <div className="flex items-center"><Calendar className="h-4 w-4 mr-1" /><span>Started {formatDate(auction.startDate)}</span></div>
                <div className="flex items-center"><Calendar className="h-4 w-4 mr-1" /><span>Ends {formatDate(auction.endDate)}</span></div>
                {auction.user && <div className="flex items-center"><User className="h-4 w-4 mr-1" /><span>Seller: {auction.user.name}</span></div>}
              </div>

              <div className="border-t border-b border-gray-200 py-4 my-4">
                <h2 className="text-lg font-semibold mb-3">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{auction.description || 'No description provided.'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-3 rounded-md"><div className="text-gray-500 text-sm mb-1">Starting Price</div><div className="font-medium">{formatCurrency(auction.startingPrice)}</div></div>
                <div className="bg-gray-50 p-3 rounded-md"><div className="text-gray-500 text-sm mb-1">Status</div><div className="font-medium">{auction.status}</div></div>
                <div className="bg-gray-50 p-3 rounded-md"><div className="text-gray-500 text-sm mb-1">Highest Bidder</div><div className="font-medium">{auction.highestBidderId ? `User #${auction.highestBidderId}` : 'None'}</div></div>
              </div>
            </Card>

            <Card padding="lg">
              <h2 className="text-lg font-semibold mb-4">Bid History</h2>
              {auctions.length > 0 ? (
                <div className="space-y-4">
                  {auctions.map((item, index) => (
                    <div key={index} className="border rounded-md p-4 bg-white shadow-sm">
                      <h3 className="text-md font-semibold text-gray-800 mb-1">{item.auction.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{item.auction.description}</p>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm text-gray-700">
                        <div><span className="font-medium">Bid Amount: </span><span className="text-blue-800 font-semibold">₹{item.bidAmount}</span></div>
                        <div><span className="font-medium">Bid Status: </span><span>{item.bidStatus}</span></div>
                        <div><span className="font-medium">Bid Time: </span><span>{new Date(item.bidTime).toLocaleString()}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 bg-gray-50 rounded-md">
                  <p className="text-gray-500">No bids yet. Be the first to bid!</p>
                </div>
              )}
            </Card>
          </div>

          {/* Right Side */}
          <div>
            <Card className="mb-6" padding="lg">
              <div className="flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Starting Price:</p>
                    <p className="text-3xl font-bold text-blue-800">{formatCurrency(auction.startingPrice)}</p>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <Clock className="h-5 w-5 text-amber-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Time Remaining:</p>
                    <p className={`font-medium ${auctionEnded ? 'text-red-500' : 'text-amber-600'}`}>
                      {auctionEnded ? 'Auction Ended' : timeRemaining}
                    </p>
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  <p>Auction ends: {formatDate(auction.endDate)}</p>
                </div>
              </div>
            </Card>

            {!auctionEnded && (
              <BidForm
                auctionId={auction.id.toString()}
                currentBid={auction.startingPrice}
                endDate={auction.endDate}
                startDate={auction.startDate}
                auctionName={auction.name}
                auctionDescription={auction.description}
                auctionStatus={auction.status}
                hasAutoBid={hasAutoBid}
                bidStatus={bidStatus}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AuctionDetailPage;
