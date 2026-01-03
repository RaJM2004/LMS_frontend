import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, CheckCircle, XCircle, Award } from 'lucide-react';
import Certificate from './Certificate';

interface CertificateData {
    studentName: string;
    courseName: string;
    issueDate: string;
    certificateId: string;
}

const CertificateVerification: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [certificateId, setCertificateId] = useState(id || '');
    const [verificationResult, setVerificationResult] = useState<CertificateData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            handleVerify(id);
        }
    }, [id]);

    const handleVerify = async (certId: string) => {
        setLoading(true);
        setError(null);
        setVerificationResult(null);

        try {
            // Adjust API URL as needed (e.g., from env or hardcoded for dev)
            const API_URL = import.meta.env.VITE_API_URL || 'https://lms-backend-vzds.onrender.com';
            const response = await fetch(`${API_URL}/api/certificate/verify/${certId}`);
            const data = await response.json();

            if (data.valid) {
                setVerificationResult(data.data);
            } else {
                setError('Invalid Certificate ID. Please check and try again.');
            }
        } catch (err) {
            console.error(err);
            setError('Error verifying certificate. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (certificateId.trim()) {
            navigate(`/verify/${certificateId}`); // Updates URL and triggers useEffect
            // Alternatively without navigation: handleVerify(certificateId);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className={`w-full bg-white rounded-xl shadow-lg p-8 transition-all duration-500 ${verificationResult ? 'max-w-7xl' : 'max-w-md'}`}>
                <div className="text-center mb-8">
                    <div className="inline-block p-3 rounded-full bg-blue-100 text-blue-600 mb-4">
                        <Award size={48} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Certificate Verification</h1>
                    <p className="text-gray-500 mt-2">Enter the certificate ID to verify its authenticity.</p>
                </div>

                <form onSubmit={handleSubmit} className="mb-8">
                    <div className="relative">
                        <input
                            type="text"
                            value={certificateId}
                            onChange={(e) => setCertificateId(e.target.value)}
                            placeholder="Enter Certificate ID (e.g., QX-12345)"
                            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                        <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Verifying...' : 'Verify Certificate'}
                    </button>
                </form>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3 text-red-700 animate-in fade-in slide-in-from-top-2">
                        <XCircle className="flex-shrink-0 mt-0.5" size={20} />
                        <div>
                            <p className="font-semibold">Verification Failed</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    </div>
                )}

                {verificationResult && (
                    <div className="w-full animate-in fade-in slide-in-from-top-2">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 text-center">
                            <div className="flex items-center justify-center space-x-3 text-green-700 mb-2">
                                <CheckCircle size={24} />
                                <h2 className="text-lg font-bold">Valid Certificate</h2>
                            </div>
                            <p className="text-green-800">This certificate is authentic and was issued by Quant X AI.</p>
                        </div>

                        {/* Display the Certificate */}
                        <div className="overflow-auto pb-8">
                            <Certificate
                                userName={verificationResult.studentName}
                                courseName={verificationResult.courseName}
                                date={new Date(verificationResult.issueDate).toLocaleDateString()}
                                certificateId={verificationResult.certificateId}
                                language="ENGLISH" // Default or could serve from API if stored
                            />
                        </div>
                    </div>
                )}
            </div>

            <p className="mt-8 text-sm text-gray-400">
                &copy; {new Date().getFullYear()} Quant X AI. All rights reserved.
            </p>
        </div>
    );
};

export default CertificateVerification;
