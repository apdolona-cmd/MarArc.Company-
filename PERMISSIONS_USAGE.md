# 🔐 دليل استخدام الصلاحيات في المكونات

## كيفية استخدام الصلاحيات في المكونات

### 1. استيراد hooks الصلاحيات
```typescript
import { usePermissions } from '../hooks/usePermissions';
```

### 2. الحصول على الصلاحيات
```typescript
export default function MyComponent() {
  const perms = usePermissions();
  
  // التحقق من الصلاحية
  if (!perms.actions.canManageInvoices) {
    return <div>ليس لديك صلاحية للوصول إلى هذا القسم</div>;
  }
  
  return <div>محتوى محمي</div>;
}
```

---

## أمثلة على الاستخدام

### مثال 1: عرض الفواتير (Invoices)
```typescript
import { usePermissions } from '../hooks/usePermissions';

export default function Invoices() {
  const { currentUser, invoices, addInvoice, ... } = useStore();
  const perms = usePermissions();
  
  // يمكن فقط للمحاسب والمدير العام و موظف الاستقبال
  if (!perms.actions.canManageInvoices) {
    return (
      <div className="text-center text-red-500">
        <p>❌ ليس لديك صلاحية للوصول إلى نظام الفواتير</p>
      </div>
    );
  }
  
  return (
    <div>
      {/* محتوى الفواتير */}
    </div>
  );
}
```

### مثال 2: إدارة المشاريع (Projects)
```typescript
import { usePermissions } from '../hooks/usePermissions';

export default function Projects() {
  const perms = usePermissions();
  
  // يمكن لمديري الأقسام والمشرفين والمهندسين والفنيين الأوائل
  if (!perms.actions.canManageProjects) {
    return <AccessDenied />;
  }
  
  const canEdit = ['مدير عام', 'مدير قسم'].includes(currentUser?.rank);
  const canDelete = currentUser?.rank === 'مدير عام';
  
  return (
    <div>
      <button disabled={!canEdit}>تعديل المشروع</button>
      <button disabled={!canDelete}>حذف المشروع</button>
    </div>
  );
}
```

### مثال 3: الحضور والغياب (Attendance)
```typescript
export default function Attendance() {
  const perms = usePermissions();
  
  // معظم الرتب لها صلاحية
  if (!perms.actions.canManageAttendance) {
    return <AccessDenied />;
  }
  
  // يمكن للعمال تسجيل حضورهم فقط
  const canViewAll = perms.actions.canViewAllEmployees;
  
  return (
    <div>
      {canViewAll ? (
        <AllEmployeesAttendance />
      ) : (
        <OwnAttendanceOnly />
      )}
    </div>
  );
}
```

---

## قائمة الصلاحيات الجديدة

### 1. **canManageInvoices** 
```typescript
// من لديه صلاحية:
✅ مدير عام
✅ محاسب
✅ موظف استقبال

// الوصول:
- عرض الفواتير
- إنشاء فاتورة
- تعديل الفاتورة
- حذف الفاتورة
```

### 2. **canManageProjects**
```typescript
// من لديه صلاحية:
✅ مدير عام
✅ مدير قسم
✅ مشرف
✅ مهندس أول
✅ مهندس
✅ فني أول

// الوصول:
- عرض المشاريع
- إنشاء مشروع
- تحديث حالة المشروع
- إضافة فريق
```

### 3. **canManageAttendance**
```typescript
// من لديه صلاحية:
✅ مدير عام
✅ مدير قسم
✅ مشرف
✅ مهندس أول
✅ مهندس
✅ فني أول
✅ فني
✅ عامل

// الوصول:
- تسجيل الحضور
- عرض سجل الحضور
- تعديل التسجيل (حسب الصلاحيات الأخرى)
```

### 4. **canManageLeaves**
```typescript
// من لديه صلاحية:
✅ مدير عام
✅ مدير قسم
✅ مشرف

// الوصول:
- عرض طلبات الإجازات
- الموافقة على الإجازات
- رفض الإجازات
- تحديد نوع الإجازة
```

