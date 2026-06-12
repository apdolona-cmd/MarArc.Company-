import { useState } from 'react';
import { useStore } from '../store/useStore';
import { BarChart3, Download, Printer } from 'lucide-react';

export default function Reports() {
  const { employees, sales, invoices, projects, contracts, generateReport } = useStore();
  const [selectedReport, setSelectedReport] = useState('sales');
  const [reportData, setReportData] = useState<any>(null);

  const handleGenerateReport = (type: string) => {
    setSelectedReport(type);
    
    let data: any = {};
    
    if (type === 'sales') {
      const totalSales = sales.reduce((sum, s) => sum + (s.total || 0), 0);
      const totalVAT = sales.reduce((sum, s) => sum + (s.vatAmount || 0), 0);
      data = {
        type: 'تقرير المبيعات',
        totalSales,
        totalVAT,
        recordCount: sales.length,
        averageSale: sales.length > 0 ? totalSales / sales.length : 0,
        records: sales
      };
    } else if (type === 'employees') {
      const totalSalaries = employees.reduce((sum, e) => sum + (e.netSalary || 0), 0);
      const activeEmployees = employees.filter(e => e.status === 'نشط').length;
      data = {
        type: 'تقرير الموظفين',
        totalEmployees: employees.length,
        activeEmployees,
        totalMonthlySalaries: totalSalaries,
        employees: employees
      };
    } else if (type === 'projects') {
      const completedProjects = projects.filter(p => p.status === 'مكتمل').length;
      const activeProjects = projects.filter(p => p.status === 'قيد التنفيذ').length;
      const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
      const totalSpent = projects.reduce((sum, p) => sum + (p.spent || 0), 0);
      data = {
        type: 'تقرير المشاريع',
        totalProjects: projects.length,
        activeProjects,
        completedProjects,
        totalBudget,
        totalSpent,
        remaining: totalBudget - totalSpent,
        projects: projects
      };
    } else if (type === 'profitloss') {
      const totalIncome = invoices.reduce((sum, i) => sum + (i.totalAmount || 0), 0);
      data = {
        type: 'تقرير الأرباح والخسائر',
        totalIncome,
        period: new Date().toLocaleDateString('ar-EG')
      };
    }
    
    setReportData(data);
  };

  const reports = [
    { id: 'sales', name: '📊 تقرير المبيعات', icon: '💰' },
    { id: 'employees', name: '👥 تقرير الموظفين', icon: '💼' },
    { id: 'projects', name: '🏗️ تقرير المشاريع', icon: '📋' },
    { id: 'profitloss', name: '📈 الأرباح والخسائر', icon: '💵' },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-[#1e3a5f] flex items-center gap-2">
        <BarChart3 size={28} /> التقارير المتقدمة
      </h2>

      {/* خيارات التقارير */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {reports.map(report => (
          <button
            key={report.id}
            onClick={() => handleGenerateReport(report.id)}
            className={`gov-card rounded-xl p-4 text-center transition cursor-pointer ${
              selectedReport === report.id
                ? 'ring-2 ring-[#d4af37] bg-blue-50'
                : 'hover:bg-gray-50'
            }`}
          >
            <p className="text-3xl mb-2">{report.icon}</p>
            <p className="font-bold text-[#1e3a5f] text-sm">{report.name}</p>
          </button>
        ))}
      </div>

      {/* محتوى التقرير */}
      {reportData && (
        <div className="gov-card rounded-2xl p-8 bg-gradient-to-br from-white to-gray-50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#1e3a5f]">{reportData.type}</h2>
            <div className="flex gap-2">
              <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                <Printer size={20} />
              </button>
              <button className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200">
                <Download size={20} />
              </button>
            </div>
          </div>

          {/* بطاقات الإحصائيات الرئيسية */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {reportData.type === 'تقرير المبيعات' && (
              <>
                <div className="p-4 bg-blue-50 rounded-xl text-center">
                  <p className="text-sm text-gray-600">إجمالي المبيعات</p>
                  <p className="text-2xl font-bold text-blue-600">{reportData.totalSales.toLocaleString()} ج.م</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl text-center">
                  <p className="text-sm text-gray-600">الضريبة المضافة</p>
                  <p className="text-2xl font-bold text-green-600">{reportData.totalVAT.toLocaleString()} ج.م</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl text-center">
                  <p className="text-sm text-gray-600">عدد الفواتير</p>
                  <p className="text-2xl font-bold text-purple-600">{reportData.recordCount}</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-xl text-center">
                  <p className="text-sm text-gray-600">متوسط الفاتورة</p>
                  <p className="text-2xl font-bold text-orange-600">{Math.round(reportData.averageSale).toLocaleString()} ج.م</p>
                </div>
              </>
            )}

            {reportData.type === 'تقرير الموظفين' && (
              <>
                <div className="p-4 bg-blue-50 rounded-xl text-center">
                  <p className="text-sm text-gray-600">إجمالي الموظفين</p>
                  <p className="text-2xl font-bold text-blue-600">{reportData.totalEmployees}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl text-center">
                  <p className="text-sm text-gray-600">نشطون</p>
                  <p className="text-2xl font-bold text-green-600">{reportData.activeEmployees}</p>
                </div>
                <div className="p-4 bg-red-50 rounded-xl text-center">
                  <p className="text-sm text-gray-600">المرتبات الشهرية</p>
                  <p className="text-2xl font-bold text-red-600">{reportData.totalMonthlySalaries.toLocaleString()} ج.م</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl text-center">
                  <p className="text-sm text-gray-600">متوسط الراتب</p>
                  <p className="text-2xl font-bold text-purple-600">{Math.round(reportData.totalMonthlySalaries / reportData.totalEmployees).toLocaleString()} ج.م</p>
                </div>
              </>
            )}

            {reportData.type === 'تقرير المشاريع' && (
              <>
                <div className="p-4 bg-blue-50 rounded-xl text-center">
                  <p className="text-sm text-gray-600">إجمالي المشاريع</p>
                  <p className="text-2xl font-bold text-blue-600">{reportData.totalProjects}</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-xl text-center">
                  <p className="text-sm text-gray-600">قيد التنفيذ</p>
                  <p className="text-2xl font-bold text-yellow-600">{reportData.activeProjects}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl text-center">
                  <p className="text-sm text-gray-600">مكتملة</p>
                  <p className="text-2xl font-bold text-green-600">{reportData.completedProjects}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl text-center">
                  <p className="text-sm text-gray-600">الميزانية المتبقية</p>
                  <p className="text-2xl font-bold text-purple-600">{reportData.remaining.toLocaleString()} ج.م</p>
                </div>
              </>
            )}
          </div>

          {/* الجدول التفصيلي */}
          {reportData.records && (
            <div className="mt-8">
              <h3 className="text-lg font-bold text-[#1e3a5f] mb-4">التفاصيل</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-[#d4af37]">
                      <th className="text-right py-2 px-4">البيان</th>
                      <th className="text-right py-2 px-4">المبلغ</th>
                      <th className="text-right py-2 px-4">التاريخ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.records.slice(0, 10).map((record: any, idx: number) => (
                      <tr key={idx} className="border-b border-gray-200">
                        <td className="py-2 px-4">{record.clientName || record.name}</td>
                        <td className="py-2 px-4 font-bold">{(record.total || record.amount || 0).toLocaleString()} ج.م</td>
                        <td className="py-2 px-4">{record.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
