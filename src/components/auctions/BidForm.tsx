// import React, { useState, useEffect } from 'react';
// import Button from '../ui/Button';
// import Input from '../ui/Input';
// import { formatCurrency, calculateBidSuggestions } from '../../utils/formatters';
// import { hasEnded } from '../../utils/dateUtils';
// import { useAuth } from '../../context/AuthContext';
// import { useAuctions } from '../../context/AuctionContext';
// import axios from 'axios'; // 👈 Make sure you have imported axios!
// import { useParams } from 'react-router-dom';

// interface BidFormProps {
//   auctionId: string;
//   currentBid: number;
//   endDate: string;
//   onSuccess?: () => void;
// }

// const BidForm: React.FC<BidFormProps> = ({
//   auctionId,
//   currentBid,
//   endDate,
//   onSuccess
// }) => {
//   const { user, isAuthenticated } = useAuth();
//   const { placeBid } = useAuctions();
//   const [bidAmount, setBidAmount] = useState<number>(Math.ceil(currentBid * 1.1));
//   const [error, setError] = useState<string>('');
//   const [success, setSuccess] = useState<string>('');
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const { id } = useParams<{ id: string }>();
  
//   const userData = localStorage.getItem('userData') 
//     ? JSON.parse(localStorage.getItem('userData') as string) 
//     : null;

//   const bidSuggestions = calculateBidSuggestions(currentBid);
//   const auctionEnded = hasEnded(endDate);

//   const handleBidSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!isAuthenticated || !userData) {
//       setError('You must be logged in to place a bid');
//       return;
//     }

//     if (auctionEnded) {
//       setError('This auction has ended');
//       return;
//     }

//     if (bidAmount <= currentBid) {
//       setError(`Bid must be higher than the current bid ${formatCurrency(currentBid)}`);
//       return;
//     }

//     setIsLoading(true);
//     setError('');
//     setSuccess('');

//     try {
//       const payload = {
//         auctionId,
//         bidAmount,
//         userId: userData.id,
//         username: userData.username,
//         email: userData.email,
//       };

//       console.log('Sending payload:', payload);
      
//       // Update the axios URL with the correct endpoint and add any necessary headers for CORS handling
//       const response = await axios.post(`https://metaauction.onrender.com/bids/bid/${payload.userId}/${payload.auctionId}/${payload.bidAmount}`, payload, {
//         withCredentials: true, // Make sure CORS and credentials are handled correctly
//       });
      
//       console.log('Response:', response);

//       if (response.status === 200) {
//         setSuccess(`Your bid of ${formatCurrency(bidAmount)} was successful!`);
//         onSuccess?.();
//       } else {
//         setError('Failed to place bid. Please try again.');
//       }
//     } catch (error) {
//       console.error(error);
//       setError('An error occurred while placing your bid.');
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   const [users, setUsers] = useState(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem('userData');
//     if (storedUser) {
//       setUsers(JSON.parse(storedUser));
//     }
//   }, []);
 

//   if (auctionEnded) {
//     return (
//       <div className="bg-gray-100 p-4 rounded-lg text-center">
//         <p className="text-gray-700">This auction has ended</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
//       <h3 className="text-lg font-semibold text-gray-900 mb-4">Place Your Bid</h3>

//       {!isAuthenticated && (
//         <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-md mb-4">
//           Please login to place a bid on this auction.
//         </div>
//       )}

//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md mb-4">
//           {error}
//         </div>
//       )}

//       {success && (
//         <div className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-md mb-4">
//           {success}
//         </div>
//       )}

//       <div className="mb-4">
//         <p className="text-gray-600 mb-1">Current Bid:</p>
//         <p className="text-xl font-bold text-blue-800">{formatCurrency(currentBid)}</p>
//       </div>

//       <form onSubmit={handleBidSubmit}>
//         <div className="mb-4">
//           <Input
//             label="Your Bid Amount"
//             type="number"
//             value={bidAmount}
//             onChange={(e) => setBidAmount(Number(e.target.value))}
//             min={currentBid + 1}
//             step="1"
//             required
//             disabled={isLoading || !isAuthenticated}
//           />
//         </div>

//         <div className="mb-4">
//           <p className="text-sm text-gray-600 mb-2">Suggested Bids:</p>
//           <div className="flex flex-wrap gap-2">
//             {bidSuggestions.map((suggestion, index) => (
//               <Button
//                 key={index}
//                 type="button"
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setBidAmount(suggestion)}
//                 disabled={isLoading || !isAuthenticated}
//               >
//                 {formatCurrency(suggestion)}
//               </Button>
//             ))}
//           </div>
//         </div>

