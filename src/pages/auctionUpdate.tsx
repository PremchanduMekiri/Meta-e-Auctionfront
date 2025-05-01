import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdateAuctionForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const auctionFromState = location.state?.auction; // Get auction data passed via navigate state

  const [auction, setAuction] = useState<any>(auctionFromState || null); // If auction is passed, use it, otherwise null.

  // If no auction data passed from state, fetch auction details based on its id
  useEffect(() => {
    if (!auctionFromState) {
      const fetchAuction = async () => {
        try {
          const response = await axios.get(`https://metaauction.onrender.com/auction/${auction.id}`);
          setAuction(response.data);
        } catch (error) {
          console.error('Error fetching auction:', error);
        }
      };

      fetchAuction();
    }
  }, [auctionFromState]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Auction data being sent:", auction); // Log auction data to check for issues
  
    try {
      // Send the entire auction object for the update to the backend
      await axios.put('https://metaauction.onrender.com/admin/update/auction', auction);
      alert('Auction updated successfully');
      
      // Reload the current page (same route)
      navigate(0); // This forces a reload of the current page
    } catch (error) {
      console.error('Error updating auction:', error);
      alert('Failed to update auction');
    }
  };
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAuction({
      ...auction,
      [e.target.name]: e.target.value,
    });
  };

  // If no auction data is available, show loading state
  if (!auction) return <div>Loading...</div>;

  console.log("Auction data:", auction); // Log auction data to check for issues

  return (
    <div>
      {/* Navbar */}
      <div className="bg-blue-600 text-white p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)} // Go back to the previous page
              className="text-white hover:text-gray-200 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="space-x-4">
            <button onClick={() => navigate('/admin/auctions')} className="text-white hover:text-gray-200">Auctions</button>
            <button onClick={() => navigate('/admin/dashboard')} className="text-white hover:text-gray-200">Dashboard</button>
          </div>
        </div>
      </div>

      {/* Update Auction Form (Card Style) */}
      <div className="max-w-4xl mx-auto p-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Update Auction</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Auction Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={auction.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={auction.description}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label htmlFor="startingPrice" className="block text-sm font-medium text-gray-700">
                Starting Price
              </label>
              <input
                type="number"
                id="startingPrice"
                name="startingPrice"
                value={auction.startingPrice}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="datetime-local"
                id="startDate"
                name="startDate"
                value={auction.startDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="datetime-local"
                id="endDate"
                name="endDate"
                value={auction.endDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Update Auction
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateAuctionForm;
