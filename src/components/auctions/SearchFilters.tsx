import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { categories } from '../../data/mockData';
import { AuctionFilters } from '../../context/AuctionContext';

interface SearchFiltersProps {
  onSearch: (query: string, filters: AuctionFilters) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<AuctionFilters>({
    category: '',
    material: '',
    minPrice: undefined,
    maxPrice: undefined,
    location: '',
    status: 'active'
  });
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'number') {
      setFilters({
        ...filters,
        [name]: value ? Number(value) : undefined
      });
    } else {
      setFilters({
        ...filters,
        [name]: value
      });
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, filters);
  };
  
  const clearFilters = () => {
    setFilters({
      category: '',
      material: '',
      minPrice: undefined,
      maxPrice: undefined,
      location: '',
      status: 'active'
    });
    setQuery('');
    onSearch('', {
      category: '',
      material: '',
      minPrice: undefined,
      maxPrice: undefined,
      location: '',
      status: 'active'
    });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <form onSubmit={handleSearch}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Input
              placeholder="Search auctions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="flex items-center"
            >
              <Filter className="h-4 w-4 mr-1" />
              Filters
            </Button>
            
            <Button type="submit" variant="primary">
              Search
            </Button>
          </div>
        </div>
        
        {isFiltersOpen && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Material Type
              </label>
              <Input
                type="text"
                name="material"
                placeholder="e.g., Aluminum, Copper"
                value={filters.material || ''}
                onChange={handleFilterChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Price ($)
              </label>
              <Input
                type="number"
                name="minPrice"
                placeholder="Min"
                value={filters.minPrice?.toString() || ''}
                onChange={handleFilterChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Price ($)
              </label>
              <Input
                type="number"
                name="maxPrice"
                placeholder="Max"
                value={filters.maxPrice?.toString() || ''}
                onChange={handleFilterChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <Input
                type="text"
                name="location"
                placeholder="e.g., Chicago, Phoenix"
                value={filters.location || ''}
                onChange={handleFilterChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">Active Only</option>
                <option value="closed">Closed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={clearFilters}
                className="text-gray-600 flex items-center"
              >
                <X className="h-4 w-4 mr-1" />
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchFilters;