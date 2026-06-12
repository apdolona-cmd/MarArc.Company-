import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Plus, Edit2, Trash2, Eye, Printer, Download, Filter } from 'lucide-react';

export default function Invoices() {
  const { invoices, clients, addInvoice, updateInvoice, deleteInvoice } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState('الكل');

  const [formData, setFormData] = useState({
    invoiceNumber: '',
    clientId: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    items: [{ description: '', quantity: 1, unitPrice: 0 }],
    notes: ''
  });

  const handleAddInvoice = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxAmount = subtotal * 0.14;

    addInvoice({
      invoiceNumber: formData.invoiceNumber,
      clientId: formData.clientId,
      clientName: clients.find(c => c.id === formData.clientId)?.name || '',
      date: formData.date,
      dueDate: formData.dueDate,
      items: formData.items as any,
      subtotal,
      taxAmount,
      totalAmount: subtotal + taxAmount,
      status: 'مسودة',
      paidAmount: 0,
      notes: formData.notes
    });

    setShowForm(false);
    setFormData({
      invoiceNumber: '',
      clientId: '',
      date: new Date().toISOString().split('T')[0],
      dueDate: '',
      items: [{ description: '', quantity: 1, unitPrice: 0 }],
      notes: ''
    });
  };

  const filteredInvoices = filter === 'الكل' 
    ? invoices 
    : invoices.filter(inv => inv.status === filter);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#1e3a5f] flex items-center gap-2">
          <span>📄</span> الفواتير والعروض
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-[#1e3a5f] to-[#0f2540] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:shadow-lg transition"
        >
          <Plus size={20} /> فاتورة جديدة
        </button>
      </div>

      {/* فلاتر */}
      <div className="flex gap-2 flex-wrap">
        {['الكل', 'مسودة', 'مرسلة', 'مدفوعة', 'متأخرة'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg transition ${
              filter === status
                ? 'bg-[#d4af37] text-[#1e3a5f]'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* نموذج الفاتورة */}
      {showForm && (
        <div className="gov-card rounded-2xl p-6 bg-blue-50">
          <h3 className="text-lg font-bold text-[#1e3a5f] mb-4">فاتورة جديدة</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="رقم الفاتورة"
              value={formData.invoiceNumber}
              onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
              className="border rounded-lg px-3 py-2"
            />
            <select
              value={formData.clientId}
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              className="border rounded-lg px-3 py-2"
            >
              <option value="">اختر العميل</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="border rounded-lg px-3 py-2"
            />
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="border rounded-lg px-3 py-2"
            />
          </div>

          <div className="mb-4">
            <h4 className="font-bold mb-2">البنود</h4>
            {formData.items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-4 gap-2 mb-2">
                <input type="text" placeholder="الوصف" value={item.description} className="border rounded px-2 py-1" />
                <input type="number" placeholder="الكمية" value={item.quantity} className="border rounded px-2 py-1" />
                <input type="number" placeholder="السعر" value={item.unitPrice} className="border rounded px-2 py-1" />
                <span className="text-right py-1">{(item.quantity * item.unitPrice).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAddInvoice}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              حفظ الفاتورة
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* قائمة الفواتير */}
      <div className="grid gap-4">
        {filteredInvoices.length === 0 ? (
          <div className="text-center py-8 text-gray-500">لا توجد فواتير</div>
        ) : (
          filteredInvoices.map(invoice => (
            <div key={invoice.id} className="gov-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-[#1e3a5f]">
                    الفاتورة #{invoice.invoiceNumber}
                  </h3>
                  <p className="text-sm text-gray-600">{invoice.clientName}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                  invoice.status === 'مدفوعة' ? 'bg-green-100 text-green-700' :
                  invoice.status === 'مرسلة' ? 'bg-blue-100 text-blue-700' :
                  invoice.status === 'متأخرة' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {invoice.status}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-600">المجموع</p>
                  <p className="font-bold">{invoice.totalAmount.toLocaleString()} ج.م</p>
                </div>
                <div>
                  <p className="text-gray-600">مدفوع</p>
                  <p className="font-bold text-green-600">{invoice.paidAmount.toLocaleString()} ج.م</p>
                </div>
                <div>
                  <p className="text-gray-600">المتبقي</p>
                  <p className="font-bold text-red-600">{(invoice.totalAmount - invoice.paidAmount).toLocaleString()} ج.م</p>
                </div>
                <div>
                  <p className="text-gray-600">التاريخ</p>
                  <p className="font-bold">{invoice.date}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                  <Eye size={16} />
                </button>
                <button className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200">
                  <Printer size={16} />
                </button>
                <button className="p-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200">
                  <Download size={16} />
                </button>
                <button
                  onClick={() => deleteInvoice(invoice.id)}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
