import React from 'react';
import { Bell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface AdminHeaderProps {
  notificationCount: number;
  onNotificationClick: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    try {
      logout();
       // Clear session data and reset auth state
      navigate('/', { replace: true }); // Redirect to homepage
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/', { replace: true }); // Redirect even if logout fails
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center px-6 py-4 bg-white shadow gap-y-2 justify-between relative">
      <h1 className="text-xl font-semibold text-center md:text-left">Admin Dashboard</h1>

      <button
        onClick={handleLogout}
        className="flex items-center text-sm text-red-600 hover:text-red-800 px-4 py-2 border border-red-600 rounded-md transition duration-200 ease-in-out hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50 absolute right-[90px] top-4"
      >
        <LogOut className="w-5 h-5 mr-1" />
        Logout
      </button>
    </div>
  );
};

export default AdminHeader;