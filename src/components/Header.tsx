import { useState } from 'react';
import { User, LogOut, ChevronDown, Menu } from 'lucide-react';
import { translations } from '../translations';

interface HeaderProps {
    user?: { email: string; fullName?: string } | null;
    onLogout?: () => void;
    onUpdateProfile?: () => void;
    language?: string;
    onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onUpdateProfile, language, onMenuClick }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const t = translations[language as keyof typeof translations] || translations.ENGLISH;

    return (
        <header className="bg-gray-50 border-b border-gray-200 h-16 md:h-20 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 shadow-sm transition-colors duration-200">
            <div className="flex items-center space-x-3 md:space-x-6">
                {/* Mobile Menu Button */}
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 text-gray-700 hover:text-blue-600 focus:outline-none"
                >
                    <Menu size={24} />
                </button>

                <div className="flex items-center space-x-2">
                    <img src="/logo1.png" alt="Quant X AI" className="h-8 md:h-10" />
                </div>
            </div>
            <div className="flex items-center space-x-6">
                {/* Language Selector Removed */}

                {user && (
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center space-x-2 text-gray-800 hover:text-blue-600 focus:outline-none"
                        >
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                                {user.fullName ? user.fullName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-bold hidden md:block">{user.fullName || user.email.split('@')[0]}</span>
                            <ChevronDown size={16} />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 py-1 animate-fadeIn z-50">
                                <button
                                    onClick={() => {
                                        setIsDropdownOpen(false);
                                        onUpdateProfile?.();
                                    }}
                                    className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
                                >
                                    <User size={16} />
                                    <span>{t.updateProfile}</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setIsDropdownOpen(false);
                                        onLogout?.();
                                    }}
                                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
                                >
                                    <LogOut size={16} />
                                    <span>{t.logout}</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