//         <Button
//           type="submit"
//           variant="primary"
//           fullWidth
//           isLoading={isLoading}
//           disabled={!isAuthenticated}
//         >
//           Place Bid
//         </Button>
//       </form>

//       <div className="mt-4 text-xs text-gray-500">
//         <p>By placing a bid, you agree to the terms and conditions of this auction.</p>
//       </div>
//     </div>
//   );
// };

// export default BidForm;

// import React, { useState, useEffect } from 'react';
// import Button from '../ui/Button';
// import Input from '../ui/Input';
// import { formatCurrency, calculateBidSuggestions } from '../../utils/formatters';
// import { hasEnded } from '../../utils/dateUtils';
// import { useAuth } from '../../context/AuthContext';
// import { useAuctions } from '../../context/AuctionContext';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import { useLocation } from 'react-router-dom';
// interface BidFormProps {
//   auctionId: string;
//   currentBid: number;
//   endDate: string;
//   startDate: string;
//   onSuccess?: () => void;
// }

// const BidForm: React.FC<BidFormProps> = ({
//   auctionId,
//   currentBid,
//   endDate,
//   startDate,

//   onSuccess
// }) => {
//   const { user, isAuthenticated } = useAuth();
//   const { placeBid } = useAuctions();
//   const [bidAmount, setBidAmount] = useState<number>(Math.ceil(currentBid * 1.1));
//   const [error, setError] = useState<string>('');
//   const [success, setSuccess] = useState<string>('');
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const { id } = useParams<{ id: string }>();

//   const [users, setUsers] = useState<any>(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem('userData');
//     if (storedUser) {
//       setUsers(JSON.parse(storedUser));
//     }
//   }, []);

//   const userData = users;

//   const bidSuggestions = calculateBidSuggestions(currentBid);
//   const auctionEnded = hasEnded(endDate);

//   const formattedEndDate = new Date(endDate).toLocaleString('en-IN', {
//     day: '2-digit',
//     month: '2-digit',
//     year: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true,
//   });

//   const handleBidSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!isAuthenticated || !userData) {
//       setError('You must be logged in to place a bid');
//       return;
//     }

//     if (userData.status === 'not_uploaded') {
//       setError('Upload your documents to do the bidding');
//       return;
//     }

//     if (userData.status === 'pending') {
//       setError('Wait until your documents are verified');
//       return;
//     }

//     if (auctionEnded) {
//       setError('This auction has ended');
//       return;
//     }

//     if (bidAmount <= currentBid) {
//       setError(`Bid must be higher than the current bid ${formatCurrency(currentBid)}`);
//       return;
//     }

//     setIsLoading(true);
//     setError('');
//     setSuccess('');

//     try {
//       const payload = {
//         auctionId,
//         bidAmount,
//         userId: userData.id,
//         username: userData.username,
//         email: userData.email,
//       };

//       console.log('Sending payload:', payload);

//       const response = await axios.post(
//         `https://metaauction.onrender.com/bids/bid/${payload.userId}/${payload.auctionId}/${payload.bidAmount}`,
//         payload,
//         {
//           withCredentials: true,
//         }
//       );

//       console.log('Response:', response);

