import React, { useState, useEffect } from 'react';
import { 
    ArrowLeft, Brain, Cpu, Zap, Network, Target, BookOpen, Users, 
    Award, TrendingUp, Monitor, Shield, CheckCircle, Clock, Calendar,
    ChevronRight, Star, Briefcase, Menu, X
} from 'lucide-react';

// Reusable Components
const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white shadow-xl shadow-blue-900/5 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ${className}`}>
        {children}
    </div>
);

const FeatureIcon = ({ icon: Icon, colorClass }: { icon: React.ElementType, colorClass: string }) => (
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner transition-transform duration-500 hover:scale-110 ${colorClass}`}>
        <Icon size={28} />
    </div>
);

const QuantumPage = () => {
    const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, minutes: 0, seconds: 0 });
    const [curriculumTab, setCurriculumTab] = useState('basic');
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showContactModal, setShowContactModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Course mock for marquee
    const allCourses = [
        { id: '1', title: 'Python Programming for AI' },
        { id: '2', title: 'Machine Learning & Deep Learning' },
        { id: '3', title: 'Generative AI' },
        { id: '4', title: 'Data Engineering' },
        { id: '5', title: 'Computer Vision' }
    ];

    // Timer Logic
    useEffect(() => {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 2);
        targetDate.setHours(targetDate.getHours() + 14);

        const interval = setInterval(() => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();

            if (difference <= 0) {
                clearInterval(interval);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

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
                        <img src="/logo.png" alt="GenQuantaa Logo" className="h-10" />
                    </div>
                    <div className="hidden md:flex space-x-10 text-slate-600 font-medium text-sm">
                        <a href="/" className="hover:text-blue-400 transition-colors">Home</a>
                        <a href="/#about" className="hover:text-blue-400 transition-colors">About</a>
                        <a href="/#courses" className="hover:text-blue-400 transition-colors">Courses</a>
                        <a href="/quantum" className="text-blue-500 font-semibold transition-colors flex items-center gap-1">
                            Quantum
                        </a>
                        <a href="/fde" className="hover:text-emerald-500 font-semibold transition-colors">FDE Masterclass</a>
                        <a href="/biologics" className="hover:text-purple-600 font-semibold transition-colors">Biologics</a>
                        <div className="relative group">
                            <a href="#courses" className="hover:text-blue-400 transition-colors flex items-center gap-1">Brochure <ChevronRight size={14} className="rotate-90" /></a>
                            <ul className="absolute left-0 mt-2 w-48 bg-white border border-slate-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
                                <li><a href="/DATA%20SCINECE%20COURSE%20BROCHURE%20(3).pdf" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">Data Science Brochure</a></li>
                                <li><a href="/AI%20Course%20Broucher.pdf" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">AI Course Brochure</a></li>
                                <li><a href="/Quantum%20Computing%20(1).pdf" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">Quantum Computing Brochure</a></li>
                                <li><a href="/LifeSciences.pdf" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">Generative AI for End-to-End Drug Discovery & Life Sciences</a></li>
                            </ul>
                        </div>
                        <a href="/#blog" className="hover:text-blue-400 transition-colors">Blog</a>
                        <a href="/#contact" className="hover:text-blue-400 transition-colors">Contact</a>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => window.location.href = '/login'}
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
                        <a href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 font-semibold text-lg">Home</a>
                        <a href="/#about" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 font-semibold text-lg">About</a>
                        <a href="/#courses" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 font-semibold text-lg">Courses</a>
                        <a href="/quantum" onClick={() => setIsMobileMenuOpen(false)} className="text-[#0f269a] font-semibold text-lg">Quantum</a>
                        
                        <div className="flex flex-col space-y-3">
                            <span className="text-slate-400 font-semibold text-sm uppercase tracking-wider">Brochures</span>
                            <a href="/DATA%20SCINECE%20COURSE%20BROCHURE%20(3).pdf" className="text-slate-600 pl-4 text-sm">Data Science Brochure</a>
                            <a href="/AI%20Course%20Broucher.pdf" className="text-slate-600 pl-4 text-sm">AI Course Brochure</a>
                            <a href="/Quantum%20Computing%20(1).pdf" className="text-slate-600 pl-4 text-sm">Quantum Computing Brochure</a>
                            <a href="/LifeSciences.pdf" className="text-slate-600 pl-4 text-sm">Drug Discovery & Life Sciences</a>
                        </div>
                        
                        <a href="/#blog" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 font-semibold text-lg">Blog</a>
                        <a href="/#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 font-semibold text-lg">Contact</a>
                    </div>
                )}
            </div>

            {/* Unified Hero Background - Needs padding-top to account for the fixed header */}
            <main className="relative overflow-hidden pt-[100px] pb-24">
                {/* Background Blobs for Sweeping Curves */}
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[80%] bg-white/70 blur-3xl rounded-full pointer-events-none transform -rotate-12"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[120%] bg-blue-200/40 blur-3xl rounded-full pointer-events-none"></div>
                <div className="absolute top-[20%] right-[20%] w-[40%] h-[60%] bg-cyan-100/40 blur-3xl rounded-full pointer-events-none"></div>
                <div className="absolute top-[10%] left-[30%] w-[30%] h-[40%] bg-blue-200/30 blur-3xl rounded-full pointer-events-none"></div>
                <style>{`
                    @keyframes float {
                        0% { transform: translateY(0px); }
                        50% { transform: translateY(-15px); }
                        100% { transform: translateY(0px); }
                    }
                    .animate-float {
                        animation: float 6s ease-in-out infinite;
                    }
                `}</style>
                
                {/* Hero Section */}
                <section className="container mx-auto px-6 md:px-12 max-w-7xl mb-24 flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 space-y-8">
                        <div className="inline-flex items-center bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-white">
                            <Zap className="mr-2 text-blue-500" size={16} />
                            <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider">Quantum Computing & AI</span>
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-slate-900 leading-[1.1] tracking-tight mb-6">
                            Master The Future <br />
                            of Computing
                        </h1>
                        
                        <div className="bg-white/60 backdrop-blur-xl border border-white p-6 rounded-3xl inline-block shadow-lg">
                            <p className="text-blue-600 text-sm font-bold uppercase tracking-widest mb-2 flex items-center">
                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></span>
                                Admission closes in
                            </p>
                            <div className="flex gap-4 text-center">
                                {Object.entries(timeLeft).map(([unit, value]) => (
                                    <div key={unit} className="flex flex-col">
                                        <span className="text-3xl font-black text-slate-900 bg-white/50 px-4 py-2 rounded-xl border border-white/60 shadow-sm">
                                            {String(value).padStart(2, '0')}
                                        </span>
                                        <span className="text-xs font-semibold text-slate-500 uppercase mt-2">{unit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <button className="bg-gradient-to-r from-[#0f269a] to-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-blue-900/20 hover:shadow-xl hover:-translate-y-1 transition-all">
                                Get Started Today
                            </button>
                            <a 
                                href="/Quantum Computing (1).pdf" 
                                download="Quantum Computing Brochure.pdf"
                                className="bg-white/60 backdrop-blur-md text-[#0f269a] border border-white px-8 py-4 rounded-2xl font-bold shadow-sm hover:bg-white transition-all flex items-center justify-center"
                            >
                                Download Brochure
                            </a>
                        </div>
                    </div>
                    
                    <div className="flex-1 w-full">
                        <div className="relative rounded-[40px] overflow-hidden border-[8px] border-white/40 shadow-2xl shadow-purple-900/10 aspect-video bg-slate-900">
                            <video 
                                className="absolute inset-0 w-full h-full object-cover" 
                                src="/video1.mp4" 
                                autoPlay 
                                loop 
                                muted 
                                playsInline
                            ></video>
                        </div>
                    </div>
                </section>

                {/* Program Info Bar */}
                <section className="container mx-auto px-6 md:px-12 max-w-7xl mb-24">
                    <div className="bg-white/60 backdrop-blur-xl border border-white rounded-[32px] p-8 md:p-12 shadow-xl shadow-blue-900/5 flex flex-col md:flex-row justify-between items-center gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-200/50">
                        <div className="w-full md:w-1/3 flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-blue-100/50 flex items-center justify-center text-blue-600 border border-white">
                                <Monitor size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Format</p>
                                <p className="text-xl font-bold text-slate-900">Live, Online, Interactive</p>
                            </div>
                        </div>
                        <div className="w-full md:w-1/3 flex items-center gap-6 pt-6 md:pt-0 md:pl-12">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-100/50 flex items-center justify-center text-emerald-600 border border-white">
                                <CheckCircle size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Registration</p>
                                <p className="text-xl font-bold text-emerald-600">Free to Register</p>
                            </div>
                        </div>
                        <div className="w-full md:w-1/3 flex items-center gap-6 pt-6 md:pt-0 md:pl-12">
                            <div className="w-14 h-14 rounded-2xl bg-blue-100/50 flex items-center justify-center text-blue-600 border border-white">
                                <Users size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Eligibility</p>
                                <p className="text-base font-bold text-slate-900">Graduates, Researchers & Pros</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Transformative Features */}
                <section className="container mx-auto px-6 md:px-12 max-w-7xl mb-24">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
                            Transformative <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0f269a] to-blue-500">Learning Experience</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <GlassCard>
                            <FeatureIcon icon={BookOpen} colorClass="bg-blue-100 text-blue-600 border border-white" />
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Up-to-Date Modules</h3>
                            <p className="text-slate-600">Curriculum designed by top Professors and Industry Experts.</p>
                        </GlassCard>
                        <GlassCard>
                            <FeatureIcon icon={Monitor} colorClass="bg-blue-100 text-blue-600 border border-white" />
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Live Doubt Clearing</h3>
                            <p className="text-slate-600">Cover up all your doubts with LIVE doubt clearing sessions.</p>
                        </GlassCard>
                        <GlassCard>
                            <FeatureIcon icon={Target} colorClass="bg-emerald-100 text-emerald-600 border border-white" />
                            <h3 className="text-xl font-bold text-slate-900 mb-3">40+ Practical Projects</h3>
                            <p className="text-slate-600">Hands-on assignments which act as real-world projects.</p>
                        </GlassCard>
                        <GlassCard>
                            <FeatureIcon icon={Brain} colorClass="bg-orange-100 text-orange-600 border border-white" />
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Interactive Learning</h3>
                            <p className="text-slate-600">Choose what you learn from Pre-requisites to Expert Level.</p>
                        </GlassCard>
                        <GlassCard>
                            <FeatureIcon icon={Users} colorClass="bg-pink-100 text-pink-600 border border-white" />
                            <h3 className="text-xl font-bold text-slate-900 mb-3">1:1 Career Mentorship</h3>
                            <p className="text-slate-600">Receive personalized guidance to achieve your career goals.</p>
                        </GlassCard>
                        <GlassCard>
                            <FeatureIcon icon={Award} colorClass="bg-indigo-100 text-indigo-600 border border-white" />
                            <h3 className="text-xl font-bold text-slate-900 mb-3">In-depth Curriculum</h3>
                            <p className="text-slate-600">The best curriculum in Quantum computing from basics to expert.</p>
                        </GlassCard>
                    </div>
                </section>

                {/* Course Offerings Overview */}
                <section className="container mx-auto px-6 md:px-12 max-w-7xl mb-24">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
                            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-500">Course Offerings</span>
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">Choose your path to excellence in AI and Quantum Computing.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        <GlassFeatureCard
                            icon="https://qpiai-explorer.tech/_next/image?url=%2Fai.png&w=3840&q=75"
                            title="Artificial Intelligence & ML Certification"
                            description="Master AI fundamentals and machine learning algorithms with real-world applications"
                        />
                        <GlassFeatureCard
                            icon="https://qpiai-explorer.tech/_next/image?url=%2Fquantum.png&w=3840&q=75"
                            title="Quantum Machine Learning with AI"
                            description="Combine quantum computing power with AI to solve complex problems"
                        />
                        <GlassFeatureCard
                            icon="https://qpiai-explorer.tech/_next/image?url=%2Fbraket.png&w=3840&q=75"
                            title="Data Fabric with PowerBI"
                            description="Comprehensive training in Data Fabric and PowerBI implementation"
                        />
                    </div>
                </section>

                {/* Why AI + Quantum */}
                <section className="container mx-auto px-6 md:px-12 max-w-7xl mb-24">
                    <div className="bg-white/40 backdrop-blur-2xl rounded-[40px] border border-white p-12 md:p-16 shadow-2xl flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2 space-y-6">
                            <span className="text-blue-600 font-bold uppercase tracking-wider text-sm bg-blue-100/50 px-4 py-2 rounded-full border border-white">Benefits</span>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900">
                                Why <span className="text-[#0f269a]">AI + Quantum?</span>
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                AI and quantum computing offer exciting opportunities for jobs, innovation, problem-solving, and understanding the world. It's a chance to be at the forefront of developing new technologies and shaping the future.
                            </p>
                            <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:bg-slate-800 transition-colors">
                                Enquire Pricing
                            </button>
                        </div>
                        <div className="lg:w-1/2 grid sm:grid-cols-2 gap-6 w-full">
                            <GlassCard className="p-6">
                                <h3 className="font-bold text-slate-900 mb-2">1:1 Mentorship</h3>
                                <p className="text-sm text-slate-600">Get personalized guidance from our expert team.</p>
                            </GlassCard>
                            <GlassCard className="p-6">
                                <h3 className="font-bold text-slate-900 mb-2">Hands on Lab</h3>
                                <p className="text-sm text-slate-600">Learn actively using amazon-braket-sdk in GenQuantaa's Lab.</p>
                            </GlassCard>
                            <GlassCard className="p-6">
                                <h3 className="font-bold text-slate-900 mb-2">AWS Certified</h3>
                                <p className="text-sm text-slate-600">Become certified by India's largest quantum service provider.</p>
                            </GlassCard>
                            <GlassCard className="p-6">
                                <h3 className="font-bold text-slate-900 mb-2">Quantum Simulator</h3>
                                <p className="text-sm text-slate-600">Play around with GenQuantaa's Quantum Circuit Generator.</p>
                            </GlassCard>
                        </div>
                    </div>
                </section>

                {/* Outcomes Section */}
                <section id="outcomes" className="container mx-auto px-6 md:px-12 max-w-7xl mb-24">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
                            Career <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Outcomes</span>
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">Transform knowledge into action with measurable career growth.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <GlassCard>
                            <TrendingUp className="text-emerald-500 mb-4" size={32} />
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Job Growth</h3>
                            <p className="text-slate-600">Market expected to grow to USD 65.4 billion by 2030.</p>
                        </GlassCard>
                        <GlassCard>
                            <span className="text-3xl font-black text-blue-600 block mb-3">+100%</span>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Salary Increase</h3>
                            <p className="text-slate-600">35% to 100% hike compared to traditional tech roles.</p>
                        </GlassCard>
                        <GlassCard>
                            <Award className="text-blue-500 mb-4" size={32} />
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Specialized Roles</h3>
                            <p className="text-slate-600">Algorithm researchers, security analysts & developers.</p>
                        </GlassCard>
                    </div>
                </section>

                {/* Curriculum Tabs Section */}
                <section id="curriculum" className="container mx-auto px-6 md:px-12 max-w-7xl mb-24">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
                            Structured <span className="text-[#0f269a]">Curriculum</span>
                        </h2>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="lg:w-1/3 flex flex-col gap-4">
                            <button 
                                onClick={() => setCurriculumTab('basic')}
                                className={`p-6 rounded-3xl font-bold text-lg transition-all text-left border ${curriculumTab === 'basic' ? 'bg-[#0f269a] text-white shadow-xl shadow-blue-900/20 border-[#0f269a]' : 'bg-white/60 backdrop-blur-md text-slate-600 hover:bg-white border-white'}`}
                            >
                                Basic Course <span className="block text-sm font-normal opacity-80 mt-1">3-6 Months</span>
                            </button>
                            <button 
                                onClick={() => setCurriculumTab('advance')}
                                className={`p-6 rounded-3xl font-bold text-lg transition-all text-left border ${curriculumTab === 'advance' ? 'bg-blue-600 text-white shadow-xl shadow-purple-900/20 border-blue-600' : 'bg-white/60 backdrop-blur-md text-slate-600 hover:bg-white border-white'}`}
                            >
                                Advance Course <span className="block text-sm font-normal opacity-80 mt-1">6-12 Months</span>
                            </button>
                        </div>
                        
                        <div className="lg:w-2/3">
                            <div className="bg-white/60 backdrop-blur-xl border border-white rounded-[32px] p-8 shadow-xl">
                                {curriculumTab === 'basic' ? (
                                    <div className="grid sm:grid-cols-2 gap-8">
                                        <div>
                                            <h4 className="font-bold text-slate-900 mb-4 text-lg border-b border-slate-200 pb-2">Module 1: Foundations</h4>
                                            <ul className="space-y-2 text-slate-600">
                                                <li>• Mathematical Preliminaries</li>
                                                <li>• Quantum Mechanics Fundamentals</li>
                                                <li>• Introduction to qubits</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 mb-4 text-lg border-b border-slate-200 pb-2">Module 2: Algorithms</h4>
                                            <ul className="space-y-2 text-slate-600">
                                                <li>• Physical Realizations & Qiskit</li>
                                                <li>• Basic Quantum Algorithms</li>
                                                <li>• Quantum Speed-up & Complexity</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 mb-4 text-lg border-b border-slate-200 pb-2">Module 3: Transformative</h4>
                                            <ul className="space-y-2 text-slate-600">
                                                <li>• Quantum Fourier Transform</li>
                                                <li>• Shor's Algorithm</li>
                                                <li>• Grover Search</li>
                                            </ul>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid sm:grid-cols-2 gap-8">
                                        <div>
                                            <h4 className="font-bold text-slate-900 mb-4 text-lg border-b border-slate-200 pb-2">Module 5: Error & Software</h4>
                                            <ul className="space-y-2 text-slate-600">
                                                <li>• Quantum Error Correction (QEC)</li>
                                                <li>• Error Mitigation</li>
                                                <li>• Pulse Programming</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 mb-4 text-lg border-b border-slate-200 pb-2">Module 6: Modern Applications</h4>
                                            <ul className="space-y-2 text-slate-600">
                                                <li>• Variational Quantum Algorithms</li>
                                                <li>• Solving Optimization Problems</li>
                                                <li>• Quantum Machine Learning (QML)</li>
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
                
                

                {/* Available Courses Catalog */}
                <section className="container mx-auto px-6 md:px-12 max-w-7xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                            Artificial Intelligence Courses
                        </h2>
                        <p className="text-lg text-slate-600">Start from scratch with the AI prerequisites or expand your knowledge.</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8 mb-24">
                        <GlassCourseCard 
                            badge="AI & ML"
                            title="AI Foundation"
                            duration="28 hours of learning material"
                            projects="5+ Projects"
                            topics={["Prerequisites for AI & ML", "Artificial Intelligence", "Machine Learning", "Deep Learning", "Foundation AI Projects"]}
                            price="₹24,999"
                            onJoin={() => { setSelectedCourse("AI Foundation"); setShowContactModal(true); }}
                        />
                        <GlassCourseCard 
                            badge="AI & ML"
                            title="AI Expert"
                            duration="44 hours of learning material"
                            projects="8+ Projects"
                            topics={["Advanced Machine Learning", "Practical Machine Learning", "Advanced Topics in Deep Learning", "Expert AI Projects"]}
                            price="₹34,999"
                            highlight={true}
                            onJoin={() => { setSelectedCourse("AI Expert"); setShowContactModal(true); }}
                        />
                    </div>

                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                            Quantum Computing Courses
                        </h2>
                        <p className="text-lg text-slate-600">Master quantum computing from fundamentals to advanced applications.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
                        <GlassCourseCard badge="Quantum" title="QML with AWS" duration="10 Weeks" projects="4+ Projects" price="₹39,999" topics={["Quantum Computing Basics", "AWS Braket Platform", "Quantum Algorithms", "QML Fundamentals", "Hybrid Systems"]} onJoin={() => { setSelectedCourse("QML with AWS"); setShowContactModal(true); }} />
                        <GlassCourseCard badge="Quantum" title="Quantum Computing with Amazon Braket" duration="12 Weeks" projects="6+ Projects" price="₹44,999" highlight={true} topics={["Quantum Gates & Circuits", "Amazon Braket SDK", "Quantum Simulators", "Real Quantum Hardware", "Quantum Applications"]} onJoin={() => { setSelectedCourse("Quantum Computing with Amazon Braket"); setShowContactModal(true); }} />
                        <GlassCourseCard badge="Quantum" title="QML + AI Foundation" duration="16 Weeks" projects="8+ Advanced Projects" price="₹59,999" topics={["Advanced Quantum ML", "Quantum Optimization", "Industry Applications", "Research Projects", "Expert Certification"]} onJoin={() => { setSelectedCourse("QML + AI Foundation"); setShowContactModal(true); }} />
                        <GlassCourseCard badge="Quantum" title="Quantum Foundation with PennyLane" duration="8 Weeks" projects="3+ Projects" price="₹29,999" topics={["Quantum Mechanics Intro", "Qubits & Superposition", "Quantum Entanglement", "Basic Algorithms", "Quantum vs Classical"]} onJoin={() => { setSelectedCourse("Quantum Foundation with PennyLane"); setShowContactModal(true); }} />
                        <GlassCourseCard badge="Quantum" title="Quantum IBM Qiskit Expert" duration="14 Weeks" projects="7+ Projects" price="₹54,999" topics={["Advanced Quantum Theory", "Quantum Cryptography", "Error Correction", "Quantum Networks", "Expert Applications"]} onJoin={() => { setSelectedCourse("Quantum IBM Qiskit Expert"); setShowContactModal(true); }} />
                        <GlassCourseCard badge="Quantum" title="Quantum with Google Cirq + Willow" duration="20 Weeks" projects="10+ Elite Projects" price="₹79,999" highlight={true} topics={["Complete AI+Q Mastery", "Industry Consulting", "Research Publication", "Career Placement", "Lifetime Support"]} onJoin={() => { setSelectedCourse("Quantum with Google Cirq + Willow"); setShowContactModal(true); }} />
                    </div>

                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                            Upcoming Courses
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <GlassCourseCard 
                            badge="Upcoming"
                            title="Digital Transformation in Life Sciences"
                            duration="Coming Soon"
                            projects="Industry Use Cases"
                            topics={["Digital Health Trends", "AI in Drug Discovery", "Data Analytics in Healthcare", "Regulatory Compliance", "Future of Life Sciences"]}
                            price="Enquire Now"
                            highlight={true}
                            onJoin={() => { setSelectedCourse("Digital Transformation in Life Sciences"); setShowContactModal(true); }}
                        />
                    </div>
                </section>
            </main>

            {/* Contact / Registration Modal */}
            {showContactModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
                    <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-white">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 mb-2">Register Now</h2>
                                    <p className="text-slate-600 font-medium">Join <span className="text-[#0f269a] font-bold">{selectedCourse}</span> and master the future of computing.</p>
                                </div>
                                <button
                                    onClick={() => setShowContactModal(false)}
                                    className="text-slate-400 hover:text-[#0f269a] text-2xl bg-white p-2 rounded-full shadow-sm transition-all"
                                >
                                    ×
                                </button>
                            </div>

                            <form action="https://formsubmit.co/academy@genquantaa.com" method="POST" className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Full Name</label>
                                    <input type="text" name="Full Name" className="w-full bg-white/50 backdrop-blur-md border border-white rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0f269a] shadow-sm transition-all" placeholder="Enter your full name" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Email Address</label>
                                    <input type="email" name="email" className="w-full bg-white/50 backdrop-blur-md border border-white rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0f269a] shadow-sm transition-all" placeholder="Enter your email" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Phone Number</label>
                                    <input type="tel" name="Phone Number" className="w-full bg-white/50 backdrop-blur-md border border-white rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0f269a] shadow-sm transition-all" placeholder="Enter your phone number" required />
                                </div>
                                <div className="pt-4">
                                    <button type="submit" className="w-full bg-gradient-to-r from-[#0f269a] to-blue-600 hover:from-blue-700 hover:to-indigo-600 text-white font-bold py-4 rounded-xl shadow-xl shadow-blue-900/20 transition-all transform hover:-translate-y-1">
                                        Submit Registration
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Extracted CourseCard Component styled for our theme
const GlassCourseCard = ({ badge, title, duration, projects, topics, price, highlight = false, onJoin }: any) => {
    if (highlight) {
        return (
            <div className="bg-gradient-to-br from-[#0f269a] to-blue-800 backdrop-blur-xl rounded-[32px] border border-white/20 p-8 shadow-xl shadow-blue-900/20 flex flex-col h-full group hover:shadow-2xl hover:-translate-y-2 transition-all">
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full w-max mb-6 backdrop-blur-md">{badge}</span>
                <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
                
                <div className="flex flex-col space-y-1 mb-6 text-blue-100/90 font-medium">
                    <p className="flex items-center gap-2"><Clock size={16} /> {duration}</p>
                    <p className="flex items-center gap-2"><Briefcase size={16} /> {projects}</p>
                </div>

                <div className="mb-8 flex-grow">
                    <p className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-3">Learn</p>
                    <ul className="space-y-2 text-blue-100/90">
                        {topics.map((t: any, i: any) => (
                            <li key={i} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-300 rounded-full mt-2 shrink-0"></span>
                                <span>{t}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex justify-between items-center border-t border-white/20 pt-6 mt-auto">
                    <span className="text-2xl font-black text-white">{price}</span>
                    <button onClick={onJoin} className="bg-white text-[#0f269a] hover:bg-blue-50 px-6 py-2.5 rounded-xl font-bold transition-colors shadow-lg">Join Now</button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-[32px] border border-white p-8 shadow-xl flex flex-col h-full group hover:shadow-2xl hover:-translate-y-2 transition-all">
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full w-max mb-6">{badge}</span>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">{title}</h3>
            
            <div className="flex flex-col space-y-1 mb-6 text-slate-600 font-medium">
                <p className="flex items-center gap-2"><Clock size={16} /> {duration}</p>
                <p className="flex items-center gap-2"><Briefcase size={16} /> {projects}</p>
            </div>

            <div className="mb-8 flex-grow">
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Learn</p>
                <ul className="space-y-2 text-slate-600">
                    {topics.map((t: any, i: any) => (
                        <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 shrink-0"></span>
                            <span>{t}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex justify-between items-center border-t border-slate-200 pt-6 mt-auto">
                <span className="text-2xl font-black text-slate-900">{price}</span>
                <button onClick={onJoin} className="bg-slate-100 text-slate-700 hover:bg-[#0f269a] hover:text-white px-6 py-2.5 rounded-xl font-bold transition-colors">Join Now</button>
            </div>
        </div>
    );
};

// Feature Card
export const GlassFeatureCard = ({ icon, title, description }: any) => {
    const IconComp = typeof icon === "string" ? null : (icon as unknown as React.ComponentType<any>);

    return (
        <div className="bg-white/60 backdrop-blur-xl p-10 rounded-[32px] border border-white shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-white/80 border-4 border-white shadow-inner flex items-center justify-center overflow-hidden">
                {IconComp ? (
                    <IconComp className="w-12 h-12 text-blue-500" />
                ) : (
                    <img src={icon} alt={title} className="w-12 h-12 object-contain" />
                )}
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
            <p className="text-lg text-slate-600 leading-relaxed">{description}</p>
        </div>
    );
};

// Instructor Card
export const GlassInstructorCard = ({ name, title, credentials, imageUrl }: any) => {
    return (
        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[32px] border border-white shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0f269a] to-blue-500 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                {imageUrl ? (
                    <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-3xl font-black text-white">{name.charAt(0)}</span>
                )}
            </div>
            <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900">{name}</h2>
                <p className="text-sm text-[#0f269a] font-semibold">{title}</p>
                <p className="text-xs text-slate-500">{credentials}</p>
            </div>
        </div>
    );
};

export default QuantumPage;
