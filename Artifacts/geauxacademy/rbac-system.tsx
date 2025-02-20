import React, { createContext, useContext, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Shield, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Define permission structure
const PERMISSIONS = {
  STUDENT: {
    view: ['dashboard', 'courses', 'assignments', 'grades'],
    edit: ['profile', 'submissions']
  },
  PARENT: {
    view: ['dashboard', 'courses', 'grades', 'attendance', 'payments'],
    edit: ['profile', 'contact-info', 'payment-methods']
  },
  TEACHER: {
    view: ['dashboard', 'courses', 'students', 'assignments', 'grades', 'attendance'],
    edit: ['courses', 'assignments', 'grades', 'attendance', 'announcements']
  },
  ADMIN: {
    view: ['*'], // Wildcard for all permissions
    edit: ['*']
  }
};

// RBAC Context
const RBACContext = createContext(null);

export const RBACProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);

  const hasPermission = (action, resource) => {
    if (!userRole || !PERMISSIONS[userRole]) return false;
    if (PERMISSIONS[userRole][action].includes('*')) return true;
    return PERMISSIONS[userRole][action].includes(resource);
  };

  const checkAccess = (requiredPermissions) => {
    if (!requiredPermissions) return true;
    return requiredPermissions.every(({ action, resource }) => 
      hasPermission(action, resource)
    );
  };

  return (
    <RBACContext.Provider value={{ userRole, setUserRole, hasPermission, checkAccess }}>
      {children}
    </RBACContext.Provider>
  );
};

// Custom hook for using RBAC
export const useRBAC = () => {
  const context = useContext(RBACContext);
  if (!context) {
    throw new Error('useRBAC must be used within a RBACProvider');
  }
  return context;
};

// Protected Route Component with RBAC
export const ProtectedRoute = ({ children, requiredPermissions }) => {
  const { user } = useAuth();
  const { checkAccess } = useRBAC();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!checkAccess(requiredPermissions)) {
    return <AccessDenied />;
  }

  return children;
};

// Access Denied Component
const AccessDenied = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-6">
        <div className="text-center mb-8">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="mt-2 text-gray-600">
            You don't have permission to access this resource.
          </p>
        </div>
        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              If you believe this is an error, please contact your administrator.
            </AlertDescription>
          </Alert>
          <button
            onClick={() => window.history.back()}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

// HOC for component-level access control
export const withPermission = (WrappedComponent, requiredPermissions) => {
  return function PermissionCheckedComponent(props) {
    const { checkAccess } = useRBAC();
    
    if (!checkAccess(requiredPermissions)) {
      return null;
    }
    
    return <WrappedComponent {...props} />;
  };
};

// Example usage in a component
export const RoleAwareComponent = ({ children }) => {
  const { hasPermission } = useRBAC();
  
  return (
    <div>
      {hasPermission('view', 'grades') && (
        <div className="grades-section">
          {/* Grades content */}
        </div>
      )}
      {hasPermission('edit', 'assignments') && (
        <div className="assignment-editor">
          {/* Assignment editor */}
        </div>
      )}
    </div>
  );
};

// Integration with existing Auth system
export const EnhancedAuthProvider = ({ children }) => {
  return (
    <AuthProvider>
      <RBACProvider>
        {children}
      </RBACProvider>
    </AuthProvider>
  );
};
