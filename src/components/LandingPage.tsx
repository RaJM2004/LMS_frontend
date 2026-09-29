import React, { useState, useEffect } from 'react';

import { API_BASE_URL } from '../config';
import { Play, Search, BookOpen, Users, User, Medal as Award, Monitor, CheckCircle, ArrowRight, Star, Facebook, Twitter, Instagram, Linkedin, Mail, Brain, Globe, Shield, Phone, Lock, TrendingUp, Briefcase, Rocket, ChevronRight, Check, Activity, PieChart, Settings, Home, Menu, X } from 'lucide-react';

declare global {
    interface Window {
        Cashfree: any;
    }
}

interface LandingPageProps {
    onStart: () => void;
    onCourseClick: (courseId: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onCourseClick }) => {
    const [showRegistrationForm, setShowRegistrationForm] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        course: ''
    });
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('order_id')) {
            onCourseClick('python-ai-course'); // Default to main course if returning from payment
        }
    }, [onCourseClick]);

    const [allCourses, setAllCourses] = useState<any[]>([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/course-metadata`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    const target = data.find(c => c.id === 'no-code-low-code-ai-agents');
                    const sorted = target ? [target, ...data.filter(c => c.id !== 'no-code-low-code-ai-agents')] : data;
                    setAllCourses(sorted);
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };
        fetchCourses();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePayment = async () => {
        if (!formData.name || !formData.email || !formData.phone) {
            alert('Please fill in all required fields');
            return;
        }

        setIsProcessing(true);

        try {
            const orderResponse = await fetch(`${API_BASE_URL}/api/payment/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: 1.00,
                    email: formData.email,
                    phone: formData.phone,
                    courseData: {
                        name: formData.name,
                        course: formData.course
                    }
                })
            });

            const orderData = await orderResponse.json();
            if (!orderResponse.ok) throw new Error(orderData.error || 'Failed to create order');

            const regResponse = await fetch(`${API_BASE_URL}/api/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    mobile: formData.phone,
                    course: formData.course,
                    orderId: orderData.order_id
                })
            });

            if (!regResponse.ok) throw new Error('Failed to register user');

            const cashfree = new window.Cashfree({ mode: "production" });
            cashfree.checkout({
                paymentSessionId: orderData.payment_session_id,
                returnUrl: `${window.location.origin}/?order_id=${orderData.order_id}`
            });

        } catch (error: any) {
            console.error("Payment error:", error);
            alert(error.message || "Payment failed");
            setIsProcessing(false);
        }
    };



    const filteredCourses = allCourses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.desc.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const coursesSection = document.getElementById('courses');
            if (coursesSection) {
                coursesSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [searchTerm]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 font-sans text-slate-600 selection:bg-[#0f269a]/20">
            {/* Fixed Header Wrapper */}
            <div className={`fixed top-0 z-50 w-full flex flex-col transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-xl shadow-md border-b border-slate-200' : 'bg-transparent'}`}>
                {/* Course Navigation Strip (Top of Navbar) */}
                <div className={`text-white overflow-hidden relative transition-all duration-300 ${isScrolled ? 'bg-[#0f269a]' : 'bg-[#0f269a]/80 backdrop-blur-sm'}`}>
                    <style>{`
                        @keyframes marquee {
                            0% { transform: translateX(0); }
                            100% { transform: translateX(-50%); }
                        }
                        .animate-marquee {
                            animation: marquee 60s linear infinite;
                            width: max-content;
                        }
                        .animate-marquee:hover {
                            animation-play-state: paused;
                        }
                    `}</style>
                    <div className="flex animate-marquee py-2 items-center">
                        {/* First Copy */}
                        <div className="flex items-center space-x-12 px-6">
                            {allCourses.map((course) => (
                                <button
                                    key={`orig-${course.id}`}
                                    onClick={() => onCourseClick((course as any).id || 'default')}
                                    className="text-white/80 hover:text-white text-xs font-bold transition-colors uppercase tracking-wider whitespace-nowrap flex items-center"
                                >
                                    <Star size={10} className="mr-2 text-[#fbbf24] fill-current" />
                                    {course.title.replace('Course', '').replace('Curriculum', '').trim()}
                                </button>
                            ))}
                        </div>
                        {/* Second Copy for Infinite Loop */}
                        <div className="flex items-center space-x-12 px-6">
                            {allCourses.map((course) => (
                                <button
                                    key={`copy-${course.id}`}
                                    onClick={() => onCourseClick((course as any).id || 'default')}
                                    className="text-white/80 hover:text-white text-xs font-bold transition-colors uppercase tracking-wider whitespace-nowrap flex items-center"
                                >
                                    <Star size={10} className="mr-2 text-[#fbbf24] fill-current" />
                                    {course.title.replace('Course', '').replace('Curriculum', '').trim()}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Navbar */}
                <nav id="home" className="flex justify-between items-center px-6 md:px-12 py-4 relative transition-all">
                    <div className="flex items-center space-x-2">
                        <a href="/">
                            <img src="/logo.png" alt="GenQuantaa Logo" className="h-10" />
                        </a>
                    </div>
                    <div className="hidden md:flex space-x-10 text-slate-600 font-medium text-sm">
                        <a href="#about" className="hover:text-blue-400 transition-colors">About</a>
                        <a href="#courses" className="hover:text-blue-400 transition-colors">Courses</a>
                        <a href="/quantum" className="hover:text-purple-500 font-semibold transition-colors flex items-center gap-1">
                            Quantum
                        </a>
                        <a href="/fde" className="hover:text-emerald-500 font-semibold transition-colors">FDE Masterclass</a>
                        <a href="/biologics" className="hover:text-purple-600 font-semibold transition-colors">Biologics</a>
                        <div className="relative group">
                            <a href="#courses" className="hover:text-blue-400 transition-colors flex items-center gap-1">Brochure <ChevronRight size={14} className="rotate-90" /></a>
                            <ul className="absolute left-0 mt-2 w-56 bg-white border border-slate-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
                                <li><a href="https://canva.link/rjfd8qkq4hfewxv" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-[#0f269a] font-bold hover:bg-slate-100">No Code AI Agents Brochure (Canva)</a></li>
                                <li><a href="/DATA%20SCINECE%20COURSE%20BROCHURE%20(3).pdf" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">Data Science Brochure</a></li>
                                <li><a href="/AI%20Course%20Broucher.pdf" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">AI Course Brochure</a></li>
                                <li><a href="/Quantum%20Computing%20(1).pdf" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">Quantum Computing Brochure</a></li>
                                <li><a href="/LifeSciences.pdf" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">Generative AI for End-to-End Drug Discovery & Life Sciences</a></li>
                            </ul>
                        </div>
                        <a href="#alumnis" className="hover:text-blue-400 transition-colors">Alumnis</a>
                        <a href="/become-trainer" className="text-[#0f269a] font-semibold hover:text-[#0a1a72] transition-colors">Become a Trainer</a>
                        <a href="#blog" className="hover:text-blue-400 transition-colors">Blog</a>
                        <a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a>
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
                            onClick={onStart}
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
                    <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-xl z-50 flex flex-col px-6 py-6 space-y-6">
                        <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 font-semibold text-lg">About</a>
                        <a href="#courses" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 font-semibold text-lg">Courses</a>
                        <a href="/quantum" onClick={() => setIsMobileMenuOpen(false)} className="text-purple-600 font-semibold text-lg">Quantum</a>
                        <a href="/fde" onClick={() => setIsMobileMenuOpen(false)} className="text-emerald-600 font-semibold text-lg">FDE Masterclass</a>
                        <a href="/biologics" onClick={() => setIsMobileMenuOpen(false)} className="text-purple-600 font-semibold text-lg">Biologics</a>

                        <div className="flex flex-col space-y-3">
                            <span className="text-slate-400 font-semibold text-sm uppercase tracking-wider">Brochures</span>
                            <a href="https://canva.link/rjfd8qkq4hfewxv" target="_blank" rel="noopener noreferrer" className="text-[#0f269a] font-bold pl-4 text-sm">No Code AI Agents Brochure (Canva)</a>
                            <a href="/DATA%20SCINECE%20COURSE%20BROCHURE%20(3).pdf" className="text-slate-600 pl-4 text-sm">Data Science Brochure</a>
                            <a href="/AI%20Course%20Broucher.pdf" className="text-slate-600 pl-4 text-sm">AI Course Brochure</a>
                            <a href="/Quantum%20Computing%20(1).pdf" className="text-slate-600 pl-4 text-sm">Quantum Computing Brochure</a>
                            <a href="/LifeSciences.pdf" className="text-slate-600 pl-4 text-sm">Drug Discovery & Life Sciences</a>
                        </div>

                        <a href="#alumnis" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 font-semibold text-lg">Alumnis</a>
                        <a href="/become-trainer" onClick={() => setIsMobileMenuOpen(false)} className="text-[#0f269a] font-semibold text-lg">Become a Trainer</a>
                        <a href="#blog" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 font-semibold text-lg">Blog</a>
                        <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 font-semibold text-lg">Contact</a>
                    </div>
                )}
            </div>

            {/* Unified Hero Background - Needs padding-top to account for the fixed header */}
            <div className="relative overflow-hidden pt-[100px]">
                {/* Background Blobs for Sweeping Curves */}
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[80%] bg-white/70 blur-3xl rounded-full pointer-events-none transform -rotate-12"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[120%] bg-blue-200/40 blur-3xl rounded-full pointer-events-none"></div>
                <div className="absolute top-[20%] right-[20%] w-[40%] h-[60%] bg-cyan-100/40 blur-3xl rounded-full pointer-events-none"></div>
                <div className="absolute top-[10%] left-[30%] w-[30%] h-[40%] bg-purple-200/30 blur-3xl rounded-full pointer-events-none"></div>

                <style>{`
                    @keyframes float {
                        0% { transform: translateY(0px); }
                        50% { transform: translateY(-15px); }
                        100% { transform: translateY(0px); }
                    }
                    .animate-float {
                        animation: float 6s ease-in-out infinite;
                    }
                    .animate-float-delayed {
                        animation: float 8s ease-in-out infinite;
                        animation-delay: 2s;
                    }
                    @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');
                    .font-handwriting {
                        font-family: 'Caveat', cursive;
                    }
                `}</style>

                {/* Hero Section */}
                <header className="container mx-auto px-6 md:px-12 pt-8 pb-16 md:pt-12 md:pb-24 flex flex-col-reverse lg:flex-row items-center justify-between max-w-7xl relative z-10">

                    {/* Left Side: Hero Image */}
                    <div className="lg:w-[45%] mt-16 lg:mt-0 relative flex justify-center items-center">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/50 blur-3xl rounded-full pointer-events-none z-10 animate-pulse"></div>
                        <img
                            src="/hero-image.webp"
                            alt="Drug Discovery AI"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = '/BG.png'; // fallback
                            }}
                            className="w-full max-w-[450px] h-auto object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-700 animate-float z-20"
                        />
                    </div>

                    {/* Right Side: Text & Content */}
                    <div className="lg:w-[50%] space-y-6 z-20">
                        <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-slate-900 leading-[1.1] tracking-tight">
                            Generative AI for <br />
                            End-to-End Drug Discovery <br />
                            & Life Sciences
                        </h1>
                        <p className="text-slate-600 text-lg md:text-xl max-w-lg leading-relaxed font-medium">
                            A comprehensive learning journey from AI foundations to enterprise-grade drug discovery systems
                        </p>

                        <div className="flex flex-wrap gap-2 pt-2 pb-4">
                            <div className="bg-[#2546f0]/10 border border-[#2546f0]/20 rounded-full px-4 py-1.5 text-[#2546f0] font-bold text-[10px] md:text-xs uppercase tracking-wide">
                                Learn how AI is designing tomorrow's medicines today
                            </div>
                            <div className="bg-white/60 border border-slate-200 rounded-full px-3 py-1.5 text-slate-600 font-semibold text-[10px] md:text-xs uppercase tracking-wide">
                                Networking with experts & peers
                            </div>
                            <div className="bg-white/60 border border-slate-200 rounded-full px-3 py-1.5 text-slate-600 font-semibold text-[10px] md:text-xs uppercase tracking-wide">
                                Hands-on learning approach
                            </div>
                            <div className="bg-white/60 border border-slate-200 rounded-full px-3 py-1.5 text-slate-600 font-semibold text-[10px] md:text-xs uppercase tracking-wide">
                                Real-world AI use cases
                            </div>
                            <div className="bg-white/60 border border-slate-200 rounded-full px-3 py-1.5 text-slate-600 font-semibold text-[10px] md:text-xs uppercase tracking-wide">
                                Industry-relevant curriculum
                            </div>
                            <div className="bg-white/60 border border-slate-200 rounded-full px-3 py-1.5 text-slate-600 font-semibold text-[10px] md:text-xs uppercase tracking-wide">
                                Cross-domain expertise (AI + Life Sciences)
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <div className="flex-1 flex flex-col gap-1.5 group">
                                <div className="text-center font-bold text-lg text-slate-800">₹9,900</div>
                                <button className="h-full w-full bg-white/80 hover:bg-white border border-slate-200 text-slate-800 py-3 px-2 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center text-center">
                                    <span className="font-bold text-lg">5-Day Sprint</span>
                                    <span className="text-[10px] font-semibold text-slate-500 mt-0.5">(Fast-Track)</span>
                                </button>
                            </div>
                            <div className="flex-1 flex flex-col gap-1.5 group">
                                <div className="text-center font-bold text-lg text-slate-800">₹28,000</div>
                                <button className="h-full w-full bg-white/80 hover:bg-white border border-slate-200 text-slate-800 py-3 px-2 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center text-center">
                                    <span className="font-bold text-lg">45-Day Deep-Dive</span>
                                    <span className="text-[10px] font-semibold text-slate-500 mt-0.5">(Career Builder)</span>
                                </button>
                            </div>
                            <div className="flex-1 flex flex-col gap-1.5 group relative">
                                <div className="text-center font-bold text-lg text-[#2546f0]">₹1,25,000</div>
                                <button className="h-full w-full bg-[#2546f0] hover:bg-[#1a35cc] border border-[#2546f0] text-white py-3 px-2 rounded-2xl shadow-lg shadow-[#2546f0]/20 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center text-center transform hover:-translate-y-0.5">
                                    <span className="font-bold text-lg text-white">6-Mo Masterclass</span>
                                    <span className="text-[10px] font-medium text-white/80 mt-0.5">(Executive AI)</span>
                                </button>
                                {/* The handwritten arrow can point to the masterclass now! */}
                                <div className="hidden lg:flex items-center absolute -right-[120px] top-[25px]">
                                    <svg width="40" height="30" viewBox="0 0 100 100" className="text-slate-600 fill-none transform -rotate-12">
                                        <path d="M90,80 Q40,40 10,50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        <path d="M25,35 L5,52 L25,65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span className="text-slate-700 font-handwriting text-lg ml-1 mt-6 transform rotate-[-5deg] whitespace-nowrap">popular choice</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
            </div>

            {/* Popular Courses */}
            <section id="courses" className="py-24 relative overflow-hidden">
                {/* Section Background Blending */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-white/50"></div>
                <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-blue-200/20 blur-3xl rounded-full pointer-events-none"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-200/20 blur-3xl rounded-full pointer-events-none"></div>

                <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">Most Popular Courses</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto text-lg">Choose from our wide range of courses from expert organizations.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {filteredCourses.map((course, index) => (
                            <div key={index} className={`bg-white/60 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 border border-white hover:border-${course.color}-400/50 hover:shadow-2xl hover:shadow-${course.color}-500/20 transition-all duration-500 transform hover:-translate-y-2 group flex flex-col h-full`}>
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={
                                            course.image && course.image.startsWith('https://lms-frontend-blue-mu.vercel.app/')
                                                ? course.image.replace('https://lms-frontend-blue-mu.vercel.app', '')
                                                : (course.image || '/drug_discovery_sprint.png')
                                        }
                                        alt={course.title}
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.onerror = null;
                                            target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                                        }}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className={`absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-${course.color}-400 shadow-sm uppercase tracking-wide border border-slate-300`}>{course.level}</div>
                                    <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-slate-900 flex items-center border border-black/10">
                                        <Play size={10} className="mr-1 fill-slate-900" /> {course.duration}
                                    </div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className={`text-xs font-bold text-${course.color}-400 bg-${course.color}-500/10 px-2 py-1 rounded uppercase tracking-wide border border-${course.color}-500/20`}>{course.level}</span>
                                        <div className="flex items-center text-amber-400 text-sm font-bold">
                                            <Star size={14} className="fill-current mr-1" /> {course.rating}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">{course.title}</h3>
                                    <p className="text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed">{course.desc}</p>

                                    <div className="mt-auto pt-6 border-t border-slate-200 flex items-center justify-between">
                                        <div>
                                            <span className="text-2xl font-bold text-slate-900">{course.price}</span>
                                            {course.originalPrice && (
                                                <span className="text-slate-600 text-sm line-through ml-2">{course.originalPrice}</span>
                                            )}
                                            {course.discount && (
                                                <span className="block text-xs text-green-400 font-bold mt-1">{course.discount}</span>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={course.status === "Active" ? () => onCourseClick((course as any).id || 'python-ai-course') : undefined}
                                                disabled={course.status !== "Active"}
                                                className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 transform ${course.status === "Active" ? 'hover:-translate-y-0.5 bg-[#0f269a] text-white hover:bg-[#0a1a72] shadow-md hover:shadow-lg' : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'} text-xs uppercase tracking-wide`}
                                            >
                                                {course.status === "Active" ? "Learn More" : "Upcoming"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* Stats Section */}
            <section className="relative bg-white/40 backdrop-blur-3xl py-16 border-y border-white">
                <div className="container mx-auto px-6 md:px-12 max-w-7xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 relative z-10">
                        {[
                            { icon: Briefcase, label: "Placement Success", value: "100%", color: "text-green-500", bg: "bg-green-100/50" },
                            { icon: Users, label: "Expert Tutors", value: "20+", color: "text-blue-500", bg: "bg-blue-100/50" },
                            { icon: BookOpen, label: "Active Students", value: "100+", color: "text-purple-500", bg: "bg-purple-100/50" },
                            { icon: Award, label: "Job Allocation", value: "100%", color: "text-orange-500", bg: "bg-orange-100/50" },
                        ].map((stat, index) => (
                            <div key={index} className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl shadow-blue-900/5 border border-white flex flex-col md:flex-row items-center md:space-x-4 space-y-3 md:space-y-0 text-center md:text-left hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-500 shadow-sm border border-white`}>
                                    <stat.icon size={28} />
                                </div>
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">{stat.value}</h3>
                                    <p className="text-slate-500 font-semibold text-xs md:text-sm uppercase tracking-wide">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Placement Process Section - Transparent to show master bg */}
            <section className="py-24 relative overflow-hidden">
                {/* Background glowing orbs */}
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-300/30 blur-[100px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-300/30 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center bg-white/40 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white">
                            <Briefcase className="mr-2 text-blue-500" size={16} />
                            <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider">Your Dream Career Starts Here</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">Your Path to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">100% Placement Assistance</span></h2>
                        <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
                            A clear, structured journey from learning to landing your career in companies like
                            <span className="text-slate-800 font-bold mx-1">top companies</span> and many more top MNCs.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {[
                            {
                                step: "01",
                                title: "Learn with Experts",
                                desc: "Master cutting-edge AI skills with industry leaders who have over 14 years of MNC experience.",
                                icon: BookOpen,
                                color: "text-blue-300",
                                bg: "bg-blue-500/20"
                            },
                            {
                                step: "02",
                                title: "Mock Interview Prep",
                                desc: "Get access to 2 mandatory mock interview sessions. Our experts will prepare you to be industry-ready.",
                                icon: Brain,
                                color: "text-purple-300",
                                bg: "bg-purple-500/20"
                            },
                            {
                                step: "03",
                                title: "Job Allocation",
                                desc: "Pass the mocks and get allocated to top companies. We guarantee 100% placement support in top 10 IT companies & more.",
                                icon: Briefcase,
                                color: "text-green-300",
                                bg: "bg-green-500/20"
                            }
                        ].map((item, index) => (
                            <div key={index} className="relative bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-white hover:bg-white/80 shadow-xl shadow-blue-900/5 hover:border-white transition-all duration-500 group hover:-translate-y-2">
                                <div className={`w-16 h-16 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6 border border-white shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                                    <item.icon size={28} />
                                </div>
                                <div className="absolute top-8 right-8 text-6xl font-black text-slate-100 group-hover:text-slate-200 transition-colors">
                                    {item.step}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight">{item.title}</h3>
                                <p className="text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Course Categories Section - Moved Above Popular Courses */}
            <section className="py-24 relative overflow-hidden">
                {/* Background Blending */}
                <div className="absolute inset-0 pointer-events-none"></div>
                <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-purple-200/30 blur-3xl rounded-full pointer-events-none"></div>
                <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-blue-200/30 blur-3xl rounded-full pointer-events-none"></div>

                <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">Explore Courses by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Category</span></h2>
                        <p className="text-slate-500 max-w-2xl mx-auto text-lg">Find the perfect course for your learning goals</p>
                    </div>

                    {/* Attractive Table */}
                    <div className="overflow-x-auto rounded-3xl border border-white bg-white/40 backdrop-blur-xl shadow-2xl shadow-blue-900/5">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-white/50 border-b border-white">
                                    <th className="py-6 px-8 text-left border-b-2 border-orange-500 bg-gradient-to-br from-orange-500/20 to-transparent">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                                                <TrendingUp className="text-slate-900" size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900">Trending Skills</h3>
                                                <p className="text-xs text-orange-400 font-semibold">Most In-Demand</p>
                                            </div>
                                        </div>
                                    </th>
                                    <th className="py-6 px-8 text-left border-b-2 border-blue-500 bg-gradient-to-br from-blue-500/20 to-transparent">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                                                <Briefcase className="text-slate-900" size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900">Bootcamp Programs</h3>
                                                <p className="text-xs text-blue-400 font-semibold">Intensive Learning</p>
                                            </div>
                                        </div>
                                    </th>
                                    <th className="py-6 px-8 text-left border-b-2 border-purple-500 bg-gradient-to-br from-purple-500/20 to-transparent">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                                <Rocket className="text-slate-900" size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900">Skill Boosters</h3>
                                                <p className="text-xs text-purple-400 font-semibold">Specialized Training</p>
                                            </div>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    {
                                        trending: { id: 'gen-ai-course', name: 'Generative AI' },
                                        bootcamp: { id: 'python-ai-course', name: 'Python Programming for AI' },
                                        booster: { id: 'ai-healthcare-course', name: 'Artificial Intelligence in Healthcare' }
                                    },
                                    {
                                        trending: { id: 'agentic-ai-course', name: 'Agentic AI' },
                                        bootcamp: { id: 'ml-dl-course', name: 'Machine Learning & Deep Learning' },
                                        booster: { id: 'pharma-gen-ai-course', name: 'Generative AI in Pharma' }
                                    },
                                    {
                                        trending: { id: 'nlp-course', name: 'Natural Language Processing' },
                                        bootcamp: { id: 'cv-course', name: 'Computer Vision' },
                                        booster: { id: 'ai-cybersecurity-course', name: 'AI in Cybersecurity' }
                                    }
                                ].map((row, index) => (
                                    <tr key={index} className="border-b border-white/50 hover:bg-white/60 transition-all duration-300">
                                        <td className="py-5 px-8 border-r border-slate-200/50">
                                            <button
                                                onClick={() => onCourseClick(row.trending.id)}
                                                className="flex items-center space-x-3 w-full text-left group"
                                            >
                                                <div className="w-8 h-8 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-400 font-bold text-sm border border-orange-500/30 group-hover:bg-orange-500 group-hover:text-slate-900 transition-all">
                                                    {index + 1}
                                                </div>
                                                <span className="text-slate-600 group-hover:text-orange-400 transition-colors font-medium group-hover:translate-x-1 transition-transform">
                                                    {row.trending.name}
                                                </span>
                                                <ArrowRight size={16} className="text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                                            </button>
                                        </td>
                                        <td className="py-5 px-8 border-r border-slate-200/50">
                                            <button
                                                onClick={() => onCourseClick(row.bootcamp.id)}
                                                className="flex items-center space-x-3 w-full text-left group"
                                            >
                                                <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 font-bold text-sm border border-blue-500/30 group-hover:bg-blue-500 group-hover:text-slate-900 transition-all">
                                                    {index + 1}
                                                </div>
                                                <span className="text-slate-600 group-hover:text-blue-400 transition-colors font-medium group-hover:translate-x-1 transition-transform">
                                                    {row.bootcamp.name}
                                                </span>
                                                <ArrowRight size={16} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                                            </button>
                                        </td>
                                        <td className="py-5 px-8">
                                            <button
                                                onClick={() => onCourseClick(row.booster.id)}
                                                className="flex items-center space-x-3 w-full text-left group"
                                            >
                                                <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-400 font-bold text-sm border border-purple-500/30 group-hover:bg-purple-500 group-hover:text-slate-900 transition-all">
                                                    {index + 1}
                                                </div>
                                                <span className="text-slate-600 group-hover:text-purple-400 transition-colors font-medium group-hover:translate-x-1 transition-transform">
                                                    {row.booster.name}
                                                </span>
                                                <ArrowRight size={16} className="text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Category Stats */}
                    <div className="grid grid-cols-3 gap-6 mt-12">
                        <div className="bg-white/60 backdrop-blur-md border border-white rounded-2xl p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                            <div className="text-3xl font-black text-orange-500 mb-2 group-hover:scale-110 transition-transform">3</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Trending Courses</div>
                        </div>
                        <div className="bg-white/60 backdrop-blur-md border border-white rounded-2xl p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                            <div className="text-3xl font-black text-blue-500 mb-2 group-hover:scale-110 transition-transform">3</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Bootcamp Programs</div>
                        </div>
                        <div className="bg-white/60 backdrop-blur-md border border-white rounded-2xl p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                            <div className="text-3xl font-black text-purple-500 mb-2 group-hover:scale-110 transition-transform">3</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Skill Boosters</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Our Platform - Redesigned */}
            <section className="py-24 relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-200 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100 rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center bg-white/40 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white">
                            <Monitor className="mr-2 text-blue-500" size={16} />
                            <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider">Next-Generation Learning Platform</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                            Why Choose Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-emerald-500">Platform?</span>
                        </h2>
                        <p className="text-slate-500 max-w-3xl mx-auto text-lg leading-relaxed">
                            Experience revolutionary online education powered by AI, backed by industry experts, and trusted by professionals worldwide
                        </p>
                    </div>

                    {/* Feature Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
                        {[
                            {
                                icon: Briefcase,
                                title: "100% Placement Assistance",
                                description: "Assured placement in top companies and more. Includes 2 mock interviews; clearing them ensures company allocation.",
                                stat: "100%",
                                statLabel: "Placement",
                                gradient: "from-yellow-400 to-orange-500",
                                bgGradient: "from-yellow-500/20 to-orange-500/20"
                            },
                            {
                                icon: Brain,
                                title: "AI-Powered Learning",
                                description: "Personalized learning paths with cutting-edge AI technology",
                                stat: "98%",
                                statLabel: "Success Rate",
                                gradient: "from-orange-400 to-red-500",
                                bgGradient: "from-orange-500/20 to-red-500/20"
                            },
                            {
                                icon: Users,
                                title: "Industry Experts",
                                description: "Learn from top professionals at Google, Microsoft, Meta & more",
                                stat: "500+",
                                statLabel: "Instructors",
                                gradient: "from-blue-400 to-cyan-500",
                                bgGradient: "from-blue-500/20 to-cyan-500/20"
                            },
                            {
                                icon: Globe,
                                title: "Global Community",
                                description: "Join 100+ learners from various countries worldwide",
                                stat: "24/7",
                                statLabel: "Support",
                                gradient: "from-green-400 to-emerald-500",
                                bgGradient: "from-green-500/20 to-emerald-500/20"
                            },
                            {
                                icon: Shield,
                                title: "Verified Certificates",
                                description: "Blockchain verified certificates recognized by 1000+ companies",
                                stat: "100%",
                                statLabel: "Authentic",
                                gradient: "from-purple-400 to-pink-500",
                                bgGradient: "from-purple-500/20 to-pink-500/20"
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="group relative bg-black/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-white/20"
                            >
                                {/* Gradient Overlay */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}></div>

                                {/* Content */}
                                <div className="relative z-10">
                                    {/* Icon */}
                                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                                        <feature.icon className="text-white" size={24} />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                                        {feature.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-slate-500 text-sm mb-4 leading-relaxed">
                                        {feature.description}
                                    </p>

                                    {/* Stat Badge */}
                                    <div className={`inline-flex items-center bg-gradient-to-r ${feature.gradient} px-3 py-1.5 rounded-lg`}>
                                        <span className="text-white font-bold text-sm mr-1">{feature.stat}</span>
                                        <span className="text-white/90 text-xs uppercase tracking-wide">{feature.statLabel}</span>
                                    </div>
                                </div>

                                {/* Corner Accent */}
                                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${feature.gradient} opacity-10 rounded-bl-full`}></div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom CTA */}
                    <div className="text-center">
                        <div className="inline-flex items-center gap-8 bg-white/60 backdrop-blur-lg border border-white rounded-2xl px-8 py-4 shadow-xl shadow-blue-900/5">
                            <div>
                                <div className="text-3xl font-bold text-slate-900">100+</div>
                                <div className="text-slate-500 font-semibold text-sm uppercase">Students</div>
                            </div>
                            <div className="w-px h-12 bg-slate-200"></div>
                            <div>
                                <div className="text-3xl font-bold text-slate-900">3+</div>
                                <div className="text-slate-500 font-semibold text-sm uppercase">Countries</div>
                            </div>
                            <div className="w-px h-12 bg-slate-200"></div>
                            <div>
                                <div className="text-3xl font-bold text-slate-900">4.9/5</div>
                                <div className="text-slate-500 font-semibold text-sm uppercase">Average Rating</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Career Growth Showcase Section */}
            <section className="py-24 relative overflow-hidden">
                {/* Background Blending */}
                <div className="absolute inset-0 pointer-events-none"></div>

                <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 px-4 py-2 rounded-full mb-6">
                            <TrendingUp className="mr-2 text-green-400" size={16} />
                            <span className="text-green-400 text-sm font-semibold uppercase tracking-wider">Success Stories</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                            Transform Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">Career Path</span>
                        </h2>
                        <p className="text-slate-400 max-w-3xl mx-auto text-lg leading-relaxed">
                            See how our students have accelerated their careers with measurable growth in roles, skills, and compensation
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {/* Beginner Level */}
                        <div className="p-8 bg-white/60 backdrop-blur-md rounded-3xl border border-white shadow-xl shadow-blue-900/5 hover:shadow-2xl hover:border-[#0f269a]/30 transition-all duration-500 group">
                            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-2">BEGINNER LEVEL</h3>
                            <p className="text-slate-900 font-semibold mb-6">Build Strong AI Foundations</p>
                            <ul className="list-none text-slate-600 space-y-3 mb-6">
                                <li className="flex items-start gap-2"><span className="text-cyan-400 mt-0.5">✔</span> <span>Learn industry-relevant fundamentals</span></li>
                                <li className="flex items-start gap-2"><span className="text-cyan-400 mt-0.5">✔</span> <span>Gain confidence to crack technical interviews</span></li>
                                <li className="flex items-start gap-2"><span className="text-cyan-400 mt-0.5">✔</span> <span>Understand Python, AI, ML & data concepts</span></li>
                                <li className="flex items-start gap-2"><span className="text-cyan-400 mt-0.5">✔</span> <span>Create beginner-friendly projects</span></li>
                            </ul>
                            <div className="pt-4 border-t border-slate-300/50">
                                <p className="text-slate-500 text-sm mb-3">Perfect for students, freshers, and career starters.</p>
                                <p className="text-cyan-500 font-bold group-hover:text-cyan-400 transition-colors">Start your AI journey with confidence.</p>
                            </div>
                        </div>
                        {/* Intermediate Level */}
                        <div className="p-8 bg-white/60 backdrop-blur-md rounded-3xl border border-white shadow-xl shadow-blue-900/5 hover:shadow-2xl hover:border-[#0f269a]/30 transition-all duration-500 group">
                            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400 mb-2">INTERMEDIATE LEVEL</h3>
                            <p className="text-slate-900 font-semibold mb-6">Become Job-Ready</p>
                            <ul className="list-none text-slate-600 space-y-3 mb-6">
                                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✔</span> <span>Build real-world AI and Machine Learning projects</span></li>
                                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✔</span> <span>Develop practical industry skills</span></li>
                                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✔</span> <span>Strengthen your portfolio and resume</span></li>
                                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✔</span> <span>Prepare for AI, Data Science & ML job roles</span></li>
                            </ul>
                            <div className="pt-4 border-t border-slate-300/50">
                                <p className="text-slate-500 text-sm mb-3">Designed to help learners transition into professional AI careers.</p>
                                <p className="text-emerald-500 font-bold group-hover:text-emerald-400 transition-colors">Take the next step toward high-growth tech opportunities.</p>
                            </div>
                        </div>
                        {/* Advanced Level */}
                        <div className="p-8 bg-white/60 backdrop-blur-md rounded-3xl border border-white shadow-xl shadow-blue-900/5 hover:shadow-2xl hover:border-[#0f269a]/30 transition-all duration-500 group">
                            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">ADVANCED LEVEL</h3>
                            <p className="text-slate-900 font-semibold mb-6">Accelerate Your Career Growth</p>
                            <ul className="list-none text-slate-600 space-y-3 mb-6">
                                <li className="flex items-start gap-2"><span className="text-purple-400 mt-0.5">✔</span> <span>Master advanced AI, Deep Learning & Generative AI</span></li>
                                <li className="flex items-start gap-2"><span className="text-purple-400 mt-0.5">✔</span> <span>Work on industry-focused case studies</span></li>
                                <li className="flex items-start gap-2"><span className="text-purple-400 mt-0.5">✔</span> <span>Build expertise valued by top employers</span></li>
                                <li className="flex items-start gap-2"><span className="text-purple-400 mt-0.5">✔</span> <span>Position yourself for higher-paying AI roles</span></li>
                            </ul>
                            <div className="pt-4 border-t border-slate-300/50">
                                <p className="text-slate-500 text-sm mb-3 leading-relaxed">Professionals with advanced AI skills are among the most in-demand tech talent globally.</p>
                                <p className="text-purple-500 font-bold group-hover:text-purple-400 transition-colors">Level up your expertise and unlock greater career opportunities.</p>
                            </div>
                        </div>
                    </div>

                    {/* Career Path Timeline */}
                    <div className="bg-white/70 backdrop-blur-2xl border border-white shadow-2xl shadow-blue-900/10 rounded-[40px] p-8 md:p-12">
                        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center tracking-tight">
                            Average Student Career Journey
                        </h3>

                        {/* Timeline */}
                        <div className="relative pt-4">
                            {/* Progress Line */}
                            <div className="absolute top-[27px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-red-500 via-orange-500 via-yellow-500 via-green-500 to-emerald-500 hidden md:flex items-center justify-evenly z-0">
                                <div className="bg-slate-50 rounded-full text-orange-500 p-0.5"><ArrowRight size={14} /></div>
                                <div className="bg-slate-50 rounded-full text-yellow-500 p-0.5"><ArrowRight size={14} /></div>
                                <div className="bg-slate-50 rounded-full text-green-500 p-0.5"><ArrowRight size={14} /></div>
                                <div className="bg-slate-50 rounded-full text-emerald-500 p-0.5"><ArrowRight size={14} /></div>
                            </div>

                            {/* Timeline Items */}
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4 relative z-10">
                                {[
                                    {
                                        month: "Phase 1",
                                        role: "Learning Journey",
                                        salary: "Starting Point",
                                        status: "Skill Building & Projects",
                                        color: "red",
                                        skills: ["Core Prep"]
                                    },
                                    {
                                        month: "Phase 2",
                                        role: "Advanced Training",
                                        salary: "Growth Phase",
                                        status: "Expert Mentorship",
                                        color: "orange",
                                        skills: ["Production Ready"]
                                    },
                                    {
                                        month: "Phase 3",
                                        role: "Mock Interviews",
                                        salary: "2 Sessions",
                                        status: "Clearing Benchmarks",
                                        color: "yellow",
                                        skills: ["Interview Mastery"]
                                    },
                                    {
                                        month: "Phase 4",
                                        role: "Career Placement",
                                        salary: "Top Companies & More",
                                        status: "Company Allocation",
                                        color: "green",
                                        skills: ["Job Assurance"]
                                    },
                                    {
                                        month: "Phase 5",
                                        role: "Career Success",
                                        salary: "30-40%",
                                        status: "Long-term Growth",
                                        color: "emerald",
                                        skills: ["Alumni Network"]
                                    }
                                ].map((milestone, index) => (
                                    <div key={index} className="relative flex flex-col">
                                        {/* Connector Dot */}
                                        <div className={`hidden md:flex w-7 h-7 rounded-full bg-${milestone.color}-500 border-[5px] border-slate-950 mx-auto mb-6 relative z-10 ring-2 ring-${milestone.color}-500/40 shadow-lg`}></div>

                                        {/* Card */}
                                        <div className={`bg-slate-100/40 backdrop-blur-sm border border-${milestone.color}-500/20 rounded-xl p-5 hover:border-${milestone.color}-500/50 transition-all group hover:-translate-y-1 flex-1 flex flex-col`}>
                                            <div className={`text-${milestone.color}-400 font-bold text-xs uppercase tracking-wider mb-2`}>{milestone.month}</div>
                                            <div className="text-slate-900 font-bold text-base md:text-lg mb-1 leading-tight">{milestone.role}</div>
                                            <div className="text-slate-600 font-semibold text-sm md:text-base mb-2">{milestone.salary}</div>
                                            <div className="text-slate-400 text-xs mb-3">{milestone.status}</div>
                                            <div className="mt-auto pt-3 border-t border-slate-300/50">
                                                {milestone.skills.map((skill, i) => (
                                                    <span key={i} className={`inline-block text-[10px] md:text-xs font-semibold text-${milestone.color}-400`}>
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom Note */}
                        <div className="mt-12 text-center">
                            <p className="text-slate-400 text-sm">
                                <Star className="inline text-yellow-400 fill-yellow-400 mr-1" size={14} />
                                Based on data from 100+ successful students who completed our programs
                            </p>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="mt-16 text-center">
                        <div className="inline-flex flex-col items-center bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-8">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Ready to Start Your Journey?</h3>
                            <p className="text-slate-400 mb-6">Join thousands of students transforming their careers</p>
                            <button
                                onClick={onStart}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:from-green-400 hover:to-emerald-500 transition-all shadow-lg shadow-green-900/30 hover:shadow-green-500/50 flex items-center group"
                            >
                                Explore Courses
                                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>





            {/* Live Projects Section */}
            <section className="py-24 relative overflow-hidden">
                {/* Background Blending */}
                <div className="absolute inset-0 pointer-events-none"></div>
                <div className="absolute bottom-[10%] right-[10%] w-[50%] h-[50%] bg-blue-200/20 blur-3xl rounded-full pointer-events-none"></div>

                <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase border border-emerald-500/20 backdrop-blur-sm mb-4">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            <span>Real-World Experience</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Projects We're <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Working On</span></h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">Gain hands-on experience with industry-relevant live projects</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                title: "AI-Powered Drug Discovery Platform",
                                category: "Healthcare AI",
                                status: "In Progress",
                                participants: "45+",
                                description: "Building an AI system for accelerating drug discovery using deep learning and molecular modeling",
                                tech: ["Python", "TensorFlow", "RDKit"],
                                color: "emerald"
                            },
                            {
                                title: "Real-Time Fraud Detection System",
                                category: "Cybersecurity",
                                status: "Active",
                                participants: "32+",
                                description: "Developing ML models to detect fraudulent transactions in real-time for fintech applications",
                                tech: ["Scikit-learn", "Apache Kafka", "PostgreSQL"],
                                color: "blue"
                            },
                            {
                                title: "Medical Image Analysis Tool",
                                category: "Computer Vision",
                                status: "In Progress",
                                participants: "28+",
                                description: "Creating AI models for automated diagnosis from medical imaging (X-rays, MRI, CT scans)",
                                tech: ["PyTorch", "OpenCV", "MONAI"],
                                color: "purple"
                            },
                            {
                                title: "NLP-Based Clinical Documentation",
                                category: "Natural Language Processing",
                                status: "Active",
                                participants: "38+",
                                description: "Automating clinical documentation using advanced NLP and medical coding systems",
                                tech: ["Transformers", "BERT", "spaCy"],
                                color: "orange"
                            },
                            {
                                title: "Predictive Maintenance System",
                                category: "Industrial AI",
                                status: "In Progress",
                                participants: "25+",
                                description: "IoT-based predictive maintenance solution using ML for manufacturing industries",
                                tech: ["Time Series", "AWS IoT", "React"],
                                color: "indigo"
                            },
                            {
                                title: "Agentic AI Workflow Builder",
                                category: "Agentic AI",
                                status: "Active",
                                participants: "52+",
                                description: "Building an enterprise workflow automation platform powered by autonomous AI agents",
                                tech: ["LangChain", "AutoGPT", "FastAPI"],
                                color: "pink"
                            }
                        ].map((project, index) => (
                            <div key={index} className={`bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-white hover:border-${project.color}-400/50 transition-all duration-500 group hover:-translate-y-2 shadow-xl shadow-blue-900/5 hover:shadow-2xl hover:shadow-${project.color}-500/20`}>
                                <div className="flex items-start justify-between mb-4">
                                    <span className={`text-xs font-bold px-3 py-1.5 rounded-xl bg-${project.color}-500/10 text-${project.color}-500 border border-${project.color}-500/20`}>
                                        {project.category}
                                    </span>
                                    <div className="flex items-center space-x-1 bg-white/50 px-2 py-1 rounded-lg border border-white">
                                        <div className={`w-2 h-2 bg-${project.color}-500 rounded-full animate-pulse`}></div>
                                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">{project.status}</span>
                                    </div>
                                </div>
                                <h3 className={`text-xl font-bold text-slate-900 mb-3 group-hover:text-${project.color}-500 transition-colors tracking-tight`}>
                                    {project.title}
                                </h3>
                                <p className="text-slate-500 text-sm mb-4 leading-relaxed">{project.description}</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.tech.map((tech, i) => (
                                        <span key={i} className="text-[10px] font-semibold uppercase tracking-wider bg-white border border-slate-200 text-slate-500 px-2 py-1 rounded-md shadow-sm">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-white/50">
                                    <div className="flex items-center space-x-2">
                                        <Users size={16} className={`text-${project.color}-500`} />
                                        <span className="text-sm font-semibold text-slate-500">{project.participants} Students</span>
                                    </div>
                                    <button className={`text-${project.color}-500 text-sm font-bold hover:underline`}>
                                        Join Project →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Previous Trainees Section */}
            <section id="alumnis" className="py-24 relative overflow-hidden">
                {/* Background Blending */}
                <div className="absolute inset-0 pointer-events-none"></div>

                <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center space-x-2 bg-yellow-500/10 text-yellow-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase border border-yellow-500/20 backdrop-blur-sm mb-4">
                            <Star className="fill-yellow-400" size={12} />
                            <span>Success Stories</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Alumni</span> Say</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">Join thousands of successful graduates who transformed their careers</p>
                    </div>

                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 mx-auto">
                        {[
                            {
                                name: "Nikhil M",
                                role: "Data Analyst",
                                course: "Data Science & AI",
                                image: "/nikhil.jpg",
                                rating: 5,
                                review: "This course completely transformed my career! The hands-on projects and 1-1 mentorship helped me land my dream job. The instructors are incredibly knowledgeable and supportive."
                            },
                            {
                                name: "Manisha P",
                                role: "AI Researcher",
                                course: "Machine Learning & Deep Learning",
                                image: "/Manisha.jpg",
                                rating: 5,
                                review: "The quality of content and real-world projects exceeded my expectations. I went from knowing basics to building production-level AI systems. Highly recommend for serious learners!"
                            },
                            {
                                name: "Aikya Mudapaka",
                                role: "Software Engineer",
                                course: "Python Programming for AI",
                                image: "/Aikya.jpg",
                                rating: 5,
                                review: "Best investment in my career! The curriculum is up-to-date with industry standards, and the live projects gave me confidence to tackle real challenges. Grateful for the amazing mentors!"
                            },
                            {
                                name: "Bhoomika",
                                role: "Computer Vision Engineer",
                                course: "Computer Vision",
                                image: "/Boomika.webp",
                                rating: 5,
                                review: "The depth of knowledge and practical applications in this course is unmatched. Working on autonomous vehicle projects during the course prepared me perfectly for my role."
                            },
                            {
                                name: "Parveen achukatla",
                                role: "Healthcare AI Specialist",
                                course: "AI in Healthcare",
                                image: "/Preveena.webp",
                                rating: 5,
                                review: "As a healthcare professional transitioning to AI, this course was perfect. The medical domain expertise combined with cutting-edge AI made me an expert in my niche."
                            },
                            {
                                name: "D Lakshmi Niranjan Reddy",
                                role: "Senior AI Engineer",
                                course: "Generative AI",
                                image: "/Nirangan.webp",
                                rating: 5,
                                review: "The GenAI course was incredibly comprehensive! From theory to deployment, everything was covered. The instructors' real-world experience made complex concepts easy to understand."
                            },
                            {
                                name: "Harika Moola",
                                role: "NLP Engineer",
                                course: "Natural Language Processing",
                                image: "/Harika.webp",
                                rating: 5,
                                review: "An exceptional learning experience. The focus on practical NLP applications and modern transformer architectures gave me the skills I needed for my current role."
                            },
                            {
                                name: "Kommana Devi",
                                role: "Data Scientist",
                                course: "Applied Data Science",
                                image: "/Devi.webp",
                                rating: 5,
                                review: "I learned so much in such a short time. The project-based approach really helped solidify the concepts. I'm now working on exciting data science problems daily."
                            }
                        ].map((testimonial, index) => (
                            <div key={index} className="break-inside-avoid mb-6 w-full bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-white hover:border-yellow-400/50 transition-all duration-500 group hover:-translate-y-2 shadow-xl shadow-blue-900/5 hover:shadow-2xl hover:shadow-yellow-500/10 transform-gpu relative z-10 overflow-hidden">
                                <div className="flex items-start mb-4">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        width={64}
                                        height={64}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-16 h-16 rounded-full border-4 border-white shadow-sm group-hover:border-yellow-400/50 transition-all duration-500 object-cover"
                                    />
                                    <div className="ml-4 flex-1">
                                        <h4 className="text-lg font-bold text-slate-900 tracking-tight">{testimonial.name}</h4>
                                        <p className="text-sm font-semibold text-slate-500">{testimonial.role}</p>
                                        <div className="flex items-center mt-2 bg-white/50 inline-flex px-2 py-0.5 rounded-full border border-white">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star key={i} size={12} className="fill-yellow-500 text-yellow-500" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed mb-4 italic font-medium">"{testimonial.review}"</p>
                                <div className="pt-4 border-t border-white/60">
                                    <span className="text-xs text-blue-500 font-bold uppercase tracking-wider">✓ Completed: {testimonial.course}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Stats Row */}
                    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { value: "100+", label: "Students Trained" },
                            { value: "100%", label: "Placement Rate" },
                            { value: "4.9/5", label: "Average Rating" },
                            { value: "75+", label: "Companies Hired" }
                        ].map((stat, i) => (
                            <div key={i} className="text-center p-6 bg-slate-50 rounded-xl border border-slate-200 hover:border-yellow-500/50 transition-all">
                                <h3 className="text-3xl font-bold text-slate-900 mb-2">{stat.value}</h3>
                                <p className="text-slate-400 text-sm">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* Certificates Section */}
            <section className="bg-slate-50 py-24 border-y border-slate-200/50">
                <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center max-w-7xl">
                    <div className="md:w-1/2 mb-12 md:mb-0 relative">
                        {/* Certificate Image Layout */}
                        <div className="relative z-10 flex items-center justify-center p-8">
                            <div className="relative transform hover:scale-105 transition-transform duration-500 group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                                <img src="/certificate.png" alt="Certificate" className="relative rounded-xl shadow-2xl w-full max-w-lg border-4 border-slate-200" />

                                {/* Enhanced Verified Badge */}
                                <div className="absolute -bottom-6 -right-6 bg-slate-100 p-4 rounded-xl shadow-xl flex items-center space-x-3 border border-slate-300 z-20 animate-bounce-slow">
                                    <div className="bg-blue-500/20 p-2 rounded-full">
                                        <Award className="text-blue-400" size={24} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-900">Verified Certificate</span>
                                        <span className="text-xs text-slate-400">Global ID: GQ-2026-AI</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Background Decoration */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 to-purple-900/20 transform scale-110 rounded-full opacity-50 blur-3xl -z-10"></div>
                    </div>
                    <div className="md:w-1/2 md:pl-20">
                        <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">Complete Courses & <br /><span className="text-blue-400">Earn Certificates</span></h2>
                        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                            Demonstrate your new skills and increase your value to potential employers with our verified certificates. Each course completion comes with a unique, shareable certificate.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start space-x-4 group">
                                <div className="bg-blue-500/20 p-2 rounded-lg mt-1 group-hover:bg-blue-600 transition-colors">
                                    <CheckCircle className="text-blue-400 group-hover:text-slate-900 transition-colors" size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-lg">Industry Recognized</h4>
                                    <p className="text-sm text-slate-400 mt-1">Our certificates are valued by top tech companies worldwide.</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4 group">
                                <div className="bg-green-500/20 p-2 rounded-lg mt-1 group-hover:bg-green-600 transition-colors">
                                    <CheckCircle className="text-green-400 group-hover:text-slate-900 transition-colors" size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-lg">Shareable on LinkedIn</h4>
                                    <p className="text-sm text-slate-400 mt-1">Add your achievements directly to your professional profile with one click.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* Comparison Table */}
            <section id="about" className="py-24 bg-slate-50 text-slate-900 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] opacity-20"></div>
                <div className="container mx-auto px-6 md:px-12 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Why Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">AI First LMS</span> is Different</h2>
                        <p className="text-slate-400 text-lg">See how we stack up against traditional learning methods.</p>
                    </div>

                    <div className="overflow-x-auto rounded-2xl shadow-2xl border border-slate-200">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/50">
                                    <th className="py-6 px-8 text-lg font-semibold border-b border-slate-200">Features</th>
                                    <th className="py-6 px-8 text-lg font-semibold text-slate-400 border-b border-slate-200">Typical E-Learning</th>
                                    <th className="py-6 px-8 text-lg font-bold text-blue-400 bg-blue-900/20 border-b border-blue-900/50 border-t-4 border-t-blue-500">GenQuantaa LMS</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-600">
                                {[
                                    { feature: "Instructor", typical: "Limited Availability", us: "AI Tutor (24/7)" },
                                    { feature: "Learning Path", typical: "One Size Fits All", us: "Personalized & Adaptive" },
                                    { feature: "Practical Practice", typical: "Setup Required", us: "In-Browser IDE" },
                                    { feature: "Feedback", typical: "Delayed / None", us: "Instant AI Feedback" },
                                    { feature: "Content", typical: "Static Videos", us: "Interactive & Dynamic" },
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-100/30 transition-colors">
                                        <td className="py-6 px-8 font-medium border-b border-slate-200">{row.feature}</td>
                                        <td className="py-6 px-8 border-b border-slate-200 text-slate-400">{row.typical}</td>
                                        <td className="py-6 px-8 bg-blue-900/10 border-b border-slate-200 font-bold text-slate-900 flex items-center">
                                            <CheckCircle size={16} className="text-green-400 mr-2" /> {row.us}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Blog Section */}
            <section id="blog" className="py-24 bg-slate-50 text-slate-900 relative">
                <div className="container mx-auto px-6 md:px-12 max-w-7xl">
                    <div className="text-center mb-16">
                        <span className="text-blue-400 font-bold uppercase tracking-wider text-sm mb-2 block">Latest Updates</span>
                        <h2 className="text-4xl font-bold mb-4">Our Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Insights</span></h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">Stay updated with the latest trends in AI, machine learning, and technology.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Generative AI in Healthcare: 2024 Trends & Breakthroughs",
                                date: "Dec 10, 2025",
                                category: "Healthcare AI",
                                image: "https://ismg-cdn.nyc3.cdn.digitaloceanspaces.com/articles/growing-prominence-generative-ai-in-health-care-showcase_image-4-a-22372.jpg",
                                desc: "Discover how Generative AI is revolutionizing diagnostics, drug discovery, and workflow automation in modern healthcare.",
                                link: "https://www.forbes.com/sites/bernardmarr/2024/10/03/the-10-biggest-trends-in-generative-ai-for-2025/"
                            },
                            {
                                title: "The Ultimate Guide to Starting a Career in AI in 2025",
                                date: "Nov 28, 2025",
                                category: "Career Guide",
                                image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                                desc: "Everything you need to know about the skills, certifications, and roadmap to land a high-paying job in Artificial Intelligence.",
                                link: "https://www.coursera.org/articles/how-to-start-a-career-in-ai"
                            },
                            {
                                title: "Introduction to Large Language Models (LLMs)",
                                date: "Dec 05, 2025",
                                category: "Technology",
                                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVDolGs4EaU8ILbhwFyszxBTWEgIcS_HEuyQ&s",
                                desc: "A deep dive into how LLMs like GPT-4 work, their transformer architecture, and their impact on the future of tech.",
                                link: "https://www.techtarget.com/whatis/definition/large-language-model-LLM"
                            }
                        ].map((post, i) => (
                            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all group flex flex-col h-full">
                                <div className="h-48 overflow-hidden relative">
                                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute top-4 left-4 bg-blue-600/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-900 uppercase tracking-wide">
                                        {post.category}
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="text-slate-400 text-xs font-bold uppercase tracking-wide mb-3">{post.date}</div>
                                    <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">{post.title}</h3>
                                    <p className="text-slate-400 text-sm mb-6 line-clamp-3">{post.desc}</p>
                                    <a href={post.link} target="_blank" rel="noopener noreferrer" className="mt-auto text-blue-400 font-bold text-sm flex items-center group-hover:underline">
                                        Read Article <ArrowRight size={14} className="ml-1" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-24 bg-white border-t border-slate-200">
                <div className="container mx-auto px-6 md:px-12 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
                        <div>
                            <span className="text-blue-400 font-bold uppercase tracking-wider text-sm mb-2 block">Get in Touch</span>
                            <h2 className="text-4xl font-bold text-slate-900 mb-6">Have Questions? <br />Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Connect</span></h2>
                            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                                Whether you're interested in our courses, partnership opportunities, or just want to say hello, we'd love to hear from you.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="bg-blue-500/10 p-3 rounded-xl">
                                        <Mail className="text-blue-400" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-slate-900 font-bold text-lg">Email Us</h4>
                                        <p className="text-slate-400">academy@genquantaa.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="bg-purple-500/10 p-3 rounded-xl">
                                        <Phone className="text-purple-400" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-slate-900 font-bold text-lg">Call Us</h4>
                                        <p className="text-slate-400">+91 7036955133</p>
                                        <p className="text-slate-400">Mon-Fri, 9am - 6pm</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="bg-emerald-500/10 p-3 rounded-xl">
                                        <Globe className="text-emerald-400" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-slate-900 font-bold text-lg">Visit Us</h4>
                                        <p className="text-slate-400">Hyderabad, India</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden">
                            {/* Decorative gradients */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10 transform -translate-x-1/2 translate-y-1/2"></div>

                            <form action="https://formsubmit.co/academy@genquantaa.com" method="POST" className="space-y-4 relative z-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400">First Name</label>
                                        <input type="text" name="First Name" className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" placeholder="John" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400">Last Name</label>
                                        <input type="text" name="Last Name" className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" placeholder="Doe" required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400">Email Address</label>
                                    <input type="email" name="email" className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" placeholder="john@example.com" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400">Subject</label>
                                    <select name="Subject" className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors">
                                        <option>General Inquiry</option>
                                        <option>Course Support</option>
                                        <option>Partnership</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400">Message</label>
                                    <textarea name="Message" rows={4} className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" placeholder="How can we help you?" required></textarea>
                                </div>
                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-slate-900 font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all transform hover:-translate-y-1">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section >



            {/* Footer */}
            {/* Footer - Redesigned & Interactive */}
            <footer className="relative bg-slate-50 text-slate-400 py-16 border-t border-slate-200 overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 blur-sm"></div>
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="container mx-auto px-6 md:px-12 flex flex-col items-center text-center relative z-10">
                    <div className="space-y-8 max-w-3xl">
                        {/* Logo Area */}
                        <div className="flex flex-col items-center justify-center space-y-4 group">
                            <div className="relative p-2">
                                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                <img src="/logo.png" alt="GenQuantaa Logo" className="h-12 relative z-10 transform group-hover:scale-105 transition-transform duration-500" />
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-base leading-relaxed text-slate-400 max-w-xl mx-auto hover:text-slate-400 transition-colors duration-300">
                            Empowering the next generation of AI developers with cutting-edge tools, personalized learning experiences, and world-class mentorship.
                        </p>



                        {/* Contact Info */}
                        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 pt-8 border-t border-slate-900 w-full">
                            <a href="mailto:academy@genquantaa.com" className="flex items-center space-x-3 text-slate-400 hover:text-blue-400 transition-all duration-300 group bg-white/50 px-5 py-3 rounded-full border border-slate-200/50 hover:border-blue-500/30">
                                <div className="p-2 bg-blue-500/10 rounded-full group-hover:bg-blue-500/20 transition-colors">
                                    <Mail size={18} className="text-blue-500" />
                                </div>
                                <span className="font-medium">academy@genquantaa.com</span>
                            </a>
                            <div className="flex items-center space-x-3 text-slate-400 bg-white/50 px-5 py-3 rounded-full border border-slate-200/50 hover:border-blue-500/30 transition-all duration-300 group cursor-default">
                                <div className="p-2 bg-blue-500/10 rounded-full group-hover:bg-blue-500/20 transition-colors">
                                    <Phone size={18} className="text-blue-500" />
                                </div>
                                <div className="flex flex-col text-left">
                                    <a href="tel:+917036951155" className="text-xs hover:text-blue-400 transition-colors font-medium">+91 7036951155</a>
                                    <a href="tel:+917036955133" className="text-xs hover:text-blue-400 transition-colors font-medium">+91 7036955133</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="container mx-auto px-6 md:px-12 mt-16 pt-8 border-t border-slate-900 text-center text-sm text-slate-600 flex justify-center items-center relative z-10">
                    <p className="hover:text-slate-400 transition-colors">&copy; 2026 GenQuantaa. All rights reserved.</p>
                </div>

                {/* Optional: 'Back to Top' Button (could be implemented if scroll logic added, for now just a decorative suggestion if user wanted interactivity) */}
                {/* <button className="absolute bottom-8 right-8 w-10 h-10 bg-blue-600 text-slate-900 rounded-full flex items-center justify-center shadow-lg hover:-translate-y-1 transition-transform animate-bounce-slow">
                    <ArrowUp size={20} />
                </button> */}
            </footer>

            {/* Registration Form Modal */}
            {
                showRegistrationForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-slate-800">Complete Your Registration</h2>
                                    <button
                                        onClick={() => setShowRegistrationForm(false)}
                                        className="text-slate-400 hover:text-slate-600 text-2xl"
                                    >
                                        ×
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-emerald-50 rounded-xl p-4">
                                        <h3 className="font-semibold text-slate-800 mb-2">{formData.course}</h3>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-bold text-slate-800">₹1</span>
                                            <span className="text-lg text-slate-400 line-through">₹1,799</span>
                                            <span className="bg-red-500 text-slate-900 text-xs px-2 py-1 rounded-full font-semibold">
                                                99% OFF
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-900"
                                                    placeholder="Enter your full name"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-900"
                                                    placeholder="Enter your email address"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-900"
                                                    placeholder="Enter your phone number"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            onClick={handlePayment}
                                            disabled={isProcessing}
                                            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-slate-900 font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-emerald-500/50 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none"
                                        >
                                            {isProcessing ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Processing...
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center gap-2">
                                                    <Lock className="w-5 h-5" />
                                                    Pay ₹1 & Enroll Now
                                                </div>
                                            )}
                                        </button>
                                        <p className="text-center text-slate-600 text-sm mt-3">
                                            Secure payment powered by Cashfree
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            {/* WhatsApp Floating Button */}

            {/* Video Modal */}
            {showVideoModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-50/90 backdrop-blur-sm transition-all duration-300">
                    <div className="relative w-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-300">
                        <button
                            onClick={() => setShowVideoModal(false)}
                            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-slate-900 transition-all backdrop-blur-md"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                        <div className="relative pt-[56.25%] bg-black">
                            <video
                                className="absolute inset-0 w-full h-full object-cover"
                                src="/Video.mp4"
                                title="Platform Introduction"
                                controls
                                autoPlay
                            >
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>
                </div>
            )}

            {/* WhatsApp Floating Button */}
            <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-slate-900 px-4 py-2 rounded-lg shadow-lg text-sm font-semibold animate-fade-in-out border border-blue-500 relative shadow-blue-500/30">
                    Chat with us now live
                    <div className="absolute top-1/2 -right-1 w-2 h-2 bg-indigo-600 transform -translate-y-1/2 rotate-45"></div>
                </div>
                <a
                    href="https://wa.me/917036955133"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 text-slate-900 p-4 rounded-full shadow-lg hover:bg-green-600 transition-all flex items-center justify-center animate-bounce-slow"
                    title="Chat with us on WhatsApp"
                >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-8 h-8" />
                </a>
            </div>
        </div >
    );
};

export default LandingPage;
