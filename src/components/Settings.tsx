import { useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { usePermissions } from '../hooks/usePermissions';
import { Settings as SettingsIcon, Building2, Globe, Phone, Mail, MapPin, Save, Upload, Palette, FileText, Shield, CheckCircle, Type, Image, PenTool } from 'lucide-react';

export default function Settings() {
  const { companySettings, updateCompanySettings, isManagerLoggedIn } = useStore();
  const perms = usePermissions();
  const [tab, setTab] = useState<'info' | 'customize' | 'colors' | 'email'>('info');
  const [form, setForm] = useState(companySettings);
  const [saved, setSaved] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const logoRef = useRef<HTMLInputElement>(null);
  const heroRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    updateCompanySettings(form);
    setEditMode(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleImageUpload = (field: 'logo' | 'heroImage') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { alert('الصورة كبيرة جداً (الحد الأقصى 2MB)'); return; }
      const reader = new FileReader();
      reader.onloadend = () => setForm({ ...form, [field]: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const colorPresets = [
    { primary: '#1e3a5f', secondary: '#d4af37', name: 'الكلاسيكي' },
    { primary: '#1a1a2e', secondary: '#e94560', name: 'العصري' },
    { primary: '#2d3436', secondary: '#00b894', name: 'الطبيعي' },
    { primary: '#0c0c0c', secondary: '#ffd700', name: 'الذهبي' },
    { primary: '#1b4332', secondary: '#95d5b2', name: 'الأخضر' },
    { primary: '#3c1642', secondary: '#f6e8ea', name: 'الملكي' },
  ];

  if (!perms.actions.canEditSettings && !isManagerLoggedIn) {
    return (
      <div className="gov-card rounded-2xl p-16 text-center">
        <Shield size={64} className="mx-auto mb-4 text-gray-300" />
        <p className="text-xl font-bold text-gray-500">لا تملك صلاحية الوصول</p>
        <p className="text-gray-400 mt-2">هذه الصفحة متاحة لـ HR فقط</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="gov-card rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl luxury-gradient flex items-center justify-center">
              <SettingsIcon size={28} className="text-[#d4af37]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#1e3a5f]">إعدادات الشركة والموقع</h2>
              <p className="text-gray-500 text-sm">تخصيص كامل للموقع - صور، ألوان، نصوص</p>
            </div>
          </div>
          {!editMode ? (
            <button type="button" onClick={() => { setEditMode(true); setForm(companySettings); }}
              className="gov-button flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold cursor-pointer">
              <PenTool size={18} /> تعديل الموقع
            </button>
          ) : (
            <div className="flex gap-2">
              <button type="button" onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 cursor-pointer">
                <Save size={18} /> حفظ الكل
              </button>
              <button type="button" onClick={() => setEditMode(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium cursor-pointer">إلغاء</button>
            </div>
          )}
        </div>
      </div>

      {saved && (
        <div className="bg-green-50 border-2 border-green-400 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="text-green-500" size={24} />
          <p className="text-green-700 font-bold">تم حفظ جميع التغييرات بنجاح! ✅</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 bg-white p-2 rounded-xl shadow border-t-4 border-[#d4af37]">
        {[
          { id: 'info', label: 'معلومات الشركة', icon: Building2 },
          { id: 'customize', label: 'تخصيص النصوص والصور', icon: Type },
          { id: 'colors', label: 'الألوان والثيم', icon: Palette },
          { id: 'email', label: 'إعداد البريد الفوري', icon: Mail },
        ].map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} type="button" onClick={() => setTab(t.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${tab === t.id ? 'luxury-gradient text-[#d4af37]' : 'text-gray-500 hover:bg-gray-50'}`}>
              <Icon size={18} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Preview Header */}
      <div className="gov-card rounded-2xl overflow-hidden">
        <div className="p-8 text-center relative" style={{ background: `linear-gradient(135deg, ${editMode ? form.primaryColor : companySettings.primaryColor}, ${editMode ? form.primaryColor : companySettings.primaryColor}dd)` }}>
          <div className="relative inline-block">
            <img src={editMode ? form.logo : companySettings.logo} alt="Logo"
              className="w-28 h-28 rounded-2xl object-cover shadow-2xl mx-auto"
              style={{ borderColor: editMode ? form.secondaryColor : companySettings.secondaryColor, borderWidth: '4px' }} />
            {editMode && (
              <>
                <input type="file" ref={logoRef} onChange={handleImageUpload('logo')} accept="image/*" className="hidden" />
                <button type="button" onClick={() => logoRef.current?.click()}
                  className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-100 cursor-pointer">
                  <Upload size={18} className="text-gray-600" />
                </button>
              </>
            )}
          </div>
          <h3 className="text-2xl font-bold mt-4" style={{ color: editMode ? form.secondaryColor : companySettings.secondaryColor }}>
            {editMode ? form.name : companySettings.name}
          </h3>
          <p className="text-white/70 mt-1">{editMode ? form.slogan : companySettings.slogan}</p>
        </div>
      </div>

      {/* Tab Content */}
      {editMode ? (
        <div className="gov-card rounded-2xl p-6 space-y-6">
          {tab === 'info' && (
            <>
              <h3 className="text-lg font-bold text-[#1e3a5f] flex items-center gap-2"><Building2 size={20} /> معلومات الشركة</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'اسم الشركة', key: 'name' },
                  { label: 'الاسم الإنجليزي', key: 'nameEn' },
                  { label: 'الشعار (Slogan)', key: 'slogan' },
                  { label: 'البريد الإلكتروني', key: 'email' },
                  { label: 'الهاتف', key: 'phone' },
                  { label: 'العنوان', key: 'address' },
                  { label: 'الموقع الإلكتروني', key: 'website' },
                  { label: 'السجل التجاري', key: 'commercialRegister' },
                  { label: 'الرقم الضريبي', key: 'taxNumber' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-sm font-bold text-[#1e3a5f] mb-2">{f.label}</label>
                    <input type="text" value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#d4af37] focus:outline-none text-sm" />
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 'customize' && (
            <>
              <h3 className="text-lg font-bold text-[#1e3a5f] flex items-center gap-2"><Type size={20} /> تخصيص نصوص الموقع</h3>
              <p className="text-gray-500 text-sm">غيّر أي عنوان أو نص يظهر في الموقع</p>

              {/* صورة الموقع الرئيسية */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
                <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2"><Image size={18} /> صورة الموقع الرئيسية (Hero)</h4>
                <div className="flex items-center gap-4">
                  {form.heroImage ? (
                    <img src={form.heroImage} alt="hero" className="w-32 h-20 object-cover rounded-xl border-2 border-blue-300" />
                  ) : (
                    <div className="w-32 h-20 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-xs">لا توجد صورة</div>
                  )}
                  <div className="flex-1">
                    <input type="file" ref={heroRef} onChange={handleImageUpload('heroImage')} accept="image/*" className="hidden" />
                    <button type="button" onClick={() => heroRef.current?.click()}
                      className="px-4 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 cursor-pointer flex items-center gap-2">
                      <Upload size={16} /> رفع صورة
                    </button>
                    {form.heroImage && (
                      <button type="button" onClick={() => setForm({ ...form, heroImage: '' })}
                        className="px-4 py-2 bg-red-100 text-red-600 rounded-xl font-medium mt-2 cursor-pointer">حذف الصورة</button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'عنوان لوحة التحكم', key: 'dashboardTitle' },
                  { label: 'عنوان صفحة الموظفين', key: 'employeesTitle' },
                  { label: 'عنوان صفحة العملاء', key: 'clientsTitle' },
                  { label: 'عنوان صفحة البريد', key: 'emailsTitle' },
                  { label: 'عنوان صفحة المرتبات', key: 'salariesTitle' },
                  { label: 'عنوان صفحة الضرائب', key: 'taxesTitle' },
                  { label: 'عنوان الهيكل التنظيمي', key: 'orgTitle' },
                  { label: 'عنوان صفحة الدخول', key: 'loginTitle' },
                  { label: 'وصف صفحة الدخول', key: 'loginSubtitle' },
                  { label: 'رسالة الترحيب', key: 'welcomeMessage' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-sm font-bold text-[#1e3a5f] mb-2">{f.label}</label>
                    <input type="text" value={(form as any)[f.key] || ''} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#d4af37] focus:outline-none text-sm" />
                  </div>
                ))}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-[#1e3a5f] mb-2">نص الفوتر</label>
                  <input type="text" value={form.footerText || ''} onChange={e => setForm({ ...form, footerText: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#d4af37] focus:outline-none text-sm" />
                </div>
              </div>
            </>
          )}

          {tab === 'colors' && (
            <>
              <h3 className="text-lg font-bold text-[#1e3a5f] flex items-center gap-2"><Palette size={20} /> ألوان الموقع</h3>

              {/* Presets */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {colorPresets.map((p, i) => (
                  <button key={i} type="button" onClick={() => setForm({ ...form, primaryColor: p.primary, secondaryColor: p.secondary })}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${form.primaryColor === p.primary ? 'border-[#d4af37] shadow-lg scale-105' : 'border-gray-200'}`}>
                    <div className="flex gap-1 mb-2">
                      <div className="w-8 h-8 rounded-lg" style={{ background: p.primary }} />
                      <div className="w-8 h-8 rounded-lg" style={{ background: p.secondary }} />
                    </div>
                    <p className="text-xs text-gray-600 font-medium">{p.name}</p>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#1e3a5f] mb-2">اللون الأساسي</label>
                  <div className="flex gap-2">
                    <input type="color" value={form.primaryColor} onChange={e => setForm({ ...form, primaryColor: e.target.value })}
                      className="w-14 h-14 rounded-xl cursor-pointer" />
                    <input type="text" value={form.primaryColor} onChange={e => setForm({ ...form, primaryColor: e.target.value })}
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none" dir="ltr" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1e3a5f] mb-2">اللون الثانوي (الذهبي)</label>
                  <div className="flex gap-2">
                    <input type="color" value={form.secondaryColor} onChange={e => setForm({ ...form, secondaryColor: e.target.value })}
                      className="w-14 h-14 rounded-xl cursor-pointer" />
                    <input type="text" value={form.secondaryColor} onChange={e => setForm({ ...form, secondaryColor: e.target.value })}
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none" dir="ltr" />
                  </div>
                </div>
              </div>
            </>
          )}

          {tab === 'email' && (
            <>
              <h3 className="text-lg font-bold text-[#1e3a5f] flex items-center gap-2"><Mail size={20} /> إعداد الإرسال الفوري (EmailJS)</h3>
              
              <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5">
                <h4 className="font-bold text-amber-800 mb-3">⚡ إرسال فوري بضغطة زر واحدة</h4>
                <p className="text-amber-700 text-sm leading-relaxed">
                  بعد إعداد EmailJS، كل رسالة تُرسل فوراً بدون فتح Gmail!<br/>
                  مجاني - 200 رسالة/شهر
                </p>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
                <h4 className="font-bold text-blue-800 mb-3">📋 خطوات الإعداد (مرة واحدة فقط):</h4>
                <ol className="text-blue-700 text-sm space-y-2 list-decimal list-inside leading-relaxed">
                  <li>اذهب لـ <a href="https://www.emailjs.com" target="_blank" className="underline font-bold">emailjs.com</a> وأنشئ حساب مجاني</li>
                  <li>اضغط <strong>Email Services</strong> → <strong>Add New Service</strong> → اختر <strong>Gmail</strong> → اربط حساب <strong>mararc.company@gmail.com</strong></li>
                  <li>انسخ <strong>Service ID</strong> وضعه هنا بالأسفل</li>
                  <li>اذهب لـ <strong>Email Templates</strong> → <strong>Create New Template</strong></li>
                  <li>اضغط <strong>Edit Content</strong> → <strong>Code Editor</strong> واكتب:<br/>
                    <code className="bg-blue-100 px-2 py-1 rounded text-xs block mt-1 leading-relaxed" dir="ltr">
                      {'{{{message_html}}}'}
                    </code>
                    <span className="text-xs text-blue-600 mt-1 block">⚠️ مهم: 3 أقواس {'{{{ }}}'} وليس 2 - لأنه HTML</span>
                  </li>
                  <li>في خانة <strong>Subject</strong>: <code className="bg-blue-100 px-1 rounded">{'{{subject}}'}</code></li>
                  <li>في خانة <strong>To Email</strong>: <code className="bg-blue-100 px-1 rounded">{'{{to_email}}'}</code></li>
                  <li>في خانة <strong>From Name</strong>: <code className="bg-blue-100 px-1 rounded">{'{{from_name}}'}</code></li>
                  <li>في خانة <strong>Reply To</strong>: <code className="bg-blue-100 px-1 rounded">{'{{reply_to}}'}</code></li>
                  <li>انسخ <strong>Template ID</strong> وضعه هنا</li>
                  <li>اذهب لـ <strong>Account</strong> → انسخ <strong>Public Key</strong> وضعه هنا</li>
                </ol>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#1e3a5f] mb-2">Service ID</label>
                  <input type="text" value={form.emailjsServiceId || ''} onChange={e => setForm({...form, emailjsServiceId: e.target.value})}
                    placeholder="مثال: service_xxxxxxx" dir="ltr"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none font-mono" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1e3a5f] mb-2">Template ID</label>
                  <input type="text" value={form.emailjsTemplateId || ''} onChange={e => setForm({...form, emailjsTemplateId: e.target.value})}
                    placeholder="مثال: template_xxxxxxx" dir="ltr"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none font-mono" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1e3a5f] mb-2">Public Key</label>
                  <input type="text" value={form.emailjsPublicKey || ''} onChange={e => setForm({...form, emailjsPublicKey: e.target.value})}
                    placeholder="مثال: xXxXxXxXxXxXx" dir="ltr"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#d4af37] focus:outline-none font-mono" />
                </div>
              </div>

              {/* Status */}
              {form.emailjsPublicKey && form.emailjsServiceId && form.emailjsTemplateId ? (
                <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 flex items-center gap-3">
                  <CheckCircle className="text-green-500" size={24} />
                  <div>
                    <p className="text-green-700 font-bold">✅ الإرسال الفوري جاهز!</p>
                    <p className="text-green-600 text-sm">الرسائل ستُرسل فوراً بضغطة زر واحدة</p>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 flex items-center gap-3">
                  <Mail className="text-gray-400" size={24} />
                  <div>
                    <p className="text-gray-600 font-bold">الإرسال الفوري غير مُعد</p>
                    <p className="text-gray-500 text-sm">سيتم فتح Gmail بدلاً من الإرسال الفوري</p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Save Button */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 py-4 luxury-gradient text-[#d4af37] rounded-xl font-bold shadow-lg text-lg cursor-pointer hover:shadow-xl active:scale-95 transition-all">
              <Save size={22} /> حفظ جميع التغييرات
            </button>
            <button type="button" onClick={() => setEditMode(false)}
              className="px-8 py-4 bg-gray-200 text-gray-700 rounded-xl font-medium cursor-pointer">إلغاء</button>
          </div>
        </div>
      ) : (
        /* عرض المعلومات */
        <div className="gov-card rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Building2, label: 'اسم الشركة', value: companySettings.name },
              { icon: Globe, label: 'الاسم الإنجليزي', value: companySettings.nameEn },
              { icon: Mail, label: 'البريد', value: companySettings.email },
              { icon: Phone, label: 'الهاتف', value: companySettings.phone },
              { icon: Globe, label: 'الموقع', value: companySettings.website },
              { icon: MapPin, label: 'العنوان', value: companySettings.address },
              { icon: FileText, label: 'السجل التجاري', value: companySettings.commercialRegister },
              { icon: FileText, label: 'الرقم الضريبي', value: companySettings.taxNumber },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <Icon size={18} className="text-[#d4af37] shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="font-medium text-[#1e3a5f]">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {!isManagerLoggedIn && (
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
              <Shield className="text-amber-500" size={20} />
              <p className="text-amber-700 text-sm">سجل دخول كـ HR لتتمكن من تعديل الإعدادات</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
