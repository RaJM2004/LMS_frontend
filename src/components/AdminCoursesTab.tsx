import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { Edit, Trash2, Plus, Save, X } from 'lucide-react';

const AdminCoursesTab: React.FC = () => {
    const [courses, setCourses] = useState<any[]>([]);
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState<any | null>(null);
        const [courseForm, setCourseForm] = useState({
        id: '', title: '', level: 'Intermediate', rating: '4.5 (100)',
        duration: '4 weeks', enrolled: '100', price: '', originalPrice: '',
        discount: '', desc: '', image: '', color: 'blue', status: 'Active',
        videoUrl: '', brochureUrl: '', learnings: [''], modules: [] as any[]
    });

    const fetchCourses = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/course-metadata`);
            const data = await res.json();
            if (Array.isArray(data)) setCourses(data);
        } catch (err) {
            console.error("Error fetching courses", err);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

        const handleAddCourse = () => {
        setEditingCourse(null);
        setCourseForm({
            id: '', title: '', level: 'Intermediate', rating: '4.5 (100)',
            duration: '4 weeks', enrolled: '100', price: '', originalPrice: '',
            discount: '', desc: '', image: '', color: 'blue', status: 'Active',
            videoUrl: '', brochureUrl: '', learnings: [''], modules: []
        });
        setShowCourseModal(true);
    };

    const handleEditCourse = (course: any) => {
        setEditingCourse(course);
        setCourseForm(course);
        setShowCourseModal(true);
    };

    const handleSaveCourse = async () => {
        try {
            const url = editingCourse 
                ? `${API_BASE_URL}/api/course-metadata/${editingCourse.id}`
                : `${API_BASE_URL}/api/course-metadata`;
            const method = editingCourse ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(courseForm)
            });

            if (res.ok) {
                setShowCourseModal(false);
                fetchCourses();
            } else {
                const err = await res.json();
                alert(`Error saving course: ${err.error}`);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteCourse = async (id: string) => {
        if (!confirm('Are you sure you want to delete this course?')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/course-metadata/${id}`, { method: 'DELETE' });
            if (res.ok) fetchCourses();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Course Management</h2>
                    <p className="text-gray-500">Manage all courses metadata and pricing.</p>
                </div>
                <button onClick={handleAddCourse} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors">
                    <Plus size={20} className="mr-2" /> Add New Course
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                            <tr>
                                <th className="p-4 font-medium">Course ID</th>
                                <th className="p-4 font-medium">Title</th>
                                <th className="p-4 font-medium">Price</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {courses.map(course => (
                                <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-sm text-gray-500 font-mono">{course.id}</td>
                                    <td className="p-4 font-medium text-gray-800">{course.title}</td>
                                    <td className="p-4 text-sm text-gray-600">{course.price}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${course.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {course.status}
                                        </span>
                                    </td>
                                    <td className="p-4 flex justify-end space-x-2">
                                        <button onClick={() => handleEditCourse(course)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => handleDeleteCourse(course.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showCourseModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fadeIn">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">{editingCourse ? 'Edit Course' : 'Add New Course'}</h2>
                            <button onClick={() => setShowCourseModal(false)} className="text-gray-500 hover:text-gray-700">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Course ID (unique)</label>
                                <input type="text" value={courseForm.id} onChange={e => setCourseForm({...courseForm, id: e.target.value})} disabled={!!editingCourse} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
                                <input type="text" value={courseForm.title} onChange={e => setCourseForm({...courseForm, title: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Price</label>
                                <input type="text" value={courseForm.price} onChange={e => setCourseForm({...courseForm, price: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" placeholder="e.g. â‚¹35,000 + GST" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                                <textarea value={courseForm.desc} onChange={e => setCourseForm({...courseForm, desc: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" rows={3}></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Image URL</label>
                                <input type="text" value={courseForm.image} onChange={e => setCourseForm({...courseForm, image: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                                <select value={courseForm.status} onChange={e => setCourseForm({...courseForm, status: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500">
                                    <option value="Active">Active</option>
                                    <option value="Draft">Draft</option>
                                    <option value="Upcoming">Upcoming</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Video URL</label>
                                <input type="text" value={courseForm.videoUrl || ''} onChange={e => setCourseForm({...courseForm, videoUrl: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" placeholder="/Video.mp4" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Brochure URL</label>
                                <input type="text" value={courseForm.brochureUrl || ''} onChange={e => setCourseForm({...courseForm, brochureUrl: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" placeholder="/brochure.pdf" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">What you'll learn (comma separated)</label>
                                <textarea value={(courseForm.learnings || []).join(', ')} onChange={e => setCourseForm({...courseForm, learnings: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" rows={2}></textarea>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Syllabus Modules (JSON format)</label>
                                <textarea value={JSON.stringify(courseForm.modules || [], null, 2)} onChange={e => {
                                    try {
                                        setCourseForm({...courseForm, modules: JSON.parse(e.target.value)});
                                    } catch(err) {
                                        // Ignore parse errors while typing
                                    }
                                }} className="w-full p-2 border rounded font-mono text-xs focus:ring-2 focus:ring-blue-500" rows={5} placeholder='[{"title": "Module 1", "topics": ["Topic 1"]}]'></textarea>
                                <p className="text-xs text-gray-500 mt-1">Must be valid JSON array of objects with title and topics fields.</p>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6 space-x-3">
                            <button onClick={() => setShowCourseModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                            <button onClick={handleSaveCourse} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md">
                                {editingCourse ? 'Save Changes' : 'Create Course'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCoursesTab;


