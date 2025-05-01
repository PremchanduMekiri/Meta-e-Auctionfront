// import React from 'react';
// import { FaUpload, FaEye, FaCheckCircle, FaUsers, FaList } from 'react-icons/fa';

// interface SidebarProps {
//   activeTab: string;
//   onTabChange: (tab: string) => void;
// }

// const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
//   return (
//     <div className="w-64 bg-gray-800 text-white flex flex-col">
//       <div className="flex-1">
//         <div className="flex items-center justify-center p-4 text-2xl font-semibold">Admin</div>
//         <div className="space-y-2">
//           <button
//             onClick={() => onTabChange('dashboard')}
//             className={`w-full text-left px-4 py-2 ${
//               activeTab === 'dashboard' ? 'bg-blue-600' : 'hover:bg-blue-500'
//             }`}
//           >
//             Dashboard
//           </button>
//           <button
//             onClick={() => onTabChange('upload-bid')}
//             className={`w-full text-left px-4 py-2 ${
//               activeTab === 'upload-bid' ? 'bg-blue-600' : 'hover:bg-blue-500'
//             }`}
//           >
//             <FaUpload className="inline mr-2" />
//             Upload Auctions
//           </button>
//           <button
//             onClick={() => onTabChange('current-bids')}
//             className={`w-full text-left px-4 py-2 ${
//               activeTab === 'view-bids' ? 'bg-blue-600' : 'hover:bg-blue-500'
//             }`}
//           >
//             <FaEye className="inline mr-2" />
//            Current Auctions
//           </button>
//           <button
//             onClick={() => onTabChange('completed-auctions')}
//             className={`w-full text-left px-4 py-2 ${
//               activeTab === 'completed-auctions' ? 'bg-blue-600' : 'hover:bg-blue-500'
//             }`}
//           >
//             <FaCheckCircle className="inline mr-2" />
//             Completed Auctions
//           </button>
//           <button
//             onClick={() => onTabChange('user-details')}
//             className={`w-full text-left px-4 py-2 ${
//               activeTab === 'user-details' ? 'bg-blue-600' : 'hover:bg-blue-500'
//             }`}
//           >
//             <FaUsers className="inline mr-2" />
//             User Details
//           </button>
//           {/* New button for View All Auctions */}
//           <button
//             onClick={() => onTabChange('all-auctions')}
//             className={`w-full text-left px-4 py-2 ${
//               activeTab === 'all-auctions' ? 'bg-blue-600' : 'hover:bg-blue-500'
//             }`}
//           >
//             <FaList className="inline mr-2" />
//             View All Auctions
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
import React, { useState } from 'react';
import { FaUpload, FaEye, FaCheckCircle, FaUsers, FaList, FaBars, FaTimes } from 'react-icons/fa';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle Sidebar visibility on mobile
  const toggleSidebar = () => setIsOpen((prev) => !prev);

  // Reusable button style for active/inactive tabs
  const buttonClass = (tabName: string) =>
    `w-full text-left px-4 py-2 ${activeTab === tabName ? 'bg-blue-600' : 'hover:bg-blue-500'}`;

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
        className={`w-64 bg-gray-800 text-white flex flex-col fixed top-0 left-0 bottom-0 lg:relative lg:block z-10 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Sidebar content */}
        <div className="flex-1 mt-16"> {/* mt-16 to offset mobile button */}
          <div className="flex items-center justify-center p-4 text-2xl font-semibold">Admin</div>
          <div className="space-y-2">
            {/* Sidebar buttons */}
            {['dashboard', 'upload-bid', 'current-bids', 'completed-auctions', 'user-details', 'all-auctions'].map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={buttonClass(tab)}
              >
                {tab === 'upload-bid' && <FaUpload className="inline mr-2" />}
                {tab === 'current-bids' && <FaEye className="inline mr-2" />}
                {tab === 'completed-auctions' && <FaCheckCircle className="inline mr-2" />}
                {tab === 'user-details' && <FaUsers className="inline mr-2" />}
                {tab === 'all-auctions' && <FaList className="inline mr-2" />}
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/-/g, ' ')} {/* Capitalize and format text */}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-0'} h-full`}
        style={{ overflowX: 'hidden' }} // Prevents horizontal scroll in desktop view
      >
        {/* Main content goes here */}
      </div>
    </div>
  );
};

export default Sidebar;
