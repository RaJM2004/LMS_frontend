import React from 'react';

const AboutPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 font-sans p-12">
            <h1 className="text-4xl font-bold text-white mb-6">About Us</h1>
            <p className="text-lg leading-relaxed mb-6">
                Quant X AI is dedicated to empowering the next generation of AI leaders. We offer cutting-edge courses designed by industry experts to bridge the gap between theory and practice.
            </p>
            <p className="text-lg leading-relaxed">
                Our mission is to make advanced AI education accessible to everyone, regardless of their background or location.
            </p>
        </div>
    );
};

export default AboutPage;
