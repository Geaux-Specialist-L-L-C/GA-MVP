import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

export default function AuthRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  return currentUser ? children : <Navigate to="/login" />;
}
