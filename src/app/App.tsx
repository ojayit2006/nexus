import { Routes, Route } from 'react-router';
import LandingPage from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { NexusProvider } from './context/NexusContext';
import { AuthorityProvider } from './context/AuthorityContext';

// Student Space
import { StudentLayout } from './layouts/StudentLayout';
import { Dashboard } from './pages/student/Dashboard';
import { MyApplication } from './pages/student/MyApplication';
import { DocumentVault } from './pages/student/DocumentVault';
import { Payments } from './pages/student/Payments';
import { Notifications } from './pages/student/Notifications';
import { DigitalLocker } from './pages/student/DigitalLocker';
import { HelpSupport } from './pages/student/HelpSupport';

// Authority Space
import { AuthorityLayout } from './layouts/AuthorityLayout';
import { Dashboard as AuthDashboard } from './pages/authority/Dashboard';
import { PendingApps } from './pages/authority/PendingApps';
import { ReviewApp } from './pages/authority/ReviewApp';
import { ReviewedApps } from './pages/authority/ReviewedApps';
import { Notifications as AuthNotifications } from './pages/authority/Notifications';
import { Reports } from './pages/authority/Reports';
import { HelpSupport as AuthHelpSupport } from './pages/authority/HelpSupport';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthPage />} />
      
      {/* Student App Route Container */}
      <Route element={
        <NexusProvider>
          <StudentLayout />
        </NexusProvider>
      }>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/application" element={<MyApplication />} />
        <Route path="/documents" element={<DocumentVault />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/locker" element={<DigitalLocker />} />
        <Route path="/help" element={<HelpSupport />} />
      </Route>

      {/* Authority Portal App Route Container */}
      <Route element={
        <AuthorityProvider>
          <AuthorityLayout />
        </AuthorityProvider>
      }>
        <Route path="/authority/dashboard" element={<AuthDashboard />} />
        <Route path="/authority/pending" element={<PendingApps />} />
        <Route path="/authority/review/:id" element={<ReviewApp />} />
        <Route path="/authority/reviewed" element={<ReviewedApps />} />
        <Route path="/authority/notifications" element={<AuthNotifications />} />
        <Route path="/authority/reports" element={<Reports />} />
        <Route path="/authority/help" element={<AuthHelpSupport />} />
      </Route>
    </Routes>
  );
}
