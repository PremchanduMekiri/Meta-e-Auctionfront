// import { Worker, Viewer } from '@react-pdf-viewer/core';
// import '@react-pdf-viewer/core/lib/styles/index.css';
// import { useParams } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import axios from 'axios';

// const VerifyingDocuments = () => {
//     const { userId } = useParams();
//     const [documents, setDocuments] = useState<string[]>([]);
//     const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
//     const [previewError, setPreviewError] = useState<string | null>(null);
//     const [message, setMessage] = useState<string | null>(null);
//     const [isAccepting, setIsAccepting] = useState(false);
//     const [isRejecting, setIsRejecting] = useState(false);
//     const [userDetails, setUserDetails] = useState<any>(null);


//     const [adminData, setAdminData] = useState(null);

//     useEffect(() => {
//         const storedAdminData = localStorage.getItem('userData');
//         if (storedAdminData) {
//             setAdminData(JSON.parse(storedAdminData));
//         }
//     }, []);
//     useEffect(()=>{
//       console.log("admn",{adminData})
//     })
//     useEffect(() => {
//         const fetchDocuments = async () => {
//             try {
//                 const res = await axios.get(`https://metaauction.onrender.com/documents/list/${userId}`);
//                 setDocuments(res.data);
//             } catch (err) {
//                 console.error('Error fetching documents:', err);
//             }
//         };
    
//         const fetchUserDetails = async () => {
//             try {
//                 const res = await axios.get(`https://metaauction.onrender.com/user/userBy/${userId}`);
//                 setUserDetails(res.data);
//             } catch (err) {
//                 console.error('Error fetching user details:', err);
//             }
//         };
    
//         if (userId) {
//             fetchDocuments();
//             fetchUserDetails();
//         }
//     }, [userId]);
    

//     const handleViewDocument = (filename: string) => {
//         const fileUrl = `https://metaauction.onrender.com/documents/download/${userId}/${filename}`;
//         setSelectedDoc(fileUrl);
//         setPreviewError(null);
//     };

//     const handleAccept = async () => {
//         setIsAccepting(true);
//         try {
//             await axios.post(`https://metaauction.onrender.com/admin/verify/user/${userId}`);
//             setMessage("Document verified successfully");
//             // Refresh user details to show updated status
//             const res = await axios.get(`https://metaauction.onrender.com/user/userBy/${userId}`);
//             setUserDetails(res.data);
//         } catch (err) {
//             setMessage("Failed to verify document");
//             console.error('Error accepting document:', err);
//         } finally {
//             setIsAccepting(false);
//         }
//     };

//     const handleReject = async () => {
//         setIsRejecting(true);
//         try {
//             await axios.delete(`https://metaauction.onrender.com/documents/clear/${userId}`);
//             setDocuments([]);
//             setMessage("The user got rejected");
//             // Refresh user details to show updated status
//             const res = await axios.get(`https://metaauction.onrender.com/user/userBy/${userId}`);
//             setUserDetails(res.data);
//         } catch (err) {
//             setMessage("Failed to reject the user");
//             console.error('Error rejecting user:', err);
//         } finally {
//             setIsRejecting(false);
//         }
//     };

//     return (
//         <div className="bg-white shadow rounded-lg overflow-hidden">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-4">
//           <h2 className="text-white text-2xl font-bold">Document Verification</h2>
//           <p className="text-blue-100 text-sm">Review and verify submitted documents</p>
//         </div>

//         {/* Main Content */}
//         <div className="p-6 space-y-8">
//           {/* User Info */}
//           {userDetails && (
//             <section className="bg-gray-50 rounded-md p-5 border shadow-sm">
//               <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">User Info</h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
//                 <div>
//                   <p className="text-xs text-gray-500">Username</p>
//                   <p className="font-medium text-gray-800">{userDetails.username}</p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-500">Email</p>
//                   <p className="font-medium text-gray-800">{userDetails.email}</p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-500">Status</p>
//                   <p className={`font-medium ${
//                     userDetails.status === 'verified' ? 'text-green-600' :
//                     userDetails.status === 'rejected' ? 'text-red-600' :
//                     'text-yellow-600'
//                   }`}>
//                     {userDetails.status || 'pending'}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-500">Account</p>
//                   <p className={`font-medium ${userDetails.active === 1 ? 'text-green-600' : 'text-red-600'}`}>
//                     {userDetails.active === 1 ? 'Active' : 'Inactive'}
//                   </p>
//                 </div>
//               </div>
//             </section>
//           )}

