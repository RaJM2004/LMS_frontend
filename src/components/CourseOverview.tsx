import React, { useState, useEffect } from 'react';
import { Clock, BookOpen, Award, ChevronLeft, ChevronRight, Target } from 'lucide-react';

interface CourseOverviewProps {
    language: string;
}

const CourseOverview: React.FC<CourseOverviewProps> = ({ language }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            title: language === 'HINDI' ? 'पाठ्यक्रम के बारे में' : (language === 'KANNADA' ? 'ಕೋರ್ಸ್ ಬಗ್ಗೆ' : 'About the Course'),
            content: language === 'HINDI' ? 'यह व्यापक मशीन लर्निंग मास्टरक्लास आपको शून्य से हीरो तक ले जाने के लिए डिज़ाइन किया गया है। आप पायथन, डेटा विश्लेषण और उन्नत एमएल एल्गोरिदम सीखेंगे।' : (language === 'KANNADA' ? 'ಈ ಸಮಗ್ರ ಮಷಿನ್ ಲರ್ನಿಂಗ್ ಮಾಸ್ಟರ್‌ಕ್ಲಾಸ್ ನಿಮ್ಮನ್ನು ಶೂನ್ಯದಿಂದ ಹೀರೋಗೆ ಕರೆದೊಯ್ಯಲು ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ. ನೀವು ಪೈಥಾನ್, ಡೇಟಾ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಸುಧಾರಿತ ಎಂಎಲ್ ಅಲ್ಗಾರಿದಮ್‌ಗಳನ್ನು ಕಲಿಯುವಿರಿ.' : 'This comprehensive Machine Learning Masterclass is designed to take you from zero to hero. You will learn Python, Data Analysis, and advanced ML algorithms.'),
            icon: <BookOpen size={48} className="text-blue-500" />,
            color: 'bg-blue-50'
        },
        {
            title: language === 'HINDI' ? 'अवधि और समय' : (language === 'KANNADA' ? 'ಅವಧಿ ಮತ್ತು ಸಮಯ' : 'Duration & Time'),
            content: language === 'HINDI' ? 'कुल अवधि: 12 सप्ताह। अनुशंसित प्रयास: 5-7 घंटे प्रति सप्ताह। अपनी गति से सीखें और जीवन भर के लिए सामग्री तक पहुंच प्राप्त करें।' : (language === 'KANNADA' ? 'ಒಟ್ಟು ಅವಧಿ: 12 ವಾರಗಳು. ಶಿಫಾರಸು ಮಾಡಿದ ಪ್ರಯತ್ನ: ವಾರಕ್ಕೆ 5-7 ಗಂಟೆಗಳು. ನಿಮ್ಮ ಸ್ವಂತ ವೇಗದಲ್ಲಿ ಕಲಿಯಿರಿ ಮತ್ತು ಜೀವಮಾನದ ಪ್ರವೇಶವನ್ನು ಪಡೆಯಿರಿ.' : 'Total Duration: 12 Weeks. Recommended Effort: 5-7 hours per week. Learn at your own pace with lifetime access to materials.'),
            icon: <Clock size={48} className="text-green-500" />,
            color: 'bg-green-50'
        },
        {
            title: language === 'HINDI' ? 'आप क्या सीखेंगे' : (language === 'KANNADA' ? 'ನೀವು ಏನು ಕಲಿಯುವಿರಿ' : 'What You Will Learn'),
            content: language === 'HINDI' ? '• पायथन प्रोग्रामिंग\n• डेटा विज़ुअलाइज़ेशन\n• पर्यवेक्षित और अनुपर्यवेक्षित शिक्षण\n• न्यूरल नेटवर्क और डीप लर्निंग' : (language === 'KANNADA' ? '• ಪೈಥಾನ್ ಪ್ರೋಗ್ರಾಮಿಂಗ್\n• ಡೇಟಾ ದೃಶ್ಯೀಕರಣ\n• ಮೇಲ್ವಿಚಾರಣೆ ಮತ್ತು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡದ ಕಲಿಕೆ\n• ನ್ಯೂರಲ್ ನೆಟ್‌ವರ್ಕ್‌ಗಳು ಮತ್ತು ಡೀಪ್ ಲರ್ನಿಂಗ್' : '• Python Programming\n• Data Visualization\n• Supervised & Unsupervised Learning\n• Neural Networks & Deep Learning'),
            icon: <Target size={48} className="text-purple-500" />,
            color: 'bg-purple-50'
        },
        {
            title: language === 'HINDI' ? 'प्रमाणन' : (language === 'KANNADA' ? 'ಪ್ರಮಾಣೀಕರಣ' : 'Certification'),
            content: language === 'HINDI' ? 'पाठ्यक्रम पूरा करने पर उद्योग-मान्यता प्राप्त प्रमाण पत्र प्राप्त करें। अपने लिंक्डइन प्रोफाइल और रिज्यूमे पर अपनी उपलब्धि प्रदर्शित करें।' : (language === 'KANNADA' ? 'ಕೋರ್ಸ್ ಪೂರ್ಣಗೊಂಡ ನಂತರ ಉದ್ಯಮ-ಮಾನ್ಯತೆ ಪಡೆದ ಪ್ರಮಾಣಪತ್ರವನ್ನು ಪಡೆಯಿರಿ. ನಿಮ್ಮ ಲಿಂಕ್ಡ್‌ಇನ್ ಪ್ರೊಫೈಲ್ ಮತ್ತು ರೆಸ್ಯೂಮ್‌ನಲ್ಲಿ ನಿಮ್ಮ ಸಾಧನೆಯನ್ನು ಪ್ರದರ್ಶಿಸಿ.' : 'Earn an industry-recognized certificate upon completion. Showcase your achievement on your LinkedIn profile and resume.'),
            icon: <Award size={48} className="text-orange-500" />,
            color: 'bg-orange-50'
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <div className="mb-8 relative group">
            <div className={`rounded-xl p-8 shadow-sm border border-gray-100 transition-all duration-500 ${slides[currentSlide].color} min-h-[200px] flex items-center`}>
                <div className="flex items-start space-x-6 w-full">
                    <div className="hidden md:block p-4 bg-white rounded-full shadow-sm">
                        {slides[currentSlide].icon}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">{slides[currentSlide].title}</h3>
                        <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                            {slides[currentSlide].content}
                        </p>
                    </div>
                </div>
            </div>

            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
            >
                <ChevronLeft size={24} className="text-gray-600" />
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
            >
                <ChevronRight size={24} className="text-gray-600" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? 'bg-blue-600 w-6' : 'bg-gray-300'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default CourseOverview;
