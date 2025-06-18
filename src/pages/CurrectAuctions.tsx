import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
}

interface Bid {
  id: number;
  auctionId: number;
  bidderId: number;
  bidAmount: number;
  bidTime: string;
  bidStatus: string | null;
  user: User;
}

const CurrentAuctionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loadingAuction, setLoadingAuction] = useState(true);
  const [loadingBids, setLoadingBids] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedBidToReject, setSelectedBidToReject] = useState<Bid | null>(null);


  
  useEffect(() => {
    if (!id) return;

    setLoadingAuction(true);
    fetch(`https://meta-e-auction.infororg.com/auction/auctionBy/${id}`)
      .then((res) => res.json())
      .then((data: Auction) => {
        setAuction(data);
        setLoadingAuction(false);
      })
      .catch((err) => {
        console.error("Auction fetch error:", err);
        setError("Auction not found or an error occurred.");
        setLoadingAuction(false);
      });

    setLoadingBids(true);
    fetch(`https://meta-e-auction.infororg.com/bids/getAllBids/${id}`)
      .then((res) => res.json())
      .then((data: Bid[]) => {
        setBids(data);
        setLoadingBids(false);
      })
      .catch((err) => {
        console.error("Bid fetch error:", err);
        setBids([]);
        setLoadingBids(false);
      });
  }, [id]);

  const handleApproveClick = (bid: Bid) => {
    const requestBody = {
      auctionId: auction?.id,
      bidId: bid.id,
      userId: bid.user.id,
      bidAmount: bid.bidAmount,
    };

    fetch("https://meta-e-auction.infororg.com/admin/acceptBid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Bid accepted:", data);
        if (auction) {
          setAuction({
            ...auction,
            highestBidderId: bid.user.id,
            highestBidAmount: bid.bidAmount,
          });
        }
        setBids((prevBids) =>
          prevBids.map((b) =>
            b.id === bid.id ? { ...b, bidStatus: "approved" } : b
          )
        );
      })
      .catch((err) => {
        console.error("Error accepting bid:", err);
      });
  };

  const handleRejectClick = (bid: Bid) => {
    setSelectedBidToReject(bid);
    setShowRejectDialog(true);
  };

  const confirmReject = () => {
    if (selectedBidToReject) {
      fetch(`https://meta-e-auction.infororg.com/admin/rejectBid/${selectedBidToReject.id}`, {
        method: "POST",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Bid rejected:", data);
          setBids((prevBids) =>
            prevBids.map((b) =>
              b.id === selectedBidToReject.id
                ? { ...b, bidStatus: "REJECTED" }
                : b
            )
          );
          setShowRejectDialog(false);
        })
        .catch((err) => {
          console.error("Error rejecting bid:", err);
          setShowRejectDialog(false);
        });
    }
  };

  const cancelReject = () => {
    setShowRejectDialog(false);
    setSelectedBidToReject(null);
  };

  if (loadingAuction) {
    return <div className="p-6 text-gray-700 text-lg">Loading completed auction details...</div>;
  }

  if (error || !auction) {
    return <div className="p-6 text-red-500 text-lg">{error || "Auction not found."}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-blue-600 text-white shadow-md py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold">Auction Platform</h1>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow bg-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-4">
          {/* Auction Details Section */}
          <div className="bg-white shadow-lg rounded-xl p-6 mb-8 border border-gray-200">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Completed Auction Details</h1>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <DetailItem label="Auction ID" value={auction.id} />
                <DetailItem label="Name" value={auction.name} />
                <DetailItem label="Description" value={auction.description} />
                <DetailItem label="Status" value={auction.status} />
              </div>
              <div className="space-y-2">
                <DetailItem label="Final Bid" value={`₹${auction.highestBidAmount?.toLocaleString()}`} />
                <DetailItem label="Starting Price" value={`₹${auction.startingPrice?.toLocaleString()}`} />
                <DetailItem label="Winner" value={auction.highestBidderId ? `User #${auction.highestBidderId}` : "N/A"} />
                <DetailItem label="Ended On" value={new Date(auction.endDate).toLocaleString()} />
              </div>
            </div>

            
          </div>

          {/* Bids Section */}
          <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">All Bids</h2>

            {loadingBids ? (
              <p className="text-gray-600">Loading bids...</p>
            ) : bids.length === 0 ? (
              <p className="text-gray-600">No bids placed for this auction.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 table-auto text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <Th>Bid ID</Th>
                      <Th>Bidder ID</Th>
                      <Th>Amount (₹)</Th>
                      <Th>Time</Th>
                      <Th>User Details</Th>
                      <Th>Actions</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {bids.map((bid) => (
                      <tr
                        key={bid.id}
                        className={`hover:bg-gray-50 ${bid.bidStatus === "REJECTED" ? "bg-red-100" : ""}`}
                      >
                        <Td>{bid.id}</Td>
                        <Td>{bid.user.id}</Td>
                        <Td>₹{bid.bidAmount?.toLocaleString()}</Td>
                        <Td>{new Date(bid.bidTime).toLocaleString()}</Td>
                        <Td>
                          <p>Username: {bid.user.username}</p>
                          <p>Email: {bid.user.email}</p>
                          <p>Status: {bid.user.status}</p>
                        </Td>
                        <Td>
                          {auction?.highestBidderId !== bid.user.id && bid.bidStatus !== "approved" && (
                            <>
                              <button
                                onClick={() => handleApproveClick(bid)}
                                className="px-4 py-2 bg-green-500 text-white rounded mr-2 hover:bg-green-600"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectClick(bid)}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Reject Confirmation Dialog */}
          {showRejectDialog && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-10">
              <div className="bg-white p-8 rounded shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Are you sure you want to reject this bid?</h3>
                <div className="flex justify-end">
                  <button
                    onClick={cancelReject}
                    className="px-4 py-2 mr-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmReject}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm">&copy; 2025 Auction Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const DetailItem: React.FC<{ label: string; value: string | number | null }> = ({ label, value }) => (
  <p className="text-base text-gray-700">
    <span className="font-semibold">{label}:</span> {value ?? "N/A"}
  </p>
);

const Th: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <th className="border px-4 py-2 text-left text-gray-700 font-medium">{children}</th>
);

const Td: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <td className="border px-4 py-2 text-gray-800">{children}</td>
);
export default CurrentAuctionDetailPage;
