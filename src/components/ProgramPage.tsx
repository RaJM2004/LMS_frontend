import React, { useState, useEffect } from 'react';
import {
    ChevronRight,
    ChevronLeft,
    ChevronUp,
    ChevronDown,
    Search,
    Menu,
    X,
    Play,
    Pause,
    RotateCcw,
    Plus,
    Minus,
    Download,
    FileText,
    CheckCircle,
    Calendar,
    Clock,
    User,
    Award,
    BookOpen,
    Video,
    Presentation,
    Sparkles,
    Maximize2,
    Eye,
    Star,
    PhoneCall,
    ShieldCheck,
    Mail,
    Phone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

interface ProgramPageProps {
    onBack?: () => void;
}

const ProgramPage: React.FC<ProgramPageProps> = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);

    // Scroll listener for sticky navbar background blur
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Analytics & Tracking State
    const [analytics, setAnalytics] = useState({
        pageViews: 0,
        brochureDownloads: 0,
        pptDownloads: 0,
        videoViews: 0,
        totalRegistrations: 0
    });

    // Brochure Auto-Moving Slideshow State
    const [brochurePage, setBrochurePage] = useState(1);
    const [isBrochureAutoPlay, setIsBrochureAutoPlay] = useState(true);
    const totalBrochurePages = 22;

    useEffect(() => {
        let interval: any;
        if (isBrochureAutoPlay) {
            interval = setInterval(() => {
                setBrochurePage(prev => (prev >= totalBrochurePages ? 1 : prev + 1));
            }, 4500);
        }
        return () => clearInterval(interval);
    }, [isBrochureAutoPlay]);

    // PPT Auto-Moving Slideshow State
    const [pptPage, setPptPage] = useState(1);
    const [isPptAutoPlay, setIsPptAutoPlay] = useState(true);
    const totalPptPages = 16;

    useEffect(() => {
        let interval: any;
        if (isPptAutoPlay) {
            interval = setInterval(() => {
                setPptPage(prev => (prev >= totalPptPages ? 1 : prev + 1));
            }, 4500);
        }
        return () => clearInterval(interval);
    }, [isPptAutoPlay]);

    const trackEvent = async (eventType: 'page_view' | 'brochure_download' | 'ppt_download' | 'video_view') => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/program/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventType })
            });
            const data = await res.json();
            if (data.analytics) {
                setAnalytics(prev => ({
                    ...prev,
                    pageViews: data.analytics.pageViews ?? prev.pageViews,
                    brochureDownloads: data.analytics.brochureDownloads ?? prev.brochureDownloads,
                    pptDownloads: data.analytics.pptDownloads ?? prev.pptDownloads,
                    videoViews: data.analytics.videoViews ?? prev.videoViews
                }));
            }
        } catch (err) {
            console.error('Event tracking failed:', err);
        }
    };

    // SEO & Page Title Setup with Dynamic Analytics Structured Data
    useEffect(() => {
        const PAGE_TITLE = "Forward Deployed Engineer (FDE) Masterclass & Certification | GenQuantaa Academy";
        const PAGE_URL = "https://academy.genquantaa.com/fde";
        const PAGE_IMAGE = "https://academy.genquantaa.com/fde-hero-banner.jpg";
        const PAGE_DESC = `Master Forward Deployed Engineering (FDE). Over ${analytics.pageViews || 100}+ engineers viewed. Join Ashwin Kumaar's live masterclass on 30th Sept 2026. Download free brochure & PPT deck.`;

        document.title = PAGE_TITLE;

        // Helper to upsert meta tags
        const setMeta = (attrs: Record<string, string>, content: string) => {
            const selector = Object.entries(attrs).map(([k, v]) => `[${k}="${v}"]`).join('');
            let el = document.querySelector(`meta${selector}`);
            if (!el) {
                el = document.createElement('meta');
                Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        };

        // Standard meta
        setMeta({ name: 'description' }, PAGE_DESC);
        setMeta({ name: 'keywords' }, 'Forward Deployed Engineer, FDE Masterclass, GenQuantaa Academy, Ashwin Kumaar, enterprise AI, systems architect, SDE to FDE');

        // Open Graph (WhatsApp, LinkedIn, Facebook, Telegram)
        setMeta({ property: 'og:type' }, 'website');
        setMeta({ property: 'og:url' }, PAGE_URL);
        setMeta({ property: 'og:title' }, PAGE_TITLE);
        setMeta({ property: 'og:description' }, PAGE_DESC);
        setMeta({ property: 'og:image' }, PAGE_IMAGE);
        setMeta({ property: 'og:image:width' }, '1200');
        setMeta({ property: 'og:image:height' }, '630');
        setMeta({ property: 'og:image:alt' }, 'Forward Deployed Engineer Masterclass — GenQuantaa Academy');
        setMeta({ property: 'og:site_name' }, 'GenQuantaa Academy');

        // Twitter Card
        setMeta({ name: 'twitter:card' }, 'summary_large_image');
        setMeta({ name: 'twitter:url' }, PAGE_URL);
        setMeta({ name: 'twitter:title' }, PAGE_TITLE);
        setMeta({ name: 'twitter:description' }, PAGE_DESC);
        setMeta({ name: 'twitter:image' }, PAGE_IMAGE);

        // Add JSON-LD Structured Data for SEO with Interaction Counters
        const schemaData = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "Course",
                    "name": "Forward Deployed Engineering (FDE) Professional Certification",
                    "description": "Comprehensive program covering enterprise system integration, hybrid cloud deployments, client architecture engineering, and enterprise AI delivery.",
                    "provider": {
                        "@type": "Organization",
                        "name": "GenQuantaa Academy",
                        "sameAs": "https://academy.genquantaa.com"
                    },
                    "offers": {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "INR",
                        "category": "Masterclass"
                    },
                    "interactionStatistic": [
                        {
                            "@type": "InteractionCounter",
                            "interactionType": { "@type": "http://schema.org/WatchAction" },
                            "userInteractionCount": analytics.pageViews || 0
                        },
                        {
                            "@type": "InteractionCounter",
                            "interactionType": { "@type": "http://schema.org/DownloadAction" },
                            "userInteractionCount": (analytics.brochureDownloads || 0) + (analytics.pptDownloads || 0)
                        },
                        {
                            "@type": "InteractionCounter",
                            "interactionType": { "@type": "http://schema.org/AssessAction" },
                            "userInteractionCount": analytics.videoViews || 0
                        }
                    ]
                },
                {
                    "@type": "EducationEvent",
                    "name": "Forward Deployed Engineer Masterclass",
                    "startDate": "2026-09-30T19:30:00+05:30",
                    "endDate": "2026-09-30T22:00:00+05:30",
                    "eventStatus": "https://schema.org/EventScheduled",
                    "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
                    "location": {
                        "@type": "VirtualLocation",
                        "url": "https://academy.genquantaa.com/fde"
                    },
                    "performer": {
                        "@type": "Person",
                        "name": "Ashwin Kumaar",
                        "jobTitle": "Lead FDE & Systems Architect",
                        "worksFor": "GenQuantaa"
                    }
                }
            ]
        };

        let existingScript = document.getElementById('fde-seo-schema') as HTMLScriptElement;
        if (!existingScript) {
            existingScript = document.createElement('script');
            existingScript.type = 'application/ld+json';
            existingScript.id = 'fde-seo-schema';
            document.head.appendChild(existingScript);
        }
        existingScript.text = JSON.stringify(schemaData);

        return () => {
            const scriptToRemove = document.getElementById('fde-seo-schema');
            if (scriptToRemove) document.head.removeChild(scriptToRemove);
        };
    }, [analytics]);

    // Load initial analytics counts and record page view
    useEffect(() => {
        trackEvent('page_view');

        fetch(`${API_BASE_URL}/api/program/analytics`)
            .then(res => res.json())
            .then(data => {
                if (data && !data.error) {
                    setAnalytics({
                        pageViews: data.pageViews || 0,
                        brochureDownloads: data.brochureDownloads || 0,
                        pptDownloads: data.pptDownloads || 0,
                        videoViews: data.videoViews || 0,
                        totalRegistrations: data.totalRegistrations || 0
                    });
                }
            })
            .catch(err => console.error('Failed to load analytics stats:', err));
    }, []);

    // Interactive States
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const [openModule, setOpenModule] = useState<number | null>(0);
    const [activeTab, setActiveTab] = useState<'sd-lead' | 'sd-transition'>('sd-lead');

    // Registration Form State
    const [regForm, setRegForm] = useState({
        email: '',
        fullName: '',
        phone: '',
        graduationYear: '2024',
        jobTitle: 'Software Engineer (SDE-1)',
        program: 'Forward Deployed Engineering'
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');

        try {
            const response = await fetch(`${API_BASE_URL}/api/program/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(regForm)
            });

            const data = await response.json();

            if (response.ok) {
                setIsSubmitted(true);
                setAnalytics(prev => ({ ...prev, totalRegistrations: prev.totalRegistrations + 1 }));
            } else {
                setErrorMessage(data.error || 'Failed to submit registration. Please try again.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setErrorMessage('An unexpected error occurred. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const courseTickerList = [
        "Forward Deployed Engineering",
        "Generative AI & Drug Discovery",
        "Quantum Computing Systems",
        "Data Engineering & AI Architecture",
        "Enterprise LLM Deployments"
    ];

    const modules = [
        {
            title: "Module 1 — Foundations of Forward Deployed Engineering",
            topics: [
                "Definition & Impact of FDE in Modern Tech Giants (Palantir, Scale AI, Snowflake)",
                "Bridging Systems Architecture with Enterprise Customer Workflows",
                "Requirements Engineering & Client Discovery Lifecycle",
                "Building Custom Data Engines vs Core Product Refactoring"
            ]
        },
        {
            title: "Module 2 — High-Performance Distributed Systems & Pipeline Engineering",
            topics: [
                "Scalable Data Ingestion & Transformation Architectures",
                "API Gateway Design & Microservices Interoperability",
                "Real-time Stream Processing & Fault Tolerance",
                "Database Partitioning & Low-Latency Query Optimization"
            ]
        },
        {
            title: "Module 3 — Enterprise AI Deployment & Hybrid Cloud Infrastructure",
            topics: [
                "Deploying LLMs & RAG Engines in Air-Gapped & On-Prem Environments",
                "Kubernetes & Infrastructure-as-Code (Terraform/Helm) for Client Environments",
                "Containerization, Orchestration & Security Hardening",
                "Continuous Integration & Continuous Delivery (CI/CD) for Hybrid Sites"
            ]
        },
        {
            title: "Module 4 — Client-Facing Architecture & Stakeholder Management",
            topics: [
                "Technical Communication & Executive Architecture Presentation",
                "Managing Scope Creep & Custom Feature Integration",
                "Designing SLA-backed Reliability Metrics (SLOs & SLIs)",
                "Post-Deployment Handoff & Customer Operations Excellence"
            ]
        },
        {
            title: "Module 5 — Security, Governance & On-Premises Compliance",
            topics: [
                "Zero Trust Security & Role-Based Access Control (RBAC)",
                "Data Privacy Frameworks (HIPAA, GDPR, SOC2 Type II)",
                "Audit Logging, Telemetry & Anomaly Detection",
                "Disaster Recovery & High Availability Strategies"
            ]
        },
        {
            title: "Module 6 — Capstone Project & FDE Technical Interview Preparation",
            topics: [
                "Real-World FDE Case Study: Deploying Enterprise AI Engine for Global Client",
                "FDE System Design Interview Mock Sessions & Coding Challenges",
                "Behavioral & Client Scenario Problem-Solving Drills",
                "Resume Review, Portfolio Building & Placement Assistance"
            ]
        }
    ];

    const upcomingEvents = [
        {
            id: 1,
            title: "Future of Software Engineering in the AI & FDE Era",
            date: "15th Sept, 2026",
            time: "7:00 PM IST",
            speaker: "Ashwin Kumaar",
            image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 2,
            title: "Designing Scalable RAG Pipelines for Enterprise Clients",
            date: "22nd Sept, 2026",
            time: "8:00 PM IST",
            speaker: "AI Systems Lead",
            image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        }
    ];

    const faqs = [
        {
            q: "What is a Forward Deployed Engineer (FDE)?",
            a: "A Forward Deployed Engineer (FDE) works at the intersection of deep software engineering and customer solution delivery. FDEs work directly with enterprise clients to build, deploy, and scale custom software and AI systems on top of core products."
        },
        {
            q: "Who should take this Masterclass & Program?",
            a: "Software Development Engineers (SDE-1, SDE-2), Technical Leads, Systems Engineers, and Solutions Architects who want to elevate their technical career, transition to high-paying FDE roles in top product companies, or lead end-to-end customer architecture."
        },
        {
            q: "How can I access the Course Brochure, PPT & Recorded Masterclass?",
            a: "Both the complete FDE Brochure PDF, FDE PPT presentation deck, and the Masterclass Video recording are displayed in separate dedicated containers below for instant viewing and downloading."
        },
        {
            q: "Will I get a Certificate of Completion?",
            a: "Yes! All participants who complete the masterclass and program assessments will receive a verified digital certificate shareable on LinkedIn and resume portfolios."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 font-sans text-slate-600 selection:bg-[#0f269a]/20">

            {/* Fixed Header Wrapper (Matching Landing Page Navbar Theme) */}
            <div className={`fixed top-0 z-50 w-full flex flex-col transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-xl shadow-md border-b border-slate-200' : 'bg-transparent'}`}>

                {/* Course Navigation Strip */}
                <div className={`text-white overflow-hidden relative transition-all duration-300 ${isScrolled ? 'bg-[#0f269a]' : 'bg-[#0f269a]/80 backdrop-blur-sm'}`}>
                    <style>{`
                        @keyframes marquee {
                            0% { transform: translateX(0); }
                            100% { transform: translateX(-50%); }
                        }
                        .animate-marquee {
                            animation: marquee 50s linear infinite;
                            width: max-content;
                        }
                        .animate-marquee:hover {
                            animation-play-state: paused;
                        }
                    `}</style>
                    <div className="flex animate-marquee py-2 items-center">
                        <div className="flex items-center space-x-12 px-6">
                            {courseTickerList.map((item, idx) => (
                                <span key={`orig-${idx}`} className="text-white/90 text-xs font-bold uppercase tracking-wider whitespace-nowrap flex items-center">
                                    <Star size={10} className="mr-2 text-[#fbbf24] fill-current" />
                                    {item}
                                </span>
                            ))}
                        </div>
                        <div className="flex items-center space-x-12 px-6">
                            {courseTickerList.map((item, idx) => (
                                <span key={`copy-${idx}`} className="text-white/90 text-xs font-bold uppercase tracking-wider whitespace-nowrap flex items-center">
                                    <Star size={10} className="mr-2 text-[#fbbf24] fill-current" />
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Navbar (Matches Landing Page Navigation Order) */}
                <nav id="home" className="flex justify-between items-center px-6 md:px-12 py-4 relative transition-all">
                    <div className="flex items-center space-x-2">
                        <a href="/">
                            <img src="/logo.png" alt="GenQuantaa Logo" className="h-10" />
                        </a>
                    </div>
                    <div className="hidden md:flex space-x-10 text-slate-600 font-medium text-sm">
                        <a href="/#about" className="hover:text-blue-400 transition-colors">About</a>
                        <a href="/#courses" className="hover:text-blue-400 transition-colors">Courses</a>
                        <a href="/quantum" className="hover:text-purple-500 font-semibold transition-colors flex items-center gap-1">Quantum</a>
                        <a href="/fde" className="text-[#0f269a] font-bold border-b-2 border-[#0f269a] transition-colors">FDE Masterclass</a>
                        <a href="/biologics" className="hover:text-purple-600 font-semibold transition-colors">Biologics</a>
                        <div className="relative group">
                            <a href="/#courses" className="hover:text-blue-400 transition-colors flex items-center gap-1">Brochure <ChevronRight size={14} className="rotate-90" /></a>
                            <ul className="absolute left-0 mt-2 w-48 bg-white border border-slate-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
                                <li><a href="/FDE%20Brochure.pdf" download className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">FDE Brochure PDF</a></li>
                                <li><a href="/FDE%20PPT.pptx" download className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">FDE PPT Deck</a></li>
                                <li><a href="/DATA%20SCINECE%20COURSE%20BROCHURE%20(3).pdf" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">Data Science Brochure</a></li>
                                <li><a href="/AI%20Course%20Broucher.pdf" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">AI Course Brochure</a></li>
                                <li><a href="/Quantum%20Computing%20(1).pdf" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">Quantum Computing Brochure</a></li>
                            </ul>
                        </div>
                        <a href="/#alumnis" className="hover:text-blue-400 transition-colors">Alumnis</a>
                        <a href="/become-trainer" className="text-slate-600 hover:text-[#0f269a] transition-colors">Become a Trainer</a>
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
                        <a href="/#about" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 font-semibold text-lg">About</a>
                        <a href="/#courses" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 font-semibold text-lg">Courses</a>
                        <a href="/quantum" onClick={() => setIsMobileMenuOpen(false)} className="text-purple-600 font-semibold text-lg">Quantum</a>
                        <a href="/fde" onClick={() => setIsMobileMenuOpen(false)} className="text-[#0f269a] font-bold text-lg">FDE Masterclass</a>
                        <a href="/biologics" onClick={() => setIsMobileMenuOpen(false)} className="text-purple-600 font-semibold text-lg">Biologics</a>

                        <div className="flex flex-col space-y-3">
                            <span className="text-slate-400 font-semibold text-sm uppercase tracking-wider">Brochures & PPT</span>
                            <a href="/FDE%20Brochure.pdf" download className="text-slate-600 pl-4 text-sm font-semibold text-[#0f269a]">FDE Brochure PDF</a>
                            <a href="/FDE%20PPT.pptx" download className="text-slate-600 pl-4 text-sm font-semibold text-purple-600">FDE PPT Presentation</a>
                            <a href="/DATA%20SCINECE%20COURSE%20BROCHURE%20(3).pdf" className="text-slate-600 pl-4 text-sm">Data Science Brochure</a>
                            <a href="/AI%20Course%20Broucher.pdf" className="text-slate-600 pl-4 text-sm">AI Course Brochure</a>
                        </div>

                        <a href="/#alumnis" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 font-semibold text-lg">Alumnis</a>
                        <a href="/become-trainer" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 font-semibold text-lg">Become a Trainer</a>
                        <a href="/#blog" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 font-semibold text-lg">Blog</a>
                        <a href="/#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 font-semibold text-lg">Contact</a>
                    </div>
                )}
            </div>

            {/* MAIN PAGE CONTAINER WITH AMBIENT BLOBS */}
            <div className="relative pt-[110px]">
                {/* Background Blobs for Sweeping Landing Page Curves */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[80%] bg-white/70 blur-3xl rounded-full transform -rotate-12"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[120%] bg-blue-200/40 blur-3xl rounded-full"></div>
                    <div className="absolute top-[20%] right-[20%] w-[40%] h-[60%] bg-cyan-100/40 blur-3xl rounded-full"></div>
                    <div className="absolute top-[10%] left-[30%] w-[30%] h-[40%] bg-purple-200/30 blur-3xl rounded-full"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 relative z-10">

                    {/* TWO-COLUMN GRID LAYOUT (Sticky Right Registration Sidebar matching Scaler layout) */}
                    <div className="grid lg:grid-cols-12 gap-8 items-start relative">

                        {/* ==================== LEFT COLUMN (Main Scrolling Content) ==================== */}
                        <div className="lg:col-span-7 space-y-12">

                            {/* Hero Header Card */}
                            <div className="space-y-6">
                                {/* High-Impact Hero Banner Graphic */}
                                <div className="relative group rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 bg-slate-900 transition-transform duration-300 hover:scale-[1.01]">
                                    <img
                                        src="/fde-hero-banner.jpg"
                                        alt="Transform Your Career From SDE to FDE — GenQuantaa Academy"
                                        className="w-full h-auto object-cover rounded-2xl"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                        <span className="text-white text-xs font-bold bg-[#0f269a]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-md">
                                            GenQuantaa Academy — SDE to FDE Career Transition Roadmap
                                        </span>
                                    </div>
                                </div>

                                <div className="inline-flex items-center gap-2 bg-[#0f269a]/10 border border-[#0f269a]/20 text-[#0f269a] text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-sm backdrop-blur-md">
                                    <Sparkles size={14} className="text-amber-500" /> GENQUANTAA FDE MASTERCLASS
                                </div>

                                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                                    Forward Deployed <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0f269a] via-blue-600 to-purple-600">
                                        Engineer (FDE)
                                    </span>
                                </h1>

                                <p className="text-slate-600 text-lg md:text-xl leading-relaxed font-medium">
                                    Bridge the gap between core software engineering, enterprise systems architecture, and deploying client AI solutions at scale.
                                </p>

                                {/* Event Meta Pills */}
                                <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl rounded-3xl p-5 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-3 bg-[#0f269a]/10 text-[#0f269a] rounded-2xl">
                                            <Calendar size={20} />
                                        </div>
                                        <div>
                                            <p className="text-slate-400 text-xs uppercase font-semibold">Date</p>
                                            <p className="font-bold text-slate-900">30th Sept 2026 (Wed)</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <div className="p-3 bg-purple-100 text-purple-700 rounded-2xl">
                                            <Clock size={20} />
                                        </div>
                                        <div>
                                            <p className="text-slate-400 text-xs uppercase font-semibold">Time</p>
                                            <p className="font-bold text-slate-900">7:30 - 10:00 PM IST</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 col-span-2 sm:col-span-1">
                                        <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <p className="text-slate-400 text-xs uppercase font-semibold">Instructor</p>
                                            <p className="font-bold text-slate-900">Ashwin Kumaar</p>
                                            <p className="text-xs text-slate-500">Ex-HCL</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Speaker Highlight Badge */}
                                <div className="flex items-center space-x-4 pt-2">
                                    <img
                                        src="/Ashwin.jpeg"
                                        alt="Ashwin Kumaar"
                                        className="w-12 h-12 rounded-full border-2 border-[#0f269a] object-cover shadow-md"
                                    />
                                    <div>
                                        <p className="text-xs text-[#0f269a] font-bold uppercase tracking-wider">Masterclass Lead Speaker</p>
                                        <p className="text-sm font-bold text-slate-900">Ashwin Kumaar</p>
                                        <p className="text-sm text-slate-600 font-normal">Ex-HCL & Systems Architect</p>
                                    </div>
                                </div>
                            </div>

                            {/* SEPARATE CONTAINER 1: MASTERCLASS VIDEO RECORDING */}
                            <section id="video-container" className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-xl border border-white/60 space-y-4">
                                <div className="border-b border-slate-200/80 pb-3 flex justify-between items-center">
                                    <div>
                                        <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 flex items-center gap-1">
                                            <Video size={14} /> Masterclass Recorded Session
                                        </span>
                                        <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-0.5">
                                            Forward Deployed Engineering Masterclass Video
                                        </h2>
                                    </div>
                                    <a
                                        href="https://youtu.be/KehyaPw5Mmg"
                                        target="_blank"
                                        rel="noreferrer"
                                        onClick={() => trackEvent('video_view')}
                                        className="text-[#0f269a] hover:underline font-bold text-xs flex items-center gap-1"
                                    >
                                        Open on YouTube <Maximize2 size={12} />
                                    </a>
                                </div>

                                <div
                                    className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900 bg-slate-900"
                                    onClick={() => trackEvent('video_view')}
                                >
                                    <iframe
                                        src="https://www.youtube.com/embed/KehyaPw5Mmg?rel=0&autoplay=0"
                                        title="Forward Deployed Engineer (FDE) Masterclass Video"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                        className="w-full h-full border-0"
                                    ></iframe>
                                </div>
                            </section>

                            {/* SEPARATE CONTAINER 2: COMPLETE FDE BROCHURE */}
                            <section id="brochure-container" className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-xl border border-white/60 space-y-4">
                                <div className="border-b border-slate-200/80 pb-3 flex justify-between items-center">
                                    <div>
                                        <span className="text-xs font-extrabold uppercase tracking-widest text-[#0f269a] flex items-center gap-1">
                                            <FileText size={14} /> Course Syllabus & Curriculum
                                        </span>
                                        <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-0.5">
                                            FDE Course Brochure
                                        </h2>
                                    </div>
                                    <a
                                        href="/FDE%20Brochure.pdf"
                                        download="FDE Brochure.pdf"
                                        onClick={() => trackEvent('brochure_download')}
                                        className="bg-[#0f269a] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#0a1a72] transition-colors flex items-center gap-1.5 shadow-md"
                                    >
                                        <Download size={14} /> Download Brochure PDF
                                    </a>
                                </div>

                                {/* Clean Auto-Moving Slide Display (No Black Container, No Extra Controls) */}
                                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
                                    <img
                                        src={`/brochure-slides/page_${brochurePage}.png`}
                                        alt={`FDE Brochure Page ${brochurePage}`}
                                        className="w-full h-auto object-cover rounded-xl transition-all duration-500"
                                    />
                                    {/* Subtle Slide Counter Overlay Badge */}
                                    <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md border border-white/20">
                                        Page {brochurePage} of {totalBrochurePages}
                                    </div>
                                </div>
                            </section>

                            {/* SEPARATE CONTAINER 3: FDE PPT PRESENTATION DECK */}
                            <section id="ppt-container" className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-xl border border-white/60 space-y-4">
                                <div className="border-b border-slate-200/80 pb-3 flex justify-between items-center">
                                    <div>
                                        <span className="text-xs font-extrabold uppercase tracking-widest text-purple-600 flex items-center gap-1">
                                            <Presentation size={14} /> System Architecture Deck
                                        </span>
                                        <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-0.5">
                                            FDE Masterclass Presentation PPT
                                        </h2>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <a
                                            href="/FDE%20PPT.pdf"
                                            target="_blank"
                                            rel="noreferrer"
                                            onClick={() => trackEvent('ppt_download')}
                                            className="text-purple-700 hover:underline text-xs font-bold"
                                        >
                                            View PDF
                                        </a>
                                        <a
                                            href="/FDE%20PPT.pptx"
                                            download="FDE PPT.pptx"
                                            onClick={() => trackEvent('ppt_download')}
                                            className="bg-purple-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-purple-700 transition-colors flex items-center gap-1.5 shadow-md"
                                        >
                                            <Download size={14} /> Download PPTX
                                        </a>
                                    </div>
                                </div>

                                {/* Clean Auto-Moving Slide Display (No Black Container, No Extra Controls) */}
                                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
                                    <img
                                        src={`/ppt-slides/slide_${pptPage}.png`}
                                        alt={`FDE Presentation Slide ${pptPage}`}
                                        className="w-full h-auto object-cover rounded-xl transition-all duration-500"
                                    />
                                    {/* Subtle Slide Counter Overlay Badge */}
                                    <div className="absolute bottom-4 right-4 bg-purple-900/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md border border-white/20">
                                        Slide {pptPage} of {totalPptPages}
                                    </div>
                                </div>
                            </section>

                            {/* SECTION 1: ABOUT THIS MASTERCLASS */}
                            <section id="about-masterclass" className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-lg border border-white/60 space-y-4">
                                <div className="border-b border-slate-200/80 pb-3">
                                    <span className="text-xs font-extrabold uppercase tracking-widest text-[#0f269a]">Overview</span>
                                    <h2 className="text-2xl font-extrabold text-slate-900 mt-1">About This Masterclass</h2>
                                </div>

                                <p className="text-slate-700 leading-relaxed text-sm">
                                    The <strong className="text-slate-900">Forward Deployed Engineer (FDE)</strong> role is one of the highest-paid, fastest-growing engineering positions in top tech companies like Palantir, Scale AI, Snowflake, and enterprise AI firms. FDEs solve complex engineering challenges right at the customer frontlines, deploying custom AI engines, data pipelines, and distributed software solutions directly into client environments.
                                </p>

                                <p className="text-slate-700 leading-relaxed text-sm">
                                    Join this exclusive masterclass with <strong className="text-slate-900">Ashwin Kumaar</strong> to understand the exact technical roadmap to becoming a Forward Deployed Engineer (FDE) and transition into product-driven enterprise architecture roles.
                                </p>
                            </section>

                            {/* SECTION 2: WHAT YOU WILL GAIN */}
                            <section id="what-you-will-gain" className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-lg border border-white/60 space-y-4">
                                <div className="border-b border-slate-200/80 pb-3">
                                    <span className="text-xs font-extrabold uppercase tracking-widest text-[#0f269a]">Learning Outcomes</span>
                                    <h2 className="text-2xl font-extrabold text-slate-900 mt-1">What You Will Gain From This Masterclass</h2>
                                </div>

                                <ul className="space-y-3 text-sm text-slate-700">
                                    {[
                                        "Understand the end-to-end architecture of deploying enterprise AI & software at scale.",
                                        "Learn real-world client integration patterns, CI/CD, and air-gapped security frameworks.",
                                        "Discover how to transition from traditional SDE/Service roles into high-paying FDE positions.",
                                        "Master technical communication & stakeholder architecture decision frameworks."
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex items-start space-x-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 shadow-sm">
                                            <CheckCircle size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                                            <span className="font-medium text-slate-800 text-xs sm:text-sm">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            {/* SECTION 3: MEET THE SPEAKER */}
                            <section id="speaker" className="bg-gradient-to-r from-[#0f269a] via-blue-900 to-indigo-950 text-white rounded-3xl p-6 md:p-8 shadow-xl space-y-4">
                                <div className="border-b border-white/20 pb-3">
                                    <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">Industry Expert</span>
                                    <h2 className="text-2xl font-extrabold text-white mt-0.5">Meet Ashwin Kumaar</h2>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-6 items-center">
                                    <img
                                        src="/Ashwin.jpeg"
                                        alt="Ashwin Kumaar"
                                        className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl border-4 border-amber-400 object-cover shadow-2xl flex-shrink-0"
                                    />
                                    <div className="space-y-3">
                                        <ul className="space-y-1.5 text-xs text-slate-200">
                                            <li className="flex items-center gap-2"><CheckCircle size={14} className="text-amber-400" /> Senior AI & Systems Architect</li>
                                            <li className="flex items-center gap-2"><CheckCircle size={14} className="text-amber-400" /> Ex-HCL</li>
                                            <li className="flex items-center gap-2"><CheckCircle size={14} className="text-amber-400" /> Ex-Palantir Lead Engineering Advisor</li>
                                            <li className="flex items-center gap-2"><CheckCircle size={14} className="text-amber-400" /> Co-Founder & Tech Ecosystem Builder</li>
                                        </ul>
                                        <p className="text-xs text-slate-300 italic">
                                            "Forward Deployed Engineering is the ultimate career accelerator for developers who want both technical mastery and product leadership."
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* SECTION 4: THIS MASTERCLASS IS FOR */}
                            <section id="target-audience" className="space-y-4">
                                <div className="border-b border-slate-200/80 pb-3">
                                    <span className="text-xs font-extrabold uppercase tracking-widest text-[#0f269a]">Target Audience</span>
                                    <h2 className="text-2xl font-extrabold text-slate-900 mt-1">This Masterclass is for</h2>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div
                                        onClick={() => setActiveTab('sd-lead')}
                                        className={`cursor-pointer rounded-3xl p-5 border-2 transition-all flex items-center space-x-4 ${activeTab === 'sd-lead'
                                                ? 'bg-white border-[#0f269a] shadow-xl'
                                                : 'bg-white/80 border-slate-200'
                                            }`}
                                    >
                                        <div className="p-3 bg-[#0f269a] text-white rounded-2xl flex-shrink-0">
                                            <BookOpen size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-sm">SDEs wanting to Lead</h3>
                                            <p className="text-xs text-slate-600 mt-0.5">
                                                Engineers looking to take customer architecture ownership.
                                            </p>
                                        </div>
                                    </div>

                                    <div
                                        onClick={() => setActiveTab('sd-transition')}
                                        className={`cursor-pointer rounded-3xl p-5 border-2 transition-all flex items-center space-x-4 ${activeTab === 'sd-transition'
                                                ? 'bg-white border-purple-600 shadow-xl'
                                                : 'bg-white/80 border-slate-200'
                                            }`}
                                    >
                                        <div className="p-3 bg-purple-600 text-white rounded-2xl flex-shrink-0">
                                            <Award size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-sm">SDEs wanting to Switch</h3>
                                            <p className="text-xs text-slate-600 mt-0.5">
                                                Developers aiming to transition into Product FDE roles.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* SECTION 5: DETAILED CURRICULUM ACCORDION */}
                            <section id="curriculum" className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-lg border border-white/60 space-y-4">
                                <div className="border-b border-slate-200/80 pb-3 flex justify-between items-center">
                                    <div>
                                        <span className="text-xs font-extrabold uppercase tracking-widest text-[#0f269a]">Syllabus</span>
                                        <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">Detailed FDE Curriculum</h2>
                                    </div>
                                    <span className="text-xs text-slate-500 font-semibold">6 Modules</span>
                                </div>

                                <div className="space-y-3">
                                    {modules.map((mod, index) => (
                                        <div key={index} className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
                                            <button
                                                className="w-full text-left px-5 py-3.5 flex justify-between items-center hover:bg-slate-100 transition-colors"
                                                onClick={() => setOpenModule(openModule === index ? null : index)}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <span className="w-7 h-7 rounded-full bg-[#0f269a]/10 text-[#0f269a] font-bold text-xs flex items-center justify-center">
                                                        0{index + 1}
                                                    </span>
                                                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">{mod.title}</h4>
                                                </div>
                                                {openModule === index ? <Minus size={16} className="text-slate-500" /> : <Plus size={16} className="text-slate-500" />}
                                            </button>

                                            {openModule === index && (
                                                <div className="px-5 py-4 border-t border-slate-200 bg-white">
                                                    <ul className="space-y-2 text-xs text-slate-700">
                                                        {mod.topics.map((t, tidx) => (
                                                            <li key={tidx} className="flex items-start space-x-2.5">
                                                                <CheckCircle size={14} className="text-[#0f269a] flex-shrink-0 mt-0.5" />
                                                                <span>{t}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* SECTION 6: FAQs */}
                            <section id="faqs" className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-lg border border-white/60 space-y-4">
                                <div className="border-b border-slate-200/80 pb-3">
                                    <span className="text-xs font-extrabold uppercase tracking-widest text-[#0f269a]">Support</span>
                                    <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">Frequently Asked Questions</h2>
                                </div>

                                <div className="space-y-2">
                                    {faqs.map((faq, index) => (
                                        <div key={index} className="border-b border-slate-100 last:border-0 pb-3">
                                            <button
                                                className="w-full text-left py-2.5 font-bold text-slate-900 flex justify-between items-center text-xs sm:text-sm hover:text-[#0f269a] transition-colors"
                                                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                            >
                                                <span>{faq.q}</span>
                                                {openFaq === index ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                                            </button>
                                            {openFaq === index && (
                                                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                                                    {faq.a}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>

                        </div>

                        {/* ==================== RIGHT COLUMN (Sticky Lead Registration Form Sidebar) ==================== */}
                        <div className="lg:col-span-5 lg:sticky lg:top-28 z-30 space-y-6">

                            {/* Sticky Registration Form Card (Matching Scaler Layout) */}
                            <div className="bg-white/95 backdrop-blur-xl text-slate-900 rounded-3xl p-6 md:p-7 shadow-2xl border border-white/80 relative">
                                <div className="absolute top-0 right-0 bg-[#0f269a] text-white text-[10px] font-extrabold uppercase px-4 py-1 rounded-bl-2xl rounded-tr-3xl tracking-widest shadow">
                                    FREE ACCESS
                                </div>

                                <h3 className="text-xl font-extrabold text-slate-900 mb-1">
                                    Register for Masterclass
                                </h3>
                                <p className="text-xs text-slate-500 mb-5 font-medium">
                                    Get instant access to Brochure PDF, PPT Deck & Recorded Video.
                                </p>

                                {isSubmitted ? (
                                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl p-6 text-center space-y-3">
                                        <CheckCircle size={44} className="mx-auto text-emerald-600" />
                                        <h4 className="text-base font-bold">Registration Complete!</h4>
                                        <p className="text-xs text-emerald-700">
                                            We've emailed access links along with FDE Brochure & PPT deck to <span className="font-bold">{regForm.email}</span>.
                                        </p>
                                        <div className="pt-2">
                                            <a
                                                href="#brochure-container"
                                                className="inline-block bg-[#0f269a] text-white text-xs font-bold px-5 py-2.5 rounded-2xl shadow hover:bg-[#0a1a72] transition-colors"
                                            >
                                                View Interactive Brochure & PPT ↓
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleFormSubmit} className="space-y-3.5">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                                Email ID <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                placeholder="enter your Email ID"
                                                value={regForm.email}
                                                onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                                                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f269a] text-slate-800"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                                Full Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="enter your Full Name"
                                                value={regForm.fullName}
                                                onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                                                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f269a] text-slate-800"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                                Phone Number <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                placeholder="enter your Phone Number"
                                                value={regForm.phone}
                                                onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                                                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f269a] text-slate-800"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                                    Graduation Year <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    value={regForm.graduationYear}
                                                    onChange={(e) => setRegForm({ ...regForm, graduationYear: e.target.value })}
                                                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f269a] text-slate-800"
                                                >
                                                    <option value="2026">2026</option>
                                                    <option value="2025">2025</option>
                                                    <option value="2024">2024</option>
                                                    <option value="2023">2023</option>
                                                    <option value="2022">2022</option>
                                                    <option value="Earlier">Earlier</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                                    Job Title <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    value={regForm.jobTitle}
                                                    onChange={(e) => setRegForm({ ...regForm, jobTitle: e.target.value })}
                                                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f269a] text-slate-800"
                                                >
                                                    <option value="Software Engineer (SDE-1)">SDE-1</option>
                                                    <option value="Senior SDE (SDE-2)">SDE-2 / Senior</option>
                                                    <option value="Tech Lead / Manager">Tech Lead</option>
                                                    <option value="Student">Student</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                                Program of Interest <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={regForm.program}
                                                onChange={(e) => setRegForm({ ...regForm, program: e.target.value })}
                                                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f269a] text-slate-800"
                                            >
                                                <option value="Forward Deployed Engineering">Forward Deployed Engineering (FDE)</option>
                                                <option value="Generative AI for Drug Discovery">Generative AI for Drug Discovery</option>
                                                <option value="Quantum Computing & AI">Quantum Computing & AI</option>
                                            </select>
                                        </div>

                                        {errorMessage && (
                                            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                                                {errorMessage}
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-[#0f269a] hover:bg-[#0a1a72] disabled:bg-[#0f269a]/60 text-white font-bold py-3 text-xs sm:text-sm rounded-2xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:transform-none flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Submitting...
                                                </>
                                            ) : (
                                                'Register & Access Resources'
                                            )}
                                        </button>

                                        <p className="text-[11px] text-slate-400 text-center">
                                            By registering, you agree to receive masterclass updates & resources.
                                        </p>
                                    </form>
                                )}
                            </div>

                            {/* Hotline Card */}
                            <div className="bg-[#0a1a72] text-white p-5 rounded-3xl shadow-lg space-y-2 border border-white/20">
                                <div className="flex items-center gap-2 text-amber-400 text-xs font-extrabold uppercase">
                                    <PhoneCall size={16} /> Need Assistance?
                                </div>
                                <p className="text-xs text-slate-200">
                                    Talk to our Senior FDE Career Advisors at <a href="tel:+917036955133" className="text-amber-300 font-bold underline">+91 7036955133</a>
                                </p>
                            </div>

                        </div>

                    </div>

                </div>
            </div>

            {/* Footer - Redesigned & Interactive (Matches Landing Page) */}
            <footer className="relative bg-slate-50 text-slate-400 py-16 border-t border-slate-200 overflow-hidden mt-16">
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
            </footer>

        </div>
    );
};

export default ProgramPage;
