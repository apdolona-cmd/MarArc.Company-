import { useStore } from '../store/useStore';
import { usePermissions } from '../hooks/usePermissions';
import {
  LayoutDashboard, Users, UserCheck, Mail, DollarSign,
  Receipt, Settings, Shield, LogOut, Building2, X, Activity, User, BarChart3, MessageCircle
} from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard, feature: 'dashboard' },
  { id: 'meeting', label: 'غرفة الاجتماعات', icon: MessageCircle, feature: 'meeting' },
  { id: 'employees', label: 'الموظفين', icon: Users, feature: 'employees' },
  { id: 'clients', label: 'العملاء', icon: UserCheck, feature: 'clients' },
  { id: 'emails', label: 'البريد الإلكتروني', icon: Mail, feature: 'emails' },
  { id: 'accounting', label: 'المحاسبة', icon: BarChart3, feature: 'accounting' },
  { id: 'salaries', label: 'المرتبات', icon: DollarSign, feature: 'salaries' },
  { id: 'taxes', label: 'الضرائب', icon: Receipt, feature: 'taxes' },
  { id: 'organization', label: 'هيكل الشركة', icon: Building2, feature: 'organization' },
  { id: 'activity', label: 'سجل النشاطات', icon: Activity, feature: 'activity' },
  
  // الأنظمة الجديدة
  { id: 'invoices', label: '📄 الفواتير والعروض', icon: Receipt, feature: 'invoices' },
  { id: 'projects', label: '🏗️ إدارة المشاريع', icon: Building2, feature: 'projects' },
  { id: 'attendance', label: '⏰ الحضور والغياب', icon: Activity, feature: 'attendance' },
  { id: 'leaves', label: '🏖️ الإجازات', icon: Mail, feature: 'leaves' },
  { id: 'inventory', label: '📦 المخزون', icon: BarChart3, feature: 'inventory' },
  { id: 'reports', label: '📊 التقارير', icon: BarChart3, feature: 'reports' },
  { id: 'communications', label: '📬 الاتصالات', icon: Mail, feature: 'communications' },
  { id: 'contracts', label: '📄 العقود', icon: Receipt, feature: 'contracts' },
  { id: 'performance', label: '⭐ تقييم الأداء', icon: BarChart3, feature: 'performance' },
  
  { id: 'settings', label: 'الإعدادات', icon: Settings, feature: 'settings' },
];

export default function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (v: boolean) => void }) {
  const { currentPage, setCurrentPage, isManagerLoggedIn, logout, companySettings, emails, notifications, isOnline, currentUser, canAccess } = useStore();
  const perms = usePermissions();
  const allEmails = Array.isArray(emails) ? emails : Object.values(emails || {});
  const allNotifs = Array.isArray(notifications) ? notifications : Object.values(notifications || {});
  const unreadEmails = allEmails.filter((e: any) => e && !e.read && e.type === 'received').length;
  const unreadNotifications = allNotifs.filter((n: any) => n && !n.read).length;

  // فلتر الصفحات حسب الصلاحيات
  const visibleMenu = menuItems.filter(item => {
    if (isManagerLoggedIn) return true;
    // الداشبورد للجميع
    if (item.feature === 'dashboard') return true;
    // راتبي فقط - يظهر في الملف الشخصي
    if (item.feature === 'salaries' && !perms.actions.canViewOtherSalaries && perms.actions.canViewOwnSalary) return false;
    return canAccess(item.feature);
  });

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsOpen(false)} />}
      
      <aside className={`fixed top-0 right-0 h-full w-80 sidebar-luxury text-white z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 lg:static lg:z-auto flex flex-col shadow-2xl`}>
        {/* Logo */}
        <div className="p-6 border-b border-[#d4af37]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img src={companySettings.logo} alt={companySettings.name} className="w-14 h-14 rounded-xl object-cover shadow-lg border-2 border-[#d4af37]" />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#1e3a5f] ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#d4af37]">{companySettings.nameEn}</h1>
                <p className="text-xs text-gray-400">{companySettings.name}</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-lg"><X size={20} /></button>
          </div>
        </div>

        {/* Current User */}
        {currentUser && (
          <div className="px-4 py-3 bg-white/5 border-b border-[#d4af37]/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#c9a227] flex items-center justify-center text-[#1e3a5f] font-bold">
                {currentUser.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
                <p className="text-xs text-[#d4af37]">{currentUser.rank}</p>
              </div>
              {isManagerLoggedIn && (
                <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded-full border border-red-500/30">HR</span>
              )}
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="px-6 py-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#d4af37]/50 to-transparent" />
            <div className="w-2 h-2 rounded-full bg-[#d4af37]" />
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent" />
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          {visibleMenu.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            const showBadge = item.id === 'emails' && unreadEmails > 0;
            const showNotifBadge = item.id === 'activity' && unreadNotifications > 0;
            return (
              <button key={item.id} onClick={() => { setCurrentPage(item.id); setIsOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 group relative ${
                  isActive ? 'bg-[#d4af37] text-[#1e3a5f] shadow-lg shadow-[#d4af37]/30' : 'text-gray-300 hover:bg-white/10 hover:text-[#d4af37]'
                }`}>
                <Icon size={20} className={isActive ? 'text-[#1e3a5f]' : 'group-hover:text-[#d4af37]'} />
                <span>{item.label}</span>
                {showBadge && <span className="absolute left-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">{unreadEmails}</span>}
                {showNotifBadge && <span className="absolute left-3 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">{unreadNotifications}</span>}
              </button>
            );
          })}

          {/* Manager Panel */}
          {isManagerLoggedIn && (
            <>
              <div className="my-4 px-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent via-red-500/50 to-transparent" />
                  <span className="text-xs text-red-400">صلاحيات HR</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
                </div>
              </div>
              <button onClick={() => { setCurrentPage('manager'); setIsOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  currentPage === 'manager' ? 'bg-gradient-to-l from-red-600 to-red-700 text-white shadow-lg' : 'text-red-300 hover:bg-red-900/40 border border-red-500/30'
                }`}>
                <Shield size={20} /><span>لوحة التحكم الكاملة</span>
              </button>
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#d4af37]/30 space-y-3">
          <button onClick={() => { setCurrentPage('profile'); setIsOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/10 border border-gray-600/50 transition-all">
            <User size={18} /><span>ملفي الشخصي</span>
          </button>
          <button onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-300 hover:bg-red-900/40 border border-red-500/30 transition-all">
            <LogOut size={18} /><span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
}
