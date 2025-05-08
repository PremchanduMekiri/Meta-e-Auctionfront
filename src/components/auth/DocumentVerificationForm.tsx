
import React, { useEffect, useState } from 'react';

interface UserData {
  id: string;
  name: string;
  email: string;
  [key: string]: any; // For additional user data
}

const DocumentVerificationForm: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({
    businessRegistration: null as File | null,
    taxCertificate: null as File | null,
    bankStatement: null as File | null,
    idProof: null as File | null,
  });
  const [errors, setErrors] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserData(parsed);
      } catch (err) {
        console.error("Invalid userData in localStorage", err);
        setErrors("Failed to load user data. Please login again.");
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const { files } = e.target;
    if (files && files[0]) {
      // Rename file to include document type
      const originalFile = files[0];
      const fileExtension = originalFile.name.split('.').pop() || '';
      const newFileName = `${docType}.${fileExtension}`;
      const renamedFile = new File([originalFile], newFileName, { type: originalFile.type });
      
      setFormData(prev => ({ ...prev, [docType]: renamedFile }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors('');
    setSuccess(false);

    if (!userData?.id) {
      setErrors('User ID not found. Please login again.');
      return;
    }

    const data = new FormData();
    // Append each file to the 'files' part
    if (formData.businessRegistration) data.append('files', formData.businessRegistration);
    if (formData.taxCertificate) data.append('files', formData.taxCertificate);
    if (formData.bankStatement) data.append('files', formData.bankStatement);
    if (formData.idProof) data.append('files', formData.idProof);

    try {
      const response = await fetch(`https://metaauction.onrender.com/documents/upload/${userData.id}`, {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Upload failed');
      }

      setSuccess(true);
    } catch (err: any) {
      setErrors(err.message);
    }
  };
  const handleChangeHome = () => {
    window.location.href = '/';
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Document Verification</h2>

      {/* Display User Data */}
      {userData && (
        <div className="mb-6 p-4 bg-gray-50 rounded-md">
          <h3 className="text-lg font-semibold mb-2">User Information</h3>
          <p><strong>ID:</strong> {userData.id}</p>
          {/* <p><strong>Name:</strong> {userData.name}</p> */}
          <p><strong>Email:</strong> {userData.email}</p>
          {Object.entries(userData).map(([key, value]) => (
            key !== 'id' && key !== 'name' && key !== 'email' && (
              <p key={key}><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}</p>
            )
          ))}
        </div>
      )}

      {errors && <p className="text-red-500 mb-4">{errors}</p>}
      {success && <p className="text-green-600 mb-4">Documents submitted successfully!</p>}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Registration Document
          </label>
          <input
            type="file"
            name="businessRegistration"
            accept=".pdf,.jpg,.png"
            onChange={(e) => handleChange(e, 'businessRegistration')}
            required
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tax Certificate
          </label>
          <input
            type="file"
            name="taxCertificate"
            accept=".pdf,.jpg,.png"
            onChange={(e) => handleChange(e, 'taxCertificate')}
            required
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bank Statement
          </label>
          <input
            type="file"
            name="bankStatement"
            accept=".pdf,.jpg,.png"
            onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>, 'bankStatement')}
            required
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID Proof
          </label>
          <input
            type="file"
            name="idProof"
            accept=".pdf,.jpg,.png"
            onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>, 'idProof')}
            required
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Submit Documents
        </button>
        <button
          type="button"
          onClick={handleChangeHome}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Verify Later
        </button>
      </div>
    </div>
  );
};

export default DocumentVerificationForm;