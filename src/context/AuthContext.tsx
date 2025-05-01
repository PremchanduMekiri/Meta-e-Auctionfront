// import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
// import { User } from '../types';
// import { users } from '../data/mockData';
// interface users {
//   id: string;
//   email: string;
//   role: 'buyer' | 'supplier' | 'admin';
// }
// interface AuthContextType {
//   userId: string | null;
//   user: User | null;
//   isAuthenticated: boolean;
//   isAdmin: boolean;
//   login: (email: string, password: string) => Promise<boolean>;
//   adminLogin: (email: string, password: string) => Promise<boolean>;
//   register: (email: string, username: string, password: string, role: 'supplier' | 'buyer') => Promise<boolean>;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId'));
//   const userData = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData') as string) : null;

//   useEffect(() => {
//     console.log('User ID from localStorage:', userId);
//     console.log('User data from localStorage:', userData);
//   }, [userId]);
//   const login = async (email: string, password: string): Promise<boolean> => {


//     try {
//       const response = await fetch('http://localhost:8080/api/auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       if (response.ok) {
//         const userData = await response.json();
//         setUser(userData);
//         setIsAdmin(false);
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.error("Login error:", error);
//       return false;
//     }
//   };

//   const adminLogin = async (email: string, password: string): Promise<boolean> => {
//     try {
//       const response = await fetch('http://localhost:8080/admin/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });
  
//       // Log the response to check its contents
      
//       const responseText = await response.text();
  
//       if (response.ok) {
//         const adminData = await response.json(); // Handle success (assuming the response is JSON)
//         console.log("Admin login success:", adminData);
//         setIsAdmin(true);
//         return true;
//       } else {
//         console.error("Admin login failed:", responseText);
//         return false;
//       }
//     } catch (error) {
//       console.error("Admin login error:", error);
//       return false;
//     }
//   };
  
  
  

//   const register = async (
//     email: string, 
//     username: string, 
//     password: string, 
//     role: 'supplier' | 'buyer'
//   ): Promise<boolean> => {
//     try {
//       const response = await fetch('http://localhost:8080/api/auth/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, username, password, role }),
//       });

//       if (response.ok) {
//         const userData = await response.json();
//         setUser(userData);
//         setIsAdmin(false);
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.error("Registration error:", error);
//       return false;
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     setIsAdmin(false);
//   };

//   return (
//     <AuthContext.Provider value={{ 
//       user, 
//       isAuthenticated: !!user, 
//       isAdmin,
//       login, 
//       adminLogin,
//       register, 
//       logout 
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';

interface UserData {
  id: string;
  email: string;
  role: 'buyer' | 'supplier' | 'admin';
}

interface AuthContextType {
  userId: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  register: (email: string, username: string, password: string, role: 'supplier' | 'buyer') => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Load user from localStorage on initial mount
  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    const storedUserId = localStorage.getItem('userId');

    if (storedUser && storedUserId) {
      setUser(JSON.parse(storedUser));
      setUserId(storedUserId);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('https://metaauction.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const userData: User = await response.json();
        setUser(userData);
        setUserId(userData.id);
        setIsAdmin(false);

        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('userId', userData.id);

        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('https://metaauction.onrender.com/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const adminData: User = await response.json();
        console.log('Admin login success:', adminData);

        setUser(adminData);
        setUserId(adminData.id);
        setIsAdmin(true);

        localStorage.setItem('userData', JSON.stringify(adminData));
        localStorage.setItem('userId', adminData.id);

        return true;
      } else {
        const errorText = await response.text();
        console.error('Admin login failed:', errorText);
        return false;
      }
    } catch (error) {
      console.error('Admin login error:', error);
      return false;
    }
  };

  const register = async (
    email: string,
    username: string,
    password: string,
    role: 'supplier' | 'buyer'
  ): Promise<boolean> => {
    try {
      const response = await fetch('https://metaauction.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password, role }),
      });

      if (response.ok) {
        const userData: User = await response.json();
        setUser(userData);
        setUserId(userData.id);
        setIsAdmin(false);

        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('userId', userData.id);

        return true;
      }

      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setUserId(null);
    setIsAdmin(false);

    localStorage.removeItem('userData');
    localStorage.removeItem('userId');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userId,
        isAuthenticated: !!user,
        isAdmin,
        login,
        adminLogin,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
