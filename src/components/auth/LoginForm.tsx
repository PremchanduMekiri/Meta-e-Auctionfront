

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
          window.location.reload();
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
        localStorage.setItem('userData', JSON.stringify(adminData));
        navigate('/_secure/0x9a8b7c_admin-entry');
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
