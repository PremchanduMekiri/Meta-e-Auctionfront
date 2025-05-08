import React, { useState } from 'react';
import { X } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import AdminLoginForm from './AdminLoginForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'admin';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'admin'>(initialMode);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-lg max-w-md w-full relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="p-6">
          <div className="flex justify-center mb-6">
            <div className="w-full flex border-b border-gray-200">
              <button
                className={`flex-1 py-2 text-center ${
                  mode === 'login' 
                    ? 'text-blue-800 border-b-2 border-blue-800 font-medium' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setMode('login')}
              >
                Login
              </button>
              <button
                className={`flex-1 py-2 text-center ${
                  mode === 'register' 
                    ? 'text-blue-800 border-b-2 border-blue-800 font-medium' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setMode('register')}
              >
                Register
              </button>
            
            </div>
          </div>
          
          {mode === 'login' ? (
            <LoginForm onSuccess={onClose} />
          ) : mode === 'register' ? (
            <RegisterForm onSuccess={onClose} />
          ) : (
            <AdminLoginForm onSuccess={onClose} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;