// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { 
//   ArrowLeft, Clock, MapPin, Tag, Box, Truck, 
//   Scale, Calendar, DollarSign, User 
// } from 'lucide-react';
// import Layout from '../components/layout/Layout';
// import Button from '../components/ui/Button';
// import Card from '../components/ui/Card';
// import BidForm from '../components/auctions/BidForm';
// import { useAuctions } from '../context/AuctionContext';
// import { formatCurrency } from '../utils/formatters';
// import { formatDate, formatTimeRemaining, hasEnded } from '../utils/dateUtils';
// import axios from 'axios';
// type Auction = {
//   id: number;
//   name: string;
//   description: string;
//   startDate: string;  // Using string for the date since it will be a serialized value (ISO 8601 format)
//   endDate: string;
//   startingPrice: number;
//   status: string;  // Auction status as string
//   highestBidderId: number | null;  // Can be null if there is no highest bidder
//   createdByAdminId: number;
//   createdAt: string;  // Same as startDate and endDate
//   user: any;  // Adjust this according to your `Users` entity if you need more specific typing
// };
// const AuctionDetailPage: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const [auctions, setAuctions] = useState<Auction | null>(null);

//   useEffect(() => {
//     const fetchAuctionDetail = async () => {
//       try {
//         const res = await axios.get<Auction>(`http://localhost:8080/auction/auctionBy/${id}`);
//         setAuctions(res.data);
//         console.log(res.data);
//       } catch (error) {
//         console.error("Error fetching auction detail:", error);
//       }
//     };

//     if (id) {
//       fetchAuctionDetail();
//       console.log(fetchAuctionDetail())
//       console.log(id);
//     }
//   }, [id]);

//   useEffect(() => {
//       console.log(id);
//       console.log(auctions);
//   }
//   , [id]);
//   const { getAuctionById } = useAuctions();
//   const [activeImage, setActiveImage] = useState<number>(0);
//   const [timeRemaining, setTimeRemaining] = useState<string>('');
  
//   const auction = getAuctionById(id || '');
  
//   useEffect(() => {
//     if (!auctions) return;
    
//     // Update time remaining every second
//     const timer = setInterval(() => {
//       setTimeRemaining(formatTimeRemaining(auctions.endDate));
//     }, 1000);
    
//     return () => clearInterval(timer);
//   }, [auctions]);
  
//   if (!auctions) {
//     return (
//       <Layout>
//         <div className="container mx-auto px-4 py-12 text-center">
//           <h1 className="text-2xl font-bold text-gray-900 mb-4">Auction Not Found</h1>
//           <p className="text-gray-600 mb-8">The auction you're looking for doesn't exist or has been removed.</p>
//           <Link to="/auctions">
//             <Button variant="primary">Browse Auctions</Button>
//           </Link>
//         </div>
//       </Layout>
//     );
//   }
  
//   const auctionEnded = hasEnded(auctions.endDate);
  
//   return (
//     <Layout>
//       <div className="container mx-auto px-4 py-8">
//         <Link to="/" className="inline-flex items-center text-blue-800 hover:text-blue-700 mb-6">
//           <ArrowLeft className="h-4 w-4 mr-1" />
//           Back to Home
//         </Link>
        
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left Column - Images */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
//               {/* Main Image */}
//               <div className="relative bg-gray-100 aspect-video">
//                 <img 
//                   src={auction.images[activeImage]} 
//                   alt={auction.title} 
//                   className="w-full h-full object-contain"
//                 />
                
//                 {auctionEnded && (
//                   <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//                     <div className="bg-red-600 text-white py-2 px-4 rounded-md font-bold text-lg">
//                       Auction Ended
//                     </div>
//                   </div>
//                 )}
//               </div>
              
//               {/* Thumbnail Images */}
//               {auction.images.length > 1 && (
//                 <div className="flex p-2 gap-2 overflow-x-auto">
//                   {auction.images.map((image, index) => (
//                     <div 
//                       key={index}
//                       className={`w-20 h-20 flex-shrink-0 cursor-pointer border-2 rounded overflow-hidden
//                         ${index === activeImage ? 'border-blue-800' : 'border-transparent'}
//                       `}
//                       onClick={() => setActiveImage(index)}
//                     >
//                       <img 
//                         src={image} 
//                         alt={`Thumbnail ${index + 1}`} 
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
            
//             {/* Auction Details */}
//             <Card className="mb-6" padding="lg">
//               <h1 className="text-2xl font-bold text-gray-900 mb-2">{auctions.name}</h1>
              
//               <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-4 gap-y-2 mb-4">
//                 <div className="flex items-center">
//                   <Calendar className="h-4 w-4 mr-1" />
//                   <span>Started {formatDate(auctions.startDate)}</span>
//                 </div>
//                 <div className="flex items-center">
//                   <Tag className="h-4 w-4 mr-1" />
//                   {/* <span>{auction.material}</span> */}
//                 </div>
//                 <div className="flex items-center">
//                   <MapPin className="h-4 w-4 mr-1" />
//                   {/* <span>{auction.location}</span> */}
//                 </div>
//                 <div className="flex items-center">
//                   <User className="h-4 w-4 mr-1" />
//                   {/* <span>Seller: {auctions.sellerName}</span> */}
//                 </div>
//               </div>
              
//               <div className="border-t border-b border-gray-200 py-4 my-4">
//                 <h2 className="text-lg font-semibold mb-3">Description</h2>
//                 <p className="text-gray-700 whitespace-pre-line">
//                   {auctions.description}
//                 </p>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 <div className="bg-gray-50 p-3 rounded-md">
//                   <div className="flex items-center text-gray-500 text-sm mb-1">
//                     <Box className="h-4 w-4 mr-1" />
//                     <span>Quantity</span>
//                   </div>
//                   {/* <div className="font-medium">{auction.quantity} {auction.unit}</div> */}
//                 </div>
                
//                 <div className="bg-gray-50 p-3 rounded-md">
//                   <div className="flex items-center text-gray-500 text-sm mb-1">
//                     <Truck className="h-4 w-4 mr-1" />
//                     <span>Shipping</span>
//                   </div>
//                   <div className="font-medium">Buyer arranges pickup</div>
//                 </div>
                
//                 <div className="bg-gray-50 p-3 rounded-md">
//                   <div className="flex items-center text-gray-500 text-sm mb-1">
//                     <Scale className="h-4 w-4 mr-1" />
//                     <span>Payment Terms</span>
//                   </div>
//                   <div className="font-medium">Due within 3 days of auction end</div>
//                 </div>
//               </div>
//             </Card>
            
//             {/* Bid History */}
//             <Card padding="lg">
//               <h2 className="text-lg font-semibold mb-4">Bid History</h2>
              
//               {auction.bids.length > 0 ? (
//                 <div className="border rounded-md overflow-hidden">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Bidder
//                         </th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Amount
//                         </th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Date & Time
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {[...auction.bids].reverse().map(bid => (
//                         <tr key={bid.id}>
//                           <td className="px-4 py-3 whitespace-nowrap">
//                             <div className="font-medium text-gray-900">{bid.username}</div>
//                           </td>
//                           <td className="px-4 py-3 whitespace-nowrap">
//                             <div className="text-blue-800 font-medium">{formatCurrency(bid.amount)}</div>
//                           </td>
//                           <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
//                             {formatDate(bid.timestamp)}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : (
//                 <div className="text-center py-4 bg-gray-50 rounded-md">
//                   <p className="text-gray-500">No bids yet. Be the first to bid!</p>
//                 </div>
//               )}
//             </Card>
//           </div>
          
//           {/* Right Column - Bidding */}
//           <div>
//             {/* Auction Status */}
//             <Card className="mb-6" padding="lg">
//               <div className="flex flex-col">
//                 <div className="flex items-start justify-between mb-4">
//                   <div>
//                     <p className="text-gray-500 text-sm mb-1">Current Bid:</p>
//                     <p className="text-3xl font-bold text-blue-800">
//                       {formatCurrency(auction.currentBid)}
//                     </p>
//                   </div>
                  
//                   <div className="text-right">
//                     <p className="text-gray-500 text-sm mb-1">Starting Price:</p>
//                     <p className="text-lg font-medium text-gray-700">
//                       {formatCurrency(auctions.startingPrice)}
//                     </p>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center mb-4">
//                   <Clock className="h-5 w-5 text-amber-600 mr-2" />
//                   <div>
//                     <p className="text-sm text-gray-500">Time Remaining:</p>
//                     <p className={`font-medium ${auctionEnded ? 'text-red-600' : 'text-amber-600'}`}>
//                       {timeRemaining}
//                     </p>
//                   </div>
//                 </div>
                
//                 <div className="text-sm text-gray-500">
//                   <p>Auction ends: {formatDate(auctions.endDate)}</p>
//                   <p className="mt-1">Bids: {auction.bids.length}</p>
//                 </div>
//               </div>
//             </Card>
            
//             {/* Bid Form */}
//             <BidForm 
//               auctionId={auctions.id} 
//               currentBid={auction.currentBid}
//               endDate={auctions.endDate}
//             />
            
//             {/* Seller Info */}
//             <Card className="mt-6" padding="lg">
//               <h3 className="text-lg font-semibold mb-3">Seller Information</h3>
//               <div className="flex items-center mb-4">
//                 <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
//                   <User className="w-full h-full p-2 text-gray-600" />
//                 </div>
//                 <div className="ml-3">
//                   <p className="font-medium text-gray-900">{auction.sellerName}</p>
//                   <p className="text-sm text-gray-500">Seller since 2022</p>
//                 </div>
//               </div>
              
//               <div className="flex flex-wrap gap-2 mb-4">
//                 <div className="bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded-full">
//                   Verified Seller
//                 </div>
//                 <div className="bg-green-50 text-green-800 text-xs px-2 py-1 rounded-full">
//                   98% Positive Feedback
//                 </div>
//               </div>
              
//               <Button variant="outline" fullWidth>
//                 Contact Seller
//               </Button>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default AuctionDetailPage;






import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Clock, MapPin, Tag, Box, Truck, 
  Scale, Calendar, DollarSign, User 
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import BidForm from '../components/auctions/BidForm';
import { formatCurrency } from '../utils/formatters';
import { formatDate, formatTimeRemaining, hasEnded } from '../utils/dateUtils';
import axios from 'axios';

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
  user?: {
    id: number;
    name: string;
    email: string;
  };
  bids?: Array<{
    id: number;
    amount: number;
    createdAt: string;
    user: {
      id: number;
      name: string;
    };
  }>;
};

const AuctionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [activeImage, setActiveImage] = useState<number>(0);

  useEffect(() => {
    const fetchAuctionDetail = async () => {
      try {
        setLoading(true);
        const res = await axios.get<Auction>(`https://metaauction.onrender.com/auction/auctionBy/${id}`);
        setAuction(res.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching auction detail:", err);
        setError('Failed to load auction details');
        setAuction(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAuctionDetail();
    }
  }, [id]);

  useEffect(() => {
    if (!auction) return;
    
    // Update time remaining every second
    const timer = setInterval(() => {
      setTimeRemaining(formatTimeRemaining(auction.endDate));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [auction]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <p>Loading auction details...</p>
        </div>
      </Layout>
    );
  }

  if (error || !auction) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Auction Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'The auction you requested could not be found.'}</p>
          <Link to="/">
            <Button variant="primary">Back to Home</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const auctionEnded = hasEnded(formatDate(auction.endDate));
  const defaultImage = '/image1.png';
  const auctionImage = auction.image || defaultImage; // Assuming auction has an image field.

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-blue-800 hover:text-blue-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              {/* Main Image */}
              <div className="relative bg-gray-100 aspect-video">
              <img 
    src={auctionImage} 
    alt={auction.name} 
    className="w-full max-w-5xl object-contain rounded-lg shadow-md border-4 border-gray-200 h-300 mx-auto"
  />
                
                {auctionEnded && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-red-600 text-white py-2 px-4 rounded-md font-bold text-lg">
                      Auction Ended
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Auction Details */}
            <Card className="mb-6" padding="lg">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{auction.name}</h1>
              
              <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-4 gap-y-2 mb-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Started {formatDate(auction.startDate)}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Ends {formatDate(auction.endDate)}</span>
                </div>
                {auction.user && (
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>Seller: {auction.user.name}</span>
                  </div>
                )}
              </div>
              
              <div className="border-t border-b border-gray-200 py-4 my-4">
                <h2 className="text-lg font-semibold mb-3">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {auction.description || 'No description provided.'}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center text-gray-500 text-sm mb-1">
                   
                    <span>Starting Price</span>
                  </div>
                  <div className="font-medium">{formatCurrency(auction.startingPrice)}</div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center text-gray-500 text-sm mb-1">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Status</span>
                  </div>
                  <div className="font-medium">{auction.status}</div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center text-gray-500 text-sm mb-1">
                    <Scale className="h-4 w-4 mr-1" />
                    <span>Highest Bidder</span>
                  </div>
                  <div className="font-medium">
                    {auction.highestBidderId ? `User #${auction.highestBidderId}` : 'None'}
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Bid History */}
            <Card padding="lg">
              <h2 className="text-lg font-semibold mb-4">Bid History</h2>
              
              {auction.bids && auction.bids.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bidder
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {auction.bids.map(bid => (
                        <tr key={bid.id}>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{bid.user.name}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-blue-800 font-medium">{formatCurrency(bid.amount)}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(bid.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4 bg-gray-50 rounded-md">
                  <p className="text-gray-500">No bids yet. Be the first to bid!</p>
                </div>
              )}
            </Card>
          </div>
          
          {/* Right Column - Bidding */}
          <div>
            {/* Auction Status */}
            <Card className="mb-6" padding="lg">
              <div className="flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Current Bid:</p>
                    <p className="text-3xl font-bold text-blue-800">
                      {formatCurrency(auction.startingPrice)}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-gray-500 text-sm mb-1">Starting Price:</p>
                    <p className="text-lg font-medium text-gray-700">
                      {formatCurrency(auction.startingPrice)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  <Clock className="h-5 w-5 text-amber-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Time Remaining:</p>
                    <p className={`font-medium ${auctionEnded ? 'text-red-600' : 'text-amber-600'}`}>
                      {timeRemaining}
                    </p>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500">
                  <p>Auction ends: {formatDate(auction.endDate)}</p>
                  <p className="mt-1">Bids: {auction.bids?.length || 0}</p>
                </div>
              </div>
            </Card>
            
            {/* Bid Form */}
            {!auctionEnded && (
              <BidForm auctionId={auction.id}
              currentBid={auction.startingPrice}
  endDate={auction.endDate}/> 
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AuctionDetailPage;
