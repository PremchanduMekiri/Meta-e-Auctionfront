import React from 'react';
import Layout from '../components/layout/Layout';
import { Award, Shield, Truck, CheckCircle } from 'lucide-react';

const ServicesPage: React.FC = () => {
  const services = [
    {
      title: 'Online Bidding Platform',
      description: 'Access our secure and user-friendly platform for seamless bidding on industrial materials and equipment.',
      icon: Award
    },
    {
      title: 'Material Valuation',
      description: 'Get accurate market valuations for your materials and equipment from our expert team.',
      icon: Shield
    },
    {
      title: 'Logistics Support',
      description: 'Comprehensive logistics solutions for the transportation and delivery of your purchased items.',
      icon: Truck
    },
    {
      title: 'Quality Assurance',
      description: 'Thorough inspection and quality checks to ensure you receive exactly what you bid for.',
      icon: CheckCircle
    }
  ];

  return (
    <Layout>
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-4">Our Services</h1>
          <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            We provide comprehensive solutions for all your industrial material and equipment needs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="bg-blue-100 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-16 bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Why Choose Our Services?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                <div>
                  <h3 className="font-semibold mb-2">Expert Team</h3>
                  <p className="text-gray-600">Our experienced professionals ensure quality and reliability in every transaction.</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                <div>
                  <h3 className="font-semibold mb-2">Secure Transactions</h3>
                  <p className="text-gray-600">Advanced security measures protect your data and financial information.</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                <div>
                  <h3 className="font-semibold mb-2">24/7 Support</h3>
                  <p className="text-gray-600">Round-the-clock assistance for all your queries and concerns.</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                <div>
                  <h3 className="font-semibold mb-2">Competitive Pricing</h3>
                  <p className="text-gray-600">Get the best value for your money with our transparent pricing structure.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ServicesPage; 