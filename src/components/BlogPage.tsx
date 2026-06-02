import React from 'react';

const BlogPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 font-sans p-12">
            <h1 className="text-4xl font-bold text-white mb-6">Our Blog</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Placeholder Blog Posts */}
                {[1, 2, 3].map((post) => (
                    <div key={post} className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800">
                        <h2 className="text-2xl font-bold text-white mb-2">The Future of AI in 2024</h2>
                        <p className="text-slate-400 text-sm mb-4">December 15, 2023</p>
                        <p className="text-slate-300 mb-4 line-clamp-3">
                            Discover the latest trends and predictions for Artificial Intelligence in the coming year. From Generative AI to tailored learning...
                        </p>
                        <button className="text-blue-400 font-bold hover:text-blue-300 transition-colors">Read More</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlogPage;
