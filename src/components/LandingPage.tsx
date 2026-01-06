import React, { useState, useEffect } from 'react';

import { API_BASE_URL } from '../config';
import { Play, Search, BookOpen, Users, User, Medal as Award, Monitor, CheckCircle, ArrowRight, Star, Facebook, Twitter, Instagram, Linkedin, Mail, Brain, Globe, Shield, Phone, Lock } from 'lucide-react';

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
                    <img src="/logo.png" alt="Quant X AI Logo" className="h-10" />
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
                    <div className="inline-flex items-center space-x-2 bg-slate-900/50 text-blue-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase border border-slate-800 backdrop-blur-sm">
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                        <span>Start Learning Today</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
                        Learn Without <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-x">Limits</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 max-w-lg leading-relaxed">
                        Unlock your potential with thousands of courses from expert instructors. Advance your career with our AI-powered learning platform designed for the future.
                    </p>

                    <div className="flex space-x-8 md:space-x-12 py-4 border-t border-slate-800/50 pt-8">
                        <div>
                            <h3 className="text-3xl font-bold text-white">1000+</h3>
                            <p className="text-slate-500 text-xs font-medium uppercase tracking-wide mt-1">Online Courses</p>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-white">50k+</h3>
                            <p className="text-slate-500 text-xs font-medium uppercase tracking-wide mt-1">Active Students</p>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-white">4.8/5</h3>
                            <p className="text-slate-500 text-xs font-medium uppercase tracking-wide mt-1">Average Rating</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        <button
                            onClick={onStart}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-900/30 hover:shadow-blue-500/50 flex items-center justify-center group"
                        >
                            Get Started <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                        </button>
                        <button className="bg-slate-900 text-slate-300 border border-slate-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-800 hover:border-slate-600 hover:text-white transition-all flex items-center justify-center shadow-lg hover:shadow-slate-700/50 group">
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
                            { icon: Monitor, label: "Online Courses", value: "25+", color: "text-orange-400", bg: "bg-orange-500/10" },
                            { icon: Users, label: "Expert Tutors", value: "20+", color: "text-blue-400", bg: "bg-blue-500/10" },
                            { icon: BookOpen, label: "Student Active", value: "400+", color: "text-purple-400", bg: "bg-purple-500/10" },
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



            {/* Certificates Section */}
            <section className="bg-slate-950 py-24 border-y border-slate-800/50">
                <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center max-w-7xl">
                    <div className="md:w-1/2 mb-12 md:mb-0 relative">
                        {/* Certificate Image and Video Layout */}
                        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-6">
                            <div className="relative transform rotate-[-3deg] hover:rotate-0 transition-transform duration-500">
                                <img src="/certificate.webp" alt="Certificate" className="rounded-xl shadow-2xl w-full max-w-xs border-4 border-slate-700" />
                                <div className="absolute -bottom-4 -right-4 bg-slate-800 p-3 rounded-lg shadow-lg flex items-center space-x-2 border border-slate-700">
                                    <Award className="text-blue-400" size={20} />
                                    <span className="text-xs font-bold text-white">Verified</span>
                                </div>
                            </div>

                            {/* Video Placeholder */}
                            <div className="relative w-full max-w-xs h-48 bg-slate-900 rounded-xl shadow-2xl overflow-hidden group cursor-pointer transform rotate-[3deg] hover:rotate-0 transition-transform duration-500 border-4 border-slate-700">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src="https://www.youtube.com/embed/9lxBkCJzvKs?si=sX2vX2zX2zX2zX2z"
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    className="w-full h-full"
                                ></iframe>
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
                                    <th className="py-6 px-8 text-lg font-bold text-blue-400 bg-blue-900/20 border-b border-blue-900/50 border-t-4 border-t-blue-500">Zerokost LMS</th>
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

            {/* Why Choose Our Platform (Blue Section) */}
            <section id="about" className="py-24 bg-gradient-to-br from-blue-700 to-indigo-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-7xl">
                    <div className="flex justify-center mb-6">
                        <span className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide flex items-center">
                            <Monitor size={12} className="mr-2" /> Next-Generation Learning Platform
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Why Choose Our Platform?</h2>
                    <p className="text-center text-blue-100 max-w-2xl mx-auto mb-16 text-lg">Experience revolutionary online education powered by AI, backed by industry experts, and trusted by professionals worldwide</p>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { icon: Brain, title: "AI-Powered Learning", desc: "Personalized learning paths with cutting-edge AI technology", badge: "98% Success Rate" },
                            { icon: Users, title: "Industry Experts", desc: "Learn from top professionals at Google, Microsoft, Meta & more", badge: "500+ Instructors" },
                            { icon: Globe, title: "Global Community", desc: "Join 50,000+ learners from 150+ countries worldwide", badge: "24/7 Support" },
                            { icon: Shield, title: "Verified Certificates", desc: "Blockchain verified certificates recognized by 1000+ companies", badge: "100% Authentic" },
                        ].map((item, i) => (
                            <div key={i} className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-3xl hover:bg-white/20 transition-all hover:-translate-y-2 group">
                                <div className="bg-white/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <item.icon size={28} className="text-white" />
                                </div>
                                <h3 className="font-bold text-xl mb-3">{item.title}</h3>
                                <p className="text-blue-100 text-sm mb-6 leading-relaxed">{item.desc}</p>
                                <span className="inline-block bg-white/10 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide text-blue-200">
                                    {item.badge}
                                </span>
                            </div>
                        ))}
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
            < footer className="bg-gray-900 text-gray-400 py-20 border-t border-gray-800" >
                <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="space-y-6">
                        <div className="flex items-center space-x-2">
                            <img src="/logo.png" alt="Quant X AI Logo" className="h-10" />

                        </div>
                        <p className="text-sm leading-relaxed text-gray-500">
                            Empowering the next generation of AI developers with cutting-edge tools and personalized learning experiences.
                        </p>
                        {/* <div className="flex space-x-4 pt-2">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <div key={i} className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all cursor-pointer group">
                                    <Icon size={18} className="group-hover:scale-110 transition-transform" />
                                </div>
                            ))}
                        </div> */}
                        <div className="space-y-4 pt-6 border-t border-gray-800">
                            <div className="flex items-center space-x-3 text-sm">
                                <Mail size={16} className="text-blue-500 shrink-0" />
                                <a href="mailto:contact@genesysquantis.com" className="hover:text-blue-400 transition-colors">contact@genesysquantis.com</a>
                            </div>
                            <div className="flex items-start space-x-3 text-sm">
                                <Phone size={16} className="text-blue-500 mt-1 shrink-0" />
                                <div className="flex flex-col space-y-1.5">
                                    <a href="tel:+917893752462" className="hover:text-blue-400 transition-colors">+91 7036951155</a>
                                    <a href="tel:+918008502829" className="hover:text-blue-400 transition-colors">+91 7036955133</a>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg">Quick Links</h4>
                        <ul className="space-y-4 text-sm">
                            <li><a href="#home" className="hover:text-blue-400 transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>Home</a></li>
                            <li><a href="#about" className="hover:text-blue-400 transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>About Us</a></li>
                            <li><a href="#courses" className="hover:text-blue-400 transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>Courses</a></li>
                            <li><a href="#contact" className="hover:text-blue-400 transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg">Categories</h4>
                        <ul className="space-y-4 text-sm">
                            {['Data Science', 'Machine Learning', 'Deep Learning', 'Artificial Intelligence'].map((link) => (
                                <li key={link}><a href="#" className="hover:text-blue-400 transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>{link}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg">Newsletter</h4>
                        <p className="text-sm mb-4 text-gray-500">Subscribe to get the latest updates and news.</p>
                        <div className="flex flex-col space-y-3">
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                                <input type="email" placeholder="Your email" className="bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white text-sm transition-all" />
                            </div>
                            <button className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 font-bold text-sm shadow-lg shadow-blue-900/20 transition-all hover:-translate-y-0.5">Subscribe Now</button>
                        </div>
                    </div>
                </div>
                <div className="container mx-auto px-6 md:px-12 mt-16 pt-8 border-t border-gray-800 text-center text-sm text-gray-600 flex flex-col md:flex-row justify-between items-center">
                    <p>&copy; 2023 Quant X AI. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-gray-400">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-400">Terms of Service</a>
                        <a href="#" className="hover:text-gray-400">Cookie Policy</a>
                    </div>
                </div>
            </footer >

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
