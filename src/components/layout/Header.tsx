// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Menu, X, Search, User, LogIn, Package, Settings } from 'lucide-react';
// import Button from '../ui/Button';
// import { useAuth } from '../../context/AuthContext';
// import AuthModal from '../auth/AuthModal';
// import AuctionUserDashboard from './Dashboard';

// const Header: React.FC = () => {
//   const { user, isAuthenticated, logout } = useAuth();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
//   const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
//   const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
//   const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);
  
//   const openLoginModal = () => {
//     setAuthModalMode('login');
//     setIsAuthModalOpen(true);
//   };
  
//   const openRegisterModal = () => {
//     setAuthModalMode('register');
//     setIsAuthModalOpen(true);
//   };
  
//   return (
//     <header className="bg-white shadow-sm sticky top-0 z-50 transition-all duration-200">
//   <div className="container mx-auto px-4 py-3">
//     <div className="flex items-center justify-between">
//       {/* Logo */}
//       <Link
//         to="/"
//         className="flex items-center gap-2 transition-transform duration-200 hover:scale-105"
//       >
//         <Package className="h-7 w-7 text-blue-700" />
//         <span className="text-lg font-semibold text-gray-900">Meta e-Auction</span>
//       </Link>

//       {/* Desktop Navigation */}
//       <nav className="hidden md:flex items-center gap-6">
//         {["Home", "Auctions", "Categories", "How It Works"].map((item) => (
//           <Link
//             key={item}
//             to={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
//             className="text-gray-600 hover:text-blue-700 transition-colors duration-200"
//           >
//             {item}
//           </Link>
//         ))}
//       </nav>

//       {/* Desktop Actions */}
//       <div className="hidden md:flex items-center gap-4">
//         {isAuthenticated ? (
//           <div className="relative">
//             <button
//               onClick={toggleProfileMenu}
//               className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center transition-transform duration-200 hover:scale-105"
//             >
//               {user?.avatar ? (
//                 <img
//                   src={user.avatar}
//                   alt={user.username}
//                   className="w-full h-full object-cover rounded-full"
//                 />
//               ) : (
//                 <User className="h-5 w-5 text-blue-700" />
//               )}
//             </button>

