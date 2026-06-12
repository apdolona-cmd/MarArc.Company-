import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { database, ref, onValue, update } from '../firebase/config';

export type EmployeeRank = 'مدير عام' | 'مدير قسم' | 'مشرف' | 'مهندس أول' | 'مهندس' | 'فني أول' | 'فني' | 'محاسب' | 'موظف استقبال' | 'عامل';

export interface CompanySettings {
  name: string;
  nameEn: string;
  logo: string;
  slogan: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  taxNumber: string;
  commercialRegister: string;
  primaryColor: string;
  secondaryColor: string;
  // EmailJS - لإرسال البريد بضغطة زر
  emailjsPublicKey: string;
  emailjsServiceId: string;
  emailjsTemplateId: string;
  // تخصيص نصوص الموقع
  dashboardTitle: string;
  employeesTitle: string;
  clientsTitle: string;
  emailsTitle: string;
  salariesTitle: string;
  taxesTitle: string;
  orgTitle: string;
  footerText: string;
  welcomeMessage: string;
  loginTitle: string;
  loginSubtitle: string;
  heroImage: string;
}

export interface Employee {
  id: string;
  name: string;
  username: string;
  password: string;
  nickname: string;
  email: string;
  phone: string;
  rank: EmployeeRank;
  department: string;
  baseSalary: number;
  bonus: number;
  deductions: number;
  taxRate: number;
  netSalary: number;
  joinDate: string;
  status: 'نشط' | 'معلق' | 'مفصول';
  notes: string;
  avatar?: string;
  lastLogin?: string;
  isManager?: boolean;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  projectType: string;
  budget: number;
  status: 'جديد' | 'قيد التنفيذ' | 'مكتمل' | 'ملغي';
  registrationDate: string;
  notes: string;
}

export interface Email {
  id: string;
  from: string;
  fromName: string;
  to: string;
  toName: string;
  subject: string;
  body: string;
  date: string;
  time: string;
  read: boolean;
  type: 'sent' | 'received' | 'draft';
  priority: 'عادي' | 'مهم' | 'عاجل';
  attachments?: string[];
}

export interface SalaryRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  baseSalary: number;
  bonus: number;
  deductions: number;
  taxRate: number;
  taxAmount: number;
  netSalary: number;
  status: 'معلق' | 'مدفوع';
  paidDate?: string;
}

export interface TaxRecord {
  id: string;
  type: string;
  amount: number;
  period: string;
  status: 'مدفوع' | 'معلق' | 'متأخر';
  dueDate: string;
  description: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  user: string;
  details: string;
  timestamp: string;
  type: 'employee' | 'client' | 'salary' | 'email' | 'tax' | 'system' | 'settings' | 'login';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
  forEmployee?: string;
}

// نظام غرفة الاجتماعات
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRank: string;
  senderAvatar?: string;
  isManager: boolean;
  text: string;
  timestamp: string;
  type: 'text' | 'system';
}

// نظام المحاسبة
export interface AccountingEntry {
  id: string;
  date: string;
  type: 'دائن' | 'مدين';
  category: string;
  description: string;
  amount: number;
  reference: string;
  createdBy: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalValue: number;
  minStock: number;
  category: string;
  lastUpdated: string;
}

export interface SaleRecord {
  id: string;
  date: string;
  clientName: string;
  items: string;
  quantity: number;
  unitPrice: number;
  total: number;
  vatRate: number;
  vatAmount: number;
  grandTotal: number;
  status: 'مدفوع' | 'آجل' | 'جزئي';
  paidAmount: number;
  notes: string;
}

export interface ExpenseRecord {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  paidTo: string;
  method: string;
  receipt: string;
}

// 1️⃣ نظام الفواتير والعروض
export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  status: 'مسودة' | 'مرسلة' | 'مدفوعة' | 'متأخرة';
  paymentMethod?: string;
  paidAmount: number;
  notes: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  clientId: string;
  clientName: string;
  date: string;
  expiryDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  status: 'قيد الانتظار' | 'مقبول' | 'مرفوض' | 'منتهي الصلاحية';
  acceptedDate?: string;
  notes: string;
}

// 2️⃣ نظام إدارة المشاريع
export interface Project {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  status: 'مخطط' | 'قيد التنفيذ' | 'متوقف' | 'مكتمل';
  progress: number;
  manager: string;
  team: string[];
  location: string;
  tasks: ProjectTask[];
}

export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assignedTo: string;
  startDate: string;
  dueDate: string;
  status: 'معلقة' | 'قيد العمل' | 'مكتملة';
  priority: 'منخفضة' | 'عادية' | 'عالية';
  progress: number;
  dependencies: string[];
}

export interface ProjectPhase {
  id: string;
  projectId: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'قادمة' | 'قيد التنفيذ' | 'مكتملة';
  deliverables: string[];
  budget: number;
}

// 3️⃣ نظام الإجازات والحضور
export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'حاضر' | 'غياب' | 'متأخر' | 'إجازة';
  hoursWorked?: number;
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: 'عارضة' | 'سنوية' | 'مرضية' | 'بدون راتب';
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: 'معلقة' | 'موافق عليها' | 'مرفوضة';
  approvedBy?: string;
  approvalDate?: string;
  notes?: string;
}

export interface LeaveBalance {
  id: string;
  employeeId: string;
  year: number;
  annualLeave: number;
  usedLeave: number;
  remainingLeave: number;
  sickLeave: number;
  usedSickLeave: number;
}

// 4️⃣ نظام إدارة المخزون
export interface InventoryStock {
  id: string;
  itemName: string;
  category: string;
  unit: string;
  quantity: number;
  minStock: number;
  maxStock: number;
  unitCost: number;
  totalCost: number;
  supplier: string;
  lastRestockDate: string;
  expiryDate?: string;
  location: string;
  notes: string;
}

export interface StockMovement {
  id: string;
  itemId: string;
  itemName: string;
  movementType: 'إضافة' | 'إخراج' | 'تصحيح';
  quantity: number;
  date: string;
  reason: string;
  createdBy: string;
  reference: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  paymentTerms: string;
  rating: number;
  items: string[];
  notes: string;
}

// 5️⃣ نظام التقارير (سيتم معالجته ديناميكياً)
export interface ReportConfig {
  id: string;
  name: string;
  type: 'مبيعات' | 'أرباح_خسائر' | 'موظفين' | 'مشاريع' | 'مخزون';
  filters: Record<string, any>;
  createdDate: string;
}

// 6️⃣ نظام الاتصالات المحسّن
export interface Communication {
  id: string;
  type: 'SMS' | 'email' | 'whatsapp';
  recipient: string;
  recipientName: string;
  subject?: string;
  message: string;
  date: string;
  status: 'معلق' | 'مرسل' | 'فشل';
  scheduledTime?: string;
}

// 7️⃣ نظام تقييم الأداء
export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  reviewerName: string;
  reviewDate: string;
  period: string;
  ratings: {
    productivity: number;
    quality: number;
    teamwork: number;
    communication: number;
    punctuality: number;
  };
  comments: string;
  strengths: string;
  improvements: string;
  overallScore: number;
  status: 'مسودة' | 'نهائي';
}

export interface EmployeePerformance {
  id: string;
  employeeId: string;
  year: number;
  reviews: PerformanceReview[];
  averageScore: number;
  promotionEligible: boolean;
  raiseEligible: boolean;
  notes: string;
}

// 8️⃣ نظام المستندات والعقود
export interface Contract {
  id: string;
  contractNumber: string;
  contractType: 'عميل' | 'موظف' | 'مقاول';
  clientName: string;
  startDate: string;
  endDate: string;
  value: number;
  status: 'نشط' | 'منتهي' | 'معلق';
  createdDate: string;
  filePath: string;
  renewalDate?: string;
  autoRenew: boolean;
  notes: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  category: string;
  relatedEntity: string;
  entityId: string;
  uploadDate: string;
  uploadedBy: string;
  filePath: string;
  fileSize: number;
  expiryDate?: string;
  isTemplate: boolean;
  notes: string;
}

interface AppState {
  isLoggedIn: boolean;
  currentUser: Employee | null;
  isManagerLoggedIn: boolean;
  currentPage: string;
  employees: Employee[];
  clients: Client[];
  emails: Email[];
  salaryRecords: SalaryRecord[];
  taxRecords: TaxRecord[];
  activityLogs: ActivityLog[];
  notifications: Notification[];
  companySettings: CompanySettings;
  lastSync: string;
  isOnline: boolean;
  isLoading: boolean;
  loginError: string;
  
  // Firebase
  initializeFirebase: () => void;
  syncToFirebase: () => void;
  
  // Auth
  login: (username: string, password: string) => boolean;
  logout: () => void;
  
  // Navigation
  setCurrentPage: (page: string) => void;
  
  // Company Settings
  updateCompanySettings: (settings: Partial<CompanySettings>) => void;
  
  // Employees
  addEmployee: (emp: { name: string; username: string; password: string; nickname: string; email: string; phone: string; rank: EmployeeRank; department: string; baseSalary: number; bonus: number; deductions: number; taxRate: number; joinDate: string; status: 'نشط' | 'معلق' | 'مفصول'; notes: string }) => void;
  updateEmployee: (id: string, emp: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  updateEmployeeRank: (id: string, rank: EmployeeRank) => void;
  
  // Clients
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  
  // Emails
  addEmail: (email: Omit<Email, 'id'>) => void;
  markEmailRead: (id: string) => void;
  deleteEmail: (id: string) => void;
  sendRealEmail: (to: string, toName: string, subject: string, body: string, priority: 'عادي' | 'مهم' | 'عاجل') => void;
  
  // Salary
  addSalaryRecord: (record: Omit<SalaryRecord, 'id'>) => void;
  paySalary: (id: string) => void;
  generateMonthlySalaries: (month: string) => void;
  
  // Tax
  addTaxRecord: (record: Omit<TaxRecord, 'id'>) => void;
  updateTaxRecord: (id: string, record: Partial<TaxRecord>) => void;
  deleteTaxRecord: (id: string) => void;
  
  // Activity & Notifications
  addActivityLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  addNotification: (notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  
  // Accounting
  accountingEntries: AccountingEntry[];
  inventory: InventoryItem[];
  sales: SaleRecord[];
  expenses: ExpenseRecord[];
  addAccountingEntry: (entry: Omit<AccountingEntry, 'id'>) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'totalValue'>) => void;
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  addSale: (sale: Omit<SaleRecord, 'id' | 'vatAmount' | 'grandTotal'>) => void;
  addExpense: (expense: Omit<ExpenseRecord, 'id'>) => void;
  deleteAccountingEntry: (id: string) => void;
  deleteSale: (id: string) => void;
  deleteExpense: (id: string) => void;

  // Chat / Meeting Room
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => void;
  clearChat: () => void;

  // 1️⃣ نظام الفواتير والعروض
  invoices: Invoice[];
  quotes: Quote[];
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  addQuote: (quote: Omit<Quote, 'id'>) => void;
  updateQuote: (id: string, quote: Partial<Quote>) => void;
  deleteQuote: (id: string) => void;

  // 2️⃣ نظام إدارة المشاريع
  projects: Project[];
  projectTasks: ProjectTask[];
  projectPhases: ProjectPhase[];
  addProject: (project: Omit<Project, 'id' | 'tasks'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addProjectTask: (task: Omit<ProjectTask, 'id'>) => void;
  updateProjectTask: (id: string, task: Partial<ProjectTask>) => void;
  deleteProjectTask: (id: string) => void;
  addProjectPhase: (phase: Omit<ProjectPhase, 'id'>) => void;
  updateProjectPhase: (id: string, phase: Partial<ProjectPhase>) => void;
  deleteProjectPhase: (id: string) => void;

  // 3️⃣ نظام الإجازات والحضور
  attendanceRecords: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  leaveBalances: LeaveBalance[];
  addAttendanceRecord: (record: Omit<AttendanceRecord, 'id'>) => void;
  updateAttendanceRecord: (id: string, record: Partial<AttendanceRecord>) => void;
  deleteAttendanceRecord: (id: string) => void;
  addLeaveRequest: (request: Omit<LeaveRequest, 'id'>) => void;
  approveLeaveRequest: (id: string, approvedBy: string) => void;
  rejectLeaveRequest: (id: string) => void;
  updateLeaveBalance: (id: string, balance: Partial<LeaveBalance>) => void;

  // 4️⃣ نظام إدارة المخزون
  inventoryStocks: InventoryStock[];
  stockMovements: StockMovement[];
  suppliers: Supplier[];
  addInventoryStock: (stock: Omit<InventoryStock, 'id'>) => void;
  updateInventoryStock: (id: string, stock: Partial<InventoryStock>) => void;
  deleteInventoryStock: (id: string) => void;
  addStockMovement: (movement: Omit<StockMovement, 'id'>) => void;
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;

  // 5️⃣ نظام التقارير
  reports: ReportConfig[];
  generateReport: (config: ReportConfig) => any;
  saveReportConfig: (config: Omit<ReportConfig, 'id'>) => void;

  // 6️⃣ نظام الاتصالات المحسّن
  communications: Communication[];
  sendCommunication: (comm: Omit<Communication, 'id' | 'date'>) => void;
  scheduleCommunication: (comm: Communication, scheduledTime: string) => void;

  // 7️⃣ نظام تقييم الأداء
  performanceReviews: PerformanceReview[];
  employeePerformances: EmployeePerformance[];
  addPerformanceReview: (review: Omit<PerformanceReview, 'id'>) => void;
  updatePerformanceReview: (id: string, review: Partial<PerformanceReview>) => void;
  updateEmployeePerformance: (id: string, perf: Partial<EmployeePerformance>) => void;

  // 8️⃣ نظام المستندات والعقود
  contracts: Contract[];
  documents: Document[];
  addContract: (contract: Omit<Contract, 'id'>) => void;
  updateContract: (id: string, contract: Partial<Contract>) => void;
  deleteContract: (id: string) => void;
  addDocument: (document: Omit<Document, 'id'>) => void;
  deleteDocument: (id: string) => void;

  // Helpers
  canAccess: (feature: string) => boolean;
}

const calculateNetSalary = (base: number, bonus: number, deductions: number, taxRate: number) => {
  const gross = base + bonus - deductions;
  const tax = gross * (taxRate / 100);
  return Math.round(gross - tax);
};

const defaultCompanySettings: CompanySettings = {
  name: 'MarArc.Company',
  nameEn: 'MarArc',
  logo: '/images/logo.png',
  slogan: 'الريادة في عالم الرخام والمعمار',
  email: 'mararc.company@gmail.com',
  phone: '01147497465',
  address: 'جمهورية مصر العربية',
  website: 'www.mararc.com',
  taxNumber: 'TAX-2024-MARC-001',
  commercialRegister: 'MARC-2024-001',
  primaryColor: '#1e3a5f',
  secondaryColor: '#d4af37',
  emailjsPublicKey: '',
  emailjsServiceId: '',
  emailjsTemplateId: '',
  dashboardTitle: 'لوحة التحكم الرئيسية',
  employeesTitle: 'إدارة الموظفين',
  clientsTitle: 'إدارة العملاء',
  emailsTitle: 'البريد الإلكتروني الرسمي',
  salariesTitle: 'نظام المرتبات',
  taxesTitle: 'نظام الضرائب',
  orgTitle: 'الهيكل التنظيمي',
  footerText: 'جميع الحقوق محفوظة',
  welcomeMessage: 'مرحباً بك في نظام إدارة الشركة',
  loginTitle: 'تسجيل الدخول',
  loginSubtitle: 'أدخل بيانات حسابك للدخول',
  heroImage: '',
};

// HR الافتراضي
const defaultManager: Employee = {
  id: 'manager-001',
  name: 'HR Manager',
  username: 'admin',
  password: '01147497465',
  nickname: 'HR',
    email: 'mararc.company@gmail.com',
  phone: '01147497465',
  rank: 'مدير عام',
  department: 'الإدارة',
  baseSalary: 50000,
  bonus: 10000,
  deductions: 0,
  taxRate: 14,
  netSalary: calculateNetSalary(50000, 10000, 0, 14),
  joinDate: '2020-01-01',
  status: 'نشط',
  notes: 'HR - الموارد البشرية',
  isManager: true
};

const defaultEmployees: Employee[] = [
  defaultManager,
  {
    id: uuidv4(),
    name: 'أحمد محمد علي',
    username: 'ahmed',
    password: 'ahmed123',
    nickname: 'المهندس أحمد',
    email: 'ahmed@mararc.com',
    phone: '01012345678',
    rank: 'مهندس أول',
    department: 'الهندسة',
    baseSalary: 15000,
    bonus: 2000,
    deductions: 500,
    taxRate: 14,
    netSalary: calculateNetSalary(15000, 2000, 500, 14),
    joinDate: '2023-01-15',
    status: 'نشط',
    notes: 'مهندس معماري متميز بخبرة 10 سنوات',
    isManager: false
  },
  {
    id: uuidv4(),
    name: 'سارة أحمد محمود',
    username: 'sara',
    password: 'sara123',
    nickname: 'المحاسبة سارة',
    email: 'sara@mararc.com',
    phone: '01098765432',
    rank: 'محاسب',
    department: 'المحاسبة',
    baseSalary: 10000,
    bonus: 1000,
    deductions: 300,
    taxRate: 14,
    netSalary: calculateNetSalary(10000, 1000, 300, 14),
    joinDate: '2023-03-20',
    status: 'نشط',
    notes: 'محاسبة قانونية معتمدة',
    isManager: false
  },
  {
    id: uuidv4(),
    name: 'محمود علي حسن',
    username: 'mahmoud',
    password: 'mahmoud123',
    nickname: 'الفني محمود',
    email: 'mahmoud@mararc.com',
    phone: '01112233445',
    rank: 'فني أول',
    department: 'الإنتاج',
    baseSalary: 8000,
    bonus: 500,
    deductions: 200,
    taxRate: 10,
    netSalary: calculateNetSalary(8000, 500, 200, 10),
    joinDate: '2023-06-01',
    status: 'نشط',
    notes: 'فني رخام محترف بخبرة 15 سنة',
    isManager: false
  }
];

const defaultClients: Client[] = [
  {
    id: uuidv4(),
    name: 'شركة الفيصل للمقاولات',
    email: 'info@faisal-construction.com',
    phone: '01055566677',
    address: 'القاهرة - مدينة نصر',
    projectType: 'تكسيات رخام خارجية',
    budget: 500000,
    status: 'قيد التنفيذ',
    registrationDate: '2024-01-10',
    notes: 'مشروع برج سكني فاخر'
  },
  {
    id: uuidv4(),
    name: 'فندق النيل الكبير',
    email: 'projects@nilehotel.com',
    phone: '01099988877',
    address: 'القاهرة - كورنيش النيل',
    projectType: 'أرضيات رخام داخلية',
    budget: 750000,
    status: 'جديد',
    registrationDate: '2024-02-15',
    notes: 'تجديد لوبي الفندق'
  }
];

const defaultEmails: Email[] = [
  {
    id: uuidv4(),
    from: 'mararc.company@gmail.com',
    fromName: 'إدارة الشركة',
    to: 'ahmed@mararc.com',
    toName: 'أحمد محمد',
    subject: 'اجتماع مجلس الإدارة الأسبوعي',
    body: 'نود إبلاغكم بأن الاجتماع الأسبوعي سيعقد يوم الأحد القادم الساعة العاشرة صباحاً.',
    date: '2024-03-01',
    time: '09:30',
    read: true,
    type: 'sent',
    priority: 'مهم'
  }
];

const defaultTaxRecords: TaxRecord[] = [
  {
    id: uuidv4(),
    type: 'ضريبة القيمة المضافة',
    amount: 45000,
    period: 'الربع الأول 2024',
    status: 'مدفوع',
    dueDate: '2024-04-30',
    description: 'ضريبة القيمة المضافة 14%'
  },
  {
    id: uuidv4(),
    type: 'ضريبة الدخل',
    amount: 120000,
    period: 'السنة المالية 2024',
    status: 'معلق',
    dueDate: '2025-03-31',
    description: 'ضريبة الدخل السنوية'
  }
];

// البيانات الافتراضية للأنظمة الجديدة
const defaultInvoices: Invoice[] = [];
const defaultQuotes: Quote[] = [];
const defaultProjects: Project[] = [];
const defaultProjectTasks: ProjectTask[] = [];
const defaultProjectPhases: ProjectPhase[] = [];
const defaultAttendanceRecords: AttendanceRecord[] = [];
const defaultLeaveRequests: LeaveRequest[] = [];
const defaultLeaveBalances: LeaveBalance[] = [];
const defaultInventoryStocks: InventoryStock[] = [];
const defaultStockMovements: StockMovement[] = [];
const defaultSuppliers: Supplier[] = [];
const defaultReports: ReportConfig[] = [];
const defaultCommunications: Communication[] = [];
const defaultPerformanceReviews: PerformanceReview[] = [];
const defaultEmployeePerformances: EmployeePerformance[] = [];
const defaultContracts: Contract[] = [];
const defaultDocuments: Document[] = [];

// نظام الصلاحيات المفصّل
// pages = الصفحات اللي يقدر يشوفها
// actions = الأفعال اللي يقدر يعملها
export interface RankPermission {
  pages: string[];
  actions: {
    canViewAllEmployees: boolean;     // رؤية قائمة كل الموظفين
    canViewOtherSalaries: boolean;    // رؤية مرتبات الآخرين
    canViewOwnSalary: boolean;       // رؤية راتبه فقط
    canAddClient: boolean;           // إضافة عميل
    canEditClient: boolean;          // تعديل عميل
    canDeleteClient: boolean;        // حذف عميل
    canSendEmail: boolean;           // إرسال بريد
    canViewTaxes: boolean;           // رؤية الضرائب
    canEditSettings: boolean;        // تعديل الإعدادات
    canManageEmployees: boolean;     // إضافة/تعديل/حذف موظفين
    canPaySalaries: boolean;         // صرف المرتبات
    canViewActivity: boolean;        // رؤية سجل النشاطات
    canViewOrganization: boolean;    // رؤية الهيكل التنظيمي
  };
}

const rankPermissions: Record<EmployeeRank, RankPermission> = {
  'مدير عام': {
    pages: ['dashboard', 'employees', 'clients', 'emails', 'salaries', 'taxes', 'organization', 'activity', 'settings', 'manager', 'accounting', 'meeting'],
    actions: {
      canViewAllEmployees: true, canViewOtherSalaries: true, canViewOwnSalary: true,
      canAddClient: true, canEditClient: true, canDeleteClient: true,
      canSendEmail: true, canViewTaxes: true, canEditSettings: true,
      canManageEmployees: true, canPaySalaries: true, canViewActivity: true, canViewOrganization: true,
    }
  },
  'مدير قسم': {
    pages: ['dashboard', 'employees', 'clients', 'emails', 'salaries', 'organization', 'activity', 'meeting'],
    actions: {
      canViewAllEmployees: true, canViewOtherSalaries: true, canViewOwnSalary: true,
      canAddClient: true, canEditClient: true, canDeleteClient: false,
      canSendEmail: true, canViewTaxes: false, canEditSettings: false,
      canManageEmployees: false, canPaySalaries: false, canViewActivity: true, canViewOrganization: true,
    }
  },
  'مشرف': {
    pages: ['dashboard', 'employees', 'clients', 'emails', 'organization', 'meeting'],
    actions: {
      canViewAllEmployees: true, canViewOtherSalaries: false, canViewOwnSalary: true,
      canAddClient: true, canEditClient: true, canDeleteClient: false,
      canSendEmail: true, canViewTaxes: false, canEditSettings: false,
      canManageEmployees: false, canPaySalaries: false, canViewActivity: false, canViewOrganization: true,
    }
  },
  'مهندس أول': {
    pages: ['dashboard', 'clients', 'emails', 'organization', 'meeting'],
    actions: {
      canViewAllEmployees: false, canViewOtherSalaries: false, canViewOwnSalary: true,
      canAddClient: true, canEditClient: true, canDeleteClient: false,
      canSendEmail: true, canViewTaxes: false, canEditSettings: false,
      canManageEmployees: false, canPaySalaries: false, canViewActivity: false, canViewOrganization: true,
    }
  },
  'مهندس': {
    pages: ['dashboard', 'clients', 'emails', 'meeting'],
    actions: {
      canViewAllEmployees: false, canViewOtherSalaries: false, canViewOwnSalary: true,
      canAddClient: true, canEditClient: false, canDeleteClient: false,
      canSendEmail: true, canViewTaxes: false, canEditSettings: false,
      canManageEmployees: false, canPaySalaries: false, canViewActivity: false, canViewOrganization: false,
    }
  },
  'فني أول': {
    pages: ['dashboard', 'emails', 'organization', 'meeting'],
    actions: {
      canViewAllEmployees: false, canViewOtherSalaries: false, canViewOwnSalary: true,
      canAddClient: false, canEditClient: false, canDeleteClient: false,
      canSendEmail: true, canViewTaxes: false, canEditSettings: false,
      canManageEmployees: false, canPaySalaries: false, canViewActivity: false, canViewOrganization: true,
    }
  },
  'فني': {
    pages: ['dashboard', 'emails', 'meeting'],
    actions: {
      canViewAllEmployees: false, canViewOtherSalaries: false, canViewOwnSalary: true,
      canAddClient: false, canEditClient: false, canDeleteClient: false,
      canSendEmail: true, canViewTaxes: false, canEditSettings: false,
      canManageEmployees: false, canPaySalaries: false, canViewActivity: false, canViewOrganization: false,
    }
  },
  'محاسب': {
    pages: ['dashboard', 'employees', 'salaries', 'taxes', 'emails', 'clients', 'accounting', 'meeting'],
    actions: {
      canViewAllEmployees: true, canViewOtherSalaries: true, canViewOwnSalary: true,
      canAddClient: true, canEditClient: true, canDeleteClient: false,
      canSendEmail: true, canViewTaxes: true, canEditSettings: false,
      canManageEmployees: false, canPaySalaries: true, canViewActivity: true, canViewOrganization: false,
    }
  },
  'موظف استقبال': {
    pages: ['dashboard', 'clients', 'emails', 'meeting'],
    actions: {
      canViewAllEmployees: false, canViewOtherSalaries: false, canViewOwnSalary: true,
      canAddClient: true, canEditClient: false, canDeleteClient: false,
      canSendEmail: true, canViewTaxes: false, canEditSettings: false,
      canManageEmployees: false, canPaySalaries: false, canViewActivity: false, canViewOrganization: false,
    }
  },
  'عامل': {
    pages: ['dashboard', 'emails', 'meeting'],
    actions: {
      canViewAllEmployees: false, canViewOtherSalaries: false, canViewOwnSalary: true,
      canAddClient: false, canEditClient: false, canDeleteClient: false,
      canSendEmail: false, canViewTaxes: false, canEditSettings: false,
      canManageEmployees: false, canPaySalaries: false, canViewActivity: false, canViewOrganization: false,
    }
  }
};

export const getPermissions = (rank: EmployeeRank): RankPermission => {
  return rankPermissions[rank] || rankPermissions['عامل'];
};

// Firebase يحوّل Arrays لـ Objects - هذه الدالة تحوّلها لـ Array دائماً
const toArray = <T,>(data: unknown, fallback: T[] = []): T[] => {
  if (!data) return fallback;
  if (Array.isArray(data)) return data;
  if (typeof data === 'object' && data !== null) return Object.values(data) as T[];
  return fallback;
};

const syncDataToFirebase = async (data: any) => {
  try {
    const updates: Record<string, unknown> = {};
    
    if (data.employees !== undefined) updates['employees'] = data.employees;
    if (data.clients !== undefined) updates['clients'] = data.clients;
    if (data.emails !== undefined) updates['emails'] = data.emails;
    if (data.salaryRecords !== undefined) updates['salaryRecords'] = data.salaryRecords;
    if (data.taxRecords !== undefined) updates['taxRecords'] = data.taxRecords;
    if (data.activityLogs !== undefined) updates['activityLogs'] = data.activityLogs;
    if (data.notifications !== undefined) updates['notifications'] = data.notifications;
    if (data.companySettings !== undefined) updates['companySettings'] = data.companySettings;
    if (data.accountingEntries !== undefined) updates['accountingEntries'] = data.accountingEntries;
    if (data.inventory !== undefined) updates['inventory'] = data.inventory;
    if (data.sales !== undefined) updates['sales'] = data.sales;
    if (data.expenses !== undefined) updates['expenses'] = data.expenses;
    if (data.chatMessages !== undefined) updates['chatMessages'] = data.chatMessages;
    
    updates['lastSync'] = new Date().toISOString();
    
    await update(ref(database), updates);
  } catch (error) {
    console.error('Firebase sync error:', error);
  }
};

export const useStore = create<AppState>((set, get) => ({
  isLoggedIn: false,
  currentUser: null,
  isManagerLoggedIn: false,
  currentPage: 'dashboard',
  employees: defaultEmployees,
  clients: defaultClients,
  emails: defaultEmails,
  salaryRecords: [],
  taxRecords: defaultTaxRecords,
  activityLogs: [],
  notifications: [],
  accountingEntries: [],
  inventory: [],
  sales: [],
  expenses: [],
  chatMessages: [],
  
  // الأنظمة الجديدة
  invoices: defaultInvoices,
  quotes: defaultQuotes,
  projects: defaultProjects,
  projectTasks: defaultProjectTasks,
  projectPhases: defaultProjectPhases,
  attendanceRecords: defaultAttendanceRecords,
  leaveRequests: defaultLeaveRequests,
  leaveBalances: defaultLeaveBalances,
  inventoryStocks: defaultInventoryStocks,
  stockMovements: defaultStockMovements,
  suppliers: defaultSuppliers,
  reports: defaultReports,
  communications: defaultCommunications,
  performanceReviews: defaultPerformanceReviews,
  employeePerformances: defaultEmployeePerformances,
  contracts: defaultContracts,
  documents: defaultDocuments,

  companySettings: defaultCompanySettings,
  lastSync: new Date().toISOString(),
  isOnline: true,
  isLoading: true,
  loginError: '',

  initializeFirebase: () => {
    // استمع لكل مسار على حدة لتجنب مشاكل الـ overwrite
    const paths: [string, string, any[]][] = [
      ['employees', 'employees', defaultEmployees],
      ['clients', 'clients', defaultClients],
      ['emails', 'emails', defaultEmails],
      ['salaryRecords', 'salaryRecords', []],
      ['taxRecords', 'taxRecords', defaultTaxRecords],
      ['activityLogs', 'activityLogs', []],
      ['notifications', 'notifications', []],
      ['accountingEntries', 'accountingEntries', []],
      ['inventory', 'inventory', []],
      ['sales', 'sales', []],
      ['expenses', 'expenses', []],
      ['chatMessages', 'chatMessages', []],
    ];

    let loadedCount = 0;
    const totalPaths = paths.length + 1; // +1 for companySettings

    paths.forEach(([fbPath, stateKey, fallback]) => {
      onValue(ref(database, fbPath), (snapshot) => {
        const val = snapshot.val();
        let arr = toArray<any>(val, fallback);
        
        // تأكد من وجود HR في الموظفين
        if (stateKey === 'employees') {
          const hasManager = arr.some((e: any) => e && e.isManager === true);
          if (!hasManager) arr = [defaultManager, ...arr];
          // تحديث currentUser
          const { currentUser } = get();
          if (currentUser) {
            const fresh = arr.find((e: any) => e && e.id === currentUser.id);
            if (fresh) set({ currentUser: fresh });
          }
        }
        
        set({ [stateKey]: arr, isOnline: true } as any);
        loadedCount++;
        if (loadedCount >= totalPaths) set({ isLoading: false });
      }, () => {
        set({ isOnline: false });
        loadedCount++;
        if (loadedCount >= totalPaths) set({ isLoading: false });
      });
    });

    // companySettings
    onValue(ref(database, 'companySettings'), (snapshot) => {
      const val = snapshot.val();
      if (val) set({ companySettings: val });
      loadedCount++;
      if (loadedCount >= totalPaths) set({ isLoading: false });
    }, () => {
      loadedCount++;
      if (loadedCount >= totalPaths) set({ isLoading: false });
    });

    // lastSync
    onValue(ref(database, 'lastSync'), (snapshot) => {
      const val = snapshot.val();
      if (val) set({ lastSync: val });
    });

    // لو أول مرة - أرسل البيانات الافتراضية بعد ثانيتين
    setTimeout(() => {
      const { isLoading: still } = get();
      if (still) {
        syncDataToFirebase({
          employees: defaultEmployees,
          clients: defaultClients,
          emails: defaultEmails,
          salaryRecords: [],
          taxRecords: defaultTaxRecords,
          activityLogs: [],
          notifications: [],
          companySettings: defaultCompanySettings,
          chatMessages: [],
        });
        set({ isLoading: false });
      }
    }, 3000);
  },

  syncToFirebase: () => {
    const state = get();
    syncDataToFirebase({
      employees: state.employees,
      clients: state.clients,
      emails: state.emails,
      salaryRecords: state.salaryRecords,
      taxRecords: state.taxRecords,
      activityLogs: state.activityLogs,
      notifications: state.notifications,
      companySettings: state.companySettings,
    });
  },

  login: (username: string, password: string) => {
    const employees = toArray<Employee>(get().employees, []);
    
    const employee = employees.find(e => 
      e.username && e.password &&
      e.username.toLowerCase() === username.toLowerCase() && 
      e.password === password &&
      e.status === 'نشط'
    );
    
    if (employee) {
      const isManager = employee.isManager === true || employee.rank === 'مدير عام';
      
      // تحديث آخر تسجيل دخول
      const updatedEmployees = employees.map(e => 
        e.id === employee.id ? { ...e, lastLogin: new Date().toISOString() } : e
      );
      
      set({ 
        isLoggedIn: true, 
        currentUser: { ...employee, lastLogin: new Date().toISOString() },
        isManagerLoggedIn: isManager,
        employees: updatedEmployees,
        loginError: ''
      });
      
      syncDataToFirebase({ employees: updatedEmployees });
      
      get().addActivityLog({ 
        action: 'تسجيل دخول', 
        user: employee.name, 
        details: `تم تسجيل دخول ${employee.name} (${employee.rank})`, 
        type: 'login' 
      });
      
      get().addNotification({ 
        title: `مرحباً ${employee.name}`, 
        message: `تم تسجيل دخولك بنجاح كـ ${employee.rank}`, 
        type: 'success' 
      });
      
      return true;
    } else {
      const blockedEmployee = employees.find(e => 
        e.username && e.password &&
        e.username.toLowerCase() === username.toLowerCase() && 
        e.password === password
      );
      
      if (blockedEmployee && blockedEmployee.status !== 'نشط') {
        set({ loginError: `حسابك ${blockedEmployee.status === 'معلق' ? 'معلق' : 'مفصول'}. تواصل مع الإدارة.` });
      } else {
        set({ loginError: 'اسم الموظف أو كلمة المرور غير صحيحة' });
      }
      return false;
    }
  },

  logout: () => {
    const { currentUser } = get();
    if (currentUser) {
      get().addActivityLog({ 
        action: 'تسجيل خروج', 
        user: currentUser.name, 
        details: `تم تسجيل خروج ${currentUser.name}`, 
        type: 'login' 
      });
    }
    set({ 
      isLoggedIn: false, 
      currentUser: null, 
      isManagerLoggedIn: false,
      currentPage: 'dashboard',
      loginError: ''
    });
  },

  setCurrentPage: (page: string) => set({ currentPage: page }),

  canAccess: (feature: string) => {
    const { currentUser, isManagerLoggedIn } = get();
    if (!currentUser) return false;
    if (isManagerLoggedIn) return true;
    
    const perm = rankPermissions[currentUser.rank];
    if (!perm) return false;
    return perm.pages.includes(feature);
  },

  updateCompanySettings: (settings) => {
    const { isManagerLoggedIn, currentUser } = get();
    if (!isManagerLoggedIn) return;
    
    const newSettings = { ...get().companySettings, ...settings };
    set({ companySettings: newSettings, lastSync: new Date().toISOString() });
    syncDataToFirebase({ companySettings: newSettings });
    get().addActivityLog({ action: 'تحديث إعدادات', user: currentUser?.name || 'HR', details: 'تم تحديث إعدادات الشركة', type: 'settings' });
    get().addNotification({ title: 'تم التحديث', message: 'تم حفظ إعدادات الشركة بنجاح', type: 'success' });
  },

  addEmployee: (emp) => {
    const { currentUser } = get();
    const employees = toArray<Employee>(get().employees, []);
    
    const netSalary = calculateNetSalary(emp.baseSalary, emp.bonus, emp.deductions, emp.taxRate);
    const newEmployee: Employee = {
      id: uuidv4(),
      name: emp.name,
      username: emp.username,
      password: emp.password,
      nickname: emp.nickname || emp.name,
      email: emp.email || '',
      phone: emp.phone || '',
      rank: emp.rank,
      department: emp.department,
      baseSalary: emp.baseSalary,
      bonus: emp.bonus,
      deductions: emp.deductions,
      taxRate: emp.taxRate,
      netSalary,
      joinDate: emp.joinDate,
      status: emp.status,
      notes: emp.notes || '',
      isManager: false,
    };
    const newEmployees = [...employees, newEmployee];
    set({ employees: newEmployees, lastSync: new Date().toISOString() });
    syncDataToFirebase({ employees: newEmployees });
    get().addActivityLog({ action: 'إضافة موظف', user: currentUser?.name || 'HR', details: `تم إضافة الموظف: ${emp.name} - اسم الموظف: ${emp.username}`, type: 'employee' });
    get().addNotification({ title: 'تم بنجاح ✓', message: `تم إضافة ${emp.name} إلى قائمة الموظفين`, type: 'success' });
  },

  updateEmployee: (id, updates) => {
    const { isManagerLoggedIn, currentUser } = get();
    const employees = toArray<Employee>(get().employees, []);
    
    // لا يمكن تعديل HR الرئيسي إلا من قبله
    const targetEmployee = employees.find(e => e.id === id);
    if (targetEmployee?.isManager && currentUser?.id !== id && !currentUser?.isManager) return;
    
    // فقط HR يمكنه تعديل الموظفين الآخرين
    if (id !== currentUser?.id && !isManagerLoggedIn) return;
    
    const newEmployees = employees.map((emp) => {
      if (emp.id === id) {
        const updated = { ...emp, ...updates };
        updated.netSalary = calculateNetSalary(updated.baseSalary, updated.bonus, updated.deductions, updated.taxRate);
        return updated;
      }
      return emp;
    });
    set({ employees: newEmployees, lastSync: new Date().toISOString() });
    syncDataToFirebase({ employees: newEmployees });
    get().addActivityLog({ action: 'تحديث موظف', user: currentUser?.name || 'HR', details: `تم تحديث بيانات موظف`, type: 'employee' });
  },

  deleteEmployee: (id) => {
    const { isManagerLoggedIn, currentUser } = get();
    if (!isManagerLoggedIn) return;
    const employees = toArray<Employee>(get().employees, []);
    
    const targetEmployee = employees.find(e => e.id === id);
    if (targetEmployee?.isManager) {
      get().addNotification({ title: 'خطأ', message: 'لا يمكن حذف حساب HR الرئيسي', type: 'error' });
      return;
    }
    
    const newEmployees = employees.filter((e) => e.id !== id);
    set({ employees: newEmployees, lastSync: new Date().toISOString() });
    syncDataToFirebase({ employees: newEmployees });
    if (targetEmployee) {
      get().addActivityLog({ action: 'حذف موظف', user: currentUser?.name || 'HR', details: `تم حذف الموظف: ${targetEmployee.name}`, type: 'employee' });
      get().addNotification({ title: 'تم الحذف', message: `تم حذف ${targetEmployee.name}`, type: 'warning' });
    }
  },

  updateEmployeeRank: (id, rank) => {
    const { isManagerLoggedIn, currentUser } = get();
    if (!isManagerLoggedIn) return;
    const employees = toArray<Employee>(get().employees, []);
    
    const emp = employees.find(e => e.id === id);
    const newEmployees = employees.map((e) => e.id === id ? { ...e, rank } : e);
    set({ employees: newEmployees, lastSync: new Date().toISOString() });
    syncDataToFirebase({ employees: newEmployees });
    if (emp) {
      get().addActivityLog({ action: 'تغيير رتبة', user: currentUser?.name || 'HR', details: `تم تغيير رتبة ${emp.name} إلى ${rank}`, type: 'employee' });
      get().addNotification({ title: 'تغيير الرتبة', message: `تم ترقية/تعديل رتبة ${emp.name}`, type: 'info' });
    }
  },

  addClient: (client) => {
    const { currentUser, canAccess } = get();
    if (!canAccess('clients')) return;
    
    const newClient = { ...client, id: uuidv4() };
    const newClients = [...toArray<Client>(get().clients, []), newClient];
    set({ clients: newClients, lastSync: new Date().toISOString() });
    syncDataToFirebase({ clients: newClients });
    get().addActivityLog({ action: 'تسجيل عميل', user: currentUser?.name || 'النظام', details: `تم تسجيل العميل: ${client.name}`, type: 'client' });
    get().addNotification({ title: 'عميل جديد', message: `تم تسجيل ${client.name} في قاعدة البيانات`, type: 'success' });
  },

  updateClient: (id, updates) => {
    const { currentUser, canAccess } = get();
    if (!canAccess('clients')) return;
    
    const newClients = toArray<Client>(get().clients, []).map((c) => c.id === id ? { ...c, ...updates } : c);
    set({ clients: newClients, lastSync: new Date().toISOString() });
    syncDataToFirebase({ clients: newClients });
    get().addActivityLog({ action: 'تحديث عميل', user: currentUser?.name || 'النظام', details: 'تم تحديث بيانات عميل', type: 'client' });
  },

  deleteClient: (id) => {
    const { isManagerLoggedIn, currentUser } = get();
    if (!isManagerLoggedIn) return;
    const clients = toArray<Client>(get().clients, []);
    
    const client = clients.find(c => c.id === id);
    const newClients = clients.filter((c) => c.id !== id);
    set({ clients: newClients, lastSync: new Date().toISOString() });
    syncDataToFirebase({ clients: newClients });
    if (client) {
      get().addActivityLog({ action: 'حذف عميل', user: currentUser?.name || 'HR', details: `تم حذف العميل: ${client.name}`, type: 'client' });
    }
  },

  addEmail: (email) => {
    const newEmail = { ...email, id: uuidv4() };
    const newEmails = [...toArray<Email>(get().emails, []), newEmail];
    set({ emails: newEmails, lastSync: new Date().toISOString() });
    syncDataToFirebase({ emails: newEmails });
  },

  markEmailRead: (id) => {
    const newEmails = toArray<Email>(get().emails, []).map((e) => e.id === id ? { ...e, read: true } : e);
    set({ emails: newEmails });
    syncDataToFirebase({ emails: newEmails });
  },

  deleteEmail: (id) => {
    const newEmails = toArray<Email>(get().emails, []).filter((e) => e.id !== id);
    set({ emails: newEmails, lastSync: new Date().toISOString() });
    syncDataToFirebase({ emails: newEmails });
  },

  sendRealEmail: (to, toName, subject, body, priority) => {
    const { companySettings, currentUser } = get();
    const companyEmail = companySettings.email || 'mararc.company@gmail.com';
    const senderName = currentUser?.name || companySettings.name;
    const fullSubject = `[${companySettings.name}] ${subject}`;

    const fullBody = `إلى: ${toName}
من: ${senderName} - ${companySettings.name}

${body}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${companySettings.name}
${companySettings.slogan}
📧 ${companyEmail}
📞 ${companySettings.phone}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    const emailRecord = {
      from: companyEmail,
      fromName: senderName,
      to,
      toName,
      subject: fullSubject,
      body,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      read: true,
      type: 'sent' as const,
      priority
    };

    get().addEmail(emailRecord);

    // فتح Gmail مع الرسالة جاهزة
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(fullSubject)}&body=${encodeURIComponent(fullBody)}`;
    window.open(gmailUrl, '_blank');

    get().addNotification({ title: '📧 تم فتح Gmail', message: `رسالة جاهزة لـ ${toName} - اضغط إرسال في Gmail`, type: 'success' });
  },

  addSalaryRecord: (record) => {
    const newRecord = { ...record, id: uuidv4() };
    const newRecords = [...toArray<SalaryRecord>(get().salaryRecords, []), newRecord];
    set({ salaryRecords: newRecords, lastSync: new Date().toISOString() });
    syncDataToFirebase({ salaryRecords: newRecords });
  },

  paySalary: (id) => {
    const { isManagerLoggedIn, currentUser } = get();
    const isAccountant = currentUser?.rank === 'محاسب';
    if (!isManagerLoggedIn && !isAccountant) return;
    const salaryRecords = toArray<SalaryRecord>(get().salaryRecords, []);
    
    const record = salaryRecords.find(r => r.id === id);
    const newRecords = salaryRecords.map((r) =>
      r.id === id ? { ...r, status: 'مدفوع' as const, paidDate: new Date().toISOString().split('T')[0] } : r
    );
    set({ salaryRecords: newRecords, lastSync: new Date().toISOString() });
    syncDataToFirebase({ salaryRecords: newRecords });
    if (record) {
      get().addActivityLog({ action: 'صرف راتب', user: currentUser?.name || 'HR', details: `تم صرف راتب ${record.employeeName} بمبلغ ${record.netSalary} ج.م`, type: 'salary' });
      get().addNotification({ title: 'تم الصرف', message: `تم صرف راتب ${record.employeeName}`, type: 'success' });
    }
  },

  generateMonthlySalaries: (month) => {
    const { isManagerLoggedIn, currentUser } = get();
    const isAccountant = currentUser?.rank === 'محاسب';
    if (!isManagerLoggedIn && !isAccountant) return;
    const employees = toArray<Employee>(get().employees, []);
    const salaryRecords = toArray<SalaryRecord>(get().salaryRecords, []);
    
    const existingForMonth = salaryRecords.filter(r => r.month === month);
    const existingEmployeeIds = new Set(existingForMonth.map(r => r.employeeId));
    
    const newRecords: SalaryRecord[] = employees
      .filter(emp => emp.status === 'نشط' && !existingEmployeeIds.has(emp.id))
      .map(emp => {
        const taxAmount = Math.round((emp.baseSalary + emp.bonus - emp.deductions) * (emp.taxRate / 100));
        return {
          id: uuidv4(),
          employeeId: emp.id,
          employeeName: emp.name,
          month,
          baseSalary: emp.baseSalary,
          bonus: emp.bonus,
          deductions: emp.deductions,
          taxRate: emp.taxRate,
          taxAmount,
          netSalary: emp.netSalary,
          status: 'معلق' as const
        };
      });

    if (newRecords.length > 0) {
      const allRecords = [...salaryRecords, ...newRecords];
      set({ salaryRecords: allRecords, lastSync: new Date().toISOString() });
      syncDataToFirebase({ salaryRecords: allRecords });
      get().addActivityLog({ action: 'توليد مرتبات', user: currentUser?.name || 'HR', details: `تم توليد ${newRecords.length} سجل مرتبات لشهر ${month}`, type: 'salary' });
      get().addNotification({ title: 'تم التوليد', message: `تم إنشاء ${newRecords.length} سجل مرتبات`, type: 'success' });
    }
  },

  addTaxRecord: (record) => {
    const { isManagerLoggedIn, currentUser } = get();
    if (!isManagerLoggedIn) return;
    
    const newRecord = { ...record, id: uuidv4() };
    const newRecords = [...toArray<TaxRecord>(get().taxRecords, []), newRecord];
    set({ taxRecords: newRecords, lastSync: new Date().toISOString() });
    syncDataToFirebase({ taxRecords: newRecords });
    get().addActivityLog({ action: 'إضافة ضريبة', user: currentUser?.name || 'HR', details: `تم إضافة ${record.type}`, type: 'tax' });
  },

  updateTaxRecord: (id, updates) => {
    const { isManagerLoggedIn } = get();
    if (!isManagerLoggedIn) return;
    
    const newRecords = toArray<TaxRecord>(get().taxRecords, []).map((t) => t.id === id ? { ...t, ...updates } : t);
    set({ taxRecords: newRecords, lastSync: new Date().toISOString() });
    syncDataToFirebase({ taxRecords: newRecords });
  },

  deleteTaxRecord: (id) => {
    const { isManagerLoggedIn } = get();
    if (!isManagerLoggedIn) return;
    
    const newRecords = toArray<TaxRecord>(get().taxRecords, []).filter((t) => t.id !== id);
    set({ taxRecords: newRecords, lastSync: new Date().toISOString() });
    syncDataToFirebase({ taxRecords: newRecords });
  },

  addActivityLog: (log) => {
    const newLog = { ...log, id: uuidv4(), timestamp: new Date().toISOString() };
    const newLogs = [newLog, ...toArray<ActivityLog>(get().activityLogs, []).slice(0, 99)];
    set({ activityLogs: newLogs });
    syncDataToFirebase({ activityLogs: newLogs });
  },

  addNotification: (notif) => {
    const newNotif = { ...notif, id: uuidv4(), timestamp: new Date().toISOString(), read: false };
    const newNotifs = [newNotif, ...toArray<Notification>(get().notifications, []).slice(0, 49)];
    set({ notifications: newNotifs });
    syncDataToFirebase({ notifications: newNotifs });
  },

  markNotificationRead: (id) => {
    const newNotifs = toArray<Notification>(get().notifications, []).map((n) => n.id === id ? { ...n, read: true } : n);
    set({ notifications: newNotifs });
    syncDataToFirebase({ notifications: newNotifs });
  },

  clearAllNotifications: () => {
    set({ notifications: [] });
    syncDataToFirebase({ notifications: [] });
  },

  // === نظام المحاسبة ===
  addAccountingEntry: (entry) => {
    const newEntry = { ...entry, id: uuidv4() };
    const newEntries = [...toArray<AccountingEntry>(get().accountingEntries, []), newEntry];
    set({ accountingEntries: newEntries });
    syncDataToFirebase({ accountingEntries: newEntries } as any);
    get().addActivityLog({ action: 'قيد محاسبي', user: get().currentUser?.name || '', details: `${entry.type}: ${entry.amount} ج.م - ${entry.description}`, type: 'system' });
  },

  deleteAccountingEntry: (id) => {
    const newEntries = toArray<AccountingEntry>(get().accountingEntries, []).filter(e => e.id !== id);
    set({ accountingEntries: newEntries });
    syncDataToFirebase({ accountingEntries: newEntries } as any);
  },

  addInventoryItem: (item) => {
    const newItem = { ...item, id: uuidv4(), totalValue: item.quantity * item.unitPrice };
    const newItems = [...toArray<InventoryItem>(get().inventory, []), newItem];
    set({ inventory: newItems });
    syncDataToFirebase({ inventory: newItems } as any);
  },

  updateInventoryItem: (id, updates) => {
    const newItems = toArray<InventoryItem>(get().inventory, []).map(i => {
      if (i.id === id) {
        const u = { ...i, ...updates };
        u.totalValue = u.quantity * u.unitPrice;
        u.lastUpdated = new Date().toISOString().split('T')[0];
        return u;
      }
      return i;
    });
    set({ inventory: newItems });
    syncDataToFirebase({ inventory: newItems } as any);
  },

  deleteInventoryItem: (id) => {
    const newItems = toArray<InventoryItem>(get().inventory, []).filter(i => i.id !== id);
    set({ inventory: newItems });
    syncDataToFirebase({ inventory: newItems } as any);
  },

  addSale: (sale) => {
    const vatAmount = Math.round(sale.total * (sale.vatRate / 100));
    const grandTotal = sale.total + vatAmount;
    const newSale = { ...sale, id: uuidv4(), vatAmount, grandTotal };
    const newSales = [...toArray<SaleRecord>(get().sales, []), newSale];
    set({ sales: newSales });
    syncDataToFirebase({ sales: newSales } as any);
    // قيد دائن تلقائي
    get().addAccountingEntry({ date: sale.date, type: 'دائن', category: 'مبيعات', description: `فاتورة بيع: ${sale.clientName} - ${sale.items}`, amount: grandTotal, reference: `INV-${newSale.id.slice(0, 6)}`, createdBy: get().currentUser?.name || '' });
  },

  deleteSale: (id) => {
    const newSales = toArray<SaleRecord>(get().sales, []).filter(s => s.id !== id);
    set({ sales: newSales });
    syncDataToFirebase({ sales: newSales } as any);
  },

  addExpense: (expense) => {
    const newExpense = { ...expense, id: uuidv4() };
    const newExpenses = [...toArray<ExpenseRecord>(get().expenses, []), newExpense];
    set({ expenses: newExpenses });
    syncDataToFirebase({ expenses: newExpenses } as any);
    // قيد مدين تلقائي
    get().addAccountingEntry({ date: expense.date, type: 'مدين', category: expense.category, description: expense.description, amount: expense.amount, reference: `EXP-${newExpense.id.slice(0, 6)}`, createdBy: get().currentUser?.name || '' });
  },

  deleteExpense: (id) => {
    const newExpenses = toArray<ExpenseRecord>(get().expenses, []).filter(e => e.id !== id);
    set({ expenses: newExpenses });
    syncDataToFirebase({ expenses: newExpenses } as any);
  },

  // === غرفة الاجتماعات ===
  sendChatMessage: (text) => {
    const { currentUser } = get();
    if (!currentUser || !text.trim()) return;
    
    const msg: ChatMessage = {
      id: uuidv4(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRank: currentUser.rank,
      senderAvatar: currentUser.avatar || '',
      isManager: currentUser.isManager === true || currentUser.rank === 'مدير عام',
      text: text.trim(),
      timestamp: new Date().toISOString(),
      type: 'text',
    };
    
    const currentMsgs = toArray<ChatMessage>(get().chatMessages, []);
    const newMsgs = [...currentMsgs, msg];
    
    // حفظ محلي فوراً
    set({ chatMessages: newMsgs });
    
    // حفظ في Firebase - على مسار chatMessages مباشرة
    import('../firebase/config').then(({ database, ref, update }) => {
      update(ref(database), { chatMessages: newMsgs })
        .then(() => console.log('✅ Chat saved'))
        .catch((err: any) => {
          console.error('❌ Chat save failed:', err);
          set({ isOnline: false });
        });
    });
  },

  clearChat: () => {
    set({ chatMessages: [] });
    import('../firebase/config').then(({ database, ref, update }) => {
      update(ref(database), { chatMessages: [] }).catch(console.error);
    });
  },

  // 1️⃣ نظام الفواتير والعروض
  addInvoice: (invoice) => set((state) => {
    const newInvoice = { ...invoice, id: uuidv4() } as Invoice;
    const updated = [...state.invoices, newInvoice];
    set({ invoices: updated });
    state.addActivityLog({ action: 'إنشاء فاتورة', user: state.currentUser?.name || '', details: `رقم الفاتورة: ${invoice.invoiceNumber}`, type: 'client' });
    return { invoices: updated };
  }),
  updateInvoice: (id, updates) => set((state) => {
    const updated = state.invoices.map(i => i.id === id ? { ...i, ...updates } : i);
    state.addActivityLog({ action: 'تحديث فاتورة', user: state.currentUser?.name || '', details: `الفاتورة: ${id}`, type: 'client' });
    return { invoices: updated };
  }),
  deleteInvoice: (id) => set((state) => {
    const updated = state.invoices.filter(i => i.id !== id);
    state.addActivityLog({ action: 'حذف فاتورة', user: state.currentUser?.name || '', details: `الفاتورة: ${id}`, type: 'client' });
    return { invoices: updated };
  }),
  addQuote: (quote) => set((state) => {
    const newQuote = { ...quote, id: uuidv4() } as Quote;
    const updated = [...state.quotes, newQuote];
    set({ quotes: updated });
    state.addActivityLog({ action: 'إنشاء عرض أسعار', user: state.currentUser?.name || '', details: `رقم العرض: ${quote.quoteNumber}`, type: 'client' });
    return { quotes: updated };
  }),
  updateQuote: (id, updates) => set((state) => {
    const updated = state.quotes.map(q => q.id === id ? { ...q, ...updates } : q);
    state.addActivityLog({ action: 'تحديث عرض أسعار', user: state.currentUser?.name || '', details: `العرض: ${id}`, type: 'client' });
    return { quotes: updated };
  }),
  deleteQuote: (id) => set((state) => {
    const updated = state.quotes.filter(q => q.id !== id);
    state.addActivityLog({ action: 'حذف عرض أسعار', user: state.currentUser?.name || '', details: `العرض: ${id}`, type: 'client' });
    return { quotes: updated };
  }),

  // 2️⃣ نظام إدارة المشاريع
  addProject: (project) => set((state) => {
    const newProject = { ...project, id: uuidv4(), tasks: [] } as Project;
    const updated = [...state.projects, newProject];
    state.addActivityLog({ action: 'إنشاء مشروع جديد', user: state.currentUser?.name || '', details: `المشروع: ${project.name}`, type: 'client' });
    return { projects: updated };
  }),
  updateProject: (id, updates) => set((state) => {
    const updated = state.projects.map(p => p.id === id ? { ...p, ...updates } : p);
    state.addActivityLog({ action: 'تحديث المشروع', user: state.currentUser?.name || '', details: `المشروع: ${id}`, type: 'client' });
    return { projects: updated };
  }),
  deleteProject: (id) => set((state) => {
    const updated = state.projects.filter(p => p.id !== id);
    state.addActivityLog({ action: 'حذف مشروع', user: state.currentUser?.name || '', details: `المشروع: ${id}`, type: 'client' });
    return { projects: updated };
  }),
  addProjectTask: (task) => set((state) => {
    const newTask = { ...task, id: uuidv4() } as ProjectTask;
    const updated = [...state.projectTasks, newTask];
    return { projectTasks: updated };
  }),
  updateProjectTask: (id, updates) => set((state) => {
    const updated = state.projectTasks.map(t => t.id === id ? { ...t, ...updates } : t);
    return { projectTasks: updated };
  }),
  deleteProjectTask: (id) => set((state) => {
    const updated = state.projectTasks.filter(t => t.id !== id);
    return { projectTasks: updated };
  }),
  addProjectPhase: (phase) => set((state) => {
    const newPhase = { ...phase, id: uuidv4() } as ProjectPhase;
    const updated = [...state.projectPhases, newPhase];
    return { projectPhases: updated };
  }),
  updateProjectPhase: (id, updates) => set((state) => {
    const updated = state.projectPhases.map(p => p.id === id ? { ...p, ...updates } : p);
    return { projectPhases: updated };
  }),
  deleteProjectPhase: (id) => set((state) => {
    const updated = state.projectPhases.filter(p => p.id !== id);
    return { projectPhases: updated };
  }),

  // 3️⃣ نظام الإجازات والحضور
  addAttendanceRecord: (record) => set((state) => {
    const newRecord = { ...record, id: uuidv4() } as AttendanceRecord;
    const updated = [...state.attendanceRecords, newRecord];
    return { attendanceRecords: updated };
  }),
  updateAttendanceRecord: (id, updates) => set((state) => {
    const updated = state.attendanceRecords.map(r => r.id === id ? { ...r, ...updates } : r);
    return { attendanceRecords: updated };
  }),
  deleteAttendanceRecord: (id) => set((state) => {
    const updated = state.attendanceRecords.filter(r => r.id !== id);
    return { attendanceRecords: updated };
  }),
  addLeaveRequest: (request) => set((state) => {
    const newRequest = { ...request, id: uuidv4() } as LeaveRequest;
    const updated = [...state.leaveRequests, newRequest];
    state.addNotification({ title: 'طلب إجازة جديد', message: `تم استقبال طلب إجازة من ${request.employeeName}`, type: 'info' });
    return { leaveRequests: updated };
  }),
  approveLeaveRequest: (id, approvedBy) => set((state) => {
    const updated = state.leaveRequests.map(r => r.id === id ? { ...r, status: 'موافق عليها' as const, approvedBy, approvalDate: new Date().toISOString().split('T')[0] } : r);
    return { leaveRequests: updated };
  }),
  rejectLeaveRequest: (id) => set((state) => {
    const updated = state.leaveRequests.map(r => r.id === id ? { ...r, status: 'مرفوضة' as const } : r);
    return { leaveRequests: updated };
  }),
  updateLeaveBalance: (id, balance) => set((state) => {
    const updated = state.leaveBalances.map(b => b.id === id ? { ...b, ...balance } : b);
    return { leaveBalances: updated };
  }),

  // 4️⃣ نظام إدارة المخزون
  addInventoryStock: (stock) => set((state) => {
    const newStock = { ...stock, id: uuidv4() } as InventoryStock;
    const updated = [...state.inventoryStocks, newStock];
    return { inventoryStocks: updated };
  }),
  updateInventoryStock: (id, updates) => set((state) => {
    const updated = state.inventoryStocks.map(s => s.id === id ? { ...s, ...updates } : s);
    return { inventoryStocks: updated };
  }),
  deleteInventoryStock: (id) => set((state) => {
    const updated = state.inventoryStocks.filter(s => s.id !== id);
    return { inventoryStocks: updated };
  }),
  addStockMovement: (movement) => set((state) => {
    const newMovement = { ...movement, id: uuidv4() } as StockMovement;
    const updated = [...state.stockMovements, newMovement];
    if (movement.movementType === 'إضافة') {
      const stock = state.inventoryStocks.find(s => s.id === movement.itemId);
      if (stock) state.updateInventoryStock(movement.itemId, { quantity: stock.quantity + movement.quantity });
    } else if (movement.movementType === 'إخراج') {
      const stock = state.inventoryStocks.find(s => s.id === movement.itemId);
      if (stock) state.updateInventoryStock(movement.itemId, { quantity: Math.max(0, stock.quantity - movement.quantity) });
    }
    return { stockMovements: updated };
  }),
  addSupplier: (supplier) => set((state) => {
    const newSupplier = { ...supplier, id: uuidv4() } as Supplier;
    const updated = [...state.suppliers, newSupplier];
    return { suppliers: updated };
  }),
  updateSupplier: (id, updates) => set((state) => {
    const updated = state.suppliers.map(s => s.id === id ? { ...s, ...updates } : s);
    return { suppliers: updated };
  }),
  deleteSupplier: (id) => set((state) => {
    const updated = state.suppliers.filter(s => s.id !== id);
    return { suppliers: updated };
  }),

  // 5️⃣ نظام التقارير
  generateReport: (config) => {
    const state = get();
    const reportData: any = {};
    
    if (config.type === 'مبيعات') {
      reportData.totalSales = state.sales.reduce((s: number, r: SaleRecord) => s + (r.total || 0), 0);
      reportData.salesCount = state.sales.length;
      reportData.sales = state.sales;
    } else if (config.type === 'موظفين') {
      reportData.employeeCount = state.employees.length;
      reportData.totalSalaries = state.employees.reduce((s: number, e: Employee) => s + (e.netSalary || 0), 0);
      reportData.employees = state.employees;
    }
    
    return reportData;
  },
  saveReportConfig: (config) => set((state) => {
    const newConfig = { ...config, id: uuidv4() } as ReportConfig;
    const updated = [...state.reports, newConfig];
    return { reports: updated };
  }),

  // 6️⃣ نظام الاتصالات المحسّن
  sendCommunication: (comm) => set((state) => {
    const newComm = { ...comm, id: uuidv4(), date: new Date().toISOString(), status: 'مرسل' as const } as Communication;
    const updated = [...state.communications, newComm];
    state.addActivityLog({ action: 'إرسال اتصال', user: state.currentUser?.name || '', details: `الى: ${comm.recipientName}`, type: 'email' });
    return { communications: updated };
  }),
  scheduleCommunication: (comm, scheduledTime) => set((state) => {
    const newComm = { ...comm, id: uuidv4(), date: scheduledTime, status: 'معلق' as const, scheduledTime } as Communication;
    const updated = [...state.communications, newComm];
    return { communications: updated };
  }),

  // 7️⃣ نظام تقييم الأداء
  addPerformanceReview: (review) => set((state) => {
    const newReview = { ...review, id: uuidv4() } as PerformanceReview;
    const updated = [...state.performanceReviews, newReview];
    return { performanceReviews: updated };
  }),
  updatePerformanceReview: (id, updates) => set((state) => {
    const updated = state.performanceReviews.map(r => r.id === id ? { ...r, ...updates } : r);
    return { performanceReviews: updated };
  }),
  updateEmployeePerformance: (id, perf) => set((state) => {
    const updated = state.employeePerformances.map(p => p.id === id ? { ...p, ...perf } : p);
    return { employeePerformances: updated };
  }),

  // 8️⃣ نظام المستندات والعقود
  addContract: (contract) => set((state) => {
    const newContract = { ...contract, id: uuidv4() } as Contract;
    const updated = [...state.contracts, newContract];
    state.addActivityLog({ action: 'إضافة عقد جديد', user: state.currentUser?.name || '', details: `العقد: ${contract.contractNumber}`, type: 'system' });
    return { contracts: updated };
  }),
  updateContract: (id, updates) => set((state) => {
    const updated = state.contracts.map(c => c.id === id ? { ...c, ...updates } : c);
    return { contracts: updated };
  }),
  deleteContract: (id) => set((state) => {
    const updated = state.contracts.filter(c => c.id !== id);
    return { contracts: updated };
  }),
  addDocument: (document) => set((state) => {
    const newDocument = { ...document, id: uuidv4() } as Document;
    const updated = [...state.documents, newDocument];
    state.addActivityLog({ action: 'رفع مستند', user: state.currentUser?.name || '', details: `المستند: ${document.name}`, type: 'system' });
    return { documents: updated };
  }),
  deleteDocument: (id) => set((state) => {
    const updated = state.documents.filter(d => d.id !== id);
    return { documents: updated };
  }),
}));
