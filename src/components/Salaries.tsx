import { useState } from 'react';
import { useStore } from '../store/useStore';
import { DollarSign, CheckCircle, Clock, Calculator, FileSpreadsheet, TrendingUp, Users, FileDown } from 'lucide-react';

export default function Salaries() {
  const store = useStore();
  const { generateMonthlySalaries, paySalary, isManagerLoggedIn, currentUser } = store;
  const employees = (Array.isArray(store.employees) ? store.employees : Object.values(store.employees || {})) as any[];
  const salaryRecords = (Array.isArray(store.salaryRecords) ? store.salaryRecords : Object.values(store.salaryRecords || {})) as any[];
  const canManageSalaries = isManagerLoggedIn || currentUser?.rank === 'محاسب';
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  const monthRecords = salaryRecords.filter((r: any) => r?.month === selectedMonth);
  const totalNet = monthRecords.reduce((s: number, r: any) => s + (r?.netSalary || 0), 0);
  const totalTax = monthRecords.reduce((s: number, r: any) => s + (r?.taxAmount || 0), 0);
  const totalBase = monthRecords.reduce((s: number, r: any) => s + (r?.baseSalary || 0), 0);
  const paidCount = monthRecords.filter((r: any) => r?.status === 'مدفوع').length;
  const pendingCount = monthRecords.filter((r: any) => r?.status === 'معلق').length;

  const rankSummary = employees.reduce((acc: any, emp: any) => {
    if (!emp || emp.status !== 'نشط') return acc;
    if (!acc[emp.rank]) acc[emp.rank] = { count: 0, totalSalary: 0 };
    acc[emp.rank].count++;
    acc[emp.rank].totalSalary += (emp.netSalary || 0);
    return acc;
  }, {} as Record<string, { count: number; totalSalary: number }>);

  // تصدير PDF
  const exportPDF = () => {
    const printContent = `
<!DOCTYPE html><html dir="rtl"><head><meta charset="UTF-8">
<title>كشف مرتبات ${selectedMonth}</title>
<style>
body{font-family:Arial,sans-serif;padding:40px;direction:rtl}
h1{color:#1e3a5f;border-bottom:3px solid #d4af37;padding-bottom:10px}
table{width:100%;border-collapse:collapse;margin-top:20px}
th{background:#1e3a5f;color:#d4af37;padding:12px 8px;text-align:right}
td{padding:10px 8px;border-bottom:1px solid #ddd;text-align:right}
.total{background:#f8f9fa;font-weight:bold;font-size:16px}
.header{display:flex;justify-content:space-between;align-items:center}
.stamp{margin-top:40px;display:flex;justify-content:space-between}
.stamp div{text-align:center;border-top:2px solid #333;padding-top:10px;width:200px}
</style></head><body>
<div class="header"><div><h1>${store.companySettings?.name || 'MarArc'}</h1><p>${store.companySettings?.slogan || ''}</p></div></div>
<h2>كشف مرتبات شهر ${selectedMonth}</h2>
<p>تاريخ الطباعة: ${new Date().toLocaleDateString('ar-EG')}</p>
<table>
<tr><th>الموظف</th><th>الأساسي</th><th>المكافآت</th><th>الخصومات</th><th>الضريبة</th><th>الصافي</th><th>الحالة</th></tr>
${monthRecords.map((r: any) => `<tr><td>${r.employeeName}</td><td>${(r.baseSalary||0).toLocaleString()}</td><td>${(r.bonus||0).toLocaleString()}</td><td>${(r.deductions||0).toLocaleString()}</td><td>${(r.taxAmount||0).toLocaleString()}</td><td><strong>${(r.netSalary||0).toLocaleString()}</strong></td><td>${r.status}</td></tr>`).join('')}
<tr class="total"><td>الإجمالي</td><td>${totalBase.toLocaleString()}</td><td>${monthRecords.reduce((s:number,r:any)=>s+(r?.bonus||0),0).toLocaleString()}</td><td>${monthRecords.reduce((s:number,r:any)=>s+(r?.deductions||0),0).toLocaleString()}</td><td>${totalTax.toLocaleString()}</td><td><strong>${totalNet.toLocaleString()} ج.م</strong></td><td></td></tr>
</table>
<div class="stamp"><div>المحاسب<br/>${currentUser?.name || ''}</div><div>HR<br/></div><div>التوقيع والختم<br/></div></div>
</body></html>`;
    const win = window.open('', '_blank');
    if (win) { win.document.write(printContent); win.document.close(); win.print(); }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="gov-card rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl luxury-gradient flex items-center justify-center">
              <DollarSign size={28} className="text-[#d4af37]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#1e3a5f]">نظام المرتبات</h2>
              <p className="text-gray-500 text-sm">إدارة ومتابعة مرتبات الموظفين</p>
            </div>
          </div>
          <div className="flex gap-3 items-center flex-wrap">
            <input type="month" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#d4af37] text-sm" />
            {canManageSalaries && (
              <button type="button" onClick={() => generateMonthlySalaries(selectedMonth)}
                className="gov-button flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold cursor-pointer">
                <Calculator size={18} /> فرض المرتبات
              </button>
            )}
            {monthRecords.length > 0 && (
              <button type="button" onClick={exportPDF}
                className="flex items-center gap-2 px-5 py-3 bg-green-600 text-white rounded-xl text-sm font-bold cursor-pointer hover:bg-green-700">
                <FileDown size={18} /> تصدير PDF
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'إجمالي الرواتب الأساسية', value: totalBase, icon: DollarSign, color: 'from-blue-500 to-blue-600' },
          { label: 'إجمالي صافي المرتبات', value: totalNet, icon: TrendingUp, color: 'from-green-500 to-green-600' },
          { label: 'إجمالي الضرائب', value: totalTax, icon: FileSpreadsheet, color: 'from-red-500 to-red-600' },
          { label: 'مدفوع', value: paidCount, icon: CheckCircle, color: 'from-emerald-500 to-emerald-600', isCount: true },
          { label: 'معلق', value: pendingCount, icon: Clock, color: 'from-amber-500 to-amber-600', isCount: true },
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
              <p className="text-2xl font-bold text-[#1e3a5f]">
                {stat.isCount ? stat.value : `${stat.value.toLocaleString()} ج.م`}
              </p>
            </div>
          );
        })}
      </div>

      {/* Salary by Rank */}
      <div className="gov-card rounded-2xl overflow-hidden">
        <div className="luxury-gradient p-4 flex items-center gap-3">
          <Users size={20} className="text-[#d4af37]" />
          <h3 className="font-bold text-[#d4af37]">ملخص المرتبات حسب الرتبة</h3>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(rankSummary).map(([rank, data]) => {
            const d = data as any;
            return (
            <div key={rank} className="flex items-center justify-between p-4 bg-gradient-to-l from-[#d4af37]/5 to-[#d4af37]/10 rounded-xl border border-[#d4af37]/20">
              <div>
                <p className="font-bold text-[#1e3a5f]">{rank}</p>
                <p className="text-xs text-gray-500">{d.count} موظف</p>
              </div>
              <p className="font-bold text-[#d4af37]">{d.totalSalary.toLocaleString()} ج.م</p>
            </div>
            );
          })}
        </div>
      </div>

      {/* Salary Records Table */}
      <div className="gov-card rounded-2xl overflow-hidden">
        <div className="luxury-gradient p-4">
          <h3 className="font-bold text-[#d4af37]">سجلات المرتبات - {selectedMonth}</h3>
        </div>
        {monthRecords.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <DollarSign size={64} className="mx-auto mb-4 text-gray-300" />
            <p className="text-xl font-medium">لا توجد سجلات مرتبات لهذا الشهر</p>
            {canManageSalaries && <p className="text-sm mt-2">اضغط "فرض المرتبات" لإنشاء سجلات الشهر</p>}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm luxury-table">
              <thead>
                <tr>
                  <th className="px-4 py-4 text-right font-bold">الموظف</th>
                  <th className="px-4 py-4 text-right font-bold">الأساسي</th>
                  <th className="px-4 py-4 text-right font-bold">المكافآت</th>
                  <th className="px-4 py-4 text-right font-bold">الخصومات</th>
                  <th className="px-4 py-4 text-right font-bold">الضريبة</th>
                  <th className="px-4 py-4 text-right font-bold">الصافي</th>
                  <th className="px-4 py-4 text-right font-bold">الحالة</th>
                  {canManageSalaries && <th className="px-4 py-4 text-right font-bold">إجراء</th>}
                </tr>
              </thead>
              <tbody>
                {monthRecords.map((record: any) => (
                  <tr key={record.id} className="border-t border-gray-100 hover:bg-[#d4af37]/5">
                    <td className="px-4 py-4 font-bold text-[#1e3a5f]">{record.employeeName}</td>
                    <td className="px-4 py-4">{(record.baseSalary||0).toLocaleString()}</td>
                    <td className="px-4 py-4 text-green-600 font-medium">+{(record.bonus||0).toLocaleString()}</td>
                    <td className="px-4 py-4 text-red-600 font-medium">-{(record.deductions||0).toLocaleString()}</td>
                    <td className="px-4 py-4 text-orange-600 font-medium">-{(record.taxAmount||0).toLocaleString()} ({record.taxRate}%)</td>
                    <td className="px-4 py-4 font-bold text-green-700 text-lg">{(record.netSalary||0).toLocaleString()}</td>
                    <td className="px-4 py-4">
                      <span className={`text-xs px-3 py-1.5 rounded-full font-bold ${
                        record.status === 'مدفوع' ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'
                      }`}>{record.status}</span>
                    </td>
                    {canManageSalaries && (
                      <td className="px-4 py-4">
                        {record.status === 'معلق' ? (
                          <button type="button" onClick={() => paySalary(record.id)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 cursor-pointer">
                            💰 صرف
                          </button>
                        ) : (
                          <span className="text-xs text-green-600">✅ تم {record.paidDate}</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-[#1e3a5f] text-white font-bold">
                <tr>
                  <td className="px-4 py-4">الإجمالي</td>
                  <td className="px-4 py-4">{totalBase.toLocaleString()}</td>
                  <td className="px-4 py-4 text-green-300">+{monthRecords.reduce((s:number, r:any) => s + (r?.bonus||0), 0).toLocaleString()}</td>
                  <td className="px-4 py-4 text-red-300">-{monthRecords.reduce((s:number, r:any) => s + (r?.deductions||0), 0).toLocaleString()}</td>
                  <td className="px-4 py-4 text-orange-300">-{totalTax.toLocaleString()}</td>
                  <td className="px-4 py-4 text-[#d4af37] text-lg">{totalNet.toLocaleString()}</td>
                  <td className="px-4 py-4" colSpan={canManageSalaries ? 2 : 1}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
