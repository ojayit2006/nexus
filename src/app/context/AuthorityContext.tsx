import React, { createContext, useContext, useState, useMemo } from 'react';
import { formatDistanceToNow, subDays, subHours } from 'date-fns';
import { useAuth } from './AuthContext';

export type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected' | 'Flagged';

export interface Application {
  id: string;
  studentName: string;
  rollNo: string;
  branch: string;
  batch: string;
  email: string;
  submissionDate: string;
  daysWaiting: number;
  status: ApplicationStatus;
  documents: { id: string, name: string, type: string, size: string, isVerified: boolean, date: string }[];
  history: { id: string, actor: string, role: string, action: string, comment?: string, date: string }[];
  decisionComment?: string;
  decisionDate?: string;
}

export interface AuthNotification {
  id: string;
  type: 'submission' | 'stale' | 'chain' | 'system';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

interface AuthorityState {
  profile: { name: string, role: string, department: string };
  pendingApps: Application[];
  reviewedApps: Application[];
  notifications: AuthNotification[];
  approveApplication: (id: string, comment?: string) => void;
  flagApplication: (id: string, comment: string) => void;
  batchAction: (ids: string[], action: 'Approve' | 'Flag') => void;
  undoDecision: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  toggleDocumentVerification: (appId: string, docId: string) => void;
}

const AuthorityContext = createContext<AuthorityState | undefined>(undefined);

export function AuthorityProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();

  const profile = useMemo(() => ({
    name: currentUser?.name || 'Authority Name',
    role: currentUser?.role?.toUpperCase() || 'Staff',
    department: currentUser?.branch || 'General Administration'
  }), [currentUser]);

  const [pendingApps, setPendingApps] = useState<Application[]>([
    {
      id: 'APP-101', studentName: 'Hritani Joshi', rollNo: '21CS088', branch: 'CSE', batch: '2025', email: 'hritani.j@nexus.edu',
      submissionDate: subDays(new Date(), 3).toISOString(), daysWaiting: 3, status: 'Pending',
      documents: [
        { id: 'd1', name: 'ID_Card_Scan.pdf', type: 'ID Card', size: '1.2MB', isVerified: true, date: subDays(new Date(), 3).toISOString() },
        { id: 'd2', name: 'Lab_Clearance_Slip.png', type: 'Lab Receipt', size: '2.4MB', isVerified: true, date: subDays(new Date(), 3).toISOString() }
      ],
      history: [
        { id: 'h1', actor: 'Hritani Joshi', role: 'Student', action: 'Submitted Application', date: subDays(new Date(), 3).toISOString() },
        { id: 'h2', actor: 'Dr. R. K. Singh', role: 'Lab In-charge', action: 'Approved Application', comment: 'All lab dues cleared.', date: subDays(new Date(), 2).toISOString() }
      ]
    },
    {
      id: 'APP-102', studentName: 'Rohan Patil', rollNo: '21CS042', branch: 'CSE', batch: '2025', email: 'rohan.p@nexus.edu',
      submissionDate: subDays(new Date(), 1).toISOString(), daysWaiting: 1, status: 'Pending',
      documents: [
        { id: 'd3', name: 'Library_Dues.pdf', type: 'Library Receipt', size: '1.1MB', isVerified: false, date: subDays(new Date(), 1).toISOString() }
      ],
      history: [
        { id: 'h3', actor: 'Rohan Patil', role: 'Student', action: 'Submitted Application', date: subDays(new Date(), 1).toISOString() },
        { id: 'h4', actor: 'Dr. R. K. Singh', role: 'Lab In-charge', action: 'Approved Application', date: subHours(new Date(), 12).toISOString() }
      ]
    },
    {
      id: 'APP-103', studentName: 'Priya Mehta', rollNo: '21CS031', branch: 'CSE', batch: '2025', email: 'priya.m@nexus.edu',
      submissionDate: new Date().toISOString(), daysWaiting: 0, status: 'Pending',
      documents: [
        { id: 'd4', name: 'Fee_Receipt.jpeg', type: 'Fee Receipt', size: '800KB', isVerified: false, date: new Date().toISOString() }
      ],
      history: [
        { id: 'h5', actor: 'Priya Mehta', role: 'Student', action: 'Submitted Application', date: new Date().toISOString() },
        { id: 'h6', actor: 'Dr. R. K. Singh', role: 'Lab In-charge', action: 'Approved Application', date: new Date().toISOString() }
      ]
    },
    {
      id: 'APP-104', studentName: 'Arjun Nair', rollNo: '21CS067', branch: 'CSE', batch: '2025', email: 'arjun.n@nexus.edu',
      submissionDate: subDays(new Date(), 4).toISOString(), daysWaiting: 4, status: 'Pending',
      documents: [
        { id: 'd5', name: 'Student_ID.pdf', type: 'ID Card', size: '1.5MB', isVerified: true, date: subDays(new Date(), 4).toISOString() }
      ],
      history: [
        { id: 'h7', actor: 'Arjun Nair', role: 'Student', action: 'Submitted Application', date: subDays(new Date(), 4).toISOString() },
        { id: 'h8', actor: 'Dr. R. K. Singh', role: 'Lab In-charge', action: 'Approved Application', date: subDays(new Date(), 3).toISOString() }
      ]
    },
    {
      id: 'APP-105', studentName: 'Fatima Khan', rollNo: '21CS019', branch: 'CSE', batch: '2025', email: 'fatima.k@nexus.edu',
      submissionDate: subDays(new Date(), 2).toISOString(), daysWaiting: 2, status: 'Pending',
      documents: [],
      history: [
        { id: 'h9', actor: 'Fatima Khan', role: 'Student', action: 'Submitted Application', date: subDays(new Date(), 2).toISOString() }
      ]
    },
    // ... 7 more dummy placeholders
    ...Array.from({length: 7}).map((_, i) => ({
      id: `APP-20${i}`, studentName: `Placeholder Student ${i+1}`, rollNo: `21CS10${i}`, branch: 'CSE', batch: '2025', email: `test${i}@nexus.edu`,
      submissionDate: new Date().toISOString(), daysWaiting: 0, status: 'Pending' as ApplicationStatus, documents: [], history: []
    }))
  ]);

