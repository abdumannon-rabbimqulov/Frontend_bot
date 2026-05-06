import { Navigate } from 'react-router-dom';
import { getDriverToken } from '../lib/auth';

export default function ProtectedRoute({ children, requireProfile = false }) {
  const token = getDriverToken();
  const profileCompleted = localStorage.getItem('driver_profile_completed') === '1';

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requireProfile && !profileCompleted) {
    return <Navigate to="/profile" replace />;
  }

  return children;
}
