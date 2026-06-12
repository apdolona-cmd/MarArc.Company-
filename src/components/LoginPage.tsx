import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Shield, Lock, User, AlertCircle, Eye, EyeOff, LogIn, Loader2, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const { login, companySettings, loginError, isLoading } = useStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showManagerAccess, setShowManagerAccess] = useState(false);
  const [managerPassword, setManagerPassword] = useState('');
  const [managerError, setManagerError] = useState('');

  const handleLogin = async () => {
    if (!username || !password) return;
    
    setLoading(true);
    setTimeout(() => {
      login(username, password);
      setLoading(false);
    }, 800);
  };

  const handleManagerAccess = () => {
    if (managerPassword === '01147497465') {
      // تسجيل دخول HR مباشرة
      login('admin', '01147497465');
      setShowManagerAccess(false);
    } else {
      setManagerError('كلمة السر غير صحيحة');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3a5f] to-[#0f2540]" dir="rtl">
        <div className="text-center">
          <Loader2 size={48} className="text-[#d4af37] animate-spin mx-auto mb-4" />
          <p className="text-white/60">جاري تحميل النظام...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3a5f] via-[#0f2540] to-[#1e3a5f] p-4" dir="rtl">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-72 h-72 bg-[#d4af37] rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#d4af37] rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo Card */}
        <div className="text-center mb-8">
          <div className="inline-block relative">
            <img 
              src={companySettings.logo} 
              alt={companySettings.name} 
              className="w-28 h-28 rounded-3xl object-cover shadow-2xl border-4 border-[#d4af37] mx-auto"
            />
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center border-4 border-[#1e3a5f]">
              <Shield size={20} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[#d4af37] mt-6">{companySettings.name}</h1>
          <p className="text-white/60 mt-2">{companySettings.slogan}</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="luxury-gradient p-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mb-3">
              <LogIn size={32} className="text-[#d4af37]" />
            </div>
            <h2 className="text-xl font-bold text-[#d4af37]">{companySettings.loginTitle || 'تسجيل الدخول'}</h2>
            <p className="text-white/60 text-sm mt-1">{companySettings.loginSubtitle || 'أدخل بيانات حسابك للدخول'}</p>
          </div>

          <div className="p-8 space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-bold text-[#1e3a5f] mb-2">اسم الموظف</label>
              <div className="relative">
                <User size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="أدخل اسم الموظف"
                  className="w-full pr-12 pl-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 transition-all text-lg"
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-[#1e3a5f] mb-2">كلمة المرور</label>
              <div className="relative">
                <Lock size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="أدخل كلمة المرور"
                  className="w-full pr-12 pl-12 py-4 border-2 border-gray-200 rounded-2xl focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 transition-all text-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-xl border border-red-200 animate-fade-in-up">
                <AlertCircle size={20} />
                <span className="font-medium">{loginError}</span>
              </div>
            )}

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading || !username || !password}
              className="w-full py-4 luxury-gradient text-[#d4af37] rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <Loader2 className="animate-spin" size={24} />
                  جاري تسجيل الدخول...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <LogIn size={20} />
                  تسجيل الدخول
                </span>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-gray-400 text-sm">أو</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Manager Access Button */}
            <button
              onClick={() => setShowManagerAccess(true)}
              className="w-full py-4 bg-gradient-to-l from-red-600 to-red-700 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3"
            >
              <KeyRound size={20} />
              دخول HR
            </button>
          </div>

          {/* Footer */}
          <div className="px-8 pb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-blue-700 text-sm text-center font-medium">
                📌 للحصول على بيانات الدخول، تواصل مع HR
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-center text-white/40 text-sm mt-6">
          {companySettings.name} © {new Date().getFullYear()} - جميع الحقوق محفوظة
        </p>
      </div>

      {/* Manager Access Modal */}
      {showManagerAccess && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowManagerAccess(false)}>
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-l from-red-600 to-red-700 p-6 text-center">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-4">
                <Shield size={40} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">بوابة HR</h3>
              <p className="text-red-200 text-sm mt-2">أدخل كلمة السر الخاصة بـ HR</p>
            </div>

            <div className="p-8 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">كلمة سر HR</label>
                <div className="relative">
                  <Lock size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={managerPassword}
                    onChange={e => { setManagerPassword(e.target.value); setManagerError(''); }}
                    onKeyDown={e => e.key === 'Enter' && handleManagerAccess()}
                    placeholder="أدخل كلمة السر"
                    className="w-full pr-12 pl-12 py-4 border-2 border-gray-200 rounded-2xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-lg text-center tracking-widest"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {managerError && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                  <AlertCircle size={18} />
                  <span className="font-medium text-sm">{managerError}</span>
                </div>
              )}

              <button
                onClick={handleManagerAccess}
                disabled={!managerPassword}
                className="w-full py-4 bg-gradient-to-l from-red-600 to-red-700 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Shield size={20} />
                دخول كـ HR
              </button>

              <button
                onClick={() => { setShowManagerAccess(false); setManagerPassword(''); setManagerError(''); }}
                className="w-full py-3 bg-gray-100 text-gray-600 rounded-2xl font-medium hover:bg-gray-200 transition-all"
              >
                إلغاء
              </button>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
                <p className="text-amber-700 text-xs text-center">
                  ⚠️ هذه البوابة مخصصة لـ HR فقط لإضافة وإدارة الموظفين
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