  const [reviewedApps, setReviewedApps] = useState<Application[]>([
    {
       id: 'APP-090', studentName: 'Aisha Gupta', rollNo: '21CS011', branch: 'CSE', batch: '2025', email: 'aisha.g@nexus.edu',
       submissionDate: subDays(new Date(), 5).toISOString(), daysWaiting: 0, status: 'Approved',
       documents: [], history: [], decisionComment: 'All documents verified. Cleared.', decisionDate: subDays(new Date(), 1).toISOString()
    },
    {
       id: 'APP-091', studentName: 'Karan Malhotra', rollNo: '21CS028', branch: 'CSE', batch: '2025', email: 'karan.m@nexus.edu',
       submissionDate: subDays(new Date(), 6).toISOString(), daysWaiting: 0, status: 'Flagged',
       documents: [], history: [], decisionComment: 'Lab manual missing. Please upload.', decisionDate: subDays(new Date(), 2).toISOString()
    }
  ]);

  const [notifications, setNotifications] = useState<AuthNotification[]>([
    { id: 'n1', type: 'stale', title: 'Stale Application Alert', description: "You have not reviewed Hritani Joshi's application for 3 days. Please action it.", timestamp: subHours(new Date(), 2).toISOString(), read: false, link: '/authority/pending' },
    { id: 'n2', type: 'stale', title: 'Stale Application Alert', description: "You have not reviewed Arjun Nair's application for 4 days. Please action it.", timestamp: subHours(new Date(), 4).toISOString(), read: false, link: '/authority/pending' },
    { id: 'n3', type: 'submission', title: 'New Submission', description: 'Priya Mehta submitted her clearance package.', timestamp: subHours(new Date(), 6).toISOString(), read: false, link: '/authority/pending' },
    { id: 'n4', type: 'chain', title: 'Chain Completion', description: 'Principal has given final approval for Sneha Rao.', timestamp: subDays(new Date(), 1).toISOString(), read: true },
    { id: 'n5', type: 'system', title: 'System Maintenance', description: 'Nexus will undergo maintenance on Sunday 2AM.', timestamp: subDays(new Date(), 2).toISOString(), read: true }
  ]);

  // Actions
  const processDecision = (id: string, newStatus: ApplicationStatus, comment?: string) => {
    setPendingApps(prev => {
      const app = prev.find(a => a.id === id);
      if(!app) return prev;
      
      const processedApp = { 
        ...app, 
        status: newStatus, 
        decisionComment: comment || (newStatus === 'Approved' ? 'Approved by HOD' : ''),
        decisionDate: new Date().toISOString(),
        history: [
          ...app.history, 
          { 
            id: Date.now().toString(), 
            actor: profile.name, 
            role: profile.role, 
            action: newStatus === 'Approved' ? 'Approved Application' : 'Flagged Application', 
            comment: comment,
            date: new Date().toISOString() 
          }
        ]
      };
      
      setReviewedApps(r => [processedApp, ...r]);
      return prev.filter(a => a.id !== id);
    });
  };

  const approveApplication = (id: string, comment?: string) => processDecision(id, 'Approved', comment);
  const flagApplication = (id: string, comment: string) => processDecision(id, 'Flagged', comment);

  const batchAction = (ids: string[], action: 'Approve' | 'Flag') => {
    ids.forEach(id => {
      processDecision(id, action === 'Approve' ? 'Approved' : 'Flagged', action === 'Approve' ? 'Bulk approved' : 'Bulk flagged');
    });
  };

  const undoDecision = (id: string) => {
    setReviewedApps(prev => {
      const app = prev.find(a => a.id === id);
      if(!app) return prev;
      
      // Remove latest history item
      const newHistory = [...app.history];
      newHistory.pop();

      const restoredApp = { ...app, status: 'Pending' as ApplicationStatus, decisionComment: undefined, decisionDate: undefined, history: newHistory };
      setPendingApps(p => [restoredApp, ...p]);
      return prev.filter(a => a.id !== id);
    });
  };

  const markNotificationRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifications(prev => prev.map(n => ({...n, read: true})));

  const toggleDocumentVerification = (appId: string, docId: string) => {
    setPendingApps(prev => prev.map(app => {
      if(app.id !== appId) return app;
      return {
        ...app,
        documents: app.documents.map(d => d.id === docId ? { ...d, isVerified: !d.isVerified } : d)
      };
    }));
  };

  return (
    <AuthorityContext.Provider value={{
      profile, pendingApps, reviewedApps, notifications,
      approveApplication, flagApplication, batchAction, undoDecision,
      markNotificationRead, markAllRead, toggleDocumentVerification
    }}>
      {children}
    </AuthorityContext.Provider>
  );
}

export const useAuthority = () => {
  const context = useContext(AuthorityContext);
  if (!context) throw new Error('useAuthority must be used within an AuthorityProvider');
  return context;
};
