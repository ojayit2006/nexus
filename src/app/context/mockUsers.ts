export type UserRole = 'student' | 'lab-incharge' | 'hod' | 'principal' | 'admin';

export interface MockUser {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
  redirectTo: string;
}

export const MOCK_USERS: MockUser[] = [
  { id: 'u1', email: 'hritani.joshi@college.edu', password: 'student123', role: 'student', name: 'Hritani Joshi', redirectTo: '/dashboard' },
  { id: 'u2', email: 'rohan.patil@college.edu', password: 'student123', role: 'student', name: 'Rohan Patil', redirectTo: '/dashboard' },
  { id: 'u3', email: 'priya.mehta@college.edu', password: 'student123', role: 'student', name: 'Priya Mehta', redirectTo: '/dashboard' },
  { id: 'u4', email: 'arjun.nair@college.edu', password: 'student123', role: 'student', name: 'Arjun Nair', redirectTo: '/dashboard' },
  { id: 'u5', email: 'fatima.khan@college.edu', password: 'student123', role: 'student', name: 'Fatima Khan', redirectTo: '/dashboard' },
  { id: 'a1', email: 'lab.mehta@college.edu', password: 'lab1234', role: 'lab-incharge', name: 'Dr. Rajesh Mehta', redirectTo: '/lab/dashboard' },
  { id: 'a2', email: 'prof.sharma@college.edu', password: 'hod1234', role: 'hod', name: 'Prof. Anita Sharma', redirectTo: '/hod/dashboard' },
  { id: 'a3', email: 'principal@college.edu', password: 'principal1234', role: 'principal', name: 'Dr. Vandana Rao', redirectTo: '/principal/dashboard' },
  { id: 'ad1', email: 'admin@nexus.edu', password: 'admin1234', role: 'admin', name: 'Nexus Admin', redirectTo: '/admin/dashboard' },
];
