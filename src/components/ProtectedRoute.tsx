import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from './AdminLogin';

export type ProtectedRouteProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // I'm checking if the user is authenticated before rendering protected content.
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;


