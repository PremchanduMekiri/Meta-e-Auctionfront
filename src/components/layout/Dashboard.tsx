
import React, { useEffect, useState } from "react";
import { Package, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Confetti from 'react-confetti';
import Layout from "./Layout";
import Footer from "./Footer";

interface Auction {
  id: string;
  name: string;
  startingPrice: number;
  endDate: string;
  startDate: string;
  description: string;
  status: string;
  highestBidderId: string | null;
  highestBidAmount: number;
  title: string;
}

const AuctionUserDashboard: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const [userAuctions, setUserAuctions] = useState<Auction[]>([]);
  const [filteredAuctions, setFilteredAuctions] = useState<Auction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("price-asc");
  const [loading, setLoading] = useState(true);
  const [wonAuctions, setWonAuctions] = useState<Auction[]>([]);
  const [filteredWonAuctions, setFilteredWonAuctions] = useState<Auction[]>([]);
  const [searchWonTerm, setSearchWonTerm] = useState("");
  const [sortWonOption, setSortWonOption] = useState("price-asc");
  const [loadingWon, setLoadingWon] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUserAuctions = async () => {
      if (!userId) return;
      try {
        const response = await fetch(`https://meta-e-auction.infororg.com/user/auctions/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch participated auctions");
        const data = await response.json();
        const sanitizedData: Auction[] = data.map((auction: any) => {
          const startingPrice = Number(auction.startingPrice);
          if (isNaN(startingPrice)) {
            console.warn(`Invalid startingPrice for auction ${auction.id}: ${auction.startingPrice}`);
          }
          const endDate = auction.endDate && !isNaN(new Date(auction.endDate).getTime())
            ? auction.endDate
            : new Date().toISOString();
          if (!auction.endDate) {
            console.warn(`Invalid endDate for auction ${auction.id}, using default`);
          }
          return {
            id: String(auction.id ?? "Unknown"),
            name: auction.name ?? "Unnamed Auction",
            startingPrice: isNaN(startingPrice) ? 0 : startingPrice,
            endDate,
            startDate: auction.startDate && !isNaN(new Date(auction.startDate).getTime())
              ? auction.startDate
              : new Date().toISOString(),
            description: auction.description ?? "No description",
            status: auction.status ?? "UNKNOWN",
            highestBidderId: auction.highestBidderId ? String(auction.highestBidderId) : null,
            highestBidAmount: Number(auction.highestBidAmount) || 0,
            title: auction.title ?? auction.name ?? "Untitled",
          };
        });
        console.log("Fetched Participated Auctions:", sanitizedData);
        setUserAuctions(sanitizedData);
        setFilteredAuctions(sanitizedData);
      } catch (error) {
        setError("Error fetching participated auctions");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchWonAuctions = async () => {
      if (!userId) return;
      try {
        const response = await fetch(`https://meta-e-auction.infororg.com/user/wonAuctions/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch won auctions");
        const data = await response.json();
        const sanitizedData: Auction[] = data.map((auction: any) => ({
          id: String(auction.id ?? "Unknown"),
          name: auction.name ?? "Unnamed Auction",
          startingPrice: Number(auction.startingPrice) || 0,
          endDate: auction.endDate && !isNaN(new Date(auction.endDate).getTime())
            ? auction.endDate
            : new Date().toISOString(),
          startDate: auction.startDate && !isNaN(new Date(auction.startDate).getTime())
            ? auction.startDate
            : new Date().toISOString(),
          description: auction.description ?? "No description",
          status: auction.status ?? "UNKNOWN",
          highestBidderId: auction.highestBidderId ? String(auction.highestBidderId) : null,
          highestBidAmount: Number(auction.highestBidAmount) || 0,
          title: auction.title ?? auction.name ?? "Untitled",
        }));
        setWonAuctions(sanitizedData);
        setFilteredWonAuctions(sanitizedData);
        if (sanitizedData.length > 0) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000); // Stop confetti after 3 seconds
        }
      } catch (error) {
        setError("Error fetching won auctions");
        console.error(error);
      } finally {
        setLoadingWon(false);
      }
    };

    if (userId) {
      fetchUserAuctions();
      fetchWonAuctions();
    }
  }, [userId]);

  const searchParticipatedAuctions = (auctions: Auction[], term: string): Auction[] => {
    if (!term.trim()) return auctions;
    const lowerTerm = term.toLowerCase();
    return auctions.filter((auction) => {
      const name = auction.name.toLowerCase();
      const id = auction.id.toLowerCase();
      return name.includes(lowerTerm) || id === lowerTerm;
    });
  };

  const searchWonAuctions = (auctions: Auction[], term: string): Auction[] => {
    if (!term.trim()) return auctions;
    const lowerTerm = term.toLowerCase();
    return auctions.filter((auction) => {
      const name = auction.name.toLowerCase();
      const id = auction.id.toLowerCase();
      return name.startsWith(lowerTerm) || id.startsWith(lowerTerm);
    });
  };

  const sortParticipatedAuctions = (auctions: Auction[], option: string): Auction[] => {
    const sorted = [...auctions];
    const [key, direction] = option.split("-");
    if (key === "price") {
      sorted.sort((a, b) => {
        const priceA = a.startingPrice;
        const priceB = b.startingPrice;
        return direction === "asc" ? priceA - priceB : priceB - priceA;
      });
    } else if (key === "time") {
      sorted.sort((a, b) => {
        const dateA = new Date(a.endDate).getTime();
        const dateB = new Date(b.endDate).getTime();
        if (isNaN(dateA) || isNaN(dateB)) {
          console.warn("Invalid date encountered:", a.endDate, b.endDate);
          return 0;
        }
        return direction === "asc" ? dateA - dateB : dateB - dateA;
      });
    }
    return sorted;
  };

  const sortWonAuctions = (auctions: Auction[], option: string): Auction[] => {
    const sorted = [...auctions];
    const [key, direction] = option.split("-");
    if (key === "price") {
      sorted.sort((a, b) => {
        const bidA = a.highestBidAmount;
        const bidB = b.highestBidAmount;
        return direction === "asc" ? bidA - bidB : bidB - bidA;
      });
    } else if (key === "time") {
      sorted.sort((a, b) => {
        const dateA = new Date(a.endDate).getTime();
        const dateB = new Date(b.endDate).getTime();
        return direction === "asc" ? dateA - dateB : dateB - dateA;
      });
    }
    return sorted;
  };

  useEffect(() => {
    console.log("Updating filtered auctions - Search:", searchTerm, "Sort:", sortOption);
    let result = searchParticipatedAuctions(userAuctions, searchTerm);
    result = sortParticipatedAuctions(result, sortOption);
    setFilteredAuctions(result);
  }, [searchTerm, sortOption, userAuctions]);

  useEffect(() => {
    let result = searchWonAuctions(wonAuctions, searchWonTerm);
    result = sortWonAuctions(result, sortWonOption);
    setFilteredWonAuctions(result);
  }, [searchWonTerm, sortWonOption, wonAuctions]);

  return (
    <Layout>
      <div className="p-6 min-h-screen bg-gray-50 animate__animated animate__fadeIn">
        {/* Confetti Animation for Won Auctions */}
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

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 animate__animated animate__shakeX">
            {error}
          </div>
        )}
        <div
          className="flex items-center gap-3 mb-6 cursor-pointer text-cyan-600 hover:text-cyan-700 transition-colors"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium text-sm">Back</span>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Your Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6 text-center animate__animated animate__fadeInUp">
            <h2 className="text-gray-600 text-sm mb-2">Participated Auctions</h2>
            <p className="text-3xl font-bold text-cyan-600">
              {loading ? <Package className="h-7 w-7 text-cyan-600 animate-spin mx-auto" /> : userAuctions.length}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 text-center animate__animated animate__fadeInUp" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-gray-600 text-sm mb-2">Auctions Won</h2>
            <p className="text-3xl font-bold text-teal-600">
              {loadingWon ? <Package className="h-7 w-7 text-teal-600 animate-spin mx-auto" /> : wonAuctions.length}
            </p>
          </div>
        </div>

        <div className="bg-cyan-50 rounded-2xl shadow-md p-6 mb-10 animate__animated animate__fadeInUp">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl font-semibold text-teal-700">Auctions You Won</h2>
            <input
              type="text"
              placeholder="Search by ID or name..."
              value={searchWonTerm}
              onChange={(e) => setSearchWonTerm(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-72 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
            />
            <select
              value={sortWonOption}
              onChange={(e) => setSortWonOption(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-48 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="time-asc">Time: Earliest to Latest</option>
              <option value="time-desc">Time: Latest to Earliest</option>
            </select>
          </div>
          {loadingWon ? (
            <div className="flex justify-center py-10 animate__animated animate__pulse">
              <Package className="h-10 w-10 text-teal-600 animate-spin" />
            </div>
          ) : filteredWonAuctions.length === 0 ? (
            <div className="text-center text-gray-600 py-10">No won auctions match your search.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredWonAuctions.map((auction, index) => (
                <div
                  key={auction.id}
                  className="border border-teal-200 bg-white rounded-xl p-5 hover:shadow-lg transition transform hover:scale-[1.01] animate__animated animate__fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold text-teal-800">{auction.name}</h3>
                    <span className="bg-teal-100 text-teal-700 px-2 py-1 text-xs font-medium rounded-full">
                      {auction.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2 italic">{auction.description}</p>
                  <div className="mb-2 text-sm text-gray-700 space-y-1">
                    <p><strong>Winning Bid:</strong> ₹ {auction.highestBidAmount}</p>
                    <p><strong>Auction ID:</strong> {auction.id}</p>
                    <p><strong>Ended On:</strong> {new Date(auction.endDate).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 animate__animated animate__fadeInUp">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl font-semibold text-cyan-700">Your Participated Auctions</h2>
            <input
              type="text"
              placeholder="Search by ID or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-72 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
            />
            <select
              value={sortOption}
              onChange={(e) => {
                console.log("Sort option changed to:", e.target.value);
                setSortOption(e.target.value);
              }}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-48 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="time-asc">Time: Earliest to Latest</option>
              <option value="time-desc">Time: Latest to Earliest</option>
            </select>
          </div>
          {loading ? (
            <div className="flex justify-center py-10 animate__animated animate__pulse">
              <Package className="h-10 w-10 text-cyan-600 animate-spin" />
            </div>
          ) : filteredAuctions.length === 0 ? (
            <div className="text-center text-gray-600 py-10">No auctions match your search.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredAuctions.map((auction, index) => (
                <div
                  key={`${auction.id}-${index}`}
                  className="bg-white border border-cyan-200 rounded-2xl p-5 transition-shadow hover:shadow-md hover:scale-[1.01] animate__animated animate__fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold text-cyan-700 truncate">{auction.name}</h3>
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        auction.status === "COMPLETED"
                          ? "bg-red-100 text-red-700"
                          : auction.status === "ACTIVE"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {auction.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 italic">{auction.description}</p>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p><strong>Auction ID:</strong> {auction.id}</p>
                    <p><strong>Start:</strong> {new Date(auction.startDate).toLocaleString()}</p>
                    <p><strong>End:</strong> {new Date(auction.endDate).toLocaleString()}</p>
                    <p><strong>Starting Price:</strong> ₹ {auction.startingPrice}</p>
                    {auction.highestBidderId && (
                      <p><strong>Top Bidder:</strong> {auction.highestBidderId}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AuctionUserDashboard;