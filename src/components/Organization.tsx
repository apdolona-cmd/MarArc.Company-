import { useStore } from '../store/useStore';
import { Building2, Users, Crown, Star, Award, Briefcase, Wrench, Calculator, Phone, HardHat } from 'lucide-react';

const rankIcons: Record<string, typeof Crown> = {
  'مدير عام': Crown,
  'مدير قسم': Star,
  'مشرف': Award,
  'مهندس أول': Briefcase,
  'مهندس': Briefcase,
  'فني أول': Wrench,
  'فني': Wrench,
  'محاسب': Calculator,
  'موظف استقبال': Phone,
  'عامل': HardHat,
};

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

const rankOrder = ['مدير عام', 'مدير قسم', 'مشرف', 'مهندس أول', 'مهندس', 'فني أول', 'فني', 'محاسب', 'موظف استقبال', 'عامل'];

export default function Organization() {
  const { employees, companySettings } = useStore();

  const departments = employees.reduce((acc, emp) => {
    if (!acc[emp.department]) acc[emp.department] = [];
    acc[emp.department].push(emp);
    return acc;
  }, {} as Record<string, typeof employees>);

  const rankGroups = rankOrder.filter(rank => employees.some(e => e.rank === rank));

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="gov-card rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl luxury-gradient flex items-center justify-center">
            <Building2 size={28} className="text-[#d4af37]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1e3a5f]">الهيكل التنظيمي</h2>
            <p className="text-gray-500 text-sm">التسلسل الإداري وأقسام الشركة</p>
          </div>
        </div>
      </div>

      {/* Company Header */}
      <div className="gov-card rounded-2xl overflow-hidden">
        <div className="luxury-gradient royal-pattern p-10 text-center relative">
          <div className="absolute top-0 left-0 w-40 h-40 bg-[#d4af37]/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-[#d4af37]/10 rounded-full translate-x-1/4 translate-y-1/4" />
          
          <div className="relative z-10">
            <img src={companySettings.logo} alt={companySettings.name} className="w-24 h-24 mx-auto rounded-2xl object-cover shadow-2xl border-4 border-[#d4af37] mb-4" />
            <h3 className="text-3xl font-bold text-[#d4af37]">{companySettings.name}</h3>
            <p className="text-white/70 mt-2">{companySettings.slogan}</p>
            
            <div className="flex justify-center gap-12 mt-8 pt-8 border-t border-white/10">
              <div className="text-center">
                <p className="text-4xl font-bold text-[#d4af37]">{employees.length}</p>
                <p className="text-xs text-white/60 mt-1">إجمالي الموظفين</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-green-400">{employees.filter(e => e.status === 'نشط').length}</p>
                <p className="text-xs text-white/60 mt-1">موظفين نشطين</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-400">{Object.keys(departments).length}</p>
                <p className="text-xs text-white/60 mt-1">أقسام</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rank Hierarchy */}
      <div className="gov-card rounded-2xl overflow-hidden">
        <div className="luxury-gradient p-4 flex items-center gap-3">
          <Crown size={20} className="text-[#d4af37]" />
          <h3 className="font-bold text-[#d4af37]">التسلسل الوظيفي</h3>
        </div>
        <div className="p-6 space-y-6">
          {rankGroups.map((rank, index) => {
            const Icon = rankIcons[rank] || Users;
            const color = rankColors[rank] || 'from-gray-500 to-gray-600';
            const emps = employees.filter(e => e.rank === rank);
            
            return (
              <div key={rank} className="relative">
                {index > 0 && (
                  <div className="absolute -top-6 right-6 w-0.5 h-6 bg-[#d4af37]/30" />
                )}
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg shrink-0`}>
                    <Icon size={28} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="font-bold text-[#1e3a5f] text-lg">{rank}</h4>
                      <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-500">{emps.length} موظف</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {emps.map(emp => (
                        <div key={emp.id} className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 hover:border-[#d4af37]/50 hover:bg-[#d4af37]/5 transition-all">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white text-xs font-bold`}>
                            {emp.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#1e3a5f]">{emp.name}</p>
                            <p className="text-xs text-gray-500">@{emp.nickname} • {emp.department}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Departments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(departments).map(([dept, emps]) => (
          <div key={dept} className="gov-card rounded-2xl overflow-hidden">
            <div className="luxury-gradient p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-[#d4af37]" />
                <h3 className="font-bold text-[#d4af37]">{dept}</h3>
              </div>
              <span className="text-xs text-white/70 bg-white/10 px-3 py-1 rounded-full">{emps.length} موظف</span>
            </div>
            <div className="p-4 space-y-2">
              {emps.sort((a, b) => rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank)).map(emp => {
                const color = rankColors[emp.rank] || 'from-gray-500 to-gray-600';
                return (
                  <div key={emp.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-sm`}>
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-[#1e3a5f] text-sm">{emp.name}</p>
                        <p className="text-xs text-gray-500">@{emp.nickname}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-3 py-1.5 rounded-full font-bold text-white bg-gradient-to-l ${color}`}>{emp.rank}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
