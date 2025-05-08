
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import NotificationsPanel from '../components/dashboard/NotificationsPanel';
import { FaChartLine, FaUsers, FaHammer, FaCheckCircle, FaGavel, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import { FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';

// Define the User type
interface User {
  id: string;
  username: string;
  email: string;
  status: string;
  active?: number;
}

// Define the Auction type (aligned with CompletedAuctionDetailPage)
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

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Authentication check
  useEffect(() => {
    const adminData = localStorage.getItem('adminId');
    if (!adminData) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  // Stats
  const [stats] = useState({
    totalAuctions: 24,
    activeAuctions: 5,
    completedAuctions: 19,
    totalUsers: 42,
    revenue: '$28,750',
  });

  // Auction form data
  const [auctionData, setAuctionData] = useState({
    name: '',
    description: '',
    startingPrice: '',
    startDate: '',
    endDate: '',
    status: 'ACTIVE',
    highestBidderId: null,
    highestBidAmount: null,
    bidId: null,
    createdByAdminId: parseInt(localStorage.getItem('adminId') || '1', 10),
    createdAt: new Date().toISOString(),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Pagination states
  const [allAuctionsPage, setAllAuctionsPage] = useState(1);
  const [completedAuctionsPage, setCompletedAuctionsPage] = useState(1);
  const [auctionsPerPage] = useState(6);

  // Auction and user states
  const [allAuctions, setAllAuctions] = useState<Auction[]>([]);
  const [currentAuctions, setCurrentAuctions] = useState<Auction[]>([]);
  const [viewAllUsers, setViewAllUsers] = useState<User[]>([]);
  const [ended, setEnded] = useState<Auction[]>([]);
  const [newAuctions, setNewAuctions] = useState<Auction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [sortOption, setSortOption] = useState('');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setAllAuctionsPage(1);
    setCompletedAuctionsPage(1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAuctionData({ ...auctionData, [name]: value });
  };

  const formatDateTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'N/A';
      }
      return date.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch (err) {
      console.error(`Error parsing date: ${dateString}`, err);
      return 'N/A';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('https://metaauction.onrender.com/admin/inserting/auction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...auctionData,
          startingPrice: parseFloat(auctionData.startingPrice) || 0,
        }),
      });

      if (response.ok) {
        setSuccessMessage('Auction created successfully!');
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        setAuctionData({
          name: '',
          description: '',
          startingPrice: '',
          startDate: '',
          endDate: '',
          status: 'ACTIVE',
          highestBidderId: null,
          highestBidAmount: null,
          bidId: null,
          createdByAdminId: parseInt(localStorage.getItem('adminId') || '1', 10),
          createdAt: new Date().toISOString(),
        });
        // Refetch auctions instead of reloading
        await fetchAllAuctions();
        await fetchCurrentAuctions();
        await fetchEndedAuctions();
        await fetchUpcomingAuctions();
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to create auction.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while submitting the form.');
      console.error('Error submitting auction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch all auctions
  const fetchAllAuctions = async () => {
    try {
      const res = await axios.get('https://metaauction.onrender.com/auction/auctions');
      setAllAuctions(res.data);
    } catch (error) {
      console.error('Error fetching auctions:', error);
      setErrorMessage('Failed to fetch auctions.');
    }
  };

  // Fetch current auctions
  const fetchCurrentAuctions = async () => {
    try {
      const res = await axios.get('https://metaauction.onrender.com/auction/runningAuctions');
      setCurrentAuctions(res.data);
    } catch (error) {
      console.error('Error fetching current auctions:', error);
      setErrorMessage('Failed to fetch current auctions.');
    }
  };

  // Fetch all users
  const fetchViewAllUsers = async () => {
    try {
      const res = await axios.get('https://metaauction.onrender.com/admin/users');
      setViewAllUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setErrorMessage('Failed to fetch users.');
    }
  };

  // Fetch ended auctions
  const fetchEndedAuctions = async () => {
    try {
      const res = await axios.get('https://metaauction.onrender.com/auction/endedAuctions');
      setEnded(res.data);
    } catch (error) {
      console.error('Error fetching ended auctions:', error);
      setErrorMessage('Failed to fetch ended auctions.');
    }
  };

  // Fetch upcoming auctions
  const fetchUpcomingAuctions = async () => {
    try {
      const res = await axios.get('https://metaauction.onrender.com/auction/upcomingAuctions');
      setNewAuctions(res.data);
    } catch (error) {
      console.error('Error fetching upcoming auctions:', error);
      setErrorMessage('Failed to fetch upcoming auctions.');
    }
  };

  useEffect(() => {
    fetchAllAuctions();
    fetchCurrentAuctions();
    fetchViewAllUsers();
    fetchEndedAuctions();
    fetchUpcomingAuctions();
  }, []);

  // Handle user status change
  const handleStatusChange = async (userId: string, newStatus: string) => {
    const confirmed = window.confirm(`Are you sure you want to ${newStatus} this user?`);
    if (!confirmed) return;

    try {
      let response;
      if (newStatus === 'active') {
        response = await axios.post(`https://metaauction.onrender.com/admin/active/user/${userId}`, {}, {
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        response = await axios.delete(`https://metaauction.onrender.com/admin/delete/user/${userId}`, {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (response.status === 200) {
        setViewAllUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.id === userId ? { ...u, active: newStatus === 'active' ? 1 : 0 } : u
          )
        );
        console.log(`${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)} user successfully`);
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Failed to ${newStatus} user:`, error);
      setErrorMessage(`Failed to ${newStatus} user. Please try again.`);
    }
  };

  // Handle auction deletion
  const handleDeletes = async (auction: Auction) => {
    const confirmed = window.confirm(`Are you sure you want to delete auction "${auction.name}"?`);
    if (!confirmed) return;

    try {
      const response = await axios.delete('https://metaauction.onrender.com/admin/delete/auction', {
        data: { id: auction.id },
        withCredentials: true,
      });
      console.log('Auction deleted successfully:', response.data);
      setAllAuctions((prev) => prev.filter((a) => a.id !== auction.id));
      setCurrentAuctions((prev) => prev.filter((a) => a.id !== auction.id));
      setNewAuctions((prev) => prev.filter((a) => a.id !== auction.id));
      setEnded((prev) => prev.filter((a) => a.id !== auction.id));
      setSuccessMessage('Auction deleted successfully');
    } catch (error) {
      console.error('Error deleting auction:', error);
      setErrorMessage('Failed to delete auction. Please try again.');
    }
  };

  // Handle auction update
  const handleUpdate = (auction: Auction) => {
    navigate('/UpdateAuctionForm', { state: { auction } });
  };

  // View auction details
  const viewAuction = (auctionId: number) => () => {
    navigate(`/auction-details/${auctionId}`);
  };

  // Handle card click for completed auctions
  const handleCardClick = (auction: Auction) => {
    navigate(`/completed-auction/${auction.id}`);
  };

  // Filtering & Sorting Logic
  const filterAndSortAuctions = (auctions: Auction[]) => {
    return auctions
      .filter((auction) => {
        const matchesTerm =
          auction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          auction.id.toString().includes(searchTerm);
        const matchesMinPrice = minPrice === '' || auction.startingPrice >= parseFloat(minPrice);
        return matchesTerm && matchesMinPrice;
      })
      .sort((a, b) => {
        switch (sortOption) {
          case 'startDate':
            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
          case 'endDate':
            return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
          case 'highPrice':
            return b.startingPrice - a.startingPrice;
          case 'lowPrice':
            return a.startingPrice - b.startingPrice;
          default:
            return 0;
        }
      });
  };

  const filteredAllAuctions = filterAndSortAuctions(allAuctions);
  const filteredCurrentAuctions = filterAndSortAuctions(currentAuctions);
  const filteredEndedAuctions = filterAndSortAuctions(ended);
  const filteredNewAuctions = filterAndSortAuctions(newAuctions);

  const filteredUsers = viewAllUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toString().includes(searchTerm)
  );

  // Pagination Logic
  const paginateAuctions = (auctions: Auction[], page: number) => {
    const indexOfLast = page * auctionsPerPage;
    const indexOfFirst = indexOfLast - auctionsPerPage;
    return auctions.slice(indexOfFirst, indexOfLast);
  };

  const currentAllAuctions = paginateAuctions(filteredAllAuctions, allAuctionsPage);
  const currentCompletedAuctions = paginateAuctions(filteredEndedAuctions, completedAuctionsPage);

  const totalAllAuctionsPages = Math.ceil(filteredAllAuctions.length / auctionsPerPage);
  const totalCompletedAuctionsPages = Math.ceil(filteredEndedAuctions.length / auctionsPerPage);

  const paginateAllAuctions = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalAllAuctionsPages) {
      setAllAuctionsPage(pageNumber);
    }
  };

  const paginateCompletedAuctions = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalCompletedAuctionsPages) {
      setCompletedAuctionsPage(pageNumber);
    }
  };

  // Render pagination controls
  const renderPagination = (currentPage: number, totalPages: number, paginate: (page: number) => void) => {
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
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            currentPage === 1
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-cyan-500 text-white hover:bg-cyan-600'
          }`}
        >
          Previous
        </button>
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              currentPage === number
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-cyan-500 hover:text-white'
            }`}
          >
            {number}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            currentPage === totalPages
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-cyan-500 text-white hover:bg-cyan-600'
          }`}
        >
          Next
        </button>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 p-6 bg-gray-50 animate_animated animate_fadeIn">
            <div className="text-3xl font-bold text-gray-800">
              Scrap Auction Admin Dashboard
              <p className="text-gray-600 text-lg font-normal mt-2">
                Monitor and manage your scrap auction platform
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <motion.div
                className="bg-white p-6 rounded-xl shadow-md border-l-4 border-cyan-500"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center space-x-4">
                  <FaHammer className="text-cyan-500 text-3xl" />
                  <div>
                    <p className="text-gray-600">Active Auctions</p>
                    <p className="text-3xl font-bold text-gray-800">{filteredCurrentAuctions.length}</p>
                  </div>
                </div>
              </motion.div>
              <motion.div
                className="bg-white p-6 rounded-xl shadow-md border-l-4 border-teal-500"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center space-x-4">
                  <FaCheckCircle className="text-teal-500 text-3xl" />
                  <div>
                    <p className="text-gray-600">Completed Auctions</p>
                    <p className="text-3xl font-bold text-gray-800">{filteredEndedAuctions.length}</p>
                  </div>
                </div>
              </motion.div>
              <motion.div
                className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center space-x-4">
                  <FaGavel className="text-yellow-500 text-3xl" />
                  <div>
                    <p className="text-gray-600">Total Auctions</p>
                    <p className="text-3xl font-bold text-gray-800">{filteredAllAuctions.length}</p>
                  </div>
                </div>
              </motion.div>
              <motion.div
                className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center space-x-4">
                  <FaCalendarAlt className="text-purple-500 text-3xl" />
                  <div>
                    <p className="text-gray-600">Upcoming Auctions</p>
                    <p className="text-3xl font-bold text-gray-800">{filteredNewAuctions.length}</p>
                  </div>
                </div>
              </motion.div>
              <motion.div
                className="bg-white p-6 rounded-xl shadow-md border-l-4 border-indigo-500"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center space-x-4">
                  <FaUsers className="text-indigo-500 text-3xl" />
                  <div>
                    <p className="text-gray-600">Total Users</p>
                    <p className="text-3xl font-bold text-gray-800">{filteredUsers.length}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        );
      case 'current-bids':
        return (
          <div className="bg-cyan-50 p-6 md:p-10 rounded-2xl shadow-lg animate_animated animate_fadeIn">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-8 flex items-center gap-2">Current Auctions</h2>
            <div className="flex flex-wrap gap-4 mb-8">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="🔍 Search by name or ID"
                className="px-4 py-3 border border-gray-300 rounded-md w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200 bg-white"
              />
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder=" Min Price"
                className="px-4 py-3 border border-gray-300 rounded-md w-full sm:w-1/4 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200 bg-white"
              />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-md w-full sm:w-1/4 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200 bg-white"
              >
                <option value="">Sort By</option>
                <option value="startDate">Starting Date</option>
                <option value="endDate">Ending Date</option>
                <option value="highPrice">Highest Price</option>
                <option value="lowPrice">Lowest Price</option>
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 overflow-y-auto max-h-[500px] pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
              {filteredCurrentAuctions.length > 0 ? (
                filteredCurrentAuctions.map((auction, index) => (
                  <motion.div
                    key={auction.id}
                    className="bg-white border border-cyan-200 p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link to={`/completed-auction/${auction.id}`} className="flex flex-col flex-grow">
                      <div className="mb-4">
                        <h3 className="text-xl font-extrabold text-gray-800 mb-1 group-hover:text-cyan-600">{auction.name}</h3>
                        <p className="text-sm text-gray-600">{auction.description}</p>
                      </div>
                      <div className="mt-auto">
                        <p className="text-lg font-extrabold text-teal-600 mb-1">₹{auction.startingPrice.toFixed(2)}</p>
                        <p className="text-xs text-gray-600">
                          Ends: {formatDateTime(auction.endDate)}
                        </p>
                      </div>
                    </Link>
                    <div className="flex gap-4 mt-6">
                      <button
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-medium rounded-md transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdate(auction);
                        }}
                      >
                        Update
                      </button>
                      <button
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-medium rounded-md transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletes(auction);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-lg text-gray-600 col-span-full animate_animated animate_fadeIn">
                  No current auctions available.
                </p>
              )}
            </div>
          </div>
        );
      case 'upload-bid':
        return (
          <div className="bg-cyan-50/90 backdrop-blur-md border border-cyan-200 p-8 sm:p-10 rounded-2xl shadow-2xl mt-10 max-w-3xl mx-auto transition-all duration-500 ease-in-out transform hover:scale-105 animate_animated animate_fadeIn">
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
            <h3 classPeer className="text-3xl font-semibold mb-8 text-center text-gray-800 tracking-tight">Create New Auction</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="bg-red-100 text-red-700 px-4 py-3 rounded-md text-sm shadow-md animate_animated animate_shakeX">{errorMessage}</div>
              )}
              {successMessage && (
                <div className="bg-green-100 text-green-700 px-4 py-3 rounded-md text-sm shadow-md animate_animated animate_tada">{successMessage}</div>
              )}
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">Auction Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={auctionData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all duration-200 bg-white"
                  placeholder="e.g. Vintage Clock"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={auctionData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-none transition-all duration-200 bg-white"
                  placeholder="Provide brief details about the item"
                  rows={4}
                  required
                />
              </div>
              <div>
                <label htmlFor="startingPrice" className="block mb-2 text-sm font-medium text-gray-700">Starting Price (₹)</label>
                <input
                  type="number"
                  id="startingPrice"
                  name="startingPrice"
                  value={auctionData.startingPrice}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all duration-200 bg-white"
                  min={0}
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label htmlFor="startDate" className="block mb-2 text-sm font-medium text-gray-700">Start Date & Time</label>
                <input
                  type="datetime-local"
                  id="startDate"
                  name="startDate"
                  value={auctionData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all duration-200 bg-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block mb-2 text-sm font-medium text-gray-700">End Date & Time</label>
                <input
                  type="datetime-local"
                  id="endDate"
                  name="endDate"
                  value={auctionData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all duration-200 bg-white"
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 text-white font-semibold rounded-lg text-lg shadow-md transition-all duration-300 ease-in-out transform ${
                    isSubmitting ? 'bg-cyan-300 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-700 hover:scale-[1.05]'
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Create Auction'}
                </button>
              </div>
            </form>
          </div>
        );
      case 'user-details':
        return (
          <div className="p-6 min-h-screen bg-gray-50 animate_animated animate_fadeIn">
            <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">User Management</h1>
            <div className="mb-10 max-w-xl mx-auto">
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-3 rounded-full shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-700 bg-white"
              />
            </div>
            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transform transition-transform hover:-translate-y-1 border border-cyan-200 p-6 h-full overflow-hidden flex flex-col justify-between"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex flex-col gap-4 overflow-hidden">
                      <div className="flex justify-between items-start flex-wrap overflow-hidden">
                        <div className="min-w-0">
                          <h2 className="text-xl font-semibold text-gray-800 truncate">{user.username}</h2>
                          <p className="text-sm text-gray-600 truncate">{user.email}</p>
                        </div>
                        <span
                          className={`text-xs font-medium px-3 py-1 mt-2 rounded-full ${
                            user.status?.toLowerCase() === 'verified'
                              ? 'bg-teal-100 text-teal-700'
                              : user.status?.toLowerCase() === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {user.status || 'Unknown'}
                        </span>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Account Visibility</p>
                        <div className="flex items-center space-x-6 overflow-hidden">
                          <label className="flex items-center cursor-pointer space-x-2">
                            <input
                              type="radio"
                              name={`status-${user.id}`}
                              checked={user.active === 1}
                              onChange={() => handleStatusChange(user.id, 'active')}
                              className="peer hidden"
                            />
                            <div className="w-4 h-4 rounded-full border-2 border-cyan-500 peer-checked:bg-cyan-500 transition-all"></div>
                            <span className="text-sm text-gray-700">Active</span>
                          </label>
                          <label className="flex items-center cursor-pointer space-x-2">
                            <input
                              type="radio"
                              name={`status-${user.id}`}
                              checked={user.active === 0}
                              onChange={() => handleStatusChange(user.id, 'inactive')}
                              className="peer hidden"
                            />
                            <div className="w-4 h-4 rounded-full border-2 border-yellow-500 peer-checked:bg-yellow-500 transition-all"></div>
                            <span className="text-sm text-gray-700">Inactive</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="pt-6">
                      <Link
                        to={`/VerifingDocuments/${user.id}`}
                        className="block w-full text-center px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition"
                      >
                        View Documents
                      </Link>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-gray-600 text-lg col-span-full animate_animated animate_fadeIn">No matching users found.</p>
              )}
            </div>
          </div>
        );
      case 'completed-auctions':
        return (
          <div className="min-h-screen py-12 px-6 bg-cyan-50 overflow-hidden animate_animated animate_fadeIn">
            <div className="max-w-7xl mx-auto">
              <h3 className="text-4xl font-extrabold mb-10 text-center text-gray-800 tracking-tight drop-shadow-md">Completed Auctions</h3>
              <div className="flex flex-wrap gap-4 mb-10 justify-center items-center">
                <input
                  type="text"
                  placeholder="🔍 Search by name or ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-5 py-3 border border-gray-300 rounded-xl w-full sm:w-[300px] shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                />
                <input
                  type="number"
                  placeholder=" Min Price"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="px-5 py-3 border border-gray-300 rounded-xl w-full sm:w-[180px] shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                />
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="px-5 py-3 border border-gray-300 rounded-xl w-full sm:w-[200px] shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                >
                  <option value="">🔃 Sort By</option>
                  <option value="endDate">📅 Ending Date</option>
                  <option value="highPrice">⬆ Highest Price</option>
                  <option value="lowPrice">⬇ Lowest Price</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {currentCompletedAuctions.length > 0 ? (
                  currentCompletedAuctions.map((auction, index) => (
                    <motion.div
                      key={auction.id}
                      className="relative bg-white/90 backdrop-blur-lg border border-cyan-200 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-transform duration-300 transform hover:-translate-y-1 overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <h4 className="text-xl font-semibold text-gray-800 mb-2 truncate">{auction.name}</h4>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{auction.description}</p>
                      <div className="flex justify-between items-end mt-6">
                        <div>
                          <p className="text-xl font-bold text-teal-600">₹{auction.startingPrice.toFixed(2)}</p>
                          <p className="text-xs text-gray-600 mt-1">⏱ {formatDateTime(auction.endDate)}</p>
                        </div>
                        <Link to={`/completed-auction/${auction.id}`}>
                          <button className="bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-md hover:scale-105 hover:shadow-xl transition duration-200">
                            View →
                          </button>
                        </Link>
                      </div>
                      <div className="flex justify-end gap-3 mt-6">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdate(auction);
                          }}
                          className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white text-sm font-medium rounded-md transition-all duration-300"
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                          Update
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletes(auction);
                          }}
                          className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white text-sm font-medium rounded-md transition-all duration-300"
                        >
                          <TrashIcon className="h-5 w-5" />
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center text-gray-600 text-lg col-span-full animate_animated animate_fadeIn">🚫 No auctions found.</p>
                )}
              </div>
              {totalCompletedAuctionsPages > 1 && renderPagination(completedAuctionsPage, totalCompletedAuctionsPages, paginateCompletedAuctions)}
            </div>
          </div>
        );
      case 'all-auctions':
        return (
          <div className="p-8 bg-gray-50 min-h-screen animate_animated animate_fadeIn">
            <motion.h2
              className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-10 tracking-wide"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Auction Dashboard
            </motion.h2>
            <motion.div
              className="flex flex-wrap gap-4 justify-center mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search auctions..."
                className="px-4 py-3 w-full sm:w-64 md:w-72 rounded-lg border border-gray-300 shadow-sm focus:ring focus:ring-cyan-500 focus:outline-none bg-white"
              />
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min Price"
                className="px-4 py-3 w-full sm:w-40 md:w-52 rounded-lg border border-gray-300 shadow-sm focus:ring focus:ring-teal-500 focus:outline-none bg-white"
              />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="px-4 py-3 w-full sm:w-48 md:w-60 rounded-lg border border-gray-300 shadow-sm focus:ring focus:ring-cyan-500 focus:outline-none bg-white"
              >
                <option value="">Sort By</option>
                <option value="startDate">Starting Date</option>
                <option value="endDate">Ending Date</option>
                <option value="highPrice">Highest Price</option>
                <option value="lowPrice">Lowest Price</option>
              </select>
            </motion.div>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {currentAllAuctions.length > 0 ? (
                currentAllAuctions.map((auction, index) => (
                  <motion.div
                    key={auction.id}
                    className="p-6 bg-white rounded-lg shadow-md border border-cyan-200 group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{
                      scale: 1.03,
                      boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <h4 className="text-lg font-semibold text-gray-800 truncate mb-2">{auction.name}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">{auction.description}</p>
                    <div className="flex justify-between items-center">
                      <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                        <p className="text-lg font-bold text-teal-600">₹{auction.startingPrice.toFixed(2)}</p>
                        <p className="text-xs text-gray-600">Ends: {formatDateTime(auction.endDate)}</p>
                      </motion.div>
                      <div className="flex gap-3 items-center">
                        <motion.div whileHover={{ scale: 1.2 }} transition={{ type: 'spring', stiffness: 200 }}>
                          <Link to={`/completed-auction/${auction.id}`}>
                            <FiEye size={20} className="text-gray-600 hover:text-cyan-500 transition duration-150" title="View Auction" />
                          </Link>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.2 }} transition={{ type: 'spring', stiffness: 200 }}>
                          <FiEdit2
                            size={20}
                            className="text-gray-600 hover:text-green-500 transition duration-150 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdate(auction);
                            }}
                            title="Update Auction"
                          />
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.2 }} transition={{ type: 'spring', stiffness: 200 }}>
                          <FiTrash2
                            size={20}
                            className="text-gray-600 hover:text-red-500 transition duration-150 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletes(auction);
                            }}
                            title="Delete Auction"
                          />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.p
                  className="text-center text-gray-600 text-lg col-span-full animate_animated animate_fadeIn"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  🚫 No auctions found.
                </motion.p>
              )}
            </motion.div>
            {totalAllAuctionsPages > 1 && renderPagination(allAuctionsPage, totalAllAuctionsPages, paginateAllAuctions)}
          </div>
        );
      case 'upcomming-auctions':
        return (
          <div className="min-h-screen py-12 px-6 bg-teal-50 animate_animated animate_fadeIn">
            <div className="max-w-7xl mx-auto">
              <h3 className="text-4xl font-extrabold mb-10 text-center text-gray-800 tracking-tight drop-shadow-md">Upcoming Auctions</h3>
              <div className="flex flex-wrap gap-4 mb-10 justify-center items-center">
                <input
                  type="text"
                  placeholder="🔍 Search by name or ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-5 py-3 border border-gray-300 rounded-xl w-full sm:w-[300px] shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all bg-white"
                />
                <input
                  type="number"
                  placeholder=" Min Price"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="px-5 py-3 border border-gray-300 rounded-xl w-full sm:w-[180px] shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all bg-white"
                />
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="px-5 py-3 border border-gray-300 rounded-xl w-full sm:w-[200px] shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all bg-white"
                >
                  <option value="">🔃 Sort By</option>
                  <option value="endDate">📅 Ending Date</option>
                  <option value="highPrice">⬆ Highest Price</option>
                  <option value="lowPrice">⬇ Lowest Price</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredNewAuctions.length > 0 ? (
                  filteredNewAuctions.map((auction, index) => (
                    <motion.div
                      key={auction.id}
                      className="bg-white/90 backdrop-blur-xl border border-teal-200 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-transform duration-300 transform hover:-translate-y-1 overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <h4 className="text-xl font-semibold text-gray-800 mb-2 truncate">{auction.name}</h4>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{auction.description}</p>
                      <div className="flex justify-between items-end mt-6">
                        <div>
                          <p className="text-xl font-bold text-teal-600">₹{auction.startingPrice.toFixed(2)}</p>
                          <p className="text-xs text-gray-600 mt-1">⏱ {formatDateTime(auction.endDate)}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            title="Update Auction"
                            className="p-2 bg-green-500 hover:bg-green-600 rounded-full text-white transition"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdate(auction);
                            }}
                          >
                            <PencilSquareIcon className="h-5 w-5" />
                          </button>
                          <button
                            title="Delete Auction"
                            className="p-2 bg-red-500 hover:bg-red-600 rounded-full text-white transition"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletes(auction);
                            }}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center text-gray-600 text-lg col-span-full animate_animated animate_fadeIn">🚫 No auctions found.</p>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onTabChange={handleTabChange} />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 p-6 overflow-y-auto">{renderContent()}</div>
        {showNotifications && <NotificationsPanel />}
      </div>
    </div>
  );
};

export default AdminDashboard;