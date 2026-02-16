import React, { useState, useEffect } from 'react';

import { API_BASE_URL } from '../config';
import { Play, Search, BookOpen, Users, User, Medal as Award, Monitor, CheckCircle, ArrowRight, Star, Facebook, Twitter, Instagram, Linkedin, Mail, Brain, Globe, Shield, Phone, Lock, TrendingUp, Briefcase, Rocket } from 'lucide-react';

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

    const allCourses = [
        { id: 'python-ai-course', title: "Python Programming for AI", level: "Beginner", rating: "4.5 (1,247)", duration: "8 weeks", enrolled: "2.5k", price: "₹1,299", originalPrice: "₹1,799", discount: "28% OFF", desc: "Master the fundamentals of artificial intelligence with hands-on projects and real-world applications.", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80", color: "blue", status: "Active" },
        { id: 'ml-dl-course', title: "MACHINE LEARNING & DEEP LEARNING", level: "Advanced", rating: "4.7 (856)", duration: "8 weeks", enrolled: "2.5k", price: "₹1,799", originalPrice: "₹2,299", discount: "22% OFF", desc: "Take your artificial intelligence skills to the next level with advanced techniques and industry best practices.", image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80", color: "purple", status: "Active" },
        { id: 'neural-networks-course', title: "NEURAL NETWORKS & DEEP LEARNING", level: "Beginner", rating: "4.3 (2,134)", duration: "8 weeks", enrolled: "2.5k", price: "₹1,099", originalPrice: "₹1,599", discount: "31% OFF", desc: "Start your journey in artificial intelligence with this comprehensive beginner-friendly course.", image: "https://bernardmarr.com/img/Deep%20Learning%20Vs%20Neural%20Networks%20Whats%20The%20Difference.png", color: "red", status: "Active" },
        { id: 'nlp-course', title: "NATURAL LANGUAGE PROCESSING", level: "Intermediate", rating: "4.8 (645)", duration: "8 weeks", enrolled: "2.5k", price: "₹2,099", originalPrice: "₹2,599", discount: "19% OFF", desc: "Get certified in artificial intelligence with this industry-recognized professional certification course.", image: "https://cis.unimelb.edu.au/__data/assets/image/0009/4492962/NLP.jpg", color: "green", status: "Active" },
        { id: 'cv-course', title: "COMPUTER VISION", level: "All Level", rating: "4.9 (423)", duration: "8 weeks", enrolled: "2.5k", price: "₹2,499", originalPrice: "₹2,999", discount: "17% OFF", desc: "Join our exclusive masterclass and learn artificial intelligence from industry experts and leaders.", image: "https://d3lkc3n5th01x7.cloudfront.net/wp-content/uploads/2024/04/18095229/computer-vision-banner.png", color: "orange", status: "Active" },
        { id: 'agentic-ai-course', title: "AGENTIC AI", level: "Intermediate", rating: "4.6 (1,089)", duration: "8 weeks", enrolled: "2.5k", price: "₹1,599", originalPrice: "₹2,099", discount: "24% OFF", desc: "Learn artificial intelligence through real-world projects and build an impressive portfolio.", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=1632&q=80", color: "pink", status: "Active" },
        { id: 'gen-ai-course', title: "Generative AI", level: "Intermediate", rating: "4.6 (1,089)", duration: "8 weeks", enrolled: "2.5k", price: "₹1,999", originalPrice: "₹2,199", discount: "9% OFF", desc: "Learn artificial intelligence through real-world projects and build an impressive portfolio.", image: "https://images.unsplash.com/photo-1676299081847-824916de030a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1632&q=80", color: "indigo", status: "Active" },
        { id: 'ai-risk-course', title: "AI Risk Curriculum", level: "Intermediate", rating: "4.6 (1,089)", duration: "8 weeks", enrolled: "2.5k", price: "₹1,999", originalPrice: "₹2,199", discount: "9% OFF", desc: "Learn advance artificial intelligence through real-world projects and build an impressive portfolio.", image: "https://www.invensislearning.com/blog/wp-content/uploads/2025/09/future-of-ai-in-risk-management-696x392.jpg", color: "red", status: "Active" },
        { id: 'ai-cybersecurity-course', title: "AI in Cybersecurity Course Curriculum", level: "Intermediate", rating: "4.6 (1,089)", duration: "8 weeks", enrolled: "2.5k", price: "₹1,999", originalPrice: "₹2,199", discount: "9% OFF", desc: "Learn advance artificial intelligence through real-world projects and build an impressive portfolio.", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80", color: "red", status: "Active" },
        { id: 'csv-course', title: "Computerized System Validation (CSV)", level: "Intermediate", rating: "4.6 (1,089)", duration: "8 weeks", enrolled: "2.5k", price: "₹1,999", originalPrice: "₹2,199", discount: "9% OFF", desc: "Ensure compliance and validation in regulated industries.", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80", color: "blue", status: "Active" },
        { id: 'med-writing-course', title: "Medical Writing, Regulatory Writing & Scientific Writing", level: "Intermediate", rating: "4.6 (1,089)", duration: "8 weeks", enrolled: "2.5k", price: "₹1,999", originalPrice: "₹2,199", discount: "9% OFF", desc: "Professional scientific writing for healthcare and pharma.", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80", color: "green", status: "Active" },
        { id: 'ai-healthcare-course', title: "Artificial Intelligence in Healthcare", level: "Intermediate", rating: "4.6 (1,089)", duration: "8 weeks", enrolled: "2.5k", price: "₹1,999", originalPrice: "₹2,199", discount: "9% OFF", desc: "Transform patient care with Artificial Intelligence.", image: "https://aihms.in/blog/wp-content/uploads/2020/05/ai1.jpg", color: "teal", status: "Active" },
        { id: 'lifesciences-ai-course', title: "Transforming Lifesciences with AI", level: "Intermediate", rating: "4.6 (1,089)", duration: "8 weeks", enrolled: "2.5k", price: "₹1,999", originalPrice: "₹2,199", discount: "9% OFF", desc: "Accelerate discovery and delivery in life sciences.", image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80", color: "purple", status: "Active" },
        { id: 'ai-medical-coding-course', title: "AI in Medical Coding", level: "Intermediate", rating: "4.6 (1,089)", duration: "8 weeks", enrolled: "2.5k", price: "₹1,999", originalPrice: "₹2,199", discount: "9% OFF", desc: "Automate and optimize medical coding processes.", image: "https://cdn.prod.website-files.com/61d48f722324914c384ef59a/66e1e03566afe79172867bbc_16_%20The%20Role%20of%20AI%20in%20Modern%20Medical%20Coding%20and%20Notes%20Review.jpg", color: "blue", status: "Active" },
        { id: 'pharma-gen-ai-course', title: "Generative AI, Agentic AI, and Ethical AI in Pharma", level: "Intermediate", rating: "4.6 (1,089)", duration: "8 weeks", enrolled: "2.5k", price: "₹1,999", originalPrice: "₹2,199", discount: "9% OFF", desc: "Revolutionize drug discovery and pharma operations.", image: "https://www.nagarro.com/hubfs/Agentic%20AI%20in%20healthcare%20mobile-1.png", color: "indigo", status: "Active" },
    ];

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

            const cashfree = new window.Cashfree({ mode: "sandbox" });
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

    useEffect(() => {
        if (searchTerm) {
            const coursesSection = document.getElementById('courses');
            if (coursesSection) {
                coursesSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [searchTerm]);

    return (
        <div className="min-h-screen bg-slate-950 font-sans text-slate-300 selection:bg-blue-500/30">
            {/* Navbar */}
            <nav id="home" className="flex justify-between items-center px-6 md:px-12 py-5 bg-slate-950/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-slate-800/50">
                <div className="flex items-center space-x-2">
                    <img src="/logo.png" alt="Genesys Quantis Logo" className="h-10" />
                </div>
                <div className="hidden md:flex space-x-10 text-slate-400 font-medium text-sm">
                    <a href="#home" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">Home</a>
                    <a href="#about" className="hover:text-blue-400 transition-colors">About</a>
                    <a href="#courses" className="hover:text-blue-400 transition-colors">Courses</a>
                    <a href="#blog" className="hover:text-blue-400 transition-colors">Blog</a>
                    <a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative hidden lg:block group">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Search for courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-slate-800 w-64 text-sm transition-all text-slate-200 placeholder-slate-600"
                        />
                    </div>
                    <button
                        onClick={onStart}
                        className="text-slate-300 font-bold hover:text-white px-4 py-2 text-sm transition-colors"
                    >
                        Login
                    </button>

                </div>
            </nav>

            {/* Course Navigation Strip */}
            <div className="bg-slate-900 border-b border-slate-800 sticky top-[80px] z-40 shadow-md overflow-hidden" style={{ top: '78px' }}>
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
                <div className="flex animate-marquee py-3 items-center">
                    {/* First Copy */}
                    <div className="flex items-center space-x-12 px-6">
                        {allCourses.map((course) => (
                            <button
                                key={`orig-${course.id}`}
                                onClick={() => onCourseClick(course.id)}
                                className="text-slate-400 hover:text-white text-xs font-bold transition-colors uppercase tracking-wider hover:text-blue-400 whitespace-nowrap"
                            >
                                {course.title.replace('Course', '').replace('Curriculum', '').trim()}
                            </button>
                        ))}
                    </div>
                    {/* Second Copy for Infinite Loop */}
                    <div className="flex items-center space-x-12 px-6">
                        {allCourses.map((course) => (
                            <button
                                key={`copy-${course.id}`}
                                onClick={() => onCourseClick(course.id)}
                                className="text-slate-400 hover:text-white text-xs font-bold transition-colors uppercase tracking-wider hover:text-blue-400 whitespace-nowrap"
                            >
                                {course.title.replace('Course', '').replace('Curriculum', '').trim()}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <header className="container mx-auto px-6 md:px-12 py-12 md:py-20 flex flex-col md:flex-row items-center justify-between overflow-hidden max-w-7xl">
                <div className="md:w-1/2 space-y-8 animate-fadeIn z-10">
                    {/* 3 Year Anniversary Banner - Theme Matched */}
                    <div className="relative mb-6">
                        <div className="bg-gradient-to-r from-slate-900 to-slate-950 border border-orange-500/30 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
                            {/* Subtle Background Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-red-500/5"></div>

                            {/* Content */}
                            <div className="relative z-10">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                    {/* Left Side - Message */}
                                    <div className="flex-1 text-center md:text-left">
                                        {/* Badge */}
                                        <div className="inline-flex items-center bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1 rounded-full mb-3">
                                            <Star className="text-white fill-white mr-1" size={12} />
                                            <span className="text-white font-bold text-xs uppercase tracking-wider">Limited Time Offer</span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                                            Celebrating <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">3 Years</span> of Excellence!
                                        </h3>

                                        {/* Subtitle */}
                                        <p className="text-slate-400 text-sm">
                                            Thank you for being part of our journey
                                        </p>
                                    </div>

                                    {/* Right Side - Discount */}
                                    <div className="flex items-center gap-4">
                                        {/* Discount Badge */}
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                                            <div className="relative bg-gradient-to-r from-orange-500 to-red-600 px-6 py-3 rounded-xl">
                                                <div className="text-center">
                                                    <div className="text-4xl md:text-5xl font-black text-white">89%</div>
                                                    <div className="text-white/90 font-semibold text-xs uppercase tracking-wide">Discount</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="hidden md:block">
                                            <div className="text-white font-bold text-sm mb-1">On All Courses</div>
                                            <div className="flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                                                <span className="text-orange-400 text-xs font-medium">Enrolled students only</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Subtle Corner Accent */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-bl-full"></div>
                        </div>
                    </div>

                    <div className="inline-flex items-center space-x-2 bg-slate-900/50 text-blue-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase border border-slate-800 backdrop-blur-sm">
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                        <span>Start Learning Today</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
                        Virtual AI -<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-x">University at your home</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 max-w-lg leading-relaxed">
                        Learn directly from AI industry experts with over 14 years of global MNC experience. Embracing AI now is the key to securing your career in today's competitive job market.
                    </p>


                    <div className="flex space-x-8 md:space-x-12 py-4 border-t border-slate-800/50 pt-8">
                        <div className="group cursor-default">
                            <h3 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 group-hover:from-blue-300 group-hover:to-purple-300 transition-all">20+</h3>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1 group-hover:text-slate-400 transition-colors">1-1 Mentors</p>
                        </div>
                        <div className="group cursor-default">
                            <h3 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 group-hover:from-green-300 group-hover:to-emerald-300 transition-all">100+</h3>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1 group-hover:text-slate-400 transition-colors">Active Students</p>
                        </div>
                        <div className="group cursor-default">
                            <h3 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 group-hover:from-yellow-300 group-hover:to-orange-300 transition-all">4.8/5</h3>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1 group-hover:text-slate-400 transition-colors">Average Rating</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        <button
                            onClick={onStart}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-900/30 hover:shadow-blue-500/50 flex items-center justify-center group"
                        >
                            Get Started <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                        </button>
                        <button onClick={() => setShowVideoModal(true)} className="bg-slate-900 text-slate-300 border border-slate-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-800 hover:border-slate-600 hover:text-white transition-all flex items-center justify-center shadow-lg hover:shadow-slate-700/50 group">
                            <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center mr-3 group-hover:bg-slate-700 transition-colors border border-slate-700">
                                <Play className="fill-slate-300 text-slate-300 ml-1 group-hover:fill-white group-hover:text-white" size={14} />
                            </div>
                            Watch Video
                        </button>
                    </div>
                </div>

                <div className="md:w-1/2 mt-16 md:mt-0 relative">
                    {/* Abstract Background Shapes */}
                    <div className="absolute top-0 right-0 bg-yellow-300 w-64 h-64 rounded-full opacity-20 blur-3xl mix-blend-multiply animate-blob"></div>
                    <div className="absolute bottom-0 left-10 bg-blue-400 w-72 h-72 rounded-full opacity-20 blur-3xl mix-blend-multiply animate-blob animation-delay-2000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-purple-300 w-64 h-64 rounded-full opacity-20 blur-3xl mix-blend-multiply animate-blob animation-delay-4000"></div>

                    <div className="relative z-10">
                        <img
                            src="/hero-image.webp"
                            alt="Student holding books"
                            className="w-full max-w-md mx-auto rounded-[2.5rem] shadow-2xl transform hover:scale-[1.02] transition-transform duration-500 border-8 border-white"
                        />

                        {/* Floating Cards */}
                        <div className="absolute top-48 md:top-12 -left-4 md:left-0 bg-white p-4 rounded-2xl shadow-xl z-20 animate-bounce-slow border border-gray-50">
                            <div className="flex items-center space-x-3">
                                <div className="bg-green-100 p-2.5 rounded-xl">
                                    <CheckCircle className="text-green-600" size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Course Completed</p>
                                    <p className="font-bold text-gray-800 text-sm">100+</p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-20 -right-4 md:right-0 bg-white p-4 rounded-2xl shadow-xl z-20 animate-bounce-slow animation-delay-1000 border border-gray-50">
                            <div className="flex items-center space-x-3">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 overflow-hidden`}>
                                            <img src={`https://randomuser.me/api/portraits/men/${i * 10}.jpg`} alt="User" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium"></p>
                                    <p className="font-bold text-gray-800 text-sm">Join Now</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Stats Section */}
            <section className="bg-slate-950 py-16 border-y border-slate-800/50">
                <div className="container mx-auto px-6 md:px-12 max-w-7xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        {[
                            { icon: Monitor, label: "Trending Online Courses", value: "25+", color: "text-orange-400", bg: "bg-orange-500/10" },
                            { icon: Users, label: "Expert Tutors", value: "20+", color: "text-blue-400", bg: "bg-blue-500/10" },
                            { icon: BookOpen, label: "Active Students", value: "100+", color: "text-purple-400", bg: "bg-purple-500/10" },
                            { icon: Award, label: "Certified Courses", value: "300+", color: "text-green-400", bg: "bg-green-500/10" },
                        ].map((stat, index) => (
                            <div key={index} className="bg-slate-900 p-4 md:p-6 rounded-2xl shadow-lg border border-slate-800 flex flex-col md:flex-row items-center md:space-x-4 space-y-3 md:space-y-0 text-center md:text-left hover:shadow-xl transition-all hover:-translate-y-1 group">
                                <div className={`p-3 md:p-4 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <stat.icon size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl md:text-2xl font-bold text-white">{stat.value}</h3>
                                    <p className="text-slate-400 font-medium text-xs md:text-sm">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Course Categories Section - Moved Above Popular Courses */}
            <section className="py-24 bg-slate-900 border-y border-slate-800/50">
                <div className="container mx-auto px-6 md:px-12 max-w-7xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Explore Courses by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Category</span></h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">Find the perfect course for your learning goals</p>
                    </div>

                    {/* Attractive Table */}
                    <div className="overflow-x-auto rounded-2xl border border-slate-800 shadow-2xl">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-950">
                                    <th className="py-6 px-8 text-left border-b-2 border-orange-500 bg-gradient-to-br from-orange-500/20 to-transparent">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                                                <TrendingUp className="text-white" size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white">Trending Skills</h3>
                                                <p className="text-xs text-orange-400 font-semibold">Most In-Demand</p>
                                            </div>
                                        </div>
                                    </th>
                                    <th className="py-6 px-8 text-left border-b-2 border-blue-500 bg-gradient-to-br from-blue-500/20 to-transparent">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                                                <Briefcase className="text-white" size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white">Bootcamp Programs</h3>
                                                <p className="text-xs text-blue-400 font-semibold">Intensive Learning</p>
                                            </div>
                                        </div>
                                    </th>
                                    <th className="py-6 px-8 text-left border-b-2 border-purple-500 bg-gradient-to-br from-purple-500/20 to-transparent">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                                <Rocket className="text-white" size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white">Skill Boosters</h3>
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
                                    <tr key={index} className="border-b border-slate-800 hover:bg-slate-800/30 transition-all">
                                        <td className="py-5 px-8 border-r border-slate-800/50">
                                            <button
                                                onClick={() => onCourseClick(row.trending.id)}
                                                className="flex items-center space-x-3 w-full text-left group"
                                            >
                                                <div className="w-8 h-8 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-400 font-bold text-sm border border-orange-500/30 group-hover:bg-orange-500 group-hover:text-white transition-all">
                                                    {index + 1}
                                                </div>
                                                <span className="text-slate-300 group-hover:text-orange-400 transition-colors font-medium group-hover:translate-x-1 transition-transform">
                                                    {row.trending.name}
                                                </span>
                                                <ArrowRight size={16} className="text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                                            </button>
                                        </td>
                                        <td className="py-5 px-8 border-r border-slate-800/50">
                                            <button
                                                onClick={() => onCourseClick(row.bootcamp.id)}
                                                className="flex items-center space-x-3 w-full text-left group"
                                            >
                                                <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 font-bold text-sm border border-blue-500/30 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                                    {index + 1}
                                                </div>
                                                <span className="text-slate-300 group-hover:text-blue-400 transition-colors font-medium group-hover:translate-x-1 transition-transform">
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
                                                <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-400 font-bold text-sm border border-purple-500/30 group-hover:bg-purple-500 group-hover:text-white transition-all">
                                                    {index + 1}
                                                </div>
                                                <span className="text-slate-300 group-hover:text-purple-400 transition-colors font-medium group-hover:translate-x-1 transition-transform">
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
                    <div className="grid grid-cols-3 gap-6 mt-8">
                        <div className="bg-slate-950 border border-orange-500/30 rounded-xl p-4 text-center hover:border-orange-500 transition-all">
                            <div className="text-2xl font-bold text-orange-400 mb-1">3</div>
                            <div className="text-xs text-slate-400 uppercase tracking-wide">Trending Courses</div>
                        </div>
                        <div className="bg-slate-950 border border-blue-500/30 rounded-xl p-4 text-center hover:border-blue-500 transition-all">
                            <div className="text-2xl font-bold text-blue-400 mb-1">3</div>
                            <div className="text-xs text-slate-400 uppercase tracking-wide">Bootcamp Programs</div>
                        </div>
                        <div className="bg-slate-950 border border-purple-500/30 rounded-xl p-4 text-center hover:border-purple-500 transition-all">
                            <div className="text-2xl font-bold text-purple-400 mb-1">3</div>
                            <div className="text-xs text-slate-400 uppercase tracking-wide">Skill Boosters</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Our Platform - Redesigned */}
            <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-300 rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/20">
                            <Monitor className="mr-2 text-white" size={16} />
                            <span className="text-white text-sm font-semibold uppercase tracking-wider">Next-Generation Learning Platform</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                            Why Choose Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">Platform?</span>
                        </h2>
                        <p className="text-blue-100 max-w-3xl mx-auto text-lg leading-relaxed">
                            Experience revolutionary online education powered by AI, backed by industry experts, and trusted by professionals worldwide
                        </p>
                    </div>

                    {/* Feature Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {[
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
                                className="group relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-white/20"
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
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors">
                                        {feature.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-blue-100 text-sm mb-4 leading-relaxed">
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
                        <div className="inline-flex items-center gap-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-8 py-4">
                            <div>
                                <div className="text-3xl font-bold text-white">100+</div>
                                <div className="text-blue-200 text-sm">Students</div>
                            </div>
                            <div className="w-px h-12 bg-white/20"></div>
                            <div>
                                <div className="text-3xl font-bold text-white">3+</div>
                                <div className="text-blue-200 text-sm">Countries</div>
                            </div>
                            <div className="w-px h-12 bg-white/20"></div>
                            <div>
                                <div className="text-3xl font-bold text-white">4.9/5</div>
                                <div className="text-blue-200 text-sm">Average Rating</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Career Growth Showcase Section */}
            <section className="py-24 bg-slate-950 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(148 163 184) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                </div>

                <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 px-4 py-2 rounded-full mb-6">
                            <TrendingUp className="mr-2 text-green-400" size={16} />
                            <span className="text-green-400 text-sm font-semibold uppercase tracking-wider">Success Stories</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                            Transform Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">Career Path</span>
                        </h2>
                        <p className="text-slate-400 max-w-3xl mx-auto text-lg leading-relaxed">
                            See how our students have accelerated their careers with measurable growth in roles, skills, and compensation
                        </p>
                    </div>

                    {/* Career Growth Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {[
                            {
                                label: "Average Salary Increase",
                                value: "156%",
                                subtext: "Within 12 months",
                                color: "from-green-400 to-emerald-500",
                                bgColor: "from-green-500/20 to-emerald-500/20",
                                icon: TrendingUp
                            },
                            {
                                label: "Average Career Advancement",
                                value: "92%",
                                subtext: "Got promoted or switched",
                                color: "from-blue-400 to-cyan-500",
                                bgColor: "from-blue-500/20 to-cyan-500/20",
                                icon: Rocket
                            },
                            {
                                label: "Skill Mastery Time",
                                value: "6 Mo - 1year",
                                subtext: "To production-ready",
                                color: "from-purple-400 to-pink-500",
                                bgColor: "from-purple-500/20 to-pink-500/20",
                                icon: Brain
                            }
                        ].map((stat, index) => (
                            <div key={index} className="group relative bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-slate-700 transition-all hover:-translate-y-2 hover:shadow-2xl">
                                {/* Background Gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}></div>

                                <div className="relative z-10">
                                    {/* Icon */}
                                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <stat.icon className="text-white" size={24} />
                                    </div>

                                    {/* Value */}
                                    <div className={`text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r ${stat.color} mb-2`}>
                                        {stat.value}
                                    </div>

                                    {/* Label */}
                                    <div className="text-white font-bold text-lg mb-1">{stat.label}</div>
                                    <div className="text-slate-400 text-sm">{stat.subtext}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Career Path Timeline */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 md:p-12">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
                            Average Student Career Journey
                        </h3>

                        {/* Timeline */}
                        <div className="relative">
                            {/* Progress Line */}
                            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 via-yellow-500 via-green-500 to-emerald-500 transform -translate-y-1/2 hidden md:block"></div>

                            {/* Timeline Items */}
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4 relative">
                                {[
                                    {
                                        month: "Month 0",
                                        role: "Starting Point",
                                        salary: "₹3.5L",
                                        status: "Junior/Entry Level",
                                        color: "red",
                                        skills: ["Basics"]
                                    },
                                    {
                                        month: "Month 3",
                                        role: "Learning Phase",
                                        salary: "₹5L",
                                        status: "Skill Building",
                                        color: "orange",
                                        skills: ["Intermediate"]
                                    },
                                    {
                                        month: "Month 6",
                                        role: "Junior Developer",
                                        salary: "₹10L",
                                        status: "First Role Switch",
                                        color: "yellow",
                                        skills: ["Advanced"]
                                    },
                                    {
                                        month: "Month 9",
                                        role: "Mid-Level Dev",
                                        salary: "₹18L",
                                        status: "Promotion",
                                        color: "green",
                                        skills: ["Expert"]
                                    },
                                    {
                                        month: "Month 12",
                                        role: "Senior Developer",
                                        salary: "₹30L+",
                                        status: "Career Goal Achieved",
                                        color: "emerald",
                                        skills: ["Mastery"]
                                    }
                                ].map((milestone, index) => (
                                    <div key={index} className="relative">
                                        {/* Connector Dot */}
                                        <div className={`hidden md:flex w-6 h-6 rounded-full bg-${milestone.color}-500 border-4 border-slate-950 mx-auto mb-16 relative z-10 ring-4 ring-${milestone.color}-500/20`}></div>

                                        {/* Card */}
                                        <div className={`bg-slate-800/50 backdrop-blur-sm border border-${milestone.color}-500/30 rounded-xl p-4 hover:border-${milestone.color}-500/50 transition-all group hover:-translate-y-1`}>
                                            <div className={`text-${milestone.color}-400 font-bold text-sm mb-2`}>{milestone.month}</div>
                                            <div className="text-white font-bold text-lg mb-1">{milestone.role}</div>
                                            <div className={`text-${milestone.color}-300 font-semibold text-xl mb-2`}>{milestone.salary}</div>
                                            <div className="text-slate-400 text-xs mb-2">{milestone.status}</div>
                                            <div className="flex flex-wrap gap-1">
                                                {milestone.skills.map((skill, i) => (
                                                    <span key={i} className={`text-xs px-2 py-0.5 bg-${milestone.color}-500/20 text-${milestone.color}-400 rounded-full`}>
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
                            <h3 className="text-2xl font-bold text-white mb-2">Ready to Start Your Journey?</h3>
                            <p className="text-slate-400 mb-6">Join thousands of students transforming their careers</p>
                            <button
                                onClick={onStart}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-green-400 hover:to-emerald-500 transition-all shadow-lg shadow-green-900/30 hover:shadow-green-500/50 flex items-center group"
                            >
                                Explore Courses
                                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Courses */}

            <section id="courses" className="py-24 container mx-auto px-6 md:px-12 bg-slate-950 max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Most Popular Courses</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">Choose from our wide range of courses from expert organizations.</p>

                    {/* Category Buttons Removed */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {filteredCourses.map((course, index) => (
                        <div key={index} className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-800 hover:shadow-2xl hover:shadow-blue-900/20 transition-all transform hover:-translate-y-2 group flex flex-col h-full">
                            <div className="relative h-56 bg-slate-800 overflow-hidden">
                                <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className={`absolute top-4 left-4 bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-${course.color}-400 shadow-sm uppercase tracking-wide border border-slate-700`}>{course.level}</div>
                                <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-white flex items-center border border-white/10">
                                    <Play size={10} className="mr-1 fill-white" /> {course.duration}
                                </div>
                            </div>
                            <div className="p-8 flex-1 flex flex-col">
                                <div className="flex justify-between items-center mb-3">
                                    <span className={`text-xs font-bold text-${course.color}-400 bg-${course.color}-500/10 px-2 py-1 rounded uppercase tracking-wide border border-${course.color}-500/20`}>{course.level}</span>
                                    <div className="flex items-center text-amber-400 text-sm font-bold">
                                        <Star size={14} className="fill-current mr-1" /> {course.rating}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">{course.title}</h3>
                                <p className="text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed">{course.desc}</p>

                                <div className="mt-auto pt-6 border-t border-slate-800 flex items-center justify-between">
                                    <div>
                                        <span className="text-2xl font-bold text-white">{course.price}</span>
                                        <span className="text-slate-600 text-sm line-through ml-2">{course.originalPrice}</span>
                                        <span className="block text-xs text-green-400 font-bold mt-1">{course.discount}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={course.status === "Active" ? () => onCourseClick((course as any).id || 'python-ai-course') : undefined}
                                            disabled={course.status !== "Active"}
                                            className={`px-4 py-2.5 rounded-lg font-bold transition-all shadow-md transform ${course.status === "Active" ? 'hover:-translate-y-0.5 bg-blue-600 text-white hover:bg-blue-500 hover:shadow-lg' : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'} text-xs uppercase tracking-wide`}
                                        >
                                            {course.status === "Active" ? "Learn More" : "Upcoming"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>




            {/* Live Projects Section */}
            <section className="py-24 bg-slate-950 border-y border-slate-800/50">
                <div className="container mx-auto px-6 md:px-12 max-w-7xl">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase border border-emerald-500/20 backdrop-blur-sm mb-4">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            <span>Real-World Experience</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Projects We're <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Working On</span></h2>
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
                            <div key={index} className={`bg-slate-900 rounded-2xl p-6 border border-${project.color}-500/20 hover:border-${project.color}-500/50 transition-all group hover:-translate-y-2 hover:shadow-2xl hover:shadow-${project.color}-500/10`}>
                                <div className="flex items-start justify-between mb-4">
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full bg-${project.color}-500/10 text-${project.color}-400 border border-${project.color}-500/20`}>
                                        {project.category}
                                    </span>
                                    <div className="flex items-center space-x-1">
                                        <div className={`w-2 h-2 bg-${project.color}-500 rounded-full animate-pulse`}></div>
                                        <span className="text-xs text-slate-400">{project.status}</span>
                                    </div>
                                </div>
                                <h3 className={`text-xl font-bold text-white mb-3 group-hover:text-${project.color}-400 transition-colors`}>
                                    {project.title}
                                </h3>
                                <p className="text-slate-400 text-sm mb-4 leading-relaxed">{project.description}</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.tech.map((tech, i) => (
                                        <span key={i} className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                                    <div className="flex items-center space-x-2">
                                        <Users size={16} className={`text-${project.color}-400`} />
                                        <span className="text-sm text-slate-400">{project.participants} Students</span>
                                    </div>
                                    <button className={`text-${project.color}-400 text-sm font-bold hover:underline`}>
                                        Join Project →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Previous Trainees Section */}
            <section className="py-24 bg-slate-900 border-y border-slate-800/50">
                <div className="container mx-auto px-6 md:px-12 max-w-7xl">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center space-x-2 bg-yellow-500/10 text-yellow-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase border border-yellow-500/20 backdrop-blur-sm mb-4">
                            <Star className="fill-yellow-400" size={12} />
                            <span>Success Stories</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Alumni</span> Say</h2>
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
                            <div key={index} className="break-inside-avoid mb-6 w-full bg-slate-950 rounded-2xl p-6 border border-slate-800 hover:border-yellow-500/50 transition-all group hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-500/10 transform-gpu relative z-10 overflow-hidden">
                                <div className="flex items-start mb-4">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        width={64}
                                        height={64}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-16 h-16 rounded-full border-4 border-slate-800 group-hover:border-yellow-500/50 transition-all object-cover"
                                    />
                                    <div className="ml-4 flex-1">
                                        <h4 className="text-lg font-bold text-white">{testimonial.name}</h4>
                                        <p className="text-sm text-slate-400">{testimonial.role}</p>
                                        <div className="flex items-center mt-2">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-slate-300 text-sm leading-relaxed mb-4 italic">"{testimonial.review}"</p>
                                <div className="pt-4 border-t border-slate-800">
                                    <span className="text-xs text-blue-400 font-semibold">✓ Completed: {testimonial.course}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Stats Row */}
                    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { value: "100+", label: "Students Trained" },
                            { value: "98%", label: "Success Rate" },
                            { value: "4.9/5", label: "Average Rating" },
                            { value: "75+", label: "Companies Hired" }
                        ].map((stat, i) => (
                            <div key={i} className="text-center p-6 bg-slate-950 rounded-xl border border-slate-800 hover:border-yellow-500/50 transition-all">
                                <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
                                <p className="text-slate-400 text-sm">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* Certificates Section */}
            <section className="bg-slate-950 py-24 border-y border-slate-800/50">
                <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center max-w-7xl">
                    <div className="md:w-1/2 mb-12 md:mb-0 relative">
                        {/* Certificate Image Layout */}
                        <div className="relative z-10 flex items-center justify-center p-8">
                            <div className="relative transform hover:scale-105 transition-transform duration-500 group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                                <img src="/certificate.png" alt="Certificate" className="relative rounded-xl shadow-2xl w-full max-w-lg border-4 border-slate-800" />

                                {/* Enhanced Verified Badge */}
                                <div className="absolute -bottom-6 -right-6 bg-slate-800 p-4 rounded-xl shadow-xl flex items-center space-x-3 border border-slate-700 z-20 animate-bounce-slow">
                                    <div className="bg-blue-500/20 p-2 rounded-full">
                                        <Award className="text-blue-400" size={24} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white">Verified Certificate</span>
                                        <span className="text-xs text-slate-400">Global ID: GQ-2026-AI</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Background Decoration */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 to-purple-900/20 transform scale-110 rounded-full opacity-50 blur-3xl -z-10"></div>
                    </div>
                    <div className="md:w-1/2 md:pl-20">
                        <h2 className="text-4xl font-bold text-white mb-6 leading-tight">Complete Courses & <br /><span className="text-blue-400">Earn Certificates</span></h2>
                        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                            Demonstrate your new skills and increase your value to potential employers with our verified certificates. Each course completion comes with a unique, shareable certificate.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start space-x-4 group">
                                <div className="bg-blue-500/20 p-2 rounded-lg mt-1 group-hover:bg-blue-600 transition-colors">
                                    <CheckCircle className="text-blue-400 group-hover:text-white transition-colors" size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-lg">Industry Recognized</h4>
                                    <p className="text-sm text-slate-500 mt-1">Our certificates are valued by top tech companies worldwide.</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4 group">
                                <div className="bg-green-500/20 p-2 rounded-lg mt-1 group-hover:bg-green-600 transition-colors">
                                    <CheckCircle className="text-green-400 group-hover:text-white transition-colors" size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-lg">Shareable on LinkedIn</h4>
                                    <p className="text-sm text-slate-500 mt-1">Add your achievements directly to your professional profile with one click.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* Comparison Table */}
            <section className="py-24 bg-slate-950 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="container mx-auto px-6 md:px-12 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Why Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">AI First LMS</span> is Different</h2>
                        <p className="text-slate-400 text-lg">See how we stack up against traditional learning methods.</p>
                    </div>

                    <div className="overflow-x-auto rounded-2xl shadow-2xl border border-slate-800">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-900/50">
                                    <th className="py-6 px-8 text-lg font-semibold border-b border-slate-800">Features</th>
                                    <th className="py-6 px-8 text-lg font-semibold text-slate-400 border-b border-slate-800">Typical E-Learning</th>
                                    <th className="py-6 px-8 text-lg font-bold text-blue-400 bg-blue-900/20 border-b border-blue-900/50 border-t-4 border-t-blue-500">Genesys Quantis LMS</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-300">
                                {[
                                    { feature: "Instructor", typical: "Limited Availability", us: "AI Tutor (24/7)" },
                                    { feature: "Learning Path", typical: "One Size Fits All", us: "Personalized & Adaptive" },
                                    { feature: "Practical Practice", typical: "Setup Required", us: "In-Browser IDE" },
                                    { feature: "Feedback", typical: "Delayed / None", us: "Instant AI Feedback" },
                                    { feature: "Content", typical: "Static Videos", us: "Interactive & Dynamic" },
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="py-6 px-8 font-medium border-b border-slate-800">{row.feature}</td>
                                        <td className="py-6 px-8 border-b border-slate-800 text-slate-500">{row.typical}</td>
                                        <td className="py-6 px-8 bg-blue-900/10 border-b border-slate-800 font-bold text-white flex items-center">
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
            <section id="blog" className="py-24 bg-slate-950 text-white relative">
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
                            <div key={i} className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-700 transition-all group flex flex-col h-full">
                                <div className="h-48 overflow-hidden relative">
                                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute top-4 left-4 bg-blue-600/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wide">
                                        {post.category}
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-3">{post.date}</div>
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
            <section id="contact" className="py-24 bg-slate-900 border-t border-slate-800">
                <div className="container mx-auto px-6 md:px-12 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
                        <div>
                            <span className="text-blue-400 font-bold uppercase tracking-wider text-sm mb-2 block">Get in Touch</span>
                            <h2 className="text-4xl font-bold text-white mb-6">Have Questions? <br />Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Connect</span></h2>
                            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                                Whether you're interested in our courses, partnership opportunities, or just want to say hello, we'd love to hear from you.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="bg-blue-500/10 p-3 rounded-xl">
                                        <Mail className="text-blue-400" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg">Email Us</h4>
                                        <p className="text-slate-500">contact@genesysquantis.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="bg-purple-500/10 p-3 rounded-xl">
                                        <Phone className="text-purple-400" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg">Call Us</h4>
                                        <p className="text-slate-500">+91 7036955133</p>
                                        <p className="text-slate-500">Mon-Fri, 9am - 6pm</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="bg-emerald-500/10 p-3 rounded-xl">
                                        <Globe className="text-emerald-400" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg">Visit Us</h4>
                                        <p className="text-slate-500">Hyderabad, India</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
                            {/* Decorative gradients */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10 transform -translate-x-1/2 translate-y-1/2"></div>

                            <form className="space-y-4 relative z-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400">First Name</label>
                                        <input type="text" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" placeholder="John" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400">Last Name</label>
                                        <input type="text" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" placeholder="Doe" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400">Email Address</label>
                                    <input type="email" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" placeholder="john@example.com" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400">Subject</label>
                                    <select className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors">
                                        <option>General Inquiry</option>
                                        <option>Course Support</option>
                                        <option>Partnership</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400">Message</label>
                                    <textarea rows={4} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" placeholder="How can we help you?"></textarea>
                                </div>
                                <button type="button" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all transform hover:-translate-y-1">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section >



            {/* Footer */}
            {/* Footer - Redesigned & Interactive */}
            <footer className="relative bg-slate-950 text-slate-400 py-16 border-t border-slate-800 overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 blur-sm"></div>
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="container mx-auto px-6 md:px-12 flex flex-col items-center text-center relative z-10">
                    <div className="space-y-8 max-w-3xl">
                        {/* Logo Area */}
                        <div className="flex flex-col items-center justify-center space-y-4 group">
                            <div className="relative p-2">
                                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                <img src="/logo.png" alt="Genesys Quantis Logo" className="h-12 relative z-10 transform group-hover:scale-105 transition-transform duration-500" />
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-base leading-relaxed text-slate-500 max-w-xl mx-auto hover:text-slate-400 transition-colors duration-300">
                            Empowering the next generation of AI developers with cutting-edge tools, personalized learning experiences, and world-class mentorship.
                        </p>



                        {/* Contact Info */}
                        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 pt-8 border-t border-slate-900 w-full">
                            <a href="mailto:contact@genesysquantis.com" className="flex items-center space-x-3 text-slate-400 hover:text-blue-400 transition-all duration-300 group bg-slate-900/50 px-5 py-3 rounded-full border border-slate-800/50 hover:border-blue-500/30">
                                <div className="p-2 bg-blue-500/10 rounded-full group-hover:bg-blue-500/20 transition-colors">
                                    <Mail size={18} className="text-blue-500" />
                                </div>
                                <span className="font-medium">contact@genesysquantis.com</span>
                            </a>
                            <div className="flex items-center space-x-3 text-slate-400 bg-slate-900/50 px-5 py-3 rounded-full border border-slate-800/50 hover:border-blue-500/30 transition-all duration-300 group cursor-default">
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
                    <p className="hover:text-slate-500 transition-colors">&copy; 2026 Genesys Quantis. All rights reserved.</p>
                </div>

                {/* Optional: 'Back to Top' Button (could be implemented if scroll logic added, for now just a decorative suggestion if user wanted interactivity) */}
                {/* <button className="absolute bottom-8 right-8 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:-translate-y-1 transition-transform animate-bounce-slow">
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
                                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
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
                                            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-emerald-500/50 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm transition-all duration-300">
                    <div className="relative w-full max-w-5xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
                        <button
                            onClick={() => setShowVideoModal(false)}
                            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all backdrop-blur-md"
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
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold animate-fade-in-out hidden md:block border border-blue-500 relative shadow-blue-500/30">
                    Chat with us now live
                    <div className="absolute top-1/2 -right-1 w-2 h-2 bg-indigo-600 transform -translate-y-1/2 rotate-45"></div>
                </div>
                <a
                    href="https://wa.me/918008502829"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all flex items-center justify-center animate-bounce-slow"
                    title="Chat with us on WhatsApp"
                >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-8 h-8" />
                </a>
            </div>
        </div >
    );
};

export default LandingPage;
