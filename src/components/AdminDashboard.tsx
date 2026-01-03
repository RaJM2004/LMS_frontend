import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { Users, BookOpen, Plus, Edit, Trash2, Save, X, BarChart2, Search, LayoutDashboard, FileText, Video, LogOut } from 'lucide-react';

interface User {
    _id: string;
    email: string;
    fullName: string;
    role: string;
    progress: number;
    completedModules: string[];
    enrolledCourses?: string[];
    quizScores?: {
        moduleId: string;
        score: number;
        totalQuestions: number;
        percentage: number;
    }[];
}

interface Section {
    title: string;
    content: string;
    videoUrl?: string;
    pdfUrl?: string;
    image?: string;
}

interface Module {
    id: string;
    title: string;
    courseId?: string;
    sections: Section[];
    order: number;
    code?: string;
    output?: string;
}

interface AdminDashboardProps {
    onLogout?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'modules'>('dashboard');
    const [users, setUsers] = useState<User[]>([]);
    const [modules, setModules] = useState<Module[]>([]);
    const [showModuleModal, setShowModuleModal] = useState(false);
    const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');
    const [editingModule, setEditingModule] = useState<Module | null>(null);

    // User Editing State
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [userForm, setUserForm] = useState({
        email: '',
        fullName: '',
        role: 'user',
        enrolledCourses: [] as string[]
    });

    // Form State
    const [moduleForm, setModuleForm] = useState<Module>({
        id: '',
        title: '',
        courseId: 'python-ai-course',
        order: 0,
        sections: [],
        code: '',
        output: ''
    });

