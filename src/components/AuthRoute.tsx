import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface AuthRouteProps extends Omit<RouteProps, 'component'> {
  component: React.ComponentType<any>;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default AuthRoute;
