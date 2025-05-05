// import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// interface ProtectedRouteProps {
//   role: 'user' | 'admin';
//   children?: React.ReactNode;
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role, children }) => {
//   const { isAuthenticated, isAdmin } = useAuth();

//   if (!isAuthenticated) {
//     // Redirect to login page if user is not authenticated
//     return <Navigate to="/login" />;
//   }

//   if (role === 'admin' && !isAdmin) {
//     // Redirect to home page if user is not an admin
//     return <Navigate to="/" />;
//   }

//   if (role === 'user' && isAdmin) {
//     // Redirect to home page if an admin tries to access user routes
//     return <Navigate to="/admin" />;
//   }

//   return children ? <>{children}</> : <Outlet />;
// };

// export default ProtectedRoute;