    // Section Editing State
    const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null);

    // Course Mapping
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

    // Helper to get course color
    const getCourseColor = (courseId: string) => {
        const colors = [
            'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500',
            'bg-indigo-500', 'bg-pink-500', 'bg-teal-500', 'bg-orange-500', 'bg-cyan-500'
        ];
        let hash = 0;
        for (let i = 0; i < courseId.length; i++) {
            hash = courseId.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    useEffect(() => {
        fetchUsers();
        fetchModules();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/users`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setUsers(data);
            } else {
                console.error("Expected array of users, got:", data);
                setUsers([]);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            setUsers([]);
        }
    };

    const fetchModules = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/courses?all=true`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setModules(data);
            } else {
                console.error("Expected array of modules, got:", data);
                setModules([]);
            }
        } catch (error) {
            console.error("Error fetching modules:", error);
            setModules([]);
        }
    };

    const handleAddUser = () => {
        setEditingUser(null);
        setUserForm({
            email: '',
            fullName: '',
            role: 'user',
            enrolledCourses: []
        });
        setShowUserModal(true);
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setUserForm({
            email: user.email || '',
            fullName: user.fullName || '',
            role: user.role || 'user',
            enrolledCourses: user.enrolledCourses || []
        });
        setShowUserModal(true);
    };

    const handleSaveUser = async () => {
        try {
            const url = editingUser
                ? `${API_BASE_URL}/api/admin/users/${editingUser._id}`
                : `${API_BASE_URL}/api/admin/users`;

            const method = editingUser ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userForm)
            });

            if (res.ok) {
                setShowUserModal(false);
                setEditingUser(null);
                // Refresh Users
                fetchUsers();
            } else {
                const errorData = await res.json();
                alert(`Error saving user: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Failed to save user");
        }
    };


    const handleSaveModule = async () => {
        try {
            const url = editingModule
                ? `${API_BASE_URL}/api/admin/modules/${editingModule.id}`
                : `${API_BASE_URL}/api/admin/modules`;

            const method = editingModule ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(moduleForm)
            });

            if (res.ok) {
                setShowModuleModal(false);
                fetchModules();
                setEditingModule(null);
                resetForm();
            }
        } catch (error) {
            console.error("Error saving module:", error);
        }
    };

    const handleDeleteModule = async (id: string) => {
        if (!confirm('Are you sure you want to delete this module?')) return;
        try {
            await fetch(`${API_BASE_URL}/api/admin/modules/${id}`, { method: 'DELETE' });
            fetchModules();
        } catch (error) {
            console.error("Error deleting module:", error);
        }
    };

    const resetForm = () => {
        setModuleForm({
            id: '',
            title: '',
            courseId: 'python-ai-course',
            order: 0,
            sections: [],
            code: '',
            output: ''
        });
        setActiveSectionIndex(null);
    };

    const handleAddSection = () => {
        setModuleForm({
            ...moduleForm,
            sections: [...moduleForm.sections, { title: 'New Section', content: '' }]
        });
        setActiveSectionIndex(moduleForm.sections.length);
    };

    const handleUpdateSection = (index: number, field: keyof Section, value: string) => {
        const updatedSections = [...moduleForm.sections];
        updatedSections[index] = { ...updatedSections[index], [field]: value };
        setModuleForm({ ...moduleForm, sections: updatedSections });
    };

    const handleDeleteSection = (index: number) => {
        const updatedSections = moduleForm.sections.filter((_, i) => i !== index);
        setModuleForm({ ...moduleForm, sections: updatedSections });
        setActiveSectionIndex(null);
    };

    // Stats
    const totalUsers = users.length;
    const totalModules = modules.length;
    const activeUsers = users.filter(u => u.progress > 0).length;
    const completionRate = users.length > 0
        ? Math.round((users.reduce((acc, curr) => acc + curr.progress, 0) / (users.length * 100)) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Sidebar */}
            <div className="w-64 bg-gray-900 text-white flex flex-col fixed h-full">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        Admin Panel
                    </h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                    >
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'users' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                    >
                        <Users size={20} />
                        <span>User Management</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('modules')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'modules' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                    >
                        <BookOpen size={20} />
                        <span>Course Content</span>
                    </button>
                </nav>
                <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center font-bold">
                            A
                        </div>
                        <div>
                            <p className="text-sm font-medium">Administrator</p>
                            <p className="text-xs text-gray-500">admin@quantxai.com</p>
                        </div>
                    </div>
                    {onLogout && (
                        <button
                            onClick={onLogout}
                            className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-red-400 hover:bg-gray-800 hover:text-red-300 transition-all border border-gray-800 hover:border-red-900"
                        >
                            <LogOut size={18} />
                            <span className="text-sm font-medium">Logout</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 ml-64 overflow-y-auto min-h-screen">
                <header className="bg-white shadow-sm border-b border-gray-200 p-6 flex justify-between items-center sticky top-0 z-10">
                    <h2 className="text-2xl font-bold text-gray-800 capitalize">
                        {activeTab}
                    </h2>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                            />
                        </div>
                    </div>
                </header>

                <main className="p-8">
                    {activeTab === 'dashboard' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Total Users</p>
                                        <h3 className="text-3xl font-bold text-gray-800">{totalUsers}</h3>
                                    </div>
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                        <Users size={24} />
                                    </div>
                                </div>
                                <div className="text-sm text-green-600 font-medium flex items-center">
                                    <span>+12% from last month</span>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Active Learners</p>
                                        <h3 className="text-3xl font-bold text-gray-800">{activeUsers}</h3>
                                    </div>
                                    <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                                        <BarChart2 size={24} />
                                    </div>
                                </div>
                                <div className="text-sm text-green-600 font-medium flex items-center">
                                    <span>{Math.round((activeUsers / totalUsers) * 100 || 0)}% engagement rate</span>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Total Modules</p>
                                        <h3 className="text-3xl font-bold text-gray-800">{totalModules}</h3>
                                    </div>
                                    <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                                        <BookOpen size={24} />
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500 font-medium flex items-center">
                                    <span>Across {Object.keys(courseNames).length} courses</span>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Avg. Completion</p>
                                        <h3 className="text-3xl font-bold text-gray-800">{completionRate}%</h3>
                                    </div>
                                    <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
                                        <LayoutDashboard size={24} />
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500 font-medium flex items-center">
                                    <span>Global average</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-fadeIn">
                            <div className="p-4 border-b border-gray-100 flex justify-end">
                                <button
                                    onClick={handleAddUser}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md flex items-center text-sm font-bold"
                                >
                                    <Plus size={18} className="mr-2" />
                                    Add New User
                                </button>
                            </div>
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-gray-600">User</th>
                                        <th className="px-6 py-4 font-semibold text-gray-600">Role</th>
                                        <th className="px-6 py-4 font-semibold text-gray-600">Progress</th>
                                        <th className="px-6 py-4 font-semibold text-gray-600 text-center">Quiz Avg</th>
                                        <th className="px-6 py-4 font-semibold text-gray-600">Enrolled Courses</th>
                                        <th className="px-6 py-4 font-semibold text-gray-600">Modules Completed</th>
                                        <th className="px-6 py-4 font-semibold text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {users.map(user => {
                                        const avgQuizScore = user.quizScores && user.quizScores.length > 0
                                            ? Math.round(user.quizScores.reduce((acc, curr) => acc + curr.percentage, 0) / user.quizScores.length)
                                            : null;

                                        return (
                                            <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3">
                                                            {user.fullName ? user.fullName[0].toUpperCase() : user.email[0].toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">{user.fullName || 'N/A'}</p>
                                                            <p className="text-sm text-gray-500">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                                                        {user.role || 'user'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-[140px]">
                                                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${user.progress}%` }}></div>
                                                    </div>
                                                    <span className="text-xs text-gray-500 mt-1 block">{user.progress}%</span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {avgQuizScore !== null ? (
                                                        <span className={`font-bold ${avgQuizScore >= 80 ? 'text-green-600' : avgQuizScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                            {avgQuizScore}%
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">No Quizzes</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap gap-1">
                                                        {(user.enrolledCourses || []).map(cid => (
                                                            <span key={cid} className="px-2 py-1 text-xs rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                                {courseNames[cid] || cid}
                                                            </span>
                                                        ))}
                                                        {(!user.enrolledCourses || user.enrolledCourses.length === 0) && (
                                                            <span className="text-xs text-gray-400 italic">None</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {user.completedModules.length}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleEditUser(user)}
                                                            className="text-gray-400 hover:text-blue-600 transition-colors"
                                                        >
                                                            <Edit size={18} />
                                                        </button>
                                                        {/* Add delete button here if needed in future */}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'modules' && (
                        <div className="animate-fadeIn">
                            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                                <div className="flex items-center space-x-4">
                                    <h3 className="text-gray-700 font-bold">Filter by Course:</h3>
                                    <select
                                        value={selectedCourseFilter}
                                        onChange={(e) => setSelectedCourseFilter(e.target.value)}
                                        className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none max-w-xs"
                                    >
                                        <option value="all">All Courses</option>
                                        {Object.entries(courseNames).map(([id, name]) => (
                                            <option key={id} value={id}>{name}</option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    onClick={() => {
                                        setEditingModule(null);
                                        resetForm();
                                        setModuleForm(prev => ({ ...prev, order: modules.length + 1 }));
                                        setShowModuleModal(true);
                                    }}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md flex items-center"
                                >
                                    <Plus size={20} className="mr-2" />
                                    Add New Module
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {modules
                                    .filter(m => selectedCourseFilter === 'all' || (m.courseId || 'python-ai-course') === selectedCourseFilter)
                                    .map(module => (
                                        <div key={module.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group flex flex-col h-full relative overflow-hidden">
                                            <div className={`absolute top-0 right-0 p-2 rounded-bl-lg text-xs font-bold text-white ${getCourseColor(module.courseId || 'python-ai-course')}`}>
                                                {courseNames[module.courseId || 'python-ai-course'] || module.courseId}
                                            </div>
                                            <div className="flex justify-between items-start mb-4 mt-2">
                                                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xl shrink-0">
                                                    {module.order}
                                                </div>
                                                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => {
                                                            setEditingModule(module);
                                                            setModuleForm({
                                                                id: module.id,
                                                                title: module.title,
                                                                courseId: module.courseId || 'python-ai-course',
                                                                order: module.order,
                                                                sections: module.sections || [],
                                                                code: module.code || '',
                                                                output: module.output || ''
                                                            });
                                                            setShowModuleModal(true);
                                                        }}
                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteModule(module.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{module.title}</h3>
                                            <p className="text-sm text-gray-500 mb-4 flex-1">{module.sections?.length || 0} Sections</p>
                                            <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden mt-auto">
                                                <div className="bg-blue-500 h-full w-full"></div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Module Modal */}
            {showModuleModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-[900px] max-h-[90vh] overflow-hidden flex flex-col animate-fadeIn">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-xl font-bold text-gray-800">
                                {editingModule ? 'Edit Module' : 'Create New Module'}
                            </h3>
                            <button onClick={() => setShowModuleModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 flex overflow-hidden">
                            {/* Left: Module Details & Section List */}
                            <div className="w-1/3 border-r border-gray-200 p-6 overflow-y-auto bg-gray-50">
                                <div className="space-y-4 mb-8">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Module ID</label>
                                        <input
                                            type="text"
                                            value={moduleForm.id}
                                            onChange={e => setModuleForm({ ...moduleForm, id: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                                            placeholder="e.g., module-11"
                                            disabled={!!editingModule}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                                        <input
                                            type="text"
                                            value={moduleForm.title}
                                            onChange={e => setModuleForm({ ...moduleForm, title: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                                            placeholder="Module Title"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Course</label>
                                        <select
                                            value={moduleForm.courseId || 'python-ai-course'}
                                            onChange={e => setModuleForm({ ...moduleForm, courseId: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                                        >
                                            {Object.entries(courseNames).map(([id, name]) => (
                                                <option key={id} value={id}>{name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Order</label>
                                        <input
                                            type="number"
                                            value={moduleForm.order}
                                            onChange={e => setModuleForm({ ...moduleForm, order: parseInt(e.target.value) })}
                                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold text-gray-700">Sections</h4>
                                    <button
                                        onClick={handleAddSection}
                                        className="text-blue-600 hover:bg-blue-50 p-1 rounded"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {moduleForm.sections.map((section, index) => (
                                        <div
                                            key={index}
                                            onClick={() => setActiveSectionIndex(index)}
                                            className={`p-3 rounded-lg cursor-pointer border transition-all ${activeSectionIndex === index
                                                ? 'bg-white border-blue-500 shadow-sm'
                                                : 'bg-white border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium truncate">{section.title || 'Untitled Section'}</span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteSection(index);
                                                    }}
                                                    className="text-gray-400 hover:text-red-500"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {moduleForm.sections.length === 0 && (
                                        <p className="text-sm text-gray-400 text-center py-4">No sections added</p>
                                    )}
                                </div>
                            </div>

                            {/* Right: Section Editor */}
                            <div className="flex-1 p-6 overflow-y-auto bg-white">
                                {activeSectionIndex !== null && moduleForm.sections[activeSectionIndex] ? (
                                    <div className="space-y-6 animate-fadeIn">
                                        <div className="flex justify-between items-center border-b pb-4">
                                            <h4 className="font-bold text-gray-800">Editing Section {activeSectionIndex + 1}</h4>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                                            <input
                                                type="text"
                                                value={moduleForm.sections[activeSectionIndex].title}
                                                onChange={e => handleUpdateSection(activeSectionIndex, 'title', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                placeholder="Section Title"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Content (Markdown)</label>
                                            <textarea
                                                value={moduleForm.sections[activeSectionIndex].content}
                                                onChange={e => handleUpdateSection(activeSectionIndex, 'content', e.target.value)}
                                                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none h-64 font-mono text-sm"
                                                placeholder="# Heading\n\nContent goes here..."
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Supports Markdown formatting</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                                    <Video size={16} className="mr-2" /> Video URL
                                                </label>
                                                <input
                                                    type="text"
                                                    value={moduleForm.sections[activeSectionIndex].videoUrl || ''}
                                                    onChange={e => handleUpdateSection(activeSectionIndex, 'videoUrl', e.target.value)}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                    placeholder="https://..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                                    <FileText size={16} className="mr-2" /> PDF URL
                                                </label>
                                                <input
                                                    type="text"
                                                    value={moduleForm.sections[activeSectionIndex].pdfUrl || ''}
                                                    onChange={e => handleUpdateSection(activeSectionIndex, 'pdfUrl', e.target.value)}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                    placeholder="https://..."
                                                />
                                            </div>
                                        </div>

                                        <div className="p-6 border-t border-gray-100 flex justify-end space-x-3 bg-white">
                                            <button
                                                onClick={() => setShowModuleModal(false)}
                                                className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSaveModule}
                                                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-md flex items-center"
                                            >
                                                <Save size={18} className="mr-2" />
                                                Save Module
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                        <Edit size={48} className="mb-4 opacity-20" />
                                        <p>Select a section to edit or create a new one</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* User Edit Modal */}
            {showUserModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md animate-fadeIn">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">{editingUser ? 'Edit User' : 'Add New User'}</h2>
                            <button onClick={() => setShowUserModal(false)} className="text-gray-500 hover:text-gray-700">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={userForm.email}
                                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="user@example.com"
                                    disabled={!!editingUser} // Disable email edit for existing users
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={userForm.fullName}
                                    onChange={(e) => setUserForm({ ...userForm, fullName: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Full Name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Role</label>
                                <select
                                    value={userForm.role}
                                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Enrolled Courses</label>
                                <div className="space-y-2 border p-3 rounded bg-gray-50 h-48 overflow-y-auto">
                                    {Object.entries(courseNames).map(([cid, name]) => (
                                        <label key={cid} className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={userForm.enrolledCourses.includes(cid)}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    setUserForm(prev => ({
                                                        ...prev,
                                                        enrolledCourses: checked
                                                            ? [...prev.enrolledCourses, cid]
                                                            : prev.enrolledCourses.filter(c => c !== cid)
                                                    }));
                                                }}
                                                className="form-checkbox text-blue-600 rounded"
                                            />
                                            <span className="text-sm">
                                                {name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6 space-x-3">
                            <button
                                onClick={() => setShowUserModal(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveUser}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md font-medium"
                            >
                                {editingUser ? 'Save Changes' : 'Create User'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
