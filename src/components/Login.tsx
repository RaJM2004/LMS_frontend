import React, { useState } from 'react';

interface LoginProps {
    onLogin: (email: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            onLogin(email);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-900 to-blue-600">
            <div className="bg-white p-10 rounded-xl shadow-2xl w-96 transform transition-all hover:scale-105">
                <div className="flex justify-center mb-6">
                    <img src="/logo.png" alt="Quant X AI" className="h-12 rounded-full" />
                </div>
                <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">Welcome Back</h2>
                <p className="text-center text-gray-500 mb-8">Enter your email to access your dashboard</p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg">
                        Login
                    </button>
                    <p className="text-center text-xs text-gray-500 mt-4">
                        New user? Please purchase a course to register.
                    </p>
                </form>

                <div className="mt-6 text-center text-xs text-gray-400">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </div>
            </div>
        </div>
    );
};

export default Login;
