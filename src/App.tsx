import { useState, useEffect } from 'react';
import { useStore } from './store/useStore';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Employees from './components/Employees';
import Clients from './components/Clients';
import Emails from './components/Emails';
import Salaries from './components/Salaries';
import Taxes from './components/Taxes';
import Organization from './components/Organization';
import Settings from './components/Settings';
import ManagerPanel from './components/ManagerPanel';
import ActivityLog from './components/ActivityLog';
import Profile from './components/Profile';
import Accounting from './components/Accounting';
import MeetingRoom from './components/MeetingRoom';
import Invoices from './components/Invoices';
import Projects from './components/Projects';
import Attendance from './components/Attendance';
import LeaveManagement from './components/LeaveManagement';
import Inventory from './components/Inventory';
import Reports from './components/Reports';
import Communications from './components/Communications';
import Contracts from './components/Contracts';
import PerformanceReview from './components/PerformanceReview';
import { Menu, Bell, Shield, X, CheckCircle, AlertTriangle, Info, AlertCircle, Wifi, WifiOff, Database } from 'lucide-react';

function App() {
  const { 
    currentPage, isManagerLoggedIn, emails, notifications, markNotificationRead, 
    companySettings, initializeFirebase, isOnline, isLoggedIn, currentUser, lastSync 
  } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const unreadEmails = emails.filter(e => !e.read && e.type === 'received').length;
  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Initialize Firebase on mount
  useEffect(() => {
    initializeFirebase();
  }, [initializeFirebase]);

  // If not logged in, show login page
  if (!isLoggedIn) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'employees': return <Employees />;
      case 'clients': return <Clients />;
      case 'emails': return <Emails />;
      case 'salaries': return <Salaries />;
      case 'taxes': return <Taxes />;
      case 'organization': return <Organization />;
      case 'settings': return <Settings />;
      case 'activity': return <ActivityLog />;
      case 'accounting': return <Accounting />;
      case 'meeting': return <MeetingRoom />;
      case 'manager': return isManagerLoggedIn ? <ManagerPanel /> : <Dashboard />;
      case 'profile': return <Profile />;
      
      // الأنظمة الجديدة
      case 'invoices': return <Invoices />;
      case 'projects': return <Projects />;
      case 'attendance': return <Attendance />;
      case 'leaves': return <LeaveManagement />;
      case 'inventory': return <Inventory />;
      case 'reports': return <Reports />;
      case 'communications': return <Communications />;
      case 'contracts': return <Contracts />;
      case 'performance': return <PerformanceReview />;
      
      default: return <Dashboard />;
    }
  };

  const cs = companySettings;
  const pageTitle: Record<string, string> = {
    dashboard: cs.dashboardTitle || 'لوحة التحكم الرئيسية',
    employees: cs.employeesTitle || 'إدارة الموظفين',
    clients: cs.clientsTitle || 'إدارة العملاء',
    emails: cs.emailsTitle || 'البريد الإلكتروني الرسمي',
    salaries: cs.salariesTitle || 'نظام المرتبات',
    taxes: cs.taxesTitle || 'نظام الضرائب',
    organization: cs.orgTitle || 'الهيكل التنظيمي',
    settings: 'إعدادات الشركة والموقع',
    activity: 'سجل النشاطات',
    accounting: 'نظام المحاسبة',
    meeting: 'غرفة الاجتماعات',
    manager: 'لوحة تحكم HR',
    profile: 'الملف الشخصي',
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle size={16} className="text-green-500" />;
      case 'warning': return <AlertTriangle size={16} className="text-amber-500" />;
      case 'error': return <AlertCircle size={16} className="text-red-500" />;
      default: return <Info size={16} className="text-blue-500" />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100" dir="rtl">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <main className="flex-1 min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 gov-header px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2.5 hover:bg-white/10 rounded-xl transition-colors text-white">
                <Menu size={24} />
              </button>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-[#d4af37]">{pageTitle[currentPage] || 'لوحة التحكم'}</h1>
                <p className="text-xs text-white/60 hidden sm:block">{companySettings.name} - نظام الإدارة المتكامل</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Connection Status */}
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                isOnline ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
              }`}>
                {isOnline ? (
                  <>
                    <Wifi size={14} />
                    <span className="hidden sm:inline">متصل</span>
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  </>
                ) : (
                  <>
                    <WifiOff size={14} />
                    <span className="hidden sm:inline">غير متصل</span>
                  </>
                )}
              </div>

              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2.5 hover:bg-white/10 rounded-xl transition-colors relative"
                >
                  <Bell size={20} className="text-[#d4af37]" />
                  {(unreadNotifications + unreadEmails) > 0 && (
                    <span className="absolute -top-1 -left-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                      {unreadNotifications + unreadEmails}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                    <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                      <div className="luxury-gradient p-4 flex items-center justify-between">
                        <h3 className="font-bold text-[#d4af37]">الإشعارات</h3>
                        <button onClick={() => setShowNotifications(false)} className="text-white/70 hover:text-white">
                          <X size={18} />
                        </button>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-gray-400">
                            <Bell size={32} className="mx-auto mb-2 text-gray-300" />
                            <p className="text-sm">لا توجد إشعارات</p>
                          </div>
                        ) : (
                          notifications.slice(0, 10).map(notif => (
                            <div 
                              key={notif.id}
                              onClick={() => markNotificationRead(notif.id)}
                              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${!notif.read ? 'bg-blue-50/50' : ''}`}
                            >
                              <div className="flex items-start gap-3">
                                {getNotificationIcon(notif.type)}
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm ${!notif.read ? 'font-bold text-[#1e3a5f]' : 'text-gray-700'}`}>{notif.title}</p>
                                  <p className="text-xs text-gray-500 mt-1 truncate">{notif.message}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Manager Badge */}
              {isManagerLoggedIn && (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-400/30 rounded-xl">
                  <Shield size={16} className="text-red-400" />
                  <span className="text-xs font-bold text-red-300 hidden sm:block">HR</span>
                </div>
              )}

              {/* User Info */}
              <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
                <div className="w-8 h-8 rounded-lg bg-[#d4af37] flex items-center justify-center text-[#1e3a5f] font-bold text-sm">
                  {currentUser?.name.charAt(0)}
                </div>
                <span className="text-white text-sm font-medium hidden sm:block">{currentUser?.name.split(' ')[0]}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Real-time sync indicator */}
        {isOnline && (
          <div className="bg-gradient-to-l from-green-500/10 to-transparent px-4 py-2 flex items-center justify-between text-xs border-b border-green-200/50">
            <div className="flex items-center gap-2 text-green-700">
              <Database size={14} />
              <span>قاعدة البيانات متصلة - التحديثات تظهر للجميع مباشرة</span>
            </div>
            <span className="text-green-600">آخر تحديث: {new Date(lastSync).toLocaleTimeString('ar-EG')}</span>
          </div>
        )}

        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {renderPage()}
        </div>

        {/* Footer */}
        <footer className="p-4 text-center text-gray-400 text-xs border-t border-gray-200 bg-white mt-8">
          <p>{companySettings.name} © {new Date().getFullYear()} - {companySettings.footerText || 'جميع الحقوق محفوظة'}</p>
          <p className="mt-1">نظام إدارة الشركة المتكامل - الإصدار 3.0</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
