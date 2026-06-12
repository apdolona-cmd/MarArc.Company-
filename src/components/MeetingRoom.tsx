import { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { Send, Crown, Trash2, Users, MessageCircle, Video, ExternalLink } from 'lucide-react';

export default function MeetingRoom() {
  const store = useStore();
  const currentUser = store.currentUser;
  const isManagerLoggedIn = store.isManagerLoggedIn;

  // تحويل البيانات لـ Array
  const rawMessages = store.chatMessages;
  const messages: any[] = !rawMessages ? [] : Array.isArray(rawMessages) ? rawMessages : Object.values(rawMessages);
  const rawEmployees = store.employees;
  const employees: any[] = !rawEmployees ? [] : Array.isArray(rawEmployees) ? rawEmployees : Object.values(rawEmployees);
  const activeEmployees = employees.filter((e: any) => e && e.status === 'نشط');

  const [text, setText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const doSend = () => {
    const msg = text.trim();
    if (!msg || !currentUser) return;
    store.sendChatMessage(msg);
    setText('');
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const isHR = currentUser?.isManager === true || currentUser?.rank === 'مدير عام';

  const getTime = (ts: string) => {
    try { return new Date(ts).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }); }
    catch { return ''; }
  };

  const getColor = (rank: string) => {
    const c: Record<string, string> = {
      'مدير عام': '#d4af37', 'مدير قسم': '#9333ea', 'مشرف': '#3b82f6',
      'مهندس أول': '#06b6d4', 'مهندس': '#14b8a6', 'فني أول': '#f97316',
      'فني': '#f59e0b', 'محاسب': '#22c55e', 'موظف استقبال': '#ec4899', 'عامل': '#6b7280',
    };
    return c[rank] || '#6b7280';
  };

  // رابط Jitsi Meet - غرفة خاصة بالشركة
  const companyName = store.companySettings?.nameEn || 'MarArc';
  const jitsiRoomUrl = `https://meet.jit.si/${companyName}-Meeting-Room`;

  if (!currentUser) return null;

  return (
    <div className="animate-fade-in-up" style={{ height: 'calc(100vh - 200px)' }}>
      {/* تنبيه Firebase Rules */}
      {isManagerLoggedIn && (
        <div className="mb-3 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
          <strong>⚠️ مهم لتشغيل الدردشة:</strong> افتح <a href="https://console.firebase.google.com/project/mararccompany-c9c39/database/mararccompany-c9c39-default-rtdb/rules" target="_blank" rel="noreferrer" className="underline font-bold text-amber-900">Firebase Console → Rules</a> وضع:
          <code className="block bg-amber-100 rounded p-1.5 mt-1 font-mono" dir="ltr">{`{"rules": {".read": true, ".write": true}}`}</code>
        </div>
      )}
      {/* زر المكالمة الصوتية/المرئية */}
      <div className="mb-4 bg-gradient-to-l from-blue-600 to-indigo-700 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-white">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <Video size={24} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg">اجتماع صوتي ومرئي</h3>
            <p className="text-white/70 text-xs">اضغط للانضمام لغرفة الاجتماع الصوتي المباشر - مجاني بدون تسجيل</p>
          </div>
        </div>
        <a href={jitsiRoomUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-8 py-3 bg-white text-indigo-700 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-all cursor-pointer shrink-0">
          <Video size={18} /> انضمام للمكالمة <ExternalLink size={14} />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4" style={{ height: 'calc(100% - 90px)' }}>
        {/* === الأعضاء === */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg border border-gray-200 border-t-4 border-t-[#d4af37] flex flex-col overflow-hidden">
          <div className="bg-gradient-to-l from-[#1e3a5f] to-[#0f2540] p-4 shrink-0">
            <h3 className="font-bold text-[#d4af37] flex items-center gap-2 text-sm">
              <Users size={16} /> الأعضاء ({activeEmployees.length})
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {activeEmployees.map((emp: any) => {
              if (!emp || !emp.id) return null;
              const empIsHR = emp.isManager === true || emp.rank === 'مدير عام';
              const isMe = emp.id === currentUser.id;
              return (
                <div key={emp.id}
                  className={`flex items-center gap-2 p-2 rounded-lg transition-all ${empIsHR
                    ? 'bg-amber-50 border-2 border-amber-300'
                    : isMe ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                  }`}>
                  <div className="relative shrink-0">
                    <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center text-white font-bold text-xs"
                      style={{ background: getColor(emp.rank) }}>
                      {emp.avatar ? <img src={emp.avatar} alt="" className="w-full h-full object-cover" /> : (emp.name || '?').charAt(0)}
                    </div>
                    {empIsHR && (
                      <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-500 rounded-full flex items-center justify-center" style={{ border: '1.5px solid white' }}>
                        <Crown size={7} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-[11px] font-bold truncate ${empIsHR ? 'text-amber-700' : 'text-gray-800'}`}>
                      {emp.name} {isMe && <span className="text-gray-400 font-normal">(أنت)</span>}
                    </p>
                    <p className="text-[9px] text-gray-500">{emp.rank}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* === الدردشة === */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg border border-gray-200 border-t-4 border-t-[#d4af37] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-l from-[#1e3a5f] to-[#0f2540] p-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <MessageCircle size={18} className="text-[#d4af37]" />
              <h3 className="font-bold text-[#d4af37] text-sm">الدردشة ({messages.length})</h3>
            </div>
            {isManagerLoggedIn && messages.length > 0 && (
              <button type="button" onClick={() => store.clearChat()}
                className="flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-300 rounded-lg text-xs font-bold cursor-pointer hover:bg-red-500/40">
                <Trash2 size={12} /> مسح
              </button>
            )}
          </div>

          {/* الرسائل */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: 0, background: '#fafafa' }}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <MessageCircle size={48} className="text-gray-200 mb-3" />
                <p className="font-bold">ابدأ المحادثة</p>
                <p className="text-xs mt-1">اكتب رسالة وسيراها جميع الموظفين</p>
              </div>
            ) : (
              messages.filter((m: any) => m && m.id).map((msg: any) => {
                const isMe = msg.senderId === currentUser.id;
                const msgIsHR = msg.isManager === true;
                return (
                  <div key={msg.id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <div className="relative shrink-0 self-end">
                      <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center text-white font-bold text-xs"
                        style={{ background: getColor(msg.senderRank || '') }}>
                        {msg.senderAvatar ? <img src={msg.senderAvatar} alt="" className="w-full h-full object-cover" /> : (msg.senderName || '?').charAt(0)}
                      </div>
                      {msgIsHR && (
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-500 rounded-full flex items-center justify-center" style={{ border: '1.5px solid white' }}>
                          <Crown size={7} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div style={{ maxWidth: '75%' }}>
                      <div className={`flex items-center gap-1.5 mb-0.5 ${isMe ? 'flex-row-reverse' : ''}`}>
                        <span className={`text-[11px] font-bold ${msgIsHR ? 'text-amber-600' : 'text-gray-700'}`}>{msg.senderName}</span>
                        {msgIsHR && <span className="text-[9px] bg-amber-100 text-amber-700 px-1 rounded font-bold">HR</span>}
                      </div>
                      <div className={`px-3.5 py-2 text-sm leading-relaxed ${
                        isMe && msgIsHR ? 'bg-gradient-to-l from-amber-500 to-yellow-500 text-white rounded-2xl rounded-br-sm'
                        : isMe ? 'bg-[#1e3a5f] text-white rounded-2xl rounded-br-sm'
                        : msgIsHR ? 'bg-amber-50 text-gray-800 border-2 border-amber-300 rounded-2xl rounded-bl-sm'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-bl-sm'
                      }`} style={{ wordBreak: 'break-word' }}>
                        {msg.text}
                      </div>
                      <p className={`text-[9px] text-gray-400 mt-0.5 ${isMe ? 'text-left' : 'text-right'}`}>{getTime(msg.timestamp)}</p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatEndRef} />
          </div>

          {/* الإدخال */}
          <div className="p-3 border-t border-gray-200 bg-white shrink-0">
            <form onSubmit={e => { e.preventDefault(); doSend(); }} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="اكتب رسالتك..."
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#d4af37] focus:outline-none text-sm"
              />
              <button type="submit"
                className="px-5 py-3 bg-[#1e3a5f] text-[#d4af37] rounded-xl font-bold cursor-pointer hover:bg-[#0f2540] transition-all active:scale-95"
                disabled={!text.trim()}>
                <Send size={18} />
              </button>
            </form>
            {isHR && (
              <p className="text-amber-600 text-[10px] mt-1 flex items-center gap-1"><Crown size={10} /> رسائلك مميزة كـ HR</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
