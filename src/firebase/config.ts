import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, onValue, update, remove } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBYqgvBorasw3z8spf9d5LO1XD9jYxw1Nk",
  authDomain: "mararccompany-c9c39.firebaseapp.com",
  databaseURL: "https://mararccompany-c9c39-default-rtdb.firebaseio.com",
  projectId: "mararccompany-c9c39",
  storageBucket: "mararccompany-c9c39.firebasestorage.app",
  messagingSenderId: "131657860639",
  appId: "1:131657860639:web:ac9f06d25b8fcf859cb72a",
  measurementId: "G-PS1MVBKPBG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Database references
export const dbRefs = {
  employees: ref(database, 'employees'),
  clients: ref(database, 'clients'),
  emails: ref(database, 'emails'),
  salaryRecords: ref(database, 'salaryRecords'),
  taxRecords: ref(database, 'taxRecords'),
  activityLogs: ref(database, 'activityLogs'),
  notifications: ref(database, 'notifications'),
  companySettings: ref(database, 'companySettings'),
  lastSync: ref(database, 'lastSync'),
};

export { database, ref, set, get, onValue, update, remove };
export default app;
