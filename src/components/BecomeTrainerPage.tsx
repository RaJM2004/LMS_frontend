import React, { useState } from 'react';
import { API_BASE_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Search, Menu, X, CheckCircle } from 'lucide-react';

const BecomeTrainerPage: React.FC = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        companyName: '',
        companyDescription: '',
        companyWebsite: '',
        numberOfEmployees: '',
        programOfInterest: '',
        regions: [] as string[],
        specialization: '',
        sharedCustomers: '',
        partnershipInterest: '',
        corporateSponsor: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            const currentRegions = [...prev.regions];
            if (checked) {
                currentRegions.push(value);
            } else {
                const index = currentRegions.indexOf(value);
                if (index > -1) currentRegions.splice(index, 1);
            }
            return { ...prev, regions: currentRegions };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage({ type: '', text: '' });

        try {
            const response = await fetch(`${API_BASE_URL}/api/trainer/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitMessage({ type: 'success', text: 'Application submitted successfully! We will be in touch soon.' });
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    companyName: '',
                    companyDescription: '',
                    companyWebsite: '',
                    numberOfEmployees: '',
                    programOfInterest: '',
                    regions: [],
                    specialization: '',
                    sharedCustomers: '',
                    partnershipInterest: '',
                    corporateSponsor: ''
                });
            } else {
                setSubmitMessage({ type: 'error', text: data.error || 'Failed to submit application. Please try again.' });
            }
        } catch (error) {
            console.error('Error submitting application:', error);
            setSubmitMessage({ type: 'error', text: 'An unexpected error occurred. Please try again later.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            {/* Navbar */}
            <nav id="home" className="flex justify-between items-center px-6 md:px-12 py-4 bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50">
                <div className="flex items-center space-x-2">
                    <a href="/">
                        <img src="/logo.png" alt="GenQuantaa Logo" className="h-10" />
                    </a>
                </div>
                <div className="hidden md:flex space-x-10 text-slate-600 font-medium text-sm">
                    <a href="/#about" className="hover:text-blue-400 transition-colors">About</a>
                    <a href="/#courses" className="hover:text-blue-400 transition-colors">Courses</a>
                    <a href="/quantum" className="hover:text-purple-500 font-semibold transition-colors flex items-center gap-1">
                        Quantum
                    </a>
                    <a href="/fde" className="hover:text-emerald-500 font-semibold transition-colors">FDE Masterclass</a>
                    <a href="/biologics" className="hover:text-purple-600 font-semibold transition-colors">Biologics</a>
                    <div className="relative group">
                        <a href="/#courses" className="hover:text-blue-400 transition-colors flex items-center gap-1">Brochure <ChevronRight size={14} className="rotate-90" /></a>
                        <ul className="absolute left-0 mt-2 w-48 bg-white border border-slate-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
                            <li><a href="/DATA%20SCINECE%20COURSE%20BROCHURE%20(3).pdf" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">Data Science Brochure</a></li>
                            <li><a href="/AI%20Course%20Broucher.pdf" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">AI Course Brochure</a></li>
                            <li><a href="/Quantum%20Computing%20(1).pdf" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">Quantum Computing Brochure</a></li>
                            <li><a href="/LifeSciences.pdf" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">Generative AI for End-to-End Drug Discovery & Life Sciences</a></li>
                        </ul>
                    </div>
                    <a href="/#alumnis" className="hover:text-blue-400 transition-colors">Alumnis</a>
                    <a href="/become-trainer" className="text-[#0f269a] font-semibold hover:text-[#0a1a72] transition-colors">Become a Trainer</a>
                    <a href="/#blog" className="hover:text-blue-400 transition-colors">Blog</a>
                    <a href="/#contact" className="hover:text-blue-400 transition-colors">Contact</a>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative hidden lg:block group">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Search for courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-slate-100 w-64 text-sm transition-all text-slate-800 placeholder-slate-400"
                        />
                    </div>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-[#0f269a] hover:bg-[#0a1a72] text-white font-semibold px-6 md:px-8 py-2 md:py-3 text-sm rounded-2xl shadow-md transition-all duration-300"
                    >
                        Login
                    </button>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-slate-600 hover:text-[#0f269a] transition-colors p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-[72px] left-0 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-xl z-50 flex flex-col px-6 py-6 space-y-6">
                    <a href="/#about" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 font-semibold text-lg">About</a>
                    <a href="/#courses" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 font-semibold text-lg">Courses</a>
                    <a href="/quantum" onClick={() => setIsMobileMenuOpen(false)} className="text-purple-600 font-semibold text-lg">Quantum</a>
                    <a href="/fde" onClick={() => setIsMobileMenuOpen(false)} className="text-emerald-600 font-semibold text-lg">FDE Masterclass</a>
                    <a href="/biologics" onClick={() => setIsMobileMenuOpen(false)} className="text-purple-600 font-semibold text-lg">Biologics</a>

                    <div className="flex flex-col space-y-3">
                        <span className="text-slate-400 font-semibold text-sm uppercase tracking-wider">Brochures</span>
                        <a href="/DATA%20SCINECE%20COURSE%20BROCHURE%20(3).pdf" className="text-slate-600 pl-4 text-sm">Data Science Brochure</a>
                        <a href="/AI%20Course%20Broucher.pdf" className="text-slate-600 pl-4 text-sm">AI Course Brochure</a>
                        <a href="/Quantum%20Computing%20(1).pdf" className="text-slate-600 pl-4 text-sm">Quantum Computing Brochure</a>
                        <a href="/LifeSciences.pdf" className="text-slate-600 pl-4 text-sm">Drug Discovery & Life Sciences</a>
                    </div>

                    <a href="/#alumnis" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 font-semibold text-lg">Alumnis</a>
                    <a href="/become-trainer" onClick={() => setIsMobileMenuOpen(false)} className="text-[#0f269a] font-semibold text-lg">Become a Trainer</a>
                    <a href="/#blog" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 font-semibold text-lg">Blog</a>
                    <a href="/#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 font-semibold text-lg">Contact</a>
                </div>
            )}

            {/* Header / Banner */}
            <header className="bg-gradient-to-br from-[#0f269a] to-blue-600 py-20 px-4 md:px-8 text-center shadow-md relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -z-0 transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -z-0 transform -translate-x-1/2 translate-y-1/2"></div>
                
                <div className="max-w-4xl mx-auto mt-8 relative z-10">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-sm tracking-tight">The Power of Partnership</h1>
                    <p className="text-white/90 text-lg md:text-xl font-medium max-w-2xl mx-auto">Join our open, collaborative and proven ecosystem to support student success and grow your career.</p>
                </div>
            </header>

            {/* Main Form Section */}
            <main className="max-w-4xl mx-auto px-4 py-16 relative -mt-12 z-20">
                <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-slate-200 p-8 md:p-12">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Become a Trainer</h2>
                        <p className="text-slate-500 text-sm">* Indicates a required field</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        
                        {/* Name Fields */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Name <span className="text-red-500">*</span></label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
                                    <span className="text-xs text-slate-400 mt-2 block">First</span>
                                </div>
                                <div>
                                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
                                    <span className="text-xs text-slate-400 mt-2 block">Last</span>
                                </div>
                            </div>
                        </div>

                        {/* Email & Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Email <span className="text-red-500">*</span></label>
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone <span className="text-red-500">*</span></label>
                                <div className="flex">
                                    <div className="bg-slate-50 border border-slate-200 border-r-0 rounded-l-xl px-3 py-3 flex items-center justify-center">
                                        🇮🇳
                                    </div>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full bg-slate-50 border border-slate-200 rounded-r-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
                                </div>
                            </div>
                        </div>

                        {/* Company Name & Website */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Company Name <span className="text-red-500">*</span></label>
                                <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Company Website <span className="text-red-500">*</span></label>
                                <input type="url" name="companyWebsite" value={formData.companyWebsite} onChange={handleInputChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
                            </div>
                        </div>

                        {/* Company Description */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Company Description <span className="text-red-500">*</span></label>
                            <textarea name="companyDescription" value={formData.companyDescription} onChange={handleInputChange} required rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"></textarea>
                        </div>

                        {/* Number of Employees & Specialization */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Number of Employees <span className="text-red-500">*</span></label>
                                <input type="text" name="numberOfEmployees" value={formData.numberOfEmployees} onChange={handleInputChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Do you specialize in AI/Tech? <span className="text-red-500">*</span></label>
                                <select name="specialization" value={formData.specialization} onChange={handleInputChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-700">
                                    <option value="">Select Choice</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>
                        </div>

                        {/* Program of Interest */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Please specify the partner program you'd like to join <span className="text-red-500">*</span></label>
                            <select name="programOfInterest" value={formData.programOfInterest} onChange={handleInputChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-700">
                                <option value="">Select Choice</option>
                                <option value="Content Partner">Content Partner</option>
                                <option value="Technology Partner">Technology Partner</option>
                                <option value="Services Partner">Services Partner</option>
                                <option value="Training Partner">Training Partner</option>
                            </select>
                        </div>

                        {/* Regions */}
                        <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                            <label className="block text-sm font-semibold text-slate-700 mb-4">Which region is your business primarily in? <span className="text-red-500">*</span></label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {['Global', 'North America', 'Europe', 'China', 'Japan', 'Asia Pacific', 'Latin America', 'Africa', 'Middle East', 'Other'].map(region => (
                                    <label key={region} className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input type="checkbox" value={region} onChange={handleCheckboxChange} checked={formData.regions.includes(region)} className="peer w-5 h-5 text-[#0f269a] bg-white border-gray-300 rounded focus:ring-[#0f269a] cursor-pointer" />
                                        </div>
                                        <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{region}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Shared Customers */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Shared customers help us focus conversations. Please list shared customers here <span className="text-red-500">*</span></label>
                            <input type="text" name="sharedCustomers" value={formData.sharedCustomers} onChange={handleInputChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
                        </div>

                        {/* Partnership Interest */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Please describe your partnership interest with us, and mutual expectations <span className="text-red-500">*</span></label>
                            <textarea name="partnershipInterest" value={formData.partnershipInterest} onChange={handleInputChange} required rows={5} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"></textarea>
                        </div>

                        {/* Corporate Sponsor */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Corporate Sponsor (If applicable)</label>
                            <input type="text" name="corporateSponsor" value={formData.corporateSponsor} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
                        </div>

                        {/* Submit Status Messages */}
                        {submitMessage.text && (
                            <div className={`p-4 rounded-xl text-sm font-medium flex items-center ${submitMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                {submitMessage.type === 'success' ? <CheckCircle className="w-5 h-5 mr-2" /> : <X className="w-5 h-5 mr-2" />}
                                {submitMessage.text}
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-6 text-center">
                            <button type="submit" disabled={isSubmitting} className="bg-[#0f269a] hover:bg-[#0a1a72] text-white font-bold py-4 px-12 rounded-full shadow-lg shadow-blue-900/20 transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none text-lg w-full md:w-auto flex items-center justify-center mx-auto">
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                        Submitting...
                                    </>
                                ) : 'Submit Application'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default BecomeTrainerPage;
