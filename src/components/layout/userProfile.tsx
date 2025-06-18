
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from './Layout';

interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  status?: string;
  [key: string]: any;
}

export const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<User | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
  
    if (!storedData) {
      // No user data in localStorage, redirect to home
      window.location.href = '/';
      return;
    }
  
    try {
      const parsedData = JSON.parse(storedData);
      setUserData(parsedData);
    } catch (error) {
      console.error('Failed to parse userData:', error);
      window.location.href = '/';
    }
  }, []);
  
 
  useEffect(() => {
    if (userData?.id) {
      // Use template literal for the API URL
      axios
        .get(`https://meta-e-auction.infororg.com/user/userBy/${userData.id}`)
        .then((res) => {
          setUserDetails(res.data);
          setFormData(res.data);  // Initialize formData with the fetched user data
        })
        .catch((err) => console.error('Error fetching details:', err));
    }
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      const updatedData = { ...formData };
      if (!updatedData.password?.trim()) {
        delete updatedData.password; // Ignore password if left blank
      }

      // Validation can be added here
      if (!updatedData.username || !updatedData.email) {
        alert("Please fill in both username and email");
        return;
      }

      try {
        // Use template literal for the API URL
        const response = await axios.put(
          `https://meta-e-auction.infororg.com/user/update/${formData.id}`,
          updatedData
        );
        alert('Profile updated successfully!');
        setIsEditing(false);
        setUserDetails(response.data);
      } catch (err) {
        console.error('Update error:', err);
        alert('Failed to update profile');
      }
    }
  };

  const handleDelete = async () => {
    if (!formData?.id) {
      alert('User ID is missing. Cannot proceed with deletion.');
      return;
    }
  
    try {
      // Log the action for debugging
      console.log(`Attempting to delete user with ID: ${formData.id}`);
      
      // Send the DELETE request
      const response = await axios.delete(`https://meta-e-auction.infororg.com/user/delete/${formData.id}`, {
        headers: {
          'Content-Type': 'application/json', // Add any required headers
          // Include authorization if needed
          // Authorization: `Bearer ${token}`,
        },
        
      });
  
      // Log the successful response
      console.log('Profile deleted successfully:', response.data);
  
      // Notify the user and redirect
      alert('Profile deleted!');
      localStorage.removeItem('userData');
      navigate('/'); // Redirect to the homepage
    } catch (err) {
      // Log detailed error information
      if (axios.isAxiosError(err)) {
        console.error('Delete error:', err.response || err.message);
      } else {
        console.error('Delete error:', err);
      }
  
      // Notify the user of the failure
      alert('Failed to delete profile. Please try again later.');
    }
  };
  
  return (
    <Layout>
  <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl mt-10">
    <div className="flex items-center mb-6 space-x-4">
      <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100">
        <ArrowLeft size={24} />
      </button>
      <h1 className="text-2xl font-semibold text-gray-800">User Profile</h1>
    </div>

    <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData?.username || ''}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-3 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData?.email || ''}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-3 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Change Password (leave blank to keep current)
            </label>
            <input
              type="password"
              name="password"
              value={formData?.password || ''}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-3 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-300"
            />
          </div>
          <div className="flex justify-center space-x-4 mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData(userDetails); // Reset formData to the original user details
                setIsEditing(false);
              }}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-all duration-300 transform hover:scale-105"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="space-y-3 text-gray-700">
            <p><strong>Username:</strong> {userDetails?.username}</p>
            <p><strong>Email:</strong> {userDetails?.email}</p>
          </div>
          <div className="flex justify-center mt-6 space-x-4">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
            >
              Edit Profile
            </button>
          </div>
        </>
      )}
    </div>
  </div>
  <br></br><br></br><br></br><br></br><br></br>
</Layout>

   
  );
};

export default UserProfile;
