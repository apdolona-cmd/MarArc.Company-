import { useStore } from '../store/useStore';
import { usePermissions } from '../hooks/usePermissions';
import { Users, UserCheck, Mail, DollarSign, TrendingUp, AlertCircle, CheckCircle, Clock, Receipt, Star, Lock } from 'lucide-react';

export default function Dashboard() {
  const { employees: rawEmps, clients: rawClients, emails: rawEmails, salaryRecords: rawSalaries, taxRecords: rawTaxes, companySettings, lastSync, isOnline, currentUser } = useStore();
  const perms = usePermissions();

  const employees = Array.isArray(rawEmps) ? rawEmps : Object.values(rawEmps || {});
  const clients = Array.isArray(rawClients) ? rawClients : Object.values(rawClients || {});
  const emails = Array.isArray(rawEmails) ? rawEmails : Object.values(rawEmails || {});
  const salaryRecords = Array.isArray(rawSalaries) ? rawSalaries : Object.values(rawSalaries || {});
  const taxRecords = Array.isArray(rawTaxes) ? rawTaxes : Object.values(rawTaxes || {});

  const activeEmployees = employees.filter((e: any) => e?.status === 'نشط').length;
  const totalSalaries = employees.reduce((s: number, e: any) => s + (e?.netSalary || 0), 0);
  const unreadEmails = emails.filter((e: any) => e && !e.read && e.type === 'received').length;
  const activeProjects = clients.filter((c: any) => c?.status === 'قيد التنفيذ').length;
  const pendingSalaries = salaryRecords.filter((r: any) => r?.status === 'معلق').length;
  const pendingTaxes = taxRecords.filter((t: any) => t?.status === 'معلق' || t?.status === 'متأخر');
  const totalRevenue = clients.reduce((s: number, c: any) => s + (c?.budget || 0), 0);
  void taxRecords.filter((t: any) => t?.status === 'مدفوع');

  // الراتب الخاص بالمستخدم الحالي
  const mySalary = currentUser?.netSalary || 0;

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="gov-card rounded-2xl overflow-hidden">
        <div className="luxury-gradient royal-pattern p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-[#d4af37]/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="relative z-10">
            <div className="flex items-center gap-6 mb-6">
              <img src={companySettings.logo} alt={companySettings.name} className="w-20 h-20 rounded-2xl object-cover shadow-2xl border-4 border-[#d4af37]" />
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-[#d4af37]">{companySettings.name}</h1>
                  <div className="flex items-center gap-1 bg-[#d4af37]/20 px-3 py-1 rounded-full">
                    <Star size={14} className="text-[#d4af37]" /><span className="text-xs text-[#d4af37]">معتمد</span>
                  </div>
                </div>
                <p className="text-white/70">{companySettings.slogan}</p>
                {currentUser && (
                  <p className="text-sm text-[#d4af37] mt-2">مرحباً {currentUser.name} • {currentUser.rank}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={`px-6 py-3 flex items-center justify-between text-sm ${isOnline ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className={`flex items-center gap-2 ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
            <div className={`w-2 h-2 rounded-full animate-pulse ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
            <span>{isOnline ? 'متصل بقاعدة البيانات' : 'غير متصل'}</span>
          </div>
          <span className="text-gray-400 text-xs">آخر تحديث: {new Date(lastSync).toLocaleString('ar-EG')}</span>
        </div>
      </div>

      {/* بطاقة الراتب الشخصي - لكل موظف */}
      {perms.actions.canViewOwnSalary && currentUser && (
        <div className="gov-card rounded-2xl p-6">
          <h3 className="text-lg font-bold text-[#1e3a5f] mb-4 flex items-center gap-2">
            <DollarSign className="text-green-500" /> راتبك الشهري
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl text-center">
              <p className="text-xs text-gray-500">الأساسي</p>
              <p className="text-lg font-bold text-[#1e3a5f]">{(currentUser.baseSalary || 0).toLocaleString()}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-xl text-center">
              <p className="text-xs text-gray-500">المكافآت</p>
              <p className="text-lg font-bold text-green-600">+{(currentUser.bonus || 0).toLocaleString()}</p>
            </div>
            <div className="p-4 bg-red-50 rounded-xl text-center">
              <p className="text-xs text-gray-500">الخصومات</p>
              <p className="text-lg font-bold text-red-600">-{(currentUser.deductions || 0).toLocaleString()}</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-xl text-center">
              <p className="text-xs text-gray-500">الضريبة {currentUser.taxRate}%</p>
              <p className="text-lg font-bold text-orange-600">-{Math.round((currentUser.baseSalary + currentUser.bonus - currentUser.deductions) * currentUser.taxRate / 100).toLocaleString()}</p>
            </div>
            <div className="p-4 luxury-gradient rounded-xl text-center">
              <p className="text-xs text-[#d4af37]/80">صافي الراتب</p>
              <p className="text-2xl font-bold text-white">{mySalary.toLocaleString()} ج.م</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats - حسب الصلاحيات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {perms.actions.canViewAllEmployees && (
          <div className="gov-card card-luxury rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Users size={28} className="text-white" />
              </div>
              <span className="text-3xl font-bold text-[#1e3a5f]">{activeEmployees}</span>
            </div>
            <p className="text-gray-600 font-medium">الموظفين النشطين</p>
          </div>
        )}

        {perms.actions.canAddClient && (
          <div className="gov-card card-luxury rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <UserCheck size={28} className="text-white" />
              </div>
              <span className="text-3xl font-bold text-[#1e3a5f]">{clients.length}</span>
            </div>
            <p className="text-gray-600 font-medium">العملاء المسجلين</p>
          </div>
        )}

        {perms.actions.canSendEmail && (
          <div className="gov-card card-luxury rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Mail size={28} className="text-white" />
              </div>
              <span className="text-3xl font-bold text-[#1e3a5f]">{unreadEmails}</span>
            </div>
            <p className="text-gray-600 font-medium">رسائل غير مقروءة</p>
          </div>
        )}

        {perms.actions.canViewOtherSalaries && (
          <>
            <div className="gov-card card-luxury rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
                  <DollarSign size={28} className="text-white" />
                </div>
                <span className="text-2xl font-bold text-[#1e3a5f]">{totalSalaries.toLocaleString()}</span>
              </div>
              <p className="text-gray-600 font-medium">إجمالي المرتبات (ج.م)</p>
            </div>
            <div className="gov-card card-luxury rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                  <TrendingUp size={28} className="text-white" />
                </div>
                <span className="text-2xl font-bold text-[#1e3a5f]">{totalRevenue.toLocaleString()}</span>
              </div>
              <p className="text-gray-600 font-medium">إجمالي الإيرادات (ج.م)</p>
            </div>
          </>
        )}

        {perms.actions.canAddClient && (
          <div className="gov-card card-luxury rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg">
                <TrendingUp size={28} className="text-white" />
              </div>
              <span className="text-3xl font-bold text-[#1e3a5f]">{activeProjects}</span>
            </div>
            <p className="text-gray-600 font-medium">مشاريع قيد التنفيذ</p>
          </div>
        )}
      </div>

      {/* التنبيهات */}
      <div className="gov-card rounded-2xl overflow-hidden">
        <div className="luxury-gradient p-4 flex items-center gap-3">
          <AlertCircle size={20} className="text-[#d4af37]" />
          <h3 className="font-bold text-[#d4af37]">التنبيهات</h3>
        </div>
        <div className="p-4 space-y-3">
          {unreadEmails > 0 && perms.actions.canSendEmail && (
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
              <Mail size={18} className="text-purple-500" />
              <p className="text-sm text-purple-700 font-medium">{unreadEmails} رسائل غير مقروءة</p>
            </div>
          )}
          {pendingSalaries > 0 && perms.actions.canPaySalaries && (
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
              <Clock size={18} className="text-amber-500" />
              <p className="text-sm text-amber-700 font-medium">{pendingSalaries} مرتبات في انتظار الصرف</p>
            </div>
          )}
          {pendingTaxes.length > 0 && perms.actions.canViewTaxes && (
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
              <Receipt size={18} className="text-red-500" />
              <p className="text-sm text-red-700 font-medium">{pendingTaxes.length} ضرائب معلقة</p>
            </div>
          )}
          {!perms.actions.canViewOtherSalaries && !perms.actions.canViewTaxes && (
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
              <Lock size={18} className="text-blue-500" />
              <p className="text-sm text-blue-700 font-medium">لديك صلاحيات محدودة حسب رتبتك ({currentUser?.rank})</p>
            </div>
          )}
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
            <CheckCircle size={18} className="text-green-500" />
            <p className="text-sm text-green-700 font-medium">النظام يعمل بشكل طبيعي</p>
          </div>
        </div>
      </div>
    </div>
  );
}
