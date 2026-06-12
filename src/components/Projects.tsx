import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Plus, Trash2, Edit2, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function Projects() {
  const { projects, clients, employees, addProject, updateProject, deleteProject, addProjectTask, projectTasks } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    clientId: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    budget: 0,
    manager: '',
    location: ''
  });

  const handleAddProject = () => {
    addProject({
      name: formData.name,
      clientId: formData.clientId,
      clientName: clients.find(c => c.id === formData.clientId)?.name || '',
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate,
      budget: formData.budget,
      spent: 0,
      status: 'مخطط',
      progress: 0,
      manager: formData.manager,
      team: [],
      location: formData.location
    });
    setShowForm(false);
    setFormData({
      name: '',
      clientId: '',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      budget: 0,
      manager: '',
      location: ''
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'مكتمل': return <CheckCircle className="text-green-600" />;
      case 'قيد التنفيذ': return <Clock className="text-blue-600" />;
      case 'معلق': return <AlertCircle className="text-yellow-600" />;
      default: return <AlertCircle className="text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#1e3a5f] flex items-center gap-2">
          <span>🏗️</span> إدارة المشاريع
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-[#1e3a5f] to-[#0f2540] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:shadow-lg transition"
        >
          <Plus size={20} /> مشروع جديد
        </button>
      </div>

      {/* نموذج المشروع */}
      {showForm && (
        <div className="gov-card rounded-2xl p-6 bg-blue-50">
          <h3 className="text-lg font-bold text-[#1e3a5f] mb-4">مشروع جديد</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="اسم المشروع"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border rounded-lg px-3 py-2"
            />
            <select
              value={formData.clientId}
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              className="border rounded-lg px-3 py-2"
            >
              <option value="">اختر العميل</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <textarea
            placeholder="وصف المشروع"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="border rounded-lg px-3 py-2 w-full mb-4"
            rows={3}
          />

          <div className="grid grid-cols-3 gap-4 mb-4">
            <input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input type="number" placeholder="الميزانية" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) })} className="border rounded-lg px-3 py-2" />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <select value={formData.manager} onChange={(e) => setFormData({ ...formData, manager: e.target.value })} className="border rounded-lg px-3 py-2">
              <option value="">اختر مدير المشروع</option>
              {employees.map(e => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
            <input type="text" placeholder="الموقع" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="border rounded-lg px-3 py-2" />
          </div>

          <div className="flex gap-2">
            <button onClick={handleAddProject} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
              حفظ المشروع
            </button>
            <button onClick={() => setShowForm(false)} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500">
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* قائمة المشاريع */}
      <div className="grid gap-6">
        {projects.length === 0 ? (
          <div className="text-center py-12 text-gray-500 gov-card rounded-2xl">
            لا توجد مشاريع حالياً
          </div>
        ) : (
          projects.map(project => (
            <div key={project.id} className="gov-card rounded-xl p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(project.status)}
                    <h3 className="text-xl font-bold text-[#1e3a5f]">{project.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{project.clientName}</p>
                  <p className="text-sm text-gray-700 mb-4">{project.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                    <div>
                      <p className="text-gray-600">تاريخ البدء</p>
                      <p className="font-bold">{project.startDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">تاريخ الانتهاء</p>
                      <p className="font-bold">{project.endDate}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="bg-gray-100 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-gray-600">التقدم</span>
                      <span className="text-lg font-bold text-[#d4af37]">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-[#1e3a5f] to-[#d4af37] h-3 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-blue-50 p-2 rounded">
                      <p className="text-gray-600">الميزانية</p>
                      <p className="font-bold text-blue-600">{project.budget.toLocaleString()} ج.م</p>
                    </div>
                    <div className="bg-green-50 p-2 rounded">
                      <p className="text-gray-600">المنفق</p>
                      <p className="font-bold text-green-600">{project.spent.toLocaleString()} ج.م</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t">
                <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200">
                  عرض التفاصيل
                </button>
                <button className="px-3 py-1 bg-purple-100 text-purple-600 rounded text-sm hover:bg-purple-200">
                  إضافة مهمة
                </button>
                <button onClick={() => deleteProject(project.id)} className="px-3 py-1 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200">
                  حذف
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
