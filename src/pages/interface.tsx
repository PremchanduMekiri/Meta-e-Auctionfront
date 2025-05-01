import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Search, User, LogIn, X, Menu } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext'; // make sure this is your auth hook path
import AuthModal from '../components/auth/AuthModal';
import { useNavigate, Outlet } from 'react-router-dom';

const Interface = () => {
  const { user, isAuthenticated, logout, login } = useAuth();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
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

  useEffect(() => {
    // If the user is authenticated, redirect to the homepage
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  // Handle successful login within the AuthModal
  const handleLoginSuccess = () => {
    // Close the modal and navigate to homepage
    setIsAuthModalOpen(false);
    navigate('/home');
  };

  return (
    <>
      <header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-white" />
              <span className="text-xl font-bold">Meta E Bid</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/home" className="hover:underline">Home</Link>
              <Link to="/auctions" className="hover:underline">Auctions</Link>
              <Link to="/categories" className="hover:underline">Categories</Link>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <Link to="/search" className="hover:text-gray-300">
                <Search className="h-5 w-5" />
              </Link>

              {isAuthenticated ? (
                <div className="relative">
                  <button className="flex items-center" onClick={toggleProfileMenu}>
                    <div className="w-8 h-8 rounded-full bg-white p-1">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full" />
                      ) : (
                        <User className="text-indigo-700" />
                      )}
                    </div>
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 py-2 bg-white text-black rounded-md shadow-xl z-50">
                      <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link>
                      <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                      <hr className="my-1" />
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={openLoginModal}>
                    <LogIn className="h-4 w-4 mr-1" /> Login
                  </Button>
                  <Button variant="primary" size="sm" onClick={openRegisterModal}>Register</Button>
                </div>
              )}
            </div>

            <button className="md:hidden" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden mt-3 space-y-2">
              <Link to="/home" className="block hover:underline">Home</Link>
              <Link to="/auctions" className="block hover:underline">Auctions</Link>
              <Link to="/categories" className="block hover:underline">Categories</Link>
              <div className="pt-2">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" className="block">Dashboard</Link>
                    <Link to="/profile" className="block">Profile</Link>
                    <button onClick={logout} className="block text-red-600">Logout</button>
                  </>
                ) : (
                  <>
                    <Button fullWidth variant="outline" onClick={openLoginModal}>
                      <LogIn className="h-4 w-4 mr-1" /> Login
                    </Button>
                    <Button fullWidth variant="primary" onClick={openRegisterModal}>
                      Register
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="bg-gradient-to-br from-white to-blue-50 min-h-screen p-6">
        <Outlet />
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onLoginSuccess={handleLoginSuccess} // Pass the success callback to AuthModal
      />
    </>
  );
};

export default Interface;
