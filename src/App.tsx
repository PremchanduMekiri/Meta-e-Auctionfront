import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AuctionProvider } from './context/AuctionContext';
import HomePage from './pages/HomePage';
import AuctionListPage from './pages/AuctionListPage';
import AuctionDetailPage from './pages/AuctionDetailPage';
import CategoriesPage from './pages/CategoriesPage';
import HowItWorksPage from './pages/HowItWorksPage';
import ServicesPage from './pages/ServicesPage';
import SearchPage from './pages/SearchPage';
import RegisterPage from './pages/RegisterPage';
import AuctionUserDashboard from './components/layout/Dashboard';
import UserProfile from './components/layout/userProfile';
import UpdateProfile from './components/layout/updateUser';
import AdminDashboard from './pages/AdminDashboard';
import CompletedAuctionDetailPage from './pages/CompletedAuctionDetailPage';
import UpdateAuctionForm from './pages/auctionUpdate';
import CurrentAuctionDetailPage from './pages/CurrectAuctions';
import DocumentVerificationForm from './components/auth/DocumentVerificationForm';
import VerifyingDocuments from './pages/VerifyingDocuments';
import Auctions from './pages/AuctionListing';

function App() {
  return (
    <AuthProvider>
      <AuctionProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route 
              path="/DocumentVerificationForm" 
              element={<DocumentVerificationForm onSuccess={() => {}} onClose={() => {}} />} 
            />
            <Route path="/auctions" element={<AuctionListPage />} />
            <Route path="/auction/:id" element={<AuctionDetailPage />} />   
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/AuctionUserDashboard" element={<AuctionUserDashboard />} />
            <Route path="/UserProfile" element={<UserProfile />} />
            <Route path="/UpdateProfile" element={<UpdateProfile />} />
            <Route path="/_secure/0x9a8b7c_admin-entry" element={<AdminDashboard />} />
            <Route path="/completed-auction/:id" element={<CompletedAuctionDetailPage />} />
            <Route path="/UpdateAuctionForm" element={<UpdateAuctionForm />} />
            <Route path="/CurrentAuctionDetailPage" element={<CurrentAuctionDetailPage />} />
            {/* Add more routes as needed */}
            <Route path="/VerifingDocuments/:userId" element={<VerifyingDocuments />} />
            <Route path="/auctions"  element={<Auctions/>}/>
       
          </Routes>
        </Router>
      </AuctionProvider>
    </AuthProvider>
  );
}

 export default App;
