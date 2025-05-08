import React from 'react';
import { LogOut } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';

interface AdminHeaderProps {
  notificationCount: number;
  onNotificationClick: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = () => {

  

  return (
    <div className="w-full z-10 flex items-center justify-between px-4 py-3 bg-white shadow flex-wrap">
      <h1 className="text-lg font-semibold truncate max-w-[60%] sm:max-w-none">
        Admin Dashboard
      </h1>

    
    </div>
  );
};

export default AdminHeader;