//             {isProfileMenuOpen && (
//               <div className="absolute right-0 mt-2 w-44 bg-white shadow-md rounded-md overflow-hidden border border-gray-100">
//                 <Link to="/AuctionUserDashboard" className="block px-4 py-2 text-sm hover:bg-gray-50">Dashboard</Link>
//                 <Link to="/UserProfile" className="block px-4 py-2 text-sm hover:bg-gray-50">Profile</Link>
//                 <hr />
//                 <button
//                   onClick={logout}
//                   className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
//                 >
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         ) : (
//           <>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={openLoginModal}
//               className="transition-transform duration-200 hover:scale-105"
//             >
//               <LogIn className="h-4 w-4 mr-1" />
//               Login
//             </Button>
//             <Button
//               variant="primary"
//               size="sm"
//               onClick={openRegisterModal}
//               className="transition-transform duration-200 hover:scale-105"
//             >
//               Register
//             </Button>
//           </>
//         )}
//       </div>

//       {/* Mobile Menu Toggle */}
//       <button
//         className="md:hidden text-gray-600 transition-transform duration-200 hover:scale-110"
//         onClick={toggleMenu}
//       >
//         {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//       </button>
//     </div>

//     {/* Mobile Menu */}
//     {isMenuOpen && (
//       <div className="md:hidden mt-2 border-t pt-3">
//         <nav className="space-y-3">
//         <Link
//         to="/"className="block text-gray-700 hover:text-blue-700">Home</Link>
//           <Link to="/auctions" className="block text-gray-700 hover:text-blue-700">Auctions</Link>
//           <Link to="/categories" className="block text-gray-700 hover:text-blue-700">Categories</Link>
//           <Link to="/how-it-works" className="block text-gray-700 hover:text-blue-700">How It Works</Link>
//         </nav>
//         <div className="mt-4 space-y-2">
//           {isAuthenticated ? (
//             <>
//               <Link to="/AuctionUserDashboard" className="block text-sm text-gray-700 hover:text-blue-700">Dashboard</Link>
//               <Link to="/UserProfile" className="block text-sm text-gray-700 hover:text-blue-700">Profile</Link>
//               <button
//                 onClick={logout}
//                 className="block text-sm text-red-600 hover:text-red-700"
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <>
//               <Button
//                 variant="outline"
//                 fullWidth
//                 onClick={openLoginModal}
//                 className="transition-transform duration-200 hover:scale-105"
//               >
//                 <LogIn className="h-4 w-4 mr-1" />
//                 Login
//               </Button>
//               <Button
//                 variant="primary"
//                 fullWidth
//                 onClick={openRegisterModal}
//                 className="transition-transform duration-200 hover:scale-105"
//               >
//                 Register
//               </Button>
//             </>
//           )}
//         </div>
//       </div>
//     )}
//   </div>

//   <AuthModal
//     isOpen={isAuthModalOpen}
//     onClose={() => setIsAuthModalOpen(false)}
//     initialMode={authModalMode}
//   />
// </header>

//   );
// };

// export default Header;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, User, LogIn, Package, Settings } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../auth/AuthModal';
import AuctionUserDashboard from './Dashboard';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);
  
  const openLoginModal = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };
  
  const openRegisterModal = () => {
    setAuthModalMode('register');
    setIsAuthModalOpen(true);
  };
  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Simulate loading for 3 seconds
  };
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 transition-all duration-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 transition-transform duration-200 hover:scale-105"
          >
            <Package className="h-7 w-7 text-blue-700" />
            <span className="text-lg font-semibold text-gray-900">Meta e-Auction</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {["Home", "Auctions", "Categories", "How It Works"].map((item) => {
              const path = item === "Home" ? "/" : `/${item.toLowerCase().replace(/\s+/g, "-")}`;
              return (
                <Link
                  key={item}
                  to={path}
                  className="text-gray-600 hover:text-blue-700 transition-colors duration-200"
                >
                  {item}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleProfileMenu}
                  className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center transition-transform duration-200 hover:scale-105"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <User className="h-5 w-5 text-blue-700" />
                  )}
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white shadow-md rounded-md overflow-hidden border border-gray-100">
                    <Link to="/AuctionUserDashboard" className="block px-4 py-2 text-sm hover:bg-gray-50">Dashboard</Link>
                    <Link to="/UserProfile" className="block px-4 py-2 text-sm hover:bg-gray-50">Profile</Link>
                    <hr />
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openLoginModal}
                  className="transition-transform duration-200 hover:scale-105"
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  Login
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={openRegisterModal}
                  className="transition-transform duration-200 hover:scale-105"
                >
                  Register
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gray-600 transition-transform duration-200 hover:scale-110"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 border-t pt-3">
            <nav className="space-y-3">
              <Link to="/" className="block text-gray-700 hover:text-blue-700">Home</Link>
              <Link to="/auctions" className="block text-gray-700 hover:text-blue-700">Auctions</Link>
              <Link to="/categories" className="block text-gray-700 hover:text-blue-700">Categories</Link>
              <Link to="/how-it-works" className="block text-gray-700 hover:text-blue-700">How It Works</Link>
            </nav>
            <div className="mt-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link to="/AuctionUserDashboard" className="block text-sm text-gray-700 hover:text-blue-700">Dashboard</Link>
                  <Link to="/UserProfile" className="block text-sm text-gray-700 hover:text-blue-700">Profile</Link>
                  <button
                    onClick={logout}
                    className="block text-sm text-red-600 hover:text-red-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={openLoginModal}
                    className="transition-transform duration-200 hover:scale-105"
                  >
                    <LogIn className="h-4 w-4 mr-1" />
                    Login
                  </Button>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={openRegisterModal}
                    className="transition-transform duration-200 hover:scale-105"
                  >
                    Register
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      {isLoading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <Package className="h-7 w-7 text-blue-700 animate-spin" />
        </div>
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </header>
  );
};

export default Header;
