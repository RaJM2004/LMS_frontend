import React from 'react';
import { Settings, CheckCircle, Circle, Lock, MessageCircle, Medal as Award } from 'lucide-react';
import { translations } from '../translations';

interface Lesson {
    id: string;
    title: string;
    completed: boolean;
    locked?: boolean;
}

interface SidebarProps {
    progress: number;
    lessons: Lesson[];
    currentLessonId: string;
    onSelectLesson: (id: string) => void;
    onSettingsClick: () => void;
    language: string;
    isAdmin?: boolean;
    onAdminClick?: () => void;
    onCertificateClick?: () => void;
    courses?: { id: string; name: string }[];
    activeCourseId?: string;
    onCourseSelect?: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    progress,
    lessons,
    currentLessonId,
    onSelectLesson,
    onSettingsClick,
    language,
    isAdmin,
    onAdminClick,
    onCertificateClick,
    courses = [],
    activeCourseId,
    onCourseSelect
}) => {
    const t = translations[language as keyof typeof translations] || translations.ENGLISH;

    return (
        <div className="w-64 bg-white h-full border-r border-gray-200 flex flex-col shadow-lg z-10">
            <div className="p-4 border-b border-gray-200 bg-blue-900 text-white">
                <div className="flex items-center space-x-2 mb-4">
                    <img src="/logo.png" alt="Quant X AI" className="h-8 bg-white rounded-full p-1" />
                </div>

                {/* Course Switcher */}
                {courses.length > 1 && onCourseSelect && (
                    <div className="mb-4">
                        <label className="text-xs text-blue-200 uppercase tracking-wider font-bold mb-1 block">Current Course</label>
                        <select
                            value={activeCourseId}
                            onChange={(e) => onCourseSelect(e.target.value)}
                            className="w-full bg-blue-800 text-white text-sm rounded border border-blue-700 p-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        >
                            {courses.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Cover Image only if single course or simplified view */}
                {courses.length <= 1 && (
                    <div className="relative h-32 bg-cover bg-center rounded-lg overflow-hidden mb-2" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80")' }}>
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end p-2">
                            <div>
                                <div className="text-sm font-bold">AI For All</div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                        <span>{Math.min(100, progress)}% {t.completed}</span>
                    </div>
                    <div className="w-full bg-blue-800 h-2 rounded-full">
                        <div className="bg-green-400 h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, progress)}%` }}></div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <div className="px-4 mb-2">
                    <div className="flex items-center space-x-2 p-2 bg-blue-50 text-blue-700 rounded-lg cursor-pointer">
                        <div className="border-2 border-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">100</div>
                        <span className="font-medium">{t.accessibility}</span>
                    </div>
                </div>

                <div className="px-4 mt-6">
                    <h2 className="font-bold text-gray-700 mb-4 uppercase text-xs tracking-wider">{t.lesson}</h2>
                    <ul className="space-y-4">
                        {lessons.map((lesson) => (
                            <li
                                key={lesson.id}
                                onClick={() => !lesson.locked && onSelectLesson(lesson.id)}
                                className={`flex items-center space-x-3 p-2 rounded transition-colors ${lesson.locked
                                    ? 'opacity-50 cursor-not-allowed bg-gray-50'
                                    : 'cursor-pointer hover:bg-gray-50'
                                    } ${currentLessonId === lesson.id ? 'bg-blue-100' : ''}`}
                            >
                                {lesson.locked ? (
                                    <Lock size={24} className="text-gray-400" />
                                ) : lesson.completed ? (
                                    <CheckCircle size={24} className="text-blue-600" />
                                ) : (
                                    <Circle size={24} className="text-gray-400" />
                                )}
                                <span className={`text-sm font-medium ${currentLessonId === lesson.id ? 'text-blue-800' : 'text-gray-600'}`}>{lesson.title}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="p-4 border-t border-gray-200">
                {Math.round(progress) >= 100 && (
                    <button
                        onClick={onCertificateClick}
                        className="flex items-center space-x-2 text-green-600 hover:text-green-800 w-full p-2 rounded hover:bg-green-50 transition-colors mb-2"
                    >
                        <Award size={20} />
                        <span className="font-medium">{t.certificate}</span>
                    </button>
                )}

                <button
                    onClick={onSettingsClick}
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 w-full p-2 rounded hover:bg-gray-50 transition-colors"
                >
                    <Settings size={20} />
                    <span className="font-medium">{t.settings}</span>
                </button>
                {isAdmin && (
                    <button
                        type="button"
                        onClick={onAdminClick}
                        className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 w-full p-2 rounded hover:bg-purple-50 transition-colors mt-2"
                    >
                        <Settings size={20} />
                        <span className="font-medium">Admin Panel</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
