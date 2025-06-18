import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Link } from 'react-router-dom'; // ✅ Import Link


const AdminLoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ✅ Track login state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://meta-e-auction.infororg.com/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          passwordHash: password, // or 'password' if backend expects raw password
        }),
      });

      if (response.ok) {
        const adminData = await response.json();

        localStorage.setItem('adminId', adminData.id);
        localStorage.setItem('adminEmail', adminData.email);
        localStorage.setItem('adminName', adminData.name);

        setIsLoggedIn(true); // ✅ Set login state to true
      } else if (response.status === 401) {
        setError('Invalid admin credentials. Please try again.');
      } else {
        setError('Admin not found or unknown error occurred.');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoggedIn ? (
        <Link
          to="/admin"
          className="block text-center bg-blue-500 text-white py-2 px-4 rounded-md mt-4"
        >
          Proceed to Admin Dashboard
        </Link>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>
          )}
          <Input
            label="Admin Email"
            type="email"
            placeholder="Enter admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
            <LogIn className="h-4 w-4 mr-2" />
            Admin Sign In
          </Button>
        </form>
      )}
    </div>
  );
};

export default AdminLoginForm;
