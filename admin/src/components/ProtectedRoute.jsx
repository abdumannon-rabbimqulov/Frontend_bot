import { Navigate, useLocation } from 'react-router-dom';
import { getToken, getUser, isAdmin } from '../lib/auth.js';

export default function ProtectedRoute({ children }) {
  const token = getToken();
  const user = getUser();
  const loc = useLocation();
  if (!token || !user || !isAdmin(user)) {
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  }
  return children;
}
