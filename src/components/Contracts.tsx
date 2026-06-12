import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Plus, Trash2, FileText, Calendar } from 'lucide-react';

export default function Contracts() {
  const { contracts, addContract, updateContract, deleteContract, currentUser } = useStore();
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    contractNumber: '',
    contractType: 'عميل' as const,
    clientName: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    value: 0,
    status: 'نشط' as const,
    autoRenew: false,
    notes: ''
  });

  const handleAddContract = () => {
    addContract({
      contractNumber: formData.contractNumber,
      contractType: formData.contractType,
      clientName: formData.clientName,
      startDate: formData.startDate,
      endDate: formData.endDate,
      value: formData.value,
      status: formData.status,
      createdDate: new Date().toISOString().split('T')[0],
      filePath: '/contracts/' + formData.contractNumber,
      autoRenew: formData.autoRenew,
      notes: formData.notes
    });
    setShowForm(false);
    setFormData({
      contractNumber: '',
      contractType: 'عميل',
      clientName: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      value: 0,
      status: 'نشط',
      autoRenew: false,
      notes: ''
    });
  };

  const getContractTypeColor = (type: string) => {
    switch (type) {
      case 'عميل': return 'bg-blue-100 text-blue-700';
      case 'موظف': return 'bg-green-100 text-green-700';
      case 'مقاول': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'نشط': return 'bg-green-100 text-green-700';
      case 'منتهي': return 'bg-red-100 text-red-700';
      case 'معلق': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#1e3a5f] flex items-center gap-2">
          <FileText size={28} /> العقود والمستندات
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-[#1e3a5f] to-[#0f2540] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:shadow-lg transition"
        >
          <Plus size={20} /> عقد جديد
        </button>
      </div>

      {/* نموذج العقد */}
      {showForm && (
        <div className="gov-card rounded-2xl p-6 bg-blue-50">
          <h3 className="text-lg font-bold text-[#1e3a5f] mb-4">عقد جديد</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="رقم العقد"
              value={formData.contractNumber}
              onChange={(e) => setFormData({ ...formData, contractNumber: e.target.value })}
              className="border rounded-lg px-3 py-2"
            />
            <select
              value={formData.contractType}
              onChange={(e) => setFormData({ ...formData, contractType: e.target.value as any })}
              className="border rounded-lg px-3 py-2"
            >
              <option value="عميل">عقد عميل</option>
              <option value="موظف">عقد موظف</option>
              <option value="مقاول">عقد مقاول</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="اسم الطرف الثاني"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              className="border rounded-lg px-3 py-2"
            />
            <input
              type="number"
              placeholder="قيمة العقد"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
              className="border rounded-lg px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="border rounded-lg px-3 py-2"
            />
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="border rounded-lg px-3 py-2"
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="border rounded-lg px-3 py-2"
            >
              <option value="نشط">نشط</option>
              <option value="منتهي">منتهي</option>
              <option value="معلق">معلق</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.autoRenew}
                onChange={(e) => setFormData({ ...formData, autoRenew: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm">تجديد تلقائي</span>
            </label>
          </div>

          <textarea
            placeholder="ملاحظات"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="border rounded-lg px-3 py-2 w-full mb-4"
            rows={3}
          />

          <div className="flex gap-2">
            <button onClick={handleAddContract} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
              حفظ
            </button>
            <button onClick={() => setShowForm(false)} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500">
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* قائمة العقود */}
      <div className="grid gap-4">
        {contracts.length === 0 ? (
          <div className="text-center py-12 text-gray-500 gov-card rounded-2xl">
            لا توجد عقود حالياً
          </div>
        ) : (
          contracts.map(contract => {
            const daysLeft = Math.ceil((new Date(contract.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            
            return (
              <div key={contract.id} className="gov-card rounded-xl p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">رقم العقد</p>
                    <p className="font-bold text-[#1e3a5f]">{contract.contractNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">النوع</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${getContractTypeColor(contract.contractType)}`}>
                      {contract.contractType}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">الحالة</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${getStatusColor(contract.status)}`}>
                      {contract.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">القيمة</p>
                    <p className="font-bold text-green-600">{contract.value.toLocaleString()} ج.م</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 pb-4 border-b">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-600">من</p>
                      <p className="text-sm font-bold">{contract.startDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-red-600" />
                    <div>
                      <p className="text-xs text-gray-600">إلى</p>
                      <p className="text-sm font-bold">{contract.endDate}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">الجهة</p>
                    <p className="text-sm font-bold">{contract.clientName}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  {daysLeft > 0 && (
                    <div className={`text-xs font-bold px-2 py-1 rounded ${
                      daysLeft < 30 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {daysLeft} يوم متبقي
                    </div>
                  )}
                  {contract.autoRenew && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">تجديد تلقائي ✓</span>
                  )}
                  <button
                    onClick={() => deleteContract(contract.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
