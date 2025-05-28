import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
  {/* Brand Section */}
  <div>
    <div className="flex items-center space-x-2 mb-4">
    <img
  src="/logo.png"
  alt="Meta-e-Auction Logo"
  className="h-20 w-20"  // ⬅️ Increased size from h-8 w-8 to h-16 w-16
/>

      <span className="text-xl font-bold text-white">Meta e-Auction</span>
    </div>

            <p className="text-sm mb-4">
              The premier marketplace for scrap material auctions. Connect suppliers with buyers worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition">Home</Link>
              </li>
              <li>
                <Link to="/auctions" className="text-gray-400 hover:text-white transition">Auctions</Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-400 hover:text-white transition">Categories</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-400 hover:text-white transition">How It Works</Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white transition">Blog</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition">Contact Us</Link>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white transition">FAQs</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-400 hover:text-white transition">Help Center</Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-400 hover:text-white transition">Shipping Information</Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
                <span>GALA NO 29, Sainath Wadi, BHANGAR GALI LINK ROAD,
SAKINAKA, MUMBAI, Mumbai, Maharashtra, 400072
</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-blue-400 mr-2" />
                <span>+91 **********</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-blue-400 mr-2" />
                <span>info@MetaEbid.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6 text-sm text-gray-500 text-center">
          <p>
          Copyright &copy; {new Date().getFullYear()}  Meta E Bid. All rights reserved | Developed and Maintained by <a href="https://zynlogic.com/" className="text-blue-400 hover:text-white transition">Zynlogic</a>.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;