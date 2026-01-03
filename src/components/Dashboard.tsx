import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { API_BASE_URL } from '../config';
import ReactMarkdown from 'react-markdown';
import Sidebar from './Sidebar';
import Header from './Header';
// import Certificate from './Certificate'; // Lazy loaded now
const Certificate = lazy(() => import('./Certificate'));
import Login from './Login';
import Chatbot from './Chatbot';
import { ArrowRight, CheckCircle, Play, MessageCircle } from 'lucide-react';
import CourseOverview from './CourseOverview';
import AdminDashboard from './AdminDashboard';
import { translations } from '../translations';

const courseNames: Record<string, string> = {
    'python-ai-course': 'Python Programming for AI',
    'ml-dl-course': 'Machine Learning & Deep Learning',
    'neural-networks-course': 'Neural Networks & Deep Learning',
    'nlp-course': 'Natural Language Processing',
    'cv-course': 'Computer Vision',
    'agentic-ai-course': 'Agentic AI',
    'gen-ai-course': 'Generative AI',
    'ai-risk-course': 'AI Risk Curriculum',
    'csv-course': 'Computerized System Validation',
    'med-writing-course': 'Medical Writing',
    'ai-healthcare-course': 'AI in Healthcare',
    'lifesciences-ai-course': 'Transforming Lifesciences with AI',
    'ai-cybersecurity-course': 'AI in Cybersecurity',
    'ai-medical-coding-course': 'AI in Medical Coding',
    'pharma-gen-ai-course': 'Generative AI in Pharma'
};

