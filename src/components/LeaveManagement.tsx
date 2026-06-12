import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Plus, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function LeaveManagement() {
  const { employees, leaveRequests, addLeaveRequest, approveLeaveRequest, rejectLeaveRequest, currentUser } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('معلقة');

  const [formData, setFormData] = useState({
    employeeId: '',
    leaveType: 'عارضة' as const,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    reason: ''
  });

  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 0;
    const diffTime = Math.abs(new Date(end).getTime() - new Date(start).getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleAddRequest = () => {
    const daysCount = calculateDays(formData.startDate, formData.endDate);
    
    addLeaveRequest({
      employeeId: formData.employeeId,
      employeeName: employees.find(e => e.id === formData.employeeId)?.name || '',
      leaveType: formData.leaveType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      daysCount,
      reason: formData.reason,
      status: 'معلقة'
    });

    setShowForm(false);
    setFormData({
      employeeId: '',
      leaveType: 'عارضة',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      reason: ''
    });
  };

  const filteredRequests = filter === 'الكل'
    ? leaveRequests
    : leaveRequests.filter(r => r.status === filter);

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'عارضة': return 'bg-blue-100 text-blue-700';
      case 'سنوية': return 'bg-green-100 text-green-700';
      case 'مرضية': return 'bg-red-100 text-red-700';
      case 'بدون راتب': return 'bg-gray-100 text-gray-700';
      default: return 'bg-purple-100 text-purple-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'موافق عليها': return <CheckCircle className="text-green-600" />;
      case 'مرفوضة': return <XCircle className="text-red-600" />;
      case 'معلقة': return <Clock className="text-yellow-600" />;
      default: return <Clock className="text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#1e3a5f] flex items-center gap-2">
          <span>🏖️</span> طلبات الإجازة
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-[#1e3a5f] to-[#0f2540] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:shadow-lg transition"
        >
          <Plus size={20} /> طلب إجازة جديد
        </button>
      </div>

      {/* نموذج الطلب */}
      {showForm && (
        <div className="gov-card rounded-2xl p-6 bg-blue-50">
          <h3 className="text-lg font-bold text-[#1e3a5f] mb-4">طلب إجازة جديد</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <select
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              className="border rounded-lg px-3 py-2"
            >
              <option value="">اختر الموظف</option>
              {employees.map(e => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
            <select
              value={formData.leaveType}
              onChange={(e) => setFormData({ ...formData, leaveType: e.target.value as any })}
              className="border rounded-lg px-3 py-2"
            >
              <option value="عارضة">إجازة عارضة</option>
              <option value="سنوية">إجازة سنوية</option>
              <option value="مرضية">إجازة مرضية</option>
              <option value="بدون راتب">بدون راتب</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-bold">تاريخ البداية</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="border rounded-lg px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="text-sm font-bold">تاريخ النهاية</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="border rounded-lg px-3 py-2 w-full"
              />
            </div>
          </div>

          {formData.startDate && formData.endDate && (
            <div className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg mb-4">
              <strong>عدد الأيام:</strong> {calculateDays(formData.startDate, formData.endDate)} يوم
            </div>
          )}

          <textarea
            placeholder="سبب الإجازة"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            className="border rounded-lg px-3 py-2 w-full mb-4"
            rows={3}
          />

          <div className="flex gap-2">
            <button onClick={handleAddRequest} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
              إرسال الطلب
            </button>
            <button onClick={() => setShowForm(false)} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500">
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* الفلاتر */}
      <div className="flex gap-2">
        {['الكل', 'معلقة', 'موافق عليها', 'مرفوضة'].map(status => (
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

      {/* قائمة الطلبات */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12 text-gray-500 gov-card rounded-2xl">
            لا توجد طلبات {filter !== 'الكل' ? filter : ''}
          </div>
        ) : (
          filteredRequests.map(request => (
            <div key={request.id} className="gov-card rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(request.status)}
                    <h3 className="text-lg font-bold text-[#1e3a5f]">{request.employeeName}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{request.reason}</p>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-bold ${getLeaveTypeColor(request.leaveType)}`}>
                  {request.leaveType}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-4 pb-4 border-b">
                <div className="text-center">
                  <p className="text-xs text-gray-600">من</p>
                  <p className="font-bold">{request.startDate}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">إلى</p>
                  <p className="font-bold">{request.endDate}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">الأيام</p>
                  <p className="font-bold text-blue-600">{request.daysCount} أيام</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">الحالة</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                    request.status === 'موافق عليها' ? 'bg-green-100 text-green-700' :
                    request.status === 'مرفوضة' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {request.status}
                  </span>
                </div>
              </div>

              {request.approvalDate && (
                <p className="text-xs text-gray-600">
                  تم الرد بواسطة: {request.approvedBy} - {request.approvalDate}
                </p>
              )}

              {/* أزرار الموافقة/الرفض (للـ HR فقط) */}
              {request.status === 'معلقة' && currentUser?.isManager && (
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <button
                    onClick={() => approveLeaveRequest(request.id, currentUser.name)}
                    className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={16} /> الموافقة
                  </button>
                  <button
                    onClick={() => rejectLeaveRequest(request.id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 flex items-center justify-center gap-2"
                  >
                    <XCircle size={16} /> الرفض
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
