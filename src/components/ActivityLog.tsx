import { useStore } from '../store/useStore';
import { Activity, Users, UserCheck, DollarSign, Mail, Receipt, Settings, Shield, Clock, Trash2 } from 'lucide-react';

const typeIcons: Record<string, typeof Activity> = {
  employee: Users,
  client: UserCheck,
  salary: DollarSign,
  email: Mail,
  tax: Receipt,
  settings: Settings,
  system: Shield,
};

const typeColors: Record<string, string> = {
  employee: 'from-blue-500 to-blue-600',
  client: 'from-emerald-500 to-emerald-600',
  salary: 'from-amber-500 to-amber-600',
  email: 'from-purple-500 to-purple-600',
  tax: 'from-red-500 to-red-600',
  settings: 'from-gray-500 to-gray-600',
  system: 'from-indigo-500 to-indigo-600',
};

export default function ActivityLog() {
  const { activityLogs, notifications, markNotificationRead, clearAllNotifications } = useStore();

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays < 7) return `منذ ${diffDays} يوم`;
    return date.toLocaleDateString('ar-EG');
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="gov-card rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl luxury-gradient flex items-center justify-center">
            <Activity size={28} className="text-[#d4af37]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1e3a5f]">سجل النشاطات</h2>
            <p className="text-gray-500 text-sm">تتبع جميع العمليات والتغييرات في النظام</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications */}
        <div className="lg:col-span-1">
          <div className="gov-card rounded-2xl overflow-hidden">
            <div className="luxury-gradient p-4 flex items-center justify-between">
              <h3 className="font-bold text-[#d4af37]">الإشعارات</h3>
              {notifications.length > 0 && (
                <button onClick={clearAllNotifications} className="text-xs text-white/70 hover:text-white flex items-center gap-1">
                  <Trash2 size={14} /> مسح الكل
                </button>
              )}
            </div>
            <div className="max-h-[500px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <Activity size={24} className="text-gray-300" />
                  </div>
                  <p className="text-sm">لا توجد إشعارات</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationRead(notif.id)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${!notif.read ? 'bg-blue-50/50 border-r-4 border-[#1e3a5f]' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${
                          notif.type === 'success' ? 'bg-green-500' :
                          notif.type === 'warning' ? 'bg-amber-500' :
                          notif.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${!notif.read ? 'font-bold text-[#1e3a5f]' : 'font-medium text-gray-700'}`}>
                            {notif.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{notif.message}</p>
                          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                            <Clock size={12} /> {formatTimestamp(notif.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Activity Logs */}
        <div className="lg:col-span-2">
          <div className="gov-card rounded-2xl overflow-hidden">
            <div className="luxury-gradient p-4">
              <h3 className="font-bold text-[#d4af37]">سجل العمليات</h3>
              <p className="text-xs text-white/60 mt-1">آخر 100 عملية</p>
            </div>
            <div className="max-h-[500px] overflow-y-auto">
              {activityLogs.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Activity size={32} className="text-gray-300" />
                  </div>
                  <p className="text-lg font-medium">لا توجد نشاطات</p>
                  <p className="text-sm mt-2">ستظهر هنا جميع العمليات التي تتم في النظام</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {activityLogs.map(log => {
                    const Icon = typeIcons[log.type] || Activity;
                    const color = typeColors[log.type] || 'from-gray-500 to-gray-600';
                    return (
                      <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0`}>
                            <Icon size={20} className="text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-4">
                              <p className="font-bold text-[#1e3a5f]">{log.action}</p>
                              <span className="text-xs text-gray-400 whitespace-nowrap flex items-center gap-1">
                                <Clock size={12} /> {formatTimestamp(log.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-500">
                                بواسطة: {log.user}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded bg-gradient-to-l ${color} text-white`}>
                                {log.type === 'employee' ? 'موظفين' :
                                 log.type === 'client' ? 'عملاء' :
                                 log.type === 'salary' ? 'مرتبات' :
                                 log.type === 'email' ? 'بريد' :
                                 log.type === 'tax' ? 'ضرائب' :
                                 log.type === 'settings' ? 'إعدادات' : 'نظام'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
