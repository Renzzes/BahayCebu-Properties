import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    // Redirect to login page while saving the attempted url
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}; 