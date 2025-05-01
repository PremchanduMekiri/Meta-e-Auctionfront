// import React, { useState } from 'react';
// import { Upload, FileText, Building2, User, Mail, Phone, MapPin } from 'lucide-react';
// import Button from '../ui/Button';
// import Input from '../ui/Input';

// interface DocumentVerificationFormProps {
//   onSuccess: () => void;
//   onClose: () => void;
// }

// const DocumentVerificationForm: React.FC<DocumentVerificationFormProps> = ({ onSuccess, onClose }) => {
//   const [formData, setFormData] = useState({
//     businessName: '',
//     businessType: '',
//     registrationNumber: '',
//     taxId: '',
//     address: '',
//     city: '',
//     state: '',
//     country: '',
//     zipCode: '',
//     contactPerson: '',
//     email: '',
//     phone: '',
//     documents: {
//       businessRegistration: null as File | null,
//       taxCertificate: null as File | null,
//       bankStatement: null as File | null,
//       idProof: null as File | null,
//     }
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [isLoading, setIsLoading] = useState(false);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name } = e.target;
//     const file = e.target.files?.[0] || null;
    
//     setFormData(prev => ({
//       ...prev,
//       documents: {
//         ...prev.documents,
//         [name]: file
//       }
//     }));
//   };

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};

//     // Required fields validation
//     const requiredFields = [
//       'businessName', 'businessType', 'registrationNumber', 'taxId',
//       'address', 'city', 'state', 'country', 'zipCode',
//       'contactPerson', 'email', 'phone'
//     ];

//     requiredFields.forEach(field => {
//       if (!formData[field as keyof typeof formData]) {
//         newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
//       }
//     });

//     // Email validation
//     if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = 'Invalid email format';
//     }

//     // Phone validation
//     if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
//       newErrors.phone = 'Invalid phone number';
//     }

//     // Document validation
//     Object.entries(formData.documents).forEach(([key, value]) => {
//       if (!value) {
//         newErrors[key] = `${key.split(/(?=[A-Z])/).join(' ')} is required`;
//       }
//     });

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // Create FormData object for file upload
//       const submitData = new FormData();
      
//       // Append all form fields
//       Object.entries(formData).forEach(([key, value]) => {
//         if (key === 'documents') {
//           Object.entries(value).forEach(([docKey, docValue]) => {
//             if (docValue) {
//               submitData.append(`documents.${docKey}`, docValue);
//             }
//           });
//         } else {
//           submitData.append(key, value as string);
//         }
//       });

//       // Make API call to submit verification
//       const response = await fetch('http://localhost:8080/api/auth/verify-documents', {
//         method: 'POST',
//         body: submitData,
//       });

//       if (response.ok) {
//         onSuccess();
//       } else {
//         const error = await response.text();
//         setErrors({ submit: error });
//       }
//     } catch (error) {
//       setErrors({ submit: 'An error occurred while submitting the form' });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {errors.submit && (
//         <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
//           {errors.submit}
//         </div>
//       )}

//       {/* Business Information */}
//       <div className="space-y-4">
//         <h3 className="text-lg font-semibold flex items-center">
//           <Building2 className="h-5 w-5 mr-2" />
//           Business Information
//         </h3>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <Input
//             label="Business Name"
//             name="businessName"
//             value={formData.businessName}
//             onChange={handleInputChange}
//             error={errors.businessName}
//             required
//           />
          
//           <Input
//             label="Business Type"
//             name="businessType"
//             value={formData.businessType}
//             onChange={handleInputChange}
//             error={errors.businessType}
//             required
//           />
          
//           <Input
//             label="Registration Number"
//             name="registrationNumber"
//             value={formData.registrationNumber}
//             onChange={handleInputChange}
//             error={errors.registrationNumber}
//             required
//           />
          
//           <Input
//             label="Tax ID"
//             name="taxId"
//             value={formData.taxId}
//             onChange={handleInputChange}
//             error={errors.taxId}
//             required
//           />
//         </div>
//       </div>

//       {/* Address Information */}
//       <div className="space-y-4">
//         <h3 className="text-lg font-semibold flex items-center">
//           <MapPin className="h-5 w-5 mr-2" />
//           Address Information
//         </h3>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <Input
//             label="Address"
//             name="address"
//             value={formData.address}
//             onChange={handleInputChange}
//             error={errors.address}
//             required
//           />
          
