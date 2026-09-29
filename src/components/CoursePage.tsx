import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { Star, Clock, Users, Award, ChevronRight, User, Mail, Phone, Lock, ArrowLeft, FileText, ExternalLink } from 'lucide-react';

interface CoursePageProps {
    onBack: () => void;
    onBuy: () => void;
    courseId?: string;
}

const CoursePage: React.FC<CoursePageProps> = ({ onBack, onBuy, courseId = 'python-ai-course' }) => {

    const [courseData, setCourseData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/course-metadata`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    const found = data.find((c: any) => c.id === courseId);
                    if (found) {
                        setCourseData(found);
                    } else {
                        setCourseData(data[0] || null);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch course data', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourse();
    }, [courseId]);

    const [showRegistrationForm, setShowRegistrationForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        course: ''
    });

    useEffect(() => {
        if (courseData) {
            setFormData(prev => ({ ...prev, course: courseData.title }));
        }
    }, [courseData]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showReturnPage, setShowReturnPage] = useState(false);
    const [returnData, setReturnData] = useState<any>(null);
    const [emailVerified, setEmailVerified] = useState(false);

    const [couponCode, setCouponCode] = useState('');
    const [couponStatus, setCouponStatus] = useState<'idle'|'validating'|'valid'|'invalid'>('idle');
    const [couponMessage, setCouponMessage] = useState('');
    const [discountAmount, setDiscountAmount] = useState(0);

    const [showOtpInput, setShowOtpInput] = useState(false);
    const [otp, setOtp] = useState('');

    const getYouTubeEmbedUrl = (url?: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
    };

    // Scroll to top on component mount
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // Check for return URL parameters
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('order_id');
        const status = urlParams.get('status');

        if (orderId) {
            setShowReturnPage(true);
            setReturnData({ orderId, status });
            checkPaymentStatus(orderId);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, []);

    if (isLoading) {
        return <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 flex items-center justify-center font-sans text-slate-600 text-xl font-medium">Loading course data...</div>;
    }

    if (!courseData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 flex flex-col items-center justify-center font-sans">
                <div className="text-red-500 text-2xl font-bold mb-4">Course not found</div>
                <button onClick={onBack} className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                    <ArrowLeft className="w-5 h-5" /> Back to courses
                </button>
            </div>
        );
    }

    const checkPaymentStatus = async (orderId: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/payment/order-status/${orderId}`);
            const data = await response.json();
            setReturnData((prev: any) => ({ ...prev, orderStatus: data.order_status }));

            if (data.order_status === 'PAID') {
                const verifyResponse = await fetch(`${API_BASE_URL}/api/payment/check-payment-status`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orderId: orderId }),
                });

                const verifyData = await verifyResponse.json();
                if (verifyData.user) {
                    onBuy();
                }
            }
        } catch (error) {
            console.error('Error checking payment status:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setCouponStatus('validating');
        setCouponMessage('');
        try {
            const numericPrice = parseInt(courseData.price.replace(/[^\d]/g, ''), 10) || 35000;
            const res = await fetch(`${API_BASE_URL}/api/coupons/validate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: couponCode, coursePrice: numericPrice })
            });
            const data = await res.json();
            if (data.valid) {
                setCouponStatus('valid');
                setDiscountAmount(data.discountAmount);
                setCouponMessage(`Coupon applied! You saved ₹${data.discountAmount}`);
            } else {
                setCouponStatus('invalid');
                setDiscountAmount(0);
                setCouponMessage(data.error || 'Invalid coupon');
            }
        } catch (error) {
            setCouponStatus('invalid');
            setDiscountAmount(0);
            setCouponMessage('Error validating coupon');
        }
    };

    const sendOtp = async () => {
        if (!formData.email) {
            alert('Please enter your email address');
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}/api/users/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email })
            });
            if (response.ok) {
                setShowOtpInput(true);
                alert('OTP sent to your email (Check console for demo)');
            } else {
                alert('Failed to send OTP');
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            alert('Error sending OTP');
        }
    };

    const verifyOtp = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/users/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, otp })
            });
            const data = await response.json();
            if (data.success) {
                setEmailVerified(true);
                setShowOtpInput(false);
                alert('Email verified successfully!');
            } else {
                alert('Invalid OTP');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            alert('Error verifying OTP');
        }
    };

    const handlePayment = async () => {
        if (!formData.name || !formData.email || !formData.phone) {
            alert('Please fill in all required fields');
            return;
        }

        if (!emailVerified) {
            alert('Please verify your email address before proceeding.');
            return;
        }

        setIsProcessing(true);

        try {
            // Create payment order
            const numericPrice = parseInt(courseData.price.replace(/[^\d]/g, ''), 10) || 35000;
            const orderResponse = await fetch(`${API_BASE_URL}/api/payment/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: Math.max(0, numericPrice - discountAmount),
                    couponCode: couponStatus === 'valid' ? couponCode : undefined,
                    email: formData.email,
                    phone: formData.phone,
                    courseData: {
                        name: formData.name,
                        course: formData.course,
                        courseTitle: formData.course,
                        coursePrice: courseData.price,
                        courseDuration: courseData.duration
                    }
                }),
            });

            const orderData = await orderResponse.json();

            if (!orderResponse.ok) {
                throw new Error(orderData.error || 'Failed to create payment order');
            }

            // Register user first
            const registrationResponse = await fetch(`${API_BASE_URL}/api/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    mobile: formData.phone,
                    course: formData.course,
                    courseId: courseId,
                    courseTitle: formData.course,
                    coursePrice: courseData?.price || '₹2,10,000',
                    courseDuration: courseData?.duration || '14 Weeks',
                    orderId: orderData.order_id
                }),
            });

            if (!registrationResponse.ok) {
                throw new Error('Failed to register user');
            }

            // Initialize Cashfree payment
            const cashfree = new window.Cashfree({
                mode: "production"
            });

            const checkoutOptions = {
                paymentSessionId: orderData.payment_session_id,
                returnUrl: `${window.location.origin}/?order_id=${orderData.order_id}`,
            };

            cashfree.checkout(checkoutOptions).then((result: any) => {
                if (result.error) {
                    console.error("Payment failed:", result.error);
                    setIsProcessing(false);
                }
            });

        } catch (error) {
            console.error('Payment error:', error);
            setIsProcessing(false);
            alert('Payment failed. Please try again.');
        }
    };

    const handleBuyNowClick = () => {
        setShowRegistrationForm(true);
    };

    // Return page component
    if (showReturnPage) {
        const isSuccess = returnData?.orderStatus === 'PAID';

        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 font-sans flex items-center justify-center p-4 relative overflow-hidden">
                <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-2xl max-w-md w-full p-8 text-center border border-white">
                    <div className={`w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center ${isSuccess ? 'bg-blue-100/50' : 'bg-red-500/10'}`}>
                        {isSuccess ? (
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                    </div>

                    <h1 className={`text-2xl font-bold mb-4 ${isSuccess ? 'text-blue-600' : 'text-red-400'}`}>
                        {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
                    </h1>

                    <p className="text-slate-600 mb-6">
                        {isSuccess
                            ? 'Thank you for your payment! You will receive a confirmation email shortly with course access details.'
                            : 'Your payment could not be processed. Please try again or contact support if the issue persists.'
                        }
                    </p>

                    {returnData?.orderId && (
                        <div className="bg-white/80 backdrop-blur-xl rounded-lg p-4 mb-6 border border-white">
                            <p className="text-sm text-slate-600">Order ID: <span className="font-mono text-slate-700">{returnData.orderId}</span></p>
                            <p className="text-sm text-slate-600">Status: <span className="font-semibold text-slate-700">{returnData.orderStatus}</span></p>
                            {isSuccess && (
                                <p className="text-sm text-blue-600 mt-2">
                                    ✓ Confirmation email has been sent to your registered email address
                                </p>
                            )}
                        </div>
                    )}

                    <div className="space-y-3">
                        <button
                            onClick={() => {
                                setShowReturnPage(false);
                                window.history.replaceState({}, document.title, window.location.pathname);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="w-full bg-gradient-to-r from-[#0f269a] to-blue-600 hover:shadow-lg hover:-translate-y-1 transition-all text-white border-0 hover:bg-emerald-500 text-slate-900 font-semibold py-3 px-6 rounded-lg transition-colors shadow-lg shadow-emerald-900/20"
                        >
                            {isSuccess ? 'Continue Learning' : 'Try Again'}
                        </button>

                        {isSuccess && (
                            <button
                                onClick={() => window.location.href = '/dashboard'}
                                className="w-full bg-white/80 backdrop-blur-xl hover:bg-slate-700 text-slate-700 font-semibold py-3 px-6 rounded-lg transition-colors border border-white"
                            >
                                Go to Dashboard
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 font-sans text-slate-600 relative overflow-hidden select-none" onContextMenu={(e) => e.preventDefault()}>
            {/* Background Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[80%] bg-white/70 blur-3xl rounded-full pointer-events-none transform -rotate-12 z-0"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[120%] bg-blue-200/40 blur-3xl rounded-full pointer-events-none z-0"></div>
            
            {/* Back Button */}
            <div className="absolute top-6 left-6 z-10">
                <button onClick={onBack} className="flex items-center text-slate-600 hover:text-[#0f269a] transition-colors bg-white/60 backdrop-blur-md/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white hover:border-white">
                    <ArrowLeft size={20} className="mr-2" /> Back
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="inline-block bg-blue-100/50 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-emerald-500/20">
                        Beginner Friendly
                    </span>
                    <h1 className="text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                        {courseData.title}
                    </h1>
                    <p className="text-xl text-slate-600">
                        {courseData.desc}
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {/* Left Side - Course Info */}
                    <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex">
                                {[1, 2, 3, 4].map((i) => (
                                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                                ))}
                                <Star className="w-5 h-5 text-amber-400" />
                            </div>
                            <span className="text-lg font-semibold text-slate-700">4.5</span>
                            <span className="text-slate-500">(1,247 reviews)</span>
                        </div>

                        <div className="space-y-6 mb-8">
                            <div className="flex items-start gap-4">
                                <div className="bg-blue-100/50 p-3 rounded-lg">
                                    <Clock className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-1">{courseData.duration} Duration</h3>
                                    <p className="text-slate-600">Self-paced learning with lifetime access</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-blue-500/10 p-3 rounded-lg">
                                    <Users className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-1">{courseId === 'curaquantis-course' ? 'Partner Skills and Operational CoE' : 'Real-World Projects'}</h3>
                                    <p className="text-slate-600">{courseId === 'curaquantis-course' ? 'Develop skills according to the course' : 'Build AI applications from scratch'}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-purple-500/10 p-3 rounded-lg">
                                    <Award className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-1">{courseId === 'curaquantis-course' ? 'Care Practitioner Batch' : 'Certificate of Completion'}</h3>
                                    <p className="text-slate-600">{courseId === 'curaquantis-course' ? 'Advanced practitioner readiness' : 'Showcase your new AI skills'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/60 backdrop-blur-xl rounded-xl p-6 border border-white/50">
                            <h3 className="font-semibold text-slate-900 mb-3">What You'll Learn:</h3>
                            <ul className="space-y-2 text-slate-600">
                                {courseData.learnings.map((learn: string, idx: number) => (
                                    <li key={idx} className="flex items-center gap-2">
                                        <ChevronRight className="w-4 h-4 text-blue-600" />
                                        {learn}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right Side - Video */}
                    <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Course Preview</h2>
                        <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-white">
                            {getYouTubeEmbedUrl(courseData.videoUrl) ? (
                                <iframe
                                    className="w-full h-full border-0"
                                    src={getYouTubeEmbedUrl(courseData.videoUrl)!}
                                    title={courseData.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                />
                            ) : courseData.image && !courseData.image.startsWith('http') ? (
                                <img src={courseData.image} alt={courseData.title} className="w-full h-full object-cover" />
                            ) : (
                                <video
                                    className="w-full h-full object-cover"
                                    controls
                                    controlsList="nodownload"
                                    onContextMenu={(e) => e.preventDefault()}
                                    poster={courseData.image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450'%3E%3Crect fill='%230f172a' width='800' height='450'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='%23475569' font-size='24' font-family='system-ui'%3ECourse Introduction%3C/text%3E%3C/svg%3E"}
                                >
                                    <source src={courseData.videoUrl || "/Video.mp4"} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </div>

                        {courseData.brochureUrl && (
                            <a
                                href={courseData.brochureUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-[#0f269a] to-blue-600 hover:from-[#0a1a72] hover:to-blue-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-sm group"
                            >
                                <FileText className="w-4 h-4 text-blue-200 group-hover:scale-110 transition-transform" />
                                View Course Brochure (Canva)
                                <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-80" />
                            </a>
                        )}

                        <div className="mt-6 bg-gradient-to-r from-emerald-900/20 to-blue-900/20 rounded-xl p-6 border border-emerald-500/20">
                            <div className="flex items-baseline gap-3 mb-2">
                                <span className="text-4xl font-bold text-slate-900">{courseData.price}</span>
                                <span className="text-xl text-slate-500 line-through">{courseData.originalPrice}</span>
                                <span className="bg-red-500 text-slate-900 text-sm px-3 py-1 rounded-full font-semibold shadow-lg shadow-red-500/20">
                                    {courseData.discount || '89% OFF'}
                                </span>
                            </div>
                            <p className="text-blue-600 text-sm font-medium">Limited time offer - Enroll today!</p>
                        </div>
                    </div>
                </div>

                {/* Course Curriculum */}
                {courseData.modules && courseData.modules.length > 0 && (
                    <div className="mb-12">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">Course Curriculum</h2>
                            <p className="text-slate-600">Comprehensive syllabus designed for maximum learning</p>
                        </div>
                        <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white space-y-4">
                            {courseData.modules.map((module: any, index: number) => (
                                <div key={index} className="border border-slate-200 rounded-xl overflow-hidden bg-white/50">
                                    <div className="p-4 bg-slate-50/80 border-b border-slate-200">
                                        <h3 className="font-bold text-slate-800 text-lg">{module.title}</h3>
                                    </div>
                                    <div className="p-4">
                                        <ul className="space-y-2">
                                            {module.topics.map((topic: string, tIdx: number) => (
                                                <li key={tIdx} className="flex items-start gap-2 text-slate-600">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                                                    <span>{topic}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Pricing Plans */}
                <div className="max-w-xl mx-auto mb-16">
                    {/* Advanced Plan */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 border-2 border-[#0f269a]/30 shadow-2xl shadow-blue-900/10 relative transform hover:-translate-y-1 transition-all duration-300">
                        <div className="absolute top-0 right-0 bg-gradient-to-r from-[#0f269a] to-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-bl-2xl rounded-tr-3xl shadow-sm uppercase tracking-wider">
                            ACTIVE ENROLLMENT
                        </div>
                        <div className="inline-block bg-blue-50 text-[#0f269a] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                            {courseData.level || "Advanced"}
                        </div>
                        <h3 className="text-3xl font-extrabold text-slate-900 mb-2">Advanced Program</h3>
                        <div className="text-4xl font-black text-[#0f269a] mb-2">{courseData.price}</div>
                        {courseData.originalPrice && (
                            <div className="text-sm text-slate-500 mb-4">
                                <span className="line-through">{courseData.originalPrice}</span>
                                {courseData.discount && <span className="ml-2 font-bold text-emerald-600">{courseData.discount}</span>}
                            </div>
                        )}
                        <p className="text-slate-600 mb-6 text-sm font-medium">{courseData.duration} Comprehensive Hands-On Program</p>

                        <ul className="space-y-3.5 mb-8 text-sm text-slate-700">
                            <li className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" /> <span className="font-semibold text-slate-800">Full Access to All Modules & Live Sessions</span></li>
                            <li className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" /> <span>Hands-on Projects & Capstone Development</span></li>
                            <li className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" /> <span>Interactive 1-on-1 Mentorship & Code Reviews</span></li>
                            <li className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" /> <span>Official Verified Certificate of Completion</span></li>
                            <li className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" /> <span>Placement Assistance & Career Guidance</span></li>
                        </ul>

                        <button
                            onClick={handleBuyNowClick}
                            className="w-full bg-gradient-to-r from-[#0f269a] to-blue-600 hover:from-[#0a1a72] hover:to-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-900/20 hover:shadow-2xl transition-all duration-300 text-base transform hover:-translate-y-0.5"
                        >
                            Enroll Now — {courseData.price}
                        </button>
                    </div>
                </div>

                {/* Registration Form Modal */}
                {showRegistrationForm && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-white">
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-slate-900">Complete Your Registration</h2>
                                    <button
                                        onClick={() => setShowRegistrationForm(false)}
                                        className="text-slate-600 hover:text-[#0f269a] text-2xl transition-colors"
                                    >
                                        ×
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Course Info */}
                                    <div className="bg-blue-100/50 rounded-xl p-4 border border-emerald-500/20">
                                        <h3 className="font-semibold text-slate-900 mb-2">{formData.course} - Advanced Program</h3>
                                        <div className="flex items-baseline gap-2">
                                            
        <div className="flex flex-col">
            <span className="text-2xl font-bold text-slate-900">
                ₹{Math.max(0, (parseInt(courseData.price.replace(/[^\d]/g, ''), 10) || 35000) - discountAmount).toLocaleString()}
            </span>
            {discountAmount > 0 && <span className="text-xs text-green-700">Includes ₹{discountAmount} coupon discount</span>}
        </div>
        
                                            <span className="text-lg text-slate-500 line-through">{courseData.originalPrice}</span>
                                            <span className="bg-red-500 text-slate-900 text-xs px-2 py-1 rounded-full font-semibold">
                                                99% OFF
                                            </span>
                                        </div>


                                    {/* Coupon Section */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700">Have a coupon code?</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={couponCode}
                                                onChange={e => {
                                                    setCouponCode(e.target.value.toUpperCase());
                                                    setCouponStatus('idle');
                                                    setCouponMessage('');
                                                    setDiscountAmount(0);
                                                }}
                                                className="flex-1 px-4 py-2 bg-white/80 border border-white rounded-lg focus:ring-2 focus:ring-[#0f269a] outline-none"
                                                placeholder="Enter coupon code"
                                            />
                                            <button
                                                onClick={handleApplyCoupon}
                                                disabled={couponStatus === 'validating' || !couponCode}
                                                className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50"
                                            >
                                                {couponStatus === 'validating' ? 'Applying...' : 'Apply'}
                                            </button>
                                        </div>
                                        {couponMessage && (
                                            <p className={`text-sm font-medium ${couponStatus === 'valid' ? 'text-green-600' : 'text-red-500'}`}>
                                                {couponMessage}
                                            </p>
                                        )}
                                    </div>

                                    </div>

                                    {/* Registration Form */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Full Name *
                                            </label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-xl border border-white rounded-lg focus:ring-2 focus:ring-[#0f269a] focus:border-[#0f269a] outline-none text-slate-900 placeholder-slate-500"
                                                    placeholder="Enter your full name"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Email Address *
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    disabled={emailVerified}
                                                    className={`w-full pl-10 pr-24 py-3 bg-white/80 backdrop-blur-xl border ${emailVerified ? 'border-emerald-500' : 'border-white'} rounded-lg focus:ring-2 focus:ring-[#0f269a] focus:border-[#0f269a] outline-none text-slate-900 placeholder-slate-500`}
                                                    placeholder="Enter your email address"
                                                    required
                                                />
                                                {!emailVerified && (
                                                    <button
                                                        onClick={sendOtp}
                                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-slate-900 text-xs px-3 py-1.5 rounded-md transition-colors"
                                                    >
                                                        Verify
                                                    </button>
                                                )}
                                                {emailVerified && (
                                                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 text-sm font-bold">
                                                        Verified ✓
                                                    </span>
                                                )}
                                            </div>
                                            {showOtpInput && !emailVerified && (
                                                <div className="mt-2 flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={otp}
                                                        onChange={(e) => setOtp(e.target.value)}
                                                        className="flex-1 px-4 py-2 bg-white/80 backdrop-blur-xl border border-white rounded-lg focus:ring-2 focus:ring-[#0f269a] outline-none text-slate-900 placeholder-slate-500"
                                                        placeholder="Enter OTP"
                                                    />
                                                    <button
                                                        onClick={verifyOtp}
                                                        className="bg-gradient-to-r from-[#0f269a] to-blue-600 hover:shadow-lg hover:-translate-y-1 transition-all text-white border-0 hover:bg-emerald-500 text-slate-900 px-4 py-2 rounded-lg transition-colors"
                                                    >
                                                        Confirm
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Phone Number *
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-xl border border-white rounded-lg focus:ring-2 focus:ring-[#0f269a] focus:border-[#0f269a] outline-none text-slate-900 placeholder-slate-500"
                                                    placeholder="Enter your phone number"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Button */}
                                    <div className="pt-4">
                                        <button
                                            onClick={handlePayment}
                                            disabled={isProcessing}
                                            className="w-full bg-gradient-to-r from-[#0f269a] to-blue-600 hover:shadow-lg hover:-translate-y-1 transition-all text-white border-0 hover:bg-emerald-500 disabled:bg-emerald-800 text-slate-900 font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-emerald-500/50 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none"
                                        >
                                            {isProcessing ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Processing Payment...
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center gap-2">
                                                    <Lock className="w-5 h-5" />
                                                    Pay {courseData.price} & Enroll Now
                                                </div>
                                            )}
                                        </button>

                                        <p className="text-center text-slate-500 text-sm mt-3">
                                            Secure payment powered by Cashfree
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoursePage;


