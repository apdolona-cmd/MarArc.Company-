import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Receipt, Plus, Edit2, Trash2, X, Save, AlertTriangle, CheckCircle, Clock, DollarSign } from 'lucide-react';

type TaxStatus = 'مدفوع' | 'معلق' | 'متأخر';

const taxTypes = ['ضريبة القيمة المضافة', 'ضريبة الدخل', 'ضريبة كسب العمل', 'تأمينات اجتماعية', 'ضريبة عقارية', 'رسوم حكومية', 'أخرى'];

const emptyTax = {
  type: taxTypes[0], amount: 0, period: '', status: 'معلق' as TaxStatus,
  dueDate: new Date().toISOString().split('T')[0], description: ''
};

export default function Taxes() {
  const { taxRecords, addTaxRecord, updateTaxRecord, deleteTaxRecord, employees, isManagerLoggedIn } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyTax);

  const totalTaxes = taxRecords.reduce((s, t) => s + t.amount, 0);
  const paidTaxes = taxRecords.filter(t => t.status === 'مدفوع').reduce((s, t) => s + t.amount, 0);
  const pendingTaxes = taxRecords.filter(t => t.status === 'معلق').reduce((s, t) => s + t.amount, 0);
  const overdueTaxes = taxRecords.filter(t => t.status === 'متأخر').reduce((s, t) => s + t.amount, 0);

  const employeeTaxTotal = employees.reduce((s, e) => {
    if (e.status !== 'نشط') return s;
    return s + Math.round((e.baseSalary + e.bonus - e.deductions) * (e.taxRate / 100));
  }, 0);

  const handleSubmit = () => {
    if (!form.type || !form.amount) return;
    if (editingId) {
      updateTaxRecord(editingId, form);
      setEditingId(null);
    } else {
      addTaxRecord(form);
    }
    setForm(emptyTax);
    setShowForm(false);
  };

  const startEdit = (id: string) => {
    const tax = taxRecords.find(t => t.id === id);
    if (tax) {
      setForm({ type: tax.type, amount: tax.amount, period: tax.period, status: tax.status, dueDate: tax.dueDate, description: tax.description });
      setEditingId(id);
      setShowForm(true);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="gov-card rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl luxury-gradient flex items-center justify-center">
              <Receipt size={28} className="text-[#d4af37]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#1e3a5f]">نظام الضرائب</h2>
              <p className="text-gray-500 text-sm">إدارة ومتابعة الالتزامات الضريبية</p>
            </div>
          </div>
          {isManagerLoggedIn && (
            <button onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyTax); }}
              className="gov-button flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold">
              <Plus size={18} /> إضافة ضريبة
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'إجمالي الضرائب', value: totalTaxes, icon: Receipt, color: 'from-gray-700 to-gray-800' },
          { label: 'مدفوع', value: paidTaxes, icon: CheckCircle, color: 'from-green-500 to-green-600' },
          { label: 'معلق', value: pendingTaxes, icon: Clock, color: 'from-amber-500 to-amber-600' },
          { label: 'متأخر', value: overdueTaxes, icon: AlertTriangle, color: 'from-red-500 to-red-600' },
          { label: 'ضرائب الرواتب الشهرية', value: employeeTaxTotal, icon: DollarSign, color: 'from-blue-500 to-blue-600' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="gov-card rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <Icon size={20} className="text-white" />
                </div>
                <span className="text-xs text-gray-500">{stat.label}</span>
              </div>
              <p className="text-xl font-bold text-[#1e3a5f]">{stat.value.toLocaleString()} ج.م</p>
            </div>
          );
        })}
      </div>

      {/* Tax Records */}
      <div className="gov-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm luxury-table">
            <thead>
              <tr>
                <th className="px-6 py-4 text-right font-bold">نوع الضريبة</th>
                <th className="px-6 py-4 text-right font-bold">المبلغ</th>
                <th className="px-6 py-4 text-right font-bold">الفترة</th>
                <th className="px-6 py-4 text-right font-bold">تاريخ الاستحقاق</th>
                <th className="px-6 py-4 text-right font-bold">الحالة</th>
                <th className="px-6 py-4 text-right font-bold">الوصف</th>
                {isManagerLoggedIn && <th className="px-6 py-4 text-right font-bold">إجراءات</th>}
              </tr>
            </thead>
            <tbody>
              {taxRecords.map(tax => (
                <tr key={tax.id} className="border-t border-gray-100 hover:bg-[#d4af37]/5">
                  <td className="px-6 py-4 font-bold text-[#1e3a5f]">{tax.type}</td>
                  <td className="px-6 py-4 font-bold text-lg">{tax.amount.toLocaleString()} ج.م</td>
                  <td className="px-6 py-4">{tax.period}</td>
                  <td className="px-6 py-4">{tax.dueDate}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-3 py-1.5 rounded-full font-bold ${
                      tax.status === 'مدفوع' ? 'bg-green-500 text-white' :
                      tax.status === 'معلق' ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'
                    }`}>{tax.status}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{tax.description}</td>
                  {isManagerLoggedIn && (
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        <button onClick={() => startEdit(tax.id)} className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg"><Edit2 size={16} /></button>
                        <button onClick={() => deleteTaxRecord(tax.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {taxRecords.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <Receipt size={64} className="mx-auto mb-4 text-gray-300" />
            <p className="text-xl font-medium">لا توجد سجلات ضرائب</p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border-t-4 border-[#d4af37]" onClick={e => e.stopPropagation()}>
            <div className="luxury-gradient p-6 flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#d4af37]">{editingId ? 'تعديل ضريبة' : 'إضافة ضريبة جديدة'}</h3>
              <button onClick={() => setShowForm(false)} className="text-white/70 hover:text-white"><X size={24} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#1e3a5f] mb-2">نوع الضريبة</label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#d4af37] text-sm">
                  {taxTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1e3a5f] mb-2">المبلغ</label>
                <input type="number" value={form.amount} onChange={e => setForm({...form, amount: +e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#d4af37] text-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1e3a5f] mb-2">الفترة</label>
                <input type="text" value={form.period} onChange={e => setForm({...form, period: e.target.value})}
                  placeholder="مثال: الربع الأول 2024"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#d4af37] text-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1e3a5f] mb-2">تاريخ الاستحقاق</label>
                <input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#d4af37] text-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1e3a5f] mb-2">الحالة</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value as TaxStatus})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#d4af37] text-sm">
                  <option value="معلق">معلق</option>
                  <option value="مدفوع">مدفوع</option>
                  <option value="متأخر">متأخر</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1e3a5f] mb-2">الوصف</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                  rows={3} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#d4af37] text-sm resize-none" />
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
              <button onClick={handleSubmit}
                className="flex-1 flex items-center justify-center gap-2 py-3 luxury-gradient text-[#d4af37] rounded-xl font-bold shadow-lg">
                <Save size={18} /> {editingId ? 'حفظ' : 'إضافة'}
              </button>
              <button onClick={() => setShowForm(false)} className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
