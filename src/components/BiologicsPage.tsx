import React, { useState, useEffect } from 'react';
import {
    CheckCircle,
    User,
    Mail,
    Phone,
    Lock,
    Unlock,
    ChevronDown,
    ChevronUp,
    ChevronRight,
    Star,
    Search,
    Clock,
    X,
    Menu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const BiologicsPage: React.FC = () => {
    const navigate = useNavigate();

    // Standard Navbar State (Matching FDE / ProgramPage & LandingPage)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const courseTickerList = [
        "Special Issues for AI in Drug Discovery Centers",
        "Week 1 to Week 12 Module Live Project Work",
        "WORK IN PROJECTS | PUBLISH PAPERS | GET WORK EXPERIENCE IN AI ML",
        "ADMISSIONS OPEN — LIVE INDUCTION ON 20TH AUGUST 2026",
        "AIML / DS PLACEMENT ASSISTANCE & MENTORSHIP"
    ];

    // Gated Content State
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [unlockedUser, setUnlockedUser] = useState<{ name: string; email: string; phone: string } | null>(null);

    // Form inputs for unlocking (matching user screenshot #2)
    const [unlockForm, setUnlockForm] = useState({
        name: '',
        phone: '',
        email: ''
    });
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [unlockError, setUnlockError] = useState('');
    const [unlockSuccess, setUnlockSuccess] = useState(false);

    // Accordions
    const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

    // Check localStorage on mount
    useEffect(() => {
        const savedUnlock = localStorage.getItem('biologics_details_unlocked');
        if (savedUnlock === 'true') {
            setIsUnlocked(true);
            const savedName = localStorage.getItem('biologics_user_name') || 'Scholar';
            const savedEmail = localStorage.getItem('biologics_user_email') || '';
            const savedPhone = localStorage.getItem('biologics_user_phone') || '';
            setUnlockedUser({ name: savedName, email: savedEmail, phone: savedPhone });
        }
    }, []);

    // Page title
    useEffect(() => {
        document.title = "Special Issues for AI in Drug Discovery | Biologics";
    }, []);

    const handleUnlockSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUnlockError('');

        if (!unlockForm.name.trim()) {
            setUnlockError('Please enter your full name.');
            return;
        }
        if (!unlockForm.phone.trim() || unlockForm.phone.trim().length < 8) {
            setUnlockError('Please enter a valid phone number.');
            return;
        }
        if (!unlockForm.email.trim() || !unlockForm.email.includes('@')) {
            setUnlockError('Please enter a valid email address.');
            return;
        }

        setIsUnlocking(true);
        try {
            await fetch(`${API_BASE_URL}/api/program/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: unlockForm.name.trim(),
                    email: unlockForm.email.trim(),
                    phone: unlockForm.phone.trim(),
                    program: 'Biologics & AI in Drug Discovery (12-Week Live Projects)',
                    graduationYear: 'N/A',
                    jobTitle: 'Scholar / Learner'
                })
            });

            localStorage.setItem('biologics_details_unlocked', 'true');
            localStorage.setItem('biologics_user_name', unlockForm.name.trim());
            localStorage.setItem('biologics_user_email', unlockForm.email.trim());
            localStorage.setItem('biologics_user_phone', unlockForm.phone.trim());

            setUnlockedUser({
                name: unlockForm.name.trim(),
                email: unlockForm.email.trim(),
                phone: unlockForm.phone.trim()
            });

            setUnlockSuccess(true);
            setTimeout(() => {
                setIsUnlocked(true);
            }, 400);
        } catch (err) {
            console.error('Failed to submit lead data:', err);
            localStorage.setItem('biologics_details_unlocked', 'true');
            localStorage.setItem('biologics_user_name', unlockForm.name.trim());
            setUnlockedUser({
                name: unlockForm.name.trim(),
                email: unlockForm.email.trim(),
                phone: unlockForm.phone.trim()
            });
            setIsUnlocked(true);
        } finally {
            setIsUnlocking(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 font-sans text-slate-600 selection:bg-[#0f269a]/20">

            {/* Fixed Header Wrapper (Matching FDE Masterclass & Landing Page Theme) */}
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

                {/* Navbar (Matches Landing Page & FDE Navigation Order) */}
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
                        <a href="/fde" className="hover:text-emerald-500 font-semibold transition-colors">FDE Masterclass</a>
                        <a href="/biologics" className="text-[#0f269a] font-bold border-b-2 border-[#0f269a] transition-colors">Biologics</a>
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
                        <a href="/fde" onClick={() => setIsMobileMenuOpen(false)} className="text-emerald-600 font-semibold text-lg">FDE Masterclass</a>
                        <a href="/biologics" onClick={() => setIsMobileMenuOpen(false)} className="text-[#0f269a] font-bold text-lg">Biologics</a>

                        <div className="flex flex-col space-y-3">
                            <span className="text-slate-400 font-semibold text-sm uppercase tracking-wider">Brochures & PPT</span>
                            <a href="/DATA%20SCINECE%20COURSE%20BROCHURE%20(3).pdf" download className="text-slate-600 pl-4 text-sm">Data Science Brochure</a>
                            <a href="/AI%20Course%20Broucher.pdf" download className="text-slate-600 pl-4 text-sm">AI Course Brochure</a>
                            <a href="/Quantum%20Computing%20(1).pdf" download className="text-slate-600 pl-4 text-sm">Quantum Computing Brochure</a>
                        </div>

                        <a href="/#alumnis" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 font-semibold text-lg">Alumnis</a>
                        <a href="/become-trainer" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 font-semibold text-lg">Become a Trainer</a>
                        <a href="/#blog" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 font-semibold text-lg">Blog</a>
                        <a href="/#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 font-semibold text-lg">Contact</a>
                    </div>
                )}
            </div>

            {/* SPACER FOR FIXED NAVBAR */}
            <div className="pt-28 md:pt-36"></div>

            {/* HERO SESSION (COMPLETELY UNBLURRED & FULLY VISIBLE) */}
            <section className="bg-gradient-to-b from-blue-50/30 via-white to-white pt-6 pb-8 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
                <div className="max-w-6xl mx-auto">

                    {/* Top Row: Clean Banner Image (No Video Button/Overlays) + Course Overview Card */}
                    <div className="grid md:grid-cols-12 gap-8 items-start mb-8">

                        {/* Left Column: Clean Image Only (No Play Button, No Video Overlays) */}
                        <div className="md:col-span-7">
                            <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-white">
                                <img
                                    src="/drug-discovery-ai.png"
                                    alt="Next-Gen Drug Discovery with AI"
                                    className="w-full h-auto object-cover"
                                />
                            </div>

                            {/* Quick Highlights Row */}
                            <div className="grid grid-cols-3 gap-3 text-center mt-4">
                                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                                    <div className="text-base sm:text-xl font-black text-[#0f269a]">12 Weeks</div>
                                    <div className="text-[11px] text-slate-500 font-semibold uppercase">Live Projects</div>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                                    <div className="text-base sm:text-xl font-black text-purple-700">Scopus/PubMed</div>
                                    <div className="text-[11px] text-slate-500 font-semibold uppercase">Paper Support</div>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                                    <div className="text-base sm:text-xl font-black text-emerald-700">100% Practical</div>
                                    <div className="text-[11px] text-slate-500 font-semibold uppercase">In-Silico Coding</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Course Overview & Details Card */}
                        <div className="md:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xl shadow-blue-900/5">
                            <div className="flex items-center justify-between mb-4">
                                <span className="bg-blue-50 text-[#0f269a] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                                    Executive Program
                                </span>
                                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                                    <Star size={15} className="fill-amber-400 text-amber-400" />
                                    <span>4.9 (1,247 reviews)</span>
                                </div>
                            </div>

                            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2 leading-tight">
                                AI in Drug Discovery &amp; Biologics Masterclass
                            </h3>
                            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                                Complete 12-week comprehensive project program designed to help scholars &amp; engineers build molecular AI models and publish research papers.
                            </p>

                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-5">
                                <div className="text-xs text-slate-500 font-semibold">Special Admission Fee</div>
                                <div className="flex items-baseline gap-3 mt-1">
                                    <span className="text-2xl sm:text-3xl font-black text-[#0f269a]">₹35,000 + GST</span>
                                    <span className="text-sm text-slate-400 line-through">₹1,00,000</span>
                                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">65% OFF</span>
                                </div>
                                <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
                                    <Clock size={13} className="text-blue-600" />
                                    <span>Next Live Induction: <strong>20th August 2026</strong></span>
                                </div>
                            </div>

                            <ul className="space-y-2 mb-6 text-xs text-slate-700">
                                <li className="flex items-center gap-2">
                                    <CheckCircle size={15} className="text-emerald-500 flex-shrink-0" />
                                    <span>Live In-Silico Project Work from Week 1 to 12</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle size={15} className="text-emerald-500 flex-shrink-0" />
                                    <span>Research Paper Drafting &amp; Journal Mentorship</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle size={15} className="text-emerald-500 flex-shrink-0" />
                                    <span>RDKit, PyTorch Geometric, AlphaFold &amp; Docking</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle size={15} className="text-emerald-500 flex-shrink-0" />
                                    <span>Verified Digital Certificate &amp; Placement Support</span>
                                </li>
                            </ul>

                            <div className="space-y-2.5">
                                <a
                                    href="#curriculum"
                                    className="w-full bg-[#0f269a] hover:bg-[#0a1a72] text-white font-extrabold py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                                >
                                    {!isUnlocked ? <Lock size={15} /> : <Unlock size={15} />}
                                    {!isUnlocked ? 'Unlock Full Course Details' : 'View Unlocked Curriculum'}
                                </a>
                                <a
                                    href="tel:+917036955133"
                                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 rounded-2xl transition-all flex items-center justify-center gap-2 text-xs"
                                >
                                    Speak with Academic Advisor (+91 7036955133)
                                </a>
                            </div>
                        </div>

                    </div>

                    {/* Bottom of Hero: The Centered Announcements from Image 1 & 2 */}
                    <div className="text-center pt-6 border-t border-slate-200">
                        <h2 className="text-base sm:text-xl font-bold text-[#6366f1] mb-2">
                            Special Issues for AI in Drug Discovery Centers
                        </h2>
                        <h3 className="text-base sm:text-xl font-bold text-[#2563eb] mb-3">
                            Week 1 to Week 12 Module Live Project Work
                        </h3>
                        <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-[#1e40af] tracking-tight uppercase mb-4 leading-snug">
                            WORK IN PROJECTS | PUBLISH PAPERS | GET WORK EXPERIENCE in AI ML
                        </h1>
                        <div className="text-slate-900 font-extrabold text-base sm:text-xl uppercase tracking-wider mb-1">
                            ADMISSIONS OPEN
                        </div>
                        <div className="text-slate-800 font-bold text-base sm:text-lg">
                            LIVE Induction on 20th August 2026
                        </div>
                    </div>

                </div>
            </section>

            {/* ========================================================================= */}
            {/* AFTER HERO SESSION: ALL CONTENT VISIBLE IN BLUR UNTIL USER FILLS THE FORM */}
            {/* ========================================================================= */}
            <div className="relative max-w-5xl mx-auto px-4 sm:px-6">

                {/* THE UNLOCK MODAL OVERLAY (Positioned over the blurred content like Screenshot 2) */}
                {!isUnlocked && (
                    <div className="sticky top-32 z-40 my-8 flex justify-center pointer-events-auto">
                        <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.25)] border-2 border-purple-200 max-w-md w-full animate-fadeIn">
                            <div className="text-center mb-5">
                                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-2.5">
                                    <Lock size={22} />
                                </div>
                                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                                    Unlock the full Course details
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    Enter your details below to clear the blur and view the complete curriculum, module topics &amp; project guidelines.
                                </p>
                            </div>

                            {unlockSuccess ? (
                                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                                    <CheckCircle size={32} className="text-emerald-600 mx-auto animate-bounce" />
                                    <h4 className="font-extrabold text-emerald-900 text-sm">Course Details Unlocked!</h4>
                                    <p className="text-xs text-emerald-700">Clearing blur and displaying full content below...</p>
                                </div>
                            ) : (
                                <form onSubmit={handleUnlockSubmit} className="space-y-3.5">
                                    <div>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Raj Mange"
                                            value={unlockForm.name}
                                            onChange={(e) => setUnlockForm({ ...unlockForm, name: e.target.value })}
                                            className="w-full px-4 py-3 text-sm bg-[#ebf3fe] border border-[#d6e4fd] rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium placeholder-slate-400"
                                        />
                                    </div>

                                    <div>
                                        <input
                                            type="tel"
                                            required
                                            placeholder="09980113561"
                                            value={unlockForm.phone}
                                            onChange={(e) => setUnlockForm({ ...unlockForm, phone: e.target.value })}
                                            className="w-full px-4 py-3 text-sm bg-[#ebf3fe] border border-[#d6e4fd] rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium placeholder-slate-400"
                                        />
                                    </div>

                                    <div>
                                        <input
                                            type="email"
                                            required
                                            placeholder="rajmange94@gmail.com"
                                            value={unlockForm.email}
                                            onChange={(e) => setUnlockForm({ ...unlockForm, email: e.target.value })}
                                            className="w-full px-4 py-3 text-sm bg-[#ebf3fe] border border-[#d6e4fd] rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium placeholder-slate-400"
                                        />
                                    </div>

                                    {unlockError && (
                                        <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                                            {unlockError}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isUnlocking}
                                        className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-extrabold py-3.5 rounded-xl shadow-lg transition-all active:scale-[0.99] text-sm disabled:opacity-60 flex items-center justify-center gap-2"
                                    >
                                        {isUnlocking ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Unlocking...
                                            </>
                                        ) : (
                                            'Unlock'
                                        )}
                                    </button>
                                    <p className="text-[11px] text-slate-400 text-center">
                                        🔒 Instant unlock • Your contact details remain confidential.
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                )}

                {/* THE ENTIRE BELOW CONTENT: VISIBLE IN THE BLUR BEFORE UNLOCKING, CRISP AFTER UNLOCKING */}
                <div
                    id="curriculum"
                    className={`transition-all duration-700 pb-20 ${
                        !isUnlocked
                            ? 'filter blur-[12px] pointer-events-none select-none opacity-60'
                            : 'filter-none opacity-100'
                    }`}
                >

                    {/* RED HEADER: AIML/DS Placement Assistance */}
                    <div className="text-center my-8">
                        <h3 className="text-xl sm:text-3xl font-black text-[#ef4444] uppercase tracking-wide">
                            AIML/DS Placement Assistance
                        </h3>
                    </div>

                    {/* SECTION: WHO CAN JOIN AND WHO SHOULD JOIN? */}
                    <div id="who-can-join" className="mb-12 text-slate-700 space-y-4">
                        <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 uppercase tracking-tight">
                            WHO CAN JOIN AND WHO SHOULD JOIN?
                        </h4>
                        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
                            This program is structured for Life Science, Pharma, Biotechnology, Bioinformatics, and Chemistry graduates, postgraduates, and researchers who want to transition from traditional wet-lab workflows into high-impact in-silico computational biology and AI-driven drug discovery.
                        </p>
                        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
                            Software Engineers, Machine Learning Practitioners, and Data Scientists who want to apply neural networks, graph algorithms, and generative chemistry models to the biotechnology sector are also encouraged to participate.
                        </p>

                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-2 mt-4">
                            <h5 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Target Audience &amp; Eligibility:</h5>
                            <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-600">
                                <li>B.Pharm, M.Pharm, Pharm.D scholars &amp; industry scientists</li>
                                <li>B.Tech, M.Tech, M.Sc, or Ph.D in Bioinformatics, Biotechnology, Computational Biology, or Chemistry</li>
                                <li>Researchers and Faculty seeking to publish high-impact Scopus/PubMed indexed papers</li>
                                <li>Data Scientists &amp; Software Engineers looking for authentic domain project experience</li>
                            </ul>
                        </div>
                    </div>

                    {/* SECTION: Why Join This Program? */}
                    <div id="why-join" className="mb-12 text-slate-700 space-y-4">
                        <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 uppercase tracking-tight">
                            Why Join This Program?
                        </h4>
                        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
                            Unlike purely theoretical courses, this masterclass provides end-to-end hands-on training with real pharmaceutical datasets. Every participant works on live projects from Week 1 to Week 12 under the guidance of senior computational biologists and AI researchers.
                        </p>
                        <div className="grid sm:grid-cols-2 gap-4 pt-2">
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                                <h5 className="font-bold text-slate-900 text-sm mb-1">01. Live Project Execution</h5>
                                <p className="text-xs text-slate-600">Build production-grade computational pipelines for target identification, molecular docking, and QSAR modeling.</p>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                                <h5 className="font-bold text-slate-900 text-sm mb-1">02. Publish Research Papers</h5>
                                <p className="text-xs text-slate-600">Step-by-step guidance from hypothesis formulation to manuscript writing and peer-reviewed journal submission.</p>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                                <h5 className="font-bold text-slate-900 text-sm mb-1">03. Real AI/ML Work Experience</h5>
                                <p className="text-xs text-slate-600">Industry-verifiable portfolio with modern frameworks including RDKit, PyTorch Geometric, AutoDock, and DiffDock.</p>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                                <h5 className="font-bold text-slate-900 text-sm mb-1">04. Placement &amp; Mentorship</h5>
                                <p className="text-xs text-slate-600">1-on-1 resume reviews, interview mock sessions, and direct hiring referrals to biotech partners.</p>
                            </div>
                        </div>
                    </div>

                    {/* SECTION: Relevance of AI/Drug Discovery for Life Science Career */}
                    <div className="mb-14 text-slate-700 space-y-4">
                        <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 uppercase tracking-tight">
                            Relevance of AI/Drug Discovery for Life Science Career
                        </h4>
                        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
                            Traditional pharmaceutical drug discovery takes an average of 12–15 years and costs billions of dollars. Artificial Intelligence and machine learning compress preclinical candidate screening timelines from years into weeks. By acquiring skills in In-Silico Biology, Graph Neural Networks, and Generative Chemistry, you position yourself at the forefront of the most lucrative and rapidly expanding segment of the global biopharma industry.
                        </p>
                    </div>

                    {/* SECTION: Curriculum Details (Week 1 to Week 5) */}
                    <div className="mb-14">
                        <div className="text-center mb-8">
                            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full uppercase tracking-wider border border-purple-200">
                                12-Week Syllabus
                            </span>
                            <h4 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 uppercase tracking-wide">
                                Curriculum Details
                            </h4>
                        </div>

                        <div className="space-y-6">
                            {/* Week 1 */}
                            <div className="bg-slate-50 p-6 sm:p-7 rounded-3xl border border-slate-200">
                                <span className="bg-[#0f269a] text-white text-xs font-black px-3 py-1 rounded-lg uppercase">Week 1</span>
                                <h5 className="text-base sm:text-lg font-bold text-slate-900 mt-3 mb-2">
                                    Foundations of Drug Discovery
                                </h5>
                                <p className="text-xs sm:text-sm text-slate-600 mb-3 leading-relaxed">
                                    Introduction to modern drug design pipelines, biological target identification, and therapeutic assay screening paradigms.
                                </p>
                                <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-700">
                                    <li>Target Identification &amp; Validation: Disease biology, pathways, and druggability assessment</li>
                                    <li>High-Throughput Screening (HTS) vs High-Content Screening (HCS) assays</li>
                                    <li>Structure-Based Drug Design (SBDD) vs Ligand-Based Drug Design (LBDD)</li>
                                    <li>Exploration of chemical databases: PubChem, ChEMBL, PDB (Protein Data Bank), and UniProt</li>
                                </ul>
                            </div>

                            {/* Week 2 */}
                            <div className="bg-slate-50 p-6 sm:p-7 rounded-3xl border border-slate-200">
                                <span className="bg-[#0f269a] text-white text-xs font-black px-3 py-1 rounded-lg uppercase">Week 2</span>
                                <h5 className="text-base sm:text-lg font-bold text-slate-900 mt-3 mb-2">
                                    Foundations of Python for Drug Discovery
                                </h5>
                                <p className="text-xs sm:text-sm text-slate-600 mb-3 leading-relaxed">
                                    Scientific programming in Python, cheminformatics data representations, and molecular structure manipulation.
                                </p>
                                <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-700">
                                    <li>Python Scientific Stack: NumPy, Pandas, SciPy, Matplotlib for life-sciences data</li>
                                    <li>RDKit Deep-Dive: Parsing SMILES, InChI, Mol2, and SDF chemical formats</li>
                                    <li>Computing Physicochemical Properties: Molecular weight, logP, TPSA, H-bond donors/acceptors</li>
                                    <li>BioPython: Sequence parsing (FASTA), pairwise alignments, and 3D PDB structure analysis</li>
                                </ul>
                            </div>

                            {/* Week 3 */}
                            <div className="bg-slate-50 p-6 sm:p-7 rounded-3xl border border-slate-200">
                                <span className="bg-[#0f269a] text-white text-xs font-black px-3 py-1 rounded-lg uppercase">Week 3</span>
                                <h5 className="text-base sm:text-lg font-bold text-slate-900 mt-3 mb-2">
                                    ADME Physicochemical Profiling, Molecular Properties
                                </h5>
                                <p className="text-xs sm:text-sm text-slate-600 mb-3 leading-relaxed">
                                    Pharmacokinetic profiling in-silico and Quantitative Structure-Activity Relationship (QSAR) predictive modeling.
                                </p>
                                <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-700">
                                    <li>Lipinski's Rule of 5, Veber's criteria, and drug-likeness filters</li>
                                    <li>ADMET In-Silico: Absorption, Distribution, Metabolism, Excretion, and Toxicity risk assessment</li>
                                    <li>Predicting hERG cardiotoxicity, Ames mutagenicity, and liver clearance</li>
                                    <li>Feature Representation: Morgan Circular Fingerprints, MACCS Keys, and 2D/3D descriptors</li>
                                    <li>Building predictive QSAR classification &amp; regression models with Scikit-Learn &amp; XGBoost</li>
                                </ul>
                            </div>

                            {/* Week 4 */}
                            <div className="bg-slate-50 p-6 sm:p-7 rounded-3xl border border-slate-200">
                                <span className="bg-[#0f269a] text-white text-xs font-black px-3 py-1 rounded-lg uppercase">Week 4</span>
                                <h5 className="text-base sm:text-lg font-bold text-slate-900 mt-3 mb-2">
                                    Deep Learning for Drug Discovery
                                </h5>
                                <p className="text-xs sm:text-sm text-slate-600 mb-3 leading-relaxed">
                                    Applying graph neural networks and chemical language models to predict molecular properties and binding affinities.
                                </p>
                                <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-700">
                                    <li>Representing molecules as graphs: Atoms as nodes, chemical bonds as edges</li>
                                    <li>Graph Convolutional Networks (GCNs) and Graph Attention Networks (GATs) in PyTorch Geometric</li>
                                    <li>Transformer models for chemistry: ChemBERTa, SMILES-BERT, and MolFormer</li>
                                    <li>Predicting drug-target binding affinity (Kd, Ki, IC50) with deep graph models</li>
                                </ul>
                            </div>

                            {/* Week 5 */}
                            <div className="bg-slate-50 p-6 sm:p-7 rounded-3xl border border-slate-200">
                                <span className="bg-[#0f269a] text-white text-xs font-black px-3 py-1 rounded-lg uppercase">Week 5</span>
                                <h5 className="text-base sm:text-lg font-bold text-slate-900 mt-3 mb-2">
                                    Integration of Applications in Current Trends
                                </h5>
                                <p className="text-xs sm:text-sm text-slate-600 mb-3 leading-relaxed">
                                    Generative chemistry, AlphaFold 3D protein structure prediction, and automated molecular docking simulations.
                                </p>
                                <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-700">
                                    <li>Generative AI in Drug Discovery: Variational Autoencoders (VAEs) and Denoising Diffusion Models</li>
                                    <li>De Novo Drug Candidate Generation with targeted physicochemical and binding constraints</li>
                                    <li>AlphaFold &amp; ESMFold: Leveraging predicted 3D protein coordinates for virtual screening</li>
                                    <li>Automated Molecular Docking with AutoDock Vina &amp; DiffDock pipelines</li>
                                    <li>End-to-End Virtual Screening Workflow: From 100,000 compound libraries to top 10 lead candidates</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* SECTION: Major Live Projects */}
                    <div id="projects" className="mb-14">
                        <div className="text-center mb-8">
                            <h4 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-wide">
                                Major Live Projects
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-600 mt-1">
                                Real scientific problem statements solved with production AI models.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-5">
                            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">Live Project 1</span>
                                <h5 className="font-extrabold text-slate-900 mt-3 mb-2 text-base">
                                    Target Identification &amp; Binding Affinity Prediction
                                </h5>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Build an end-to-end Graph Neural Network (GNN) in PyTorch to predict drug-target interaction and binding affinity (IC50) for oncology kinase targets.
                                </p>
                            </div>

                            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">Live Project 2</span>
                                <h5 className="font-extrabold text-slate-900 mt-3 mb-2 text-base">
                                    High-Throughput Virtual Screening Pipeline
                                </h5>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Screen a virtual library of over 500,000 small molecules against a viral protease target, filtering for high affinity, drug-likeness, and low cytotoxicity.
                                </p>
                            </div>

                            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">Live Project 3</span>
                                <h5 className="font-extrabold text-slate-900 mt-3 mb-2 text-base">
                                    De Novo Molecular Generation with Diffusion Models
                                </h5>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Generate novel, patentable small-molecule drug candidates optimized for blood-brain barrier (BBB) penetration using generative diffusion AI.
                                </p>
                            </div>

                            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">Live Project 4</span>
                                <h5 className="font-extrabold text-slate-900 mt-3 mb-2 text-base">
                                    ADMET In-Silico Toxicology Risk Classifier
                                </h5>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Train an ensemble deep learning classifier to identify mutagenic, cardiotoxic, and hepatotoxic liabilities early in the preclinical pipeline.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* SECTION: Frequently Asked Questions */}
                    <div id="faq" className="mb-14">
                        <div className="text-center mb-8">
                            <h4 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-wide">
                                Frequently Asked Questions
                            </h4>
                        </div>

                        <div className="space-y-3">
                            {[
                                {
                                    q: "Do I need prior coding experience?",
                                    a: "No prior software programming experience is required. Week 2 covers Python and cheminformatics libraries (RDKit, BioPython) from fundamental basics to advanced operations."
                                },
                                {
                                    q: "How does the research paper publication process work?",
                                    a: "In Weeks 6 to 12, each scholar is assigned a dedicated mentor. We guide you through literature review, dataset curating, experimental validation, manuscript drafting, and journal submission."
                                },
                                {
                                    q: "Will I receive placement assistance?",
                                    a: "Yes! Scholars receive resume optimization highlighting their live projects and GitHub repositories, interview training, and referrals to partnering pharma and biotech firms."
                                },
                                {
                                    q: "Is there an official certificate awarded?",
                                    a: "Yes, upon completing the course modules, live projects, and viva assessment, you will receive an official verifiable digital certificate from GenQuantaa Academy."
                                }
                            ].map((faq, idx) => (
                                <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                                    <button
                                        onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                                        className="w-full px-6 py-4 text-left text-sm font-bold text-slate-900 flex justify-between items-center hover:bg-slate-50 transition-colors"
                                    >
                                        <span>{faq.q}</span>
                                        {expandedFaq === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </button>
                                    {expandedFaq === idx && (
                                        <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 bg-slate-50 border-t border-slate-100 leading-relaxed">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SECTION: What Our Students Say */}
                    <div id="reviews" className="mb-16">
                        <div className="text-center mb-8">
                            <h4 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-wide">
                                What Our Students Say
                            </h4>
                            <div className="flex items-center justify-center gap-1.5 mt-2 text-xs font-bold text-slate-600">
                                <span>Verified Google Rating:</span>
                                <div className="flex text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={15} className="fill-amber-400" />
                                    ))}
                                </div>
                                <span className="text-slate-900 font-black">4.9 / 5.0</span>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                                <div className="flex items-center gap-1 text-amber-400 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} className="fill-amber-400" />
                                    ))}
                                </div>
                                <p className="text-xs sm:text-sm text-slate-600 italic mb-4 leading-relaxed">
                                    "The live project on Graph Neural Networks for binding affinity prediction gave me direct industry exposure. Our mentor guided our paper manuscript until submission!"
                                </p>
                                <div className="text-xs font-bold text-slate-900">Dr. Aarti Deshmukh</div>
                                <div className="text-[11px] text-slate-500">Ph.D Scholar, Molecular Biology</div>
                            </div>

                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                                <div className="flex items-center gap-1 text-amber-400 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} className="fill-amber-400" />
                                    ))}
                                </div>
                                <p className="text-xs sm:text-sm text-slate-600 italic mb-4 leading-relaxed">
                                    "Coming from a computer science background, this program gave me the exact biological context and RDKit tooling needed to transition into computational drug discovery."
                                </p>
                                <div className="text-xs font-bold text-slate-900">Rajeshwar Iyer</div>
                                <div className="text-[11px] text-slate-500">Machine Learning Engineer</div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom CTA Banner */}
                    <div className="bg-[#0f269a] text-white p-8 rounded-3xl text-center shadow-xl">
                        <h4 className="text-xl sm:text-2xl font-black mb-2">
                            Ready to Join the Next Live Cohort?
                        </h4>
                        <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto mb-5">
                            Limited seats are available for live project mentorship and paper publication slots.
                        </p>
                        <a
                            href="tel:+917036955133"
                            className="inline-block bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold px-7 py-3 rounded-2xl text-xs sm:text-sm transition-all shadow-md"
                        >
                            Call Academic Advisor: +91 7036955133
                        </a>
                    </div>

                </div>

            </div>

            {/* FOOTER */}
            <footer className="bg-slate-900 text-slate-400 py-10 px-4 text-center text-xs border-t border-slate-800">
                <div className="max-w-4xl mx-auto space-y-3">
                    <img src="/logo.png" alt="GenQuantaa" className="h-8 mx-auto filter brightness-0 invert" />
                    <p className="text-slate-400 max-w-md mx-auto">
                        GenQuantaa Academy — Empowering researchers, bioscientists, and developers with frontier AI and In-Silico molecular technologies.
                    </p>
                    <div className="pt-3 border-t border-slate-800 text-slate-500">
                        © {new Date().getFullYear()} GenQuantaa Academy. All rights reserved.
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default BiologicsPage;
