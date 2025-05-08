
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Package, ChevronLeft } from "lucide-react";
import Confetti from 'react-confetti';

interface Auction {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  startingPrice: number;
  highestBidAmount: number | null;
  highestBidderId: number | null;
  status: string;
  bidId: number | null;
  createdByAdminId: number;
  createdAt: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  status: string;
  active: number;
}

interface Bid {
  id: number;
  auction: Auction;
  bidStatus: string | null;
  user: User;
  bidAmount: number;
  bidTime: string;
}

const CompletedAuctionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [filteredBids, setFilteredBids] = useState<Bid[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingAuction, setLoadingAuction] = useState(true);
  const [loadingBids, setLoadingBids] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedBidToReject, setSelectedBidToReject] = useState<Bid | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();

  const formatDateTime = (dateString?: string): string => {
    if (!dateString) {
      console.warn("Date string is undefined or null");
      return "null";
    }
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn(`Invalid date string: ${dateString}`);
        return "null";
      }
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (err) {
      console.error(`Error parsing date: ${dateString}`, err);
      return "null";
    }
  };

  const fetchAuctionData = async () => {
    if (!id) {
      setError("No auction ID provided in the URL.");
      setLoadingAuction(false);
      return;
    }

    if (isNaN(parseInt(id))) {
      setError("Invalid auction ID format. ID must be a number.");
      setLoadingAuction(false);
      return;
    }

    setLoadingAuction(true);
    try {
      const res = await fetch(`https://metaauction.onrender.com/auction/auctionBy/${id}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch auction. Status: ${res.status} ${res.statusText}`);
      }
      const data: any = await res.json();
      const auctionData: Auction = {
        id: data.id || 0,
        name: data.name || "Unknown Auction",
        description: data.description || "No description",
        startDate: data.startDate || "",
        endDate: data.endDate || "",
        startingPrice: data.startingPrice || 0,
        highestBidAmount: data.highestBidAmount !== undefined ? data.highestBidAmount : null,
        highestBidderId: data.highestBidderId !== undefined ? data.highestBidderId : null,
        status: data.status || "UNKNOWN",
        bidId: data.bidId !== undefined ? data.bidId : null,
        createdByAdminId: data.createdByAdminId || 0,
        createdAt: data.createdAt || "",
      };

      const requiredFields = ["id", "name", "description", "startDate", "endDate", "startingPrice", "status", "createdByAdminId", "createdAt"];
      const missingFields = requiredFields.filter(field => data[field] === undefined || data[field] === null);
      if (missingFields.length > 0) {
        console.warn(`Missing auction fields: ${missingFields.join(", ")}`, data);
      }

      setAuction(auctionData);
      setLoadingAuction(false);
    } catch (err: any) {
      console.error("Auction fetch error:", err);
      setError(`Failed to fetch auction: ${err.message}`);
      setLoadingAuction(false);
    }
  };

  const fetchBidsData = async () => {
    if (!id) {
      setError("No auction ID provided for fetching bids.");
      setLoadingBids(false);
      return;
    }

    setLoadingBids(true);
    try {
      const res = await fetch(`https://metaauction.onrender.com/bids/getAllBids/${id}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch bids. Status: ${res.status} ${res.statusText}`);
      }
      const data: Bid[] = await res.json();
      const sortedBids = data.sort((a, b) => {
        if (b.bidAmount !== a.bidAmount) {
          return b.bidAmount - a.bidAmount;
        }
        return new Date(b.bidTime).getTime() - new Date(a.bidTime).getTime();
      });
      setBids(sortedBids);
      setFilteredBids(sortedBids);
      setLoadingBids(false);
    } catch (err: any) {
      console.error("Bid fetch error:", err);
      setBids([]);
      setFilteredBids([]);
      setLoadingBids(false);
    }
  };

  useEffect(() => {
    fetchAuctionData();
    fetchBidsData();
  }, [id]);

  useEffect(() => {
    const filtered = bids.filter((bid) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        bid.user.username.toLowerCase().includes(searchLower) ||
        bid.user.email.toLowerCase().includes(searchLower) ||
        bid.bidAmount.toString().includes(searchLower) ||
        (bid.bidStatus || "Pending").toLowerCase().includes(searchLower) ||
        formatDateTime(bid.bidTime).toLowerCase().includes(searchLower)
      );
    });
    setFilteredBids(filtered);
  }, [searchQuery, bids]);

  const handleAcceptClick = async (bid: Bid) => {
    setIsProcessing(true);
    const requestBody = {
      auctionId: auction?.id,
      bidId: bid.id,
      userId: bid.user.id,
      bidAmount: bid.bidAmount,
    };

    try {
      const res = await fetch("https://metaauction.onrender.com/admin/acceptBid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      if (!res.ok) {
        throw new Error(`Failed to accept bid. Status: ${res.status} ${res.statusText}`);
      }

      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        data = await res.text();
      }

      console.log("Response data:", data);
      if (typeof data === "string" && data.includes("success")) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000); // Stop confetti after 3 seconds
        await fetchAuctionData();
        await fetchBidsData();
      } else if (typeof data === "object" && data.status === "success") {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        await fetchAuctionData();
        await fetchBidsData();
      } else {
        throw new Error("Unexpected response format or failure.");
      }
    } catch (err: any) {
      console.error("Auction fetch error:", err);
      setError(`Failed to accept bid: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectClick = (bid: Bid) => {
    setSelectedBidToReject(bid);
    setShowRejectDialog(true);
  };

  const confirmReject = async () => {
    if (!selectedBidToReject) return;

    setIsProcessing(true);
    try {
      const res = await fetch(`https://metaauction.onrender.com/admin/rejectBid/${selectedBidToReject.id}`, {
        method: "POST",
      });
      if (!res.ok) {
        throw new Error(`Failed to reject bid. Status: ${res.status} ${res.statusText}`);
      }

      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        data = await res.text();
      }

      console.log("Response data:", data);

      if (typeof data === "string" && data.toLowerCase().includes("success")) {
        await fetchAuctionData();
        await fetchBidsData();
      } else if (typeof data === "object" && (data.status === "success" || data.message?.toLowerCase().includes("success"))) {
        await fetchAuctionData();
        await fetchBidsData();
      } else {
        throw new Error("Unexpected response format or failure.");
      }
    } catch (err: any) {
      console.error("Error rejecting bid:", err);
      setError(`Failed to reject bid: ${err.message}`);
    } finally {
      setIsProcessing(false);
      setShowRejectDialog(false);
      setSelectedBidToReject(null);
    }
  };

  const cancelReject = () => {
    setShowRejectDialog(false);
    setSelectedBidToReject(null);
  };

  if (loadingAuction) {
    return (
      <div className="flex items-center justify-center min-h-screen animate__animated animate__pulse">
        <div className="text-center">
          <Package className="h-7 w-7 text-cyan-600 animate-spin mx-auto" />
          <p className="mt-4 text-lg text-gray-700">Loading auction details...</p>
        </div>
      </div>
    );
  }

  if (error || !auction) {
    return (
      <div className="flex items-center justify-center min-h-screen animate__animated animate__fadeIn">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto">
          <p className="font-bold">Error</p>
          <p>{error || "Auction not found."}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const hasAcceptedBid = auction.bidId !== null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Confetti Animation for Successful Bid Acceptance */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={200}
          recycle={false}
          colors={['#06B6D4', '#14B8A6', '#3B82F6', '#F59E0B', '#EC4899']}
          className="absolute top-0 left-0 z-50"
        />
      )}

      <nav className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg py-4 sticky top-0 z-20 animate__animated animate__fadeInDown">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold flex-1 text-center">Auction Platform</h1>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Auction Details Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 animate__animated animate__fadeInUp">
          <div className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{auction.name || "null"}</h1>
                <p className="text-gray-600 text-base mb-4">{auction.description || "null"}</p>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  auction.status === "COMPLETED"
                    ? "bg-green-100 text-green-800"
                    : auction.status === "ACTIVE"
                    ? "bg-cyan-100 text-cyan-800"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {auction.status || "null"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-4">
                <DetailItem
                  label="Auction ID"
                  value={auction.id !== null && auction.id !== undefined ? auction.id : "null"}
                  icon={
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  }
                />
                <DetailItem
                  label="Starting Price"
                  value={auction.startingPrice !== null && auction.startingPrice !== undefined ? `₹${auction.startingPrice.toLocaleString()}` : "null"}
                  icon={
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  }
                />
                <DetailItem
                  label="Start Date"
                  value={auction.startDate !== null && auction.startDate !== undefined ? formatDateTime(auction.startDate) : "null"}
                  icon={
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  }
                />
              </div>
              <div className="space-y-4">
                <DetailItem
                  label="Highest Bid Amount"
                  value={auction.highestBidAmount !== null && auction.highestBidAmount !== undefined ? `₹${auction.highestBidAmount.toLocaleString()}` : "null"}
                  icon={
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  }
                />
                <DetailItem
                  label="Highest Bidder ID"
                  value={auction.highestBidderId !== null && auction.highestBidderId !== undefined ? `User #${auction.highestBidderId}` : "null"}
                  icon={
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  }
                />
                <DetailItem
                  label="End Date"
                  value={auction.endDate !== null && auction.endDate !== undefined ? formatDateTime(auction.endDate) : "null"}
                  icon={
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  }
                />
              </div>
              <div className="space-y-4">
                <DetailItem
                  label="Created At"
                  value={auction.createdAt !== null && auction.createdAt !== undefined ? formatDateTime(auction.createdAt) : "null"}
                  icon={
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  }
                />
                <DetailItem
                  label="Created By Admin ID"
                  value={auction.createdByAdminId !== null && auction.createdByAdminId !== undefined ? auction.createdByAdminId : "null"}
                  icon={
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bid History Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden animate__animated animate__fadeInUp">
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-gray-800">Bid History</h2>
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search bids..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {loadingBids ? (
              <div className="flex justify-center py-8 animate__animated animate__pulse">
                <div className="text-center">
                  <Package className="h-7 w-7 text-cyan-600 animate-spin mx-auto" />
                  <p className="mt-4 text-lg text-gray-700">Loading bid history...</p>
                </div>
              </div>
            ) : filteredBids.length === 0 ? (
              <div className="text-center py-8 animate__animated animate__fadeIn">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-800">
                  {searchQuery ? "No matching bids found" : "No bids placed"}
                </h3>
                <p className="text-gray-600">
                  {searchQuery ? "Try different search terms" : "This auction hasn't received any bids yet."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="max-h-[500px] overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr>
                        <Th>Bidder</Th>
                        <Th>Amount</Th>
                        <Th>Time</Th>
                        <Th>Status</Th>
                        <Th>Actions</Th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredBids.map((bid) => {
                        const isAccepted = bid.bidStatus === "ACCEPTED";
                        const isRejected = bid.bidStatus === "REJECTED";
                        const isPending = !isAccepted && !isRejected;

                        return (
                          <tr
                            key={bid.id}
                            className={isAccepted ? "bg-green-50" : isRejected ? "bg-red-50" : ""}
                          >
                            <Td>
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-cyan-100 rounded-full flex items-center justify-center">
                                  <span className="text-cyan-600 font-medium">
                                    {bid.user.username.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-800">
                                    {bid.user.username}
                                  </div>
                                  <div className="text-sm text-gray-600">{bid.user.email}</div>
                                </div>
                              </div>
                            </Td>
                            <Td>
                              <span
                                className={`font-bold ${
                                  isAccepted
                                    ? "text-green-600"
                                    : isRejected
                                    ? "text-gray-400"
                                    : "text-gray-800"
                                }`}
                              >
                                ₹{bid.bidAmount.toLocaleString()}
                              </span>
                            </Td>
                            <Td>
                              <div className="text-sm text-gray-800">
                                {formatDateTime(bid.bidTime).split(",")[0]}
                              </div>
                              <div className="text-sm text-gray-600">
                                {formatDateTime(bid.bidTime).split(",")[1]?.trim() || "N/A"}
                              </div>
                            </Td>
                            <Td>
                              <span
                                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  isAccepted
                                    ? "bg-green-100 text-green-800"
                                    : isRejected
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {bid.bidStatus || "Pending"}
                              </span>
                            </Td>
                            <Td>
                              <div className="flex space-x-2">
                                {!isAccepted && (
                                  <button
                                    onClick={() => handleAcceptClick(bid)}
                                    disabled={isProcessing}
                                    className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                  >
                                    {isProcessing ? "Processing..." : "Approve"}
                                  </button>
                                )}
                                <button
                                  onClick={() => handleRejectClick(bid)}
                                  disabled={isProcessing}
                                  className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                >
                                  Reject
                                </button>
                              </div>
                            </Td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {showRejectDialog && selectedBidToReject && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center animate__animated animate__fadeIn">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 animate__animated animate__zoomIn">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-red-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-800">Reject Bid</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Are you sure you want to reject this bid from{" "}
                  <span className="font-semibold">{selectedBidToReject.user.username}</span> for{" "}
                  <span className="font-semibold">
                    ₹{selectedBidToReject.bidAmount.toLocaleString()}
                  </span>
                  ?
                </p>
              </div>
            </div>
            <div className="mt-5 flex justify-end space-x-3">
              <button
                type="button"
                onClick={cancelReject}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmReject}
                disabled={isProcessing}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 text-sm transition-colors"
              >
                {isProcessing ? "Processing..." : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailItem: React.FC<{ label: string; value: string | number; icon?: React.ReactNode }> = ({
  label,
  value,
  icon,
}) => (
  <div className="flex items-center space-x-2">
    {icon && <div className="flex-shrink-0">{icon}</div>}
    <div>
      <p className="text-xs font-medium text-gray-600">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

const Th: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {children}
  </th>
);

const Td: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{children}</td>
);

export default CompletedAuctionDetailPage;