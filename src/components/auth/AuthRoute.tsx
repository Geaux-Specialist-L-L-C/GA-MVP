import { Navigate, Outlet, useLocation, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const AuthRoute = () => {
const AuthRoute = () => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (location.pathname === '/dashboard' && !currentUser.profileComplete) {
    return <Navigate to="/create-profile" replace />;
  }

  return <Outlet />;
};

export default AuthRoute;
