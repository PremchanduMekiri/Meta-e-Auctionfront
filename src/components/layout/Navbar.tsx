// import React from 'react';
// import { Link } from 'react-router-dom';

// const Navbar: React.FC = () => {
//   return (
//     <nav className="bg-[#8B8B5F] text-white">
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between h-16">
//           <Link to="/" className="text-xl font-bold">
//             Meta E Bid
//           </Link>
          
//           <div className="hidden md:flex items-center space-x-8">
//             <Link to="/" className="hover:text-gray-200 transition-colors">
//               HOME
//             </Link>
//             <Link to="/services" className="hover:text-gray-200 transition-colors">
//               SERVICES
//             </Link>
//             <Link to="/about" className="hover:text-gray-200 transition-colors">
//               ABOUT
//             </Link>
//             <Link to="/auctions" className="hover:text-gray-200 transition-colors">
//               AUCTIONS
//             </Link>
//             <Link to="/contact" className="hover:text-gray-200 transition-colors">
//               CONTACT
//             </Link>
//             <Link to="/support" className="hover:text-gray-200 transition-colors">
//               SUPPORT
//             </Link>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar; 

// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Menu, X, User, LogIn, ChevronDown } from 'lucide-react';
// import Button from '../ui/Button';
// import { useAuth } from '../../context/AuthContext';

// const Navbar: React.FC = () => {
//   const { user, isAuthenticated, isAdmin, logout } = useAuth();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
//   const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

//   return (
//     <nav className="bg-[#8B8B5F] text-white">
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between h-16">
//           <Link to="/" className="text-xl font-bold">
//             Meta E Bid
//           </Link>
          
//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-8">
//             <Link to="/" className="hover:text-gray-200 transition-colors">
//               HOME
//             </Link>
//             <Link to="/services" className="hover:text-gray-200 transition-colors">
//               SERVICES
//             </Link>
//             <Link to="/about" className="hover:text-gray-200 transition-colors">
//               ABOUT
//             </Link>
//             <Link to="/auctions" className="hover:text-gray-200 transition-colors">
//               AUCTIONS
//             </Link>
//             <Link to="/contact" className="hover:text-gray-200 transition-colors">
//               CONTACT
//             </Link>
//             <Link to="/support" className="hover:text-gray-200 transition-colors">
//               SUPPORT
//             </Link>
//           </div>

//           {/* Desktop Auth Buttons */}
//           <div className="hidden md:flex items-center space-x-4">
//             {isAuthenticated ? (
//               <div className="relative">
//                 <button 
//                   className="flex items-center space-x-2"
//                   onClick={toggleProfileMenu}
//                 >
//                   <div className="w-8 h-8 rounded-full bg-white/20 p-1 flex items-center justify-center overflow-hidden">
//                     {user?.avatar ? (
//                       <img src={user.avatar} alt={user.username} className="w-full h-full object-cover rounded-full" />
//                     ) : (
//                       <User className="h-5 w-5" />
//                     )}
//                   </div>
//                   <ChevronDown className="h-4 w-4" />
//                 </button>
                
//                 {isProfileMenuOpen && (
//                   <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-xl z-50">
//                     {isAdmin ? (
//                       <Link to="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Admin Dashboard</Link>
//                     ) : (
//                       <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</Link>
//                     )}
//                     <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
//                     <Link to="/settin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Setting</Link>
//                     <hr className="my-1" />
//                     <button 
//                       onClick={logout}
//                       className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
//                     >
//                       Logout
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div className="flex items-center space-x-3">
//                 <Button variant="outline" size="sm" className="text-white border-white hover:bg-white/10">
//                   <LogIn className="h-4 w-4 mr-1" />
//                   Login
//                 </Button>
//                 <Button variant="primary" size="sm">Register</Button>
//               </div>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <button className="md:hidden text-white" onClick={toggleMenu}>
//             {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         {isMenuOpen && (
//           <div className="md:hidden py-4 border-t border-white/20">
//             <div className="space-y-4">
//               <Link to="/" className="block hover:text-gray-200 transition-colors">
//                 HOME
//               </Link>
//               <Link to="/services" className="block hover:text-gray-200 transition-colors">
//                 SERVICES
//               </Link>
//               <Link to="/about" className="block hover:text-gray-200 transition-colors">
//                 ABOUT
//               </Link>
//               <Link to="/auctions" className="block hover:text-gray-200 transition-colors">
//                 AUCTIONS
//               </Link>
//               <Link to="/contact" className="block hover:text-gray-200 transition-colors">
//                 CONTACT
//               </Link>
//               <Link to="/support" className="block hover:text-gray-200 transition-colors">
//                 SUPPORT
//               </Link>

//               <div className="pt-4 space-y-3">
//                 {isAuthenticated ? (
//                   <>
//                     <Link to="/dashboard" className="flex items-center text-white">
//                       <User className="h-5 w-5 mr-2" />
//                       Dashboard
//                     </Link>
//                     <Link to="/profile" className="flex items-center text-white">
//                       <User className="h-5 w-5 mr-2" />
//                       Profile
//                     </Link>
//                     <button 
//                       onClick={logout}
//                       className="flex items-center text-white"
//                     >
//                       <LogIn className="h-5 w-5 mr-2" />
//                       Logout
//                     </button>
//                   </>
//                 ) : (
//                   <div className="space-y-3">
//                     <Button variant="outline" fullWidth className="text-white border-white hover:bg-white/10">
//                       <LogIn className="h-4 w-4 mr-1" />
//                       Login
//                     </Button>
//                     <Button variant="primary" fullWidth>Register</Button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar; 

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