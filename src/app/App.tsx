import { Routes, Route } from 'react-router';
import LandingPage from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { NexusProvider } from './context/NexusContext';

// Placeholders for now, will create real implementations soon
import { StudentLayout } from './layouts/StudentLayout';
import { Dashboard } from './pages/student/Dashboard';
import { MyApplication } from './pages/student/MyApplication';
import { DocumentVault } from './pages/student/DocumentVault';
import { Payments } from './pages/student/Payments';
import { Notifications } from './pages/student/Notifications';
import { DigitalLocker } from './pages/student/DigitalLocker';
import { HelpSupport } from './pages/student/HelpSupport';

export default function App() {
  return (
    <NexusProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route element={<StudentLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/application" element={<MyApplication />} />
          <Route path="/documents" element={<DocumentVault />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/locker" element={<DigitalLocker />} />
          <Route path="/help" element={<HelpSupport />} />
        </Route>
      </Routes>
    </NexusProvider>
  );
}
