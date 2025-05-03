import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSearch, FiX } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import axios from 'axios';
import { motion } from 'framer-motion';
type Auction = {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  startingPrice: number;
  status: 'ACTIVE' | 'COMPLETED' | 'UPCOMING' | 'CANCELED';
  highestBidAmount?: number;
  [key: string]: any;
};

const statusColors = {
  ACTIVE: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
  COMPLETED: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
  UPCOMING: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
  CANCELED: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' }
};

const statusOrder = {
  ACTIVE: 1,
  UPCOMING: 2,
  COMPLETED: 3,
  CANCELED: 4
};

type SortOption = 'price-asc' | 'price-desc' | 'date-asc' | 'date-desc' | 'none';

const AuctionListPage: React.FC = () => {
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [filteredAuctions, setFilteredAuctions] = useState<Auction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [sortOption, setSortOption] = useState<SortOption>('none');

  // Fetch all auctions
  useEffect(() => {
    const fetchAuctions = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get('https://metaauction.onrender.com/auction/auctions');
        const sortedAuctions = res.data.sort((a: Auction, b: Auction) => 
          statusOrder[a.status] - statusOrder[b.status]
        );
        setAuctions(sortedAuctions);
        setFilteredAuctions(sortedAuctions);
      } catch (error) {
        console.error('Error fetching auctions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAuctions();
  }, []);

  // Apply sorting
  const applySorting = (auctions: Auction[], option: SortOption) => {
    const sorted = [...auctions];
    switch (option) {
      case 'price-asc':
        return sorted.sort((a, b) => a.startingPrice - b.startingPrice);
      case 'price-desc':
        return sorted.sort((a, b) => b.startingPrice - a.startingPrice);
      case 'date-asc':
        return sorted.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      case 'date-desc':
        return sorted.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
      default:
        return sorted;
    }
  };

  // Search and filter logic
  useEffect(() => {
    let results = auctions;
    
    // Apply filters
    if (searchTerm || Object.keys(activeFilters).length > 0) {
      results = auctions.filter(auction => {
        // Search term matching (case insensitive)
        const termMatch = searchTerm 
          ? ['name', 'description', 'status'].some(key => {
              const value = auction[key] || '';
              return String(value).toLowerCase().includes(searchTerm.toLowerCase());
            })
          : true;

        // Filter matching
        const filterMatch = Object.keys(activeFilters).every(key => {
          return String(auction[key] || '').toLowerCase() === activeFilters[key].toLowerCase();
        });

        return termMatch && filterMatch;
      });
    }

    // Apply sorting
    results = applySorting(results, sortOption);

    setFilteredAuctions(results);
  }, [searchTerm, activeFilters, auctions, sortOption]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = (key: string, value: string) => {
    setActiveFilters(prev => {
      if (!value) {
        const newFilters = { ...prev };
        delete newFilters[key];
        return newFilters;
      }
      return { ...prev, [key]: value };
    });
  };

  const clearSearch = () => {
    setSearchTerm('');
    setActiveFilters({});
    setSortOption('none');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'short', // e.g., "May"
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true     // Optional: use false for 24-hour format
    });
  };
  

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="mb-8 flex items-center text-gray-600 hover:text-gray-900"
      >
        <FiArrowLeft className="mr-2" size={20} />
        <button onClick={() => navigate(-1)}>Back</button>
      </motion.div>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {searchTerm || Object.keys(activeFilters).length > 0 || sortOption !== "none"
            ? "Search Results"
            : "All Auctions"}
        </h1>
        <p className="text-gray-500">Find and manage your auctions here.</p>
      </div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative max-w-md mb-6"
      >
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by name, description, status..."
          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        {(searchTerm || Object.keys(activeFilters).length > 0 || sortOption !== "none") && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <FiX className="text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </motion.div>

      {/* Filter and Sort */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-3 mb-6"
      >
        <select
          onChange={(e) => handleFilter("status", e.target.value)}
          value={activeFilters.status || ""}
          className="px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="UPCOMING">Upcoming</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELED">Canceled</option>
        </select>
        <select
          onChange={(e) => setSortOption(e.target.value as SortOption)}
          value={sortOption}
          className="px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="none">Sort by</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="date-asc">Date: Oldest First</option>
          <option value="date-desc">Date: Newest First</option>
        </select>
      </motion.div>

      {/* Auction Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: { opacity: 1, scale: 1 },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredAuctions.map((auction) => (
            <motion.div
              key={auction.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(`/auction/${auction.id}`)}
              className={`relative p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-md border ${
                statusColors[auction.status]?.border || "border-gray-200"
              } hover:shadow-lg transition`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">{auction.name}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    statusColors[auction.status]?.bg || "bg-gray-100"
                  } ${statusColors[auction.status]?.text || "text-gray-800"}`}
                >
                  {auction.status}
                </span>
              </div>
              <p className="text-sm text-gray-700 font-medium line-clamp-2 mb-4">
                {auction.description}
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Start Date</p>
                  <p className="font-semibold">{formatDate(auction.startDate)}</p>
                </div>
                <div>
                  <p className="text-gray-500">End Date</p>
                  <p className="font-semibold">{formatDate(auction.endDate)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
    </Layout>
  );
};

export default AuctionListPage;