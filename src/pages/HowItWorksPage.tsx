import React from 'react';
import Layout from '../components/layout/Layout';
import { UserPlus, Search, Gavel, Truck, Shield, Clock, DollarSign, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      icon: UserPlus,
      title: "1. Register & Verify",
      description: "Create your account and complete the verification process",
      details: [
        "Fill in your business details",
        "Submit required documentation",
        "Verify email and phone number",
        "Complete KYC process"
      ]
    },
    {
      icon: Search,
      title: "2. Browse & List",
      description: "Explore available materials or list your items",
      details: [
        "Browse categories and listings",
        "Create detailed item listings",
        "Set auction parameters",
        "Upload photos and documentation"
      ]
    },
    {
      icon: Gavel,
      title: "3. Bid & Negotiate",
      description: "Participate in auctions and negotiate deals",
      details: [
        "Place competitive bids",
        "Track auction progress",
        "Communicate with sellers",
        "Receive real-time notifications"
      ]
    },
    {
      icon: Truck,
      title: "4. Complete & Deliver",
      description: "Finalize transactions and arrange delivery",
      details: [
        "Complete secure payment",
        "Arrange transportation",
        "Track shipment status",
        "Confirm receipt"
      ]
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Secure Transactions",
      description: "Our platform ensures safe and secure transactions through escrow payments and verified accounts."
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Get instant notifications about bids, auction status, and important updates."
    },
    {
      icon: DollarSign,
      title: "Competitive Pricing",
      description: "Transparent bidding process ensures fair market prices for buyers and sellers."
    },
    {
      icon: Users,
      title: "Verified Network",
      description: "Connect with verified buyers and sellers in the industrial materials market."
    }
  ];

  return (
    <Layout>
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-4">How Meta E Bid Works</h1>
            <p className="text-gray-600 text-center mb-12">
              Your trusted platform for industrial material auctions. Follow these simple steps to start trading.
            </p>

            {/* Process Steps */}
            <div className="space-y-8 mb-16">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <IconComponent className="h-6 w-6 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold ml-4">{step.title}</h2>
                      </div>
                      <p className="text-gray-600 mb-4">{step.description}</p>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="flex items-center text-gray-600">
                            <span className="text-green-500 mr-2">✓</span>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Platform Features */}
            <h2 className="text-3xl font-bold text-center mb-8">Platform Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold ml-4">{feature.title}</h3>
                    </div>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Get Started CTA */}
            <div className="bg-blue-600 text-white rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="mb-6">Join Meta E Bid today and start trading industrial materials efficiently.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="bg-white text-blue-600 px-6 py-2 rounded-md hover:bg-blue-50 transition-colors"
                >
                  Register Now
                </Link>
                <Link
                  to="/contact"
                  className="border border-white text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HowItWorksPage; 