// import React, { useState } from 'react';
// import { LogIn } from 'lucide-react';
// import Button from '../ui/Button';
// import Input from '../ui/Input';
// import { useAuth } from '../../context/AuthContext';

// interface LoginFormProps {
//   onSuccess: () => void;
// }

// const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
//   const { login } = useAuth();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
  
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
    
//     if (!email || !password) {
//       setError('Please fill in all fields');
//       return;
//     }
    
//     setIsLoading(true);
    
//     try {
//       const success = await login(email, password);
      
//       if (success) {
//         onSuccess();
//       } else {
//         setError('Invalid credentials. Please try again.');
//       }
//     } catch (err) {
//       setError('An error occurred. Please try again.');
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   // For demo login without backend
//   const handleDemoLogin = async (role: 'supplier' | 'buyer') => {
//     setIsLoading(true);
    
//     try {
//       let demoEmail = role === 'supplier' 
//         ? 'supplier@metalscrap.com' 
//         : 'buyer@greenrecycle.com';
      
//       const success = await login(demoEmail, 'demo-password');
      
//       if (success) {
//         onSuccess();
//       } else {
//         setError('Demo login failed. Please try again.');
//       }
//     } catch (err) {
//       setError('An error occurred. Please try again.');
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       {error && (
//         <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
//           {error}
//         </div>
//       )}
      
//       <Input
//         label="Email"
//         type="email"
//         placeholder="Enter your email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         required
//       />
      
//       <Input
//         label="Password"
//         type="password"
//         placeholder="Enter your password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         required
//       />
      
//       <div className="flex items-center justify-between">
//         <div className="flex items-center">
//           <input
//             id="remember-me"
//             name="remember-me"
//             type="checkbox"
//             className="h-4 w-4 text-blue-800 focus:ring-blue-500 border-gray-300 rounded"
//           />
//           <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
//             Remember me
//           </label>
//         </div>
        
//         <a href="#" className="text-sm text-blue-800 hover:text-blue-700">
//           Forgot password?
//         </a>
//       </div>
      
//       <Button
//         type="submit"
//         variant="primary"
//         fullWidth
//         isLoading={isLoading}
//       >
//         <LogIn className="h-4 w-4 mr-2" />
//         Sign In
//       </Button>
      
//       <div className="relative py-3">
//         <div className="absolute inset-0 flex items-center">
//           <div className="w-full border-t border-gray-300"></div>
//         </div>
//         <div className="relative flex justify-center">
//           <span className="bg-white px-2 text-sm text-gray-500">Or try demo accounts</span>
//         </div>
//       </div>
      
//       <div className="grid grid-cols-2 gap-3">
//         <Button
//           type="button"
//           variant="outline"
//           onClick={() => handleDemoLogin('supplier')}
//           disabled={isLoading}
//         >
//           Demo Supplier
//         </Button>
//         <Button
//           type="button"
//           variant="outline"
//           onClick={() => handleDemoLogin('buyer')}
//           disabled={isLoading}
//         >
//           Demo Buyer
//         </Button>
//       </div>
//     </form>
//   );
// };

// export default LoginForm;

// import React, { useEffect, useState } from 'react';
// import { LogIn } from 'lucide-react';
// import Button from '../ui/Button';
// import Input from '../ui/Input';
// import { useAuth } from '../../context/AuthContext';

// interface LoginFormProps {
//   onSuccess: () => void;
// }

// const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
//   const { login } = useAuth();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');

//     if (!email || !password) {
//       setError('Please fill in all fields');
//       return;
//     }
//     console.log('Email:', email);      // 👈 log email
//     console.log('Password:', password); // 👈 log password
    
//     setIsLoading(true);

//     try {
//       const response = await fetch('http://localhost:8080/api/auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });
     
//       const data = await response.json();

//       if (response.ok) {
//         console.log('Login successful:', data); // 👈 log success
//         console.log('User ID:', data.id);      // 👈 log user id
//         console.log('Email:', email);           // 👈 log email
//         console.log('Password:', password);     // 👈 log password
//         localStorage.setItem('userId', data.id); 
//         localStorage.setItem('loggedIn', 'true');
//        localStorage.setItem('userData', JSON.stringify(data)); // ✅ Store login status
//         await login(email, password); // ✅ Set user in context (optional but useful)
//         onSuccess();
//       } else {
//         setError(data);
//       }
//     } catch (err) {
//       setError('An error occurred. Please try again.');
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDemoLogin = async (role: 'supplier' | 'buyer') => {
//     setIsLoading(true);

//     try {
//       const id = role === 'supplier' ? 'supplierId' : 'buyerId'; // Replace with actual IDs
     
//       const demoEmail =
//         role === 'supplier' ? 'supplier@metalscrap.com' : 'buyer@greenrecycle.com';
//       const demoPassword = 'demo-password';

//       const response = await fetch('http://localhost:8080/api/auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({id:id, email: demoEmail, password: demoPassword }),
//       });

//       const data = await response.json();
     
//       if (response.ok) {
//         localStorage.setItem('userId',data.id);// ✅ Store user ID
//         localStorage.setItem('loggedIn', 'true'); // ✅ Store login status
//         await login(demoEmail, demoPassword); // ✅ Set user in context
//         onSuccess();
//       } else { 
//         setError(data);
//       }
//     } catch (err) {
//       setError('An error occurred. Please try again.');
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       {error && (
//         <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
//           {error}
//         </div>
//       )}

//       <Input
//         label="Email"
//         type="email"
//         placeholder="Enter your email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         required
//       />

//       <Input
//         label="Password"
//         type="password"
//         placeholder="Enter your password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         required
//       />

//       <div className="flex items-center justify-between">
//         <div className="flex items-center">
//           <input
//             id="remember-me"
//             name="remember-me"
//             type="checkbox"
//             className="h-4 w-4 text-blue-800 focus:ring-blue-500 border-gray-300 rounded"
//           />
//           <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
//             Remember me
//           </label>
//         </div>

//         <a href="#" className="text-sm text-blue-800 hover:text-blue-700">
//           Forgot password?
//         </a>
//       </div>

//       <Button
//         type="submit"
//         variant="primary"
//         fullWidth
//         isLoading={isLoading}
//       >
//         <LogIn className="h-4 w-4 mr-2" />
//         Sign In
//       </Button>
// {/* 
//       <div className="relative py-3">
//         <div className="absolute inset-0 flex items-center">
//           <div className="w-full border-t border-gray-300"></div>
//         </div>
//         <div className="relative flex justify-center">
//           <span className="bg-white px-2 text-sm text-gray-500">Or try demo accounts</span>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-3">
//         <Button
//           type="button"
//           variant="outline"
//           onClick={() => handleDemoLogin('supplier')}
//           disabled={isLoading}
//         >
//           Demo Supplier
//         </Button>
//         <Button
//           type="button"
//           variant="outline"
//           onClick={() => handleDemoLogin('buyer')}
//           disabled={isLoading}
//         >
//           Demo Buyer
//         </Button>
//       </div> */}
//     </form>
//   );
// };

// export default LoginForm;
// import React, { useState } from 'react';
// import { LogIn } from 'lucide-react';
// import Button from '../ui/Button';
// import Input from '../ui/Input';
// import { useAuth } from '../../context/AuthContext';
// import { useNavigate } from 'react-router-dom';

// interface LoginFormProps {
//   onSuccess: () => void;
// }

// const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');

//     if (!email || !password) {
//       setError('Please fill in all fields');
//       return;
//     }

//     setIsLoading(true);

//     // First try user login
//     try {
//       const userResponse = await fetch('http://localhost:8080/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
       
//       });
// console.log('User Response:--------------------------===========', userResponse); // 👈 log user response
// if (userResponse.ok) {
//   const userData = await userResponse.json();
//   console.log('User Data:', userData); // 👈 log user data

//   // Save user info in localStorage
//   localStorage.setItem('userId', userData.id);
//   localStorage.setItem('userData', JSON.stringify(userData));
//   localStorage.setItem('loggedIn', 'true');

//   console.log('User ID:', userData.id, userData.status); // 👈 log user id

//   // Proceed with login (you can call your existing login function)
//   await login(email, password);

//   // Hide the modal/popup after successful login
//   onSuccess();

//   // Redirect based on user status
//   if (userData.status === 'pending') {
//     await login(email, password);
//     onSuccess();
//     navigate('/DocumentVerificationForm');
//   } else if (userData.status === 'verified') {
//     await login(email, password);
//     onSuccess();
//     navigate('/');
    
//   } else {
//     await login(email, password);
//     onSuccess();
//     navigate('/'); // Default fallback
    
//   }

//   return; // Exit if login is successful
// } else {
//   // If the credentials don't match, show an alert
//   alert('Invalid credentials. Please try again.');
// }

//       // If user login fails, try admin login
//       const adminResponse = await fetch('http://localhost:8080/admin/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, passwordHash: password }),
//       });

//       if (adminResponse.ok) {
//         const adminData = await adminResponse.json();
//         localStorage.setItem('adminId', adminData.id);
//         localStorage.setItem('adminEmail', adminData.email);
//         localStorage.setItem('adminName', adminData.name);
//         navigate('/admin');
//         return;
//       }

//       // If both fail
//       const userData = await userResponse.json();
//       const adminData = await adminResponse.json();
//       setError(userData.message || adminData.message || 'Login failed. Check credentials.');

//     } catch (err) {
//       console.error(err);
//       setError('An error occurred. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4 bg-white rounded shadow">
//       <h2 className="text-xl font-semibold text-center">Sign In</h2>

//       {error && <div className="bg-red-100 text-red-600 p-3 rounded">{error}</div>}

//       <Input
//         label="Email"
//         type="email"
//         placeholder="Enter your email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         required
//       />

//       <Input
//         label="Password"
//         type="password"
//         placeholder="Enter your password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         required
//       />

//       <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
//         <LogIn className="h-4 w-4 mr-2" />
//         Sign In
//       </Button>
//     </form>
//   );
// };

// export default LoginForm;

import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
  onSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      // Try user login first
      const userResponse = await fetch('https://metaauction.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();

        // Save user info in localStorage
        localStorage.setItem('userId', userData.id);
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('loggedIn', 'true');

        await login(email, password);
        onSuccess();

        if (userData.status === 'Not Uploaded') {
          navigate('/DocumentVerificationForm');
        } else {
          navigate('/');
        }
        return;
      }

      // If user login fails, try admin login
      const adminResponse = await fetch('https://metaauction.onrender.com/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, passwordHash: password }),
      });

      if (adminResponse.ok) {
        const adminData = await adminResponse.json();

        // Save admin info in localStorage
        localStorage.setItem('adminId', adminData.id);
        localStorage.setItem('adminEmail', adminData.email);
        localStorage.setItem('adminName', adminData.name);

        navigate('/admin');
        return;
      }

      // If both fail
      alert('Invalid credentials. Please try again.');
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold text-center">Sign In</h2>

      {error && <div className="bg-red-100 text-red-600 p-3 rounded">{error}</div>}

      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
        <LogIn className="h-4 w-4 mr-2" />
        Sign In
      </Button>
    </form>
  );
};

export default LoginForm;
