import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSearch, FiX } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import axios from 'axios';

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
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <FiArrowLeft className="mr-2" size={20} />
            Back
          </button>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {searchTerm || Object.keys(activeFilters).length > 0 || sortOption !== 'none'
              ? 'Search Results' 
              : 'All Auctions'}
          </h1>
          
          {/* Modern Search Bar */}
          <div className="relative max-w-md mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search by name, description, status..."
              className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {(searchTerm || Object.keys(activeFilters).length > 0 || sortOption !== 'none') && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <FiX className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Filter and Sort Controls */}
          <div className="flex flex-wrap gap-3 mb-6">
            {/* Status Filter */}
            <select
              onChange={(e) => handleFilter('status', e.target.value)}
              value={activeFilters.status || ''}
              className="px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="UPCOMING">Upcoming</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELED">Canceled</option>
            </select>

            {/* Sort Options */}
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
          </div>

          {/* Active Filters/Sort */}
          {(Object.keys(activeFilters).length > 0 || sortOption !== 'none') && (
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {/* Active Filters */}
              {Object.entries(activeFilters).map(([key, value]) => (
                <div 
                  key={key} 
                  className={`flex items-center ${key === 'status' ? statusColors[value as keyof typeof statusColors]?.bg : 'bg-gray-100'} px-3 py-1 rounded-full text-sm`}
                >
                  <span className="capitalize">{key}: {value}</span>
                  <button 
                    onClick={() => handleFilter(key, '')}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ))}

              {/* Active Sort */}
              {sortOption !== 'none' && (
                <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
                  <span className="capitalize">
                    {sortOption === 'price-asc' && 'Price: Low to High'}
                    {sortOption === 'price-desc' && 'Price: High to Low'}
                    {sortOption === 'date-asc' && 'Date: Oldest First'}
                    {sortOption === 'date-desc' && 'Date: Newest First'}
                  </span>
                  <button 
                    onClick={() => setSortOption('none')}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              )}

              <button 
                onClick={clearSearch}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <p className="text-gray-600 mb-6">
          Showing {filteredAuctions.length} {filteredAuctions.length === 1 ? 'auction' : 'auctions'}
          {searchTerm && ` matching "${searchTerm}"`}
        </p>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          /* Auction Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAuctions.map((auction) => (
              <div
                key={auction.id}
                onClick={() => navigate(`/auction/${auction.id}`)}
                className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border ${
                  statusColors[auction.status]?.border || 'border-gray-200'
                } overflow-hidden`}
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      {auction.name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusColors[auction.status]?.bg || 'bg-gray-100'
                    } ${statusColors[auction.status]?.text || 'text-gray-800'}`}>
                      {auction.status}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {auction.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Start Date</p>
                      <p className="text-sm font-medium">{formatDate(auction.startDate)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">End Date</p>
                      <p className="text-sm font-medium">{formatDate(auction.endDate)}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t pt-4">
                    <div>
                      <p className="text-xs text-gray-500">Starting Price</p>
                      <p className="text-lg font-bold text-blue-600">
                        ₹{auction.startingPrice.toLocaleString()}
                      </p>
                    </div>
                    {auction.highestBidAmount && auction.status !== 'CANCELED' && (
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Highest Bid</p>
                        <p className="text-lg font-bold text-green-600">
                          ₹{auction.highestBidAmount.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {auction.status === 'CANCELED' && (
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Status</p>
                        <p className="text-sm font-medium text-red-600">Auction Canceled</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredAuctions.length === 0 && (
          <div className="text-center py-12">
            <FiSearch className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No auctions found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? `No results for "${searchTerm}"` : 'No auctions match your filters'}
            </p>
            <button
              onClick={clearSearch}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Clear search and filters
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AuctionListPage;