//           {/* Documents */}
//           <section>
//             <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-3">Documents</h3>
//             {documents.length === 0 ? (
//               <div className="bg-gray-50 text-center p-6 rounded-md">
//                 <p className="text-gray-600">No documents uploaded yet.</p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                 {documents.map((doc) => (
//                   <div
//                     key={doc}
//                     onClick={() => handleViewDocument(doc)}
//                     className={`p-4 rounded-md shadow-sm border cursor-pointer hover:shadow-md transition-all ${
//                       selectedDoc === doc ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
//                     }`}
//                   >
//                     <div className="flex items-center">
//                       <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414L13.414 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
//                       </svg>
//                       <div className="ml-3">
//                         <p className="text-sm font-medium text-gray-800">{doc}</p>
//                         <p className="text-xs text-gray-500">Click to preview</p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </section>

//           {/* Preview */}
//           {selectedDoc && (
//             <section>
//               <div className="flex justify-between items-center mb-3">
//                 <h3 className="text-lg font-semibold text-gray-700">Document Preview</h3>
//                 <button onClick={() => setSelectedDoc(null)} className="text-sm text-blue-600 hover:underline">Close</button>
//               </div>
//               <div className="h-[500px] overflow-y-auto border rounded-md">
//                 <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
//                   <Viewer
//                     fileUrl={selectedDoc}
//                     onDocumentLoad={() => setPreviewError(null)}
//                     onDocumentError={(e) => setPreviewError('Failed to load PDF')}
//                   />
//                 </Worker>
//               </div>
//               {previewError && (
//                 <p className="mt-2 text-sm text-red-600">{previewError}</p>
//               )}
//             </section>
//           )}

//           {/* Actions */}
//           {documents.length > 0 && (
//             <section className="flex flex-col sm:flex-row gap-4 justify-end">
//               <button
//                 onClick={handleReject}
//                 disabled={isRejecting || isAccepting}
//                 className={`px-5 py-2 rounded-md text-white ${
//                   isRejecting ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'
//                 }`}
//               >
//                 {isRejecting ? 'Rejecting...' : 'Reject'}
//               </button>
//               <button
//                 onClick={handleAccept}
//                 disabled={isAccepting || isRejecting}
//                 className={`px-5 py-2 rounded-md text-white ${
//                   isAccepting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
//                 }`}
//               >
//                 {isAccepting ? 'Verifying...' : 'Verify & Accept'}
//               </button>
//             </section>
//           )}

//           {/* Message */}
//           {message && (
//             <div className={`p-4 mt-4 rounded-md ${
//               message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
//             }`}>
//               {message}
//             </div>
//           )}
//         </div>
//       </div>
//     );
// };

// export default VerifyingDocuments;