//           <Input
//             label="City"
//             name="city"
//             value={formData.city}
//             onChange={handleInputChange}
//             error={errors.city}
//             required
//           />
          
//           <Input
//             label="State"
//             name="state"
//             value={formData.state}
//             onChange={handleInputChange}
//             error={errors.state}
//             required
//           />
          
//           <Input
//             label="Country"
//             name="country"
//             value={formData.country}
//             onChange={handleInputChange}
//             error={errors.country}
//             required
//           />
          
//           <Input
//             label="ZIP Code"
//             name="zipCode"
//             value={formData.zipCode}
//             onChange={handleInputChange}
//             error={errors.zipCode}
//             required
//           />
//         </div>
//       </div>

//       {/* Contact Information */}
//       <div className="space-y-4">
//         <h3 className="text-lg font-semibold flex items-center">
//           <User className="h-5 w-5 mr-2" />
//           Contact Information
//         </h3>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <Input
//             label="Contact Person"
//             name="contactPerson"
//             value={formData.contactPerson}
//             onChange={handleInputChange}
//             error={errors.contactPerson}
//             required
//           />
          
//           <Input
//             label="Email"
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleInputChange}
//             error={errors.email}
//             required
//           />
          
//           <Input
//             label="Phone"
//             type="tel"
//             name="phone"
//             value={formData.phone}
//             onChange={handleInputChange}
//             error={errors.phone}
//             required
//           />
//         </div>
//       </div>

//       {/* Document Upload */}
//       <div className="space-y-4">
//         <h3 className="text-lg font-semibold flex items-center">
//           <FileText className="h-5 w-5 mr-2" />
//           Required Documents
//         </h3>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Business Registration Certificate
//             </label>
//             <input
//               type="file"
//               name="businessRegistration"
//               onChange={handleFileChange}
//               className="block w-full text-sm text-gray-500
//                 file:mr-4 file:py-2 file:px-4
//                 file:rounded-md file:border-0
//                 file:text-sm file:font-semibold
//                 file:bg-blue-50 file:text-blue-700
//                 hover:file:bg-blue-100"
//               accept=".pdf,.doc,.docx"
//             />
//             {errors.businessRegistration && (
//               <p className="mt-1 text-sm text-red-600">{errors.businessRegistration}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Tax Certificate
//             </label>
//             <input
//               type="file"
//               name="taxCertificate"
//               onChange={handleFileChange}
//               className="block w-full text-sm text-gray-500
//                 file:mr-4 file:py-2 file:px-4
//                 file:rounded-md file:border-0
//                 file:text-sm file:font-semibold
//                 file:bg-blue-50 file:text-blue-700
//                 hover:file:bg-blue-100"
//               accept=".pdf,.doc,.docx"
//             />
//             {errors.taxCertificate && (
//               <p className="mt-1 text-sm text-red-600">{errors.taxCertificate}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Bank Statement (Last 3 months)
//             </label>
//             <input
//               type="file"
//               name="bankStatement"
//               onChange={handleFileChange}
//               className="block w-full text-sm text-gray-500
//                 file:mr-4 file:py-2 file:px-4
//                 file:rounded-md file:border-0
//                 file:text-sm file:font-semibold
//                 file:bg-blue-50 file:text-blue-700
//                 hover:file:bg-blue-100"
//               accept=".pdf,.doc,.docx"
//             />
//             {errors.bankStatement && (
//               <p className="mt-1 text-sm text-red-600">{errors.bankStatement}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               ID Proof
//             </label>
//             <input
//               type="file"
//               name="idProof"
//               onChange={handleFileChange}
//               className="block w-full text-sm text-gray-500
//                 file:mr-4 file:py-2 file:px-4
//                 file:rounded-md file:border-0
//                 file:text-sm file:font-semibold
//                 file:bg-blue-50 file:text-blue-700
//                 hover:file:bg-blue-100"
//               accept=".pdf,.jpg,.jpeg,.png"
//             />
//             {errors.idProof && (
//               <p className="mt-1 text-sm text-red-600">{errors.idProof}</p>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="flex justify-end space-x-4">
//         <Button
//           type="button"
//           variant="outline"
//           onClick={onClose}
//         >
//           Cancel
//         </Button>
//         <Button
//           type="submit"
//           variant="primary"
//           isLoading={isLoading}
//         >
//           <Upload className="h-4 w-4 mr-2" />
//           Submit Verification
//         </Button>
//       </div>
//     </form>
//   );
// };

// export default DocumentVerificationForm; 
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