import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Calculator, Plus, Trash2, X, Save, TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, FileText, BarChart3, PieChart, FileDown } from 'lucide-react';

type Tab = 'overview' | 'entries' | 'sales' | 'expenses' | 'inventory' | 'calculator';

export default function Accounting() {
  const store = useStore();
  const entries = (Array.isArray(store.accountingEntries) ? store.accountingEntries : Object.values(store.accountingEntries || {})) as any[];
  const inventory = (Array.isArray(store.inventory) ? store.inventory : Object.values(store.inventory || {})) as any[];
  const sales = (Array.isArray(store.sales) ? store.sales : Object.values(store.sales || {})) as any[];
  const expenses = (Array.isArray(store.expenses) ? store.expenses : Object.values(store.expenses || {})) as any[];
  const employees = (Array.isArray(store.employees) ? store.employees : Object.values(store.employees || {})) as any[];

  const [tab, setTab] = useState<Tab>('overview');
  const [showForm, setShowForm] = useState('');
  const [calcA, setCalcA] = useState('');
  const [calcB, setCalcB] = useState('');
  const [calcOp, setCalcOp] = useState('+');

  // حسابات تلقائية
  const totals = useMemo(() => {
    const totalCredit = entries.filter((e: any) => e?.type === 'دائن').reduce((s: number, e: any) => s + (e?.amount || 0), 0);
    const totalDebit = entries.filter((e: any) => e?.type === 'مدين').reduce((s: number, e: any) => s + (e?.amount || 0), 0);
    const totalSales = sales.reduce((s: number, e: any) => s + (e?.grandTotal || 0), 0);
    const totalExpenses = expenses.reduce((s: number, e: any) => s + (e?.amount || 0), 0);
    const totalSalaries = employees.filter((e: any) => e?.status === 'نشط').reduce((s: number, e: any) => s + (e?.netSalary || 0), 0);
    const inventoryValue = inventory.reduce((s: number, e: any) => s + ((e?.quantity || 0) * (e?.unitPrice || 0)), 0);
    const totalVat = sales.reduce((s: number, e: any) => s + (e?.vatAmount || 0), 0);
    const paidSales = sales.filter((s: any) => s?.status === 'مدفوع').reduce((a: number, s: any) => a + (s?.grandTotal || 0), 0);
    const unpaidSales = totalSales - paidSales;
    const netProfit = totalSales - totalExpenses - totalSalaries;
    return { totalCredit, totalDebit, totalSales, totalExpenses, totalSalaries, inventoryValue, totalVat, paidSales, unpaidSales, netProfit, balance: totalCredit - totalDebit };
  }, [entries, sales, expenses, employees, inventory]);

  // فورمات
  const [entryForm, setEntryForm] = useState({ date: new Date().toISOString().split('T')[0], type: 'دائن' as 'دائن' | 'مدين', category: 'مبيعات', description: '', amount: 0, reference: '' });
  const [invForm, setInvForm] = useState({ name: '', unit: 'متر مربع', quantity: 0, unitPrice: 0, minStock: 10, category: 'رخام', lastUpdated: new Date().toISOString().split('T')[0] });
  const [saleForm, setSaleForm] = useState({ date: new Date().toISOString().split('T')[0], clientName: '', items: '', quantity: 1, unitPrice: 0, total: 0, vatRate: 14, status: 'مدفوع' as 'مدفوع' | 'آجل' | 'جزئي', paidAmount: 0, notes: '' });
  const [expForm, setExpForm] = useState({ date: new Date().toISOString().split('T')[0], category: 'مواد خام', description: '', amount: 0, paidTo: '', method: 'كاش', receipt: '' });

  const calcResult = useMemo(() => {
    const a = parseFloat(calcA) || 0;
    const b = parseFloat(calcB) || 0;
    switch (calcOp) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 0;
      case '%': return (a * b) / 100;
      case 'ض': return a + (a * 14 / 100); // حساب مع ضريبة 14%
      default: return 0;
    }
  }, [calcA, calcB, calcOp]);

  const tabs = [
    { id: 'overview', label: 'الميزانية العامة', icon: PieChart },
    { id: 'entries', label: 'القيود المحاسبية', icon: FileText },
    { id: 'sales', label: 'المبيعات', icon: ShoppingCart },
    { id: 'expenses', label: 'المصروفات', icon: TrendingDown },
    { id: 'inventory', label: 'المخزون', icon: Package },
    { id: 'calculator', label: 'الآلة الحاسبة', icon: Calculator },
  ];

  // تصدير تقرير PDF
  const exportReport = (title: string, content: string) => {
    const html = `<!DOCTYPE html><html dir="rtl"><head><meta charset="UTF-8"><title>${title}</title>
    <style>body{font-family:Arial,sans-serif;padding:40px;direction:rtl}h1{color:#1e3a5f;border-bottom:3px solid #d4af37;padding-bottom:10px}
    table{width:100%;border-collapse:collapse;margin:20px 0}th{background:#1e3a5f;color:#d4af37;padding:10px;text-align:right}
    td{padding:8px 10px;border-bottom:1px solid #eee;text-align:right}.total{background:#f0f0f0;font-weight:bold}
    .box{background:#f8f9fa;border:2px solid #d4af37;border-radius:10px;padding:20px;margin:10px 0;text-align:center}
    .green{color:#16a34a}.red{color:#dc2626}.stamp{margin-top:50px;display:flex;justify-content:space-around}
    .stamp div{border-top:2px solid #333;padding-top:10px;width:180px;text-align:center}</style></head><body>
    <h1>${store.companySettings?.name || 'MarArc'}</h1><p>${store.companySettings?.slogan || ''}</p>
    <h2>${title}</h2><p>التاريخ: ${new Date().toLocaleDateString('ar-EG')} | المحاسب: ${store.currentUser?.name || ''}</p>
    ${content}
    <div class="stamp"><div>المحاسب<br/>${store.currentUser?.name || ''}</div><div>HR<br/></div><div>الختم<br/></div></div>
    </body></html>`;
    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); w.print(); }
  };

  const exportFullReport = () => {
    const content = `
    <div class="box"><h3>الميزانية العامة</h3></div>
    <table><tr><th>البند</th><th>المبلغ</th></tr>
    <tr><td>إجمالي المبيعات</td><td class="green">${totals.totalSales.toLocaleString()} ج.م</td></tr>
    <tr><td>إجمالي المصروفات</td><td class="red">${totals.totalExpenses.toLocaleString()} ج.م</td></tr>
    <tr><td>إجمالي الرواتب</td><td class="red">${totals.totalSalaries.toLocaleString()} ج.م</td></tr>
    <tr><td>قيمة المخزون</td><td>${totals.inventoryValue.toLocaleString()} ج.م</td></tr>
    <tr><td>ضريبة القيمة المضافة المحصلة</td><td>${totals.totalVat.toLocaleString()} ج.م</td></tr>
    <tr><td>إجمالي الدائن</td><td class="green">${totals.totalCredit.toLocaleString()} ج.م</td></tr>
    <tr><td>إجمالي المدين</td><td class="red">${totals.totalDebit.toLocaleString()} ج.م</td></tr>
    <tr class="total"><td><strong>صافي الربح</strong></td><td><strong>${totals.netProfit.toLocaleString()} ج.م</strong></td></tr></table>

    ${sales.length > 0 ? `<div class="box"><h3>المبيعات (${sales.length} فاتورة)</h3></div>
    <table><tr><th>التاريخ</th><th>العميل</th><th>الأصناف</th><th>المبلغ</th><th>ض.ق.م</th><th>الإجمالي</th><th>الحالة</th></tr>
    ${sales.map((s:any) => `<tr><td>${s.date}</td><td>${s.clientName}</td><td>${s.items}</td><td>${(s.total||0).toLocaleString()}</td><td>${(s.vatAmount||0).toLocaleString()}</td><td><strong>${(s.grandTotal||0).toLocaleString()}</strong></td><td>${s.status}</td></tr>`).join('')}</table>` : ''}

    ${expenses.length > 0 ? `<div class="box"><h3>المصروفات (${expenses.length} عملية)</h3></div>
    <table><tr><th>التاريخ</th><th>التصنيف</th><th>الوصف</th><th>المبلغ</th><th>المدفوع لـ</th></tr>
    ${expenses.map((e:any) => `<tr><td>${e.date}</td><td>${e.category}</td><td>${e.description}</td><td class="red">${(e.amount||0).toLocaleString()}</td><td>${e.paidTo}</td></tr>`).join('')}</table>` : ''}

    ${entries.length > 0 ? `<div class="box"><h3>القيود المحاسبية (${entries.length} قيد)</h3></div>
    <table><tr><th>التاريخ</th><th>النوع</th><th>التصنيف</th><th>الوصف</th><th>المبلغ</th></tr>
    ${entries.map((e:any) => `<tr><td>${e.date}</td><td>${e.type}</td><td>${e.category}</td><td>${e.description}</td><td>${(e.amount||0).toLocaleString()}</td></tr>`).join('')}</table>` : ''}

    ${inventory.length > 0 ? `<div class="box"><h3>المخزون (${inventory.length} صنف)</h3></div>
    <table><tr><th>الصنف</th><th>الكمية</th><th>الوحدة</th><th>سعر الوحدة</th><th>القيمة</th></tr>
    ${inventory.map((i:any) => `<tr><td>${i.name}</td><td>${i.quantity}</td><td>${i.unit}</td><td>${(i.unitPrice||0).toLocaleString()}</td><td><strong>${((i.quantity||0)*(i.unitPrice||0)).toLocaleString()}</strong></td></tr>`).join('')}</table>` : ''}
    `;
    exportReport('التقرير المحاسبي الشامل', content);
  };

  const entryCategories = ['مبيعات', 'مشتريات', 'رواتب', 'إيجار', 'كهرباء', 'صيانة', 'نقل', 'تسويق', 'ضرائب', 'أخرى'];
  const expCategories = ['مواد خام', 'رواتب', 'إيجار', 'كهرباء ومياه', 'صيانة', 'نقل وشحن', 'تسويق وإعلان', 'معدات', 'أخرى'];
  const invCategories = ['رخام', 'جرانيت', 'أدوات', 'مواد لاصقة', 'معدات', 'أخرى'];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="gov-card rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl luxury-gradient flex items-center justify-center">
              <BarChart3 size={28} className="text-[#d4af37]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#1e3a5f]">نظام المحاسبة المتكامل</h2>
              <p className="text-gray-500 text-sm">إدارة مالية شاملة - دائن ومدين ومبيعات ومخزون</p>
            </div>
          </div>
          <button type="button" onClick={exportFullReport}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-bold cursor-pointer hover:bg-green-700 transition-all">
            <FileDown size={18} /> تصدير تقرير PDF شامل
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white p-1.5 rounded-xl shadow border-t-4 border-[#d4af37] overflow-x-auto">
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} type="button" onClick={() => setTab(t.id as Tab)}
              className={`flex items-center gap-1.5 px-4 py-3 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${tab === t.id ? 'luxury-gradient text-[#d4af37]' : 'text-gray-500 hover:bg-gray-50'}`}>
              <Icon size={16} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* === الميزانية العامة === */}
      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'إجمالي المبيعات', value: totals.totalSales, icon: ShoppingCart, color: 'from-green-500 to-green-600' },
              { label: 'إجمالي المصروفات', value: totals.totalExpenses, icon: TrendingDown, color: 'from-red-500 to-red-600' },
              { label: 'إجمالي الرواتب', value: totals.totalSalaries, icon: DollarSign, color: 'from-amber-500 to-amber-600' },
              { label: 'قيمة المخزون', value: totals.inventoryValue, icon: Package, color: 'from-blue-500 to-blue-600' },
              { label: 'إجمالي الدائن', value: totals.totalCredit, icon: TrendingUp, color: 'from-emerald-500 to-emerald-600' },
              { label: 'إجمالي المدين', value: totals.totalDebit, icon: TrendingDown, color: 'from-orange-500 to-orange-600' },
              { label: 'ضريبة القيمة المضافة', value: totals.totalVat, icon: FileText, color: 'from-purple-500 to-purple-600' },
              { label: 'مبيعات غير مسددة', value: totals.unpaidSales, icon: DollarSign, color: 'from-rose-500 to-rose-600' },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="gov-card rounded-xl p-4">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <p className="text-xs text-gray-500">{s.label}</p>
                  <p className="text-xl font-bold text-[#1e3a5f]">{s.value.toLocaleString()} ج.م</p>
                </div>
              );
            })}
          </div>

          {/* صافي الربح */}
          <div className={`gov-card rounded-2xl p-6 ${totals.netProfit >= 0 ? 'border-t-4 border-green-500' : 'border-t-4 border-red-500'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">صافي الربح التقديري</p>
                <p className="text-sm text-gray-400 mt-1">المبيعات - المصروفات - الرواتب</p>
              </div>
              <p className={`text-4xl font-bold ${totals.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totals.netProfit.toLocaleString()} ج.م
              </p>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div className="text-center p-3 bg-green-50 rounded-xl">
                <p className="text-xs text-gray-500">الدخل</p>
                <p className="font-bold text-green-600">{totals.totalSales.toLocaleString()}</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-xl">
                <p className="text-xs text-gray-500">المصروفات</p>
                <p className="font-bold text-red-600">{totals.totalExpenses.toLocaleString()}</p>
              </div>
              <div className="text-center p-3 bg-amber-50 rounded-xl">
                <p className="text-xs text-gray-500">الرواتب</p>
                <p className="font-bold text-amber-600">{totals.totalSalaries.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* ميزان المراجعة */}
          <div className="gov-card rounded-2xl p-6">
            <h3 className="font-bold text-[#1e3a5f] text-lg mb-4">📊 ميزان المراجعة</h3>
            <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: totals.balance >= 0 ? '#ecfdf5' : '#fef2f2' }}>
              <span className="font-bold">الرصيد (دائن - مدين)</span>
              <span className={`text-2xl font-bold ${totals.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totals.balance.toLocaleString()} ج.م
              </span>
            </div>
          </div>
        </div>
      )}

      {/* === القيود المحاسبية === */}
      {tab === 'entries' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button type="button" onClick={() => setShowForm('entry')} className="gov-button flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold cursor-pointer">
              <Plus size={18} /> إضافة قيد
            </button>
          </div>
          <div className="gov-card rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="luxury-gradient text-[#d4af37]">
                <tr>
                  <th className="px-4 py-3 text-right">التاريخ</th>
                  <th className="px-4 py-3 text-right">النوع</th>
                  <th className="px-4 py-3 text-right">التصنيف</th>
                  <th className="px-4 py-3 text-right">الوصف</th>
                  <th className="px-4 py-3 text-right">المبلغ</th>
                  <th className="px-4 py-3 text-right">المرجع</th>
                  <th className="px-4 py-3 text-right">حذف</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e: any) => e && (
                  <tr key={e.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">{e.date}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-bold ${e.type === 'دائن' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{e.type}</span></td>
                    <td className="px-4 py-3">{e.category}</td>
                    <td className="px-4 py-3 max-w-xs truncate">{e.description}</td>
                    <td className="px-4 py-3 font-bold">{(e.amount || 0).toLocaleString()} ج.م</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{e.reference}</td>
                    <td className="px-4 py-3"><button type="button" onClick={() => store.deleteAccountingEntry(e.id)} className="text-red-500 hover:bg-red-50 p-1 rounded cursor-pointer"><Trash2 size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {entries.length === 0 && <div className="p-12 text-center text-gray-400">لا توجد قيود بعد</div>}
          </div>
        </div>
      )}

      {/* === المبيعات === */}
      {tab === 'sales' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button type="button" onClick={() => setShowForm('sale')} className="gov-button flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold cursor-pointer">
              <Plus size={18} /> فاتورة بيع جديدة
            </button>
          </div>
          <div className="gov-card rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="luxury-gradient text-[#d4af37]">
                <tr>
                  <th className="px-3 py-3 text-right">التاريخ</th>
                  <th className="px-3 py-3 text-right">العميل</th>
                  <th className="px-3 py-3 text-right">الأصناف</th>
                  <th className="px-3 py-3 text-right">الكمية</th>
                  <th className="px-3 py-3 text-right">المبلغ</th>
                  <th className="px-3 py-3 text-right">ض.ق.م</th>
                  <th className="px-3 py-3 text-right">الإجمالي</th>
                  <th className="px-3 py-3 text-right">الحالة</th>
                  <th className="px-3 py-3 text-right">حذف</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((s: any) => s && (
                  <tr key={s.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-3">{s.date}</td>
                    <td className="px-3 py-3 font-medium">{s.clientName}</td>
                    <td className="px-3 py-3">{s.items}</td>
                    <td className="px-3 py-3">{s.quantity}</td>
                    <td className="px-3 py-3">{(s.total || 0).toLocaleString()}</td>
                    <td className="px-3 py-3 text-purple-600">{(s.vatAmount || 0).toLocaleString()}</td>
                    <td className="px-3 py-3 font-bold text-green-600">{(s.grandTotal || 0).toLocaleString()}</td>
                    <td className="px-3 py-3"><span className={`px-2 py-1 rounded-full text-xs font-bold ${s.status === 'مدفوع' ? 'bg-green-100 text-green-700' : s.status === 'آجل' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{s.status}</span></td>
                    <td className="px-3 py-3"><button type="button" onClick={() => store.deleteSale(s.id)} className="text-red-500 hover:bg-red-50 p-1 rounded cursor-pointer"><Trash2 size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {sales.length === 0 && <div className="p-12 text-center text-gray-400">لا توجد فواتير بيع بعد</div>}
          </div>
        </div>
      )}

      {/* === المصروفات === */}
      {tab === 'expenses' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button type="button" onClick={() => setShowForm('expense')} className="gov-button flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold cursor-pointer">
              <Plus size={18} /> إضافة مصروف
            </button>
          </div>
          <div className="gov-card rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="luxury-gradient text-[#d4af37]">
                <tr>
                  <th className="px-4 py-3 text-right">التاريخ</th>
                  <th className="px-4 py-3 text-right">التصنيف</th>
                  <th className="px-4 py-3 text-right">الوصف</th>
                  <th className="px-4 py-3 text-right">المبلغ</th>
                  <th className="px-4 py-3 text-right">المدفوع لـ</th>
                  <th className="px-4 py-3 text-right">الطريقة</th>
                  <th className="px-4 py-3 text-right">حذف</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((e: any) => e && (
                  <tr key={e.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">{e.date}</td>
                    <td className="px-4 py-3">{e.category}</td>
                    <td className="px-4 py-3 max-w-xs truncate">{e.description}</td>
                    <td className="px-4 py-3 font-bold text-red-600">{(e.amount || 0).toLocaleString()} ج.م</td>
                    <td className="px-4 py-3">{e.paidTo}</td>
                    <td className="px-4 py-3">{e.method}</td>
                    <td className="px-4 py-3"><button type="button" onClick={() => store.deleteExpense(e.id)} className="text-red-500 hover:bg-red-50 p-1 rounded cursor-pointer"><Trash2 size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {expenses.length === 0 && <div className="p-12 text-center text-gray-400">لا توجد مصروفات بعد</div>}
          </div>
        </div>
      )}

      {/* === المخزون === */}
      {tab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button type="button" onClick={() => setShowForm('inventory')} className="gov-button flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold cursor-pointer">
              <Plus size={18} /> إضافة صنف
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {inventory.map((item: any) => item && (
              <div key={item.id} className={`gov-card rounded-xl p-4 ${(item.quantity || 0) <= (item.minStock || 0) ? 'border-2 border-red-300 bg-red-50/50' : ''}`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-[#1e3a5f]">{item.name}</h4>
                    <span className="text-xs text-gray-400">{item.category}</span>
                  </div>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => store.deleteInventoryItem(item.id)} className="text-red-500 hover:bg-red-50 p-1 rounded cursor-pointer"><Trash2 size={14} /></button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-400">الكمية</p>
                    <p className={`font-bold ${(item.quantity || 0) <= (item.minStock || 0) ? 'text-red-600' : 'text-[#1e3a5f]'}`}>
                      {item.quantity} {item.unit}
                      {(item.quantity || 0) <= (item.minStock || 0) && <span className="text-xs mr-1">⚠️</span>}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-400">سعر الوحدة</p>
                    <p className="font-bold text-[#1e3a5f]">{(item.unitPrice || 0).toLocaleString()} ج.م</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-2 col-span-2">
                    <p className="text-xs text-gray-400">القيمة الإجمالية</p>
                    <p className="font-bold text-green-600">{((item.quantity || 0) * (item.unitPrice || 0)).toLocaleString()} ج.م</p>
                  </div>
                </div>
                {/* تعديل سريع للكمية */}
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  <button type="button" onClick={() => store.updateInventoryItem(item.id, { quantity: Math.max(0, (item.quantity || 0) - 1) })}
                    className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg font-bold text-sm cursor-pointer hover:bg-red-100">- صرف 1</button>
                  <button type="button" onClick={() => store.updateInventoryItem(item.id, { quantity: (item.quantity || 0) + 1 })}
                    className="flex-1 py-2 bg-green-50 text-green-600 rounded-lg font-bold text-sm cursor-pointer hover:bg-green-100">+ إضافة 1</button>
                </div>
              </div>
            ))}
          </div>
          {inventory.length === 0 && <div className="gov-card rounded-2xl p-16 text-center text-gray-400"><Package size={48} className="mx-auto mb-4 text-gray-300" />لا توجد أصناف في المخزون</div>}
        </div>
      )}

      {/* === الآلة الحاسبة === */}
      {tab === 'calculator' && (
        <div className="max-w-lg mx-auto">
          <div className="gov-card rounded-2xl p-6">
            <h3 className="font-bold text-[#1e3a5f] text-lg mb-4 flex items-center gap-2"><Calculator size={20} /> الآلة الحاسبة المحاسبية</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">الرقم الأول</label>
                <input type="number" value={calcA} onChange={e => setCalcA(e.target.value)} placeholder="0"
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-2xl font-bold text-center focus:border-[#d4af37] focus:outline-none" />
              </div>
              <div className="flex gap-2 justify-center flex-wrap">
                {['+', '-', '×', '÷', '%', 'ض'].map(op => (
                  <button key={op} type="button" onClick={() => setCalcOp(op)}
                    className={`w-14 h-14 rounded-xl font-bold text-xl cursor-pointer transition-all ${calcOp === op ? 'luxury-gradient text-[#d4af37] shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {op === 'ض' ? '14%' : op}
                  </button>
                ))}
              </div>
              {calcOp !== 'ض' && (
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1">{calcOp === '%' ? 'النسبة المئوية' : 'الرقم الثاني'}</label>
                  <input type="number" value={calcB} onChange={e => setCalcB(e.target.value)} placeholder="0"
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-2xl font-bold text-center focus:border-[#d4af37] focus:outline-none" />
                </div>
              )}
              <div className="bg-gradient-to-l from-[#1e3a5f] to-[#0f2540] rounded-xl p-6 text-center">
                <p className="text-[#d4af37]/70 text-sm mb-1">النتيجة</p>
                <p className="text-4xl font-bold text-[#d4af37]">{calcResult.toLocaleString('en', { maximumFractionDigits: 2 })}</p>
                {calcOp === 'ض' && <p className="text-xs text-white/60 mt-2">= {calcA} + ضريبة 14%</p>}
                {calcOp === '%' && <p className="text-xs text-white/60 mt-2">= {calcB}% من {calcA}</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* === النماذج (Modals) === */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={() => setShowForm('')}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border-t-4 border-[#d4af37]" onClick={e => e.stopPropagation()}>
            <div className="luxury-gradient p-5 flex items-center justify-between sticky top-0 z-10">
              <h3 className="text-lg font-bold text-[#d4af37]">
                {showForm === 'entry' && '➕ قيد محاسبي جديد'}
                {showForm === 'sale' && '🧾 فاتورة بيع جديدة'}
                {showForm === 'expense' && '💸 مصروف جديد'}
                {showForm === 'inventory' && '📦 صنف جديد بالمخزون'}
              </h3>
              <button type="button" onClick={() => setShowForm('')} className="text-white/70 hover:text-white cursor-pointer"><X size={22} /></button>
            </div>

            <div className="p-5 space-y-4">
              {/* قيد محاسبي */}
              {showForm === 'entry' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">التاريخ</label>
                      <input type="date" value={entryForm.date} onChange={e => setEntryForm({...entryForm, date: e.target.value})} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">النوع</label>
                      <select value={entryForm.type} onChange={e => setEntryForm({...entryForm, type: e.target.value as any})} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none">
                        <option value="دائن">دائن (+)</option>
                        <option value="مدين">مدين (-)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">التصنيف</label>
                    <select value={entryForm.category} onChange={e => setEntryForm({...entryForm, category: e.target.value})} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none">
                      {entryCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">الوصف</label>
                    <input type="text" value={entryForm.description} onChange={e => setEntryForm({...entryForm, description: e.target.value})} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">المبلغ</label>
                      <input type="number" value={entryForm.amount} onChange={e => setEntryForm({...entryForm, amount: +e.target.value})} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">رقم المرجع</label>
                      <input type="text" value={entryForm.reference} onChange={e => setEntryForm({...entryForm, reference: e.target.value})} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none" />
                    </div>
                  </div>
                  <button type="button" onClick={() => { if (!entryForm.amount) return; store.addAccountingEntry({ ...entryForm, createdBy: store.currentUser?.name || '' }); setShowForm(''); setEntryForm({ date: new Date().toISOString().split('T')[0], type: 'دائن', category: 'مبيعات', description: '', amount: 0, reference: '' }); }}
                    className="w-full py-3.5 luxury-gradient text-[#d4af37] rounded-xl font-bold cursor-pointer"><Save size={18} className="inline mr-2" />حفظ القيد</button>
                </>
              )}

              {/* فاتورة بيع */}
              {showForm === 'sale' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">التاريخ</label>
                      <input type="date" value={saleForm.date} onChange={e => setSaleForm({...saleForm, date: e.target.value})} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">العميل</label>
                      <input type="text" value={saleForm.clientName} onChange={e => setSaleForm({...saleForm, clientName: e.target.value})} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">الأصناف</label>
                    <input type="text" value={saleForm.items} onChange={e => setSaleForm({...saleForm, items: e.target.value})} placeholder="رخام كرارة، جرانيت..." className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">الكمية</label>
                      <input type="number" value={saleForm.quantity} onChange={e => { const q = +e.target.value; setSaleForm({...saleForm, quantity: q, total: q * saleForm.unitPrice}); }} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">سعر الوحدة</label>
                      <input type="number" value={saleForm.unitPrice} onChange={e => { const p = +e.target.value; setSaleForm({...saleForm, unitPrice: p, total: saleForm.quantity * p}); }} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">ض.ق.م %</label>
                      <input type="number" value={saleForm.vatRate} onChange={e => setSaleForm({...saleForm, vatRate: +e.target.value})} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none" />
                    </div>
                  </div>
                  {/* حساب تلقائي */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm space-y-1">
                    <div className="flex justify-between"><span>المجموع:</span><strong>{saleForm.total.toLocaleString()} ج.م</strong></div>
                    <div className="flex justify-between"><span>ض.ق.م ({saleForm.vatRate}%):</span><strong>{Math.round(saleForm.total * saleForm.vatRate / 100).toLocaleString()} ج.م</strong></div>
                    <div className="flex justify-between text-green-700 text-lg border-t border-green-200 pt-1"><span>الإجمالي:</span><strong>{(saleForm.total + Math.round(saleForm.total * saleForm.vatRate / 100)).toLocaleString()} ج.م</strong></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">حالة الدفع</label>
                      <select value={saleForm.status} onChange={e => setSaleForm({...saleForm, status: e.target.value as any})} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none">
                        <option value="مدفوع">مدفوع</option>
                        <option value="آجل">آجل</option>
                        <option value="جزئي">جزئي</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">المبلغ المدفوع</label>
                      <input type="number" value={saleForm.paidAmount} onChange={e => setSaleForm({...saleForm, paidAmount: +e.target.value})} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none" />
                    </div>
                  </div>
                  <button type="button" onClick={() => { if (!saleForm.total) return; store.addSale(saleForm); setShowForm(''); setSaleForm({ date: new Date().toISOString().split('T')[0], clientName: '', items: '', quantity: 1, unitPrice: 0, total: 0, vatRate: 14, status: 'مدفوع', paidAmount: 0, notes: '' }); }}
                    className="w-full py-3.5 luxury-gradient text-[#d4af37] rounded-xl font-bold cursor-pointer"><Save size={18} className="inline mr-2" />حفظ الفاتورة</button>
                </>
              )}

              {/* مصروف */}
              {showForm === 'expense' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">التاريخ</label>
                      <input type="date" value={expForm.date} onChange={e => setExpForm({...expForm, date: e.target.value})} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">التصنيف</label>
                      <select value={expForm.category} onChange={e => setExpForm({...expForm, category: e.target.value})} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none">
                        {expCategories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">الوصف</label>
                    <input type="text" value={expForm.description} onChange={e => setExpForm({...expForm, description: e.target.value})} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">المبلغ</label>
                      <input type="number" value={expForm.amount} onChange={e => setExpForm({...expForm, amount: +e.target.value})} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">المدفوع لـ</label>
                      <input type="text" value={expForm.paidTo} onChange={e => setExpForm({...expForm, paidTo: e.target.value})} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">الطريقة</label>
                      <select value={expForm.method} onChange={e => setExpForm({...expForm, method: e.target.value})} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none">
                        <option value="كاش">كاش</option>
                        <option value="تحويل بنكي">تحويل بنكي</option>
                        <option value="شيك">شيك</option>
                        <option value="بطاقة">بطاقة</option>
                      </select>
                    </div>
                  </div>
                  <button type="button" onClick={() => { if (!expForm.amount) return; store.addExpense(expForm); setShowForm(''); setExpForm({ date: new Date().toISOString().split('T')[0], category: 'مواد خام', description: '', amount: 0, paidTo: '', method: 'كاش', receipt: '' }); }}
                    className="w-full py-3.5 luxury-gradient text-[#d4af37] rounded-xl font-bold cursor-pointer"><Save size={18} className="inline mr-2" />حفظ المصروف</button>
                </>
              )}

              {/* مخزون */}
              {showForm === 'inventory' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">اسم الصنف</label>
                      <input type="text" value={invForm.name} onChange={e => setInvForm({...invForm, name: e.target.value})} placeholder="رخام كرارة إيطالي" className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">التصنيف</label>
                      <select value={invForm.category} onChange={e => setInvForm({...invForm, category: e.target.value})} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none">
                        {invCategories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">الكمية</label>
                      <input type="number" value={invForm.quantity} onChange={e => setInvForm({...invForm, quantity: +e.target.value})} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">الوحدة</label>
                      <select value={invForm.unit} onChange={e => setInvForm({...invForm, unit: e.target.value})} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none">
                        <option value="متر مربع">متر مربع</option>
                        <option value="قطعة">قطعة</option>
                        <option value="طن">طن</option>
                        <option value="كيلو">كيلو</option>
                        <option value="لتر">لتر</option>
                        <option value="علبة">علبة</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">سعر الوحدة</label>
                      <input type="number" value={invForm.unitPrice} onChange={e => setInvForm({...invForm, unitPrice: +e.target.value})} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">الحد الأدنى للمخزون (تنبيه)</label>
                    <input type="number" value={invForm.minStock} onChange={e => setInvForm({...invForm, minStock: +e.target.value})} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none" />
                  </div>
                  {invForm.quantity > 0 && invForm.unitPrice > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700">
                      <strong>القيمة الإجمالية:</strong> {(invForm.quantity * invForm.unitPrice).toLocaleString()} ج.م
                    </div>
                  )}
                  <button type="button" onClick={() => { if (!invForm.name) return; store.addInventoryItem(invForm); setShowForm(''); setInvForm({ name: '', unit: 'متر مربع', quantity: 0, unitPrice: 0, minStock: 10, category: 'رخام', lastUpdated: new Date().toISOString().split('T')[0] }); }}
                    className="w-full py-3.5 luxury-gradient text-[#d4af37] rounded-xl font-bold cursor-pointer"><Save size={18} className="inline mr-2" />حفظ الصنف</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
