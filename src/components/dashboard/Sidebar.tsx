
import React, { useState } from 'react';
import {
  FaUpload,
  FaEye,
  FaCheckCircle,
  FaUsers,
  FaList,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaCalendarAlt,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    try {
      // Clear session and local storage
      sessionStorage.clear();
      localStorage.clear();
  
      // Optional: Clear IndexedDB if used
      if ('indexedDB' in window) {
        indexedDB.databases?.().then((dbs) => {
          dbs.forEach((db) => {
            indexedDB.deleteDatabase(db.name || '');
          });
        });
      }
  
      // Optional: Unregister all service workers (if using them)
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((registration) => {
            registration.unregister();
          });
        });
      }
  
      logout(); // Your auth context
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/', { replace: true });
    }
  };
  
  

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const buttonClass = (tabName: string) =>
    `w-full text-left px-4 py-2 font-bold rounded ${
      activeTab === tabName
        ? 'bg-blue-600 text-white'
        : 'hover:bg-green-500 hover:text-white text-white'
    }`;

  return (
    <div className="flex h-screen">
      {/* Mobile menu toggle button */}
      <button
        className="lg:hidden text-black p-4 absolute top-1 right-10 z-20"
        onClick={toggleSidebar}
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`w-64 bg-blue-800 text-white flex flex-col fixed top-0 left-0 bottom-0 lg:relative z-10 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Sidebar content */}
        <div className="flex-1 mt-16">
          <div className="flex items-center justify-center p-4 text-2xl font-semibold">
            Admin
          </div>
          <div className="space-y-2 px-2">
            {[
              'dashboard',
              'all-auctions',
              'upload-bid',
              'current-bids',
              'completed-auctions',
              'upcomming-auctions',
              'user-details',
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  onTabChange(tab);
                  setIsOpen(false); // Auto-close sidebar on mobile after tab click
                }}
                className={buttonClass(tab)}
              >
                {tab === 'all-auctions' && <FaList className="inline mr-2" />}
                {tab === 'upload-bid' && <FaUpload className="inline mr-2" />}
                {tab === 'current-bids' && <FaEye className="inline mr-2" />}
                {tab === 'completed-auctions' && (
                  <FaCheckCircle className="inline mr-2" />
                )}
                {tab === 'upcomming-auctions' && (
                  <FaCalendarAlt className="inline mr-2" />
                )}
                {tab === 'user-details' && <FaUsers className="inline mr-2" />}
                {tab.charAt(0).toUpperCase() +
                  tab.slice(1).replace(/-/g, ' ')}
              </button>
            ))}

            {/* Logout button directly under user-details */}
            <button
  onClick={handleLogout}
  className={buttonClass('logout')}
>
  <FaSignOutAlt className="inline mr-2" />
  Logout
</button>
          </div>
        </div>
      </div>

      {/* Main Content Placeholder */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isOpen ? 'ml-6' : 'ml-0'
        } h-full`}
        style={{ overflowX: 'hidden' }}
      >
        {/* Main content goes here */}
      </div>
    </div>
  );
};

export default Sidebar;
