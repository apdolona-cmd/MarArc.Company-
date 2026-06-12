import { useState } from 'react';
import { useStore, EmployeeRank } from '../store/useStore';
import { Shield, Users, UserCheck, DollarSign, Mail, Crown, Edit2, Save, X, TrendingUp, Settings, Activity, Database } from 'lucide-react';

const ranks: EmployeeRank[] = ['مدير عام', 'مدير قسم', 'مشرف', 'مهندس أول', 'مهندس', 'فني أول', 'فني', 'محاسب', 'موظف استقبال', 'عامل'];

type ManagerTab = 'overview' | 'ranks' | 'salaryControl' | 'system';

export default function ManagerPanel() {
  const { employees, clients, emails, salaryRecords, taxRecords, activityLogs, updateEmployeeRank, updateEmployee, generateMonthlySalaries, paySalary, companySettings, lastSync } = useStore();
  const [activeTab, setActiveTab] = useState<ManagerTab>('overview');
  const [editingRankId, setEditingRankId] = useState<string | null>(null);
  const [selectedRank, setSelectedRank] = useState<EmployeeRank>('عامل');
  const [editingSalaryId, setEditingSalaryId] = useState<string | null>(null);
  const [salaryForm, setSalaryForm] = useState({ baseSalary: 0, bonus: 0, deductions: 0, taxRate: 14 });
  const [salaryMonth, setSalaryMonth] = useState(new Date().toISOString().slice(0, 7));

  const totalSalaries = employees.reduce((s, e) => s + e.netSalary, 0);
  const totalRevenue = clients.reduce((s, c) => s + c.budget, 0);
  const totalTaxesPaid = taxRecords.filter(t => t.status === 'مدفوع').reduce((s, t) => s + t.amount, 0);
  const unreadEmails = emails.filter(e => !e.read && e.type === 'received').length;

  const handleRankSave = (id: string) => {
    updateEmployeeRank(id, selectedRank);
    setEditingRankId(null);
  };

  const handleSalarySave = (id: string) => {
    updateEmployee(id, salaryForm);
    setEditingSalaryId(null);
  };

  const startSalaryEdit = (id: string) => {
    const emp = employees.find(e => e.id === id);
    if (emp) {
      setSalaryForm({ baseSalary: emp.baseSalary, bonus: emp.bonus, deductions: emp.deductions, taxRate: emp.taxRate });
      setEditingSalaryId(id);
    }
  };

  const tabs = [
    { id: 'overview' as ManagerTab, label: 'نظرة عامة', icon: TrendingUp },
    { id: 'ranks' as ManagerTab, label: 'إدارة الرتب', icon: Crown },
    { id: 'salaryControl' as ManagerTab, label: 'تحكم المرتبات', icon: DollarSign },
    { id: 'system' as ManagerTab, label: 'النظام', icon: Settings },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="gov-card rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-l from-red-900 via-red-800 to-red-900 p-8 relative">
          <div className="absolute top-0 left-0 w-40 h-40 bg-red-500/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center border-2 border-red-400/30">
              <Shield size={36} className="text-red-300" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">لوحة تحكم HR</h2>
              <p className="text-red-300/80 text-sm mt-1">تحكم كامل في جميع أنظمة {companySettings.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white p-2 rounded-xl shadow-lg border-t-4 border-red-500 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-l from-red-500 to-red-600 text-white shadow-lg' 
                  : 'text-gray-500 hover:bg-red-50 hover:text-red-600'
              }`}>
              <Icon size={18} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'إجمالي الموظفين', value: employees.length, icon: Users, color: 'from-blue-500 to-blue-600' },
              { label: 'إجمالي العملاء', value: clients.length, icon: UserCheck, color: 'from-emerald-500 to-emerald-600' },
              { label: 'إجمالي المرتبات', value: `${totalSalaries.toLocaleString()} ج.م`, icon: DollarSign, color: 'from-amber-500 to-amber-600' },
              { label: 'إجمالي الإيرادات', value: `${totalRevenue.toLocaleString()} ج.م`, icon: TrendingUp, color: 'from-green-500 to-green-600' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="gov-card rounded-2xl p-5">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-[#1e3a5f]">{stat.value}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="gov-card rounded-2xl p-6">
              <h3 className="font-bold text-[#1e3a5f] mb-4 flex items-center gap-2">
                <DollarSign className="text-green-500" /> الملخص المالي
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between p-4 bg-green-50 rounded-xl border border-green-100">
                  <span className="text-green-700">إجمالي الإيرادات</span>
                  <span className="font-bold text-green-700">{totalRevenue.toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                  <span className="text-red-700">إجمالي المرتبات</span>
                  <span className="font-bold text-red-700">{totalSalaries.toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between p-4 bg-orange-50 rounded-xl border border-orange-100">
                  <span className="text-orange-700">ضرائب مدفوعة</span>
                  <span className="font-bold text-orange-700">{totalTaxesPaid.toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between p-5 luxury-gradient rounded-xl">
                  <span className="text-[#d4af37] font-bold">صافي الربح التقديري</span>
                  <span className="font-bold text-white text-xl">{(totalRevenue - totalSalaries - totalTaxesPaid).toLocaleString()} ج.م</span>
                </div>
              </div>
            </div>

            <div className="gov-card rounded-2xl p-6">
              <h3 className="font-bold text-[#1e3a5f] mb-4 flex items-center gap-2">
                <Activity className="text-purple-500" /> إحصائيات سريعة
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="flex items-center gap-2"><Mail size={16} className="text-purple-500" /> رسائل غير مقروءة</span>
                  <span className="font-bold text-purple-600">{unreadEmails}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                  <span>سجلات مرتبات</span>
                  <span className="font-bold">{salaryRecords.length}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                  <span>مرتبات معلقة</span>
                  <span className="font-bold text-amber-600">{salaryRecords.filter(r => r.status === 'معلق').length}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                  <span>ضرائب معلقة</span>
                  <span className="font-bold text-red-600">{taxRecords.filter(t => t.status !== 'مدفوع').length}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                  <span>سجلات النشاط</span>
                  <span className="font-bold text-blue-600">{activityLogs.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ranks Tab */}
      {activeTab === 'ranks' && (
        <div className="gov-card rounded-2xl overflow-hidden">
          <div className="luxury-gradient p-5 flex items-center gap-3">
            <Crown size={24} className="text-[#d4af37]" />
            <div>
              <h3 className="font-bold text-[#d4af37]">إدارة رتب الموظفين</h3>
              <p className="text-xs text-white/60">تغيير رتبة أي موظف بضغطة زر</p>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {employees.map(emp => (
              <div key={emp.id} className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1e3a5f] to-[#0f2540] flex items-center justify-center text-[#d4af37] font-bold text-lg">
                    {emp.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-[#1e3a5f]">{emp.name}</p>
                    <p className="text-xs text-gray-500">@{emp.nickname} • {emp.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {editingRankId === emp.id ? (
                    <div className="flex items-center gap-2">
                      <select value={selectedRank} onChange={e => setSelectedRank(e.target.value as EmployeeRank)}
                        className="px-4 py-2.5 border-2 border-[#d4af37] rounded-xl text-sm font-medium">
                        {ranks.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <button onClick={() => handleRankSave(emp.id)} className="p-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"><Save size={18} /></button>
                      <button onClick={() => setEditingRankId(null)} className="p-2.5 bg-gray-200 text-gray-600 rounded-xl hover:bg-gray-300 transition-colors"><X size={18} /></button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="text-sm px-4 py-2 rounded-xl bg-gradient-to-l from-[#d4af37] to-[#c9a227] text-[#1e3a5f] font-bold">{emp.rank}</span>
                      <button onClick={() => { setEditingRankId(emp.id); setSelectedRank(emp.rank); }}
                        className="p-2.5 text-amber-500 hover:bg-amber-50 rounded-xl transition-colors"><Edit2 size={18} /></button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Salary Control Tab */}
      {activeTab === 'salaryControl' && (
        <div className="space-y-6">
          <div className="gov-card rounded-2xl overflow-hidden">
            <div className="luxury-gradient p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <DollarSign size={24} className="text-[#d4af37]" />
                <div>
                  <h3 className="font-bold text-[#d4af37]">تحكم كامل في المرتبات</h3>
                  <p className="text-xs text-white/60">تعديل رواتب الموظفين وصرف المرتبات</p>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <input type="month" value={salaryMonth} onChange={e => setSalaryMonth(e.target.value)}
                  className="px-4 py-2.5 border-2 border-white/20 rounded-xl bg-white/10 text-white text-sm" />
                <button onClick={() => generateMonthlySalaries(salaryMonth)}
                  className="px-5 py-2.5 bg-[#d4af37] text-[#1e3a5f] rounded-xl text-sm font-bold hover:bg-[#e5c048] transition-colors">
                  توليد مرتبات الشهر
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {employees.map(emp => (
                <div key={emp.id} className="p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold text-lg">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-[#1e3a5f]">{emp.name}</p>
                        <p className="text-xs text-gray-500">{emp.rank} • {emp.department}</p>
                      </div>
                    </div>
                    {editingSalaryId === emp.id ? (
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleSalarySave(emp.id)} className="p-2.5 bg-green-500 text-white rounded-xl"><Save size={18} /></button>
                        <button onClick={() => setEditingSalaryId(null)} className="p-2.5 bg-gray-200 text-gray-600 rounded-xl"><X size={18} /></button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-green-600 text-lg">{emp.netSalary.toLocaleString()} ج.م</span>
                        <button onClick={() => startSalaryEdit(emp.id)} className="p-2.5 text-amber-500 hover:bg-amber-50 rounded-xl"><Edit2 size={18} /></button>
                      </div>
                    )}
                  </div>
                  {editingSalaryId === emp.id && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 p-4 bg-gray-50 rounded-xl">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">الراتب الأساسي</label>
                        <input type="number" value={salaryForm.baseSalary} onChange={e => setSalaryForm({...salaryForm, baseSalary: +e.target.value})}
                          className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37]" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">المكافآت</label>
                        <input type="number" value={salaryForm.bonus} onChange={e => setSalaryForm({...salaryForm, bonus: +e.target.value})}
                          className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37]" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">الخصومات</label>
                        <input type="number" value={salaryForm.deductions} onChange={e => setSalaryForm({...salaryForm, deductions: +e.target.value})}
                          className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37]" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">نسبة الضريبة %</label>
                        <input type="number" value={salaryForm.taxRate} onChange={e => setSalaryForm({...salaryForm, taxRate: +e.target.value})}
                          className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37]" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pending Salaries */}
          {salaryRecords.filter(r => r.status === 'معلق').length > 0 && (
            <div className="gov-card rounded-2xl overflow-hidden">
              <div className="bg-amber-500 p-4 flex items-center gap-2">
                <DollarSign className="text-white" size={20} />
                <h3 className="font-bold text-white">مرتبات في انتظار الصرف</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {salaryRecords.filter(r => r.status === 'معلق').map(record => (
                  <div key={record.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                    <div>
                      <p className="font-bold text-[#1e3a5f]">{record.employeeName}</p>
                      <p className="text-xs text-gray-500">شهر: {record.month}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-green-600">{record.netSalary.toLocaleString()} ج.م</span>
                      <button onClick={() => paySalary(record.id)}
                        className="px-5 py-2.5 bg-green-500 text-white rounded-xl text-sm font-bold hover:bg-green-600 transition-colors">صرف الراتب</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* System Tab */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="gov-card rounded-2xl p-6">
              <h3 className="font-bold text-[#1e3a5f] mb-4 flex items-center gap-2">
                <Database className="text-blue-500" /> قاعدة البيانات
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                  <span>آخر تحديث</span>
                  <span className="font-medium text-sm">{new Date(lastSync).toLocaleString('ar-EG')}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                  <span>عدد الموظفين</span>
                  <span className="font-bold">{employees.length}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                  <span>عدد العملاء</span>
                  <span className="font-bold">{clients.length}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                  <span>عدد الرسائل</span>
                  <span className="font-bold">{emails.length}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                  <span>سجلات المرتبات</span>
                  <span className="font-bold">{salaryRecords.length}</span>
                </div>
                <div className="flex justify-between p-3 bg-green-50 rounded-xl border border-green-200">
                  <span className="text-green-700">حالة التخزين</span>
                  <span className="font-bold text-green-700 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    متصل ومحفوظ
                  </span>
                </div>
              </div>
            </div>

            <div className="gov-card rounded-2xl p-6">
              <h3 className="font-bold text-[#1e3a5f] mb-4 flex items-center gap-2">
                <Settings className="text-gray-500" /> معلومات النظام
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                  <span>اسم الشركة</span>
                  <span className="font-bold">{companySettings.name}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                  <span>البريد الرسمي</span>
                  <span className="font-medium text-sm">{companySettings.email}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                  <span>الهاتف</span>
                  <span className="font-medium">{companySettings.phone}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                  <span>إصدار النظام</span>
                  <span className="font-bold text-[#d4af37]">2.0</span>
                </div>
                <div className="p-4 bg-[#1e3a5f] rounded-xl text-center">
                  <p className="text-[#d4af37] font-bold">نظام الإدارة المتكامل</p>
                  <p className="text-white/60 text-xs mt-1">جميع البيانات محفوظة محلياً</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="gov-card rounded-2xl overflow-hidden">
            <div className="luxury-gradient p-4 flex items-center gap-2">
              <Activity className="text-[#d4af37]" size={20} />
              <h3 className="font-bold text-[#d4af37]">آخر النشاطات</h3>
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
              {activityLogs.slice(0, 10).map(log => (
                <div key={log.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[#1e3a5f]">{log.action}</p>
                      <p className="text-sm text-gray-500">{log.details}</p>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(log.timestamp).toLocaleString('ar-EG')}</span>
                  </div>
                </div>
              ))}
              {activityLogs.length === 0 && (
                <div className="p-8 text-center text-gray-400">
                  <Activity size={32} className="mx-auto mb-2 text-gray-300" />
                  <p>لا توجد نشاطات مسجلة</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
