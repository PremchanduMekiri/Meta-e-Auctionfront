import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const VerifyingDocuments = () => {
    const { userId } = useParams();
    const [documents, setDocuments] = useState<string[]>([]);
    const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
    const [previewError, setPreviewError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isAccepting, setIsAccepting] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [userDetails, setUserDetails] = useState<any>(null);

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
            // Refresh user details to show updated status
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
            // Refresh user details to show updated status
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
                    <h1 className="text-2xl font-bold text-white">Document Verification</h1>
                    <p className="text-blue-100">Review and verify user documents</p>
                </div>

                {/* Main Content */}
                <div className="p-6">
                    {/* User Details Card */}
                    {userDetails && (
                        <div className="mb-8 p-5 border rounded-lg shadow-sm bg-gray-50">
                            <h2 className="text-xl font-semibold mb-3 text-gray-800 border-b pb-2">User Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Username</p>
                                    <p className="font-medium">{userDetails.username}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium">{userDetails.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <p className={`font-medium ${
                                        userDetails.status === 'rejected' ? 'text-red-600' : 
                                        userDetails.status === 'verified' ? 'text-green-600' : 'text-yellow-600'
                                    }`}>
                                        {userDetails.status || 'pending'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Account Active</p>
                                    <p className={`font-medium ${
                                        userDetails.active === 1 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {userDetails.active === 1 ? 'Active' : 'Inactive'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Documents Section */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Uploaded Documents</h2>
                        {documents.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
                                <p className="mt-1 text-sm text-gray-500">This user hasn't uploaded any documents yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {documents.map((doc) => (
                                    <div 
                                        key={doc}
                                        onClick={() => handleViewDocument(doc)}
                                        className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                                            selectedDoc?.includes(doc) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                                        }`}
                                    >
                                        <div className="flex items-center">
                                            <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900 truncate">{doc}</p>
                                                <p className="text-xs text-gray-500">Click to preview</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* PDF Preview Section */}
                    {selectedDoc && (
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-lg font-semibold text-gray-800">Document Preview</h3>
                                <button 
                                    onClick={() => setSelectedDoc(null)}
                                    className="text-sm text-gray-500 hover:text-gray-700"
                                >
                                    Close preview
                                </button>
                            </div>
                            <div className="border rounded-lg overflow-hidden">
                                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                                    <Viewer
                                        fileUrl={selectedDoc}
                                        onDocumentLoad={() => setPreviewError(null)}
                                        onDocumentError={(error) => setPreviewError('Failed to load PDF: ' + error.message)}
                                    />
                                </Worker>
                            </div>
                            {previewError && (
                                <div className="mt-2 p-3 bg-red-50 text-red-600 rounded text-sm">
                                    {previewError}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Action Buttons */}
                    {documents.length > 0 && (
                        <div className="mt-6 pt-4 border-t">
                            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                                <button
                                    onClick={handleReject}
                                    disabled={isRejecting || isAccepting}
                                    className={`px-6 py-2 rounded-md flex items-center justify-center ${
                                        isRejecting ? 'bg-gray-300' : 'bg-red-600 hover:bg-red-700'
                                    } text-white transition-colors`}
                                >
                                    {isRejecting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Rejecting...
                                        </>
                                    ) : 'Reject'}
                                </button>
                                <button
                                    onClick={handleAccept}
                                    disabled={isAccepting || isRejecting}
                                    className={`px-6 py-2 rounded-md flex items-center justify-center ${
                                        isAccepting ? 'bg-gray-300' : 'bg-green-600 hover:bg-green-700'
                                    } text-white transition-colors`}
                                >
                                    {isAccepting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Verifying...
                                        </>
                                    ) : 'Verify & Accept'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Feedback Message */}
                    {message && (
                        <div className={`mt-4 p-3 rounded-md ${
                            message.includes('successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                            <div className="flex items-center">
                                {message.includes('successfully') ? (
                                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                                <p>{message}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerifyingDocuments;