import { useState } from 'react';
import { useStore, EmployeeRank } from '../store/useStore';
import { Users, Plus, Edit2, Trash2, Search, X, Save, Eye, Award, Phone, Mail, UserX, UserCheck, AlertTriangle, Key, CheckCircle, RefreshCw, Upload } from 'lucide-react';

const ranks: EmployeeRank[] = ['مدير عام', 'مدير قسم', 'مشرف', 'مهندس أول', 'مهندس', 'فني أول', 'فني', 'محاسب', 'موظف استقبال', 'عامل'];
const departments = ['الإدارة', 'الهندسة', 'الإنتاج', 'المحاسبة', 'المبيعات', 'خدمة العملاء', 'الموارد البشرية'];

type EmployeeStatus = 'نشط' | 'معلق' | 'مفصول';

const getEmptyForm = () => ({
  name: '',
  username: '',
  password: '',
  nickname: '',
  email: '',
  phone: '',
  rank: 'عامل' as EmployeeRank,
  department: 'الإنتاج',
  baseSalary: 5000,
  bonus: 0,
  deductions: 0,
  taxRate: 14,
  joinDate: new Date().toISOString().split('T')[0],
  status: 'نشط' as EmployeeStatus,
  notes: '',
  avatar: ''
});

const rankColors: Record<string, string> = {
  'مدير عام': 'from-yellow-500 to-amber-600',
  'مدير قسم': 'from-purple-500 to-purple-600',
  'مشرف': 'from-blue-500 to-blue-600',
  'مهندس أول': 'from-cyan-500 to-cyan-600',
  'مهندس': 'from-teal-500 to-teal-600',
  'فني أول': 'from-orange-500 to-orange-600',
  'فني': 'from-amber-500 to-amber-600',
  'محاسب': 'from-green-500 to-green-600',
  'موظف استقبال': 'from-pink-500 to-pink-600',
  'عامل': 'from-gray-500 to-gray-600',
};

