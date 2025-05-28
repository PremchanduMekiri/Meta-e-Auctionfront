
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, DollarSign, Award, TrendingUp, Mail, Phone, MapPin, ChevronDown, ChevronUp, Package } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import AuctionList from '../components/auctions/AuctionList';
import { useAuctions } from '../context/AuctionContext';
import { formatCurrency } from '../utils/formatters';
import { formatDate, formatTimeRemaining } from '../utils/dateUtils';
import Modal from '../components/ui/Modal';
import RegisterForm from '../components/auth/RegisterForm';
import DocumentVerificationForm from '../components/auth/DocumentVerificationForm';
import axios from 'axios';
import './home.css';

interface UserData {
  id: number;
  name: string;
  email: string;
  status: string;
}

type Auction = {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  startingPrice: number;
  status: string;
  highestBidderId: number | null;
  createdByAdminId: number;
  createdAt: string;
  user: any;
};

const HomePage: React.FC = () => {
  const { auctions, featuredAuctions } = useAuctions();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isLoadingCurrent, setIsLoadingCurrent] = useState(true);
  const [isLoadingUpcoming, setIsLoadingUpcoming] = useState(true);
  const [isLoadingAll, setIsLoadingAll] = useState(true);

  useEffect(() => {
    document.body.classList.add('animate__animated', 'animate__fadeIn');
  }, []);

  const faqItems = [
    {
      question: "How do I start selling on Meta E Bid?",
      answer: "To start selling, register as a supplier, complete your profile, and list your scrap materials for auction. Our team will verify your account before you can start selling. The verification process typically takes 24-48 hours."
    },
    {
      question: "What types of scrap materials can I sell?",
      answer: "You can sell various industrial scrap materials including metal (steel, aluminum, copper), plastic (PVC, HDPE, PP), electronic components (PCBs, processors), automotive parts, and more. Each category has specific requirements and guidelines to ensure quality standards."
    },
    {
      question: "How are payments processed?",
      answer: "Payments are processed securely through our platform. We hold the payment in escrow until the buyer confirms receipt of the materials. This ensures safe transactions for both parties. We support multiple payment methods including bank transfers and secure digital payments."
    },
    {
      question: "What are the shipping arrangements?",
      answer: "Shipping can be arranged by either the seller or buyer, as agreed upon during the auction. We have partnerships with reliable logistics providers who can handle industrial material transportation. All shipments are tracked and insured for safety."
    },
    {
      question: "How do you ensure quality of materials?",
      answer: "Sellers must provide detailed descriptions, photos, and material certificates when applicable. We have a rating system for sellers and buyers, and our quality assurance team randomly inspects materials. Any disputes are handled through our resolution center."
    }
  ];

  const [newauction, setNewauctions] = useState<Auction[]>([]);

  useEffect(() => {
    const fetchUpcomingAuctions = async () => {
      try {
        const res = await axios.get<Auction[]>('https://metaauction.onrender.com/auction/upcomingAuctions');
        console.log(res.data);
        console.log("upcoming Connection Data|" + res.data);
        setNewauctions(res.data);
      } catch (error) {
        console.error("Error fetching auctions:", error);
      } finally {
        setIsLoadingUpcoming(false);
      }
    };

    fetchUpcomingAuctions();
  }, []);

  useEffect(() => {
    console.log(newauction);
  }, [newauction]);

  const openRegisterModal = () => setIsRegisterModalOpen(true);
  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  const openVerificationModal = () => setIsVerificationModalOpen(true);
  const closeVerificationModal = () => setIsVerificationModalOpen(false);

  const [currentauctions, setCurrentauctions] = useState<Auction[]>([]);

  useEffect(() => {
    const fetchCurrentAuctions = async () => {
      try {
        const res = await axios.get('https://metaauction.onrender.com/auction/runningAuctions');
        console.log("current Connection Data|" + res.data);
        setCurrentauctions(res.data);
      } catch (error) {
        console.error("Error fetching auctions:", error);
      } finally {
        setIsLoadingCurrent(false);
      }
    };

    fetchCurrentAuctions();
  }, []);

  const [allAuctions, setAllauctions] = useState<Auction[]>([]);

  useEffect(() => {
    const fetchAllAuctions = async () => {
      try {
        const res = await axios.get('https://metaauction.onrender.com/auction/auctions');
        console.log("current Connection Data|" + res.data);
        setAllauctions(res.data);
      } catch (error) {
        console.error("Error fetching auctions:", error);
      } finally {
        setIsLoadingAll(false);
      }
    };

    fetchAllAuctions();
  }, []);

  useEffect(() => {
    console.log("Current Auction in thye project" + { allAuctions });
  }, [allAuctions]);

  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('userData');
    console.log("User Data in the project", stored);
    if (stored) {
      setUserData(JSON.parse(stored));
    }
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-200 to-blue-100 text-gray-800 overflow-hidden animate__animated animate__zoomIn">
  <div className="container mx-auto px-4 py-12">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <div className="flex flex-col items-center animate__animated animate__slideInLeft">
        <h1 className="text-4xl font-bold text-blue-900 mb-4 drop-shadow-[0_4px_12px_rgba(59,130,246,0.4)]">
          META E AUCTION
        </h1>
        <div className="relative w-full max-w-md h-[350px] rounded-2xl overflow-hidden">
          <img
            src="/image2.png"
            alt="Industrial Scrap"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-500/30 to-transparent" />
        </div>
      </div>

      <div className="flex flex-col gap-4 animate__animated animate__slideInRight">
        {isLoadingCurrent ? (
          <div className="flex justify-center items-center bg-white rounded-xl p-6 shadow animate__animated animate__pulse">
            <Package className="h-7 w-7 text-blue-500 animate-spin" />
          </div>
        ) : currentauctions.length > 0 ? (
          <div className="flex flex-col overflow-hidden bg-white rounded-xl max-h-[300px] shadow-md transition-all duration-500 hover:scale-105">
            <div className="p-4 border-b border-blue-200 bg-blue-100 z-10">
              <h2 className="text-xl font-bold flex items-center text-blue-900">
                <TrendingUp className="h-5 w-5 mr-2" />
                Current Auctions
              </h2>
            </div>
            <div className="overflow-y-auto px-4 py-2 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100 hover:scrollbar-thumb-blue-400">
              {currentauctions.map((auction, index) => (
                <Link
                  key={auction.id}
                  to={`/auction/${auction.id}`}
                  className="block bg-blue-50 hover:bg-blue-100 backdrop-blur-sm rounded-lg p-4 mb-3 transition-colors animate__animated animate__fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-blue-900 mb-1">{auction.name}</h3>
                      <p className="text-base text-gray-700">{auction.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-700">
                        {formatCurrency(auction.startingPrice)}
                      </p>
                      <p className="text-sm text-orange-500 font-bold">
                        {formatTimeRemaining(auction.endDate)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {isLoadingUpcoming ? (
          <div className="flex justify-center items-center bg-white rounded-xl p-6 shadow animate__animated animate__pulse">
            <Package className="h-7 w-7 text-blue-500 animate-spin" />
          </div>
        ) : newauction.length > 0 ? (
          <div className="flex flex-col overflow-hidden bg-white rounded-xl max-h-[300px] shadow-md transition-all duration-500 hover:scale-105">
            <div className="p-4 border-b border-blue-200 bg-blue-100 z-10">
              <h2 className="text-xl font-bold flex items-center text-blue-900">
                <TrendingUp className="h-5 w-5 mr-2" />
                Upcoming Auctions
              </h2>
            </div>
            <div className="overflow-y-auto px-4 py-2 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100 hover:scrollbar-thumb-blue-400">
              {newauction.map((auction, index) => (
                <Link
                  key={auction.id}
                  to={{ pathname: `/auction/${auction.id}`, state: { auction } }}
                  className="block bg-blue-50 hover:bg-blue-100 backdrop-blur-sm rounded-lg p-4 mb-3 transition-colors animate__animated animate__fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-blue-900 mb-1">{auction.name}</h3>
                      <p className="text-base text-gray-700">{auction.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-700">
                        {formatCurrency(auction.startingPrice)}
                      </p>
                      <p className="text-sm text-orange-500 font-bold">
                        Starting: {formatDate(auction.endDate)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {!isLoadingCurrent && !isLoadingUpcoming && currentauctions.length === 0 && newauction.length === 0 && (
          <div className="bg-blue-50 rounded-xl p-6 text-center text-blue-700 animate__animated animate__pulse">
            No current or upcoming auctions available.
          </div>
        )}
      </div>
    </div>
  </div>
</section>


      {/* Categories Section */}
      <section className="py-12 bg-gray-50 animate__animated animate__fadeInUp">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-8">Browse By Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              {
                id: 'industrial',
                name: 'Industrial',
                description: 'Heavy machinery and equipment',
                icon: 'tool'
              },
              {
                id: 'metals',
                name: 'Metals',
                description: 'Steel, aluminum, copper',
                icon: 'flask'
              },
              {
                id: 'electronics',
                name: 'Electronics',
                description: 'Circuit boards, components',
                icon: 'cpu'
              },
              {
                id: 'automotive',
                name: 'Automotive',
                description: 'Vehicle parts and materials',
                icon: 'car'
              },
              {
                id: 'construction',
                name: 'Construction',
                description: 'Building materials and tools',
                icon: 'hard-hat'
              },
              {
                id: 'plastics',
                name: 'Plastics',
                description: 'Industrial plastics and polymers',
                icon: 'scissors'
              }
            ].map((category, index) => (
              <Link
                key={category.id}
                to={`/auctions?category=${category.id}`}
                className="bg-white hover:bg-cyan-50 p-4 rounded-lg text-center transition-colors duration-300 border border-cyan-200 animate__animated animate__zoomIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-cyan-100 text-cyan-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  {category.icon === 'tool' && <Award className="h-6 w-6" />}
                  {category.icon === 'flask' && <TrendingUp className="h-6 w-6" />}
                  {category.icon === 'cpu' && <DollarSign className="h-6 w-6" />}
                  {category.icon === 'car' && <Award className="h-6 w-6" />}
                  {category.icon === 'hard-hat' && <Award className="h-6 w-6" />}
                  {category.icon === 'scissors' && <Award className="h-6 w-6" />}
                </div>
                <h3 className="font-medium text-gray-800">{category.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted Partners Section */}
      <section className="py-12 bg-gray-50 animate__animated animate__fadeInUp">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-4">Our Trusted Partners</h2>
          <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            We collaborate with industry leaders to ensure quality, reliability, and excellence in every transaction.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Tata Steel",
                src: "https://www.tatasteel.com/images/tata-steel-logo.svg",
                description: "Global Steel Manufacturing"
              },
              {
                name: "JSW Steel",
                src: "https://www.jsw.in/sites/all/themes/jsw_theme/images/jsw-logo-new.png",
                description: "Leading Steel Producer"
              },
              {
                name: "Hindalco",
                src: "https://www.hindalco.com/style%20library/images/logo.png",
                description: "Aluminum and Copper Solutions"
              },
              {
                name: "Vedanta",
                src: "https://www.vedantalimited.com/img/logo.png",
                description: "Diversified Natural Resources"
              },
              {
                name: "SAIL",
                src: "https://www.sail.co.in/sites/all/themes/sail/images/sail-logo.png",
                description: "State-owned Steel Manufacturing"
              },
              {
                name: "Jindal Steel",
                src: "https://www.jindalsteelpower.com/img/jspl-logo.png",
                description: "Integrated Steel Manufacturing"
              },
              {
                name: "NALCO",
                src: "https://www.nalcoindia.com/wp-content/themes/nalco/images/logo.png",
                description: "Aluminum Manufacturing"
              },
              {
                name: "Bharat Forge",
                src: "https://www.bharatforge.com/assets/images/bf-logo.png",
                description: "Forging and Engineering"
              }
            ].map((partner, index) => (
              <div
                key={partner.name}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-cyan-200 animate__animated animate__fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="h-20 flex items-center justify-center mb-4">
                  <img
                    src={partner.src}
                    alt={partner.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <h3 className="text-lg font-semibold text-center text-gray-800">{partner.name}</h3>
                <p className="text-sm text-gray-600 text-center">{partner.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-gray-50 animate__animated animate__fadeInUp">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-12">How Meta E Bid Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                title: "Register & Verify",
                description: "Create your account and complete the verification process to start trading.",
                icon: <Award className="h-8 w-8" />,
                bgColor: "bg-cyan-100",
                textColor: "text-cyan-600"
              },
              {
                title: "List or Browse",
                description: "List your materials for auction or browse available listings from verified sellers.",
                icon: <DollarSign className="h-8 w-8" />,
                bgColor: "bg-teal-100",
                textColor: "text-teal-600"
              },
              {
                title: "Bid & Negotiate",
                description: "Place competitive bids and negotiate terms with sellers through our secure platform.",
                icon: <Award className="h-8 w-8" />,
                bgColor: "bg-blue-100",
                textColor: "text-blue-600"
              },
              {
                title: "Complete & Deliver",
                description: "Finalize transactions with secure payments and arrange material delivery.",
                icon: <Award className="h-8 w-8" />,
                bgColor: "bg-green-100",
                textColor: "text-green-600"
              }
            ].map((step, index) => (
              <div
                key={index}
                className="text-center animate__animated animate__bounceIn"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={`${step.bgColor} ${step.textColor} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto border border-cyan-200 animate__animated animate__fadeIn">
            <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">Our Commitment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Secure escrow payments for safe transactions",
                "Verified sellers and quality materials",
                "Transparent bidding process",
                "24/7 support for all users"
              ].map((commitment, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 animate__animated animate__fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="text-teal-500 flex-shrink-0">✓</span>
                  <p className="text-gray-600">{commitment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {userData?.status !== "verified" && (
        <section className="py-16 bg-cyan-600 text-white animate__animated animate__pulse">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses buying and selling scrap materials on Meta E Bid.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="secondary"
                size="lg"
                onClick={openVerificationModal}
                className="bg-cyan-500 hover:bg-cyan-600 animate__animated animate__pulse"
              >
                Verify Documents
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50 animate__animated animate__fadeInUp">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-16">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {faqItems.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-cyan-200 transition-all duration-200 hover:shadow-xl animate__animated animate__fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-cyan-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-cyan-100 text-cyan-600 mr-3">
                      {index + 1}
                    </span>
                    {faq.question}
                  </h3>
                  {openFaqIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-cyan-500 flex-shrink-0 ml-4" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-cyan-500 flex-shrink-0 ml-4" />
                  )}
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    openFaqIndex === index
                      ? 'max-h-96 opacity-100'
                      : 'max-h-0 opacity-0'
                  } overflow-hidden animate__animated animate__fadeIn`}
                >
                  <div className="px-6 pb-6 pt-2">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 bg-white animate__animated animate__fadeInUp">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-12">Contact Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                {[
                  { icon: <Mail className="h-6 w-6 text-cyan-600 mt-1" />, title: "Email", content: "info@metaebid.com" },
                  { icon: <Phone className="h-6 w-6 text-cyan-600 mt-1" />, title: "Phone", content: "+1 (555) 123-4567" },
                  {
                    icon: <MapPin className="h-6 w-6 text-cyan-600 mt-1" />,
                    title: "Address",
                    content: "GALA NO 29, Sainath Wadi, BHANGAR GALI LINK ROAD,SAKINAKA, MUMBAI, Mumbai, Maharashtra, 400072"

                  }
                ].map((contact, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 animate__animated animate__fadeIn"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {contact.icon}
                    <div>
                      <h3 className="font-semibold text-gray-800">{contact.title}</h3>
                      <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: contact.content }} />
                    </div>
                  </div>
                ))}
              </div>
              <form className="space-y-4 animate__animated animate__fadeInRight">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 bg-white"
                  ></textarea>
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full bg-cyan-600 hover:bg-cyan-700 animate__animated animate__pulse"
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Modal */}
      <Modal isOpen={isRegisterModalOpen} onClose={closeRegisterModal} title="Create Your Account">
        <RegisterForm onSuccess={closeRegisterModal} />
      </Modal>

      {/* Document Verification Modal */}
      <Modal
        isOpen={isVerificationModalOpen}
        onClose={closeVerificationModal}
        title="Document Verification"
        size="lg"
      >
        <DocumentVerificationForm
          onSuccess={closeVerificationModal}
          onClose={closeVerificationModal}
        />
      </Modal>
    </Layout>
  );
};

export default HomePage;