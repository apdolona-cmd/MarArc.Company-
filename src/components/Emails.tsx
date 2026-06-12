import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Mail, Send, Inbox, FileText, Trash2, X, Plus, Star, Clock, AlertTriangle, ExternalLink, Users, UserCheck } from 'lucide-react';

type EmailTab = 'received' | 'sent' | 'draft';
type RecipientType = 'custom' | 'employee' | 'client';

export default function Emails() {
  const store = useStore();
  const { addEmail, markEmailRead, deleteEmail, sendRealEmail, companySettings } = store;
  const emails = (Array.isArray(store.emails) ? store.emails : Object.values(store.emails || {})) as any[];
  const employees = (Array.isArray(store.employees) ? store.employees : Object.values(store.employees || {})) as any[];
  const clients = (Array.isArray(store.clients) ? store.clients : Object.values(store.clients || {})) as any[];
  const [activeTab, setActiveTab] = useState<EmailTab>('received');
  const [showCompose, setShowCompose] = useState(false);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [recipientType, setRecipientType] = useState<RecipientType>('custom');
  const [composeForm, setComposeForm] = useState({ 
    to: '', 
    toName: '', 
    subject: '', 
    body: '',
    priority: 'عادي' as 'عادي' | 'مهم' | 'عاجل'
  });

  const filteredEmails = emails.filter(e => e.type === activeTab);
  const unreadCount = emails.filter(e => e.type === 'received' && !e.read).length;
  const viewingEmail = viewingId ? emails.find(e => e.id === viewingId) : null;

  const handleSend = () => {
    if (!composeForm.to || !composeForm.subject) return;
    sendRealEmail(composeForm.to, composeForm.toName || composeForm.to, composeForm.subject, composeForm.body, composeForm.priority);
    setComposeForm({ to: '', toName: '', subject: '', body: '', priority: 'عادي' });
    setShowCompose(false);
  };

  const handleSaveDraft = () => {
    addEmail({
      from: companySettings.email,
      fromName: companySettings.name,
      to: composeForm.to,
      toName: composeForm.toName || 'غير محدد',
      subject: composeForm.subject || '(بدون عنوان)',
      body: composeForm.body,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      read: true,
      type: 'draft',
      priority: composeForm.priority
    });
    setComposeForm({ to: '', toName: '', subject: '', body: '', priority: 'عادي' });
    setShowCompose(false);
  };

  const selectRecipient = (email: string, name: string) => {
    setComposeForm({ ...composeForm, to: email, toName: name });
  };

  const openEmail = (id: string) => {
    markEmailRead(id);
    setViewingId(id);
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'عاجل': return 'bg-red-100 text-red-700 border-red-200';
      case 'مهم': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch(priority) {
      case 'عاجل': return <AlertTriangle size={14} className="text-red-500" />;
      case 'مهم': return <Star size={14} className="text-amber-500" />;
      default: return <Clock size={14} className="text-gray-400" />;
    }
  };

  const tabs = [
    { id: 'received' as EmailTab, label: 'الوارد', icon: Inbox, count: unreadCount },
    { id: 'sent' as EmailTab, label: 'المرسل', icon: Send, count: 0 },
    { id: 'draft' as EmailTab, label: 'المسودات', icon: FileText, count: 0 },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="gov-card rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl luxury-gradient flex items-center justify-center">
              <Mail size={28} className="text-[#d4af37]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#1e3a5f]">البريد الإلكتروني الرسمي</h2>
              <p className="text-gray-500 text-sm">{companySettings.email}</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button type="button" onClick={() => setShowCompose(true)}
              className="gov-button flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold cursor-pointer">
              <Plus size={18} /> رسالة جديدة
            </button>
            <a href={`https://mail.google.com/mail/u/0/#inbox`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-all cursor-pointer">
              <ExternalLink size={16} /> فتح صندوق الوارد Gmail
            </a>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white p-2 rounded-xl shadow-lg border-t-4 border-[#d4af37]">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id 
                  ? 'luxury-gradient text-[#d4af37] shadow-lg' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}>
              <Icon size={20} />
              {tab.label}
              {tab.count > 0 && (
                <span className="bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-bold">{tab.count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Email List */}
      <div className="gov-card rounded-2xl overflow-hidden">
        {filteredEmails.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Mail size={40} className="text-gray-300" />
            </div>
            <p className="text-lg font-medium">لا توجد رسائل</p>
            <p className="text-sm mt-2">صندوق البريد فارغ</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredEmails.map(email => (
              <div key={email.id}
                className={`flex items-center justify-between p-5 hover:bg-gradient-to-l hover:from-[#d4af37]/5 hover:to-transparent cursor-pointer transition-all ${!email.read ? 'bg-blue-50/50 border-r-4 border-[#1e3a5f]' : ''}`}
                onClick={() => openEmail(email.id)}>
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg ${!email.read ? 'luxury-gradient' : 'bg-gray-400'}`}>
                    {(activeTab === 'received' ? email.fromName : email.toName).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <p className={`text-sm ${!email.read ? 'font-bold text-[#1e3a5f]' : 'font-medium text-gray-700'}`}>
                        {activeTab === 'received' ? email.fromName : email.toName}
                      </p>
                      {getPriorityIcon(email.priority)}
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(email.priority)}`}>
                        {email.priority}
                      </span>
                      {!email.read && <span className="w-2.5 h-2.5 bg-[#1e3a5f] rounded-full" />}
                    </div>
                    <p className={`text-sm truncate ${!email.read ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>{email.subject}</p>
                    <p className="text-xs text-gray-400 truncate mt-1">{email.body.substring(0, 80)}...</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mr-4">
                  <div className="text-left">
                    <p className="text-xs text-gray-400">{email.date}</p>
                    <p className="text-xs text-gray-400">{email.time}</p>
                  </div>
                  <button onClick={e => { e.stopPropagation(); deleteEmail(email.id); }}
                    className="p-2.5 text-red-400 hover:bg-red-50 rounded-xl transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Email Modal */}
      {viewingEmail && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setViewingId(null)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl border-t-4 border-[#d4af37]" onClick={e => e.stopPropagation()}>
            <div className="luxury-gradient p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {getPriorityIcon(viewingEmail.priority)}
                    <span className="text-xs px-2 py-0.5 rounded bg-white/20">{viewingEmail.priority}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#d4af37]">{viewingEmail.subject}</h3>
                </div>
                <button onClick={() => setViewingId(null)} className="text-white/70 hover:text-white">
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">من:</span> <span className="font-medium mr-2">{viewingEmail.fromName}</span><span className="text-gray-400">({viewingEmail.from})</span></div>
                <div><span className="text-gray-500">إلى:</span> <span className="font-medium mr-2">{viewingEmail.toName}</span><span className="text-gray-400">({viewingEmail.to})</span></div>
                <div><span className="text-gray-500">التاريخ:</span> <span className="font-medium mr-2">{viewingEmail.date}</span></div>
                <div><span className="text-gray-500">الوقت:</span> <span className="font-medium mr-2">{viewingEmail.time}</span></div>
              </div>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="bg-gray-50 rounded-xl p-6 text-gray-700 leading-relaxed whitespace-pre-wrap border border-gray-100">
                {viewingEmail.body}
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button onClick={() => setViewingId(null)} className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors">
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowCompose(false)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl border-t-4 border-[#d4af37]" onClick={e => e.stopPropagation()}>
            <div className="luxury-gradient p-6 text-white">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Send size={24} className="text-[#d4af37]" />
                  <h3 className="text-xl font-bold">رسالة رسمية جديدة</h3>
                </div>
                <button onClick={() => setShowCompose(false)} className="text-white/70 hover:text-white">
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-5 overflow-y-auto max-h-[60vh]">
              {/* Recipient Type */}
              <div>
                <label className="block text-sm font-bold text-[#1e3a5f] mb-2">اختر نوع المستلم</label>
                <div className="flex gap-2">
                  <button onClick={() => setRecipientType('custom')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${recipientType === 'custom' ? 'luxury-gradient text-[#d4af37]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    <Mail size={18} /> بريد مخصص
                  </button>
                  <button onClick={() => setRecipientType('employee')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${recipientType === 'employee' ? 'luxury-gradient text-[#d4af37]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    <Users size={18} /> موظف
                  </button>
                  <button onClick={() => setRecipientType('client')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${recipientType === 'client' ? 'luxury-gradient text-[#d4af37]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    <UserCheck size={18} /> عميل
                  </button>
                </div>
              </div>

              {/* Recipient Selection */}
              {recipientType === 'employee' && (
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto bg-gray-50 p-3 rounded-xl">
                  {employees.filter(e => e.status === 'نشط').map(emp => (
                    <button key={emp.id} onClick={() => selectRecipient(emp.email, emp.name)}
                      className={`p-3 rounded-lg text-right text-sm transition-all ${composeForm.to === emp.email ? 'bg-[#1e3a5f] text-white' : 'bg-white hover:bg-[#d4af37]/10 border border-gray-200'}`}>
                      <p className="font-medium">{emp.name}</p>
                      <p className="text-xs opacity-70">{emp.email}</p>
                    </button>
                  ))}
                </div>
              )}

              {recipientType === 'client' && (
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto bg-gray-50 p-3 rounded-xl">
                  {clients.map(client => (
                    <button key={client.id} onClick={() => selectRecipient(client.email, client.name)}
                      className={`p-3 rounded-lg text-right text-sm transition-all ${composeForm.to === client.email ? 'bg-[#1e3a5f] text-white' : 'bg-white hover:bg-[#d4af37]/10 border border-gray-200'}`}>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-xs opacity-70">{client.email}</p>
                    </button>
                  ))}
                </div>
              )}

              {recipientType === 'custom' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#1e3a5f] mb-2">البريد الإلكتروني *</label>
                    <input type="email" value={composeForm.to} onChange={e => setComposeForm({...composeForm, to: e.target.value})}
                      placeholder="example@email.com"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#d4af37] text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#1e3a5f] mb-2">اسم المستلم</label>
                    <input type="text" value={composeForm.toName} onChange={e => setComposeForm({...composeForm, toName: e.target.value})}
                      placeholder="اسم المستلم"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#d4af37] text-sm" />
                  </div>
                </div>
              )}

              {/* Selected Recipient Display */}
              {composeForm.to && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
                      {(composeForm.toName || composeForm.to).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-800">{composeForm.toName || 'مستلم'}</p>
                      <p className="text-xs text-green-600">{composeForm.to}</p>
                    </div>
                  </div>
                  <button onClick={() => setComposeForm({...composeForm, to: '', toName: ''})} className="text-green-600 hover:text-green-800">
                    <X size={18} />
                  </button>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-[#1e3a5f] mb-2">الموضوع *</label>
                  <input type="text" value={composeForm.subject} onChange={e => setComposeForm({...composeForm, subject: e.target.value})}
                    placeholder="موضوع الرسالة"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#d4af37] text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1e3a5f] mb-2">الأولوية</label>
                  <select value={composeForm.priority} onChange={e => setComposeForm({...composeForm, priority: e.target.value as 'عادي' | 'مهم' | 'عاجل'})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#d4af37] text-sm">
                    <option value="عادي">عادي</option>
                    <option value="مهم">مهم</option>
                    <option value="عاجل">عاجل</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1e3a5f] mb-2">نص الرسالة</label>
                <textarea value={composeForm.body} onChange={e => setComposeForm({...composeForm, body: e.target.value})}
                  rows={8} placeholder="اكتب رسالتك هنا..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#d4af37] text-sm resize-none" />
              </div>

              {/* Company Footer Preview */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-xs text-gray-500 mb-2">سيتم إضافة توقيع الشركة تلقائياً:</p>
                <div className="text-xs text-gray-600 leading-relaxed">
                  <p className="font-bold">{companySettings.name}</p>
                  <p>{companySettings.slogan}</p>
                  <p>{companySettings.email} | {companySettings.phone}</p>
                </div>
              </div>

              {/* Gmail Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Mail size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-blue-800 font-bold text-sm">الإرسال عبر Gmail</p>
                  <p className="text-blue-600 text-xs mt-1">سيفتح Gmail مع الرسالة جاهزة - اضغط إرسال في Gmail فقط</p>
                  <p className="text-blue-500 text-xs mt-1">📧 من: {companySettings.email}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
              <button type="button" onClick={handleSend} disabled={!composeForm.to || !composeForm.subject}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg cursor-pointer bg-gradient-to-l from-red-600 to-red-700 text-white">
                <Send size={18} /> إرسال عبر Gmail <ExternalLink size={14} className="opacity-60" />
              </button>
              <button type="button" onClick={handleSaveDraft}
                className="flex items-center gap-2 px-6 py-3.5 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 cursor-pointer">
                <FileText size={18} /> حفظ كمسودة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
