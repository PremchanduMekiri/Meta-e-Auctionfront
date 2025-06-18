
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSearch, FiX } from 'react-icons/fi';
import { Package } from 'lucide-react';
import Layout from '../components/layout/Layout';
import axios from 'axios';
import { motion } from 'framer-motion';

// Define the Auction type (aligned with AdminDashboard)
interface Auction {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  startingPrice: number;
  highestBidAmount: number | null;
  highestBidderId: number | null;
  status: 'ACTIVE' | 'COMPLETED' | 'UPCOMING' | 'CANCELED';
  bidId: number | null;
  createdByAdminId: number;
  createdAt: string;
}

const statusColors: Record<Auction['status'], { bg: string; text: string; border: string }> = {
  ACTIVE: { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-200' },
  COMPLETED: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
  UPCOMING: { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-200' },
  CANCELED: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
};

const statusOrder: Record<Auction['status'], number> = {
  ACTIVE: 1,
  UPCOMING: 2,
  COMPLETED: 3,
  CANCELED: 4,
};

type SortOption = 'price-asc' | 'price-desc' | 'date-asc' | 'date-desc' | 'none';

const AuctionListPage: React.FC = () => {
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [filteredAuctions, setFilteredAuctions] = useState<Auction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [sortOption, setSortOption] = useState<SortOption>('none');
  const [currentPage, setCurrentPage] = useState(1);
  const [auctionsPerPage] = useState(6);

  // Authentication check
  useEffect(() => {
    const adminId = localStorage.getItem('adminId');
    if (!adminId) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  // Fetch all auctions
  const fetchAuctions = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await axios.get('https://meta-e-auction.infororg.com/auction/auctions');
      const sortedAuctions = res.data.sort((a: Auction, b: Auction) =>
        statusOrder[a.status] - statusOrder[b.status]
      );
      setAuctions(sortedAuctions);
      setFilteredAuctions(sortedAuctions);
    } catch (error) {
      console.error('Error fetching auctions:', error);
      setErrorMessage('Failed to fetch auctions. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuctions();
  }, [fetchAuctions]);

  // Apply sorting
  const applySorting = useCallback((auctions: Auction[], option: SortOption): Auction[] => {
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
  }, []);

  // Search and filter logic
  useEffect(() => {
    let results = auctions;

    // Apply filters
    if (searchTerm || Object.keys(activeFilters).length > 0) {
      results = auctions.filter((auction) => {
        // Search term matching (case insensitive)
        const termMatch = searchTerm
          ? ['name', 'description', 'status'].some((key) => {
              const value = auction[key] || '';
              return String(value).toLowerCase().includes(searchTerm.toLowerCase());
            })
          : true;

        // Filter matching
        const filterMatch = Object.keys(activeFilters).every((key) => {
          return String(auction[key] || '').toLowerCase() === activeFilters[key].toLowerCase();
        });

        return termMatch && filterMatch;
      });
    }

    // Apply sorting
    results = applySorting(results, sortOption);

    setFilteredAuctions(results);
    setCurrentPage(1); // Reset to page 1 when filters or sorting change
  }, [searchTerm, activeFilters, auctions, sortOption, applySorting]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = (key: string, value: string) => {
    setActiveFilters((prev) => {
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
    setCurrentPage(1);
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'N/A';
      }
      return date.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch (err) {
      console.error(`Error parsing date: ${dateString}`, err);
      return 'N/A';
    }
  };

  // Pagination logic
  const indexOfLastAuction = currentPage * auctionsPerPage;
  const indexOfFirstAuction = indexOfLastAuction - auctionsPerPage;
  const currentAuctions = filteredAuctions.slice(indexOfFirstAuction, indexOfLastAuction);
  const totalPages = Math.ceil(filteredAuctions.length / auctionsPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Render pagination controls
  const renderPagination = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center items-center gap-2 mt-8">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            currentPage === 1 || isLoading
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-teal-500 text-white hover:bg-teal-600'
          }`}
        >
          Previous
        </button>
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            disabled={isLoading}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              currentPage === number
                ? 'bg-teal-600 text-white'
                : isLoading
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-teal-500 hover:text-white'
            }`}
        >
            {number}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            currentPage === totalPages || isLoading
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-teal-500 text-white hover:bg-teal-600'
          }`}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
        {/* Error Message */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-100 text-red-700 px-4 py-3 rounded-md text-sm shadow-md"
          >
            {errorMessage}
          </motion.div>
        )}

        {/* Back Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="mb-8 flex items-center text-teal-500 hover:text-teal-700 cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <FiArrowLeft className="mr-2" size={20} />
          <span>Back</span>
        </motion.div>

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {searchTerm || Object.keys(activeFilters).length > 0 || sortOption !== 'none'
              ? 'Search Results'
              : 'All Auctions'}
          </h1>
          <p className="text-gray-500">Find and manage your auctions here.</p>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative max-w-md mb-6"
        >
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-teal-500" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by name, description, status..."
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 bg-white"
          />
          {(searchTerm || Object.keys(activeFilters).length > 0 || sortOption !== 'none') && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              title="Clear search and filters"
            >
              <FiX className="text-teal-500 hover:text-teal-700" />
            </button>
          )}
        </motion.div>

        {/* Filter and Sort */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex flex-wrap gap-3 mb-6"
        >
          <select
            onChange={(e) => handleFilter('status', e.target.value)}
            value={activeFilters.status || ''}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 bg-white"
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
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 bg-white"
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
          <motion.div
            className="flex justify-center items-center py-20 bg-gray-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Package className="h-7 w-7 text-cyan-600 animate-spin" />
            <span className="ml-2 text-gray-600">Loading auctions...</span>
          </motion.div>
        ) : currentAuctions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center text-gray-600 text-lg py-20"
          >
            No auctions found.
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {currentAuctions.map((auction, index) => (
                <motion.div
                  key={auction.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/auction/${auction.id}`)}
                  className={`relative p-5 bg-white rounded-lg shadow-md border ${
                    statusColors[auction.status]?.border || 'border-cyan-200'
                  } hover:shadow-lg transition cursor-pointer`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800 truncate">{auction.name}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        statusColors[auction.status]?.bg || 'bg-gray-100'
                      } ${statusColors[auction.status]?.text || 'text-gray-800'}`}
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
                    <div>
                      <p className="text-gray-500">Starting Price</p>
                      <p className="font-semibold">₹{auction.startingPrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Highest Bid</p>
                      <p className="font-semibold">
                        {auction.highestBidAmount ? `₹${auction.highestBidAmount.toFixed(2)}` : 'No bids'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            {totalPages > 1 && renderPagination()}
          </>
        )}
      </div>
    </Layout>
  );
};

export default AuctionListPage;