//       if (response.status === 200) {
//         setSuccess(`Your bid of ${formatCurrency(bidAmount)} was successful!`);
//         onSuccess?.();
//       } else {
//         setError('Failed to place bid. Please try again.');
//       }
//     } catch (error) {
//       console.error(error);
//       setError('An error occurred while placing your bid.');
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   const location = useLocation();
//   const auction = location.state?.auction;
//   useEffect(() => {
    

//       console.log('Auction Start  Date:',startDate);
   
//   }, []);
  


  

//   if (auctionEnded) {
//     return (
//       <div className="bg-gray-100 p-4 rounded-lg text-center">
//         <p className="text-gray-700">This auction has ended</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
//       <h3 className="text-lg font-semibold text-gray-900 mb-4">Place Your Bid</h3>

//       <div className="text-sm text-gray-600 mb-2">
//         Auction ends on: <strong>{formattedEndDate}</strong>
//       </div>

//       {!isAuthenticated && (
//         <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-md mb-4">
//           Please login to place a bid on this auction.
//         </div>
//       )}

//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md mb-4">
//           {error}
//         </div>
//       )}

//       {success && (
//         <div className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-md mb-4">
//           {success}
//         </div>
//       )}

//       <div className="mb-4">
//         <p className="text-gray-600 mb-1">Current Bid:</p>
//         <p className="text-xl font-bold text-blue-800">{formatCurrency(currentBid)}</p>
//       </div>

//       <form onSubmit={handleBidSubmit}>
//         <div className="mb-4">
//           <Input
//             label="Your Bid Amount"
//             type="number"
//             value={bidAmount}
//             onChange={(e) => setBidAmount(Number(e.target.value))}
//             min={currentBid + 1}
//             step="1"
//             required
//             disabled={isLoading || !isAuthenticated}
//           />
//         </div>

//         <div className="mb-4">
//           <p className="text-sm text-gray-600 mb-2">Suggested Bids:</p>
//           <div className="flex flex-wrap gap-2">
//             {bidSuggestions.map((suggestion, index) => (
//               <Button
//                 key={index}
//                 type="button"
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setBidAmount(suggestion)}
//                 disabled={isLoading || !isAuthenticated}
//               >
//                 {formatCurrency(suggestion)}
//               </Button>
//             ))}
//           </div>
//         </div>

//         <Button
//           type="submit"
//           variant="primary"
//           fullWidth
//           isLoading={isLoading}
//           disabled={!isAuthenticated}
//         >
//           Place Bid
//         </Button>
//       </form>

//       <div className="mt-4 text-xs text-gray-500">
//         <p>By placing a bid, you agree to the terms and conditions of this auction.</p>
//       </div>
//     </div>
//   );
// };

// export default BidForm;


// BidForm.tsx
// import React, { useState } from 'react';
// import axios from 'axios';
// import { useAuth } from '../../context/AuthContext'; // Update path as needed

// interface BidFormProps {
//   auctionId: string;
//   currentBid: number;
//   startDate: string;
//   endDate: string;
//   onSuccess?: () => void;
// }

// const BidForm: React.FC<BidFormProps> = ({
//   auctionId,
//   currentBid,
//   startDate,
//   endDate,
//   onSuccess,
// }) => {
//   const { user } = useAuth(); // ✅ use your AuthContext
//   const isAuthenticated = !!user;

//   const [bidAmount, setBidAmount] = useState(currentBid + 1);
//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState('');

//   const now = new Date();
//   const start = new Date(startDate);
//   const end = new Date(endDate);

