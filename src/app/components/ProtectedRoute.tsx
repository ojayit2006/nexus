import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ 
  children, 
  allowedRoles,
  allowedSubRoles 
}: { 
  children: React.ReactNode, 
  allowedRoles?: string[],
  allowedSubRoles?: string[]
}) {
  const { currentUser, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F0F0F0] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#121212] border-t-[#F0C020] rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentUser) return <Navigate to="/login" replace />;
  
  // Role-based protection: check parent role first
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Sub-role protection: ensure user matches specific staff function
  if (allowedSubRoles) {
    const userSubRole = currentUser.sub_role || currentUser.role;
    if (!allowedSubRoles.includes(userSubRole)) {
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  return <>{children}</>;
}