import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const VerifyingDocuments = () => {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [documents, setDocuments] = useState<string[]>([]);
    const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
    const [previewError, setPreviewError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isAccepting, setIsAccepting] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [userDetails, setUserDetails] = useState<any>(null);
    const [adminData, setAdminData] = useState(null);

    // Check admin data and redirect if not found
    useEffect(() => {
        const storedAdminData = localStorage.getItem('userData');
        if (storedAdminData) {
            setAdminData(JSON.parse(storedAdminData));
        } else {
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const res = await axios.get(`https://metaauction.onrender.com/documents/list/${userId}`);
                setDocuments(res.data);
            } catch (err) {
                console.error('Error fetching documents:', err);
            }
        };

        const fetchUserDetails = async () => {
            try {
                const res = await axios.get(`https://metaauction.onrender.com/user/userBy/${userId}`);
                setUserDetails(res.data);
            } catch (err) {
                console.error('Error fetching user details:', err);
            }
        };

        if (userId) {
            fetchDocuments();
            fetchUserDetails();
        }
    }, [userId]);

    const handleViewDocument = (filename: string) => {
        const fileUrl = `https://metaauction.onrender.com/documents/download/${userId}/${filename}`;
        setSelectedDoc(fileUrl);
        setPreviewError(null);
    };

    const handleAccept = async () => {
        setIsAccepting(true);
        try {
            await axios.post(`https://metaauction.onrender.com/admin/verify/user/${userId}`);
            setMessage("Document verified successfully");
            const res = await axios.get(`https://metaauction.onrender.com/user/userBy/${userId}`);
            setUserDetails(res.data);
        } catch (err) {
            setMessage("Failed to verify document");
            console.error('Error accepting document:', err);
        } finally {
            setIsAccepting(false);
        }
    };

    const handleReject = async () => {
        setIsRejecting(true);
        try {
            await axios.delete(`https://metaauction.onrender.com/documents/clear/${userId}`);
            setDocuments([]);
            setMessage("The user got rejected");
            const res = await axios.get(`https://metaauction.onrender.com/user/userBy/${userId}`);
            setUserDetails(res.data);
        } catch (err) {
            setMessage("Failed to reject the user");
            console.error('Error rejecting user:', err);
        } finally {
            setIsRejecting(false);
        }
    };

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-4">
                <h2 className="text-white text-2xl font-bold">Document Verification</h2>
                <p className="text-blue-100 text-sm">Review and verify submitted documents</p>
            </div>

            <div className="p-6 space-y-8">
                {userDetails && (
                    <section className="bg-gray-50 rounded-md p-5 border shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">User Info</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                            <div>
                                <p className="text-xs text-gray-500">Username</p>
                                <p className="font-medium text-gray-800">{userDetails.username}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Email</p>
                                <p className="font-medium text-gray-800">{userDetails.email}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Status</p>
                                <p className={`font-medium ${
                                    userDetails.status === 'verified' ? 'text-green-600' :
                                    userDetails.status === 'rejected' ? 'text-red-600' :
                                    'text-yellow-600'
                                }`}>
                                    {userDetails.status || 'pending'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Account</p>
                                <p className={`font-medium ${userDetails.active === 1 ? 'text-green-600' : 'text-red-600'}`}>
                                    {userDetails.active === 1 ? 'Active' : 'Inactive'}
                                </p>
                            </div>
                        </div>
                    </section>
                )}

                <section>
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-3">Documents</h3>
                    {documents.length === 0 ? (
                        <div className="bg-gray-50 text-center p-6 rounded-md">
                            <p className="text-gray-600">No documents uploaded yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {documents.map((doc) => (
                                <div
                                    key={doc}
                                    onClick={() => handleViewDocument(doc)}
                                    className={`p-4 rounded-md shadow-sm border cursor-pointer hover:shadow-md transition-all ${
                                        selectedDoc === doc ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                    }`}
                                >
                                    <div className="flex items-center">
                                        <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414L13.414 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-800">{doc}</p>
                                            <p className="text-xs text-gray-500">Click to preview</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {selectedDoc && (
                    <section>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold text-gray-700">Document Preview</h3>
                            <button onClick={() => setSelectedDoc(null)} className="text-sm text-blue-600 hover:underline">Close</button>
                        </div>
                        <div className="h-[500px] overflow-y-auto border rounded-md">
                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                                <Viewer
                                    fileUrl={selectedDoc}
                                    onDocumentLoad={() => setPreviewError(null)}
                                    onDocumentError={() => setPreviewError('Failed to load PDF')}
                                />
                            </Worker>
                        </div>
                        {previewError && (
                            <p className="mt-2 text-sm text-red-600">{previewError}</p>
                        )}
                    </section>
                )}

                {documents.length > 0 && (
                    <section className="flex flex-col sm:flex-row gap-4 justify-end">
                        <button
                            onClick={handleReject}
                            disabled={isRejecting || isAccepting}
                            className={`px-5 py-2 rounded-md text-white ${
                                isRejecting ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'
                            }`}
                        >
                            {isRejecting ? 'Rejecting...' : 'Reject'}
                        </button>
                        <button
                            onClick={handleAccept}
                            disabled={isAccepting || isRejecting}
                            className={`px-5 py-2 rounded-md text-white ${
                                isAccepting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                            }`}
                        >
                            {isAccepting ? 'Verifying...' : 'Verify & Accept'}
                        </button>
                    </section>
                )}

          {/* Message */}
          {message && (
            <div className={`p-4 mt-4 rounded-md ${
              message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    );
};

export default VerifyingDocuments;