//   const auctionNotStarted = now < start;
//   const auctionEnded = now > end;
//   const auctionOngoing = now >= start && now < end;

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!isAuthenticated) {
//       setMessage('You must be logged in to place a bid.');
//       return;
//     }

//     if (bidAmount <= currentBid) {
//       setMessage('Bid must be higher than current bid.');
//       return;
//     }

//     try {
//       setIsLoading(true);
//       await axios.post('/api/bid', {
//         auctionId,
//         amount: bidAmount,
//       });
//       setMessage('Bid placed successfully.');
//       onSuccess?.();
//     } catch (error) {
//       setMessage('Something went wrong while placing the bid.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleAutoPlaceBid = async () => {
//     if (!isAuthenticated) {
//       setMessage('You must be logged in to auto place a bid.');
//       return;
//     }

//     try {
//       setIsLoading(true);
//       await axios.post('/api/bid/auto', {
//         auctionId,
//         amount: bidAmount,
//       });
//       setMessage('Auto-bid scheduled successfully.');
//       onSuccess?.();
//     } catch (error) {
//       setMessage('Failed to schedule auto-bid.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '6px' }}>
//       <h3>Place a Bid</h3>

//       {message && <p style={{ color: 'blue' }}>{message}</p>}

//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="bidAmount">Your Bid (min: ₹{currentBid + 1})</label>
//           <input
//             type="number"
//             id="bidAmount"
//             value={bidAmount}
//             min={currentBid + 1}
//             onChange={(e) => setBidAmount(Number(e.target.value))}
//             disabled={!isAuthenticated || isLoading}
//             style={{ display: 'block', marginTop: '4px', marginBottom: '12px' }}
//           />
//         </div>

//         {auctionNotStarted && (
//           <button type="button" onClick={handleAutoPlaceBid} disabled={!isAuthenticated || isLoading}>
//             Auto Place Bid
//           </button>
//         )}

//         {auctionOngoing && (
//           <>
//             <button type="submit" disabled={!isAuthenticated || isLoading} style={{ marginRight: '8px' }}>
//               Place Bid
//             </button>
//             <button type="button" onClick={handleAutoPlaceBid} disabled={!isAuthenticated || isLoading}>
//               Auto Place Bid
//             </button>
//           </>
//         )}

//         {auctionEnded && (
//           <p style={{ color: 'red' }}>Auction has ended.</p>
//         )}
//       </form>

//       <p style={{ fontSize: '14px', color: 'gray' }}>
//         Auction starts: {new Date(startDate).toLocaleString()}
//       </p>
//       <p style={{ fontSize: '14px', color: 'gray' }}>
//         Auction ends: {new Date(endDate).toLocaleString()}
//       </p>
//     </div>
//   );
// };

// export default BidForm;



import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { formatCurrency, calculateBidSuggestions } from '../../utils/formatters';
import { hasEnded } from '../../utils/dateUtils';
import { useAuth } from '../../context/AuthContext';
import { useAuctions } from '../../context/AuctionContext';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface BidFormProps {
  auctionId: string;
  currentBid: number;
  endDate: string;
  startDate: string;
  onSuccess?: () => void;
}

const BidForm: React.FC<BidFormProps> = ({
  auctionId,
  currentBid,
  endDate,
  startDate,
  onSuccess
}) => {
  const { user, isAuthenticated } = useAuth();
  const { placeBid } = useAuctions();
  const [bidAmount, setBidAmount] = useState<number>(Math.ceil(currentBid * 1.1));
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      setUsers(JSON.parse(storedUser));
    }
  }, []);

  const userData = users;
  const bidSuggestions = calculateBidSuggestions(currentBid);
  const auctionEnded = hasEnded(endDate);

  // Check if the auction has started
  const auctionStarted = new Date() >= new Date(startDate);

  const formattedEndDate = new Date(endDate).toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  // Handle Automatic Bid Submit
  const handleAutoBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !userData) {
      setError('You must be logged in to place a bid');
      return;
    }

    if (userData.status === 'not_uploaded') {
      setError('Upload your documents to do the bidding');
      return;
    }

    if (userData.status === 'pending') {
      setError('Wait until your documents are verified');
      return;
    }

    if (auctionEnded) {
      setError('This auction has ended');
      return;
    }

    // Ensure bid is higher than current bid
    if (bidAmount <= currentBid) {
      setError(`Bid must be higher than the current bid ${formatCurrency(currentBid)}`);
      return;
    }

    // Send request for automatic bid placement
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(
        `https://metaauction.onrender.com/bids/sheduled/bid/${userData.id}/${auctionId}/${bidAmount}`,
        {
          auctionId,
          bidAmount,
          userId: userData.id,
          username: userData.username,
          email: userData.email,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setSuccess(`Your automatic bid of ${formatCurrency(bidAmount)} was successful!`);
        onSuccess?.();
      } else {
        setError('Failed to place bid. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while placing your bid.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !userData) {
      setError('You must be logged in to place a bid');
      return;
    }

    if (userData.status === 'not_uploaded') {
      setError('Upload your documents to do the bidding');
      return;
    }

    if (userData.status === 'pending') {
      setError('Wait until your documents are verified');
      return;
    }

    if (auctionEnded) {
      setError('This auction has ended');
      return;
    }

    if (bidAmount <= currentBid) {
      setError(`Bid must be higher than the current bid ${formatCurrency(currentBid)}`);
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        auctionId,
        bidAmount,
        userId: userData.id,
        username: userData.username,
        email: userData.email,
      };

      const response = await axios.post(
        `https://metaauction.onrender.com/bids/bid/${payload.userId}/${payload.auctionId}/${payload.bidAmount}`,
        payload,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setSuccess(`Your bid of ${formatCurrency(bidAmount)} was successful!`);
        onSuccess?.();
      } else {
        setError('Failed to place bid. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while placing your bid.');
    } finally {
      setIsLoading(false);
    }
  };

  if (auctionEnded) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg text-center">
        <p className="text-gray-700">This auction has ended</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Place Your Bid</h3>

      <div className="text-sm text-gray-600 mb-2">
        Auction ends on: <strong>{formattedEndDate}</strong>
      </div>

      {!isAuthenticated && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-md mb-4">
          Please login to place a bid on this auction.
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-md mb-4">
          {success}
        </div>
      )}

      <div className="mb-4">
        <p className="text-gray-600 mb-1">Current Bid:</p>
        <p className="text-xl font-bold text-blue-800">{formatCurrency(currentBid)}</p>
      </div>

      {/* Conditional rendering of the buttons */}
      {!auctionStarted ? (
        <form onSubmit={handleAutoBidSubmit}>
          <div className="mb-4">
            <Input
              label="Automatic Bid Amount"
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(Number(e.target.value))}
              min={currentBid + 1}
              step="1"
              required
              disabled={isLoading || !isAuthenticated || userData?.status !== 'verified'}
            />
          </div>

          <div className="mb-4">
            <p className="text-gray-600 mb-2">Suggested Bids:</p>
            <div className="grid grid-cols-3 gap-2">
              {bidSuggestions.map((suggestedBid, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  onClick={() => setBidAmount(suggestedBid)}
                >
                  {formatCurrency(suggestedBid)}
                </Button>
              ))}
            </div>
          </div>
              
          <Button
            type="submit"
            variant="outline"
            fullWidth
            isLoading={isLoading}
            disabled={!isAuthenticated || userData?.status !== 'verified'}
           
          >
            Place Automatic Bid
          </Button>
        </form>
      ) : (
        <form onSubmit={handleBidSubmit}>
          <div className="mb-4">
            <Input
              label="Your Bid Amount"
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(Number(e.target.value))}
              min={currentBid + 1}
              step="1"
              required
              disabled={isLoading || !isAuthenticated || userData?.status !== 'verified'}
            />
          </div>

          <div className="mb-4">
            <p className="text-gray-600 mb-2">Suggested Bids:</p>
            <div className="grid grid-cols-3 gap-2">
              {bidSuggestions.map((suggestedBid, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  onClick={() => setBidAmount(suggestedBid)}
                >
                  {formatCurrency(suggestedBid)}
                </Button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
            disabled={!isAuthenticated || userData?.status !== 'verified'}
            className='bg-blue-800 text-white hover:bg-blue-700 focus:ring-blue-600'
          >
            Place Bid
          </Button>
        </form>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p>By placing a bid, you agree to the terms and conditions of this auction.</p>
      </div>
    </div>
  );
};

export default BidForm;

