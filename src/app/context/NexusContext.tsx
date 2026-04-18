import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { useAuth } from './AuthContext';

export type UserProfile = {
  name: string;
  rollNo: string;
  batch: string;
  branch: string;
  avatar: string;
};

export type DepartmentStatus = 'Cleared' | 'Pending' | 'Action Required' | 'Not Submitted';

export type Department = {
  id: string;
  name: string;
  authority: string;
  status: DepartmentStatus;
  note: string;
};

export type Notification = {
  id: string;
  type: 'approval' | 'rejection' | 'payment' | 'system';
  title: string;
  description: string;
  time: string;
  read: boolean;
};

export type Payment = {
  id: string;
  department: string;
  amount: number;
  date: string;
  receiptNo: string;
  status: string;
  type: 'fine' | 'deposit' | 'repair';
};

export type Due = {
  id: string;
  department: string;
  reason: string;
  amount: number;
  dueDate: string;
};

export type Document = {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
  status: 'Verified' | 'Under Review' | 'Rejected';
  rejectionReason?: string;
};

type NexusContextType = {
  profile: UserProfile;
  departments: Department[];
  notifications: Notification[];
  documents: Document[];
  dues: Due[];
  payments: Payment[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  payDue: (id: string) => void;
  uploadDocument: (doc: Document) => void;
  deleteDocument: (id: string) => void;
};

const initialProfile: UserProfile = {
  name: 'Hritani Joshi',
  rollNo: '21CS088',
  batch: '2021–2025',
  branch: 'Computer Science',
  avatar: 'HJ'
};

const initialDepartments: Department[] = [
  { id: 'lib', name: 'Library', authority: 'Mr. Desai — Librarian', status: 'Action Required', note: 'Book return pending, fine of ₹340' },
  { id: 'lab', name: 'Laboratory', authority: 'Dr. Mehta', status: 'Cleared', note: 'Approved by Dr. Mehta on Jun 10' },
  { id: 'acc', name: 'Accounts', authority: 'Mr. Sharma', status: 'Pending', note: 'Awaiting accounts officer review' },
  { id: 'hod', name: 'HOD', authority: 'Prof. Sharma', status: 'Cleared', note: 'Approved by Prof. Sharma on Jun 12' },
  { id: 'prin', name: 'Principal', authority: 'Dr. Rao', status: 'Pending', note: 'Waiting for HOD chain to complete' },
  { id: 'spo', name: 'Sports', authority: 'Mr. Singh', status: 'Cleared', note: 'No dues' },
  { id: 'hos', name: 'Hostel', authority: 'Mrs. Verma', status: 'Action Required', note: 'Repair charge of ₹500 unpaid' },
];

const initialNotifications: Notification[] = [
  { id: '1', type: 'approval', title: 'HOD Approved', description: 'Your application has been approved by the HOD.', time: '2 hours ago', read: false },
  { id: '2', type: 'rejection', title: 'Action Required: Library', description: 'Library has flagged a pending book return.', time: '1 day ago', read: false },
  { id: '3', type: 'payment', title: 'Payment Received', description: 'Payment of ₹340 for library fine was successful.', time: '2 days ago', read: true },
  { id: '4', type: 'system', title: 'Document Uploaded', description: 'You successfully uploaded the Lab Manual receipt.', time: '3 days ago', read: true },
  { id: '5', type: 'system', title: 'Application Submitted', description: 'Your graduation clearance application workflow has started.', time: '5 days ago', read: true },
];

const initialDues: Due[] = [
  { id: 'due_1', department: 'Library', reason: 'Overdue textbook', amount: 340, dueDate: 'Jun 1, 2026' },
  { id: 'due_2', department: 'Hostel', reason: 'Repair charge', amount: 500, dueDate: 'Jun 20, 2026' },
];

const initialDocuments: Document[] = [
  { id: 'img1', name: 'Lab_Manual_Receipt.pdf', type: 'Lab Manual', size: '1.2 MB', date: 'Jun 15, 2026', status: 'Verified' },
  { id: 'img2', name: 'ID_Card_Scan.jpg', type: 'ID Card', size: '450 KB', date: 'Jun 10, 2026', status: 'Under Review' },
  { id: 'img3', name: 'Library_Clearance.pdf', type: 'Library Receipt', size: '200 KB', date: 'Jun 12, 2026', status: 'Rejected', rejectionReason: 'Illegible scan, please re-upload a clear copy.' },
];

const initialPayments: Payment[] = [
  { id: 'pay1', department: 'Library', amount: 340, date: 'Jun 16, 2026 10:45 AM', receiptNo: 'RCPT-9921', status: 'Completed', type: 'fine' },
];

const NexusContext = createContext<NexusContextType | undefined>(undefined);

export function NexusProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  
  const profile = useMemo(() => {
    return {
      name: currentUser?.name || 'Student Name',
      rollNo: currentUser?.uid || 'Roll No',
      batch: '2021–2025',
      branch: currentUser?.branch || 'General',
      avatar: currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('') : 'ST'
    };
  }, [currentUser]);

  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [dues, setDues] = useState<Due[]>(initialDues);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };
  
  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const payDue = (id: string) => {
    const due = dues.find(d => d.id === id);
    if (!due) return;
    
    // remove from dues
    setDues(prev => prev.filter(d => d.id !== id));
    
    // add to payments
    const newPayment: Payment = {
      id: `pay_${Date.now()}`,
      department: due.department,
      amount: due.amount,
      date: new Date().toLocaleString(),
      receiptNo: `RCPT-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Completed',
      type: due.department.toLowerCase().includes('library') ? 'fine' : 'repair',
    };
    setPayments(prev => [newPayment, ...prev]);

    // update department status appropriately
    setDepartments(prev => prev.map(dep => {
      if (dep.name === due.department) {
        return { ...dep, status: 'Pending', note: 'Payment received. Awaiting admin clearance.' };
      }
      return dep;
    }));
  };

  const uploadDocument = (doc: Document) => {
    setDocuments(prev => [doc, ...prev]);
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  return (
    <NexusContext.Provider
      value={{
        profile,
        departments,
        notifications,
        dues,
        payments,
        documents,
        markNotificationRead,
        markAllNotificationsRead,
        payDue,
        uploadDocument,
        deleteDocument,
      }}
    >
      {children}
    </NexusContext.Provider>
  );
}

export function useNexus() {
  const context = useContext(NexusContext);
  if (context === undefined) {
    throw new Error('useNexus must be used within a NexusProvider');
  }
  return context;
}
