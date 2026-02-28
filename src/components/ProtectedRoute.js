import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { OverlaySpinner } from './LoadingSpinner';

export default function ProtectedRoute({ roles, children }) {
  const { user, loading } = useAuth();

  if (loading) return <OverlaySpinner message="Loading…" />;

  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" replace />;

  return children;
}
