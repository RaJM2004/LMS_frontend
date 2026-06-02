import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { Star, Clock, Users, Award, ChevronRight, User, Mail, Phone, Lock, ArrowLeft } from 'lucide-react';

interface CoursePageProps {
    onBack: () => void;
    onBuy: () => void;
    courseId?: string;
}

const CoursePage: React.FC<CoursePageProps> = ({ onBack, onBuy, courseId = 'python-ai-course' }) => {

    const content: Record<string, { title: string; desc: string; learnings: string[]; price: string; originalPrice: string; duration: string; image: string }> = {
        'python-ai-course': {
            title: 'Python Programming for AI',
            desc: 'Master the fundamentals of artificial intelligence with hands-on projects',
            learnings: ['Python fundamentals', 'ML algorithms', 'Data preprocessing', 'Neural networks basics'],
            price: '₹1650',
            originalPrice: '₹15,000',
            duration: '8 Weeks',
            image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
        },
        'ml-dl-course': {
            title: 'Machine Learning & Deep Learning',
            desc: 'Advanced techniques and industry best practices in AI',
            learnings: ['Advanced Regression', 'Ensemble Methods', 'Deep Neural Networks', 'Hyperparameter Tuning'],
            price: '₹1650',
            originalPrice: '₹15,000',
            duration: '8 Weeks',
            image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
        },
        'neural-networks-course': {
            title: 'Neural Networks & Deep Learning',
            desc: 'Deep dive into Neural Networks, architectures, and deep learning frameworks',
            learnings: ['Deep Learning Math', 'CNNs & RNNs', 'TensorFlow & PyTorch', 'Model Deployment'],
            price: '₹1650',
            originalPrice: '₹15,000',
            duration: '8 Weeks',
            image: "https://bernardmarr.com/img/Deep%20Learning%20Vs%20Neural%20Networks%20Whats%20The%20Difference.png"
        },
        'nlp-course': {
            title: 'Natural Language Processing',
            desc: 'Master text processing and language understanding with AI',
            learnings: ['Text Preprocessing', 'Word Embeddings', 'Transformers (BERT/GPT)', 'Sentiment Analysis'],
            price: '₹1650',
            originalPrice: '₹15,000',
            duration: '8 Weeks',
            image: "https://cis.unimelb.edu.au/__data/assets/image/0009/4492962/NLP.jpg"
        },
        'cv-course': {
            title: 'Computer Vision',
            desc: 'Teach machines to see and interpret the visual world',
            learnings: ['Image Processing', 'Object Detection (YOLO)', 'Face Recognition', 'Image Segmentation'],
            price: '₹1650',
            originalPrice: '₹15,000',
            duration: '8 Weeks',
            image: "https://d3lkc3n5th01x7.cloudfront.net/wp-content/uploads/2024/04/18095229/computer-vision-banner.png"
        },
        'agentic-ai-course': {
            title: 'Agentic AI',
            desc: 'Build autonomous agents that can reason and act',
            learnings: ['Reinforcement Learning', 'Multi-Agent Systems', 'Autonomous Agents', 'Planning & Reasoning'],
            price: '₹1650',
            originalPrice: '₹15,000',
            duration: '8 Weeks',
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=1632&q=80"
        },
        'gen-ai-course': {
            title: 'Generative AI',
            desc: 'Create new content with state-of-the-art generative models',
            learnings: ['GANs & VAEs', 'Diffusion Models', 'Large Language Models', 'Prompt Engineering'],
            price: '₹1650',
            originalPrice: '₹15,000',
            duration: '8 Weeks',
            image: "https://images.unsplash.com/photo-1676299081847-824916de030a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1632&q=80"
        },
        'ai-risk-course': {
            title: 'AI Risk Curriculum',
            desc: 'Understand and mitigate risks in AI systems',
            learnings: ['AI Safety', 'Bias & Fairness', 'Adversarial Attacks', 'AI Governance'],
            price: '₹1650',
            originalPrice: '₹15,000',
            duration: '8 Weeks',
            image: "https://www.invensislearning.com/blog/wp-content/uploads/2025/09/future-of-ai-in-risk-management-696x392.jpg"
        },
        'csv-course': {
            title: 'Computerized System Validation',
            desc: 'Ensure compliance and validation in regulated industries',
            learnings: ['GAMP 5', '21 CFR Part 11', 'Validation Protocols', 'Risk Assessment'],
            price: '₹1650',
            originalPrice: '₹15,000',
            duration: '8 Weeks',
            image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
        },
        'med-writing-course': {
            title: 'Medical Writing',
            desc: 'Professional scientific writing for healthcare and pharma',
            learnings: ['Clinical Study Reports', 'Regulatory Documents', 'Scientific Manuscripts', 'Publication Ethics'],
            price: '₹1650',
            originalPrice: '₹15,000',
            duration: '8 Weeks',
            image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
        },
        'ai-healthcare-course': {
            title: 'AI in Healthcare',
            desc: 'Transform patient care with Artificial Intelligence',
            learnings: ['Predictive Analytics', 'Medical Imaging', 'Drug Discovery', 'Personalized Medicine'],
            price: '₹1650',
            originalPrice: '₹15,000',
            duration: '8 Weeks',
            image: "https://aihms.in/blog/wp-content/uploads/2020/05/ai1.jpg"
        },
        'lifesciences-ai-course': {
            title: 'Transforming Lifesciences with AI',
            desc: 'Accelerate discovery and delivery in life sciences',
            learnings: ['Digital Transformation', 'AI in Clinical Trials', 'Genomics', 'Lab Automation'],
            price: '₹1650',
            originalPrice: '₹15,000',
            duration: '8 Weeks',
            image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
        },
        'ai-cybersecurity-course': {
            title: 'AI in Cybersecurity',
            desc: 'Defend digital assets using AI-powered security',
            learnings: ['Threat Detection', 'Anomaly Detection', 'Zero Trust', 'Automated Response'],
            price: '₹1650',
            originalPrice: '₹15,000',
            duration: '8 Weeks',
            image: "https://images.unsplash.com/photo-11550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
        },
        'ai-medical-coding-course': {
            title: 'AI in Medical Coding',
            desc: 'Automate and optimize medical coding processes',
            learnings: ['ICD-10 & CPT', 'Automated Chart Review', 'Revenue Cycle', 'Compliance'],
            price: '₹1650',
            originalPrice: '₹15,000',
            duration: '8 Weeks',
            image: "https://cdn.prod.website-files.com/61d48f722324914c384ef59a/66e1e03566afe79172867bbc_16_%20The%20Role%20of%20AI%20in%20Modern%20Medical%20Coding%20and%20Notes%20Review.jpg"
        },
        'pharma-gen-ai-course': {
            title: 'Generative AI in Pharma',
            desc: 'Revolutionize drug discovery and pharma operations',
            learnings: ['Molecule Generation', 'Clinical Reports', 'Patient Bots', 'Data Privacy'],
            price: '₹1650',
            originalPrice: '₹15,000',
            duration: '8 Weeks',
            image: "https://www.nagarro.com/hubfs/Agentic%20AI%20in%20healthcare%20mobile-1.png"
        },
        'data-engg': {
            title: 'Data Engineering',
            desc: 'Build and manage robust data pipelines and infrastructure',
            learnings: ['ETL processes', 'Big Data tools (Hadoop, Spark)', 'Data warehousing', 'Cloud data platforms'],
            price: '₹1650',
            originalPrice: '₹15,000',
            duration: '10 Weeks',
            image: "/data-engg.png"
        },
        'data-scientist': {
            title: 'Data Scientist',
            desc: 'Uncover insights and solve complex problems with data',
            learnings: ['Statistical analysis', 'Machine Learning', 'Big Data analytics', 'Data storytelling'],
            price: '₹1650',
            originalPrice: '₹15,000',
            duration: '12 Weeks',
            image: "/data-scientist.png"
        },
        'robotics-ai': {
            title: 'Advanced Robotics & AI Integration',
            desc: 'Master the intersection of artificial intelligence and modern robotics.',
            learnings: ['Robotic Kinematics', 'AI Vision Systems', 'Reinforcement Learning in Robotics', 'Autonomous Navigation'],
            price: '₹1650',
            originalPrice: '₹15,000',
            duration: '14 Weeks',
            image: "/robotics_ai.png"
        },
        'drug-discovery-sprint': {
            title: 'Next-Gen Drug Discovery: 5-Day Sprint',
            desc: 'Accelerate your AI foundation in Drug Discovery in just 5 days (Fast-Track Bootcamp)',
            learnings: ['AI Fundamentals', 'Drug Discovery Basics', 'Rapid Prototyping', 'Basic Modeling'],
            price: '₹9,900',
            originalPrice: '₹90,000',
            duration: '5 Days',
            image: "/dna-protein.png"
        },
        'drug-discovery-deep-dive': {
            title: 'Next-Gen Drug Discovery: 45-Day Deep-Dive',
            desc: 'Comprehensive training and hands-on projects for Drug Discovery using AI (Career Builder Program)',
            learnings: ['Machine Learning for Pharma', 'Molecular Generation', 'Advanced Data Analysis', 'Capstone Project'],
            price: '₹28,000',
            originalPrice: '₹2,54,545',
            duration: '45 Days',
            image: "/dna-protein.png"
        },
        'drug-discovery-masterclass': {
            title: 'Next-Gen Drug Discovery: 6-Month Masterclass',
            desc: 'Executive level masterclass in Generative AI for End-to-End Drug Discovery (Executive AI Program)',
            learnings: ['End-to-End Generative AI', 'Enterprise Systems Integration', 'Real-World Case Studies', 'Expert Mentorship'],
            price: '₹1,25,000',
            originalPrice: '',
            duration: '6 Months',
            image: "/dna-protein.png"
        }
    };

    const courseData = content[courseId] || content['python-ai-course'];

    const [showRegistrationForm, setShowRegistrationForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        course: courseData.title
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [showReturnPage, setShowReturnPage] = useState(false);
    const [returnData, setReturnData] = useState<any>(null);
    const [emailVerified, setEmailVerified] = useState(false);
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [otp, setOtp] = useState('');

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
            // Scroll to top when showing return page
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, []);

    const checkPaymentStatus = async (orderId: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/payment/order-status/${orderId}`);
            const data = await response.json();
            setReturnData((prev: any) => ({ ...prev, orderStatus: data.order_status }));

            // If payment is successful, trigger status check to send email
            if (data.order_status === 'PAID') {
                const verifyResponse = await fetch(`${API_BASE_URL}/api/payment/check-payment-status`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
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
            const orderResponse = await fetch(`${API_BASE_URL}/api/payment/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: 1.00,
                    email: formData.email,
                    phone: formData.phone,
                    courseData: {
                        name: formData.name,
                        course: formData.course,
                        courseTitle: formData.course,
                        coursePrice: '₹1',
                        courseDuration: '8 Weeks'
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
                    coursePrice: '₹2,000',
                    courseDuration: '8 Weeks',
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
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center border border-slate-800">
                    <div className={`w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center ${isSuccess ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                        {isSuccess ? (
                            <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                    </div>

                    <h1 className={`text-2xl font-bold mb-4 ${isSuccess ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
                    </h1>

                    <p className="text-slate-400 mb-6">
                        {isSuccess
                            ? 'Thank you for your payment! You will receive a confirmation email shortly with course access details.'
                            : 'Your payment could not be processed. Please try again or contact support if the issue persists.'
                        }
                    </p>

                    {returnData?.orderId && (
                        <div className="bg-slate-800 rounded-lg p-4 mb-6 border border-slate-700">
                            <p className="text-sm text-slate-400">Order ID: <span className="font-mono text-slate-300">{returnData.orderId}</span></p>
                            <p className="text-sm text-slate-400">Status: <span className="font-semibold text-slate-300">{returnData.orderStatus}</span></p>
                            {isSuccess && (
                                <p className="text-sm text-emerald-400 mt-2">
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
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-lg shadow-emerald-900/20"
                        >
                            {isSuccess ? 'Continue Learning' : 'Try Again'}
                        </button>

                        {isSuccess && (
                            <button
                                onClick={() => window.location.href = '/dashboard'}
                                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 px-6 rounded-lg transition-colors border border-slate-700"
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
        <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-blue-500/30 select-none" onContextMenu={(e) => e.preventDefault()}>
            {/* Back Button */}
            <div className="absolute top-6 left-6 z-10">
                <button onClick={onBack} className="flex items-center text-slate-400 hover:text-white transition-colors bg-slate-900/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-slate-800 hover:border-slate-700">
                    <ArrowLeft size={20} className="mr-2" /> Back
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="inline-block bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-emerald-500/20">
                        Beginner Friendly
                    </span>
                    <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
                        {courseData.title}
                    </h1>
                    <p className="text-xl text-slate-400">
                        {courseData.desc}
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {/* Left Side - Course Info */}
                    <div className="bg-slate-900 rounded-2xl shadow-xl p-8 border border-slate-800">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex">
                                {[1, 2, 3, 4].map((i) => (
                                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                                ))}
                                <Star className="w-5 h-5 text-amber-400" />
                            </div>
                            <span className="text-lg font-semibold text-slate-300">4.5</span>
                            <span className="text-slate-500">(1,247 reviews)</span>
                        </div>

                        <div className="space-y-6 mb-8">
                            <div className="flex items-start gap-4">
                                <div className="bg-emerald-500/10 p-3 rounded-lg">
                                    <Clock className="w-6 h-6 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white mb-1">{courseData.duration} Duration</h3>
                                    <p className="text-slate-400">Self-paced learning with lifetime access</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-blue-500/10 p-3 rounded-lg">
                                    <Users className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white mb-1">Real-World Projects</h3>
                                    <p className="text-slate-400">Build AI applications from scratch</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-purple-500/10 p-3 rounded-lg">
                                    <Award className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white mb-1">Certificate of Completion</h3>
                                    <p className="text-slate-400">Showcase your new AI skills</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                            <h3 className="font-semibold text-white mb-3">What You'll Learn:</h3>
                            <ul className="space-y-2 text-slate-400">
                                {courseData.learnings.map((learn, idx) => (
                                    <li key={idx} className="flex items-center gap-2">
                                        <ChevronRight className="w-4 h-4 text-emerald-400" />
                                        {learn}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right Side - Video */}
                    <div className="bg-slate-900 rounded-2xl shadow-xl p-8 border border-slate-800">
                        <h2 className="text-2xl font-bold text-white mb-6">Course Preview</h2>
                        <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-slate-800">
                            {courseData.image && !courseData.image.startsWith('http') ? (
                                <img src={courseData.image} alt={courseData.title} className="w-full h-full object-cover" />
                            ) : (
                                <video
                                    className="w-full h-full object-cover"
                                    controls
                                    controlsList="nodownload"
                                    onContextMenu={(e) => e.preventDefault()}
                                    poster={courseData.image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450'%3E%3Crect fill='%230f172a' width='800' height='450'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='%23475569' font-size='24' font-family='system-ui'%3ECourse Introduction%3C/text%3E%3C/svg%3E"}
                                >
                                    <source src="/Video.mp4" type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </div>

                        <div className="mt-6 bg-gradient-to-r from-emerald-900/20 to-blue-900/20 rounded-xl p-6 border border-emerald-500/20">
                            <div className="flex items-baseline gap-3 mb-2">
                                <span className="text-4xl font-bold text-white">{courseData.price}</span>
                                <span className="text-xl text-slate-500 line-through">{courseData.originalPrice}</span>
                                <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full font-semibold shadow-lg shadow-red-500/20">
                                    89% OFF
                                </span>
                            </div>
                            <p className="text-emerald-400 text-sm font-medium">Limited time offer - Enroll today!</p>
                        </div>
                    </div>
                </div>

                {/* Pricing Plans */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {/* Basic Plan */}
                    <div className="bg-slate-900 rounded-2xl p-8 border-2 border-emerald-500/50 relative transform hover:-translate-y-2 transition-transform duration-300">
                        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                            ACTIVE
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Basic</h3>
                        <div className="text-3xl font-bold text-emerald-400 mb-4">{courseData.price}</div>
                        <p className="text-slate-400 mb-6 text-sm">{courseData.duration} Intensive Program</p>

                        <ul className="space-y-3 mb-8 text-sm text-slate-300">
                            <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Full Course Access</li>
                            <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Study Material</li>
                            <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Only Read Mode</li>
                            <li className="flex items-center gap-2 text-slate-500"><div className="w-2 h-2 rounded-full bg-slate-700" /> No Mentor Support</li>
                        </ul>

                        <button
                            onClick={handleBuyNowClick}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-900/20"
                        >
                            Enroll Now
                        </button>
                    </div>

                    {/* Intermediate Plan */}
                    <div className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800 relative opacity-75 grayscale hover:grayscale-0 transition-all duration-300">
                        <div className="absolute top-0 right-0 bg-slate-700 text-slate-300 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                            COMING SOON
                        </div>
                        <h3 className="text-2xl font-bold text-slate-200 mb-2">Intermediate</h3>
                        <div className="text-3xl font-bold text-slate-300 mb-4">₹50,000</div>
                        <p className="text-slate-500 mb-6 text-sm">45 Days Intensive Program</p>

                        <ul className="space-y-3 mb-8 text-sm text-slate-500">
                            <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-600" /> Live Mentorship</li>
                            <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-600" /> Project Reviews</li>
                            <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-600" /> 45 Days Duration</li>
                            <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-600" /> Certificate</li>
                        </ul>

                        <button disabled className="w-full bg-slate-800 text-slate-500 font-bold py-3 rounded-xl cursor-not-allowed">
                            Currently Inactive
                        </button>
                    </div>

                    {/* Advanced Plan */}
                    <div className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800 relative opacity-75 grayscale hover:grayscale-0 transition-all duration-300">
                        <div className="absolute top-0 right-0 bg-slate-700 text-slate-300 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                            COMING SOON
                        </div>
                        <h3 className="text-2xl font-bold text-slate-200 mb-2">Advanced</h3>
                        <div className="text-3xl font-bold text-slate-300 mb-4">₹2,00,000</div>
                        <p className="text-slate-500 mb-6 text-sm">6 Months Master Program</p>

                        <ul className="space-y-3 mb-8 text-sm text-slate-500">
                            <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-600" /> 1-on-1 Mentorship</li>
                            <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-600" /> Placement Assistance</li>
                            <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-600" /> 6 Months Duration</li>
                            <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-600" /> Industrial Projects</li>
                        </ul>

                        <button disabled className="w-full bg-slate-800 text-slate-500 font-bold py-3 rounded-xl cursor-not-allowed">
                            Currently Inactive
                        </button>
                    </div>
                </div>

                {/* Registration Form Modal */}
                {showRegistrationForm && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-slate-800">
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-white">Complete Your Registration</h2>
                                    <button
                                        onClick={() => setShowRegistrationForm(false)}
                                        className="text-slate-400 hover:text-white text-2xl transition-colors"
                                    >
                                        ×
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Course Info */}
                                    <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20">
                                        <h3 className="font-semibold text-white mb-2">{formData.course} - Basic Plan</h3>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-bold text-white">{courseData.price}</span>
                                            <span className="text-lg text-slate-500 line-through">{courseData.originalPrice}</span>
                                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                                                99% OFF
                                            </span>
                                        </div>
                                    </div>

                                    {/* Registration Form */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Full Name *
                                            </label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-white placeholder-slate-500"
                                                    placeholder="Enter your full name"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
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
                                                    className={`w-full pl-10 pr-24 py-3 bg-slate-800 border ${emailVerified ? 'border-emerald-500' : 'border-slate-700'} rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-white placeholder-slate-500`}
                                                    placeholder="Enter your email address"
                                                    required
                                                />
                                                {!emailVerified && (
                                                    <button
                                                        onClick={sendOtp}
                                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-md transition-colors"
                                                    >
                                                        Verify
                                                    </button>
                                                )}
                                                {emailVerified && (
                                                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-500 text-sm font-bold">
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
                                                        className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-white placeholder-slate-500"
                                                        placeholder="Enter OTP"
                                                    />
                                                    <button
                                                        onClick={verifyOtp}
                                                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-colors"
                                                    >
                                                        Confirm
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Phone Number *
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-white placeholder-slate-500"
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
                                            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-emerald-500/50 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none"
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
