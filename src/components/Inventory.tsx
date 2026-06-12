import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';

export default function Inventory() {
  const { inventoryStocks, addInventoryStock, updateInventoryStock, deleteInventoryStock, addStockMovement } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('stocks');

  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    unit: '',
    quantity: 0,
    minStock: 0,
    maxStock: 0,
    unitCost: 0,
    supplier: '',
    location: '',
    notes: ''
  });

  const handleAddStock = () => {
    const totalCost = formData.quantity * formData.unitCost;
    addInventoryStock({
      itemName: formData.itemName,
      category: formData.category,
      unit: formData.unit,
      quantity: formData.quantity,
      minStock: formData.minStock,
      maxStock: formData.maxStock,
      unitCost: formData.unitCost,
      totalCost,
      supplier: formData.supplier,
      lastRestockDate: new Date().toISOString().split('T')[0],
      location: formData.location,
      notes: formData.notes
    });
    setShowForm(false);
    setFormData({
      itemName: '',
      category: '',
      unit: '',
      quantity: 0,
      minStock: 0,
      maxStock: 0,
      unitCost: 0,
      supplier: '',
      location: '',
      notes: ''
    });
  };

  const lowStockItems = inventoryStocks.filter(s => s.quantity <= s.minStock);
  const totalValue = inventoryStocks.reduce((sum, s) => sum + s.totalCost, 0);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#1e3a5f] flex items-center gap-2">
          <span>📦</span> إدارة المخزون والموارد
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-[#1e3a5f] to-[#0f2540] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:shadow-lg transition"
        >
          <Plus size={20} /> صنف جديد
        </button>
      </div>

      {/* إحصائيات */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="gov-card rounded-xl p-4 bg-gradient-to-br from-blue-50 to-blue-100">
          <p className="text-sm text-gray-600">إجمالي الأصناف</p>
          <p className="text-3xl font-bold text-blue-600">{inventoryStocks.length}</p>
        </div>
        <div className="gov-card rounded-xl p-4 bg-gradient-to-br from-green-50 to-green-100">
          <p className="text-sm text-gray-600">القيمة الإجمالية</p>
          <p className="text-2xl font-bold text-green-600">{totalValue.toLocaleString()} ج.م</p>
        </div>
        <div className="gov-card rounded-xl p-4 bg-gradient-to-br from-red-50 to-red-100">
          <p className="text-sm text-gray-600">أصناف ناقصة</p>
          <p className="text-3xl font-bold text-red-600">{lowStockItems.length}</p>
        </div>
      </div>

      {/* تنبيهات المخزون */}
      {lowStockItems.length > 0 && (
        <div className="gov-card rounded-xl p-4 bg-yellow-50 border-l-4 border-yellow-400">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-bold text-yellow-800 mb-2">تنبيهات المخزون</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                {lowStockItems.map(item => (
                  <li key={item.id}>
                    {item.itemName}: {item.quantity} (الحد الأدنى: {item.minStock})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* نموذج إضافة صنف */}
      {showForm && (
        <div className="gov-card rounded-2xl p-6 bg-blue-50">
          <h3 className="text-lg font-bold text-[#1e3a5f] mb-4">صنف مخزون جديد</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="اسم الصنف"
              value={formData.itemName}
              onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
              className="border rounded-lg px-3 py-2"
            />
            <input
              type="text"
              placeholder="الفئة (مثل: رخام، أدوات)"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="border rounded-lg px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-4 gap-4 mb-4">
            <input type="text" placeholder="الوحدة (متر، متر مكعب)" value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input type="number" placeholder="الكمية" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })} className="border rounded-lg px-3 py-2" />
            <input type="number" placeholder="السعر/الوحدة" value={formData.unitCost} onChange={(e) => setFormData({ ...formData, unitCost: parseFloat(e.target.value) })} className="border rounded-lg px-3 py-2" />
            <input type="text" placeholder="المورد" value={formData.supplier} onChange={(e) => setFormData({ ...formData, supplier: e.target.value })} className="border rounded-lg px-3 py-2" />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <input type="number" placeholder="الحد الأدنى" value={formData.minStock} onChange={(e) => setFormData({ ...formData, minStock: parseFloat(e.target.value) })} className="border rounded-lg px-3 py-2" />
            <input type="number" placeholder="الحد الأقصى" value={formData.maxStock} onChange={(e) => setFormData({ ...formData, maxStock: parseFloat(e.target.value) })} className="border rounded-lg px-3 py-2" />
            <input type="text" placeholder="الموقع في المخزن" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="border rounded-lg px-3 py-2" />
          </div>

          <textarea placeholder="ملاحظات" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="border rounded-lg px-3 py-2 w-full mb-4" rows={2} />

          <div className="flex gap-2">
            <button onClick={handleAddStock} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
              حفظ
            </button>
            <button onClick={() => setShowForm(false)} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500">
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* قائمة الأصناف */}
      <div className="space-y-3">
        {inventoryStocks.length === 0 ? (
          <div className="text-center py-12 text-gray-500 gov-card rounded-2xl">
            لا توجد أصناف في المخزون
          </div>
        ) : (
          inventoryStocks.map(stock => (
            <div key={stock.id} className="gov-card rounded-xl p-4 border-r-4" style={{ borderRightColor: stock.quantity <= stock.minStock ? '#ef4444' : '#10b981' }}>
              <div className="grid grid-cols-5 gap-4 items-center">
                <div>
                  <h3 className="font-bold text-[#1e3a5f]">{stock.itemName}</h3>
                  <p className="text-xs text-gray-600">{stock.category}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">الكمية</p>
                  <p className={`text-lg font-bold ${stock.quantity <= stock.minStock ? 'text-red-600' : 'text-green-600'}`}>
                    {stock.quantity} {stock.unit}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">السعر</p>
                  <p className="font-bold">{(stock.unitCost * stock.quantity).toLocaleString()} ج.م</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">الموقع</p>
                  <p className="font-bold text-sm">{stock.location}</p>
                </div>
                <div className="text-center">
                  <button
                    onClick={() => deleteInventoryStock(stock.id)}
                    className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
