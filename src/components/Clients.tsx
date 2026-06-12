import { useState } from 'react';
import { useStore } from '../store/useStore';
import { UserCheck, Plus, Edit2, Trash2, Search, X, Save, Eye, Phone, Mail, MapPin, DollarSign } from 'lucide-react';

type ClientStatus = 'جديد' | 'قيد التنفيذ' | 'مكتمل' | 'ملغي';

const projectTypes = ['تكسيات رخام خارجية', 'أرضيات رخام داخلية', 'واجهات معمارية', 'ديكورات داخلية', 'مطابخ رخام', 'حمامات رخام', 'سلالم رخام', 'أعمال نحت', 'أخرى'];

const emptyClient = {
  name: '', email: '', phone: '', address: '', projectType: projectTypes[0],
  budget: 0, status: 'جديد' as ClientStatus, registrationDate: new Date().toISOString().split('T')[0], notes: ''
};

export default function Clients() {
  const store = useStore();
  const { addClient, updateClient, deleteClient } = store;
  const clients = (Array.isArray(store.clients) ? store.clients : Object.values(store.clients || {})) as any[];
  const perms = (() => {
    const u = store.currentUser;
    if (!u) return { canAdd: false, canEdit: false, canDelete: false };
    if (store.isManagerLoggedIn) return { canAdd: true, canEdit: true, canDelete: true };
    const r = u.rank;
    return {
      canAdd: ['مدير قسم','مشرف','مهندس أول','مهندس','محاسب','موظف استقبال'].includes(r),
      canEdit: ['مدير قسم','مشرف','مهندس أول','محاسب'].includes(r),
      canDelete: false,
    };
  })();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState(emptyClient);

  const filtered = clients.filter(c =>
    c.name.includes(searchTerm) || c.phone.includes(searchTerm) || c.projectType.includes(searchTerm)
  );

  const handleSubmit = () => {
    if (!form.name) return;
    if (editingId) {
      updateClient(editingId, form);
      setEditingId(null);
    } else {
      addClient(form);
    }
    setForm(emptyClient);
    setShowForm(false);
  };

  const startEdit = (id: string) => {
    const client = clients.find(c => c.id === id);
    if (client) {
      setForm({ name: client.name, email: client.email, phone: client.phone, address: client.address, projectType: client.projectType, budget: client.budget, status: client.status, registrationDate: client.registrationDate, notes: client.notes });
      setEditingId(id);
      setShowForm(true);
    }
  };

  const viewingClient = viewingId ? clients.find(c => c.id === viewingId) : null;

  const statusStyles = (s: string) => {
    switch(s) {
      case 'جديد': return 'bg-blue-500 text-white';
      case 'قيد التنفيذ': return 'bg-amber-500 text-white';
      case 'مكتمل': return 'bg-green-500 text-white';
      case 'ملغي': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="gov-card rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl luxury-gradient flex items-center justify-center">
              <UserCheck size={28} className="text-[#d4af37]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#1e3a5f]">إدارة العملاء</h2>
              <p className="text-gray-500 text-sm">{clients.length} عميل مسجل • {clients.filter(c => c.status === 'قيد التنفيذ').length} مشروع نشط</p>
            </div>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="بحث..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="w-full sm:w-72 pr-12 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#d4af37] text-sm" />
            </div>
            {perms.canAdd && (
              <button onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyClient); }}
                className="gov-button flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold whitespace-nowrap">
                <Plus size={18} /> تسجيل عميل
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'جديد', count: clients.filter(c => c.status === 'جديد').length, color: 'from-blue-500 to-blue-600' },
          { label: 'قيد التنفيذ', count: clients.filter(c => c.status === 'قيد التنفيذ').length, color: 'from-amber-500 to-amber-600' },
          { label: 'مكتمل', count: clients.filter(c => c.status === 'مكتمل').length, color: 'from-green-500 to-green-600' },
          { label: 'ملغي', count: clients.filter(c => c.status === 'ملغي').length, color: 'from-red-500 to-red-600' },
        ].map((stat, i) => (
          <div key={i} className="gov-card rounded-xl p-4 flex items-center justify-between">
            <span className="text-gray-600 font-medium">{stat.label}</span>
            <span className={`text-xl font-bold px-3 py-1 rounded-lg bg-gradient-to-l ${stat.color} text-white`}>{stat.count}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="gov-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm luxury-table">
            <thead>
              <tr>
                <th className="px-6 py-4 text-right font-bold">العميل</th>
                <th className="px-6 py-4 text-right font-bold">نوع المشروع</th>
                <th className="px-6 py-4 text-right font-bold">الميزانية</th>
                <th className="px-6 py-4 text-right font-bold">الحالة</th>
                <th className="px-6 py-4 text-right font-bold">تاريخ التسجيل</th>
                <th className="px-6 py-4 text-right font-bold">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(client => (
                <tr key={client.id} className="border-t border-gray-100 hover:bg-[#d4af37]/5">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-[#1e3a5f]">{client.name}</p>
                        <p className="text-xs text-gray-500">{client.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{client.projectType}</td>
                  <td className="px-6 py-4 font-bold text-green-600">{client.budget.toLocaleString()} ج.م</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-3 py-1.5 rounded-full font-bold ${statusStyles(client.status)}`}>{client.status}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{client.registrationDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      <button onClick={() => setViewingId(client.id)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Eye size={16} /></button>
                      {perms.canEdit && (
                        <button onClick={() => startEdit(client.id)} className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg"><Edit2 size={16} /></button>
                      )}
                      {perms.canDelete && (
                        <button onClick={() => deleteClient(client.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <UserCheck size={64} className="mx-auto mb-4 text-gray-300" />
            <p className="text-xl font-medium">لا يوجد عملاء</p>
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewingClient && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setViewingId(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border-t-4 border-[#d4af37]" onClick={e => e.stopPropagation()}>
            <div className="luxury-gradient p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-[#d4af37]">{viewingClient.name}</h3>
                  <span className={`inline-block mt-2 text-xs px-3 py-1 rounded-full font-bold ${statusStyles(viewingClient.status)}`}>{viewingClient.status}</span>
                </div>
                <button onClick={() => setViewingId(null)} className="text-white/70 hover:text-white"><X size={24} /></button>
              </div>
            </div>
            <div className="p-6 space-y-3">
              {[
                { icon: Mail, label: 'البريد', value: viewingClient.email },
                { icon: Phone, label: 'الهاتف', value: viewingClient.phone },
                { icon: MapPin, label: 'العنوان', value: viewingClient.address },
                { icon: UserCheck, label: 'نوع المشروع', value: viewingClient.projectType },
                { icon: DollarSign, label: 'الميزانية', value: `${viewingClient.budget.toLocaleString()} ج.م` },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </div>
                    <span className="font-medium text-[#1e3a5f]">{item.value || '-'}</span>
                  </div>
                );
              })}
              {viewingClient.notes && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 text-sm mb-1">ملاحظات</p>
                  <p className="text-[#1e3a5f]">{viewingClient.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border-t-4 border-[#d4af37]" onClick={e => e.stopPropagation()}>
            <div className="luxury-gradient p-6 flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#d4af37]">{editingId ? 'تعديل عميل' : 'تسجيل عميل جديد'}</h3>
              <button onClick={() => setShowForm(false)} className="text-white/70 hover:text-white"><X size={24} /></button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#1e3a5f] mb-2">اسم العميل *</label>
                  <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#d4af37] text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1e3a5f] mb-2">البريد الإلكتروني</label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#d4af37] text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1e3a5f] mb-2">الهاتف</label>
                  <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#d4af37] text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1e3a5f] mb-2">العنوان</label>
                  <input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#d4af37] text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1e3a5f] mb-2">نوع المشروع</label>
                  <select value={form.projectType} onChange={e => setForm({...form, projectType: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#d4af37] text-sm">
                    {projectTypes.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1e3a5f] mb-2">الميزانية</label>
                  <input type="number" value={form.budget} onChange={e => setForm({...form, budget: +e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#d4af37] text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1e3a5f] mb-2">الحالة</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value as ClientStatus})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#d4af37] text-sm">
                    <option value="جديد">جديد</option>
                    <option value="قيد التنفيذ">قيد التنفيذ</option>
                    <option value="مكتمل">مكتمل</option>
                    <option value="ملغي">ملغي</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1e3a5f] mb-2">تاريخ التسجيل</label>
                  <input type="date" value={form.registrationDate} onChange={e => setForm({...form, registrationDate: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#d4af37] text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-[#1e3a5f] mb-2">ملاحظات</label>
                  <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#d4af37] text-sm resize-none" />
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
              <button onClick={handleSubmit}
                className="flex-1 flex items-center justify-center gap-2 py-3 luxury-gradient text-[#d4af37] rounded-xl font-bold shadow-lg">
                <Save size={18} /> {editingId ? 'حفظ التعديلات' : 'تسجيل العميل'}
              </button>
              <button onClick={() => setShowForm(false)} className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
