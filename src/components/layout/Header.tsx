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
  
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Package className="h-8 w-8 text-blue-800" />
            <span className="text-xl font-bold text-gray-900 ">Meta E Bid</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-800 font-medium">Home</Link>
            <Link to="/auctions" className="text-gray-700 hover:text-blue-800 font-medium">Auctions</Link>
            <Link to="/categories" className="text-gray-700 hover:text-blue-800 font-medium">Categories</Link>
            <Link to="/how-it-works" className="text-gray-700 hover:text-blue-800 font-medium">How It Works</Link>
          </nav>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* <Link to="/search" className="text-gray-600 hover:text-blue-800">
              <Search className="h-5 w-5" />
            </Link> */}
            
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  className="flex items-center space-x-2"
                  onClick={toggleProfileMenu}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 p-1 flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.username} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <User className="h-5 w-5 text-blue-800" />
                    )}
                  </div>
                </button>
                
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-xl z-50">
                    <Link to="/AuctionUserDashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</Link>
                    <Link to="/UserProfile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                   
                    <hr className="my-1" />
                    <button 
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" onClick={openLoginModal}>
                  <LogIn className="h-4 w-4 mr-1" />
                  Login
                </Button>
                <Button variant="primary" size="sm" onClick={openRegisterModal}>Register</Button>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-600" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t mt-3">
            <div className="space-y-3">
              <Link to="/" className="block text-gray-700 hover:text-blue-800 font-medium">Home</Link>
              <Link to="/auctions" className="block text-gray-700 hover:text-blue-800 font-medium">Auctions</Link>
              <Link to="/categories" className="block text-gray-700 hover:text-blue-800 font-medium">Categories</Link>
              <Link to="/how-it-works" className="block text-gray-700 hover:text-blue-800 font-medium">How It Works</Link>
              
              <div className="pt-4 space-y-3">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" className="flex items-center text-gray-700">
                      <Settings className="h-5 w-5 mr-2" />
                      Dashboard
                    </Link>
                    <Link to="/profile" className="flex items-center text-gray-700">
                      <User className="h-5 w-5 mr-2" />
                      Profile
                    </Link>
                    <button 
                      onClick={logout}
                      className="flex items-center text-red-600"
                    >
                      <LogIn className="h-5 w-5 mr-2" />
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <Button variant="outline" fullWidth onClick={openLoginModal}>
                      <LogIn className="h-4 w-4 mr-1" />
                      Login
                    </Button>
                    <Button variant="primary" fullWidth onClick={openRegisterModal}>Register</Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode={authModalMode}
      />
    </header>
  );
};

export default Header;