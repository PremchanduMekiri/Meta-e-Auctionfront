import React from 'react';
import { Bell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminHeaderProps {
  notificationCount: number;
  onNotificationClick: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ notificationCount, onNotificationClick }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminId');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminName');
    navigate('/');
  };
  

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white shadow">
      <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      <div className="flex items-center gap-4">
        {/* <button onClick={onNotificationClick} className="relative">
          <Bell className="w-6 h-6 text-gray-700" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
              {notificationCount}
            </span>
          )}
        </button> */}
        <button
          onClick={handleLogout}
          className="flex items-center text-sm text-red-600 hover:text-red-800"
        >
          <LogOut className="w-5 h-5 mr-1" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminHeader;