### 5. **canManageInventory**
```typescript
// من لديه صلاحية:
✅ مدير عام
✅ فني أول
✅ فني

// الوصول:
- عرض المخزون
- إضافة مواد
- تحديث الكميات
- تسجيل الحركات
```

### 6. **canViewReports** و **canGenerateReports**
```typescript
// canViewReports:
✅ مدير عام
✅ مدير قسم
✅ مشرف
✅ مهندس أول
✅ محاسب

// canGenerateReports:
✅ مدير عام
✅ مدير قسم
✅ مهندس أول
✅ محاسب

// الوصول:
- عرض التقارير
- إنشاء تقرير جديد
- تصدير البيانات
```

### 7. **canManageCommunications**
```typescript
// من لديه صلاحية:
✅ مدير عام
✅ مدير قسم
✅ مشرف
✅ موظف استقبال

// الوصول:
- إرسال رسائل
- جدولة الرسائل
- عرض السجل
- اختيار القناة (Email/SMS/WhatsApp)
```

### 8. **canManageContracts**
```typescript
// من لديه صلاحية:
✅ مدير عام
✅ محاسب

// الوصول:
- عرض العقود
- إنشاء عقد جديد
- تعديل العقد
- تتبع التجديد
```

### 9. **canManagePerformance**
```typescript
// من لديه صلاحية:
✅ مدير عام
✅ مدير قسم

// الوصول:
- عرض التقييمات
- إنشاء تقييم جديد
- تحديث التقييم
- عرض الإحصائيات
```

---

## أفضل الممارسات

### ✅ نعم - استخدم الفحص في المستوى العلوي

```typescript
export default function AdminPanel() {
  const perms = usePermissions();
  
  // تحقق في الأعلى
  if (!perms.actions.canManageEmployees) {
    return <AccessDenied />;
  }
  
  // المحتوى آمن هنا
  return <EmployeeManagement />;
}
```

### ❌ لا - لا تعتمد على الإخفاء فقط

```typescript
// هذا غير آمن - يمكن للمستخدم تعديل الكود وإظهار الزر
function Button() {
  const perms = usePermissions();
  return (
    <button style={{ display: perms.actions.canEdit ? 'block' : 'none' }}>
      تعديل
    </button>
  );
}
```

### ✅ نعم - استخدم التحقق من الصلاحية في الإجراءات

```typescript
function handleDelete(id: string) {
  const perms = usePermissions();
  
  if (!perms.actions.canDeleteClient) {
    alert('ليس لديك صلاحية الحذف');
    return;
  }
  
  deleteClient(id);
}
```

---

## الاختبار

### اختبار الصلاحيات المختلفة

```typescript
// سجل دخول بحسابات مختلفة واختبر الوصول:

👤 مدير عام (admin / 01147497465)
✅ يجب أن يرى كل شيء

👤 محاسب
✅ يجب أن يرى: الفواتير، المحاسبة، التقارير
❌ يجب ألا يرى: المشاريع بالكامل

👤 عامل
✅ يجب أن يرى: الحضور فقط
❌ يجب ألا يرى: أي شيء آخر
```

---

## الملفات الرئيسية

- **src/store/useStore.ts**: تعريف `rankPermissions` و `RankPermission`
- **src/hooks/usePermissions.ts**: الدالة `usePermissions()` للحصول على الصلاحيات
- **ROLES_DISTRIBUTION.md**: توزيع الأدوار الكامل

---

## الدعم والتحديث

إذا أردت إضافة صلاحية جديدة:

1. أضفها في `RankPermission` في useStore.ts
2. حدّث `rankPermissions` لكل رتبة
3. حدّث `usePermissions.ts` للقيم الافتراضية
4. استخدمها في المكونات المناسبة

---

**تم الإنشاء:** June 12, 2026
**الإصدار:** 1.0
