import React from 'react';
import Layout from '../components/layout/Layout';
import { Search } from 'lucide-react';

const SearchPage: React.FC = () => {
  return (
    <Layout>
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <Search className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold">Search</h1>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for items, categories, or auctions..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                  <Search className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-4">Search Results</h2>
                <p className="text-gray-600">Enter your search query to find items.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage; 