import { useState } from 'react';
import { useStore } from '../store/useStore';
import { User, Mail, Phone, Building2, Award, Calendar, DollarSign, Lock, Save, Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function Profile() {
  const { currentUser, updateEmployee, addNotification } = useStore();
  const [showPassword, setShowPassword] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    nickname: currentUser?.nickname || '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!currentUser) return null;

  const handleSaveProfile = () => {
    updateEmployee(currentUser.id, form);
    setEditMode(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChangePassword = () => {
    if (passwordForm.currentPassword !== currentUser.password) {
      addNotification({ title: 'خطأ', message: 'كلمة المرور الحالية غير صحيحة', type: 'error' });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      addNotification({ title: 'خطأ', message: 'كلمة المرور الجديدة غير متطابقة', type: 'error' });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      addNotification({ title: 'خطأ', message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل', type: 'error' });
      return;
    }
    
    updateEmployee(currentUser.id, { password: passwordForm.newPassword });
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowPasswordChange(false);
    addNotification({ title: 'تم التحديث', message: 'تم تغيير كلمة المرور بنجاح', type: 'success' });
  };

  const rankColors: Record<string, string> = {
    'مدير عام': 'from-yellow-500 to-amber-600',
    'مدير قسم': 'from-purple-500 to-purple-600',
    'مشرف': 'from-blue-500 to-blue-600',
    'مهندس أول': 'from-cyan-500 to-cyan-600',
    'مهندس': 'from-teal-500 to-teal-600',
    'فني أول': 'from-orange-500 to-orange-600',
    'فني': 'from-amber-500 to-amber-600',
    'محاسب': 'from-green-500 to-green-600',
    'موظف استقبال': 'from-pink-500 to-pink-600',
    'عامل': 'from-gray-500 to-gray-600',
  };

  return (
    <div className="space-y-6 animate-fade-in-up max-w-3xl mx-auto">
      {/* Header */}
      <div className="gov-card rounded-2xl overflow-hidden">
        <div className={`bg-gradient-to-l ${rankColors[currentUser.rank] || 'from-gray-500 to-gray-600'} p-8 text-center relative`}>
          <div className="absolute top-4 right-4 left-4 flex justify-between">
            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
              @{currentUser.username}
            </span>
            <span className={`text-xs px-3 py-1 rounded-full font-bold ${
              currentUser.status === 'نشط' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}>{currentUser.status}</span>
          </div>
          
          <div className="w-28 h-28 mx-auto rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-white font-bold text-5xl mb-4 mt-4">
            {currentUser.name.charAt(0)}
          </div>
          <h2 className="text-2xl font-bold text-white">{currentUser.name}</h2>
          <p className="text-white/80">{currentUser.nickname}</p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <Award size={18} className="text-white" />
            <span className="text-white font-medium">{currentUser.rank}</span>
            <span className="text-white/60">•</span>
            <span className="text-white/80">{currentUser.department}</span>
          </div>
        </div>

        {saved && (
          <div className="bg-green-50 border-b border-green-200 p-4 flex items-center justify-center gap-2 text-green-700">
            <CheckCircle size={18} />
            <span className="font-medium">تم حفظ التغييرات بنجاح</span>
          </div>
        )}

        <div className="p-6">
          {editMode ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#1e3a5f] mb-2">النيك نيم</label>
                <input type="text" value={form.nickname} onChange={e => setForm({...form, nickname: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#d4af37]" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1e3a5f] mb-2">البريد الإلكتروني</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#d4af37]" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1e3a5f] mb-2">الهاتف</label>
                <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#d4af37]" />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={handleSaveProfile}
                  className="flex-1 py-3 luxury-gradient text-[#d4af37] rounded-xl font-bold flex items-center justify-center gap-2">
                  <Save size={18} /> حفظ التغييرات
                </button>
                <button onClick={() => setEditMode(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium">إلغاء</button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {[
                { icon: User, label: 'اسم الموظف', value: currentUser.username },
                { icon: Mail, label: 'البريد الإلكتروني', value: currentUser.email },
                { icon: Phone, label: 'الهاتف', value: currentUser.phone },
                { icon: Building2, label: 'القسم', value: currentUser.department },
                { icon: Calendar, label: 'تاريخ الانضمام', value: currentUser.joinDate },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3 text-gray-500">
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </div>
                    <span className="font-medium text-[#1e3a5f]">{item.value || '-'}</span>
                  </div>
                );
              })}
              
              <button onClick={() => { setEditMode(true); setForm({ phone: currentUser.phone, email: currentUser.email, nickname: currentUser.nickname }); }}
                className="w-full py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors">
                تعديل البيانات
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Salary Info */}
      <div className="gov-card rounded-2xl p-6">
        <h3 className="text-lg font-bold text-[#1e3a5f] mb-4 flex items-center gap-2">
          <DollarSign className="text-green-500" /> معلومات الراتب
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-gray-500 text-sm">الراتب الأساسي</p>
            <p className="text-xl font-bold text-[#1e3a5f]">{currentUser.baseSalary.toLocaleString()} ج.م</p>
          </div>
          <div className="p-4 bg-green-50 rounded-xl">
            <p className="text-gray-500 text-sm">المكافآت</p>
            <p className="text-xl font-bold text-green-600">+{currentUser.bonus.toLocaleString()} ج.م</p>
          </div>
          <div className="p-4 bg-red-50 rounded-xl">
            <p className="text-gray-500 text-sm">الخصومات</p>
            <p className="text-xl font-bold text-red-600">-{currentUser.deductions.toLocaleString()} ج.م</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-xl">
            <p className="text-gray-500 text-sm">الضريبة ({currentUser.taxRate}%)</p>
            <p className="text-xl font-bold text-orange-600">-{Math.round((currentUser.baseSalary + currentUser.bonus - currentUser.deductions) * currentUser.taxRate / 100).toLocaleString()} ج.م</p>
          </div>
        </div>
        <div className="mt-4 p-4 luxury-gradient rounded-xl">
          <p className="text-[#d4af37] text-sm">صافي الراتب</p>
          <p className="text-2xl font-bold text-white">{currentUser.netSalary.toLocaleString()} ج.م</p>
        </div>
      </div>

      {/* Password Change */}
      <div className="gov-card rounded-2xl p-6">
        <h3 className="text-lg font-bold text-[#1e3a5f] mb-4 flex items-center gap-2">
          <Lock className="text-red-500" /> تغيير كلمة المرور
        </h3>
        
        {showPasswordChange ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">كلمة المرور الحالية</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={passwordForm.currentPassword} 
                  onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#d4af37] pl-12" 
                />
                <button onClick={() => setShowPassword(!showPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">كلمة المرور الجديدة</label>
              <input type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#d4af37]" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">تأكيد كلمة المرور الجديدة</label>
              <input type="password" value={passwordForm.confirmPassword} onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#d4af37]" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleChangePassword}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors">
                تغيير كلمة المرور
              </button>
              <button onClick={() => { setShowPasswordChange(false); setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium">إلغاء</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowPasswordChange(true)}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
            <Lock size={18} /> تغيير كلمة المرور
          </button>
        )}
      </div>
    </div>
  );
}