const Dashboard = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isWindowBlurred, setIsWindowBlurred] = useState(false);
    const [progress, setProgress] = useState(0);
    const [user, setUser] = useState<{ email: string; fullName?: string; completedModules?: string[]; state?: string; language?: string; dob?: string; gender?: string; role?: string; isPaid?: boolean; enrolledCourses?: string[] } | null>(null);
    const [currentModule, setCurrentModule] = useState<any>(null);
    const [modules, setModules] = useState<any[]>([]);
    const [showOutput, setShowOutput] = useState(false);
    const [mcqAnswers, setMcqAnswers] = useState<{ [key: number]: number }>({});

    // New state for step-by-step learning
    const [currentStep, setCurrentStep] = useState<'theory' | 'code' | 'mcq'>('theory');
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [code, setCode] = useState('');

    // Profile Modal State
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [fullName, setFullName] = useState('');

    // View State
    const [view, setView] = useState<'course' | 'settings' | 'admin' | 'certificate'>('course');

    // Settings Form State
    const [settingsName, setSettingsName] = useState('');
    const [settingsState, setSettingsState] = useState('');
    const [settingsLanguage, setSettingsLanguage] = useState('ENGLISH');
    const [settingsDob, setSettingsDob] = useState('');
    const [settingsGender, setSettingsGender] = useState('Male');

    // Video and PDF State
    const [videoCompleted, setVideoCompleted] = useState(false);
    const [pdfCompleted, setPdfCompleted] = useState(false);

    const [executionOutput, setExecutionOutput] = useState('');
    const [isExecuting, setIsExecuting] = useState(false);

    // Certificate State
    const [viewCertificateId, setViewCertificateId] = useState<string | null>(null);

    // Multi-Course State
    const [activeCourseId, setActiveCourseId] = useState<string>('python-ai-course');
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [outputImage, setOutputImage] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser && parsedUser.email) {
                    // Verify session with backend to get latest data
                    fetchUserFromBackend(parsedUser.email);
                } else {
                    // Invalid data in local storage
                    handleLogout();
                }
            } catch (e) {
                // JSON parse error
                handleLogout();
            }
        }
    }, []);

    const fetchUserFromBackend = async (email: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/users/${email}`);
            if (res.ok) {
                const data = await res.json();
                // Check payment status again just in case
                if (data.isPaid) {
                    setUser(data);
                    setProgress(data.progress);
                    localStorage.setItem('user', JSON.stringify(data)); // Update local storage with fresh data
                    if (data.role === 'admin') {
                        setView('admin');
                    }
                } else {
                    handleLogout(); // Force logout if not paid
                    alert("Payment not completed. Please contact support.");
                }
            } else {
                // If user not found in DB, clear local storage
                handleLogout();
            }
        } catch (err) {
            console.error("Error fetching user data:", err);
        }
    };

    useEffect(() => {
        setVideoCompleted(false);
        setPdfCompleted(false);
    }, [currentSectionIndex, currentModule]);

    const handleVideoEnded = () => {
        setVideoCompleted(true);
    };

    // Get current translations
    const t = translations[settingsLanguage as keyof typeof translations] || translations.ENGLISH;

    // Course Mapping moved outside component or memoized (hoisted since static)
    // const courseNames ... (removed from here, will be defined outside)

    // Sync active course with user enrollment
    useEffect(() => {
        if (!user) return;

        // Filter valid courses only
        const validCourses = Object.keys(courseNames);
        const enrolled = (user.enrolledCourses || []).filter(c => validCourses.includes(c));

        // If user has enrolled courses
        if (enrolled.length > 0) {
            // If current active course is NOT in enrolled list, switch to first enrolled
            if (!enrolled.includes(activeCourseId)) {
                setActiveCourseId(enrolled[0]);
            }
        }
        // Fallback for legacy paid users (assume Python course)
        else if (user.isPaid) {
            if (activeCourseId !== 'python-ai-course') {
                setActiveCourseId('python-ai-course');
            }
        }
    }, [user, activeCourseId]);

    const fetchModules = async () => {
        if (!user?.email) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/courses?lang=${settingsLanguage}&email=${user.email}`);
            const data = await res.json();
            setModules(data);
            if (currentModule) {
                const updatedModule = data.find((m: any) => m.id === currentModule.id);
                if (updatedModule) setCurrentModule(updatedModule);
                else if (data.length > 0) setCurrentModule(data[0]);
            } else if (data.length > 0) {
                setCurrentModule(data[0]);
            }
        } catch (error) {
            console.error("Error fetching modules:", error);
        }
    };

    useEffect(() => {
        if (user?.email) {
            fetchModules();
        }
    }, [settingsLanguage, view, user]);

    // Safety Check: Ensure Active Course matches loaded modules
    useEffect(() => {
        if (modules.length > 0) {
            // Check if current active course has any modules in the loaded list
            const currentCourseModules = modules.filter(m => (m.courseId || 'python-ai-course') === activeCourseId);

            // If current course has no modules, but we have OTHER modules loaded, switch to them
            if (currentCourseModules.length === 0) {
                const availableCourseId = modules[0].courseId || 'python-ai-course';
                console.warn(`Active course ${activeCourseId} has no modules. Switching to ${availableCourseId}`);
                setActiveCourseId(availableCourseId);
            }
        }
    }, [modules, activeCourseId]);

    useEffect(() => {
        if (currentModule) {
            setCode(currentModule.code);
            setCurrentStep('theory');
            setCurrentSectionIndex(0);
            setShowOutput(false);
            setMcqAnswers({});
            setExecutionOutput('');
        }
    }, [currentModule]);

    useEffect(() => {
        if (user) {
            setFullName(user.fullName || '');
            setSettingsName(user.fullName || '');
            setSettingsState(user.state || '');
            if (user.language) setSettingsLanguage(user.language);
            setSettingsDob(user.dob || '');
            setSettingsGender(user.gender || 'Male');

            // Set current module based on progress
            if (modules.length > 0) {
                const completedIds = user.completedModules || [];
                if (completedIds.length > 0) {
                    const lastCompletedId = completedIds[completedIds.length - 1];
                    const lastIndex = modules.findIndex(m => m.id === lastCompletedId);
                    if (lastIndex !== -1 && lastIndex < modules.length - 1) {
                        setCurrentModule(modules[lastIndex + 1]);
                    } else if (lastIndex !== -1) {
                        setCurrentModule(modules[lastIndex]);
                    } else {
                        setCurrentModule(modules[0]);
                    }
                } else {
                    setCurrentModule(modules[0]);
                }
            }
        }
    }, [user, modules]);

    // Content Protection
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevent Print Screen
            if (e.key === 'PrintScreen') {
                alert('Screenshots are disabled!');
                navigator.clipboard.writeText(''); // Clear clipboard
                e.preventDefault();
            }

            // Prevent Ctrl+C, Ctrl+X, Ctrl+S, Ctrl+U, Ctrl+P
            if ((e.ctrlKey || e.metaKey) && ['c', 'x', 's', 'u', 'p'].includes(e.key.toLowerCase())) {
                e.preventDefault();
            }
        };

        const handleCopy = (e: ClipboardEvent) => {
            e.preventDefault();
        };

        const handleBlur = () => {
            setIsWindowBlurred(true);
        };

        const handleFocus = () => {
            setIsWindowBlurred(false);
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                setIsWindowBlurred(true);
            } else {
                setIsWindowBlurred(false);
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('copy', handleCopy);
        document.addEventListener('cut', handleCopy);
        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('copy', handleCopy);
            document.removeEventListener('cut', handleCopy);
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);



    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleLogin = async (email: string) => {
        setIsLoggingIn(true);
        console.log("Starting login process for:", email);
        try {
            const res = await fetch(`${API_BASE_URL}/api/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await res.text();
                console.error("Non-JSON response received:", text);
                alert("Server returned an invalid response. Please try again later.");
                setIsLoggingIn(false);
                return;
            }

            const data = await res.json();
            console.log("Login response:", data);

            if (res.ok) {
                setUser(data);
                setProgress(data.progress || 0);
                localStorage.setItem('user', JSON.stringify(data)); // Persist session
                if (data.role === 'admin') {
                    setView('admin');
                }
            } else {
                // Show error from backend (e.g., "User not found" or "Payment not completed")
                console.warn("Login failed with status:", res.status, data);
                alert(data.message || "Login failed");
                setUser(null);
            }
        } catch (err) {
            console.error("Backend error during login:", err);
            alert("An error occurred during login. Please check your internet connection.");
            setUser(null);
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user'); // Clear from local storage
        setUser(null);
        setProgress(0);
        setCurrentModule(null);
        setView('course');
    };

    const handleUpdateProfile = async () => {
        if (!user) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, fullName }),
            });
            if (res.ok) {
                const updatedUser = await res.json();
                setUser(updatedUser);
                setShowProfileModal(false);
            }
        } catch (err) {
            console.error("Error updating profile:", err);
        }
    };

    const handleSettingsUpdate = async () => {
        if (!user) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: user.email,
                    fullName: settingsName,
                    state: settingsState,
                    language: settingsLanguage,
                    dob: settingsDob,
                    gender: settingsGender
                }),
            });
            if (res.ok) {
                const updatedUser = await res.json();
                setUser(updatedUser);
                alert("Settings updated successfully!");
            }
        } catch (err) {
            console.error("Error updating settings:", err);
        }
    };

    const markModuleComplete = async () => {
        console.log("Marking module complete:", currentModule?.id, "for user:", user?.email);
        if (!user || !currentModule) {
            console.error("User or Module missing");
            return;
        }

        // Calculate score
        let score = 0;
        let totalQuestions = 0;
        if (currentModule.mcqs && currentModule.mcqs.length > 0) {
            totalQuestions = currentModule.mcqs.length;
            currentModule.mcqs.forEach((mcq: any, index: number) => {
                if (mcqAnswers[index] === mcq.correctAnswer) {
                    score++;
                }
            });
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/users/progress`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: user.email,
                    moduleId: currentModule.id,
                    score,
                    totalQuestions
                }),
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data);
                setProgress(data.progress);

                const currentIndex = modules.findIndex(m => m.id === currentModule.id);
                if (currentIndex < modules.length - 1) {
                    setCurrentModule(modules[currentIndex + 1]);
                    setCurrentSectionIndex(0);
                    setShowOutput(false);
                    setMcqAnswers({});
                    window.scrollTo(0, 0);
                }
            }
        } catch (err) {
            console.error("Backend error:", err);
        }
    };

    const runCode = async () => {
        setIsExecuting(true);
        setShowOutput(true);
        setExecutionOutput("Running...");
        setOutputImage(null);

        try {
            const res = await fetch(`${API_BASE_URL}/api/code/execute`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, language: 'python', image: uploadedImage }),
            });
            const data = await res.json();
            setExecutionOutput(data.output);
            if (data.image) {
                setOutputImage(data.image);
            }
        } catch (err) {
            console.error("Execution error:", err);
            setExecutionOutput("Error connecting to server.");
        } finally {
            setIsExecuting(false);
        }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleNextSection = () => {
        if (currentModule && currentModule.sections && currentSectionIndex < currentModule.sections.length - 1) {
            setCurrentSectionIndex(prev => prev + 1);
            window.scrollTo(0, 0);
        } else {
            setCurrentStep('code');
            window.scrollTo(0, 0);
        }
    };

    const handlePrevSection = () => {
        if (currentSectionIndex > 0) {
            setCurrentSectionIndex(prev => prev - 1);
            window.scrollTo(0, 0);
        }
    };

    const handleCodeComplete = () => {
        setCurrentStep('mcq');
        window.scrollTo(0, 0);
    };

    // Calculate Completed Courses for Certificate
    const completedCourses = useMemo(() => {
        if (!user || !user.completedModules || modules.length === 0) return [];

        const modulesByCourse: Record<string, string[]> = {};
        modules.forEach(m => {
            const cid = m.courseId || 'python-ai-course';
            if (!modulesByCourse[cid]) modulesByCourse[cid] = [];
            modulesByCourse[cid].push(m.id);
        });

        const completed: { id: string, name: string }[] = [];
        for (const [cid, modIds] of Object.entries(modulesByCourse)) {
            const isCompleted = modIds.length > 0 && modIds.every(id => user.completedModules!.includes(id));
            if (isCompleted) {
                completed.push({ id: cid, name: courseNames[cid] || cid });
            }
        }
        return completed;
    }, [user, modules]);

    if (!user) {
        return <Login onLogin={handleLogin} />;
    }

    if (view === 'admin') {
        return <AdminDashboard onLogout={handleLogout} />;
    }



    return (
        <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen font-sans select-none relative" onContextMenu={(e) => e.preventDefault()}>

            {/* Watermark Overlay */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.03] flex flex-wrap content-start justify-center select-none" style={{ transform: 'rotate(-45deg) scale(1.5)' }}>
                {Array.from({ length: 100 }).map((_, i) => (
                    <div key={i} className="p-8 text-xl font-bold text-black whitespace-nowrap pointer-events-none">
                        {user?.email} - {user?.fullName}
                    </div>
                ))}
            </div>

            {/* Blur Overlay on Focus Loss */}
            {/* Print Protection Style */}
            <style>
                {`
                    @media print {
                        body {
                            display: none !important;
                        }
                    }
                `}
            </style>

            {/* Black Overlay on Focus Loss */}
            {isWindowBlurred && (
                <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
                    <div className="text-center p-8">
                        <h2 className="text-2xl font-bold text-white mb-2">Content Protected</h2>
                        <p className="text-gray-400">Please click here to resume viewing.</p>
                    </div>
                </div>
            )}

            {/* Mobile Header Toggle Removed - Moved to Header */}

            <div className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:sticky md:top-0 md:h-screen md:translate-x-0 transition duration-200 ease-in-out z-50 md:block`}>
                <Sidebar
                    progress={progress}
                    lessons={modules
                        .filter(m => (m.courseId || 'python-ai-course') === activeCourseId)
                        .map((m, index, arr) => ({
                            id: m.id,
                            title: m.title,
                            completed: user.completedModules?.includes(m.id) || false,
                            locked: index > 0 && !user.completedModules?.includes(arr[index - 1].id)
                        }))}
                    currentLessonId={currentModule?.id}
                    onSelectLesson={(id) => {
                        const mod = modules.find(m => m.id === id);
                        if (mod) {
                            setCurrentModule(mod);
                            setCurrentSectionIndex(0);
                            setView('course');
                            window.scrollTo(0, 0);
                            setIsMobileMenuOpen(false);
                        }
                    }}
                    onSettingsClick={() => {
                        setView('settings');
                        setIsMobileMenuOpen(false);
                    }}
                    language={settingsLanguage}
                    isAdmin={user?.role === 'admin'}
                    onAdminClick={() => {
                        setView('admin');
                        setIsMobileMenuOpen(false);
                    }}
                    onCertificateClick={() => {
                        setView('certificate');
                        setIsMobileMenuOpen(false);
                    }}
                    courses={(user?.enrolledCourses || (user?.isPaid ? ['python-ai-course'] : []))
                        .filter(cid => Object.keys(courseNames).includes(cid))
                        .map(cid => ({
                            id: cid,
                            name: courseNames[cid] || cid
                        }))}
                    activeCourseId={activeCourseId}
                    onCourseSelect={(id) => {
                        setActiveCourseId(id);
                        const firstModule = modules.find(m => (m.courseId || 'python-ai-course') === id);
                        if (firstModule) {
                            setCurrentModule(firstModule);
                            setCurrentSectionIndex(0);
                            setView('course');
                        }
                        setIsMobileMenuOpen(false);
                    }}
                />
            </div>

            {/* Mobile Overlay for Sidebar */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            <div className="flex-1 flex flex-col md:ml-0 w-full">
                <Header
                    user={user}
                    onLogout={handleLogout}
                    onUpdateProfile={() => setShowProfileModal(true)}
                    language={settingsLanguage}
                    onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                />

                {/* Floating WhatsApp Button - Moved outside main to ensure visibility */}
                <a
                    href="https://wa.me/917036955133"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-green-500 hover:bg-green-600 text-white p-3 rounded-l-lg shadow-lg transition-all z-[9999] flex flex-col items-center gap-1 group"
                    style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                >
                    <MessageCircle size={24} className="rotate-90 text-white mb-2" />
                    <span className="font-bold tracking-wide py-2">Let's Talk</span>
                </a>

                <main className="flex-1 p-4 md:p-10 relative w-full max-w-[100vw] overflow-x-hidden">

                    {view === 'settings' && (
                        <div className="max-w-4xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow-sm border border-gray-100 animate-fadeIn">
                            <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">{t.updateSettings}</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div>
                                    <div className="mb-6">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">{t.selectUser}</label>
                                        <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                                            <option>{user.fullName || user.email}</option>
                                        </select>
                                    </div>

                                    <button className="text-blue-600 font-bold text-sm mb-8 hover:underline flex items-center">
                                        {t.addSubUser}
                                    </button>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">{t.name}</label>
                                            <input
                                                type="text"
                                                value={settingsName}
                                                onChange={(e) => setSettingsName(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">{t.state}</label>
                                            <input
                                                type="text"
                                                value={settingsState}
                                                onChange={(e) => setSettingsState(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="e.g. Karnataka"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">{t.language}</label>
                                            <select
                                                value={settingsLanguage}
                                                onChange={(e) => setSettingsLanguage(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                            >
                                                <option value="ENGLISH">ENGLISH</option>
                                                <option value="HINDI">HINDI</option>
                                                <option value="KANNADA">KANNADA</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">{t.dob}</label>
                                            <input
                                                type="date"
                                                value={settingsDob}
                                                onChange={(e) => setSettingsDob(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">{t.gender}</label>
                                            <div className="flex space-x-4">
                                                <label className="flex items-center space-x-2 cursor-pointer text-gray-700">
                                                    <input
                                                        type="radio"
                                                        name="gender"
                                                        value="Male"
                                                        checked={settingsGender === 'Male'}
                                                        onChange={(e) => setSettingsGender(e.target.value)}
                                                        className="form-radio text-blue-600"
                                                    />
                                                    <span>{t.male}</span>
                                                </label>
                                                <label className="flex items-center space-x-2 cursor-pointer text-gray-700">
                                                    <input
                                                        type="radio"
                                                        name="gender"
                                                        value="Female"
                                                        checked={settingsGender === 'Female'}
                                                        onChange={(e) => setSettingsGender(e.target.value)}
                                                        className="form-radio text-blue-600"
                                                    />
                                                    <span>{t.female}</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex space-x-4">
                                        <button
                                            onClick={handleSettingsUpdate}
                                            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md"
                                        >
                                            {t.update}
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="bg-red-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-red-600 transition-colors shadow-md"
                                        >
                                            {t.logout}
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-8 rounded-xl h-fit">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">{t.sendFeedback}</h3>
                                    <p className="text-gray-600 mb-2 flex items-center">
                                        <span className="font-medium mr-2">{t.email}</span>
                                        <a href="mailto:info@quant-xai.com" className="text-blue-600 hover:underline">info@quant-xai.com</a>
                                    </p>
                                    <p className="text-gray-600 mb-4 flex items-center">
                                        <span className="font-medium mr-2">{t.phone}</span>
                                        <span>8008502829</span>
                                    </p>
                                    <p className="text-sm text-gray-500 mb-6">
                                        {t.hours}
                                    </p>
                                    <a href="#" className="text-blue-600 font-bold hover:underline flex items-center">
                                        {t.knowMore} <ArrowRight size={16} className="ml-1" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}
                    {view === 'certificate' && (
                        <div className="flex flex-col items-center justify-center p-4 min-h-[600px] w-full">
                            {completedCourses.length > 0 ? (
                                <>
                                    {completedCourses.length > 1 && (
                                        <div className="mb-6 flex space-x-4 bg-white p-2 rounded-lg shadow-sm">
                                            {completedCourses.map(c => (
                                                <button
                                                    key={c.id}
                                                    onClick={() => setViewCertificateId(c.id)}
                                                    className={`px-4 py-2 rounded-md font-medium transition-colors ${(viewCertificateId || completedCourses[0].id) === c.id
                                                        ? 'bg-blue-600 text-white'
                                                        : 'text-gray-600 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    {c.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    <Suspense fallback={<div className="flex justify-center items-center h-[600px]"><div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div></div>}>
                                        <Certificate
                                            userName={user.fullName || user.email.split('@')[0]}
                                            courseName={completedCourses.find(c => c.id === (viewCertificateId || completedCourses[0].id))?.name || 'Course Completion'}
                                            language={settingsLanguage}
                                            userEmail={user.email}
                                        />
                                    </Suspense>
                                </>
                            ) : (
                                <div className="text-center p-10 bg-white rounded-xl shadow-lg border border-gray-100 max-w-lg">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Certificates Locked</h2>
                                    <p className="text-gray-600 mb-6">You must complete all modules of a course to unlock its certificate.</p>
                                    <button
                                        onClick={() => setView('course')}
                                        className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
                                    >
                                        Back to Learning
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    {view === 'course' && (
                        <>
                            {modules.length > 0 && currentModule && currentModule.id === modules[0].id && (
                                <CourseOverview language={settingsLanguage} />
                            )}
                            <div className="bg-white p-6 md:p-10 rounded-xl shadow-sm border border-gray-100 min-h-[600px] flex flex-col">
                                {currentModule && (
                                    <>
                                        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4 gap-4">
                                            <h2 className="text-2xl md:text-3xl font-bold text-blue-900">{currentModule.title}</h2>
                                            <div className="flex space-x-2">
                                                <div className={`h-2 w-12 rounded-full transition-colors ${currentStep === 'theory' ? 'bg-blue-600' : 'bg-green-500'}`}></div>
                                                <div className={`h-2 w-12 rounded-full transition-colors ${currentStep === 'code' ? 'bg-blue-600' : (currentStep === 'mcq' ? 'bg-green-500' : 'bg-gray-200')}`}></div>
                                                <div className={`h-2 w-12 rounded-full transition-colors ${currentStep === 'mcq' ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                                            </div>
                                        </div>

                                        {currentStep === 'theory' && currentModule.sections && currentModule.sections.length > 0 && currentModule.sections[currentSectionIndex] && (
                                            <div className="flex-1 flex flex-col justify-between animate-fadeIn">
                                                <div>
                                                    <h3 className="text-2xl font-semibold mb-4 text-gray-800">{currentModule.sections[currentSectionIndex].title}</h3>
                                                    {currentModule.sections[currentSectionIndex].pdfUrl ? (
                                                        <div className="flex flex-col">
                                                            <div className="w-full h-[600px] mb-6 rounded-lg shadow-md border border-gray-200 overflow-hidden">
                                                                <iframe
                                                                    src={`${currentModule.sections[currentSectionIndex].pdfUrl}#toolbar=0`}
                                                                    className="w-full h-full"
                                                                    title="PDF Viewer"
                                                                />
                                                            </div>
                                                            {!pdfCompleted && (
                                                                <div className="flex justify-center mb-6">
                                                                    <button
                                                                        onClick={() => setPdfCompleted(true)}
                                                                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center shadow-md"
                                                                    >
                                                                        <CheckCircle size={20} className="mr-2" />
                                                                        I have read the complete document
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : currentModule.sections[currentSectionIndex].videoUrl ? (
                                                        <div className="mb-6">
                                                            <video
                                                                controls
                                                                controlsList="nodownload"
                                                                className="w-full rounded-lg shadow-md"
                                                                onEnded={handleVideoEnded}
                                                                onContextMenu={(e) => e.preventDefault()}
                                                            >
                                                                <source src={currentModule.sections[currentSectionIndex].videoUrl} type="video/mp4" />
                                                                Your browser does not support the video tag.
                                                            </video>
                                                        </div>
                                                    ) : (
                                                        currentModule.sections[currentSectionIndex].image && (
                                                            <img
                                                                src={currentModule.sections[currentSectionIndex].image}
                                                                alt="Topic"
                                                                className="w-full h-64 object-cover rounded-lg mb-6 shadow-md"
                                                            />
                                                        )
                                                    )}
                                                    <div className="prose max-w-none text-gray-700 text-lg leading-relaxed">
                                                        <ReactMarkdown>{currentModule.sections[currentSectionIndex].content}</ReactMarkdown>
                                                    </div>
                                                </div >
                                                <div className="flex justify-between mt-8">
                                                    <button
                                                        onClick={handlePrevSection}
                                                        disabled={currentSectionIndex === 0}
                                                        className={`px-6 py-2 rounded-lg font-medium ${currentSectionIndex === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                                                    >
                                                        {t.previous}
                                                    </button>

                                                    {(!currentModule.sections[currentSectionIndex].videoUrl || videoCompleted) &&
                                                        (!currentModule.sections[currentSectionIndex].pdfUrl || pdfCompleted) && (
                                                            <button
                                                                onClick={handleNextSection}
                                                                className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-all shadow-lg flex items-center"
                                                            >
                                                                <span>{currentSectionIndex === currentModule.sections.length - 1 ? t.goToPractical : t.nextTopic}</span>
                                                                <ArrowRight className="ml-2" size={20} />
                                                            </button>
                                                        )}
                                                </div>
                                            </div >
                                        )}

                                        {
                                            currentStep === 'code' && (
                                                <div className="flex-1 flex flex-col animate-fadeIn">
                                                    <h3 className="text-2xl font-semibold mb-4 text-gray-800">{t.practicalLab}</h3>
                                                    <p className="text-gray-600 mb-4">{t.editCode}</p>

                                                    <div className="bg-gray-900 rounded-lg overflow-hidden mb-6 shadow-lg flex-1 flex flex-col min-h-[400px]">
                                                        {activeCourseId === 'cv-course' && (
                                                            <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center">
                                                                <label className="text-gray-300 text-sm mr-3 font-medium">Input Image:</label>
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={handleImageUpload}
                                                                    className="text-sm text-gray-400 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                                                />
                                                                {uploadedImage && <span className="text-green-500 text-xs ml-2 flex items-center"><CheckCircle size={12} className="mr-1" /> Loaded</span>}
                                                            </div>
                                                        )}
                                                        <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
                                                            <span className="text-gray-400 text-sm">main.py</span>
                                                            <button
                                                                onClick={runCode}
                                                                disabled={isExecuting}
                                                                className={`bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm font-medium transition-colors flex items-center ${isExecuting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            >
                                                                <Play size={16} className="mr-1" /> {isExecuting ? 'Running...' : t.runCode}
                                                            </button>
                                                        </div>
                                                        <textarea
                                                            value={code}
                                                            onChange={(e) => setCode(e.target.value)}
                                                            className="w-full flex-1 bg-[#1e1e1e] text-gray-300 font-mono p-4 text-sm focus:outline-none resize-none"
                                                            spellCheck={false}
                                                        />
                                                        {showOutput && (
                                                            <div className="border-t border-gray-700 bg-black p-4 h-32 overflow-y-auto">
                                                                <div className="text-gray-500 text-xs mb-2 uppercase tracking-wider">{t.terminalOutput}</div>
                                                                <pre className="text-white font-mono text-sm">{executionOutput || currentModule.output}</pre>
                                                                {outputImage && (
                                                                    <div className="mt-4 pt-4 border-t border-gray-800">
                                                                        <div className="text-gray-500 text-xs mb-2 uppercase tracking-wider">Output Image</div>
                                                                        <img src={outputImage} alt="Output" className="max-w-md h-auto rounded border border-gray-700 shadow-md" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex justify-end mt-6">
                                                        <button
                                                            onClick={handleCodeComplete}
                                                            className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-all shadow-lg flex items-center"
                                                        >
                                                            <span>{t.proceedToQuiz}</span>
                                                            <ArrowRight className="ml-2" size={20} />
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        }

                                        {
                                            currentStep === 'mcq' && (
                                                <div className="flex-1 flex flex-col animate-fadeIn">
                                                    <h3 className="text-2xl font-semibold mb-6 text-gray-800">{t.knowledgeCheck}</h3>
                                                    <div className="flex-1">
                                                        {currentModule.mcqs && currentModule.mcqs.map((mcq: any, index: number) => {
                                                            const isAnswered = mcqAnswers.hasOwnProperty(index);
                                                            const isCorrect = isAnswered && mcqAnswers[index] === mcq.correctAnswer;

                                                            return (
                                                                <div key={index} className="mb-6 p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                                                    <p className="font-medium text-lg text-gray-800 mb-4">{index + 1}. {mcq.question}</p>
                                                                    <div className="space-y-3">
                                                                        {mcq.options.map((option: string, optIndex: number) => {
                                                                            let optionClass = "border-gray-200 hover:bg-gray-50";
                                                                            if (isAnswered) {
                                                                                if (optIndex === mcq.correctAnswer) {
                                                                                    optionClass = "border-green-500 bg-green-50";
                                                                                } else if (mcqAnswers[index] === optIndex) {
                                                                                    optionClass = "border-red-500 bg-red-50";
                                                                                } else {
                                                                                    optionClass = "border-gray-200 opacity-50";
                                                                                }
                                                                            } else if (mcqAnswers[index] === optIndex) {
                                                                                optionClass = "border-blue-500 bg-blue-50";
                                                                            }

                                                                            return (
                                                                                <label key={optIndex} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${optionClass}`}>
                                                                                    <input
                                                                                        type="radio"
                                                                                        name={`mcq-${index}`}
                                                                                        className="form-radio h-5 w-5 text-blue-600"
                                                                                        onChange={() => {
                                                                                            if (!isAnswered) {
                                                                                                const newAnswers = { ...mcqAnswers };
                                                                                                newAnswers[index] = optIndex;
                                                                                                setMcqAnswers(newAnswers);
                                                                                            }
                                                                                        }}
                                                                                        checked={mcqAnswers[index] === optIndex}
                                                                                        disabled={isAnswered}
                                                                                    />
                                                                                    <span className="ml-3 text-gray-700">{option}</span>
                                                                                    {isAnswered && optIndex === mcq.correctAnswer && <CheckCircle size={16} className="ml-auto text-green-600" />}
                                                                                </label>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                    {isAnswered && (
                                                                        <div className={`mt-3 text-sm font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                                                            {isCorrect ? "Correct Answer!" : "Incorrect Answer. Try to review the topic."}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )
                                                        })}
                                                    </div>

                                                    <div className="flex justify-end mt-8">
                                                        <button
                                                            onClick={markModuleComplete}
                                                            className={`flex items-center space-x-2 px-8 py-3 rounded-full transition-all shadow-lg ${currentModule.mcqs && Object.keys(mcqAnswers).length < currentModule.mcqs.length
                                                                ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                                                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                                                                }`}
                                                            disabled={currentModule.mcqs && Object.keys(mcqAnswers).length < currentModule.mcqs.length}
                                                        >
                                                            <span>{currentModule.mcqs && Object.keys(mcqAnswers).length < currentModule.mcqs.length ? t.answerAll : t.completeModule}</span>
                                                            <CheckCircle className="ml-2" size={20} />
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </>
                                )}
                            </div>
                        </>
                    )
                    }

                    {
                        showProfileModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white p-8 rounded-xl shadow-2xl w-96 animate-fadeIn">
                                    <h2 className="text-2xl font-bold mb-6 text-gray-800">{t.updateProfile}</h2>
                                    <p className="text-sm text-gray-600 mb-4">{t.enterFullName}</p>
                                    <div className="mb-6">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">{t.fullName}</label>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="e.g. John Doe"
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-3">
                                        <button
                                            onClick={() => setShowProfileModal(false)}
                                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                        >
                                            {t.cancel}
                                        </button>
                                        <button
                                            onClick={handleUpdateProfile}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md"
                                        >
                                            {t.saveChanges}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {/* Chatbot */}
                    <Chatbot language={settingsLanguage} />
                </main >
            </div >
        </div >
    );
};

export default Dashboard;
