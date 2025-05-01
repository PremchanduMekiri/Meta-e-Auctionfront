import React from 'react';
import Layout from '../components/layout/Layout';
import { Link } from 'react-router-dom';
import { Wrench, Cog, Cpu, Car, HardHat, Recycle, ChevronRight } from 'lucide-react';

const CategoriesPage: React.FC = () => {
  const categories = [
    {
      id: 'industrial',
      name: 'Industrial Machinery',
      icon: Wrench,
      description: 'Heavy industrial machinery and equipment',
      items: [
        'CNC Machines',
        'Production Line Equipment',
        'Industrial Robots',
        'Manufacturing Tools',
        'Processing Equipment'
      ],
      benefits: [
        'Verified equipment conditions',
        'Detailed specifications available',
        'Installation support',
        'Warranty options'
      ]
    },
    {
      id: 'metals',
      name: 'Metal Materials',
      icon: Cog,
      description: 'High-quality metal materials and scrap',
      items: [
        'Steel (Carbon, Stainless, Alloy)',
        'Aluminum (Sheets, Blocks, Scrap)',
        'Copper (Wire, Tubes, Sheets)',
        'Brass and Bronze',
        'Precious Metals'
      ],
      benefits: [
        'Material certification',
        'Quality testing reports',
        'Flexible lot sizes',
        'Competitive pricing'
      ]
    },
    {
      id: 'electronics',
      name: 'Electronic Components',
      icon: Cpu,
      description: 'Electronic parts and components',
      items: [
        'Circuit Boards',
        'Electronic Components',
        'Industrial Controls',
        'Power Supplies',
        'Testing Equipment'
      ],
      benefits: [
        'Tested components',
        'Original manufacturer sourcing',
        'Bulk availability',
        'Technical documentation'
      ]
    },
    {
      id: 'automotive',
      name: 'Automotive Parts',
      icon: Car,
      description: 'Vehicle parts and automotive materials',
      items: [
        'Engine Components',
        'Transmission Parts',
        'Body Panels',
        'Electrical Systems',
        'Spare Parts'
      ],
      benefits: [
        'OEM and aftermarket options',
        'Vehicle compatibility info',
        'Part authenticity verification',
        'Warranty coverage'
      ]
    },
    {
      id: 'construction',
      name: 'Construction Materials',
      icon: HardHat,
      description: 'Building materials and construction equipment',
      items: [
        'Structural Steel',
        'Building Materials',
        'Construction Equipment',
        'Safety Equipment',
        'Tools and Machinery'
      ],
      benefits: [
        'Quality certifications',
        'Bulk order discounts',
        'Delivery scheduling',
        'Site inspection available'
      ]
    },
    {
      id: 'recycling',
      name: 'Recyclable Materials',
      icon: Recycle,
      description: 'Industrial recyclables and raw materials',
      items: [
        'Metal Scrap',
        'Plastic Materials',
        'Paper Products',
        'Industrial Waste',
        'Chemical Products'
      ],
      benefits: [
        'Environmental compliance',
        'Recycling certificates',
        'Volume pricing',
        'Regular supply contracts'
      ]
    }
  ];

  return (
    <Layout>
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-4">Material Categories</h1>
          <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Explore our comprehensive range of industrial materials and equipment. Each category is carefully curated to ensure quality and reliability.
          </p>

          <div className="space-y-8">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div key={category.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                      <h2 className="text-2xl font-bold ml-4">{category.name}</h2>
                    </div>
                    
                    <p className="text-gray-600 mb-6">{category.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Available Items</h3>
                        <ul className="space-y-2">
                          {category.items.map((item, index) => (
                            <li key={index} className="flex items-center text-gray-600">
                              <ChevronRight className="h-4 w-4 text-blue-500 mr-2" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Benefits</h3>
                        <ul className="space-y-2">
                          {category.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-center text-gray-600">
                              <span className="text-green-500 mr-2">✓</span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Link
                        to={`/auctions?category=${category.id}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700"
                      >
                        View Available Auctions
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoriesPage; 