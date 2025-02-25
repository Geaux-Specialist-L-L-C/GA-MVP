import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

export interface AuthContextProps {
  currentUser: User | null;
  isLoading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextProps>({
  currentUser: null,
  isLoading: true,
  error: null
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, 
        (user) => {
          setCurrentUser(user);
          setIsLoading(false);
          setError(null);
        },
        (error) => {
          console.error('Auth state change error:', error);
          setError(error);
          setIsLoading(false);
        }
      );

      return unsubscribe;
    } catch (err) {
      console.error('Auth initialization error:', err);
      setError(err instanceof Error ? err : new Error('Failed to initialize auth'));
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, error }}>
      {error ? (
        <div role="alert" style={{ color: 'red', padding: '1rem' }}>
          Authentication Error: {error.message}
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
