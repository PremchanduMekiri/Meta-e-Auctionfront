

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, ChevronDown } from 'lucide-react';
import Button from '../ui/Button';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

  const navigate = useNavigate();

  return (
    <nav className="bg-gradient-to-r from-[#6D6D4E] to-[#8B8B5F] text-white shadow-lg">
  <div className="container mx-auto px-4">
    <div className="flex items-center justify-between h-16">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold tracking-wide hover:text-gray-200 transition-all duration-300">
        Meta E Bid
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-8">
  <Link to="/" className="hover:text-gray-200 transition-all duration-300 font-bold">HOME</Link>
  <Link to="/services" className="hover:text-gray-200 transition-all duration-300 font-bold">SERVICES</Link>
  <Link to="/about" className="hover:text-gray-200 transition-all duration-300 font-bold">ABOUT</Link>
  <Link to="/auctions" className="hover:text-gray-200 transition-all duration-300 font-bold">AUCTIONS</Link>
  <Link to="/contact" className="hover:text-gray-200 transition-all duration-300 font-bold">CONTACT</Link>
  <Link to="/support" className="hover:text-gray-200 transition-all duration-300 font-bold">SUPPORT</Link>
</div>


      {/* Profile Icon */}
      <div className="relative hidden md:flex items-center">
        <button onClick={toggleProfileMenu} className="flex items-center space-x-2 transition-transform transform hover:scale-110 duration-300">
          <div className="w-9 h-9 rounded-full bg-white/30 p-1 flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <ChevronDown className="h-4 w-4" />
        </button>

        {isProfileMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 py-2 bg-white text-gray-800 rounded-lg shadow-lg opacity-0 animate-fade-in z-50">
            <button onClick={() => { navigate("/UserProfile"); setIsProfileMenuOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
              Profile
            </button>
            <hr className="my-1" />
            <button onClick={() => { navigate("/"); setIsProfileMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <button className="md:hidden text-white" onClick={toggleMenu}>
        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
    </div>

    {/* Mobile Menu */}
    {isMenuOpen && (
      <div className="md:hidden bg-[#6D6D4E] py-4 border-t border-white/20 transition-transform transform duration-500">
        <div className="space-y-4">
          <Link to="/" className="block hover:text-gray-200 transition-all duration-300  ">HOME</Link>
          <Link to="/services" className="block hover:text-gray-200 transition-all duration-300 ">SERVICES</Link>
          <Link to="/about" className="block hover:text-gray-200 transition-all duration-300">ABOUT</Link>
          <Link to="/auctions" className="block hover:text-gray-200 transition-all duration-300">AUCTIONS</Link>
          <Link to="/contact" className="block hover:text-gray-200 transition-all duration-300">CONTACT</Link>
          <Link to="/support" className="block hover:text-gray-200 transition-all duration-300">SUPPORT</Link>

          <div className="pt-4 space-y-3">
            <button onClick={() => { navigate("/dashboard"); setIsMenuOpen(false); }} className="flex items-center text-white hover:text-gray-200">
              <User className="h-5 w-5 mr-2" /> Dashboard
            </button>
            <button onClick={() => { navigate("/UserProfile"); setIsMenuOpen(false); }} className="flex items-center text-white hover:text-gray-200">
              <User className="h-5 w-5 mr-2" /> Profile
            </button>
            <button onClick={() => { navigate("/"); setIsMenuOpen(false); }} className="flex items-center text-red-500 hover:text-gray-200">
              <User className="h-5 w-5 mr-2" /> Logout
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
</nav>

  );
};

export default Navbar;