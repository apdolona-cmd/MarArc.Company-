import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Plus, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function Attendance() {
  const { employees, attendanceRecords, addAttendanceRecord, deleteAttendanceRecord } = useStore();
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    checkIn: '',
    checkOut: '',
    status: 'حاضر',
    notes: ''
  });

  const handleAddAttendance = () => {
    addAttendanceRecord({
      employeeId: formData.employeeId,
      employeeName: employees.find(e => e.id === formData.employeeId)?.name || '',
      date: formData.date,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      status: formData.status as any,
      notes: formData.notes
    });
    setShowForm(false);
    setFormData({
      employeeId: '',
      date: new Date().toISOString().split('T')[0],
      checkIn: '',
      checkOut: '',
      status: 'حاضر',
      notes: ''
    });
  };

  const recordsByDate = new Map();
  attendanceRecords.forEach(record => {
    if (!recordsByDate.has(record.date)) {
      recordsByDate.set(record.date, []);
    }
    recordsByDate.get(record.date).push(record);
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#1e3a5f] flex items-center gap-2">
          <span>⏰</span> الحضور والغياب
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-[#1e3a5f] to-[#0f2540] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:shadow-lg transition"
        >
          <Plus size={20} /> تسجيل حضور
        </button>
      </div>

      {/* نموذج التسجيل */}
      {showForm && (
        <div className="gov-card rounded-2xl p-6 bg-blue-50">
          <h3 className="text-lg font-bold text-[#1e3a5f] mb-4">تسجيل الحضور</h3>
          
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
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="border rounded-lg px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <input
              type="time"
              value={formData.checkIn}
              onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
              placeholder="وقت الدخول"
              className="border rounded-lg px-3 py-2"
            />
            <input
              type="time"
              value={formData.checkOut}
              onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
              placeholder="وقت الخروج"
              className="border rounded-lg px-3 py-2"
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="border rounded-lg px-3 py-2"
            >
              <option value="حاضر">حاضر</option>
              <option value="غياب">غياب</option>
              <option value="متأخر">متأخر</option>
              <option value="إجازة">إجازة</option>
            </select>
          </div>

          <textarea
            placeholder="ملاحظات"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="border rounded-lg px-3 py-2 w-full mb-4"
            rows={2}
          />

          <div className="flex gap-2">
            <button onClick={handleAddAttendance} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
              حفظ
            </button>
            <button onClick={() => setShowForm(false)} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500">
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* السجل */}
      <div className="space-y-4">
        {Array.from(recordsByDate.entries()).reverse().map(([date, records]) => (
          <div key={date} className="gov-card rounded-xl p-4">
            <h3 className="font-bold text-[#1e3a5f] mb-3">{date}</h3>
            <div className="space-y-2">
              {(records as any[]).map(record => (
                <div key={record.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex-1">
                    <p className="font-bold text-sm">{record.employeeName}</p>
                    <p className="text-xs text-gray-600">
                      {record.checkIn && `دخول: ${record.checkIn}`}
                      {record.checkOut && ` - خروج: ${record.checkOut}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      record.status === 'حاضر' ? 'bg-green-100 text-green-700' :
                      record.status === 'غياب' ? 'bg-red-100 text-red-700' :
                      record.status === 'متأخر' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {record.status}
                    </span>
                    <button
                      onClick={() => deleteAttendanceRecord(record.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
