import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { BookOpen, Edit, Plus, LogOut, Save, X, FileText, Video, Trash2, Clock, CheckCircle, XCircle, Code, List, Users } from 'lucide-react';

interface Section {
    title: string;
    content: string;
    videoUrl?: string;
    pdfUrl?: string;
    image?: string;
}

interface MCQ {
    question: string;
    options: string[];
    correctAnswer: number;
}

interface Module {
    id: string;
    title: string;
    courseId?: string;
    sections: Section[];
    order: number;
    code?: string;
    output?: string;
    mcqs?: MCQ[];
}

interface ModuleUpdate {
    _id: string;
    moduleId: string;
    title: string;
    courseId?: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: string;
    adminComment?: string;
    order?: number;
    updates?: {
        sections?: Section[];
        code?: string;
        output?: string;
        mcqs?: MCQ[];
    };
}

interface Student {
    _id: string;
    fullName: string;
    email: string;
    enrolledCourses: string[];
    isPaid: boolean;
}

interface InstructorDashboardProps {
    onLogout?: () => void;
    userEmail: string;
}

const InstructorDashboard: React.FC<InstructorDashboardProps> = ({ onLogout, userEmail }) => {
    const [activeTab, setActiveTab] = useState<'modules' | 'updates' | 'students'>('modules');
    const [modules, setModules] = useState<Module[]>([]);
    const [updates, setUpdates] = useState<ModuleUpdate[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [showModuleModal, setShowModuleModal] = useState(false);
    const [showStudentModal, setShowStudentModal] = useState(false);
    const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');
    const [editingModule, setEditingModule] = useState<Module | null>(null);

    // Module Form State
    const [moduleForm, setModuleForm] = useState<Module>({
        id: '',
        title: '',
        courseId: 'python-ai-course',
        order: 0,
        sections: [],
        code: '',
        output: '',
        mcqs: []
    });

    // Student Form State
    const [studentForm, setStudentForm] = useState({
        name: '',
        email: '',
        courseId: 'python-ai-course'
    });

    // Content/Tabs inside Modal
    const [activeModalTab, setActiveModalTab] = useState<'sections' | 'code' | 'mcqs'>('sections');
    const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null);

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
        if (activeTab === 'modules') fetchModules();
        if (activeTab === 'updates') fetchUpdates();
        if (activeTab === 'students') fetchStudents();
    }, [activeTab]);

    const fetchModules = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/courses?all=true`);
            const data = await res.json();
            if (Array.isArray(data)) setModules(data);
        } catch (error) {
            console.error("Error fetching modules:", error);
        }
    };

    const fetchUpdates = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/instructor/my-updates?email=${userEmail}`);
            const data = await res.json();
            if (Array.isArray(data)) setUpdates(data);
        } catch (error) {
            console.error("Error fetching updates:", error);
        }
    };

    const fetchStudents = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/instructor/my-students?email=${userEmail}`);
            const data = await res.json();
            if (Array.isArray(data)) setStudents(data);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };

    const handleSubmitUpdate = async () => {
        try {
            const payload = {
                moduleId: moduleForm.id,
                courseId: moduleForm.courseId,
                title: moduleForm.title,
                instructorEmail: userEmail,
                order: moduleForm.order,
                updates: {
                    sections: moduleForm.sections,
                    code: moduleForm.code,
                    output: moduleForm.output,
                    mcqs: moduleForm.mcqs
                }
            };

            const res = await fetch(`${API_BASE_URL}/api/instructor/submit-update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert('Update submitted for approval!');
                setShowModuleModal(false);
                fetchUpdates();
                resetForm();
            } else {
                alert('Failed to submit update');
            }
        } catch (error) {
            console.error("Error submitting update:", error);
        }
    };

    const handleAddStudent = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/instructor/add-student`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...studentForm, instructorEmail: userEmail })
            });

            const data = await res.json();
            if (res.ok) {
                alert('Student added successfully!');
                setShowStudentModal(false);
                setStudentForm({ name: '', email: '', courseId: 'python-ai-course' });
                fetchStudents();
            } else {
                alert(data.message || 'Failed to add student');
            }
        } catch (error) {
            console.error("Error adding student:", error);
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
            output: '',
            mcqs: []
        });
        setActiveSectionIndex(null);
        setEditingModule(null);
        setActiveModalTab('sections');
    };

    const handleAddModule = () => {
        resetForm();
        setModuleForm(prev => ({ ...prev, order: modules.length + 1 }));
        setShowModuleModal(true);
    };

    // --- Sections Helpers ---
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

    // --- MCQs Helpers ---
    const handleAddMCQ = () => {
        setModuleForm(prev => ({
            ...prev,
            mcqs: [...(prev.mcqs || []), { question: '', options: ['', '', '', ''], correctAnswer: 0 }]
        }));
    };

    const handleDeleteMCQ = (index: number) => {
        const updatedMCQs = [...(moduleForm.mcqs || [])];
        updatedMCQs.splice(index, 1);
        setModuleForm({ ...moduleForm, mcqs: updatedMCQs });
    };

    const handleUpdateMCQ = (index: number, field: keyof MCQ, value: any) => {
        const updatedMCQs = [...(moduleForm.mcqs || [])];
        updatedMCQs[index] = { ...updatedMCQs[index], [field]: value };
        setModuleForm({ ...moduleForm, mcqs: updatedMCQs });
    };

    const handleUpdateMCQOption = (mcqIndex: number, optionIndex: number, value: string) => {
        const updatedMCQs = [...(moduleForm.mcqs || [])];
        const newOptions = [...updatedMCQs[mcqIndex].options];
        newOptions[optionIndex] = value;
        updatedMCQs[mcqIndex].options = newOptions;
        setModuleForm({ ...moduleForm, mcqs: updatedMCQs });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Sidebar */}
            <div className="w-64 bg-gray-900 text-white flex flex-col fixed h-full z-20">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
                        Instructor Panel
                    </h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('modules')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'modules' ? 'bg-teal-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    >
                        <BookOpen size={20} />
                        <span>Course Modules</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('students')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'students' ? 'bg-teal-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    >
                        <Users size={20} />
                        <span>My Students</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('updates')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'updates' ? 'bg-teal-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    >
                        <Clock size={20} />
                        <span>My Pending Updates</span>
                    </button>
                </nav>
                <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center font-bold text-white">
                            I
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">{userEmail}</p>
                            <p className="text-xs text-gray-400">Instructor</p>
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
            <div className="flex-1 ml-64 p-8 min-h-screen overflow-y-auto">
                <header className="mb-8 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800 capitalize">
                        {activeTab === 'modules' ? 'Manage Modules' : activeTab === 'students' ? 'My Users' : 'Submission Status'}
                    </h2>
                </header>

                {activeTab === 'modules' && (
                    <div className="animate-fadeIn">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-600 font-medium">Filter by Course:</span>
                                <select
                                    value={selectedCourseFilter}
                                    onChange={(e) => setSelectedCourseFilter(e.target.value)}
                                    className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                                >
                                    <option value="all">All Courses</option>
                                    {Object.entries(courseNames).map(([id, name]) => (
                                        <option key={id} value={id}>{name}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                onClick={handleAddModule}
                                className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors shadow-md flex items-center"
                            >
                                <Plus size={20} className="mr-2" />
                                Add New Module
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {modules
                                .filter(m => selectedCourseFilter === 'all' || (m.courseId || 'python-ai-course') === selectedCourseFilter)
                                .map(module => (
                                    <div key={module.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group flex flex-col items-start relative overflow-hidden h-full">
                                        <div className={`absolute top-0 right-0 p-2 rounded-bl-lg text-xs font-bold text-white ${getCourseColor(module.courseId || 'python-ai-course')}`}>
                                            {courseNames[module.courseId || 'python-ai-course'] || module.courseId}
                                        </div>
                                        <div className="flex justify-between w-full mt-4">
                                            <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 pr-8">{module.title}</h3>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-4">{module.sections?.length || 0} Sections</p>

                                        <div className="mt-auto w-full pt-4 border-t border-gray-100 flex justify-end">
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
                                                        output: module.output || '',
                                                        mcqs: module.mcqs || []
                                                    });
                                                    setShowModuleModal(true);
                                                }}
                                                className="bg-teal-50 text-teal-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-teal-100 transition-colors flex items-center"
                                            >
                                                <Edit size={16} className="mr-2" />
                                                Edit Content
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {activeTab === 'students' && (
                    <div className="animate-fadeIn">
                        <div className="flex justify-end mb-6">
                            <button
                                onClick={() => setShowStudentModal(true)}
                                className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors shadow-md flex items-center"
                            >
                                <Plus size={20} className="mr-2" />
                                Add User
                            </button>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-gray-600">Full Name</th>
                                        <th className="px-6 py-4 font-semibold text-gray-600">Email</th>
                                        <th className="px-6 py-4 font-semibold text-gray-600">Enrolled Courses</th>
                                        <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {students.map(student => (
                                        <tr key={student._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium">{student.fullName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{student.email}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {student.enrolledCourses?.map(id => courseNames[id] || id).join(', ') || 'None'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${student.isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {student.isPaid ? 'Active' : 'Pending'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {students.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-gray-400">No students added yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'updates' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-fadeIn">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Module</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Submitted At</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Admin Comment</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {updates.map(update => (
                                    <tr key={update._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium">{update.title}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(update.submittedAt).toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center ${update.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                update.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {update.status === 'approved' && <CheckCircle size={14} className="mr-1" />}
                                                {update.status === 'rejected' && <XCircle size={14} className="mr-1" />}
                                                {update.status === 'pending' && <Clock size={14} className="mr-1" />}
                                                {update.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{update.adminComment || '-'}</td>
                                    </tr>
                                ))}
                                {updates.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-400">No updates submitted yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add Student Modal */}
            {showStudentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-[500px] overflow-hidden flex flex-col animate-fadeIn">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-xl font-bold text-gray-800">Add New User</h3>
                            <button onClick={() => setShowStudentModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={studentForm.name}
                                    onChange={e => setStudentForm({ ...studentForm, name: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={studentForm.email}
                                    onChange={e => setStudentForm({ ...studentForm, email: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Assign Course</label>
                                <select
                                    value={studentForm.courseId}
                                    onChange={e => setStudentForm({ ...studentForm, courseId: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                >
                                    {Object.entries(courseNames).map(([id, name]) => (
                                        <option key={id} value={id}>{name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
                            <button onClick={() => setShowStudentModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                            <button onClick={handleAddStudent} className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">Add User</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Module Modal */}
            {showModuleModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-[900px] max-h-[90vh] overflow-hidden flex flex-col animate-fadeIn">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-xl font-bold text-gray-800">
                                {editingModule ? 'Edit Module' : 'Add New Module'}
                            </h3>
                            <button onClick={() => setShowModuleModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 flex overflow-hidden">
                            {/* Left: Module Details */}
                            <div className="w-1/3 border-r border-gray-200 p-6 overflow-y-auto bg-gray-50">
                                <div className="space-y-4 mb-8">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Module ID</label>
                                        <input
                                            type="text"
                                            value={moduleForm.id}
                                            onChange={e => setModuleForm({ ...moduleForm, id: e.target.value })}
                                            placeholder="e.g., module-11"
                                            disabled={!!editingModule}
                                            className={`w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm ${!!editingModule ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                        />
                                        {!editingModule && <p className="text-xs text-gray-400 mt-1">Must be unique</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                                        <input
                                            type="text"
                                            value={moduleForm.title}
                                            onChange={e => setModuleForm({ ...moduleForm, title: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Course</label>
                                        <select
                                            value={moduleForm.courseId || 'python-ai-course'}
                                            onChange={e => setModuleForm({ ...moduleForm, courseId: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm"
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
                                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right: Content Editor (Tabs) */}
                            <div className="flex-1 flex flex-col overflow-hidden bg-white">
                                {/* Tabs Header */}
                                <div className="flex border-b border-gray-200">
                                    <button
                                        onClick={() => setActiveModalTab('sections')}
                                        className={`flex-1 py-3 text-sm font-medium flex items-center justify-center space-x-2 ${activeModalTab === 'sections' ? 'border-b-2 border-teal-500 text-teal-600' : 'text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        <FileText size={16} />
                                        <span>Sections ({moduleForm.sections.length})</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveModalTab('code')}
                                        className={`flex-1 py-3 text-sm font-medium flex items-center justify-center space-x-2 ${activeModalTab === 'code' ? 'border-b-2 border-teal-500 text-teal-600' : 'text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        <Code size={16} />
                                        <span>Code & Output</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveModalTab('mcqs')}
                                        className={`flex-1 py-3 text-sm font-medium flex items-center justify-center space-x-2 ${activeModalTab === 'mcqs' ? 'border-b-2 border-teal-500 text-teal-600' : 'text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        <List size={16} />
                                        <span>MCQs ({moduleForm.mcqs?.length || 0})</span>
                                    </button>
                                </div>

                                {/* Tab Content */}
                                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                                    {activeModalTab === 'sections' && (
                                        <div className="flex h-full gap-4">
                                            <div className="w-1/3 border-r pr-4 overflow-y-auto">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h4 className="font-bold text-gray-700">List</h4>
                                                    <button onClick={handleAddSection} className="text-teal-600 hover:bg-teal-50 p-1 rounded">
                                                        <Plus size={18} />
                                                    </button>
                                                </div>
                                                <div className="space-y-2">
                                                    {moduleForm.sections.map((section, index) => (
                                                        <div
                                                            key={index}
                                                            onClick={() => setActiveSectionIndex(index)}
                                                            className={`p-3 rounded-lg cursor-pointer border transition-all ${activeSectionIndex === index
                                                                ? 'bg-teal-50 border-teal-500 shadow-sm'
                                                                : 'bg-white border-gray-200 hover:border-gray-300'
                                                                }`}
                                                        >
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm font-medium truncate">{section.title || 'Untitled'}</span>
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
                                                </div>
                                            </div>
                                            <div className="flex-1 overflow-y-auto pl-1">
                                                {activeSectionIndex !== null && moduleForm.sections[activeSectionIndex] ? (
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                                                            <input
                                                                type="text"
                                                                value={moduleForm.sections[activeSectionIndex].title}
                                                                onChange={e => handleUpdateSection(activeSectionIndex, 'title', e.target.value)}
                                                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Content (Markdown)</label>
                                                            <textarea
                                                                value={moduleForm.sections[activeSectionIndex].content}
                                                                onChange={e => handleUpdateSection(activeSectionIndex, 'content', e.target.value)}
                                                                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none h-48 font-mono text-sm"
                                                            />
                                                            <p className="text-xs text-gray-500 mt-1">Supports Markdown</p>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div>
                                                                <label className="block text-xs font-medium text-gray-700 mb-1">Video URL</label>
                                                                <input
                                                                    type="text"
                                                                    value={moduleForm.sections[activeSectionIndex].videoUrl || ''}
                                                                    onChange={e => handleUpdateSection(activeSectionIndex, 'videoUrl', e.target.value)}
                                                                    placeholder="https://..."
                                                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-medium text-gray-700 mb-1">PDF URL</label>
                                                                <input
                                                                    type="text"
                                                                    value={moduleForm.sections[activeSectionIndex].pdfUrl || ''}
                                                                    onChange={e => handleUpdateSection(activeSectionIndex, 'pdfUrl', e.target.value)}
                                                                    placeholder="https://..."
                                                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="h-full flex items-center justify-center text-gray-400">Select a section</div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {activeModalTab === 'code' && (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Example Code</label>
                                                <textarea
                                                    value={moduleForm.code}
                                                    onChange={e => setModuleForm({ ...moduleForm, code: e.target.value })}
                                                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none h-64 font-mono text-sm bg-gray-50"
                                                    placeholder="// Write example code here..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Expected Output</label>
                                                <textarea
                                                    value={moduleForm.output}
                                                    onChange={e => setModuleForm({ ...moduleForm, output: e.target.value })}
                                                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none h-32 font-mono text-sm bg-gray-900 text-green-400"
                                                    placeholder="Expected output..."
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {activeModalTab === 'mcqs' && (
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="font-bold text-gray-700">Quiz Questions</h4>
                                                <button onClick={handleAddMCQ} className="text-teal-600 bg-teal-50 hover:bg-teal-100 px-3 py-1 rounded text-sm font-bold flex items-center">
                                                    <Plus size={16} className="mr-1" /> Add Question
                                                </button>
                                            </div>
                                            {moduleForm.mcqs?.map((mcq, idx) => (
                                                <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative group">
                                                    <button
                                                        onClick={() => handleDeleteMCQ(idx)}
                                                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                    <div className="mb-3 pr-8">
                                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Question {idx + 1}</label>
                                                        <input
                                                            type="text"
                                                            value={mcq.question}
                                                            onChange={e => handleUpdateMCQ(idx, 'question', e.target.value)}
                                                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                                            placeholder="Enter question text..."
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                                        {mcq.options.map((opt, optIdx) => (
                                                            <div key={optIdx}>
                                                                <input
                                                                    type="text"
                                                                    value={opt}
                                                                    onChange={e => handleUpdateMCQOption(idx, optIdx, e.target.value)}
                                                                    className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-teal-500 focus:outline-none text-sm"
                                                                    placeholder={`Option ${optIdx + 1}`}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Correct Answer (Index 0-3)</label>
                                                        <select
                                                            value={mcq.correctAnswer}
                                                            onChange={e => handleUpdateMCQ(idx, 'correctAnswer', parseInt(e.target.value))}
                                                            className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm w-full"
                                                        >
                                                            {mcq.options.map((_, i) => (
                                                                <option key={i} value={i}>Option {i + 1}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            ))}
                                            {(!moduleForm.mcqs || moduleForm.mcqs.length === 0) && (
                                                <p className="text-center text-gray-400 py-4">No MCQs added yet.</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-100 flex justify-end space-x-3 bg-white">
                            <button onClick={() => setShowModuleModal(false)} className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancel</button>
                            <button onClick={handleSubmitUpdate} className="px-6 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 shadow-md flex items-center">
                                <Save size={18} className="mr-2" />
                                Submit for Review
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InstructorDashboard;
