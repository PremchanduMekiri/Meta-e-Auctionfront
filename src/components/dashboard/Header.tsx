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
//     <div className="flex flex-col md:flex-row items-center  px-6 py-4 bg-white shadow gap-y-2 justify-between">
//   <h1 className="text-xl font-semibold text-center md:text-left">Admin Dashboard</h1>

// <button
//       onClick={handleLogout}
//       className="flex items-center text-sm text-red-600 hover:text-red-800 margin-left-4 px-4 py-2 border border-red-600 rounded-md transition duration-200 ease-in-out hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50 topm-4"
//     >
//       <LogOut className="w-5 h-5 mr-1" />
//       Logout
//     </button>
   
//   <div className="flex items-center ">
//     {/* Uncomment this block if you want notifications */}
//     {/* <button onClick={onNotificationClick} className="relative">
//       <Bell className="w-6 h-6 text-gray-700" />
//       {notificationCount > 0 && (
//         <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
//           {notificationCount}
//         </span>
//       )}
//     </button> */}
    
    
//   </div>
  
// </div>
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