export default function Employees() {
  const store = useStore();
  const employees = Array.isArray(store.employees) ? store.employees : Object.values(store.employees || {});
  const isManagerLoggedIn = store.isManagerLoggedIn;
  const currentUser = store.currentUser;

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState(getEmptyForm());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const filtered = employees.filter((e: any) => {
    if (!e || !e.name) return false;
    const matchesSearch = (e.name || '').includes(searchTerm) || (e.nickname || '').includes(searchTerm) || (e.rank || '').includes(searchTerm) || (e.username || '').includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || e.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = () => {
    // التحقق
    if (!form.name.trim()) { setFormError('❌ الاسم مطلوب'); return; }
    if (!form.username.trim()) { setFormError('❌ اسم الموظف للدخول مطلوب'); return; }
    if (form.username.trim().length < 2) { setFormError('❌ اسم الموظف للدخول قصير جداً'); return; }
    if (!form.password.trim()) { setFormError('❌ كلمة المرور مطلوبة'); return; }
    if (form.password.trim().length < 3) { setFormError('❌ كلمة المرور قصيرة جداً (3 أحرف على الأقل)'); return; }

    // تأكد من عدم تكرار اسم الموظف
    const duplicate = employees.find((e: any) => e && e.username && e.id !== editingId && e.username.toLowerCase() === form.username.trim().toLowerCase());
    if (duplicate) { setFormError('❌ اسم الموظف "' + form.username + '" موجود بالفعل!'); return; }

    setFormError('');
    
    const data: any = {
      name: form.name.trim(),
      username: form.username.trim().toLowerCase(),
      password: form.password.trim(),
      nickname: form.nickname.trim() || form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      rank: form.rank,
      department: form.department,
      baseSalary: form.baseSalary || 0,
      bonus: form.bonus || 0,
      deductions: form.deductions || 0,
      taxRate: form.taxRate || 0,
      joinDate: form.joinDate,
      status: form.status,
      notes: form.notes.trim(),
    };
    if (form.avatar) data.avatar = form.avatar;

    if (editingId) {
      store.updateEmployee(editingId, data);
      setSuccessMsg('✅ تم تعديل بيانات الموظف بنجاح');
    } else {
      store.addEmployee(data);
      setSuccessMsg('✅ تم إضافة "' + data.name + '" بنجاح\n📋 اسم الموظف: ' + data.username + '\n🔑 كلمة المرور: ' + data.password);
    }
    
    setForm(getEmptyForm());
    setEditingId(null);
    setShowForm(false);
    setTimeout(() => setSuccessMsg(''), 10000);
  };

  const openAddForm = () => {
    setForm(getEmptyForm());
    setEditingId(null);
    setFormError('');
    setShowForm(true);
  };

  const startEdit = (id: string) => {
    const emp = employees.find((e: any) => e && e.id === id) as any;
    if (!emp) return;
    setForm({
      name: emp.name || '',
      username: emp.username || '',
      password: emp.password || '',
      nickname: emp.nickname || '',
      email: emp.email || '',
      phone: emp.phone || '',
      rank: emp.rank || 'عامل',
      department: emp.department || 'الإنتاج',
      baseSalary: emp.baseSalary || 0,
      bonus: emp.bonus || 0,
      deductions: emp.deductions || 0,
      taxRate: emp.taxRate || 14,
      joinDate: emp.joinDate || new Date().toISOString().split('T')[0],
      status: emp.status || 'نشط',
      notes: emp.notes || '',
      avatar: emp.avatar || ''
    });
    setEditingId(id);
    setFormError('');
    setShowForm(true);
  };

  const doCopy = (emp: any) => {
    const text = 'بيانات الدخول:\nاسم الموظف: ' + (emp.username || '---') + '\nكلمة المرور: ' + (emp.password || '---');
    try {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedId(emp.id);
        setTimeout(() => setCopiedId(null), 2000);
      }).catch(() => {
        window.prompt('انسخ البيانات يدوياً:', text);
      });
    } catch {
      window.prompt('انسخ البيانات يدوياً:', text);
    }
  };

  const genPassword = () => {
    const c = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let p = '';
    for (let i = 0; i < 8; i++) p += c[Math.floor(Math.random() * c.length)];
    setForm({ ...form, password: p });
  };

  const genUsername = () => {
    if (!form.name.trim()) return;
    let base = form.name.split(' ')[0].toLowerCase()
      .replace(/[أإآاع]/g, 'a').replace(/[ب]/g, 'b').replace(/[تط]/g, 't')
      .replace(/[ثش]/g, 'sh').replace(/[ج]/g, 'g').replace(/[حه]/g, 'h')
      .replace(/[خ]/g, 'kh').replace(/[دض]/g, 'd').replace(/[ذزظ]/g, 'z')
      .replace(/[ر]/g, 'r').replace(/[سص]/g, 's').replace(/[غ]/g, 'gh')
      .replace(/[ف]/g, 'f').replace(/[ق]/g, 'q').replace(/[ك]/g, 'k')
      .replace(/[ل]/g, 'l').replace(/[م]/g, 'm').replace(/[ن]/g, 'n')
      .replace(/[و]/g, 'w').replace(/[يى]/g, 'y').replace(/[ةء]/g, '')
      .replace(/[^a-z0-9]/g, '');
    if (!base) base = 'user';
    let n = 1;
    let username = base;
    while (employees.some((e: any) => e && e.username === username)) { username = base + n; n++; }
    setForm({ ...form, username });
  };

  const viewingEmployee = viewingId ? employees.find((e: any) => e && e.id === viewingId) as any : null;
  const activeCount = employees.filter((e: any) => e && e.status === 'نشط').length;
  const suspendedCount = employees.filter((e: any) => e && e.status === 'معلق').length;
  const firedCount = employees.filter((e: any) => e && e.status === 'مفصول').length;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Success */}
      {successMsg && (
        <div className="bg-green-50 border-2 border-green-400 rounded-2xl p-5 flex items-start gap-4 shadow-lg">
          <CheckCircle size={28} className="text-green-500 shrink-0 mt-1" />
          <div className="flex-1">
            <p className="font-bold text-green-800 text-lg">تمت العملية بنجاح</p>
            <pre className="text-green-700 text-sm mt-2 whitespace-pre-wrap font-sans leading-relaxed">{successMsg}</pre>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-green-400 hover:text-green-600"><X size={22} /></button>
        </div>
      )}

      {/* Header */}
      <div className="gov-card rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl luxury-gradient flex items-center justify-center">
              <Users size={28} className="text-[#d4af37]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#1e3a5f]">إدارة الموظفين</h2>
              <p className="text-gray-500 text-sm">{employees.length} موظف • {activeCount} نشط</p>
            </div>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="بحث..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pr-12 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#d4af37] text-sm" />
            </div>
            {isManagerLoggedIn && (
              <button type="button" onClick={openAddForm}
                className="bg-gradient-to-l from-[#1e3a5f] to-[#0f2540] border-2 border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#1e3a5f] flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer">
                <Plus size={18} /> إضافة موظف جديد
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { key: 'all', label: 'الكل', count: employees.length, color: '' },
          { key: 'نشط', label: '✅ نشط', count: activeCount, color: 'text-green-600' },
          { key: 'معلق', label: '⚠️ معلق', count: suspendedCount, color: 'text-amber-600' },
          { key: 'مفصول', label: '❌ مفصول', count: firedCount, color: 'text-red-600' },
        ].map(f => (
          <button key={f.key} type="button" onClick={() => setFilterStatus(f.key)}
            className={`gov-card rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all ${filterStatus === f.key ? 'ring-2 ring-[#d4af37] bg-[#d4af37]/5' : ''}`}>
            <span className={`font-medium ${f.color}`}>{f.label}</span>
            <span className="text-xl font-bold text-[#1e3a5f]">{f.count}</span>
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((emp: any) => {
          if (!emp || !emp.id) return null;
          const rc = rankColors[emp.rank] || 'from-gray-500 to-gray-600';
          const isMe = currentUser?.id === emp.id;
          return (
            <div key={emp.id} className={`bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 border-t-4 border-t-[#d4af37] ${emp.status === 'مفصول' ? 'opacity-50' : ''} ${isMe ? 'ring-2 ring-[#d4af37]' : ''}`}>
              <div className={`bg-gradient-to-l ${rc} p-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-xl overflow-hidden relative">
                      {emp.avatar ? (
                        <img src={emp.avatar} alt={emp.name} className="w-full h-full object-cover" />
                      ) : (
                        (emp.name || '?').charAt(0)
                      )}
                      {isManagerLoggedIn && !emp.isManager && (
                        <label className="absolute inset-0 cursor-pointer bg-black/0 hover:bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-all">
                          <span className="text-white text-xs">📷</span>
                          <input type="file" accept="image/*" className="hidden" onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => store.updateEmployee(emp.id, { avatar: reader.result as string });
                              reader.readAsDataURL(file);
                            }
                          }} />
                        </label>
                      )}
                    </div>
                    <div className="text-white">
                      <h3 className="font-bold">{emp.name} {isMe && <span className="text-xs bg-white/30 px-2 py-0.5 rounded-full mr-1">أنت</span>}</h3>
                      <p className="text-sm text-white/80">@{emp.username || '---'}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1.5 rounded-full font-bold ${
                    emp.status === 'نشط' ? 'bg-green-500 text-white' :
                    emp.status === 'معلق' ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'
                  }`}>{emp.status}</span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Award size={16} className="text-[#d4af37]" />
                  <span className="font-bold text-[#1e3a5f]">{emp.rank}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500 text-sm">{emp.department}</span>
                </div>

                {emp.email && <div className="flex items-center gap-2 text-gray-600 text-sm"><Mail size={14} className="text-gray-400" />{emp.email}</div>}
                {emp.phone && <div className="flex items-center gap-2 text-gray-600 text-sm"><Phone size={14} className="text-gray-400" />{emp.phone}</div>}

                {/* نسخ بيانات الدخول - لـ HR فقط */}
                {isManagerLoggedIn && (
                  <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-blue-700 text-xs font-bold flex items-center gap-1"><Key size={14} /> بيانات الدخول</span>
                      <button type="button" onClick={() => doCopy(emp)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-all ${copiedId === emp.id ? 'bg-green-500 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'}`}>
                        {copiedId === emp.id ? '✅ تم النسخ!' : '📋 نسخ'}
                      </button>
                    </div>
                    <div className="text-xs text-blue-800 space-y-1 bg-white rounded-lg p-2">
                      <p>👤 اسم الموظف: <strong className="text-[#1e3a5f]">{emp.username || '---'}</strong></p>
                      <p>🔑 كلمة المرور: <strong className="text-[#1e3a5f]">{emp.password || '---'}</strong></p>
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-3 border-t border-gray-100">
                  <span className="text-gray-500">صافي الراتب</span>
                  <span className={`font-bold text-lg ${emp.status === 'مفصول' ? 'text-gray-400 line-through' : 'text-green-600'}`}>
                    {(emp.netSalary || 0).toLocaleString()} ج.م
                  </span>
                </div>

                {/* أزرار */}
                <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                  <button type="button" onClick={() => setViewingId(emp.id)}
                    className="flex-1 flex items-center justify-center gap-1 py-2.5 text-sm bg-gray-100 rounded-xl hover:bg-gray-200 font-medium cursor-pointer">
                    <Eye size={16} /> عرض
                  </button>

                  {isManagerLoggedIn && !emp.isManager && (
                    <>
                      <button type="button" onClick={() => startEdit(emp.id)}
                        className="flex-1 flex items-center justify-center gap-1 py-2.5 text-sm text-amber-600 bg-amber-50 rounded-xl hover:bg-amber-100 font-medium cursor-pointer">
                        <Edit2 size={16} /> تعديل
                      </button>

                      {emp.status === 'نشط' && (
                        <button type="button" onClick={() => store.updateEmployee(emp.id, { status: 'معلق' })}
                          className="py-2.5 px-3 text-sm text-yellow-600 bg-yellow-50 rounded-xl hover:bg-yellow-100 font-medium cursor-pointer" title="تعليق">
                          <AlertTriangle size={16} />
                        </button>
                      )}

                      {(emp.status === 'معلق' || emp.status === 'مفصول') && (
                        <button type="button" onClick={() => store.updateEmployee(emp.id, { status: 'نشط' })}
                          className="py-2.5 px-3 text-sm text-green-600 bg-green-50 rounded-xl hover:bg-green-100 font-medium cursor-pointer" title="تنشيط">
                          <UserCheck size={16} />
                        </button>
                      )}

                      <button type="button" onClick={() => setShowDeleteConfirm(emp.id)}
                        className="py-2.5 px-3 text-sm text-red-600 bg-red-50 rounded-xl hover:bg-red-100 font-medium cursor-pointer" title="فصل/حذف">
                        {emp.status === 'مفصول' ? <Trash2 size={16} /> : <UserX size={16} />}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl p-16 text-center text-gray-500 shadow-lg border-t-4 border-[#d4af37]">
          <Users size={64} className="mx-auto mb-4 text-gray-300" />
          <p className="text-xl font-medium">لا يوجد موظفين</p>
        </div>
      )}

      {/* Delete Confirm */}
      {showDeleteConfirm && (() => {
        const emp = employees.find((e: any) => e && e.id === showDeleteConfirm) as any;
        if (!emp) return null;
        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={() => setShowDeleteConfirm(null)}>
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="bg-red-500 p-6 text-center">
                <AlertTriangle size={48} className="text-white mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white">تأكيد الإجراء</h3>
                <p className="text-red-100 mt-2">{emp.name}</p>
              </div>
              <div className="p-6 space-y-3">
                {emp.status !== 'مفصول' && (
                  <button type="button" onClick={() => { store.updateEmployee(emp.id, { status: 'مفصول' }); setShowDeleteConfirm(null); }}
                    className="w-full py-3.5 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 flex items-center justify-center gap-2 cursor-pointer">
                    <UserX size={18} /> فصل الموظف
                  </button>
                )}
                <button type="button" onClick={() => { store.deleteEmployee(emp.id); setShowDeleteConfirm(null); }}
                  className="w-full py-3.5 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-900 flex items-center justify-center gap-2 cursor-pointer">
                  <Trash2 size={18} /> حذف نهائي
                </button>
                <button type="button" onClick={() => setShowDeleteConfirm(null)}
                  className="w-full py-3.5 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 cursor-pointer">إلغاء</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* View Modal */}
      {viewingEmployee && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={() => setViewingId(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl border-t-4 border-[#d4af37]" onClick={e => e.stopPropagation()}>
            <div className={`bg-gradient-to-l ${rankColors[viewingEmployee.rank] || 'from-gray-500 to-gray-600'} p-6 text-center`}>
              <div className="w-20 h-20 mx-auto rounded-2xl bg-white/20 flex items-center justify-center text-white font-bold text-3xl mb-3 overflow-hidden">
                {viewingEmployee.avatar ? (
                  <img src={viewingEmployee.avatar} alt={viewingEmployee.name} className="w-full h-full object-cover" />
                ) : (
                  (viewingEmployee.name || '?').charAt(0)
                )}
              </div>
              <h4 className="text-xl font-bold text-white">{viewingEmployee.name}</h4>
              <p className="text-white/80 text-sm">@{viewingEmployee.username}</p>
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm">{viewingEmployee.rank}</span>
                <span className={`px-3 py-1 rounded-full text-sm ${viewingEmployee.status === 'نشط' ? 'bg-green-500 text-white' : viewingEmployee.status === 'معلق' ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'}`}>{viewingEmployee.status}</span>
              </div>
            </div>
            <div className="p-4 space-y-2 max-h-72 overflow-y-auto">
              {[
                ['اسم الموظف', viewingEmployee.username],
                ['البريد', viewingEmployee.email || '-'],
                ['الهاتف', viewingEmployee.phone || '-'],
                ['القسم', viewingEmployee.department],
                ['تاريخ الانضمام', viewingEmployee.joinDate],
                ['الراتب الأساسي', (viewingEmployee.baseSalary || 0).toLocaleString() + ' ج.م'],
                ['المكافآت', (viewingEmployee.bonus || 0).toLocaleString() + ' ج.م'],
                ['الخصومات', (viewingEmployee.deductions || 0).toLocaleString() + ' ج.م'],
                ['الضريبة', (viewingEmployee.taxRate || 0) + '%'],
                ['صافي الراتب', (viewingEmployee.netSalary || 0).toLocaleString() + ' ج.م'],
              ].map(([label, value], i) => (
                <div key={i} className="flex justify-between p-3 bg-gray-50 rounded-xl text-sm">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-medium text-[#1e3a5f]">{value}</span>
                </div>
              ))}
            </div>
            <div className="p-4 bg-gray-50 border-t flex gap-3">
              {isManagerLoggedIn && !viewingEmployee.isManager && (
                <button type="button" onClick={() => { setViewingId(null); startEdit(viewingEmployee.id); }}
                  className="flex-1 py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 cursor-pointer flex items-center justify-center gap-2">
                  <Edit2 size={18} /> تعديل
                </button>
              )}
              <button type="button" onClick={() => setViewingId(null)} className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 cursor-pointer">إغلاق</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-hidden shadow-2xl border-t-4 border-[#d4af37]" onClick={e => e.stopPropagation()}>
            <div className="luxury-gradient p-5 flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#d4af37]">{editingId ? '✏️ تعديل موظف' : '➕ إضافة موظف جديد'}</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-white/70 hover:text-white cursor-pointer"><X size={24} /></button>
            </div>

            <div className="p-5 overflow-y-auto space-y-5" style={{ maxHeight: 'calc(92vh - 160px)' }}>
              {/* Errors */}
              {formError && (
                <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 text-red-700 font-bold text-sm">{formError}</div>
              )}

              {/* صورة الموظف */}
              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-5">
                <h4 className="font-bold text-purple-800 mb-4 flex items-center gap-2 text-lg">📷 صورة الموظف</h4>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-2xl bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-purple-300 shrink-0">
                    {form.avatar ? (
                      <img src={form.avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400 text-3xl font-bold">{form.name ? form.name.charAt(0) : '?'}</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-3">
                    <label className="flex items-center gap-2 px-4 py-3 bg-purple-500 text-white rounded-xl font-medium cursor-pointer hover:bg-purple-600 transition-all w-fit">
                      <Upload size={18} /> رفع صورة
                      <input type="file" accept="image/*" className="hidden" onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 2 * 1024 * 1024) { alert('الصورة كبيرة (الحد 2MB)'); return; }
                          const reader = new FileReader();
                          reader.onloadend = () => setForm({ ...form, avatar: reader.result as string });
                          reader.readAsDataURL(file);
                        }
                      }} />
                    </label>
                    {form.avatar && (
                      <button type="button" onClick={() => setForm({ ...form, avatar: '' })}
                        className="px-4 py-2 bg-red-100 text-red-600 rounded-xl text-sm font-medium cursor-pointer hover:bg-red-200">
                        🗑️ حذف الصورة
                      </button>
                    )}
                    <p className="text-purple-600 text-xs">اختياري - JPG أو PNG (حد أقصى 2MB)</p>
                  </div>
                </div>
              </div>

              {/* بيانات الدخول */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
                <h4 className="font-bold text-blue-800 mb-4 flex items-center gap-2 text-lg"><Key size={20} /> بيانات تسجيل الدخول</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-blue-700 mb-1">اسم الموظف <span className="text-red-500">*</span></label>
                    <div className="flex gap-2">
                      <input type="text" value={form.username} onChange={e => setForm({...form, username: e.target.value.replace(/\s/g, '')})}
                        placeholder="ahmed" dir="ltr"
                        className="flex-1 px-3 py-3 border-2 border-blue-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none" />
                      <button type="button" onClick={genUsername}
                        className="px-3 py-2 bg-blue-500 text-white rounded-xl text-xs font-bold hover:bg-blue-600 cursor-pointer flex items-center gap-1 shrink-0">
                        <RefreshCw size={14} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-blue-700 mb-1">كلمة المرور <span className="text-red-500">*</span></label>
                    <div className="flex gap-2">
                      <input type="text" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                        placeholder="password" dir="ltr"
                        className="flex-1 px-3 py-3 border-2 border-blue-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none" />
                      <button type="button" onClick={genPassword}
                        className="px-3 py-2 bg-blue-500 text-white rounded-xl text-xs font-bold hover:bg-blue-600 cursor-pointer flex items-center gap-1 shrink-0">
                        <RefreshCw size={14} />
                      </button>
                    </div>
                  </div>
                </div>
                {form.username && form.password && (
                  <div className="mt-3 p-2 bg-green-100 border border-green-300 rounded-lg text-xs text-green-800">
                    ✅ معاينة: اسم الموظف: <strong>{form.username}</strong> | كلمة المرور: <strong>{form.password}</strong>
                  </div>
                )}
              </div>

              {/* البيانات الشخصية */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#1e3a5f] mb-1">الاسم الكامل <span className="text-red-500">*</span></label>
                  <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1e3a5f] mb-1">النيك نيم</label>
                  <input type="text" value={form.nickname} onChange={e => setForm({...form, nickname: e.target.value})}
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1e3a5f] mb-1">البريد</label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                    dir="ltr" className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1e3a5f] mb-1">الهاتف</label>
                  <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                    dir="ltr" className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1e3a5f] mb-1">الرتبة</label>
                  <select value={form.rank} onChange={e => setForm({...form, rank: e.target.value as EmployeeRank})}
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none">
                    {ranks.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1e3a5f] mb-1">القسم</label>
                  <select value={form.department} onChange={e => setForm({...form, department: e.target.value})}
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none">
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1e3a5f] mb-1">الراتب</label>
                  <input type="number" value={form.baseSalary} onChange={e => setForm({...form, baseSalary: +e.target.value})}
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1e3a5f] mb-1">المكافآت</label>
                  <input type="number" value={form.bonus} onChange={e => setForm({...form, bonus: +e.target.value})}
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1e3a5f] mb-1">الخصومات</label>
                  <input type="number" value={form.deductions} onChange={e => setForm({...form, deductions: +e.target.value})}
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1e3a5f] mb-1">الضريبة %</label>
                  <input type="number" value={form.taxRate} onChange={e => setForm({...form, taxRate: +e.target.value})}
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1e3a5f] mb-1">تاريخ الانضمام</label>
                  <input type="date" value={form.joinDate} onChange={e => setForm({...form, joinDate: e.target.value})}
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1e3a5f] mb-1">الحالة</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value as EmployeeStatus})}
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none">
                    <option value="نشط">✅ نشط</option>
                    <option value="معلق">⚠️ معلق</option>
                    <option value="مفصول">❌ مفصول</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1e3a5f] mb-1">ملاحظات</label>
                <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={2}
                  className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl text-sm resize-none focus:border-[#d4af37] focus:outline-none" />
              </div>
            </div>

            {/* زر الحفظ */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex gap-3">
              <button type="button" onClick={handleSubmit}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-l from-[#1e3a5f] to-[#0f2540] text-[#d4af37] rounded-xl font-bold shadow-lg text-lg cursor-pointer hover:shadow-xl transition-all active:scale-95">
                <Save size={22} /> {editingId ? 'حفظ التعديلات' : 'إضافة الموظف'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setFormError(''); }}
                className="px-8 py-4 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 cursor-pointer">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
