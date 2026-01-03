import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, CheckCircle, XCircle, Award, ArrowRight, ShieldCheck } from 'lucide-react';
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
            const API_URL = import.meta.env.VITE_API_URL || 'https://lms-backend-vzds.onrender.com';
            const response = await fetch(`${API_URL}/api/certificate/verify/${certId}`);
            const data = await response.json();

            if (data.valid) {
                setVerificationResult(data.data);
            } else {
                setError('Invalid Certificate ID. The ID you entered does not match our records.');
            }
        } catch (err) {
            console.error(err);
            setError('Unable to verify at this time. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (certificateId.trim()) {
            navigate(`/verify/${certificateId}`);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#1e3a8a] to-slate-50"></div>
                <div className="absolute top-0 left-0 w-full h-full opacity-10"
                    style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            </div>

            {/* Navbar Placeholder / Brand */}
            <div className="relative z-10 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-2 text-white/90">
                    <ShieldCheck className="w-8 h-8 text-yellow-400" />
                    <span className="font-bold text-xl tracking-tight">Quant X AI <span className="text-yellow-400 font-light">Verify</span></span>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-start pt-10 pb-20 px-4">

                {/* Search Card */}
                <div className={`w-full bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8 transition-all duration-700 ease-out 
                                ${verificationResult ? 'max-w-6xl' : 'max-w-xl translate-y-20'}`}>

                    {!verificationResult && (
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center p-4 rounded-full bg-blue-50 text-[#1e3a8a] mb-6 shadow-sm">
                                <Award size={48} strokeWidth={1.5} />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Verify a Certificate</h1>
                            <p className="text-slate-500 text-lg max-w-md mx-auto leading-relaxed">
                                Enter the unique Certificate ID to confirm the authenticity of a Quant X AI certification.
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className={`relative z-20 ${verificationResult ? 'mb-8 flex gap-4 items-end max-w-xl mx-auto' : 'mb-2'}`}>
                        <div className="w-full">
                            <label className={`block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 ${verificationResult ? '' : 'ml-1'}`}>
                                Certificate ID
                            </label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={certificateId}
                                    onChange={(e) => setCertificateId(e.target.value)}
                                    placeholder="e.g. QX-A1B2C3D4"
                                    className="w-full px-5 py-4 pl-12 bg-slate-50 border border-slate-200 rounded-xl text-lg font-medium text-slate-900 
                                               focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] outline-none transition-all shadow-sm group-hover:bg-white"
                                />
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-[#1e3a8a] transition-colors" size={22} />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`bg-[#1e3a8a] text-white rounded-xl font-bold tracking-wide hover:bg-[#172554] active:scale-[0.98] transition-all shadow-lg hover:shadow-[#1e3a8a]/30 disabled:opacity-70 disabled:cursor-not-allowed
                                      ${verificationResult ? 'px-8 py-4 h-[62px]' : 'w-full py-4 mt-4 text-lg'}`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verifying...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    Verify Now <ArrowRight size={18} strokeWidth={2.5} />
                                </span>
                            )}
                        </button>
                    </form>

                    {error && (
                        <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-4 text-red-800 mt-6 animate-in fade-in slide-in-from-top-2">
                            <div className="bg-red-100 p-2 rounded-full flex-shrink-0">
                                <XCircle className="text-red-600" size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold">Verification Failed</h3>
                                <p className="text-sm opacity-90">{error}</p>
                            </div>
                        </div>
                    )}

                    {verificationResult && (
                        <div className="mt-8 pt-8 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="flex flex-col items-center justify-center text-center mb-10">
                                <div className="bg-green-100 p-3 rounded-full mb-3 text-green-600 animate-bounce cursor-default">
                                    <CheckCircle size={32} />
                                </div>
                                <h2 className="text-2xl font-bold text-green-700 mb-1">Authentic Certificate</h2>
                                <p className="text-slate-500">This certificate is valid and issued by Quant X AI.</p>
                            </div>

                            {/* Display the Certificate */}
                            <div className="relative w-full overflow-hidden rounded-xl shadow-2xl border border-slate-200 bg-slate-800">
                                <div className="overflow-auto pb-4 custom-scrollbar">
                                    <div className="scale-[0.8] origin-top md:scale-100">
                                        <Certificate
                                            userName={verificationResult.studentName}
                                            courseName={verificationResult.courseName}
                                            date={new Date(verificationResult.issueDate).toLocaleDateString()}
                                            certificateId={verificationResult.certificateId}
                                            language="ENGLISH"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 text-center pb-6 text-slate-400 text-sm">
                <p>&copy; {new Date().getFullYear()} Quant X AI Educational Services. All rights reserved.</p>
            </div>
        </div>
    );
};

export default CertificateVerification;
