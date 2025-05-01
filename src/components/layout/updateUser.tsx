import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  [key: string]: any;
}

const UpdateProfile: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<User | null>(null);
  const [formData, setFormData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setUserData(parsedData);
        setFormData(parsedData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to parse userData from localStorage:', error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => {
      const updatedData = prevState ? { ...prevState, [name]: value } : prevState;
      console.log(`Updated field ${name}:`, value);
      return updatedData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (formData && formData.id) {
      console.log('Submitting form data:', formData);
      try {
        const response = await axios.put(`https://metaauction.onrender.com/user/update/${formData.id}`, formData);
        console.log('Response from server:', response.data);
        setSuccessMessage('Profile updated successfully!');
        localStorage.setItem('userData', JSON.stringify(response.data));
        setTimeout(() => {
          navigate('/user-profile');
        }, 2000);
      } catch (error) {
        console.error('Error updating profile:', error);
        setErrorMessage('Failed to update profile. Please try again.');
      }
    } else {
      setErrorMessage('User data is missing or invalid.');
    }
  };

  const handleDelete = async () => {
    if (formData && formData.id) {
      try {
        await axios.delete(`https://metaauction.onrender.com/user/delete/${formData.id}`);
        setSuccessMessage('Profile deleted successfully!');
        localStorage.removeItem('userData');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (error) {
        console.error('Error deleting profile:', error);
        setErrorMessage('Failed to delete profile. Please try again.');
      }
    } else {
      setErrorMessage('User data is missing or invalid.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-2xl shadow-xl space-y-6">
      <h1 className="text-3xl font-semibold text-gray-800 text-center mb-6">Update Profile</h1>

      <div className="bg-gray-50 p-6 rounded-2xl shadow-lg">
        {successMessage && (
          <div className="bg-green-500 text-white p-4 rounded-lg mb-4">
            <strong>Success!</strong> {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
            <strong>Error!</strong> {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 font-medium">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData?.username || ''}
              onChange={handleChange}
              className="mt-2 px-4 py-2 w-full border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData?.email || ''}
              onChange={handleChange}
              className="mt-2 px-4 py-2 w-full border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Phone Field */}
          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-700 font-medium">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData?.phone || ''}
              onChange={handleChange}
              className="mt-2 px-4 py-2 w-full border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Address Field */}
          <div className="mb-4">
            <label htmlFor="address" className="block text-gray-700 font-medium">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData?.address || ''}
              onChange={handleChange}
              className="mt-2 px-4 py-2 w-full border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
           
          <div className="text-center space-x-4">
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Update Profile
            </button>
            
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
