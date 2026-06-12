import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Plus, Send, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Communications() {
  const { employees, clients, communications, sendCommunication, currentUser } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('الكل');

  const [formData, setFormData] = useState({
    type: 'email' as const,
    recipientType: 'employee' as const,
    recipientId: '',
    subject: '',
    message: '',
    schedule: false,
    scheduledTime: ''
  });

  const handleSendCommunication = () => {
    const recipient = formData.recipientType === 'employee'
      ? employees.find(e => e.id === formData.recipientId)
      : clients.find(c => c.id === formData.recipientId);

    if (formData.schedule && formData.scheduledTime) {
      // في الإنتاج، يجب استخدام نظام قائمة الانتظار (Queue)
      sendCommunication({
        type: formData.type,
        recipient: recipient?.id || '',
        recipientName: recipient?.name || '',
        subject: formData.subject,
        message: formData.message,
        status: 'معلق',
        scheduledTime: formData.scheduledTime
      });
    } else {
      sendCommunication({
        type: formData.type,
        recipient: recipient?.id || '',
        recipientName: recipient?.name || '',
        subject: formData.subject,
        message: formData.message,
        status: 'مرسل'
      });
    }

    setShowForm(false);
    setFormData({
      type: 'email',
      recipientType: 'employee',
      recipientId: '',
      subject: '',
      message: '',
      schedule: false,
      scheduledTime: ''
    });
  };

  const filteredCommunications = filter === 'الكل'
    ? communications
    : communications.filter(c => c.status === filter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'مرسل': return <CheckCircle2 className="text-green-600" />;
      case 'معلق': return <Clock className="text-yellow-600" />;
      case 'فشل': return <AlertCircle className="text-red-600" />;
      default: return <AlertCircle className="text-gray-600" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return '📧';
      case 'SMS': return '💬';
      case 'whatsapp': return '💬';
      default: return '📬';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#1e3a5f] flex items-center gap-2">
          <span>📬</span> الاتصالات والإشعارات
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-[#1e3a5f] to-[#0f2540] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:shadow-lg transition"
        >
          <Plus size={20} /> اتصال جديد
        </button>
      </div>

      {/* نموذج الاتصال */}
      {showForm && (
        <div className="gov-card rounded-2xl p-6 bg-blue-50">
          <h3 className="text-lg font-bold text-[#1e3a5f] mb-4">إرسال اتصال</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-bold mb-1 block">نوع الاتصال</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="border rounded-lg px-3 py-2 w-full"
              >
                <option value="email">البريد الإلكتروني</option>
                <option value="SMS">رسالة نصية SMS</option>
                <option value="whatsapp">واتس أب</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-bold mb-1 block">الجهة المستقبلة</label>
              <select
                value={formData.recipientType}
                onChange={(e) => setFormData({ ...formData, recipientType: e.target.value as any, recipientId: '' })}
                className="border rounded-lg px-3 py-2 w-full"
              >
                <option value="employee">موظف</option>
                <option value="client">عميل</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm font-bold mb-1 block">المستقبل</label>
            <select
              value={formData.recipientId}
              onChange={(e) => setFormData({ ...formData, recipientId: e.target.value })}
              className="border rounded-lg px-3 py-2 w-full"
            >
              <option value="">اختر المستقبل</option>
              {formData.recipientType === 'employee' ? (
                employees.map(e => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))
              ) : (
                clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))
              )}
            </select>
          </div>

          <input
            type="text"
            placeholder="الموضوع"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="border rounded-lg px-3 py-2 w-full mb-4"
          />

          <textarea
            placeholder="الرسالة"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="border rounded-lg px-3 py-2 w-full mb-4"
            rows={4}
          />

          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm font-bold">جدولة الإرسال</span>
            </label>

            {formData.schedule && (
              <input
                type="datetime-local"
                value={formData.scheduledTime}
                onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                className="border rounded-lg px-3 py-2 w-full mt-2"
              />
            )}
          </div>

          <div className="flex gap-2">
            <button onClick={handleSendCommunication} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2">
              <Send size={16} /> إرسال
            </button>
            <button onClick={() => setShowForm(false)} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500">
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* الفلاتر */}
      <div className="flex gap-2">
        {['الكل', 'مرسل', 'معلق', 'فشل'].map(status => (
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

      {/* قائمة الاتصالات */}
      <div className="space-y-3">
        {filteredCommunications.length === 0 ? (
          <div className="text-center py-12 text-gray-500 gov-card rounded-2xl">
            لا توجد اتصالات {filter !== 'الكل' ? filter : ''}
          </div>
        ) : (
          filteredCommunications.reverse().map(comm => (
            <div key={comm.id} className="gov-card rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{getTypeIcon(comm.type)}</span>
                    <div>
                      <h3 className="font-bold text-[#1e3a5f]">{comm.recipientName}</h3>
                      <p className="text-xs text-gray-600">{comm.subject}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">{comm.message}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1">
                    {getStatusIcon(comm.status)}
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      comm.status === 'مرسل' ? 'bg-green-100 text-green-700' :
                      comm.status === 'معلق' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {comm.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{new Date(comm.date).toLocaleString('ar-EG')}</p>
                  {comm.scheduledTime && (
                    <p className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      جدول: {comm.scheduledTime}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
