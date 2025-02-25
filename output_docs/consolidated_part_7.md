# Consolidated Files (Part 7)

## backend/Artifacts/geauxacademy/dashboard-component.tsx

```
import React, { useState, useEffect } from 'react';
import { ChevronRight, Book, BarChart2, Settings } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, XAxis, YAxis, Tooltip, Line, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [userData, setUserData] = useState({
    learningStyle: '',
    progress: [],
    recommendations: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Simulated API call
        const data = {
          learningStyle: 'Visual',
          progress: [
            { month: 'Jan', completion: 65 },
            { month: 'Feb', completion: 78 },
            { month: 'Mar', completion: 82 },
            { month: 'Apr', completion: 90 }
          ],
          recommendations: [
            { id: 1, title: 'Visual Learning Techniques', progress: 0 },
            { id: 2, title: 'Mind Mapping Mastery', progress: 30 },
            { id: 3, title: 'Spatial Memory Training', progress: 60 }
          ]
        };
        setUserData(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Learning Style Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-4">
            <Book className="text-blue-500" />
            <h2 className="text-xl font-semibold">Learning Style</h2>
          </div>
          <p className="text-gray-600">Your identified style:</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">{userData.learningStyle}</p>
        </div>

        {/* Progress Chart */}
        <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="text-blue-500" />
            <h2 className="text-xl font-semibold">Progress Overview</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userData.progress}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="completion" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recommended Courses */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Recommended Courses</h2>
        <div className="space-y-4">
          {userData.recommendations.map(course => (
            <div 
              key={course.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div>
                <h3 className="font-medium">{course.title}</h3>
                <div className="w-48 h-2 bg-gray-200 rounded mt-2">
                  <div 
                    className="h-full bg-blue-500 rounded" 
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
              <ChevronRight className="text-gray-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

```

## backend/Artifacts/geauxacademy/auth-signup-verification.tsx

```
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Eye, EyeOff, Loader, CheckCircle, Mail } from 'lucide-react';

export const SignUpForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password),
    };
    return requirements;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    // Validate password strength
    const passwordChecks = validatePassword(formData.password);
    if (!Object.values(passwordChecks).every(Boolean)) {
      setError("Password doesn't meet requirements");
      return;
    }

    try {
      setLoading(true);
      await signUp(formData);
      navigate('/verify-email');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Create Your Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="block w-full rounded-md border border-gray-300 px-3 py-2"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export const EmailVerification = () => {
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [error, setError] = useState(null);
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');

  useEffect(() => {
    if (token) {
      verifyEmail(token)
        .then(() => {
          setVerificationStatus('success');
          setTimeout(() => navigate('/login'), 3000);
        })
        .catch((err) => {
          setVerificationStatus('error');
          setError(err.message);
        });
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Email Verification</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {verificationStatus === 'pending' && !token && (
            <div className="space-y-4">
              <Mail className="h-12 w-12 mx-auto text-blue-600" />
              <h3 className="text-lg font-medium">Check your email</h3>
              <p className="text-gray-600">
                We've sent a verification link to your email address. Please click the link to verify your account.
              </p>
            </div>
          )}

          {verificationStatus === 'success' && (
            <div className="space-y-4">
              <CheckCircle className="h-12 w-12 mx-auto text-green-600" />
              <h3 className="text-lg font-medium">Email Verified Successfully!</h3>
              <p className="text-gray-600">
                You will be redirected to login in a few seconds...
              </p>
            </div>
          )}

          {verificationStatus === 'error' && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default { SignUpForm, EmailVerification };

```

## backend/Artifacts/geauxacademy/password-reset-complete.tsx

```
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Eye, EyeOff, Loader, Mail, Lock, CheckCircle, AlertTriangle } from 'lucide-react';

// Security utility class for token and password management
class SecurityUtil {
  static RESET_TOKEN_EXPIRY = 30 * 60 * 1000; // 30 minutes
  static MAX_ATTEMPTS = 3;
  static LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

  static generateResetToken(email) {
    const payload = {
      email,
      exp: Date.now() + this.RESET_TOKEN_EXPIRY,
      jti: crypto.randomUUID()
    };
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  }

  static validatePassword(password) {
    const requirements = {
      minLength: password.length >= 12,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*]/.test(password)
    };
    return {
      isValid: Object.values(requirements).every(Boolean),
      requirements
    };
  }

  static async hashPassword(password) {
    // In production, use proper password hashing
    return password; // Placeholder
  }
}

// Request Password Reset Component
const RequestReset = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError(null);

    try {
      // Rate limiting check
      const attempts = parseInt(localStorage.getItem(`reset_attempts_${email}`) || '0');
      const lastAttempt = parseInt(localStorage.getItem(`reset_last_${email}`) || '0');

      if (attempts >= SecurityUtil.MAX_ATTEMPTS && 
          Date.now() - lastAttempt < SecurityUtil.LOCKOUT_DURATION) {
        throw new Error('Too many attempts. Please try again later.');
      }

      // Generate reset token
      const resetToken = SecurityUtil.generateResetToken(email);
      
      // Send reset email
      await sendResetEmail(email, resetToken);

      // Update rate limiting
      localStorage.setItem(`reset_attempts_${email}`, attempts + 1);
      localStorage.setItem(`reset_last_${email}`, Date.now());

      setStatus('success');
      navigate('/reset-password/check-email');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Reset Password
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {status === 'loading' ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>
      </CardContent>
    </Card>
  );
};

// Reset Password Component
const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const token = new URLSearchParams(location.search).get('token');

  useEffect(() => {
    if (!token) {
      navigate('/reset-password/request');
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError(null);

    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords don't match");
      }

      // Validate password strength
      const { isValid, requirements } = SecurityUtil.validatePassword(formData.password);
      if (!isValid) {
        throw new Error('Password does not meet security requirements');
      }

      // Hash password
      const hashedPassword = await SecurityUtil.hashPassword(formData.password);

      // Update password
      await updatePassword(token, hashedPassword);

      setStatus('success');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Set New Password
        </CardTitle>
      </CardHeader>
      <CardContent>
        {status === 'success' ? (
          <div className="text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h3 className="text-lg font-medium">Password Reset Successfully!</h3>
            <p className="text-gray-600">
              You will be redirected to login shortly...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {status === 'loading' ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export { RequestReset, ResetPassword };

```

## backend/Artifacts/geauxacademy/auth-system.tsx

```
import React, { createContext, useContext, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Eye, EyeOff, Loader } from 'lucide-react';

// Auth Context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      // In production, replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Simulate successful login
      if (email === 'demo@example.com' && password === 'password') {
        setUser({ id: 1, email, role: 'parent' });
        localStorage.setItem('authToken', 'demo-token');
        return true;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Protected Route Component
export const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Login Form Component
export const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useAuth();
  const location = useLocation();
  const navigate = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData.email, formData.password);
    if (success) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Sign in to Geaux Academy</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// Example of usage in App.js
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <ProgressDashboard />
              </ProtectedRoute>
            }
          />
          {/* Other routes */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

```

## backend/Artifacts/curriculum-management/unit-plan-preview.tsx

```
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Eye, Layout, FileText, Book, Code, ChevronRight, ChevronDown, Clock, Target, CheckSquare, Users } from 'lucide-react';

const UnitPlanPreview = ({ unitPlan, exportSettings, format }) => {
  const [expandedSections, setExpandedSections] = useState(new Set(['overview']));
  const [previewMode, setPreviewMode] = useState('rendered'); // 'rendered' or 'source'

  const toggleSection = (section) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSection(newExpanded);
  };

  const PreviewHeader = () => (
    <div className="flex items-center justify-between mb-6 border-b pb-4">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold">{unitPlan.title}</h2>
        <span className="px-2 py-1 bg-gray-100 rounded text-sm">
          Grade {unitPlan.grade_level}
        </span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setPreviewMode('rendered')}
          className={`px-3 py-1 rounded ${
            previewMode === 'rendered' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
          }`}
        >
          <Layout className="w-4 h-4" />
        </button>
        <button
          onClick={() => setPreviewMode('source')}
          className={`px-3 py-1 rounded ${
            previewMode === 'source' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
          }`}
        >
          <Code className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const PreviewSection = ({ title, icon, children, id }) => (
    <div className="border rounded-lg mb-4">
      <button
        onClick={() => toggleSection(id)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium">{title}</span>
        </div>
        {expandedSections.has(id) ? (
          <ChevronDown className="w-5 h-5" />
        ) : (
          <ChevronRight className="w-5 h-5" />
        )}
      </button>
      {expandedSections.has(id) && (
        <div className="px-4 py-3 border-t bg-white">{children}</div>
      )}
    </div>
  );

  const MetadataRow = ({ icon, label, value }) => (
    <div className="flex items-center gap-2 text-sm">
      {icon}
      <span className="text-gray-600">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );

  const ObjectivesList = ({ objectives }) => (
    <div className="space-y-3">
      {objectives.map((objective, index) => (
        <div key={index} className="bg-gray-50 p-3 rounded">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-blue-600" />
            <span className="font-medium">{objective.subject}</span>
          </div>
          <p className="text-sm">{objective.description}</p>
          {objective.assessment_criteria && (
            <div className="mt-2 text-sm text-gray-600">
              <span className="font-medium">Assessment Criteria: </span>
              {objective.assessment_criteria.join(', ')}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const ActivityList = ({ activities }) => (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="border rounded p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">{activity.title}</h4>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              {activity.duration}
            </div>
          </div>
          <p className="text-sm mb-3">{activity.description}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Materials:</span>
              <ul className="mt-1 list-disc list-inside text-gray-600">
                {activity.materials.map((material, idx) => (
                  <li key={idx}>{material}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-medium">Grouping:</span>
              <div className="mt-1 flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4" />
                {activity.grouping}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const AssessmentList = ({ assessments }) => (
    <div className="space-y-4">
      {assessments.map((assessment, index) => (
        <div key={index} className="border rounded p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">{assessment.title}</h4>
            <span className="px-2 py-1 bg-gray-100 rounded text-sm">
              {assessment.type}
            </span>
          </div>
          <p className="text-sm mb-3">{assessment.description}</p>
          {assessment.rubric && (
            <div className="mt-3">
              <h5 className="font-medium text-sm mb-2">Rubric</h5>
              <div className="border rounded overflow-hidden">
                {Object.entries(assessment.rubric).map(([criterion, levels], idx) => (
                  <div
                    key={idx}
                    className={`flex text-sm ${
                      idx > 0 ? 'border-t' : ''
                    }`}
                  >
                    <div className="w-1/3 p-2 bg-gray-50 font-medium">
                      {criterion}
                    </div>
                    <div className="w-2/3 p-2">
                      {levels.join(' → ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderSourceView = () => {
    let source = '';
    switch (format) {
      case 'markdown':
        source = `# ${unitPlan.title}

## Overview
- Grade Level: ${unitPlan.grade_level}
- Duration: ${unitPlan.duration}
- Subjects: ${unitPlan.subjects.join(', ')}

## Objectives
${unitPlan.objectives.map(obj => `- ${obj.description}`).join('\n')}

## Activities
${unitPlan.activities.map(act => `### ${act.title}
${act.description}
- Duration: ${act.duration}
- Materials: ${act.materials.join(', ')}
`).join('\n')}`;
        break;
      case 'html':
        source = `<h1>${unitPlan.title}</h1>
<div class="overview">
  <p>Grade Level: ${unitPlan.grade_level}</p>
  <p>Duration: ${unitPlan.duration}</p>
  <p>Subjects: ${unitPlan.subjects.join(', ')}</p>
</div>
...`;
        break;
      default:
        source = JSON.stringify(unitPlan, null, 2);
    }

    return (
      <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm font-mono">
        {source}
      </pre>
    );
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-6 h-6" />
          Preview Unit Plan
        </CardTitle>
      </CardHeader>

      <CardContent>
        <PreviewHeader />

        {previewMode === 'source' ? (
          renderSourceView()
        ) : (
          <>
            <PreviewSection
              id="overview"
              title="Overview"
              icon={<Layout className="w-5 h-5" />}
            >
              <div className="space-y-2">
                <MetadataRow
                  icon={<Clock className="w-4 h-4" />}
                  label="Duration"
                  value={unitPlan.duration}
                />
                <MetadataRow
                  icon={<Book className="w-4 h-4" />}
                  label="Subjects"
                  value={unitPlan.subjects.join(', ')}
                />
                <MetadataRow
                  icon={<CheckSquare className="w-4 h-4" />}
                  label="Standards"
                  value={unitPlan.standards.length}
                />
              </div>
            </PreviewSection>

            <PreviewSection
              id="objectives"
              title="Learning Objectives"
              icon={<Target className="w-5 h-5" />}
            >
              <ObjectivesList objectives={unitPlan.objectives} />
            </PreviewSection>

            <PreviewSection
              id="activities"
              title="Activities"
              icon={<Users className="w-5 h-5" />}
            >
              <ActivityList activities={unitPlan.activities} />
            </PreviewSection>

            {exportSettings.includeAssessments && (
              <PreviewSection
                id="assessments"
                title="Assessments"
                icon={<CheckSquare className="w-5 h-5" />}
              >
                <AssessmentList assessments={unitPlan.assessments} />
              </PreviewSection>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UnitPlanPreview;
```

## backend/Artifacts/curriculum-management/README.md

```
# Curriculum & Content Management

## Overview
The Curriculum Management system handles the organization, generation, and delivery of educational content, adapting materials based on individual learning styles and progress.

## Core Components

### 1. Curriculum Research & Generation
- **curriculum-researcher-impl.py**: AI-driven content research
- **curriculum-knowledge-graph.py**: Knowledge relationship mapping
- **lesson-planner-impl.py**: Lesson sequence generation
- **cross-subject-mapper.py**: Cross-disciplinary content linking

### 2. Content Visualization
- **curriculum-visualizer.tsx**: Interactive curriculum maps
- **unit-plan-preview.tsx**: Visual unit plan representation
- **pathway-manager.tsx**: Learning pathway visualization

### 3. Content Export
- **unit-plan-exporter.py**: Standardized content export

## Key Features
- AI-powered curriculum generation
- Dynamic content adaptation
- Cross-subject integration
- Visual learning paths
- Interactive content preview
- Knowledge graph mapping
- Customizable unit plans

## Technologies
- Python for content generation
- React for visualization interfaces
- Graph databases for knowledge mapping
- TypeScript for frontend components
- AI models for content adaptation

## Integration Points
- Learning Assessment System
- CrewAI Agents
- LMS Export System
- Analytics Platform
- Student Profiles

## Content Structure
```typescript
interface CurriculumUnit {
  id: string;
  title: string;
  learningObjectives: string[];
  content: {
    visual: ContentBlock[];
    auditory: ContentBlock[];
    reading: ContentBlock[];
    kinesthetic: ContentBlock[];
  };
  assessments: Assessment[];
  prerequisites: string[];
  nextUnits: string[];
}
```

## Content Adaptation
1. Learning style-based modifications
2. Difficulty level adjustments
3. Pace customization
4. Interest-based examples
5. Skill level adaptation

## Best Practices
1. Regular content validation
2. Maintain educational standards alignment
3. Ensure accessibility compliance
4. Version control for curriculum
5. Regular content updates
6. Track content effectiveness
7. Implement content review cycles
```

## backend/Artifacts/curriculum-management/curriculum-visualizer.tsx

```
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Alert, AlertDescription } from '@/components/ui/alert';
import _ from 'lodash';

const CurriculumVisualizer = () => {
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [graphData, setGraphData] = useState(null);
  const [error, setError] = useState(null);

  // Sample curriculum data structure
  const sampleData = {
    nodes: [
      {
        id: "MATH.K.CC.1",
        grade: 0,
        subject: "MATH",
        description: "Count to 100 by ones and tens",
        dokLevel: 2
      },
      {
        id: "MATH.1.OA.1",
        grade: 1,
        subject: "MATH",
        description: "Addition and subtraction within 20",
        dokLevel: 3
      },
      {
        id: "SCI.K.PS.1",
        grade: 0,
        subject: "SCIENCE",
        description: "Basic forces and motion",
        dokLevel: 2
      }
    ],
    edges: [
      {
        source: "MATH.K.CC.1",
        target: "MATH.1.OA.1",
        type: "prerequisite"
      }
    ]
  };

  const subjects = ['MATH', 'SCIENCE', 'ELA', 'SOCIAL_STUDIES'];
  const grades = ['K', '1', '2', '3', '4', '5', '6', '7', '8'];

  // Transform graph data for visualization
  const processGraphData = (rawData, gradeFilter, subjectFilter) => {
    try {
      let filteredNodes = rawData.nodes;
      
      if (gradeFilter !== 'all') {
        filteredNodes = filteredNodes.filter(node => 
          node.grade === parseInt(gradeFilter === 'K' ? '0' : gradeFilter)
        );
      }
      
      if (subjectFilter !== 'all') {
        filteredNodes = filteredNodes.filter(node => 
          node.subject === subjectFilter
        );
      }

      // Group standards by grade level
      const standardsByGrade = _.groupBy(filteredNodes, 'grade');
      
      // Calculate stats for each grade
      const gradeStats = Object.entries(standardsByGrade).map(([grade, standards]) => ({
        grade: grade === '0' ? 'K' : grade,
        standardCount: standards.length,
        avgDOK: _.meanBy(standards, 'dokLevel'),
        prerequisites: standards.filter(s => 
          rawData.edges.some(e => e.target === s.id)
        ).length
      }));

      return _.sortBy(gradeStats, [g => g.grade === 'K' ? -1 : parseInt(g.grade)]);
    } catch (err) {
      setError("Error processing curriculum data");
      return [];
    }
  };

  useEffect(() => {
    const processed = processGraphData(sampleData, selectedGrade, selectedSubject);
    setGraphData(processed);
  }, [selectedGrade, selectedSubject]);

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Curriculum Standards Analysis</CardTitle>
        <div className="flex gap-4 mt-4">
          <select 
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="all">All Grades</option>
            {grades.map(grade => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
          
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="all">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={graphData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="grade" 
                label={{ value: 'Grade Level', position: 'bottom' }} 
              />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              
              <Tooltip 
                formatter={(value, name) => {
                  switch(name) {
                    case 'Standards':
                      return [value, 'Number of Standards'];
                    case 'DOK Level':
                      return [value.toFixed(1), 'Average DOK Level'];
                    case 'Prerequisites':
                      return [value, 'Standards with Prerequisites'];
                    default:
                      return [value, name];
                  }
                }}
              />
              <Legend />
              
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="standardCount"
                name="Standards"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avgDOK"
                name="DOK Level"
                stroke="#82ca9d"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="prerequisites"
                name="Prerequisites"
                stroke="#ffc658"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Analysis Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded">
              <h4 className="font-medium">Curriculum Coverage</h4>
              <p className="text-sm text-gray-600">
                Displaying {graphData?.length || 0} grade levels with 
                {' '}{_.sumBy(graphData, 'standardCount') || 0} total standards
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <h4 className="font-medium">Complexity Analysis</h4>
              <p className="text-sm text-gray-600">
                Average DOK Level: {
                  (_.meanBy(graphData, 'avgDOK') || 0).toFixed(1)
                }
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurriculumVisualizer;

```

## backend/Artifacts/curriculum-management/pathway-manager.tsx

```
import React, { useState, useEffect } from 'react';
import { useFirestore } from 'reactfire';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAIEnhancements } from '../hooks/useAIEnhancements';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Map, ChevronRight, Target, Book, RefreshCw, AlertTriangle } from 'lucide-react';
import type { PathwayNode, LearningProfile } from '../types/learning';

interface PathwayManagerProps {
  studentId: string;
  objectives: string[];
  onPathwayUpdate: (pathway: PathwayNode[]) => void;
}

export const PathwayManager: React.FC<PathwayManagerProps> = ({
  studentId,
  objectives,
  onPathwayUpdate
}) => {
  const [pathway, setPathway] = useState<PathwayNode[]>([]);
  const [profile, setProfile] = useState<LearningProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const firestore = useFirestore();
  const crewAI = useCrewAI();  // Custom hook for CrewAI client

  const {
    generatePathway,
    adaptContent,
    optimizeContent,
    observeLearningProfile
  } = useAIEnhancements(firestore, crewAI, {
    adaptationInterval: 5000,
    confidenceThreshold: 0.8,
    maxPathLength: 10,
    optimizationRules: ['difficulty', 'engagement', 'completion']
  });

  useEffect(() => {
    const subscription = observeLearningProfile(studentId).subscribe({
      next: (updatedProfile) => {
        setProfile(updatedProfile);
      },
      error: (err) => {
        setError(`Failed to load learning profile: ${err.message}`);
      }
    });

    return () => subscription.unsubscribe();
  }, [studentId, observeLearningProfile]);

  const handleGeneratePathway = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const newPathway = await generatePathway(studentId, objectives);
      setPathway(newPathway);
      onPathwayUpdate(newPathway);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate pathway');
    } finally {
      setIsLoading(false);
    }
  };

  const PathwayVisualization = () => (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={pathway}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="sequence" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="difficulty"
            stroke="#8884d8"
            name="Difficulty"
          />
          <Line
            type="monotone"
            dataKey="estimatedTime"
            stroke="#82ca9d"
            name="Time (min)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const PathwayNode: React.FC<{ node: PathwayNode; index: number }> = ({
    node,
    index
  }) => (
    <div className="relative pb-8 pl-8 border-l-2 border-gray-200">
      <div className="absolute w-4 h-4 rounded-full -left-2 top-0 bg-blue-500" />
      <div className="ml-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium">{node.title}</h4>
            <p className="text-sm text-gray-600">{node.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {node.estimatedTime} min
            </span>
            <span className={`
              px-2 py-1 rounded text-xs
              ${node.difficulty < 0.4 ? 'bg-green-100 text-green-800' : 
                node.difficulty < 0.7 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}
            >
              Difficulty: {(node.difficulty * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-4">
          <div className="text-sm">
            <span className="font-medium">Prerequisites:</span>
            <ul className="mt-1 space-y-1">
              {node.prerequisites.map((prereq, idx) => (
                <li key={idx} className="flex items-center gap-1">
                  <ChevronRight className="w-3 h-3" />
                  {prereq}
                </li>
              ))}
            </ul>
          </div>
          <div className="text-sm">
            <span className="font-medium">Learning Outcomes:</span>
            <ul className="mt-1 space-y-1">
              {node.outcomes.map((outcome, idx) => (
                <li key={idx} className="flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  {outcome}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => handleNodeAdaptation(node.id)}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50 flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            Adapt
          </button>
          <button
            onClick={() => handleNodeDetails(node.id)}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50 flex items-center gap-1"
          >
            <Book className="w-3 h-3" />
            Details
          </button>
        </div>
      </div>
    </div>
  );

  const handleNodeAdaptation = async (nodeId: string) => {
    try {
      setIsLoading(true);
      const adaptation = await adaptContent(nodeId, studentId);
      
      // Update pathway with adapted content
      setPathway(prev => prev.map(node => 
        node.id === nodeId ? { ...node, ...adaptation } : node
      ));
      
      onPathwayUpdate(pathway);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Adaptation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNodeDetails = async (nodeId: string) => {
    // Implement node details modal/drawer
    console.log('Show details for node:', nodeId);
  };

  const PathwayMetrics = () => {
    // Calculate pathway metrics
    const metrics = {
      totalTime: pathway.reduce((sum, node) => sum + node.estimatedTime, 0),
      avgDifficulty: pathway.reduce((sum, node) => sum + node.difficulty, 0) / pathway.length,
      completionRate: profile?.completionRate || 0
    };

    return (
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium mb-1">Total Duration</h4>
          <div className="text-2xl font-bold text-blue-600">
            {metrics.totalTime} min
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium mb-1">Average Difficulty</h4>
          <div className="text-2xl font-bold text-purple-600">
            {(metrics.avgDifficulty * 100).toFixed(0)}%
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium mb-1">Completion Rate</h4>
          <div className="text-2xl font-bold text-green-600">
            {(metrics.completionRate * 100).toFixed(0)}%
          </div>
        </div>
      </div>
    );
  };

  const OptimizationAlert: React.FC<{ profile: LearningProfile }> = ({ profile }) => {
    if (profile.performanceFlags.length === 0) return null;

    return (
      <Alert className="mb-6">
        <AlertDescription className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Pathway optimization suggested based on:
          <ul className="list-disc list-inside">
            {profile.performanceFlags.map((flag, index) => (
              <li key={index} className="text-sm">{flag}</li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Map className="w-6 h-6" />
            Learning Pathway
          </div>
          <button
            onClick={handleGeneratePathway}
            disabled={isLoading}
            className={`
              px-4 py-2 rounded font-medium flex items-center gap-2
              ${isLoading ? 'bg-gray-300 cursor-not-allowed' :
                'bg-blue-600 text-white hover:bg-blue-700'
              }
            `}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Generate Pathway
              </>
            )}
          </button>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {profile && <OptimizationAlert profile={profile} />}

        {pathway.length > 0 && (
          <>
            <PathwayMetrics />
            <PathwayVisualization />
            
            <div className="mt-8">
              <h3 className="font-medium mb-6">Pathway Nodes</h3>
              <div className="space-y-2">
                {pathway.map((node, index) => (
                  <PathwayNode
                    key={node.id}
                    node={node}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PathwayManager;
```

## backend/Artifacts/codecopy/react_codebase_part11.md

```
# React Application Structure and Content - Part 11

Generated on: 2025-02-17 09:19:40

## /react_codebase.md (continued)

```markdown
          type="button"
          aria-label="Sign in with Google"
        >
          <FcGoogle />
          Sign in with Google
        </GoogleButton>
        <SignUpPrompt>
          Don't have an account? <StyledLink to="/signup">Sign up</StyledLink>
        </SignUpPrompt>
      </LoginBox>
    </LoginContainer>
  );
};

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px);
`;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px);
  padding: 20px;
`;

const LoginBox = styled.div`
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
`;

const GoogleButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: white;
  color: #555;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SignUpPrompt = styled.p`
  text-align: center;
  margin-top: 1rem;
  color: #666;
`;

const StyledLink = styled(Link)`
  color: var(--primary-color);
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  background-color: #fee;
  color: #c00;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DismissButton = styled.button`
  background: none;
  border: none;
  color: #c00;
  cursor: pointer;
  padding: 0 0.5rem;
  
  &:hover {
    opacity: 0.7;
  }
`;

export default Login;
```

---

## /src/pages/NotFound.tsx

```tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';

const NotFound: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setError('');
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Login error:', err);
    }
  };

  return (
    <NotFoundContainer>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for might have been removed or doesn't exist.</p>
      <StyledLink to="/">Return to Home</StyledLink>
      <GoogleButton onClick={handleGoogleLogin}>
        <FcGoogle className="text-xl" />
        Sign in with Google
      </GoogleButton>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </NotFoundContainer>
  );
};

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 2rem;

  h1 {
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 2rem;
    color: var(--text-color);
  }
`;

const StyledLink = styled(Link)`
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--secondary-color);
  }
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: white;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const ErrorMessage = styled.div`
  margin-top: 1rem;
  color: red;
`;

export default NotFound;
```

---

## /src/pages/TakeAssessment.tsx

```tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { useParams } from "react-router-dom";
import { getStudentProfile, updateStudentAssessmentStatus } from "../services/profileService";
import type { Student } from '../types/student';
import styled from 'styled-components';
import LearningStyleChat from '../components/chat/LearningStyleChat';

const TakeAssessment: React.FC = () => {
  const { currentUser } = useAuth();
  const { studentId } = useParams<{ studentId: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudent = async (): Promise<void> => {
      if (!studentId || !currentUser) {
        setLoading(false);
        return;
      }
      
      try {
        const studentProfile = await getStudentProfile(studentId);
        if (!studentProfile || !studentProfile.id) {
          setError("Student profile not found");
        } else {
          setStudent({
            ...studentProfile,
            id: studentProfile.id
          });
        }
      } catch (error) {
        console.error("Error fetching student profile:", error);
        setError("Failed to load student profile");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [currentUser, studentId]);

  const handleAssessmentCompletion = async (): Promise<void> => {
    if (!studentId) {
      setError("Student ID is required");
      return;
    }

    try {
      setLoading(true);
      await updateStudentAssessmentStatus(studentId, "completed");
      setStudent(prev => prev ? { ...prev, hasTakenAssessment: true } : null);
    } catch (error) {
      console.error("Error completing assessment:", error);
      setError("Failed to complete assessment");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingContainer>Loading assessment...</LoadingContainer>;
  }

  if (error) {
    return <ErrorContainer>{error}</ErrorContainer>;
  }

  if (!student) {
    return <ErrorContainer>No student found</ErrorContainer>;
  }

  return (
    <AssessmentContainer>
      <Header>
        <h1>Learning Style Assessment</h1>
        <StudentName>for {student.name}</StudentName>
      </Header>

      <ContentSection>
        <p>Chat with our AI assistant to help determine your learning style. The assistant will ask you questions and analyze your responses to identify the learning style that best suits you.</p>
        <LearningStyleChat />
      </ContentSection>

      <ActionSection>
        <CompleteButton 
          onClick={handleAssessmentCompletion}
          disabled={loading}
        >
          {loading ? "Completing..." : "Complete Assessment"}
        </CompleteButton>
      </ActionSection>
    </AssessmentContainer>
  );
};

const AssessmentContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    color: var(--primary-color);
    margin-bottom: 0.5rem;
  }
`;

const StudentName = styled.h2`
  font-size: 1.25rem;
  color: var(--text-color);
`;

const ContentSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
`;

const ActionSection = styled.div`
  display: flex;
  justify-content: center;
`;

const CompleteButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--primary-dark);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  font-size: 1.1rem;
  color: var(--text-color);
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 2rem;
  color: #dc2626;
  background-color: #fee2e2;
  border-radius: 8px;
  margin: 2rem auto;
  max-width: 600px;
`;

export default TakeAssessment;
```

---

## /src/pages/VarkStyles.tsx

```tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion as m } from 'framer-motion';
import { FaEye, FaHeadphones, FaBookReader, FaRunning } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

interface LearningStyle {
  icon: JSX.Element;
  title: string;
  description: string;
  characteristics: string[];
}

const VarkStyles: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setError("");
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Login error:", err);
    }
  };

  const styles: LearningStyle[] = [
    {
      icon: <FaEye />,
      title: "Visual Learning",
      description: "Learn through seeing and observing",
      characteristics: [
        "Prefer diagrams and charts",
        "Remember visual details",
        "Benefit from visual aids",
        "Excel with graphic organizers"
      ]
    },
    {
      icon: <FaHeadphones />,
      title: "Auditory Learning",
      description: "Learn through listening and speaking",
      characteristics: [
        "Excel in discussions",
        "Remember spoken information",
        "Benefit from lectures",
        "Learn through verbal repetition"
      ]
    },
    {
      icon: <FaBookReader />,
      title: "Read/Write Learning",
      description: "Learn through written words",
      characteristics: [
        "Enjoy reading materials",
        "Take detailed notes",
        "Prefer written instructions",
        "Learn through writing summaries"
      ]
    },
    {
      icon: <FaRunning />,
      title: "Kinesthetic Learning",
      description: "Learn through doing and experiencing",
      characteristics: [
        "Learn by doing",
        "Prefer hands-on activities",
        "Remember through practice",
        "Benefit from role-playing"
      ]
    }
  ];

  return (
    <Container>
      <Header>
        <m.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Discover Your VARK Learning Style
        </m.h1>
        <m.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Understanding how you learn best is the first step to academic success
        </m.p>
      </Header>

      <StylesGrid>
        {styles.map((style, index) => (
          <StyleCard
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            <IconWrapper>{style.icon}</IconWrapper>
            <h2>{style.title}</h2>
            <p>{style.description}</p>
            <CharacteristicsList>
              {style.characteristics.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </CharacteristicsList>
          </StyleCard>
        ))}
      </StylesGrid>

      <CTASection>
        <h2>Ready to optimize your learning journey?</h2>
        <p>Take our assessment to discover your learning style and get personalized recommendations.</p>
        <ButtonGroup>
          <PrimaryButton to="/signup">Get Started Now</PrimaryButton>
          <SecondaryButton to="/about">Learn More</SecondaryButton>
        </ButtonGroup>
      </CTASection>

      <GoogleLoginSection>
        <GoogleButton onClick={handleGoogleLogin}>
          Sign in with Google
        </GoogleButton>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </GoogleLoginSection>
    </Container>
  );
};

const Container = styled(m.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
`;

const Header = styled(m.header)`
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    font-size: 2.5rem;
    color: var(--primary-color);
  }

  p {
    font-size: 1.25rem;
    color: var(--text-color);
  }
`;

const StylesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const StyleCard = styled(m.div)`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const IconWrapper = styled.div`
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
`;

const CharacteristicsList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 1rem;

  li {
    padding: 0.5rem 0;
    padding-left: 1.5rem;
    position: relative;

    &:before {
      content: "•";
      color: var(--primary-color);
      position: absolute;
      left: 0;
    }
  }
`;

const CTASection = styled.div`
  text-align: center;
  margin-top: 4rem;
  padding: 3rem;
  background: var(--background-alt);
  border-radius: 12px;

  h2 {
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 2rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled(Link)`
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const PrimaryButton = styled(Button)`
  background-color: var(--primary-color);
  color: white;
`;

const SecondaryButton = styled(Button)`
  background-color: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
`;

const GoogleLoginSection = styled.div`
  text-align: center;
  margin-top: 2rem;
`;

const GoogleButton = styled.button`
  background-color: #4285f4;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #357ae8;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 1rem;
`;

export default VarkStyles;
```

---

## /src/pages/values/Collaboration.tsx

```tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion as m } from 'framer-motion';
import { FaUsers } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { DefaultTheme } from 'styled-components';

interface ThemeProps {
  theme: DefaultTheme;
}

const Collaboration: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState<string>('');

  const handleGoogleLogin = async () => {
    try {
      setError('');
      await loginWithGoogle();
      // Handle navigation to /dashboard after successful login
    } catch (err) {
      // Handle error as string per user preference
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    }
  };

  return (
    <ValueContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ValueHeader>
        <FaUsers size={40} />
        <h1>Collaboration</h1>
      </ValueHeader>
      <ValueContent>
        <p>We believe in the power of working together:</p>
        <ValuePoints>
          <li>Fostering partnerships between teachers, students, and parents</li>
          <li>Creating supportive learning communities</li>
          <li>Encouraging peer-to-peer learning</li>
          <li>Building strong educational networks</li>
        </ValuePoints>
        <button onClick={handleGoogleLogin}>Sign in with Google</button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </ValueContent>
    </ValueContainer>
  );
};

const ValueContainer = styled(m.div)`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const ValueHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;

  h1 {
    font-size: 2rem;
    color: var(--primary-color);
  }

  svg {
    color: var(--primary-color);
  }
`;

const ValueContent = styled.div`
  p {
    font-size: 1.2rem;
    color: var(--text-color);
    margin-bottom: 1rem;
  }
`;

const ValuePoints = styled.ul`
  list-style: none;
  padding: 0;

  li {
    font-size: 1rem;
    color: var(--text-color);
    margin-bottom: 0.5rem;
    padding-left: 1.5rem;
    position: relative;

    &::before {
      content: '•';
      color: var(--primary-color);
      position: absolute;
      left: 0;
    }
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 1rem;
`;

export default Collaboration;
```

---

## /src/pages/values/Excellence.tsx

```tsx
import React, { useState } from 'react';
import styled, { DefaultTheme } from 'styled-components';
import { motion as m } from 'framer-motion';
import { FaTrophy } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

interface ThemeProps {
  theme: DefaultTheme;
}

const Excellence: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState<string>('');

  const handleGoogleLogin = async () => {
    try {
      setError('');
      await loginWithGoogle();
      // Handle navigation to /dashboard after successful login
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
      console.error('Login error:', err);
    }
  };

  return (
    <ValueContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ValueHeader>
        <FaTrophy size={40} />
        <h1>Excellence</h1>
      </ValueHeader>
      <ValueContent>
        <p>We strive for excellence in every aspect of education:</p>
        <ValuePoints>
          <li>Setting high academic standards while supporting individual growth</li>
          <li>Continuously improving our teaching methodologies</li>
          <li>Providing top-quality educational resources</li>
          <li>Measuring and celebrating student achievements</li>
        </ValuePoints>
        <GoogleButton onClick={handleGoogleLogin}>
          Sign in with Google
        </GoogleButton>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </ValueContent>
    </ValueContainer>
  );
};

const ValueContainer = styled(m.div)`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const ValueHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;

  h1 {
    font-size: 2rem;
    color: var(--primary-color);
  }

  svg {
    color: var(--primary-color);
  }
`;

const ValueContent = styled.div`
  p {
    font-size: 1.2rem;
    color: var(--text-color);
    margin-bottom: 1rem;
  }
`;

const ValuePoints = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    font-size: 1rem;
    color: var(--text-color);
    margin-bottom: 0.5rem;
    padding-left: 1rem;
    position: relative;

    &::before {
      content: '•';
      color: var(--primary-color);
      position: absolute;
      left: 0;
    }
  }
`;

const GoogleButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #357ae8;
  }
`;

const ErrorMessage = styled.div`
  margin-top: 1rem;
  color: red;
  font-size: 0.875rem;
`;

export default Excellence;
```

---

## /src/pages/values/Innovation.tsx

```tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion as m } from 'framer-motion';
import { FaLightbulb } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';

const Innovation: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setError('');
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Login error:', err);
    }
  };

  return (
    <ValueContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ValueHeader>
        <FaLightbulb size={40} />
        <h1>Innovation</h1>
      </ValueHeader>
      <ValueContent>
        <p>Innovation drives our approach to personalized learning:</p>
        <ValuePoints>
          <li>Leveraging cutting-edge educational technology</li>
          <li>Developing adaptive learning pathways</li>
          <li>Creating interactive and engaging content</li>
          <li>Implementing data-driven teaching methods</li>
        </ValuePoints>
        {error && (
          <ErrorMessage>{error}</ErrorMessage>
        )}
        <GoogleButton onClick={handleGoogleLogin}>
          <FcGoogle className="text-xl" />
          Sign in with Google
        </GoogleButton>
      </ValueContent>
    </ValueContainer>
  );
};

const ValueContainer = styled(m.div)`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

const ValueHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;

  h1 {
    font-size: 2rem;
    color: var(--primary-color);
  }

  svg {
    color: var(--primary-color);
  }
`;

const ValueContent = styled.div`
  p {
    font-size: 1.2rem;
    color: var(--text-color);
    margin-bottom: 1rem;
  }
`;

const ValuePoints = styled.ul`
  list-style: none;
  padding: 0;

  li {
    font-size: 1rem;
    color: var(--text-color);
    margin-bottom: 0.5rem;
    padding-left: 1.5rem;
    position: relative;

    &::before {
      content: '•';
      position: absolute;
      left: 0;
      color: var(--primary-color);
    }
  }
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  text-align: center;
`;

const GoogleButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: white;
  color: #333;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8fafc;
  }

  &:focus {
    outline: none;
    ring: 2px;
    ring-offset: 2px;
    ring-blue-500;
  }
`;

export default Innovation;
```

---

## /src/pages/values/Integrity.tsx

```tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaBalanceScale } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';

const Integrity: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setError("");
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Login error:", err);
    }
  };

  return (
    <ValueContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ValueHeader>
        <FaBalanceScale size={40} />
        <h1>Integrity</h1>
      </ValueHeader>
      <ValueContent>
        <p>At Geaux Academy, integrity is the foundation of everything we do. We believe in:</p>
        <ValuePoints>
          <li>Maintaining the highest ethical standards in education</li>
          <li>Being transparent with our teaching methods and student progress</li>
          <li>Creating a safe and honest learning environment</li>
          <li>Delivering on our promises to students and parents</li>
        </ValuePoints>
        {error && (
          <ErrorMessage>{error}</ErrorMessage>
        )}
        <GoogleButton onClick={handleGoogleLogin}>
          <FcGoogle className="text-xl" />
          Sign in with Google
        </GoogleButton>
      </ValueContent>
    </ValueContainer>
  );
};

const ValueContainer = styled(motion.div)`
  max-width: 800px;
  margin: 80px auto;
  padding: 2rem;
`;

const ValueHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  color: var(--primary-color);

  h1 {
    margin-top: 1rem;
    font-size: 2.5rem;
  }
`;

const ValueContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
`;

const ValuePoints = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-top: 1rem;

  li {
    padding: 1rem;
    margin-bottom: 1rem;
    background: var(--background-alt);
    border-radius: 4px;
    
    &:hover {
      transform: translateX(5px);
      transition: transform 0.2s;
    }
  }
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  text-align: center;
`;

const GoogleButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: white;
  color: #333;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8fafc;
  }

  &:focus {
    outline: none;
    ring: 2px;
    ring-offset: 2px;
    ring-blue-500;
  }
`;

export default Integrity;
```

---

## /src/pages/profile/ParentProfile/CreateStudent.tsx

```tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { addStudentProfile } from '../../../services/profileService';
import { useAuth } from '../../../contexts/AuthContext';
import StudentCard from '../../../components/student/StudentCard';

interface NewStudent {
  name: string;
  grade: string;
  parentId: string;
  hasTakenAssessment: boolean;
}

const CreateStudent: React.FC = () => {
  const [studentName, setStudentName] = useState<string>('');
  const [grade, setGrade] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newStudent: NewStudent = { 
        name: studentName, 
        grade, 
        parentId: currentUser.uid,
        hasTakenAssessment: false
      };

      await addStudentProfile(currentUser.uid, newStudent);
      setStudentName('');
      setGrade('');
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to create student profile. Please try again.');
      console.error('Error creating student:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <h2>Add a New Student</h2>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>
            Student Name:
            <Input
              type="text"
              value={studentName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStudentName(e.target.value)}
              placeholder="Enter student's name"
              required
            />
          </Label>
        </FormGroup>

        <FormGroup>
          <Label>
            Grade Level:
            <Select 
              value={grade} 
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setGrade(e.target.value)}
              required
            >
              <option value="">Select Grade</option>
              <option value="K">Kindergarten</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={String(i + 1)}>
                  Grade {i + 1}
                </option>
              ))}
            </Select>
          </Label>
        </FormGroup>

        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Creating Profile...' : 'Save Profile'}
        </SubmitButton>
      </Form>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h2 {
    margin-bottom: 1.5rem;
    color: var(--primary-color);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background: white;
`;

const SubmitButton = styled.button`
  background: var(--primary-color);
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: var(--primary-dark);
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  background: #fee2e2;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

export default CreateStudent;
```

---

## /src/pages/profile/ParentProfile/ParentDashboard.tsx

```tsx
import React, { useState, useEffect } from 'react';
import StudentProgressTracker from './components/StudentProgressTracker';
import NotificationCenter from './dashboard/components/NotificationCenter';
import LearningStyleInsights from '../components/LearningStyleInsights';
import CurriculumApproval from './dashboard/components/CurriculumApproval';
import styled from 'styled-components';
import { useAuth } from "../../../contexts/AuthContext";
import { getParentProfile } from '../../../services/profileService';
import { Parent, Student } from '../../../types/auth';
import { useNavigate } from 'react-router-dom';

interface ParentProfile extends Omit<Parent, 'students'> {
  name: string;
  students: Student[];
  createdAt: string;
  updatedAt: string;
}

const ParentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'curriculum' | 'insights'>('overview');
  const [parentProfile, setParentProfile] = useState<ParentProfile | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const { currentUser: user, loginWithGoogle } = useAuth();
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const profile = await getParentProfile(user.uid);
          if (profile) {
            setParentProfile({
              ...profile,
              name: profile.displayName,
              id: profile.id || user.uid,
              students: profile.students.map((student: string) => ({
                id: student,
                name: '',
                age: 0,
                grade: '',
                parentId: profile.id || user.uid,
                hasTakenAssessment: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              })) || [],
              createdAt: profile.createdAt || new Date().toISOString(),
              updatedAt: profile.updatedAt || new Date().toISOString()
            });
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };
    fetchProfile();
  }, [user]);

  const handleGoogleLogin = async () => {
    try {
      setError("");
      await loginWithGoogle();
    } catch (error) {
      setError("Login failed. Please try again.");
      console.error("Login error:", error);
    }
  };

  const handleProfileSwitch = (studentId: string) => {
    setSelectedStudent(studentId);
    navigate(`/student-dashboard/${studentId}`);
  };

  return (
    <DashboardContainer>
      <DashboardHeader>
        <h1>Parent Dashboard</h1>
      </DashboardHeader>

      <ProfileSection>
        <h2>Account Details</h2>
        <p>Name: {parentProfile?.name || "Parent"}</p>
        <p>Email: {user?.email}</p>
        {!user && (
          <GoogleButton onClick={handleGoogleLogin}>
            Sign in with Google
          </GoogleButton>
        )}
      </ProfileSection>

      {user && (
        <>
          <StudentManagement>
            <h2>Student Profiles</h2>
            <AddStudentButton>➕ Add Student</AddStudentButton>
            
            <StudentList>
              {parentProfile?.students?.map((student) => (
                <StudentCard key={student.id} onClick={() => handleProfileSwitch(student.id)}>
                  <h3>{student.name}</h3>
                  <p>Grade: {student.grade}</p>
                  <p>Assessment: {student.hasTakenAssessment ? 'Completed' : 'Pending'}</p>
                  <ViewProfileButton>View Profile</ViewProfileButton>
                </StudentCard>
              ))}
            </StudentList>
          </StudentManagement>

          <TabContainer>
            <TabList>
              <Tab active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>Overview</Tab>
              <Tab active={activeTab === 'progress'} onClick={() => setActiveTab('progress')}>Progress</Tab>
              <Tab active={activeTab === 'curriculum'} onClick={() => setActiveTab('curriculum')}>Curriculum</Tab>
              <Tab active={activeTab === 'insights'} onClick={() => setActiveTab('insights')}>Insights</Tab>
            </TabList>

            <TabContent>
              {activeTab === 'overview' && <OverviewTab />}
              {activeTab === 'progress' && <StudentProgressTracker />}
              {activeTab === 'curriculum' && <CurriculumApproval />}
              {activeTab === 'insights' && <LearningStyleInsights />}
            </TabContent>
          </TabContainer>

          <NotificationSection>
            <NotificationCenter />
          </NotificationSection>
        </>
      )}
    </DashboardContainer>
  );
};

// Styled components
const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const DashboardHeader = styled.div`
  margin-bottom: 2rem;
  h1 {
    font-size: 2rem;
    color: var(--primary-color);
  }
`;

const ProfileSection = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const StudentManagement = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const AddStudentButton = styled.button`
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: var(--primary-dark);
  }
`;

const StudentList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const StudentCard = styled.div`
  background: #f8fafc;
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
`;

const TabContainer = styled.div`
  margin-top: 2rem;
`;

const TabList = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

interface TabProps {
  active: boolean;
}

const Tab = styled.button<TabProps>`
  padding: 0.5rem 1rem;
  border: none;
  background: ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--text-color)'};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? 'var(--primary-dark)' : '#f0f0f0'};
  }
`;

const TabContent = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const NotificationSection = styled.div`
  margin-top: 2rem;
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 1px solid #ddd;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #f8f8f8;
  }
`;

const OverviewTab = styled.div`
  // Add specific styles for the overview tab content
`;

const ViewProfileButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--primary-dark);
  }
`;

export default ParentDashboard;
```

---

## /src/pages/profile/ParentProfile/ParentProfile.tsx

```tsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addStudent } from '../../../store/slices/profileSlice';
import { RootState } from '../../../store';
import { Student } from '../../../types/auth';  // Using the auth Student type consistently
import { useAuth } from '../../../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import styled from 'styled-components';
import { getStudentProfile } from '../../../services/profileService';

const ParentProfile: React.FC = () => {
  const dispatch = useDispatch();
  const parent = useSelector((state: RootState) => state.profile.parent);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudent, setNewStudent] = useState<Partial<Student>>({});
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState("");
  const [studentsData, setStudentsData] = useState<Student[]>([]);

  const handleAddStudent = () => {
    if (newStudent.name) {
      dispatch(addStudent({
        id: Date.now().toString(),
        name: newStudent.name || '',
        grade: newStudent.grade || '',
        parentId: parent?.id || '',
        hasTakenAssessment: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      setShowAddStudent(false);
      setNewStudent({});
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError("");
      await loginWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to login");
      console.error("Login error:", err);
    }
  };

  useEffect(() => {
    const fetchStudentsData = async () => {
      if (parent?.students) {
        try {
          const studentsPromises = parent.students.map(async studentId => {
            const student = await getStudentProfile(studentId);
            return student as Student;  // Ensure type consistency
          });
          const fetchedStudents = await Promise.all(studentsPromises);
          setStudentsData(fetchedStudents.filter((s): s is Student => s !== null));
        } catch (error) {
          console.error('Error fetching students:', error);
        }
      }
    };

    fetchStudentsData();
  }, [parent?.students]);

  return (
    <Container>
      <ProfileBox>
        <Title>Parent Profile</Title>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <GoogleButton onClick={handleGoogleLogin}>
          <FcGoogle className="text-xl" />
          Sign in with Google
        </GoogleButton>

        <div className="students-section">
          <h3>My Students</h3>
          <button onClick={() => setShowAddStudent(true)}>Add Student</button>

          {showAddStudent && (
            <div className="add-student-form">
              <input
                type="text"
                placeholder="Student Name"
                value={newStudent.name || ''}
                onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
              />
              <input
                type="text"
                placeholder="Grade"
                value={newStudent.grade || ''}
                onChange={(e) => setNewStudent({...newStudent, grade: e.target.value})}
              />
              <button onClick={handleAddStudent}>Save</button>
              <button onClick={() => setShowAddStudent(false)}>Cancel</button>
            </div>
          )}

          <div className="students-list">
            {studentsData.map((student) => (
              <div key={student.id} className="student-card">
                <h4>{student.name}</h4>
                {student.grade && <p>Grade: {student.grade}</p>}
                <p>Learning Style: {student.learningStyle || 'Not assessed'}</p>
                <div className="progress-summary">
                  {student.hasTakenAssessment ? (
                    <div className="assessment-status">Assessment Complete</div>
                  ) : (
                    <div className="assessment-status">Assessment Needed</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ProfileBox>
    </Container>
  );
};

const Container = styled.div`
  padding: 2rem;
`;

const ProfileBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  margin-bottom: 2rem;

  &:hover {
    background: #f5f5f5;
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  background: #fee2e2;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

export default ParentProfile;
```

---

## /src/pages/profile/ParentProfile/ParentProfileForm.tsx

```tsx
import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { createParentProfile } from '../../../services/profileService';
import styled from 'styled-components';

interface FormData {
  displayName: string;
  phone: string;
  email: string;
}

export const ParentProfileForm: React.FC = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    displayName: currentUser?.displayName || '',
    phone: '',
    email: currentUser?.email || ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) {
      setError('You must be logged in to create a profile');
      return;
    }

    setLoading(true);
    setError('');
    try {
      console.log('📝 Creating parent profile for:', currentUser.uid);
      await createParentProfile({
        uid: currentUser.uid,
        email: formData.email,
        displayName: formData.displayName,
        phone: formData.phone
      });
      setSuccess(true);
      console.log('✅ Parent profile created successfully');
    } catch (err) {
      console.error('❌ Error creating parent profile:', err);
      setError('Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <SuccessMessage>
        Profile created successfully! You can now add students to your account.
      </SuccessMessage>
    );
  }

  return (
    <FormContainer>
      <h2>Complete Your Parent Profile</h2>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="displayName">Full Name</Label>
          <Input
            id="displayName"
            type="text"
            placeholder="Your full name"
            value={formData.displayName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({
              ...formData,
              displayName: e.target.value
            })}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Your phone number"
            value={formData.phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({
              ...formData,
              phone: e.target.value
            })}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Your email"
            value={formData.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({
              ...formData,
              email: e.target.value
            })}
            required
            disabled={!!currentUser?.email}
          />
        </FormGroup>

        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Creating Profile...' : 'Create Profile'}
        </SubmitButton>
      </Form>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  h2 {
    margin-bottom: 1.5rem;
    color: var(--primary-color);
    text-align: center;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  background: var(--primary-color);
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: var(--primary-dark);
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  background: #fee2e2;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.div`
  color: #059669;
  background: #d1fae5;
  padding: 1rem;
  border-radius: 4px;
  text-align: center;
  margin: 1rem 0;
`;

export default ParentProfileForm;
```

---

## /src/pages/profile/ParentProfile/dashboard/components/CurriculumApproval.tsx

```tsx
import React from 'react';
import styled from 'styled-components';
import { Student } from '../../../../../types/auth';

interface CurriculumApprovalProps {
  studentData?: Student[];
}

const CurriculumApproval: React.FC<CurriculumApprovalProps> = ({ studentData }) => {
  return (
    <ApprovalContainer>
      <h3>Pending Curriculum Approvals</h3>
      {studentData?.map(student => (
        <ApprovalCard key={student.id}>
          <h4>{student.name}</h4>
          <ApprovalActions>
            <button className="approve">Approve</button>
            <button className="review">Review</button>
          </ApprovalActions>
        </ApprovalCard>
      ))}
    </ApprovalContainer>
  );
};

const ApprovalContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
`;

const ApprovalCard = styled.div`
  margin: 15px 0;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
`;

const ApprovalActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;

  button {
    padding: 5px 15px;
    border-radius: 4px;
    border: none;
    cursor: pointer;

    &.approve {
      background: #4CAF50;
      color: white;
    }

    &.review {
      background: #FFA726;
      color: white;
    }
  }
`;

export default CurriculumApproval;
```

---

## /src/pages/profile/ParentProfile/dashboard/components/NotificationCenter.tsx

```tsx
import React from 'react';
import styled from 'styled-components';

const NotificationCenter: React.FC = () => {
  return (
    <NotificationContainer>
      <h3>Notifications</h3>
      <NotificationList>
        {/* Placeholder for notifications */}
        <NotificationItem>
          <span>No new notifications</span>
        </NotificationItem>
      </NotificationList>
    </NotificationContainer>
  );
};

const NotificationContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const NotificationList = styled.div`
  margin-top: 15px;
`;

const NotificationItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom: none;
  }
`;

export default NotificationCenter;
```

---

## /src/pages/profile/ParentProfile/components/StudentProgressTracker.tsx

```tsx
import React from 'react';
import styled from 'styled-components';
import { Student } from '../../../../types/student';

interface StudentProgressTrackerProps {
  studentData?: Student[];
}

const StudentProgressTracker: React.FC<StudentProgressTrackerProps> = ({ studentData }) => {
  return (
    <ProgressContainer>
      <h3>Student Progress Overview</h3>
      {studentData?.map(student => (
        <ProgressCard key={student.id}>
          <h4>{student.name}</h4>
          <ProgressBar>
            <Progress width={75} />
          </ProgressBar>
        </ProgressCard>
      ))}
    </ProgressContainer>
  );
};

const ProgressContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const ProgressCard = styled.div`
  margin: 15px 0;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 10px;
  background: #eee;
  border-radius: 5px;
  overflow: hidden;
`;

const Progress = styled.div<{ width: number }>`
  width: ${props => props.width}%;
  height: 100%;
  background: #4CAF50;
  transition: width 0.3s ease;
`;

export default StudentProgressTracker;
```

---

## /src/pages/profile/StudentProfile/StudentDashboard.tsx

```tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion as m } from 'framer-motion';
import styled from 'styled-components';
import { FaGraduationCap, FaChartLine, FaBook } from 'react-icons/fa';
import { useAuth } from '../../../contexts/AuthContext';
import { getStudentProfile } from '../../../services/profileService';
import { Student } from '../../../types/auth';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import LearningStyleChat from '../../../components/chat/LearningStyleChat';
import { DefaultTheme } from 'styled-components';

interface ThemeProps {
  theme: DefaultTheme;
}

interface StudentData extends Student {
  recentActivities: Array<{
    id?: string;
    type: string;
    name: string;
    date: string;
  }>;
  progress: Array<{
    type: string;
    value: number;
  }>;
}

const StudentDashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!id) {
        setError('Student ID not found');
        return;
      }

      try {
        const data = await getStudentProfile(id);
        if (data) {
          setStudentData({
            ...data,
            id: data.id || id,
            recentActivities: [],
            progress: []
          } as StudentData);
        } else {
          setError('Student not found');
        }
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Failed to load student data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [id]);

  if (loading) {
    return (
      <StyledLoadingContainer>
        <LoadingSpinner />
      </StyledLoadingContainer>
    );
  }

  if (error) {
    return <StyledErrorContainer>{error}</StyledErrorContainer>;
  }

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <StyledHeader>
        <StyledHeaderLeft>
          <h1>Welcome, {studentData?.name}!</h1>
          <p>Grade {studentData?.grade}</p>
        </StyledHeaderLeft>
      </StyledHeader>

      <DashboardGrid>
        <MainSection>
          {!studentData?.hasTakenAssessment && (
            <AssessmentSection>
              <h2>Learning Style Assessment</h2>
              <p>Take your learning style assessment to get personalized recommendations.</p>
              <LearningStyleChat />
            </AssessmentSection>
          )}

          {studentData?.hasTakenAssessment && studentData.learningStyle && (
            <LearningStyleSection>
              <h2>Your Learning Style: {studentData.learningStyle}</h2>
              <p>Based on your assessment, we've customized your learning experience.</p>
            </LearningStyleSection>
          )}

          <ProgressSection>
            <h2>Recent Progress</h2>
            {/* Add progress visualization here */}
          </ProgressSection>
        </MainSection>
      </DashboardGrid>
    </m.div>
  );
};

const DashboardContainer = styled(m.div)`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const StyledLoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const StyledErrorContainer = styled.div`
  text-align: center;
  color: red;
  padding: 2rem;
`;

const StyledHeader = styled(m.header)`
  margin-bottom: 2rem;
`;

const StyledHeaderLeft = styled.div`
  h1 {
    margin: 0;
    color: var(--primary-color);
  }
  p {
    margin: 0.5rem 0 0;
    color: var(--text-secondary);
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  gap: 2rem;
`;

const MainSection = styled.div`
  display: grid;
  gap: 2rem;
`;

const AssessmentSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const LearningStyleSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ProgressSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

export default StudentDashboard;
```

---

## /src/pages/profile/StudentProfile/StudentProfile.tsx

```tsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";
import styled from "styled-components";
import CourseCard from "../../../components/CourseCard";

interface Course {
  title: string;
  type: "Video Animated" | "Quiz" | "Mind Map";
  category: string;
}

const StudentProfile: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string>("");
  const [filter, setFilter] = useState<string>("");

  const handleGoogleLogin = async () => {
    try {
      setError("");
      await loginWithGoogle();
      const destination = location.state?.from?.pathname || "/dashboard";
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to login");
      console.error("Login error:", err);
    }
  };

  const courses: Course[] = [
    { title: "Introduction to Learning Styles", type: "Video Animated", category: "Learning Fundamentals" },
    { title: "Learning Style Quiz", type: "Quiz", category: "Assessment" },
    { title: "Visual Learning Techniques", type: "Mind Map", category: "Learning Techniques" }
  ];

  return (
    <Container>
      <ProfileBox>
        <Title>Student Profile</Title>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <GoogleButton onClick={handleGoogleLogin}>
          <FcGoogle className="text-xl" />
          Sign in with Google
        </GoogleButton>

        {/* Search Filter */}
        <input
          type="text"
          placeholder="Search courses..."
          className="border px-4 py-2 w-full mb-4 rounded-lg"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />

        {/* Course List */}
        <div className="grid grid-cols-3 gap-4">
          {courses
            .filter((course) => course.title.toLowerCase().includes(filter.toLowerCase()))
            .map((course, index) => (
              <CourseCard key={index} {...course} />
            ))}
        </div>
      </ProfileBox>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f5f5;
`;

const ProfileBox = styled.div`
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: #2C3E50;
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  text-align: center;
`;

const GoogleButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: white;
  color: #333;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8fafc;
  }

  &:focus {
    outline: none;
    ring: 2px;
    ring-offset: 2px;
    ring-blue-500;
  }
`;

export default StudentProfile;
```

---

## /src/pages/profile/StudentProfile/StudentProfileForm.tsx

```tsx
import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import styled from 'styled-components';

interface StudentFormData {
  firstName: string;
  lastName: string;
  age: string;
  grade: string;
}

interface FormState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const StudentProfileForm: React.FC = () => {
  const [formData, setFormData] = useState<StudentFormData>({
    firstName: '',
    lastName: '',
    age: '',
    grade: ''
  });

  const [formState, setFormState] = useState<FormState>({
    loading: false,
    error: null,
    success: false
  });

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      age: '',
      grade: ''
    });
    setFormState({
      loading: false,
      error: null,
      success: false
    });
  };

  const validateForm = (): boolean => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setFormState(prev => ({ ...prev, error: 'First and last name are required' }));
      return false;
    }
    if (!formData.age || parseInt(formData.age) < 4 || parseInt(formData.age) > 18) {
      setFormState(prev => ({ ...prev, error: 'Age must be between 4 and 18' }));
      return false;
    }
    if (!formData.grade.trim()) {
      setFormState(prev => ({ ...prev, error: 'Grade is required' }));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parentId = auth.currentUser?.uid;
    
    if (!parentId) {
      setFormState(prev => ({ ...prev, error: 'Parent authentication required' }));
      return;
    }

    if (!validateForm()) return;

    setFormState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await addDoc(collection(db, 'students'), {
        ...formData,
        parentId,
        createdAt: new Date().toISOString()
      });
      
      setFormState({ loading: false, error: null, success: true });
      setTimeout(resetForm, 3000);
    } catch (error) {
      setFormState({
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
        success: false
      });
    }
  };

  return (
    <FormContainer>
      {formState.success && (
        <SuccessMessage>Student added successfully!</SuccessMessage>
      )}
      {formState.error && (
        <ErrorMessage>{formState.error}</ErrorMessage>
      )}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>First Name *</Label>
          <Input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            disabled={formState.loading}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Last Name *</Label>
          <Input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            disabled={formState.loading}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Age *</Label>
          <Input
            type="number"
            min="4"
            max="18"
            value={formData.age}
            onChange={(e) => setFormData({...formData, age: e.target.value})}
            disabled={formState.loading}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Grade *</Label>
          <Input
            type="text"
            value={formData.grade}
            onChange={(e) => setFormData({...formData, grade: e.target.value})}
            disabled={formState.loading}
            required
          />
        </FormGroup>
        <SubmitButton type="submit" disabled={formState.loading}>
          {formState.loading ? 'Adding Student...' : 'Add Student'}
        </SubmitButton>
      </Form>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: var(--text-color);
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: var(--secondary-color);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const Message = styled.div`
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
`;

const SuccessMessage = styled(Message)`
  background: var(--success-color);
  color: white;
`;

const ErrorMessage = styled(Message)`
  background: var(--danger-color);
  color: white;
`;

export default StudentProfileForm;
```

---

## /src/pages/profile/components/LearningStyleInsights.tsx

```tsx
import React from 'react';
import styled from 'styled-components';
import { Student } from '../../../types/student';

interface LearningStyleInsightsProps {
  studentData?: Student[];
}

const LearningStyleInsights: React.FC<LearningStyleInsightsProps> = ({ studentData }) => {
  return (
    <InsightsContainer>
      <h3>Learning Style Analytics</h3>
      {studentData?.map(student => (
        <InsightCard key={student.id}>
          <h4>{student.name}</h4>
          <InsightContent>
            <div>Learning Style: {student.learningStyle || 'Not assessed'}</div>
            <div>Recommended Activities: {student.recommendedActivities?.length || 0}</div>
          </InsightContent>
        </InsightCard>
      ))}
    </InsightsContainer>
  );
};

const InsightsContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
`;

const InsightCard = styled.div`
  margin: 15px 0;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
`;

const InsightContent = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export default LearningStyleInsights;
```

---

## /src/pages/__tests__/About.test.tsx

```tsx
// File: /src/pages/__tests__/About.test.tsx
// Description: Unit test for About page component.

import { screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { renderWithProviders } from "../../test/testUtils";
import About from "../About";

describe('About Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    renderWithProviders(<About />);
  });

  test("renders About component with correct content", () => {
    expect(screen.getByRole('heading', { name: /about geaux academy/i })).toBeInTheDocument();
    expect(screen.getByText(/Geaux Academy is an interactive learning platform that adapts to individual learning styles through AI-powered assessments and personalized content delivery./i)).toBeInTheDocument();
  });
});
```

---

## /src/pages/__tests__/Contact.test.tsx

```tsx
// File: /src/pages/__tests__/Contact.test.tsx
// Description: Unit test for Contact page component.

import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/testUtils";
import Contact from "../Contact";

describe('Contact Component', () => {
  test("renders Contact component with correct content", () => {
    renderWithProviders(<Contact />);
    expect(screen.getByRole('heading', { name: /contact us/i })).toBeInTheDocument();
    expect(screen.getByText(/Feel free to reach out to us with any questions or feedback./i)).toBeInTheDocument();
  });
});
```

---

## /src/pages/__tests__/Curriculum.test.tsx

```tsx
// File: /src/pages/__tests__/Curriculum.test.tsx
// Description: Unit test for Curriculum page component.

import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/testUtils";
import Curriculum from "../Curriculum";

describe('Curriculum Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Curriculum component with correct content", () => {
    renderWithProviders(<Curriculum />);
    expect(screen.getByRole('heading', { name: /curriculum/i })).toBeInTheDocument();
    expect(screen.getByText(/Our curriculum is designed to adapt to your learning style and pace./i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in with google to get started/i })).toBeInTheDocument();
  });
});
```

---

## /src/pages/__tests__/Features.test.tsx

```tsx
// File: /src/pages/__tests__/Features.test.tsx
// Description: Unit test for Features page component.

import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/testUtils";
import Features from "../Features";

describe('Features Component', () => {
  test("renders Features component with correct content", () => {
    renderWithProviders(<Features />);
    expect(screen.getByText("Features")).toBeInTheDocument();
    expect(screen.getByText("AI-powered learning style assessment")).toBeInTheDocument();
    expect(screen.getByText("Personalized learning paths")).toBeInTheDocument();
    expect(screen.getByText("Real-time progress tracking")).toBeInTheDocument();
    expect(screen.getByText("Interactive dashboard")).toBeInTheDocument();
  });
});
```

---

## /src/pages/__tests__/Home.test.tsx

```tsx
// File: /src/pages/__tests__/Home.test.tsx
// Description: Unit test for Home page component.

import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders, mockLoginWithGoogle } from "../../test/testUtils";
import Home from "../Home";

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Home component with correct content", () => {
    renderWithProviders(<Home />, { withRouter: true });
    expect(screen.getByRole('heading', { name: /welcome to geaux academy/i })).toBeInTheDocument();
    expect(screen.getByText(/empowering personalized learning through ai/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /ready to start your learning journey\?/i })).toBeInTheDocument();
  });

  test("handles Google login", async () => {
    renderWithProviders(<Home />, { withRouter: true });
    const loginButton = screen.getByRole('button', { name: /sign in with google/i });
    
    fireEvent.click(loginButton);
    
    expect(mockLoginWithGoogle).toHaveBeenCalled();
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });
});
```

---

## /src/pages/__tests__/LearningStyles.test.tsx

```tsx
// File: /src/pages/__tests__/LearningStyles.test.tsx
// Description: Unit test for Learning Styles page component.

import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/testUtils";
import LearningStyles from "../LearningStyles";

describe('LearningStyles Component', () => {
  test("renders Learning Styles component with correct content", () => {
    renderWithProviders(<LearningStyles />, { withRouter: true });
    expect(screen.getByText("Learning Styles")).toBeInTheDocument();
    expect(screen.getByText("Discover your preferred learning style and how Geaux Academy can help you learn more effectively.")).toBeInTheDocument();
  });
});
```

---

## /src/pages/styles/Contact.css

```css
.contact-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1rem;
}

.contact-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}
```

---

## /src/server/main.py

```plaintext
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.student_routes import router as student_router

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your Vue.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(student_router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

---

## /src/server/routes/studentRoutes.js

```javascript
const express = require('express');
const router = express.Router();

// ...existing code...

router.post('/students', async (req, res) => {
  try {
    const { name } = req.body;
    // Here you would typically create a new student in your database
    // This is a mock response
    const newStudent = {
      id: Date.now(),
      name,
      createdAt: new Date()
    };
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ error: `Failed to create student profile: ${error.message}` });
  }
});

router.get('/students/:student_id', async (req, res) => {
  try {
    const { student_id } = req.params;
    // Here you would typically fetch the student from your database
    // This is a mock response
    const student = {
      id: student_id,
      name: 'John Doe',
      createdAt: new Date()
    };
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: `Failed to get student profile: ${error.message}` });
  }
});

router.put('/students/:student_id', async (req, res) => {
  try {
    const { student_id } = req.params;
    const { name } = req.body;
    // Here you would typically update the student in your database
    // This is a mock response
    const updatedStudent = {
      id: student_id,
      name,
      createdAt: new Date()
    };
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ error: `Failed to update student profile: ${error.message}` });
  }
});

router.delete('/students/:student_id', async (req, res) => {
  try {
    const { student_id } = req.params;
    // Here you would typically delete the student from your database
    // This is a mock response
    res.status(200).json({ detail: `Student ${student_id} deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: `Failed to delete student profile: ${error.message}` });
  }
});

// ...existing code...

module.exports = router;
```

---

## /src/server/routes/student_routes.py

```plaintext
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
import time

router = APIRouter()

class StudentCreate(BaseModel):
    name: str

class StudentUpdate(BaseModel):
    name: str

class Student(StudentCreate):
    id: int
    created_at: datetime

students_db = {}

@router.post("/students", response_model=Student)
async def create_student(student: StudentCreate):
    try:
        new_student = Student(
            id=int(time.time()),
            name=student.name,
            created_at=datetime.now()
        )
        students_db[new_student.id] = new_student
        return new_student
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to create student profile")

@router.get("/students/{student_id}", response_model=Student)
async def get_student(student_id: int):
    student = students_db.get(student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@router.put("/students/{student_id}", response_model=Student)
async def update_student(student_id: int, student_update: StudentUpdate):
    student = students_db.get(student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    updated_student = Student(id=student_id, name=student_update.name, created_at=student.created_at)
    students_db[student_id] = updated_student
    return updated_student

@router.delete("/students/{student_id}")
async def delete_student(student_id: int):
    student = students_db.pop(student_id, None)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"detail": "Student deleted successfully"}
```

---

## /src/store/index.ts

```typescript
import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './slices/profileSlice';

const store = configureStore({
  reducer: {
    profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
```

---

## /src/store/slices/profileSlice.ts

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Parent, Student } from '../../types/profiles';

interface ProfileState {
  parent: Parent | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  parent: null,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setParentProfile: (state, action: PayloadAction<Parent>) => {
      state.parent = action.payload;
    },
    addStudent: (state, action: PayloadAction<Student>) => {
      if (state.parent) {
        state.parent.students.push(action.payload);
      }
    },
    updateStudent: (state, action: PayloadAction<Student>) => {
      if (state.parent) {
        const index = state.parent.students.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.parent.students[index] = action.payload;
        }
      }
    },
  },
});

export const { setParentProfile, addStudent, updateStudent } = profileSlice.actions;
export default profileSlice.reducer;
```

---

## /src/config/env.js

```javascript
const config = {
  AZURE_ENDPOINT: process.env.REACT_APP_AZURE_ENDPOINT || 'https://ai-geauxacademy8942ai219453410909.openai.azure.com/',
  AZURE_COGNITIVE_ENDPOINT: process.env.REACT_APP_AZURE_COGNITIVE_ENDPOINT || 'https://ai-geauxacademy8942ai219453410909.cognitiveservices.azure.com/',
  AZURE_DEPLOYMENT_ENDPOINT: process.env.REACT_APP_AZURE_DEPLOYMENT_ENDPOINT || 'https://ai-geauxacademy8942ai219453410909.services.ai.azure.com/models',
  MODEL_NAME: process.env.REACT_APP_MODEL_NAME || 'gpt-4',
  AZURE_API_KEY: process.env.REACT_APP_AZURE_API_KEY || process.env.VITE_OPENAI_API_KEY
};

export default config;
```

---

## /src/types/auth.ts

```typescript
import { UserCredential } from 'firebase/auth';

// Common types for auth context and components
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  metadata?: {
    lastSignInTime?: string;
    creationTime?: string;
  };
}

export interface AuthError {
  code?: string;
  message: string;
}

export interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<UserCredential>;
  loginWithGoogle: () => Promise<void>;
  signup: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  setAuthError: (error: string | null) => void;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  parentId: string;
  hasTakenAssessment: boolean;
  createdAt: string;
  updatedAt: string;
  learningStyle?: string;
  assessmentResults?: object;
}

export interface Parent {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  students: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthRouteProps {
  children: React.ReactNode;
}

export interface PrivateRouteProps {
  children: React.ReactNode;
}

declare global {
  interface WindowEventMap {
    'firebase-auth-worker-status': CustomEvent<{
      success: boolean;
      isSecure: boolean;
      supportsServiceWorker: boolean;
      error?: string;
    }>;
    'firebase-auth-error': CustomEvent<{
      error: string;
      fallbackToRedirect?: boolean;
      status?: number;
    }>;
    'firebase-auth-popup-ready': CustomEvent<{
      secure: boolean;
    }>;
    'firebase-auth-success': CustomEvent<{
      status: number;
    }>;
    'firebase-auth-security': CustomEvent<{
      secure: boolean;
    }>;
  }
}

export {};
```

---

## /src/types/css.d.ts

```typescript
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.css' {
  const css: { [key: string]: string };
  export default css;
}
```

---

## /src/types/dashboard.ts

```typescript
export interface StudentProgress {
  completionRate: number;
  timeSpent: number;
  accuracy: number;
  subjectProgress: {
    [subject: string]: {
      completed: number;
      total: number;
    };
  };
}

export interface LearningStyle {
  visual: number;
  auditory: number;
  reading: number;
  kinesthetic: number;
  recommendations: string[];
}

export interface DashboardState {
  activeTab: 'overview' | 'progress' | 'learning-styles' | 'curriculum';
  studentData: {
    progress: StudentProgress;
    learningStyle: LearningStyle;
  } | null;
}
```

---

## /src/types/firebase.d.ts

```typescript
// File: /src/types/firebase.d.ts
// Description: Type declarations for Firebase modules
// Author: GitHub Copilot
// Created: 2024-02-12

declare module 'firebase/app' {
  export * from '@firebase/app';
}

declare module 'firebase/auth' {
  export * from '@firebase/auth';
}

declare module 'firebase/firestore' {
  export * from '@firebase/firestore';
}

declare module 'firebase/analytics' {
  export * from '@firebase/analytics';
}

declare module 'firebase/messaging' {
  export * from '@firebase/messaging';
}
```

---

## /src/types/profiles.ts

```typescript
// Base Types
export interface BaseProfile {
    uid: string;
    email: string;
    displayName: string;
    createdAt: string;
    updatedAt: string;
}

// Parent Profile Types
export interface Parent extends BaseProfile {
    phone?: string;
    students: string[];
}

// Student Profile Types
export interface Student {
    id: string;
    parentId: string;
    name: string;
    grade: string;
    learningStyle?: LearningStyle;
    hasTakenAssessment: boolean;
    assessmentStatus?: string;
    createdAt: string;
    updatedAt: string;
    recommendedActivities?: string[];
    progress?: StudentProgress[];
    assessmentResults?: AssessmentResult[];
}

// Progress Types
export interface StudentProgress {
    courseId: string;
    completed: number;
    total: number;
    lastAccessed: string;
}

// Assessment Types
export interface AssessmentResult {
    date: string;
    score: number;
    subject: string;
    details: Record<string, unknown>;
}

// Learning Style Types
export interface LearningStyle {
    type: 'visual' | 'auditory' | 'kinesthetic' | 'reading/writing';
    strengths: string[];
    recommendations: string[];
}
```

---

## /src/types/service-worker.d.ts

```typescript

```

---

## /src/types/student.ts

```typescript
export interface Student {
  id: string;
  name: string;
  grade?: string;
  age?: number;
  learningStyle?: string;
  hasTakenAssessment: boolean;
  progress?: Array<{
    id: string;
    type: string;
    name: string;
    date: string;
  }>;
  recommendedActivities?: string[];
  createdAt?: string;
  updatedAt?: string;
  parentId: string;
}
```

---

## /src/types/styled.d.ts

```typescript
import 'styled-components';
import { Theme } from '@mui/material/styles';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {
    breakpoints: Theme['breakpoints'] & {
      mobile: string;
      tablet: string;
      desktop: string;
      large: string;
    };
    spacing: Theme['spacing'] & {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    colors: {
      border: string;
      text: string;
      background: {
        hover: string;
      };
      error: {
        main: string;
        light: string;
      };
    };
    borderRadius: {
      default: string;
    };
  }
}
```

---

## /src/types/types.ts

```typescript
// File: /types/types.ts
// Description: Core type definitions for user profiles, assessments, and course progress
// Author: Geaux Academy Team
// Created: 2024
export interface ParentProfile {
  uid: string;
  email: string;
  displayName: string;
  students: StudentProfile[];
}

export interface StudentProfile {
  id: string;
  parentId: string;
  firstName: string;
  lastName: string;
  age: number;
  grade: string;
  learningStyle?: LearningStyle;
  assessmentResults?: AssessmentResult[];
  progress?: CourseProgress[];
}

export interface LearningStyle {
  type: 'visual' | 'auditory' | 'kinesthetic' | 'reading/writing';
  strengths: string[];
  recommendations: string[];
}

export interface AssessmentResult {
  date: string;
  score: number;
  subject: string;
  details: Record<string, unknown>;
}

export interface CourseProgress {
  courseId: string;
  completed: number;
  total: number;
  lastAccessed: string;
}
```

---

## /src/types/userTypes.ts

```typescript
export interface BaseProfile {
  uid: string;
  email: string;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ParentProfile extends BaseProfile {
  role: 'parent';
  phone?: string;
  students: StudentProfile[];
}

export interface StudentProfile extends BaseProfile {
  role: 'student';
  parentId: string;
  grade: string;
  dateOfBirth: Date;
}
```

---

## /src/services/api.js

```javascript
import axios from 'axios';

import { auth } from '../firebase/config';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://learn.geaux.app',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 second timeout
  withCredentials: true // Enable sending cookies in cross-origin requests
});

// Add request interceptor for auth headers
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const token = await user.getIdToken(true); // Get a fresh token
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error("Error refreshing token:", error);
        localStorage.removeItem('token');
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor with enhanced error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle unauthorized errors and try token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const user = auth.currentUser;
        if (user) {
          const newToken = await user.getIdToken(true);
          localStorage.setItem('token', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed. Logging out...", refreshError);
        localStorage.removeItem('token');
        window.location.href = '/login'; // Redirect to login
      }
    }

    // Handle other error cases
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      request: error.request,
      message: error.message
    });

    // Enhanced error handling
    let errorMessage = "An error occurred. Please try again.";
    switch (error.response?.status) {
      case 400:
        errorMessage = "Bad request. Please check your input.";
        break;
      case 403:
        errorMessage = "You don't have permission to perform this action.";
        break;
      case 404:
        errorMessage = "The requested resource was not found.";
        break;
      case 500:
        errorMessage = "Internal server error. Please try again later.";
        break;
      case 503:
        errorMessage = "Service unavailable. Please try again later.";
        break;
      default:
        errorMessage = `Error: ${error.message}`;
    }

    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
```

---

## /src/services/cheshireService.ts

```typescript
import axios, { AxiosInstance } from 'axios';
import { auth } from '../firebase/config';

// Use environment variable if set, otherwise fall back to the production URL
const CHESHIRE_API_URL = import.meta.env.VITE_CHESHIRE_API_URL || 'https://cheshire.geaux.app';
const CHESHIRE_DEBUG = import.meta.env.VITE_CHESHIRE_DEBUG === 'true';

// Create axios instance with default configuration
const cheshireAxios: AxiosInstance = axios.create({
  baseURL: CHESHIRE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true,
  timeout: 30000
});

// Add authentication interceptor
cheshireAxios.interceptors.request.use(async (config) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error('Auth interceptor error:', error);
    return Promise.reject(error);
  }
});

// Add response interceptor for better error handling
cheshireAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (CHESHIRE_DEBUG) {
      console.error('Cheshire API Error:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
    }

    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - Unable to connect to Cheshire API:', error);
      console.error('Please ensure the TIPI container is running and accessible at:', CHESHIRE_API_URL);
    }
    return Promise.reject(error);
  }
);

interface CheshireResponse {
  text: string;
  response: string;
  memories?: Array<{
    metadata?: {
      learning_style?: string;
    };
  }>;
}

interface CheshireUser {
  username: string;
  permissions: {
    CONVERSATION: string[];
    MEMORY: string[];
    STATIC: string[];
    STATUS: string[];
  };
}

interface AuthResponse {
  access_token: string;
  token_type: string;
}

interface CheshireError {
  message: string;
  code?: string;
  response?: {
    status: number;
    data: unknown;
  };
  config?: {
    url: string;
    method: string;
    headers: Record<string, string>;
  };
}

export class CheshireService {
  private static async getAuthHeaders() {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Authentication required');
    }
    const token = await user.getIdToken();
    return {
      Authorization: `Bearer ${token}`
    };
  }

  private static async getFirebaseToken(): Promise<string | null> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user logged in');
      }
      return await user.getIdToken();
    } catch (error) {
      console.error('Error getting Firebase token:', error);
      return null;
    }
  }

  static async checkTipiHealth(): Promise<{ status: string; version: string }> {
    try {
      const response = await cheshireAxios.get('/');
      return {
        status: 'healthy',
        version: response.data.version || 'unknown'
      };
    } catch (error) {
      const err = error as CheshireError;
      console.error('TIPI health check failed:', err);
      if (err.code === 'ERR_NETWORK') {
        throw new Error('TIPI container is not accessible. Please ensure it is running.');
      }
      throw err;
    }
  }

  static async initialize(): Promise<void> {
    try {
      // Check TIPI container health
      await this.checkTipiHealth();
      
      console.log('✅ Cheshire Cat service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Cheshire Cat service:', error);
      throw error;
    }
  }

  static async checkConnection(): Promise<boolean> {
    try {
      const headers = await this.getAuthHeaders();
      await cheshireAxios.get('/', { headers });
      return true;
    } catch (error) {
      console.error('Cheshire API Connection Error:', error);
      return false;
    }
  }

  static async sendChatMessage(message: string, userId: string, chatId: string) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await cheshireAxios.post<CheshireResponse>(
        '/message',
        { text: message },
        { headers }
      );
      
      return {
        data: response.data.response,
        memories: response.data.memories
      };
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw this.getErrorMessage(error);
    }
  }

  static async createCheshireUser(firebaseUid: string, email: string): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      const payload: CheshireUser = {
        username: email,
        permissions: {
          CONVERSATION: ["WRITE", "EDIT", "LIST", "READ", "DELETE"],
          MEMORY: ["READ", "LIST"],
          STATIC: ["READ"],
          STATUS: ["READ"]
        }
      };

      await cheshireAxios.post('/users/', payload, { headers });
    } catch (error) {
      console.error('Error creating Cheshire user:', error);
      throw this.getErrorMessage(error);
    }
  }

  static getErrorMessage(error: CheshireError): string {
    if (error.message === 'Authentication required') {
      return "Please log in to continue.";
    }
    if (error.message === 'Failed to obtain Cheshire auth token') {
      return "Unable to connect to the chat service. Please try again later.";
    }
    if (error.code === 'ECONNABORTED') {
      return "The request timed out. Please try again.";
    }
    if (error.code === 'ERR_NETWORK') {
      if (error.message.includes('CORS')) {
        return "Unable to connect to the chat service due to CORS restrictions. Please contact support.";
      }
      return "Network error - Unable to connect to the chat service. Please check your connection and try again.";
    }
    if (error.response?.status === 401) {
      return "Your session has expired. Please try again.";
    }
    if (error.response?.status === 403) {
      return "You don't have permission to perform this action.";
    }
    if (error.response?.status === 404) {
      return "The chat service is not available. Please check if the service is running.";
    }
    return "Sorry, I'm having trouble connecting to the chat service. Please try again later.";
  }
}
```

---

## /src/services/firestore.ts

```typescript
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export async function getData(collectionName: string, docId: string) {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
}

export async function setData(collectionName: string, docId: string, data: any) {
  const docRef = doc(db, collectionName, docId);
  await setDoc(docRef, data, { merge: true });
  return true;
}

// ...other helper functions as needed...
```

---

## /src/services/openai.js

```javascript
import axios from 'axios';

const openaiClient = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

export default openaiClient;
```

---

## /src/services/profileService.ts

```typescript
import { db } from '../firebase/config';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { Parent, Student, LearningStyle } from "../types/profiles";

// Cache for storing profiles
const profileCache = new Map();

// Helper to check online status
const isOnline = () => navigator.onLine;

// Helper to handle offline errors
const handleOfflineError = (operation: string) => {
  const error = new Error(`Cannot ${operation} while offline`);
  error.name = 'OfflineError';
  return error;
};

// ✅ Create Parent Profile
export const createParentProfile = async (parentData: Partial<Parent>): Promise<string> => {
  try {
    if (!parentData.uid) throw new Error('User ID is required');
    
    const parentRef = doc(db, 'parents', parentData.uid);
    await setDoc(parentRef, {
      ...parentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      students: []
    });
    
    console.log('✅ Parent profile created successfully:', parentData.uid);
    return parentData.uid;
  } catch (error) {
    console.error('❌ Error creating parent profile:', error);
    throw error;
  }
};

// ✅ Fetch Parent Profile
export const getParentProfile = async (userId: string): Promise<Parent | null> => {
  try {
    console.log('🔍 Fetching parent profile for:', userId);

    // Check cache first
    if (profileCache.has(`parent_${userId}`)) {
      return profileCache.get(`parent_${userId}`);
    }

    const docRef = doc(db, 'parents', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      const parentProfile: Parent = {
        uid: data.uid || userId,
        email: data.email || '',
        displayName: data.displayName || '',
        students: data.students || [],
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString()
      };
      console.log('✅ Parent profile found:', parentProfile);
      // Cache the result
      profileCache.set(`parent_${userId}`, parentProfile);
      return parentProfile;
    }
    
    console.log('ℹ️ No parent profile found, creating one...');
    // If no profile exists, create one
    await createParentProfile({ uid: userId });
    return getParentProfile(userId); // Retry fetch after creation
    
  } catch (error) {
    if (!isOnline()) {
      console.warn('Offline: Using cached data if available');
      return profileCache.get(`parent_${userId}`) || null;
    }
    console.error('❌ Error fetching parent profile:', error);
    throw error;
  }
};

// ✅ Fetch Student Profile
export const getStudentProfile = async (studentId: string): Promise<Student> => {
  try {
    // Check cache first
    if (profileCache.has(`student_${studentId}`)) {
      return profileCache.get(`student_${studentId}`);
    }

    const studentRef = doc(db, "students", studentId);
    const studentDoc = await getDoc(studentRef);

    if (!studentDoc.exists()) {
      throw new Error("Student profile not found");
    }

    const studentData = studentDoc.data() as Student;
    // Cache the result
    profileCache.set(`student_${studentId}`, studentData);
    return studentData;
  } catch (error) {
    if (!isOnline()) {
      console.warn('Offline: Using cached data if available');
      return profileCache.get(`student_${studentId}`) || null;
    }
    throw error;
  }
};

// ✅ Add Student Profile
export const addStudentProfile = async (parentId: string, studentData: {
  name: string;
  grade: string;
  parentId: string;
  hasTakenAssessment: boolean;
}) => {
  try {
    console.log('📝 Adding student profile for parent:', parentId);
    
    // Add the student to the students collection
    const studentRef = await addDoc(collection(db, 'students'), {
      ...studentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Update the parent's students array
    const parentRef = doc(db, 'parents', parentId);
    const parentDoc = await getDoc(parentRef);

    if (parentDoc.exists()) {
      const currentStudents = parentDoc.data().students || [];
      await updateDoc(parentRef, {
        students: [...currentStudents, studentRef.id],
        updatedAt: new Date().toISOString()
      });
    }

    console.log('✅ Student profile added successfully:', studentRef.id);
    return studentRef.id;
  } catch (error) {
    console.error('❌ Error adding student profile:', error);
    throw error;
  }
};

// ✅ Update Student's Assessment Status
export const updateStudentAssessmentStatus = async (studentId: string, status: string) => {
  if (!isOnline()) {
    throw handleOfflineError('update assessment status');
  }

  const studentRef = doc(db, "students", studentId);
  try {
    await updateDoc(studentRef, {
      hasTakenAssessment: status === 'completed',
      assessmentStatus: status,
      updatedAt: new Date().toISOString(),
    });

    // Update cache
    const cachedData = profileCache.get(`student_${studentId}`);
    if (cachedData) {
      profileCache.set(`student_${studentId}`, {
        ...cachedData,
        hasTakenAssessment: status === 'completed',
        assessmentStatus: status,
        updatedAt: new Date().toISOString()
      });
    }
    console.log(`Assessment status updated to: ${status}`);
  } catch (error) {
    console.error("Error updating assessment status:", error);
    throw new Error("Failed to update assessment status");
  }
};

// ✅ Save Learning Style
export const saveLearningStyle = async (studentId: string, learningStyle: LearningStyle): Promise<void> => {
  if (!isOnline()) {
    throw handleOfflineError('save learning style');
  }

  try {
    console.log('📝 Saving learning style for student:', studentId);
    const studentRef = doc(db, 'students', studentId);
    
    await updateDoc(studentRef, {
      learningStyle,
      updatedAt: new Date().toISOString()
    });

    // Update cache
    const cachedData = profileCache.get(`student_${studentId}`);
    if (cachedData) {
      profileCache.set(`student_${studentId}`, {
        ...cachedData,
        learningStyle,
        updatedAt: new Date().toISOString()
      });
    }
    
    console.log('✅ Learning style saved successfully');
  } catch (error) {
    console.error('❌ Error saving learning style:', error);
    throw error;
  }
};

// Listen for online/offline events to manage cache
window.addEventListener('online', () => {
  console.info('Back online. Syncing data...');
  // Could add sync logic here if needed
});

window.addEventListener('offline', () => {
  console.warn('Gone offline. Using cached data...');
});

export class ProfileService {
  async getUserProfile(userId: string): Promise<any> {
    // ...existing API call logic...
    // Example:
    const response = await fetch(`/api/profiles/${userId}`);
    return response.json();
  }
}
```

---

## /src/theme/index.tsx

```tsx
// File: /src/theme/index.ts
// Description: Custom theme including breakpoint helpers

export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";

interface CustomBreakpoints {
  mobile: string;
  tablet: string;
  desktop: string;
  large: string;
  keys: (number | Breakpoint)[];
  up: (key: number | Breakpoint) => string;
  down: (key: number | Breakpoint) => string;
  between: (start: number | Breakpoint, end: number | Breakpoint) => string;
  only: (key: number | Breakpoint) => string;
}

export const breakpoints: CustomBreakpoints = {
  mobile: "0px",
  tablet: "768px",
  desktop: "1024px",
  large: "1440px",
  keys: ["xs", "sm", "md", "lg", "xl"],
  up: (key: number | Breakpoint) => {
    // implement using a strategy that works for both numbers and defined breakpoints
    // For simplicity, if key is number then convert to string with px otherwise use a mapping.
    if (typeof key === "number") {
      return `${key}px`;
    }
    const values: Record<Breakpoint, number> = { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 };
    return `${values[key]}px`;
  },
  down: (key: number | Breakpoint) => {
    if (typeof key === "number") {
      return `${key}px`;
    }
    const values: Record<Breakpoint, number> = { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 };
    return `${values[key]}px`;
  },
  between: (start: number | Breakpoint, end: number | Breakpoint) => {
    const getValue = (v: number | Breakpoint): number =>
      typeof v === "number" ? v : ({ xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 }[v]);
    return `${getValue(start)}px and ${getValue(end)}px`;
  },
  only: (key: number | Breakpoint) => {
    if (typeof key === "number") return `${key}px`;
    const values: Record<Breakpoint, number> = { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 };
    return `${values[key]}px`;
  }
};
```

---

## /src/theme/theme.js

```javascript
import { createTheme } from '@mui/material/styles';

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#C29A47', // Primary gold
      dark: '#9E7D39', // Darker gold for hover states
      light: '#D4B673', // Lighter gold for accents
    },
    secondary: {
      main: '#8C6B4D', // Deep gold accent
      dark: '#725640', // Darker accent for hover states
      light: '#A68B74', // Lighter accent
    },
    background: {
      default: '#F5F3F0', // Neutral background
      paper: '#FFF8E7',   // Highlight background
    },
    text: {
      primary: '#000000', // Black
      secondary: '#666666', // Secondary text
    },
    error: {
      main: '#E74C3C',
      dark: '#C0392B',
    },
    warning: {
      main: '#F1C40F',
      dark: '#D4AC0D',
    },
    info: {
      main: '#3498DB',
      dark: '#2980B9',
    },
    success: {
      main: '#2ECC71',
      dark: '#27AE60',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
  },
  breakpoints: {
    values: {
      xs: 320,
      sm: 768,
      md: 1024,
      lg: 1200,
      xl: 1536,
    },
  },
  spacing: 4, // This will multiply the spacing by 4px (MUI's default spacing unit)
});

// Create styled-components theme with the same values
export const styledTheme = {
  palette: {
    ...muiTheme.palette,
  },
  breakpoints: {
    ...muiTheme.breakpoints.values,
  },
  spacing: (factor) => `${0.25 * factor}rem`, // Keep rem units for styled-components
};
```

---

## /src/theme/theme.ts

```typescript
// File: /src/theme/theme.ts
// Description: Unified theme configuration for MUI and styled-components
// Author: GitHub Copilot
// Created: 2024-02-12

import { createTheme } from '@mui/material/styles';
import type { DefaultTheme } from 'styled-components';

// Create the base MUI theme
export const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#C29A47', // Primary gold
      dark: '#9E7D39', // Darker gold for hover states
      light: '#D4B673', // Lighter gold for accents
    },
    secondary: {
      main: '#8C6B4D', // Deep gold accent
      dark: '#725640', // Darker accent for hover states
      light: '#A68B74', // Lighter accent
    },
    background: {
      default: '#F5F3F0', // Neutral background
      paper: '#FFF8E7',   // Highlight background
    },
    text: {
      primary: '#000000', // Black
      secondary: '#666666', // Secondary text
    },
    error: {
      main: '#E74C3C',
      dark: '#C0392B',
      light: '#F9EBEA',
    },
    warning: {
      main: '#F1C40F',
      dark: '#D4AC0D',
      light: '#FEF9E7',
    },
    info: {
      main: '#3498DB',
      dark: '#2980B9',
      light: '#EBF5FB',
    },
    success: {
      main: '#2ECC71',
      dark: '#27AE60',
      light: '#E8F8F5',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
  },
  breakpoints: {
    values: {
      xs: 320,
      sm: 768,
      md: 1024,
      lg: 1200,
      xl: 1536,
    },
  },
  spacing: 4, // Base spacing unit (4px)
});

// Create spacing utility that returns rem values
const createSpacing = () => {
  const spacingFn = (value: number): string => `${0.25 * value}rem`;
  return Object.assign(spacingFn, {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '2rem',     // 32px
    xl: '3rem',     // 48px
  });
};

// Create the styled-components theme that extends MUI theme
export const styledTheme: DefaultTheme = {
  ...muiTheme,
  breakpoints: {
    ...muiTheme.breakpoints,
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    large: '1440px',
  },
  spacing: createSpacing(),
  colors: {
    border: '#e0e0e0',
    text: muiTheme.palette.text.primary,
    background: {
      hover: '#f5f5f5',
    },
    error: {
      main: muiTheme.palette.error.main,
      light: muiTheme.palette.error.light,
    },
  },
  borderRadius: {
    default: '4px',
  },
};
```

---

## /src/components/CourseCard.tsx

```tsx
import React from "react";
import { FaVideo, FaListAlt, FaBrain } from "react-icons/fa";
import Card from "./common/Card";
import styled from "styled-components";

interface CourseCardProps {
  title: string;
  type: "Video Animated" | "Quiz" | "Mind Map";
  category: string;
}

const iconMap = {
  "Video Animated": <FaVideo style={{ color: "#9333ea" }} />,
  "Quiz": <FaListAlt style={{ color: "#eab308" }} />,
  "Mind Map": <FaBrain style={{ color: "#ec4899" }} />,
};

const StyledCard = styled(Card)`
  border-left: 4px solid ${props => props.theme.palette.primary.main};
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const IconWrapper = styled.div`
  font-size: 1.875rem;
`;

const CategoryText = styled.p`
  color: ${props => props.theme.palette.text.secondary};
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const CourseCard: React.FC<CourseCardProps> = ({ title, type, category }) => {
  return (
    <StyledCard title={title} description={type}>
      <IconWrapper>{iconMap[type]}</IconWrapper>
      <CategoryText>{category}</CategoryText>
    </StyledCard>
  );
};

export default CourseCard;
```

---

## /src/components/GoogleLoginButton.test.tsx

```tsx
/** @jest-environment jsdom */
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../test/testUtils';
import GoogleLoginButton from './GoogleLoginButton';

describe('GoogleLoginButton', () => {
  const mockHandleGoogleLogin = jest.fn();
  const mockDismissError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders sign in button with correct accessibility', () => {
    renderWithProviders(<GoogleLoginButton handleGoogleLogin={mockHandleGoogleLogin} />);
    expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument();
  });

  it('shows loading state when loading prop is true', () => {
    renderWithProviders(<GoogleLoginButton handleGoogleLogin={mockHandleGoogleLogin} loading={true} />);
    const button = screen.getByRole('button', { name: /signing in/i });
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Signing in...');
  });

  it('displays error message with dismiss button', () => {
    const errorMessage = 'Test error message';
    renderWithProviders(
      <GoogleLoginButton 
        handleGoogleLogin={mockHandleGoogleLogin} 
        error={errorMessage}
        onDismissError={mockDismissError} 
      />
    );
    
    expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
    expect(screen.getByRole('button', { name: /dismiss error/i })).toBeInTheDocument();
  });

  it('calls onDismissError when dismiss button is clicked', async () => {
    const errorMessage = 'Test error message';
    renderWithProviders(
      <GoogleLoginButton 
        handleGoogleLogin={mockHandleGoogleLogin} 
        error={errorMessage}
        onDismissError={mockDismissError} 
      />
    );
    
    fireEvent.click(screen.getByRole('button', { name: /dismiss error/i }));
    await waitFor(() => {
      expect(mockDismissError).toHaveBeenCalledTimes(1);
    });
  });

  it('calls handleGoogleLogin when sign in button is clicked', async () => {
    renderWithProviders(<GoogleLoginButton handleGoogleLogin={mockHandleGoogleLogin} />);
    fireEvent.click(screen.getByRole('button', { name: /sign in with google/i }));
    await waitFor(() => {
      expect(mockHandleGoogleLogin).toHaveBeenCalled();
    });
  });
});
```

---

## /src/components/GoogleLoginButton.tsx

```tsx
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import React from 'react';
import styled from 'styled-components';
import { FcGoogle } from 'react-icons/fc';

interface GoogleLoginButtonProps {
  handleGoogleLogin: () => Promise<void>;
  loading?: boolean;
  error?: string;
  onDismissError?: () => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  handleGoogleLogin,
  loading = false,
  error,
  onDismissError
}): JSX.Element => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  const handleClick = async (): Promise<void> => {
    try {
      await signInWithPopup(auth, provider);
      await handleGoogleLogin();
    } catch (err) {
      console.error('Google login error:', err);
    }
  };

  return (
    <ButtonContainer>
      {error && (
        <ErrorMessage role="alert">
          <span>{error}</span>
          {onDismissError && (
            <DismissButton 
              onClick={onDismissError}
              aria-label="dismiss error"
            >
              ✕
            </DismissButton>
          )}
        </ErrorMessage>
      )}
      <LoginButton 
        onClick={handleClick}
        disabled={loading}
        aria-label={loading ? 'Signing in...' : 'Sign in with Google'}
      >
        <FcGoogle />
        {loading ? 'Signing in...' : 'Sign in with Google'}
      </LoginButton>
    </ButtonContainer>
  );
};

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
`;

const LoginButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.palette.divider};
  border-radius: 4px;
  background: white;
  color: ${({ theme }) => theme.palette.text.primary};
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.palette.action?.hover || '#f5f5f5'};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.palette.error.light};
  color: ${({ theme }) => theme.palette.error.main};
  border-radius: 4px;
  font-size: 0.875rem;
`;

const DismissButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  margin-left: ${({ theme }) => theme.spacing.sm};

  &:hover {
    opacity: 0.8;
  }
`;

export default GoogleLoginButton;
```

---

## /src/components/HomeContainer.js

```javascript
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const HomeContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (max-width: 768px) {
    padding: 0 0.5rem;
    h2 { 
      font-size: 1.5rem; 
    }
  }
`;

export const StyledLink = styled(Link).attrs(({ disabled }) => ({
  role: 'button',
  'aria-disabled': disabled,
}))`
  display: inline-block;
  padding: 1rem 2rem;
  background: var(--primary-color);
  color: white;
  border-radius: 4px;
  font-size: 1.1rem;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: var(--secondary-color);
  }

  &:focus-visible {
    outline: 2px dashed var(--secondary-color);
    outline-offset: 4px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
```

---

## /src/components/Login.tsx

```tsx
import React, { useState } from 'react';
import { useLocation, Location, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { FcGoogle } from 'react-icons/fc';

interface LocationState {
  from?: {
    pathname: string;
  };
  error?: string;
}

const Login: React.FC = (): JSX.Element => {
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as Location & { state: LocationState };
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setLoading(true);
      await login();
      navigate('/dashboard');
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      setLoading(true);
      await login();
      navigate('/dashboard');
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <LoginBox>
        <Title>Welcome Back</Title>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {location.state?.error && (
          <ErrorMessage>{location.state.error}</ErrorMessage>
        )}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input 
              type="email" 
              id="email" 
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input 
              type="password" 
              id="password" 
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </FormGroup>

          <LoginButton type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </LoginButton>
        </Form>

        <Divider>or</Divider>

        <GoogleButton onClick={handleGoogleLogin} disabled={loading}>
          <FcGoogle className="text-xl" />
          Sign in with Google
        </GoogleButton>
      </LoginBox>
    </Container>
  );
};

// Styled components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--background);
  padding: 1rem;
`;

const LoginBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  text-align: center;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: var(--text-color);
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  &:disabled {
    background-color: #f5f5f5;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--primary-dark);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  margin: 1.5rem 0;
  text-align: center;
  position: relative;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 45%;
    height: 1px;
    background-color: #ddd;
  }
  
  &::before {
    left: 0;
  }
  
  &::after {
    right: 0;
  }
`;

const GoogleButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  color: var(--text-color);
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8f8f8;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  background-color: #fee2e2;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

export default Login;
```

---

## /src/components/Message.tsx

```tsx
import React from 'react';
import styled from 'styled-components';

interface MessageProps {
  sender: 'user' | 'bot';
  children: React.ReactNode;
}

const Message: React.FC<MessageProps> = ({ sender, children }) => {
  return (
    <MessageContainer $sender={sender}>
      {children}
    </MessageContainer>
  );
};

const MessageContainer = styled.div<{ $sender: 'user' | 'bot' }>`
  margin: var(--spacing-xs) 0;
  padding: var(--spacing-sm);
  max-width: 80%;
  background: ${({ $sender }) => ($sender === 'user' ? "var(--accent-color)" : "var(--white)")};
  color: ${({ $sender }) => ($sender === 'user' ? "var(--white)" : "var(--text-color)")};
  border-radius: var(--border-radius);
  align-self: ${({ $sender }) => ($sender === 'user' ? "flex-end" : "flex-start")};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

export default Message;
```

---

## /src/components/Mission.tsx

```tsx
import styled from 'styled-components';
import React from 'react';

const MissionContainer = styled.div`
  max-width: 800px;
  margin: auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const MissionText = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  color: #444;
`;

interface MissionProps {
  text: string;
}

export const Mission: React.FC<MissionProps> = ({ text }) => {
  return (
    <MissionContainer>
      <MissionText>{text}</MissionText>
    </MissionContainer>
  );
};

export default Mission;
```

---

## /src/components/PrivateRoute.tsx

```tsx
// File: /src/components/PrivateRoute.tsx
// Description: A route component that protects routes from unauthorized access
// Author: GitHub Copilot

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './common/LoadingSpinner';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: rgba(255, 255, 255, 0.8);
`;

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }): JSX.Element => {
  const { currentUser, isAuthReady } = useAuth();
  const location = useLocation();

  // Show loading spinner while auth state is being determined
  if (!isAuthReady) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  // If not authenticated, redirect to login with current location
  if (!currentUser && isAuthReady) {
    // Only redirect if we're not already on the login page
    if (location.pathname !== '/login') {
      return (
        <Navigate 
          to="/login" 
          state={{ 
            from: location,
            error: "Please sign in to access this page" 
          }} 
          replace 
        />
      );
    }
  }

  // If authenticated, render the protected route
  return <>{children}</>;
};

export default PrivateRoute;
```

---

## /src/components/UserProfileCard.tsx

```tsx
import React from 'react';
import Card from '../common/Card';

interface UserProfileCardProps {
  username: string;
  role: string;
  avatar?: string;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ username, role, avatar }) => {
  return (
    <Card
      title="User Profile"
      icon={avatar}
      className="user-profile-card"
    >
      <div className="user-info">
        <label>Username:</label>
        <p>{username}</p>
      </div>
      <div className="user-info">
        <label>Role:</label>
        <p>{role}</p>
      </div>
    </Card>
  );
};

export default UserProfileCard;
```

---

## /src/components/layout/Footer.tsx

```tsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './layout.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles['footer-content']}>
        <div className={styles['footer-column']}>
          <h3>About</h3>
          <ul className={styles['footer-links']}>
            <li><Link to="/about">Our Story</Link></li>
            <li><Link to="/features">Features</Link></li>
            <li><Link to="/curriculum">Curriculum</Link></li>
          </ul>
        </div>

        <div className={styles['footer-column']}>
          <h3>Learning</h3>
          <ul className={styles['footer-links']}>
            <li><Link to="/learning-styles">Learning Styles</Link></li>
            <li><Link to="/learning-plan">Learning Plan</Link></li>
            <li><Link to="/assessment">Assessment</Link></li>
          </ul>
        </div>

        <div className={styles['footer-column']}>
          <h3>Support</h3>
          <ul className={styles['footer-links']}>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><a href="mailto:support@geauxacademy.com">Email Support</a></li>
            <li><Link to="/help">Help Center</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```

---

## /src/components/layout/Header.tsx

```tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import styles from './layout.module.css';

const Header = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  
  return (
    <header className={styles.header}>
      <div className={styles.navigation}>
        <Link to="/">
          <img src="/images/logo.svg" alt="Geaux Academy Logo" height="50" />
        </Link>
        
        <nav>
          <ul className={styles['navigation-list']}>
            <li>
              <Link to="/" className={location.pathname === '/' ? styles.active : ''}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className={location.pathname === '/about' ? styles.active : ''}>
                About
              </Link>
            </li>
            <li>
              <Link to="/features" className={location.pathname === '/features' ? styles.active : ''}>
                Features
              </Link>
            </li>
            <li>
              <Link to="/curriculum" className={location.pathname === '/curriculum' ? styles.active : ''}>
                Curriculum
              </Link>
            </li>
            <li>
              <Link to="/contact" className={location.pathname === '/contact' ? styles.active : ''}>
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <div className="auth-buttons">
          {!currentUser ? (
            <>
              <Button to="/login" className="btn btn-secondary">Login</Button>
              <Button to="/signup" className="btn btn-primary">Sign Up</Button>
            </>
          ) : (
            <Button to="/dashboard" className="btn btn-primary">Dashboard</Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
```

---

## /src/components/layout/Layout.tsx

```tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/global.css';

const Layout = () => {
  const { currentUser } = useAuth();

  return (
    <LayoutWrapper>
      <Header />
      <PageContainer>
        <Outlet />
      </PageContainer>
      <Footer />
    </LayoutWrapper>
  );
};

const LayoutWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: var(--header-height);
`;

const PageContainer = styled.main`
  flex: 1;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--spacing-lg);
  width: 100%;
  text-align: center;

  @media (max-width: 768px) {
    padding: var(--spacing-sm);
  }
`;

export default Layout;
```

---

## /src/components/layout/Navigation.tsx

```tsx
import React from "react";
import { Link } from "react-router-dom";
import './styles/Navigation.css';

const Navigation = () => {
  return (
    <nav className="flex space-x-6 text-lg font-medium">
      <Link to="/" className="hover:underline">Home</Link>
      <Link to="/about" className="hover:underline">About Us</Link>
      <Link to="/curriculum" className="hover:underline">Curriculum</Link>
      <Link to="/learning-styles" className="hover:underline">Learning Styles</Link>
      <Link to="/contact" className="hover:underline">Contact Us</Link>
    </nav>
  );
};

export default Navigation;
```

---

## /src/components/layout/Sidebar.tsx

```tsx
// src/components/SomeComponent.tsx

import React from 'react';

const SomeComponent: React.FC = () => {
  return (
    <div>
      <h1>Hello, World!</h1>
    </div>
  );
};

export default SomeComponent;
```

---

## /src/components/layout/layout.module.css

```css
/* Layout Components */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 1rem;
}

.navigation {
  max-width: var(--max-width);
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 var(--spacing-md);
  height: 100%;
}

.navigation-list {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.navigation-list a {
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius);
  transition: color 0.2s, background-color 0.2s;
}

.navigation-list a:hover {
  color: var(--primary-color);
  background-color: var(--light-bg);
}

.navigation-list a.active {
  color: var(--primary-color);
}

.auth-buttons {
  display: flex;
  gap: var(--spacing-sm);
}

.footer {
  background: var(--primary-color);
  color: var(--white);
  padding: var(--spacing-lg) 0;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.footer-column h3 {
  margin-bottom: var(--spacing-md);
}

.footer-links {
  list-style: none;
}

.footer-links li {
  margin-bottom: var(--spacing-sm);
}

.footer-links a {
  color: var(--white);
  text-decoration: none;
  transition: opacity 0.2s;
}

.footer-links a:hover {
  opacity: 0.8;
}

/* Mobile Navigation */
@media (max-width: 768px) {
  .navigation-list {
    display: none;
  }

  .navigation-list.active {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: var(--header-height);
    left: 0;
    right: 0;
    background: var(--white);
    padding: var(--spacing-md);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--white);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.modal-body {
  margin-bottom: var(--spacing-md);
}

/* Toast */
.toast {
  position: fixed;
  bottom: var(--spacing-lg);
  right: var(--spacing-lg);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  color: var(--white);
  animation: slideIn 0.3s ease-in-out;
  z-index: 1000;
}

.toast-info { background-color: var(--accent-color); }
.toast-success { background-color: #10b981; }
.toast-error { background-color: var(--secondary-color); }
.toast-warning { background-color: #f59e0b; }

/* Loading Spinner */
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: rgba(255, 255, 255, 0.8);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Card Components */
.card {
  background: var(--white);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  margin: var(--spacing-sm);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.card-icon {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: var(--spacing-sm);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: var(--spacing-xs);
}

.card-description {
  color: var(--text-color);
  line-height: var(--line-height);
}

.card-list {
  list-style-position: inside;
  color: var(--text-color);
  line-height: var(--line-height);
}

.card-list li {
  margin-bottom: var(--spacing-xs);
}

@media (max-width: 768px) {
  .card {
    padding: var(--spacing-md);
  }
}

/* Student Card Styles */
.student-card {
  background: var(--white);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: var(--spacing-md);
}

.student-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: var(--spacing-xs);
}

.student-info {
  color: var(--text-color);
  margin-bottom: var(--spacing-sm);
}

.assessment-status {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 500;
}

.status-complete {
  background-color: #10b981;
  color: var(--white);
}

.status-pending {
  background-color: #f59e0b;
  color: var(--white);
}

/* Animations */
@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

---

## /src/components/common/Button.tsx

```tsx
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  to?: string;
  $variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ to, children, $variant = 'primary', ...props }) => {
  const className = `btn btn-${$variant}`;
  
  if (to) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <StyledButton className={className} {...props}>
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button`
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default Button;
```

---

## /src/components/common/Card.tsx

```tsx
import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: IconProp | string;
  title?: string;
  description?: string | string[];
  className?: string;
  onClick?: () => void;
}

const Card = forwardRef<HTMLDivElement, CardProps>(({
  icon,
  title,
  description,
  children,
  className,
  onClick,
  ...props
}, ref) => {
  const isImagePath = typeof icon === 'string' && (icon.startsWith('/') || icon.startsWith('http'));
  
  return (
    <StyledCard 
      ref={ref}
      className={className} 
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {icon && (
        <IconContainer>
          {isImagePath ? (
            <img 
              src={icon} 
              alt={title || 'Card icon'}
              crossOrigin={icon.startsWith('http') ? "anonymous" : undefined}
            />
          ) : (
            typeof icon === 'object' && <FontAwesomeIcon icon={icon} />
          )}
        </IconContainer>
      )}
      {title && <CardTitle>{title}</CardTitle>}
      {description && (
        Array.isArray(description) ? (
          <CardList>
            {description.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </CardList>
        ) : (
          <CardDescription>{description}</CardDescription>
        )
      )}
      {children}
    </StyledCard>
  );
});

Card.displayName = 'Card';

const StyledCard = styled.div`
  background: ${({ theme }) => theme.palette.background.paper};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: ${({ theme }) => theme.spacing.lg};
  cursor: ${props => props.onClick ? 'pointer' : 'default'};
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    ${props => props.onClick && `
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    `}
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.palette.primary.main};
  
  img {
    max-width: 48px;
    height: auto;
  }
`;

const CardTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.palette.text.primary};
`;

const CardDescription = styled.p`
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const CardList = styled.ul`
  list-style: none;
  padding: 0;
  margin: ${({ theme }) => theme.spacing.sm} 0;
  
  li {
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    color: ${({ theme }) => theme.palette.text.secondary};
  }
`;

export default Card;
```

---

## /src/components/common/LoadingSpinner.tsx

```tsx
import React from 'react';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: rgba(255, 255, 255, 0.8);
`;

const SpinnerElement = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingSpinner: React.FC = () => {
  return (
    <LoadingContainer>
      <SpinnerElement />
    </LoadingContainer>
  );
};

export default LoadingSpinner;
```

---

## /src/components/common/Modal.tsx

```tsx
import React, { useEffect } from 'react';
import styled from 'styled-components';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Content onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <Header>
          <Title>{title}</Title>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </Header>
        <Body>{children}</Body>
      </Content>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Content = styled.div`
  background: ${({ theme }) => theme.palette.background.paper};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.lg};
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
`;

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.palette.text.primary};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.palette.text.secondary};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.palette.text.primary};
  }
`;

const Body = styled.div`
  color: ${({ theme }) => theme.palette.text.primary};
`;

export default Modal;
```

---

## /src/components/common/StyledLink.tsx

```tsx
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export interface StyledLinkProps {
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

const StyledLink = styled(Link).attrs<StyledLinkProps>(({ disabled }) => ({
  role: 'button',
  'aria-disabled': disabled,
}))<StyledLinkProps>`
  display: inline-block;
  padding: var(--spacing-md) var(--spacing-lg);
  background: ${props => props.variant === 'secondary' ? 'var(--secondary-color)' : 'var(--primary-color)'};
  color: var(--white);
  border-radius: var(--border-radius);
  font-size: 1.1rem;
  text-decoration: none;
  text-align: center;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background 0.2s, transform 0.2s;
  opacity: ${props => props.disabled ? 0.6 : 1};

  &:hover:not([aria-disabled="true"]) {
    background: ${props => props.variant === 'secondary' ? 'var(--primary-color)' : 'var(--secondary-color)'};
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 2px dashed var(--secondary-color);
    outline-offset: 4px;
  }
`;

export default StyledLink;
```

---

## /src/components/common/Toast.tsx

```tsx
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled, { css } from 'styled-components';

type ToastType = 'info' | 'success' | 'warning' | 'error';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <ToastContainer $type={type}>
      <p>{message}</p>
    </ToastContainer>
  );
};

const showToast = (props: ToastProps): void => {
  const toastElement = document.createElement('div');
  document.body.appendChild(toastElement);
  
  const onClose = () => {
    document.body.removeChild(toastElement);
    props.onClose?.();
  };
  
  const toastComponent = React.createElement(Toast, { ...props, onClose });
  ReactDOM.render(toastComponent, toastElement);
};

const getToastColor = (type: ToastType) => {
  switch (type) {
    case 'success':
      return css`
        background-color: ${({ theme }) => theme.palette.success?.main || '#2ECC71'};
        color: white;
      `;
    case 'warning':
      return css`
        background-color: ${({ theme }) => theme.palette.warning?.main || '#F1C40F'};
        color: white;
      `;
    case 'error':
      return css`
        background-color: ${({ theme }) => theme.palette.error?.main || '#E74C3C'};
        color: white;
      `;
    default:
      return css`
        background-color: ${({ theme }) => theme.palette.info?.main || '#3498DB'};
        color: white;
      `;
  }
};

const ToastContainer = styled.div<{ $type: ToastType }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
  ${props => getToastColor(props.$type)}

  p {
    margin: 0;
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

export default Toast;
```

---

## /src/components/common/types/index.ts

```typescript
// src/components/SomeComponent.tsx

import React from 'react';

// Reusable component prop types
export interface BaseComponentProps {
  className?: string;
  id?: string;
}

// Example component with proper types
export interface SomeComponentProps extends BaseComponentProps {
  title?: string;
}

// Use arrow function with explicit return for better type inference
export const SomeComponent: React.FC<SomeComponentProps> = ({ title = 'Hello, World!', className, id }): JSX.Element => {
  return React.createElement('div', { className, id },
    React.createElement('h1', null, title)
  );
};

// Example utility function with explicit return type
export const exampleFunction = (input: string): string => input.toUpperCase();
```

---

## /src/components/student/StudentCard.tsx

```tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getStudentProfile } from '../../services/profileService';
import Card from '../common/Card';

interface Student {
  name: string;
  grade: string;
  hasTakenAssessment: boolean;
}

interface StudentCardProps {
  studentId: string;
  onClick?: () => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ studentId, onClick }) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const studentData = await getStudentProfile(studentId);
        setStudent(studentData);
      } catch (err) {
        console.error('Error fetching student:', err);
        setError('Could not load student data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  if (loading) return <StyledCard onClick={onClick}>Loading student data...</StyledCard>;
  if (error) return <StyledCard onClick={onClick}>Error: {error}</StyledCard>;
  if (!student) return null;

  return (
    <StyledCard onClick={onClick}>
      <StudentName>{student.name}</StudentName>
      <StudentInfo>Grade: {student.grade}</StudentInfo>
      <AssessmentStatus $isComplete={student.hasTakenAssessment}>
        {student.hasTakenAssessment ? 'Assessment Complete' : 'Assessment Needed'}
      </AssessmentStatus>
    </StyledCard>
  );
};

const StyledCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const StudentName = styled.h3`
  color: ${({ theme }) => theme.palette.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StudentInfo = styled.div`
  color: ${({ theme }) => theme.palette.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const AssessmentStatus = styled.div<{ $isComplete: boolean }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: 4px;
  background-color: ${({ theme, $isComplete }) => 
    $isComplete ? theme.palette.success?.main || '#2ECC71' : theme.palette.warning?.main || '#F1C40F'};
  color: white;
  font-size: 0.875rem;
  text-align: center;
`;

export default StudentCard;
```

---

## /src/components/auth/AuthErrorDialog.tsx

```tsx
import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Theme } from '../../theme';
import styled from 'styled-components';

interface AuthError {
  message: string;
  retry?: boolean;
}

interface AuthErrorDialogProps {
  open: boolean;
  error: AuthError | null;
  onClose: () => void;
  onRetry?: () => Promise<void>;
}

const AuthErrorDialog: React.FC<AuthErrorDialogProps> = ({
  open,
  error,
  onClose,
  onRetry
}): JSX.Element | null => {
  if (!error) return null;

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      aria-labelledby="auth-error-dialog-title"
    >
      <DialogTitle id="auth-error-dialog-title">
        Authentication Error
        <CloseIconButton
          aria-label="close"
          onClick={onClose}
        >
          <CloseIcon />
        </CloseIconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{error.message}</DialogContentText>
      </DialogContent>
      <StyledDialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
        {error.retry && onRetry && (
          <Button 
            onClick={onRetry} 
            color="primary" 
            variant="contained" 
            autoFocus
          >
            Try Again
          </Button>
        )}
      </StyledDialogActions>
    </StyledDialog>
  );
};

interface StyledProps {
  theme: Theme;
}

const StyledDialog = styled(Dialog)`
  .MuiPaper-root {
    padding: ${({ theme }: StyledProps) => theme.spacing.md};
  }
`;

const CloseIconButton = styled(IconButton)`
  position: absolute;
  right: ${({ theme }: StyledProps) => theme.spacing.sm};
  top: ${({ theme }: StyledProps) => theme.spacing.sm};
`;

const StyledDialogActions = styled(DialogActions)`
  padding: ${({ theme }: StyledProps) => theme.spacing.md} 0 0;
`;

export default AuthErrorDialog;
```

---

## /src/components/auth/AuthRoute.tsx

```tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: rgba(255, 255, 255, 0.8);
`;

interface AuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  // If user is authenticated and tries to access auth pages, redirect to dashboard
  if (currentUser) {
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  // Allow access to auth pages if not authenticated
  return <>{children}</>;
};

export default AuthRoute;
```

---

## /src/components/auth/Login.css

```css
.login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 20px;
    background-color: #f5f5f5;
}

.login-form {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
}

.login-form h2 {
    text-align: center;
    color: #2C3E50;
    margin-bottom: 1.5rem;
    font-size: 1.75rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-color);
    font-weight: 500;
    font-size: 1rem;
}

.form-group input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.2s ease;
}

.form-group input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.form-group input::placeholder {
    color: #a0aec0;
}

.login-button {
    width: 100%;
    padding: 0.75rem;
    background-color: #4f46e5;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.login-button:hover {
    background-color: #4338ca;
}

.login-button:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
}

.error-message {
    background-color: #fee2e2;
    color: #dc2626;
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    font-size: 0.875rem;
    text-align: center;
}

.login-footer {
    margin-top: 1.5rem;
    text-align: center;
    font-size: 0.875rem;
}

.login-footer p {
    margin-bottom: 0.5rem;
    color: #4a5568;
}

.login-footer a {
    color: #4f46e5;
    text-decoration: none;
    font-weight: 500;
}

.login-footer a:hover {
    text-decoration: underline;
}

.divider {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 20px 0;
}

.divider::before,
.divider::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #e2e8f0;
}

.divider span {
    padding: 0 10px;
    color: #64748b;
    font-size: 0.875rem;
}

.google-button {
    width: 100%;
    padding: 0.75rem;
    background-color: white;
    color: #333;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: background-color 0.2s ease;
}

.google-button:hover {
    background-color: #f8fafc;
}

.google-button img {
    width: 18px;
    height: 18px;
}

@media (max-width: 480px) {
    .login-form {
        padding: 1.5rem;
    }
}
```

---

## /src/components/auth/LoginForm.tsx

```tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import GoogleLoginButton from '../GoogleLoginButton';
import './auth.css';

const ErrorMessage = styled.div`
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 10px;
  margin: 10px 0;
  font-size: 0.9rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 5px;
  color: #dc3545;
  &:hover {
    opacity: 0.7;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #357abd;
  }
`;

const LoginForm: React.FC = (): JSX.Element => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (): Promise<void> => {
    try {
      await login();
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleLogin();
    }}>
      {/* ...existing form JSX... */}
    </form>
  );
};

export default LoginForm;
```

---

## /src/components/auth/SignUp.css

```css
.signup-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.error-alert {
  background: #ffebee;
  color: #c62828;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border-radius: 4px;
}

form div {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-color);
  font-weight: 500;
  font-size: 1rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 0.75rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.7;
}
```

---

## /src/components/auth/SignUp.tsx

```tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../contexts/AuthContext';
import { CheshireService } from '../../services/cheshireService';
import Button from '../common/Button';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const createCheshireAccount = async (uid: string, email: string) => {
    try {
      await CheshireService.createCheshireUser(uid, email);
    } catch (error) {
      console.error('Error creating Cheshire account:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const userCredential = await signup(formData.email, formData.password);
      
      if (userCredential?.user) {
        await createCheshireAccount(userCredential.user.uid, userCredential.user.email || '');
      }
      
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      setError('');
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up with Google');
      console.error('Google signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SignUpContainer>
      <SignUpCard>
        <h2>Create an Account</h2>
        {error && (
          <ErrorMessage>
            <span>{error}</span>
            <DismissButton onClick={() => setError('')}>✕</DismissButton>
          </ErrorMessage>
        )}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={loading}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              disabled={loading}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              disabled={loading}
            />
          </FormGroup>

          <StyledButton type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </StyledButton>
        </Form>

        <Divider>
          <span>Or</span>
        </Divider>

        <GoogleButton onClick={handleGoogleSignup} disabled={loading}>
          <FcGoogle />
          <span>Sign up with Google</span>
        </GoogleButton>

        <LoginPrompt>
          Already have an account? <Link to="/login">Log In</Link>
        </LoginPrompt>
      </SignUpCard>
    </SignUpContainer>
  );
};

const SignUpContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  background-color: var(--background);
`;

const SignUpCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;

  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: var(--primary-color);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: var(--text-color);
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  &:disabled {
    background-color: #f5f5f5;
  }
`;

const StyledButton = styled.button`
  width: 100%;
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--primary-dark);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  background-color: #fee2e2;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1.5rem 0;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #ddd;
  }

  span {
    padding: 0 0.5rem;
    color: #666;
    font-size: 0.875rem;
  }
`;

const GoogleButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8f8f8;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const LoginPrompt = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: var(--text-color);
`;

const Link = styled.a`
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

export default SignUp;
```

---

## /src/components/auth/auth.css

```css
.auth-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background: #fff;
}

.auth-title {
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.auth-error {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  background-color: #fee2e2;
  color: #dc2626;
  font-size: 0.875rem;
}

.auth-error-dismiss {
  background: none;
  border: none;
  color: #dc2626;
  cursor: pointer;
  padding: 0.25rem;
  margin-left: 0.5rem;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.auth-error-dismiss:hover {
  opacity: 1;
}

.google-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background-color: #fff;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s, border-color 0.2s;
  gap: 0.5rem;
}

.google-button:hover:not(:disabled) {
  background-color: #f9fafb;
  border-color: #d1d5db;
}

.google-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.auth-divider {
  position: relative;
  text-align: center;
  margin: 1.5rem 0;
}

.auth-divider::before,
.auth-divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: calc(50% - 3rem);
  height: 1px;
  background-color: #e5e7eb;
}

.auth-divider::before {
  left: 0;
}

.auth-divider::after {
  right: 0;
}

.auth-divider span {
  background-color: #fff;
  padding: 0 1rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.btn.btn-secondary {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #f3f4f6;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
  transition: background-color 0.2s;
  cursor: pointer;
}

.btn.btn-secondary:hover {
  background-color: #e5e7eb;
}
```

---

## /src/components/dashboard/Dashboard.tsx

```tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CreateStudent from '../../pages/profile/ParentProfile/CreateStudent';
import { ProfileService, getStudentProfile } from '../../services/profileService';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../common/LoadingSpinner';
import type { Student, BaseProfile } from '../../types/profiles';

interface UserData {
  name: string;
  lastLogin: string;
}

interface ParentProfile {
  id?: string;
  students?: string[];
  name?: string;
  email?: string;
}

interface DashboardProps {
  onProfileUpdate?: (profile: BaseProfile) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onProfileUpdate }): JSX.Element => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [parentProfile, setParentProfile] = useState<ParentProfile | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      // Retry data fetch when back online
      if (currentUser) fetchUserData();
    };
    
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [currentUser]);

  const fetchUserData = useCallback(async (): Promise<void> => {
    try {
      if (!currentUser?.uid) {
        navigate('/login');
        return;
      }

      setLoading(true);
      setError('');
      
      // Set basic user data immediately from auth
      setUserData({
        name: currentUser.displayName || currentUser.email || '',
        lastLogin: currentUser.metadata?.lastSignInTime || 'N/A',
      });

      // Fetch parent profile with retry mechanism
      const fetchProfileWithRetry = async () => {
        try {
          const profileService = new ProfileService();
          const profile = await profileService.getUserProfile(currentUser.uid);
          if (profile) {
            setParentProfile(profile);
            if (onProfileUpdate) {
              onProfileUpdate(profile);
            }
            return profile;
          }
          throw new Error('Profile not found');
        } catch (err) {
          if (retryCount < MAX_RETRIES && !isOffline) {
            setRetryCount(prev => prev + 1);
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
            return fetchProfileWithRetry();
          }
          throw err;
        }
      };

      const profile = await fetchProfileWithRetry();

      // Fetch students data if profile exists
      if (profile?.students?.length) {
        const studentsData = await Promise.all(
          profile.students.map(async (studentId: string) => {
            try {
              const student = await getStudentProfile(studentId);
              return student;
            } catch (err) {
              console.error(`Error fetching student ${studentId}:`, err);
              return null;
            }
          })
        );
        
        // Filter out null values and cast to Student array
        setStudents(studentsData.filter((s): s is Student => s !== null && s.id !== undefined));
      }

      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      console.error('❌ Error fetching user data:', err);
      setError(isOffline ? 
        'You are currently offline. Some features may be limited.' :
        'Failed to fetch user data. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [currentUser, navigate, onProfileUpdate, retryCount, isOffline]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleStudentSelect = (student: Student) => {
    if (isOffline) {
      setError('This action is not available while offline');
      return;
    }
    
    if (!student.hasTakenAssessment) {
      navigate(`/learning-style-chat/${student.id}`);
    } else {
      navigate(`/student-profile/${student.id}`);
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      navigate('/login');
    } catch (err) {
      setError('Failed to log out');
    }
  };

  if (loading) {
    return (
      <DashboardContainer>
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <AnimatePresence>
        {isOffline && (
          <OfflineBanner
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            You are currently offline. Some features may be limited.
          </OfflineBanner>
        )}
      </AnimatePresence>

      <DashboardHeader>
        <h1>Welcome, {userData?.name}</h1>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </DashboardHeader>

      {error && (
        <ErrorMessage>
          {error}
          <RetryButton onClick={fetchUserData}>Retry</RetryButton>
        </ErrorMessage>
      )}

      <DashboardGrid>
        <ParentSection>
          <h2>Parent Dashboard</h2>
          {!isOffline && <CreateStudent />}
          <StudentsList>
            <h3>Your Students</h3>
            {students.length > 0 ? (
              <StudentGrid>
                {students.map((student) => (
                  <StudentCardWrapper 
                    key={student.id}
                    onClick={() => handleStudentSelect(student)}
                    disabled={isOffline}
                  >
                    <StudentName>{student.name}</StudentName>
                    <StudentInfo>Grade: {student.grade}</StudentInfo>
                    <AssessmentStatus $completed={student.hasTakenAssessment}>
                      {student.hasTakenAssessment ? 'Assessment Complete' : 'Take Assessment'}
                    </AssessmentStatus>
                  </StudentCardWrapper>
                ))}
              </StudentGrid>
            ) : (
              <EmptyState>
                No students found. {!isOffline && 'Add your first student to get started.'}
              </EmptyState>
            )}
          </StudentsList>
        </ParentSection>
      </DashboardGrid>
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  padding: 2rem;
  background-color: #f9fafb;
  min-height: 100vh;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
`;

const ParentSection = styled.section`
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const StudentsList = styled.div`
  margin-top: 1rem;
`;

const StudentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const StudentCardWrapper = styled.div<{ disabled?: boolean }>`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.7 : 1};
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const StudentName = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #2d3748;
`;

const StudentInfo = styled.p`
  color: #4a5568;
  margin: 0 0 0.5rem 0;
`;

const AssessmentStatus = styled.div<{ $completed: boolean }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  background-color: ${props => props.$completed ? '#48BB78' : '#4299E1'};
  color: white;
  margin-bottom: 1rem;
`;

const ActionButton = styled.button`
  width: 100%;
  background-color: #3B82F6;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  
  &:hover {
    background-color: #2563EB;
  }
`;

const EmptyState = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f1f5f9;
  border-radius: 0.5rem;
  text-align: center;
`;

const LogoutButton = styled.button`
  background-color: #ef4444;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #dc2626;
  }
`;

const OfflineBanner = styled(motion.div)`
  background: #fff3cd;
  color: #856404;
  padding: 0.75rem;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const LoadingOverlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #dc2626;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RetryButton = styled.button`
  background: none;
  border: 1px solid currentColor;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`;

export default Dashboard;
```

---

## /src/components/home/Features.css

```css
.features-section {
  padding: 4rem 2rem;
  background-color: #f8f9fa;
}

.features-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #2d3748;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  background-color: #e6b800; /* P920d */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* P920d */
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #2d3748;
}

.feature-description {
  color: #4a5568;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .features-section {
    padding: 2rem 1rem;
  }

  .features-title {
    font-size: 2rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## /src/components/home/Features.tsx

```tsx
import React from 'react';
import Card from '../common/Card';
import './Features.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullseye, faLightbulb, faChartLine, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';

const Features = () => {
  const features = [
    {
      title: "Personalized Learning",
      description: "Tailored learning paths based on your unique style",
      icon: faBullseye
    },
    {
      title: "Interactive Content",
      description: "Engage with dynamic and interactive learning materials",
      icon: faLightbulb
    },
    {
      title: "Progress Tracking",
      description: "Monitor your growth with detailed analytics",
      icon: faChartLine
    },
    {
      title: "Expert Support",
      description: "Get help from experienced educators",
      icon: faChalkboardTeacher
    }
  ];

  return (
    <section className="features-section">
      <h2 className="features-title">Why Choose Geaux Academy</h2>
      <div className="features-grid">
        {features.map((feature, index) => (
          <Card key={index} className="feature-card" icon={feature.icon}>
            <div className="feature-icon"><FontAwesomeIcon icon={feature.icon} /></div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Features;
```

---

## /src/components/home/Hero.css

```css
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

.hero-content {
  flex: 1;
  max-width: 600px;
}

.hero-content h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #333;
}

.hero-content p {
  font-size: 1.25rem;
  color: #666;
  margin-bottom: 2rem;
}

.hero-cta {
  display: flex;
  gap: 1rem;
}

.hero-cta .btn {
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.hero-cta .btn:hover {
  background-color: #e6b800;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
}

.hero-image img {
  max-width: 100%;
  height: auto;
}
```

---

## /src/components/home/Hero.tsx

```tsx
import { Link } from 'react-router-dom';
import './Hero.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Discover Your Learning Style</h1>
        <p>Personalized education tailored to how you learn best</p>
        <div className="hero-cta">
          <Link to="/assessment" className="btn btn-primary">
            <FontAwesomeIcon icon={faUser} /> Take Assessment
          </Link>
          <Link to="/about" className="btn btn-secondary">
            <FontAwesomeIcon icon={faUser} /> Learn More
          </Link>
        </div>
      </div>
      <div className="hero-image">
        <img src="/images/hero-learning.svg" alt="Learning illustration" />
      </div>
    </section>
  );
};

export default Hero;
```

---

## /src/components/home/LearningStyles.css

```css
:root {
  --primary-color: #2C3E50;
  --text-color: #333;
  --background-alt: #f8f9fa;
}

body {
  margin: 0;
  padding: 0;
}

.learning-styles-section {
  padding: 4rem 2rem;
  background-color: var(--light-bg);
}

.learning-styles-section h2 {
  text-align: center;
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 2rem;
}

.styles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.style-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.3s ease;
}

.style-card:hover {
  transform: translateY(-5px);
  background-color: #e6b800; /* P4a73 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* P4a73 */
}

.style-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.style-card h3 {
  color: var(--primary-color);
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.style-card p {
  color: var(--text-color);
  line-height: 1.5;
}

.main-content {
  margin-left: 250px;
  padding: 2rem;
  min-height: 100vh;
}

@media (max-width: 768px) {
  .styles-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
  
  .learning-styles-section {
    padding: 2rem 1rem;
  }

  .main-content {
    margin-left: 0;
    padding: 1rem;
  }
}
```

---

## /src/components/home/LearningStyles.tsx

```tsx
import React from 'react';
import styled from 'styled-components';
import InfoCard from '../common/InfoCard'; // Fixed path
import { motion } from 'framer-motion';
import Card from '../common/Card';
import './LearningStyles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEar, faBook, faRunning } from '@fortawesome/free-solid-svg-icons';

const LearningStyles = () => {
  const styles = [
    {
      title: 'Visual Learning',
      description: 'Learn through seeing and watching demonstrations',
      icon: faEye
    },
    {
      title: 'Auditory Learning',
      description: 'Learn through listening and discussion',
      icon: faEar
    },
    {
      title: 'Reading/Writing',
      description: 'Learn through reading and taking notes',
      icon: faBook
    },
    {
      title: 'Kinesthetic',
      description: 'Learn through doing and practicing',
      icon: faRunning
    }
  ];

  return (
    <section className="learning-styles-section">
      <div className="styles-grid">
        {styles.map((style, index) => (
          <Card key={index} className="style-card" icon={style.icon}>
            <div className="style-icon"><FontAwesomeIcon icon={style.icon} /></div>
            <h3>{style.title}</h3>
            <p>{style.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default LearningStyles;
```

---

## /src/components/chat/ChatUI.css

```css
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.chat-window {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fff;
}

.message {
  margin: 0.5rem 0;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  max-width: 80%;
}

.message.user {
  background-color: #e3f2fd;
  margin-left: auto;
  text-align: right;
}

.message.tutor {
  background-color: #f5f5f5;
  margin-right: auto;
}

.message.processing {
  background-color: #fafafa;
  opacity: 0.7;
  font-style: italic;
}

.input-container {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background-color: #fff;
  border-top: 1px solid #e0e0e0;
}

.input-container input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
}

.input-container button {
  padding: 0.75rem 1.5rem;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.input-container button:disabled {
  background-color: #bdbdbd;
  cursor: not-allowed;
}

.input-container input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}
```

---

## /src/components/chat/ChatUI.tsx

```tsx
import React, { useState } from 'react';
import { CheshireService } from '../../services/cheshireService';
import { useAuth } from '../../contexts/AuthContext';
import './ChatUI.css';

interface Message {
  sender: 'user' | 'tutor';
  text: string;
}

const ChatUI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { currentUser } = useAuth();

  const handleSend = async () => {
    if (!inputText.trim() || !currentUser?.uid) return;
    
    const userMessage: Message = { sender: 'user', text: inputText };
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      const chatId = 'default';
      const response = await CheshireService.sendChatMessage(
        inputText,
        currentUser.uid,
        chatId
      );

      const tutorMessage: Message = {
        sender: 'tutor',
        text: response.data
      };
      setMessages(prev => [...prev, tutorMessage]);

      const memories = response.memories || [];
      if (memories.length > 0) {
        const learningStyleMemory = memories.find(
          memory => memory.metadata?.learning_style
        );
        if (learningStyleMemory?.metadata?.learning_style) {
          console.log('Learning style detected:', learningStyleMemory.metadata.learning_style);
        }
      }
    } catch (error) {
      const errorMessage = CheshireService.getErrorMessage(error);
      setMessages(prev => [...prev, { sender: 'tutor', text: errorMessage }]);
    } finally {
      setIsProcessing(false);
    }
    setInputText('');
  };

  return (
    <div className="chat-container">
      <div className="chat-window">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isProcessing && (
          <div className="message tutor processing">
            Thinking...
          </div>
        )}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={inputText}
          placeholder="Type your message..."
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !isProcessing && handleSend()}
          disabled={isProcessing}
        />
        <button 
          onClick={handleSend}
          disabled={isProcessing || !inputText.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatUI;
```

---

## /src/components/chat/LearningStyleChat.tsx

```tsx
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaPaperPlane } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import Message from '../Message';
import { saveLearningStyle, updateStudentAssessmentStatus } from '../../services/profileService';
import { CheshireService } from '../../services/cheshireService';
import { LearningStyle } from '../../types/profiles';

type ValidLearningStyle = 'visual' | 'auditory' | 'kinesthetic' | 'reading/writing';

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
}

interface CheshireResponse {
  data: string;
  memories?: Array<{
    metadata?: {
      learning_style?: string;
    };
  }>;
}

interface CheshireError {
  code?: string;
  message: string;
}

const isValidLearningStyle = (style: string): style is ValidLearningStyle => {
  return ['visual', 'auditory', 'kinesthetic', 'reading/writing'].includes(style);
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const LearningStyleChat: React.FC<{ studentId?: string }> = ({ studentId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAuth();

  // Initialize chat with assessment start message
  useEffect(() => {
    setMessages([{ 
      text: "Hi! I'm here to help assess your learning style. Let's start with a few questions. How do you prefer to learn new things?", 
      sender: "bot" 
    }]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check API connection on mount and set up periodic checks
  useEffect(() => {
    checkApiConnection();
    const intervalId = setInterval(checkApiConnection, 30000); // Check every 30 seconds
    return () => clearInterval(intervalId);
  }, []);

  const checkApiConnection = async (): Promise<void> => {
    const isConnected = await CheshireService.checkConnection();
    setConnectionError(!isConnected);
  };

  const retryWithDelay = async (fn: () => Promise<void>, maxRetries = 3, delay = 1000): Promise<void> => {
    try {
      return await fn();
    } catch (error) {
      if (maxRetries > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return retryWithDelay(fn, maxRetries - 1, delay);
      }
      throw error;
    }
  };

  const handleResponse = async (response: CheshireResponse): Promise<void> => {
    const rawLearningStyle = response?.memories?.find(m => m.metadata?.learning_style)?.metadata?.learning_style;
    if (rawLearningStyle && isValidLearningStyle(rawLearningStyle) && studentId) {
      const learningStyle: LearningStyle = {
        type: rawLearningStyle,
        strengths: [],
        recommendations: []
      };
      try {
        await saveLearningStyle(studentId, learningStyle);
        await updateStudentAssessmentStatus(studentId, "completed");
      } catch (error) {
        console.error('Error saving learning style:', error);
        setMessages(prev => [...prev, { 
          text: "There was an error saving your learning style. Please try again.", 
          sender: "bot" 
        }]);
      }
    }
  };

  const sendMessage = async (): Promise<void> => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);

    try {
      setLoading(true);
      const response = await CheshireService.sendChatMessage(
        userMessage,
        currentUser?.uid || 'anonymous',
        studentId || 'default'
      );

      if (response) {
        setMessages(prev => [...prev, { text: response.data, sender: 'bot' }]);
        await handleResponse(response);
      }
      
      setConnectionError(false);
    } catch (error: unknown) {
      console.error('Error sending message:', error);
      const errorMessage = CheshireService.getErrorMessage(error as CheshireError);
      setMessages(prev => [...prev, { text: errorMessage, sender: 'bot' }]);
      setConnectionError(true);
      await checkApiConnection();
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatContainer className="card">
      <ChatHeader>
        🎓 Learning Style Assessment
        {connectionError && (
          <ConnectionError>
            ⚠️ Connection Error - Check if the chat service is running
          </ConnectionError>
        )}
      </ChatHeader>
      <ChatBody>
        {messages.map((msg, index) => (
          <Message key={index} sender={msg.sender}>{msg.text}</Message>
        ))}
        {loading && <Message sender="bot">Typing...</Message>}
        <div ref={chatEndRef} />
      </ChatBody>
      <ChatFooter>
        <ChatInput
          type="text"
          value={input}
          placeholder="Type your response..."
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          className="form-input"
        />
        <SendButton onClick={sendMessage} className="btn btn-primary">
          <FaPaperPlane />
        </SendButton>
      </ChatFooter>
    </ChatContainer>
  );
};

const ChatContainer = styled.div`
  height: 500px;
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  padding: var(--spacing-md);
  border-bottom: 1px solid #eee;
  font-weight: bold;
`;

const ConnectionError = styled.div`
  color: var(--color-error);
  font-size: 0.8em;
  margin-top: 4px;
`;

const ChatBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md);
`;

const ChatFooter = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-top: 1px solid #eee;
`;

const ChatInput = styled.input`
  flex: 1;
`;

const SendButton = styled.button`
  padding: var(--spacing-sm);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default LearningStyleChat;
```

---

## /src/components/chat/TestChat.tsx

```tsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CheshireService } from '../../services/cheshireService';
import { useAuth } from '../../contexts/AuthContext';

const TestChat: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<string>('Checking connection...');
  const [testMessage, setTestMessage] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { currentUser } = useAuth();

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const isConnected = await CheshireService.checkConnection();
      setConnectionStatus(isConnected ? 'Connected ✅' : 'Not connected ❌');
    } catch (error) {
      setConnectionStatus('Connection failed ❌');
      setError(CheshireService.getErrorMessage(error));
    }
  };

  const handleTestMessage = async () => {
    if (!testMessage.trim() || !currentUser?.uid) return;

    try {
      setError('');
      const result = await CheshireService.sendChatMessage(
        testMessage,
        currentUser.uid,
        'test'
      );
      setResponse(result.data);
      if (result.memories?.length) {
        console.log('Memories received:', result.memories);
      }
    } catch (error) {
      setError(CheshireService.getErrorMessage(error));
    }
  };

  return (
    <TestContainer>
      <TestCard>
        <h2>Cheshire Service Test</h2>
        
        <StatusSection>
          <h3>Connection Status:</h3>
          <StatusText>{connectionStatus}</StatusText>
          <RefreshButton onClick={checkConnection}>
            Refresh Connection
          </RefreshButton>
        </StatusSection>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <TestSection>
          <h3>Send Test Message:</h3>
          <TestInput
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Type a test message..."
          />
          <SendButton 
            onClick={handleTestMessage}
            disabled={!testMessage.trim() || !currentUser}
          >
            Send Message
          </SendButton>
        </TestSection>

        {response && (
          <ResponseSection>
            <h3>Response:</h3>
            <ResponseText>{response}</ResponseText>
          </ResponseSection>
        )}
      </TestCard>
    </TestContainer>
  );
};

const TestContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  background-color: var(--background);
`;

const TestCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 600px;

  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: var(--primary-color);
  }

  h3 {
    margin-bottom: 1rem;
    color: var(--text-color);
  }
`;

const StatusSection = styled.div`
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
`;

const StatusText = styled.div`
  font-size: 1.1rem;
  margin-bottom: 1rem;
`;

const TestSection = styled.div`
  margin-bottom: 2rem;
`;

const TestInput = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1rem;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const ResponseSection = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
`;

const ResponseText = styled.div`
  white-space: pre-wrap;
  font-family: monospace;
  padding: 1rem;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const RefreshButton = styled(Button)`
  background-color: #6c757d;
  color: white;

  &:hover:not(:disabled) {
    background-color: #5a6268;
  }
`;

const SendButton = styled(Button)`
  background-color: var(--primary-color);
  color: white;
  width: 100%;

  &:hover:not(:disabled) {
    background-color: var(--primary-dark);
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  background-color: #fee2e2;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

export default TestChat;
```

---

## /src/components/shared/ErrorBoundary.tsx

```tsx
import React, { Component, ErrorInfo } from 'react';
import styled from 'styled-components';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isOffline: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      isOffline: !navigator.onLine
    };
  }

  componentDidMount() {
    window.addEventListener('online', this.handleOnlineStatus);
    window.addEventListener('offline', this.handleOnlineStatus);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleOnlineStatus);
    window.removeEventListener('offline', this.handleOnlineStatus);
  }

  handleOnlineStatus = () => {
    this.setState({ isOffline: !navigator.onLine });
    if (navigator.onLine && this.state.error?.message.includes('offline')) {
      // Clear offline-related errors when back online
      this.setState({ hasError: false, error: null });
    }
  };

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      isOffline: !navigator.onLine
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Check if error is Firebase offline error
      const isFirebaseOffline = this.state.error?.message.includes('offline') || 
                               this.state.error?.message.includes('network');

      return (
        <ErrorContainer>
          <ErrorCard>
            <ErrorTitle>
              {this.state.isOffline ? '📡 You\'re Offline' : '❌ Something went wrong'}
            </ErrorTitle>
            
            <ErrorMessage>
              {this.state.isOffline || isFirebaseOffline ? (
                <>
                  <p>It looks like you're offline or having connection issues.</p>
                  <p>Some features may be limited until you're back online.</p>
                  <p>Your data will sync automatically when you reconnect.</p>
                </>
              ) : (
                <>
                  <p>An unexpected error occurred.</p>
                  <p>{this.state.error?.message}</p>
                </>
              )}
            </ErrorMessage>

            <RetryButton 
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
            >
              Try Again
            </RetryButton>
          </ErrorCard>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background: rgba(0, 0, 0, 0.05);
`;

const ErrorCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

const ErrorTitle = styled.h2`
  color: #e53e3e;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.div`
  color: #4a5568;
  margin-bottom: 1.5rem;
  
  p {
    margin: 0.5rem 0;
  }
`;

const RetryButton = styled.button`
  background: #4299e1;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #3182ce;
  }
`;

export default ErrorBoundary;
```

---

## /src/components/shared/styles/Button.css

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-secondary {
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  background: transparent;
}

/* Authentication Components Styling */
.auth-container {
  max-width: 400px;
  margin: 2rem auto;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.auth-title {
  text-align: center;
  margin-bottom: var(--spacing-lg);
  color: var(--primary-color);
}

.auth-divider {
  display: flex;
  align-items: center;
  margin: var(--spacing-md) 0;
  text-align: center;
}

.auth-divider::before,
.auth-divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #ddd;
}

.auth-divider span {
  padding: 0 var(--spacing-sm);
  color: #666;
}

.google-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  width: 100%;
  padding: var(--spacing-sm);
  background: var(--white);
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: background-color 0.2s;
}

.google-button:hover {
  background-color: #f5f5f5;
}

.auth-error {
  color: var(--secondary-color);
  text-align: center;
  margin-bottom: var(--spacing-md);
}

.auth-success {
  color: #4CAF50;
  text-align: center;
  margin-bottom: var(--spacing-md);
}

/* Form validation styling */
.auth-input.error {
  border-color: var(--secondary-color);
}

.error-message {
  color: var(--secondary-color);
  font-size: 0.875rem;
  margin-top: var(--spacing-xs);
}
```

---

## /src/components/features/vue/VueComponent.tsx

```tsx
/src/components/features/vue/VueComponent.tsx

import React from 'react';
import VueComponentWrapper from './VueComponentWrapper';

interface VueComponentProps {
  // Add any props if needed
}

const VueComponent: React.FC<VueComponentProps> = () => {
  return (
    <div>
      <h1>React + Vue Integration</h1>
      <VueComponentWrapper />
    </div>
  );
};

export default VueComponent;
```

---

## /src/components/features/vue/VueWrapper.tsx

```tsx
import React, { useEffect, useRef } from 'react';
import { createApp, App } from 'vue';

interface VueWrapperProps {
  component: any; // Vue component
  props?: Record<string, any>;
}

const VueWrapper: React.FC<VueWrapperProps> = ({ component, props = {} }) => {
  const vueRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<App | null>(null);

  useEffect(() => {
    if (!vueRef.current || !component) return;

    if (!appRef.current) {
      appRef.current = createApp(component, props);
      appRef.current.mount(vueRef.current);
    }

    return () => {
      if (appRef.current) {
        appRef.current.unmount();
        appRef.current = null;
      }
    };
  }, [component, props]);

  return <div ref={vueRef} />;
};

export default VueWrapper;
```

---

## /src/components/features/learning/LearningStyleInsightsWrapper.tsx

```tsx
/src/components/features/learning/LearningStyleInsightsWrapper.tsx

import React from 'react';
import VueWrapper from '../vue/VueWrapper';
import LearningStyleInsights from './LearningStyleInsights.vue';

interface LearningStyleInsightsWrapperProps {
  studentData?: any; // Add proper typing based on your Vue component props
}

const LearningStyleInsightsWrapper: React.FC<LearningStyleInsightsWrapperProps> = ({ studentData }) => {
  return <VueWrapper component={LearningStyleInsights} props={{ studentData }} />;
};

export default LearningStyleInsightsWrapper;
```

---

## /src/components/styles/CoreValues.styles.ts

```typescript
import styled from 'styled-components';

export const CoreValuesContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  text-align: center;
  padding: 1.5rem 0;
`;

export const CoreValue = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
`;
```

---

## /src/firebase/auth-service-worker.ts

```typescript
// File: /src/firebase/auth-service-worker.ts
// Description: Service worker initialization with enhanced security
// Author: GitHub Copilot
// Created: 2024-02-12

import { enableIndexedDbPersistence, type FirestoreSettings } from 'firebase/firestore';
import { db } from './config';

interface ServiceWorkerError extends Error {
  name: string;
  code?: string;
}

interface AuthServiceWorkerMessage {
  type: string;
  status?: number;
  ok?: boolean;
  fallbackToRedirect?: boolean;
  error?: string;
  secure?: boolean;
}

interface ServiceWorkerRegistrationResult {
  success: boolean;
  isSecure: boolean;
  supportsServiceWorker: boolean;
  error?: string;
}

const SW_TIMEOUT = Number(import.meta.env.VITE_SERVICE_WORKER_TIMEOUT) || 10000;
const MAX_RETRIES = Number(import.meta.env.VITE_MAX_AUTH_RETRIES) || 3;

const isSecureContext = (): boolean => {
  return window.isSecureContext && (
    window.location.protocol === 'https:' || 
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  );
};

let serviceWorkerRegistration: ServiceWorkerRegistration | null = null;
let retryCount = 0;

const registerWithRetry = async (): Promise<ServiceWorkerRegistration> => {
  try {
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/__/auth',
      type: 'module',
      updateViaCache: 'none'
    });
    return registration;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      await new Promise(resolve => setTimeout(resolve, 1000));
      return registerWithRetry();
    }
    throw error;
  }
};

export const registerAuthServiceWorker = async (): Promise<ServiceWorkerRegistrationResult> => {
  if (!('serviceWorker' in navigator)) {
    return {
      success: false,
      isSecure: false,
      supportsServiceWorker: false,
      error: 'Service workers are not supported in this browser'
    };
  }

  if (!isSecureContext()) {
    return {
      success: false,
      isSecure: false,
      supportsServiceWorker: true,
      error: 'Secure context required for authentication'
    };
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map(registration => registration.unregister()));

    serviceWorkerRegistration = await registerWithRetry();

    const activationPromise = new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Service worker activation timeout'));
      }, SW_TIMEOUT);

      if (serviceWorkerRegistration?.active) {
        clearTimeout(timeout);
        resolve();
        return;
      }

      serviceWorkerRegistration?.addEventListener('activate', () => {
        clearTimeout(timeout);
        resolve();
      });
    });

    await activationPromise;

    return {
      success: true,
      isSecure: isSecureContext(),
      supportsServiceWorker: true
    };

  } catch (error) {
    console.error('Service worker registration failed:', error);
    return {
      success: false,
      isSecure: isSecureContext(),
      supportsServiceWorker: true,
      error: error instanceof Error ? error.message : 'Service worker registration failed'
    };
  }
};

export const initAuthServiceWorker = async (): Promise<boolean> => {
  const result = await registerAuthServiceWorker();
  
  window.dispatchEvent(new CustomEvent('firebase-auth-worker-status', { 
    detail: result 
  }));

  if (!result.success) {
    console.warn('Auth service worker initialization failed:', result.error);
    return false;
  }

  // Initialize Firestore persistence after successful service worker registration
  try {
    const settings: FirestoreSettings = {
      cacheSizeBytes: 50000000, // 50 MB
    };
    
    await enableIndexedDbPersistence(db);
    
    return true;
  } catch (error) {
    console.error('Failed to enable persistence:', error);
    return false;
  }
};

function handleServiceWorkerMessage(event: MessageEvent<AuthServiceWorkerMessage>) {
  const { type, status, ok, fallbackToRedirect, error, secure } = event.data;

  const dispatch = (eventName: string, detail: any) => {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
  };

  switch (type) {
    case 'FIREBASE_SERVICE_WORKER_READY':
      console.debug('Firebase auth service worker ready');
      dispatch('firebase-auth-worker-ready', { secure });
      break;
      
    case 'FIREBASE_AUTH_POPUP_READY':
      console.debug('Firebase auth popup ready');
      dispatch('firebase-auth-popup-ready', { secure });
      break;
      
    case 'FIREBASE_AUTH_POPUP_ERROR':
      if (fallbackToRedirect && import.meta.env.VITE_AUTH_POPUP_FALLBACK === 'true') {
        console.warn('Popup authentication failed, falling back to redirect method');
      }
      dispatch('firebase-auth-error', { error, fallbackToRedirect });
      break;
      
    case 'AUTH_RESPONSE':
      if (!ok) {
        console.error('Authentication response error:', status);
        dispatch('firebase-auth-error', { status, error });
      } else {
        dispatch('firebase-auth-success', { status });
      }
      break;
      
    case 'SECURE_CONTEXT_CHECK':
      if (!secure) {
        console.warn('Authentication requires a secure context (HTTPS)');
        dispatch('firebase-auth-security', { secure: false });
      }
      break;
  }
}

navigator.serviceWorker?.addEventListener('message', handleServiceWorkerMessage);

export default initAuthServiceWorker;
```

---

## /src/firebase/auth-service.ts

```typescript
import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, Auth } from "firebase/auth";
import { auth } from './config';

export class AuthService {
  private provider: GoogleAuthProvider;
  private initialized: boolean = false;
  private popupOpen: boolean = false;
  private _auth: Auth;

  constructor() {
    this.provider = new GoogleAuthProvider();
    this.provider.setCustomParameters({
      prompt: 'select_account',
      scope: 'email profile'
    });
    this._auth = auth;
  }

  get auth(): Auth {
    return this._auth;
  }

  private async ensureInitialized() {
    if (!this.initialized) {
      await new Promise<void>((resolve) => {
        const unsubscribe = this._auth.onAuthStateChanged(() => {
          unsubscribe();
          this.initialized = true;
          resolve();
        });
      });
    }
  }

  async signInWithGoogle() {
    try {
      if (this.popupOpen) {
        throw new Error('Authentication popup is already open');
      }

      await this.ensureInitialized();
      this.popupOpen = true;

      const result = await signInWithPopup(this._auth, this.provider);
      return result;
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in cancelled by user');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Sign-in popup was blocked. Please allow popups for this site');
      }
      throw new Error(error.message || 'Failed to sign in with Google');
    } finally {
      this.popupOpen = false;
    }
  }

  async signOut() {
    try {
      await this.ensureInitialized();
      await firebaseSignOut(this._auth);
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error(error.message || 'Failed to sign out');
    }
  }
}
```

---

## /src/firebase/config.ts

```typescript
// File: /src/firebase/config.ts
// Description: Firebase configuration with Firestore persistence setup

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  initializeAuth, 
  indexedDBLocalPersistence,
  browserLocalPersistence,
  browserPopupRedirectResolver,
  type Auth
} from 'firebase/auth';
import { 
  initializeFirestore,
  CACHE_SIZE_UNLIMITED,
  persistentLocalCache,
  persistentSingleTabManager,
  type Firestore
} from 'firebase/firestore';
import { getAnalytics, type Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firestore with persistent cache settings
export const db: Firestore = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentSingleTabManager({ forceOwnership: true }),
    cacheSizeBytes: CACHE_SIZE_UNLIMITED
  })
});

// Initialize Auth with persistence and popup support (preferred method)
export const auth: Auth = initializeAuth(app, {
  persistence: [indexedDBLocalPersistence, browserLocalPersistence],
  popupRedirectResolver: browserPopupRedirectResolver
});

// Initialize Analytics
export const analytics: Analytics = getAnalytics(app);

// Export app instance for other Firebase services
export { app as firebase };
```

---

## /src/utils/animations.js

```javascript
export const pageTransitions = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, staggerChildren: 0.2 }
  },
};

export const containerVariants = {
  initial: { 
    opacity: 0, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      staggerChildren: 0.1 
    }
  },
  exit: { 
    opacity: 0, 
    y: -20 
  }
};

export const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  hover: { scale: 1.05 }
};
```

---

## /src/contexts/AuthContext.tsx

```tsx
// File: /src/contexts/AuthContext.tsx
// Description: Context for authentication using Firebase
// Author: GitHub Copilot
// Created: 2024-02-12

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { AuthService } from '../firebase/auth-service';

export interface AuthContextProps {
  currentUser: User | null;
  isAuthReady: boolean;
  loading: boolean;
  error: string | null;
  login: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const authService = new AuthService();

  useEffect(() => {
    const unsubscribe = authService.auth.onAuthStateChanged((firebaseUser: User | null) => {
      setCurrentUser(firebaseUser);
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      await authService.signInWithGoogle();
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    try {
      setLoading(true);
      await authService.signInWithGoogle();
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.signOut();
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value: AuthContextProps = {
    currentUser,
    isAuthReady,
    loading,
    error,
    login,
    loginWithGoogle,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

---

## /src/contexts/ProfileContext.tsx

```tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Profile {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  learningStyle?: string;
  grade?: string;
}

interface ProfileContextType {
  profile: Profile | null;
  updateProfile: (newProfile: Profile) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null);

  const updateProfile = (newProfile: Profile) => {
    setProfile(newProfile);
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};
```

---

## /src/test/mockThemes.ts

```typescript
import { createTheme } from '@mui/material/styles';
import type { DefaultTheme } from 'styled-components';
import type { Theme } from '@mui/material/styles';

const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      dark: '#115293',
      light: '#4791db'
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350'
    },
    background: {
      paper: '#ffffff',
      default: '#f5f5f5'
    },
    text: {
      primary: '#000000',
      secondary: '#666666'
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536
    }
  }
});

export const mockMuiTheme = muiTheme;

const spacing = Object.assign(
  ((factor: number) => `${0.25 * factor}rem`) as Theme['spacing'],
  {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '2rem',
    xl: '3rem',
  }
);

export const mockStyledTheme: DefaultTheme = {
  ...muiTheme,
  breakpoints: {
    ...muiTheme.breakpoints,
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    large: '1440px'
  },
  spacing,
  colors: {
    border: '#e0e0e0',
    text: '#000000',
    background: {
      hover: '#f5f5f5'
    },
    error: {
      main: '#d32f2f',
      light: '#ffebee'
    }
  },
  borderRadius: {
    default: '4px'
  }
};
```

---

## /src/test/setup.ts

```typescript
// File: /src/test/setup.ts
// Description: Jest setup file for testing environment configuration.

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import React from 'react';

// Run cleanup after each test
afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

// Mock react-icons
jest.mock('react-icons/fc', () => ({
  FcGoogle: function MockGoogleIcon() {
    return React.createElement('span', { 'data-testid': 'google-icon' }, 'Google Icon');
  }
}));

// Mock Firebase Auth
jest.mock('firebase/auth');

// Mock Firebase Config
jest.mock('../firebase/config', () => ({
  auth: jest.fn(),
  googleProvider: {
    setCustomParameters: jest.fn()
  }
}));
```

---

## /src/test/testUtils.tsx

```tsx
import React from "react";
import { render, RenderOptions, RenderResult } from "@testing-library/react";
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { AuthContext, type AuthContextProps } from "../contexts/AuthContext";
import '@testing-library/jest-dom';
import { mockMuiTheme, mockStyledTheme } from "./mockThemes";

// Enable React Router v7 future flags
const future = {
  v7_startTransition: true,
  v7_relativeSplatPath: true
};

export const mockLoginWithGoogle = jest.fn();

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  withRouter?: boolean;
  mockAuthValue?: Partial<AuthContextProps>;
}

export const renderWithProviders = (
  ui: React.ReactNode,
  { withRouter = true, mockAuthValue = {}, ...options }: RenderWithProvidersOptions = {}
): RenderResult => {
  const defaultAuthValue: AuthContextProps = {
    currentUser: null,
    isAuthReady: true,
    loading: false,
    error: null,
    login: mockLoginWithGoogle,
    loginWithGoogle: mockLoginWithGoogle,
    logout: jest.fn(),
    clearError: jest.fn(),
    ...mockAuthValue
  };

  const Providers = ({ children }: { children: React.ReactNode }) => (
    <MUIThemeProvider theme={mockMuiTheme}>
      <StyledThemeProvider theme={mockStyledTheme}>
        <AuthContext.Provider value={defaultAuthValue}>
          {children}
        </AuthContext.Provider>
      </StyledThemeProvider>
    </MUIThemeProvider>
  );

  if (withRouter) {
    const router = createMemoryRouter(
      [{ path: "*", element: <Providers>{ui}</Providers> }],
      { 
        initialEntries: ['/'],
        future
      }
    );
    return render(<RouterProvider router={router} future={future} />, options);
  }

  return render(<Providers>{ui}</Providers>, options);
};
```

---

## /src/styles/global.css

```css
:root {
  /* Colors */
  --primary-color: #2C3E50;
  --secondary-color: #E74C3C;
  --accent-color: #3498DB;
  --text-color: #333;
  --light-bg: #f8f9fa;
  --white: #ffffff;
  
  /* Layout */
  --header-height: 64px;
  --max-width: 1200px;
  --border-radius: 8px;
  
  /* Spacing */
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  
  /* Typography */
  --font-family: 'Arial', sans-serif;
  --line-height: 1.6;
}

/* Global Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-family);
  line-height: var(--line-height);
  color: var(--text-color);
}

/* Layout Components */
.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--spacing-lg);
  width: 100%;
}

.page-container {
  padding-top: var(--header-height);
}

/* Common Components */
.card {
  background: var(--white);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--border-radius);
  text-decoration: none;
  font-weight: 500;
  transition: transform 0.2s;
  cursor: pointer;
}

.btn-primary {
  background-color: var(--accent-color);
  color: var(--white);
  border: none;
}

.btn-secondary {
  background-color: var(--white);
  border: 1px solid var(--accent-color);
  color: var(--accent-color);
}

.btn:hover {
  transform: translateY(-2px);
}

/* Forms */
.form-group {
  margin-bottom: var(--spacing-md);
}

.form-label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  font-family: inherit;
}

/* Responsive Utilities */
@media (max-width: 768px) {
  .container {
    padding: var(--spacing-sm);
  }
}
```

---

## /src/styles/global.ts

```typescript
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: ${({ theme }) => theme.palette.background.default};
    color: ${({ theme }) => theme.palette.text.primary};
    line-height: 1.5;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    border: none;
    background: none;
    cursor: pointer;
    font: inherit;
  }

  ul, ol {
    list-style: none;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.2;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    html {
      font-size: 14px;
    }
  }
`;

export default GlobalStyle;
```

---

## /src/styles/theme.js

```javascript

```

---

## /src/styles/components/common.ts

```typescript
import styled from 'styled-components';
import { motion as m } from 'framer-motion';
import { DefaultTheme } from 'styled-components';

interface ThemeProps {
  theme: DefaultTheme;
}

interface ButtonProps extends ThemeProps {
  $variant?: 'primary' | 'secondary';
}

export const Container = styled(m.div)`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }: ThemeProps) => theme.spacing.md};
`;

export const Section = styled.section`
  padding: ${({ theme }: ThemeProps) => theme.spacing.xl} 0;
`;

export const Card = styled(m.div)`
  background: ${({ theme }: ThemeProps) => theme.palette.background.paper};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: ${({ theme }: ThemeProps) => theme.spacing.lg};
`;

export const Button = styled(m.button)<{ $variant?: 'primary' | 'secondary' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }: ThemeProps) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-radius: 4px;
  font-weight: 600;
  background: ${({ theme, $variant }: ButtonProps) => 
    $variant === 'secondary' 
      ? theme.palette.secondary.main 
      : theme.palette.primary.main};
  color: white;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme, $variant }: ButtonProps) => 
      $variant === 'secondary' 
        ? theme.palette.secondary.dark 
        : theme.palette.primary.dark};
  }
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.palette.primary.main};
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const StylesGrid = styled(m.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const StyleCard = styled(m.div)`
  padding: 2rem;
  text-align: center;
  background: ${({ theme }) => theme.palette.background.paper};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;
```

---

## /.vscode/settings.json

```json
{
    "github.copilot.chat.followUps": "always",
    "github.copilot.chat.scopeSelection": true,
    "github.copilot.chat.edits.codesearch.enabled": true,
    "github.copilot.nextEditSuggestions.enabled": true,
    "github.copilot.chat.completionContext.typescript.mode": "on",
    "github.copilot.chat.editor.temporalContext.enabled": true,
    "github.copilot.chat.enableUserPreferences": true,
    "github.copilot.chat.generateTests.codeLens": true,
    "github.copilot.chat.languageContext.typescript.enabled": true,
    "github.copilot.chat.search.semanticTextResults": true,
    "files.autoSave": "afterDelay",
    "editor.wordWrap": "on",
    "github.copilot.chat.codeGeneration.useInstructionFiles": true,
    "github.copilot.chat.edits.temporalContext.enabled": true,

    "github.copilot.chat.testGeneration.instructions": [
        {
            "file": "",
            "filePattern": "src/**/*.test.tsx",
            "instructions": "Generate unit tests using Jest & React Testing Library. Cover both success and failure cases. Use Mock Service Worker (MSW) for API mocking."
        },
        {
            "file": "",
            "filePattern": "backend/tests/**/*.py",
            "instructions": "Use FastAPI TestClient and Pytest for backend tests. Ensure JWT authentication and RBAC security tests are included."
        },
        {
            "file": "",
            "filePattern": "src/pages/**/*.test.tsx",
            "instructions": "For integration tests, use Cypress with end-to-end scenarios covering user authentication, navigation, and API calls."
        }
    ],

    "github.copilot.chat.commitMessageGeneration.instructions": [
        {
            "file": "",
            "filePattern": "*",
            "instructions": "Format commit messages using Conventional Commits: `feat:`, `fix:`, `chore:`, `test:`, `docs:`, `refactor:`. Provide a short, clear summary in the present tense."
        }
    ],

    "github.copilot.chat.reviewSelection.instructions": [
        {
            "file": "",
            "filePattern": "src/**/*.tsx",
            "instructions": "Ensure TypeScript compliance, proper prop typing, and React best practices. Avoid inline styles; prefer Styled Components or Tailwind CSS."
        },
        {
            "file": "",
            "filePattern": "backend/**/*.py",
            "instructions": "Ensure FastAPI routes use Pydantic models for validation, JWT authentication, and RBAC. Implement proper error handling and response models."
        },
        {
            "file": "",
            "filePattern": ".github/workflows/*.yml",
            "instructions": "Validate CI/CD pipeline integrity. Ensure workflows include ESLint, Jest, Cypress, and dependency security scans."
        }
    ],

    "github.copilot.chat.codeReview.instructions": [
        {
            "file": "",
            "filePattern": "src/**/*.tsx",
            "instructions": "Check for performance optimizations, React hooks best practices, and clean code formatting. Ensure absolute imports are used."
        },
        {
            "file": "",
            "filePattern": "backend/**/*.py",
            "instructions": "Validate API endpoint security, response models, and authentication handling. Ensure database queries use ORM best practices."
        },
        {
            "file": "",
            "filePattern": "firestore.rules",
            "instructions": "Ensure Firestore security rules enforce RBAC. No public read/write access unless explicitly required."
        }
    ],
    "github-actions.workflows.pinned.workflows": []
}
```

---

## /dataconnect-generated/js/default-connector/README.md

```markdown
#  Generated TypeScript README
This README will guide you through the process of using the generated TypeScript SDK package for the connector `default`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

You can use this generated SDK by importing from the package `@firebasegen/default-connector` as shown below. Both CommonJS and ESM imports are supported.
You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

# Accessing the connector
A connector is a collection of queries and mutations. One SDK is generated for each connector - this SDK is generated for the connector `default`.

You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

In order to call Data Connect queries and mutations, you need to create an instance of the connector in your application code.

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/default-connector';

const connector: DataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```javascript
// add connectDataConnectEmulator to your imports 
import { connectDataConnectEmulator, getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/default-connector';

const connector: DataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(connector, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK. 

# Queries
No queries were generated for the `default` connector.

If you want to learn more about how to use queries in Data Connect, you can follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

# Mutations
No mutations were generated for the `default` connector.

If you want to learn more about how to use mutations in Data Connect, you can follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).
```

---

## /dataconnect-generated/js/default-connector/index.cjs.js

```javascript
const connectorConfig = {
  connector: 'default',
  service: 'geaux-academy',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;
```

---

## /dataconnect-generated/js/default-connector/index.d.ts

```typescript
import { ConnectorConfig, DataConnect } from 'firebase/data-connect';
export const connectorConfig: ConnectorConfig;

export type TimestampString = string;

export type UUIDString = string;

export type Int64String = string;

export type DateString = string;
```

---

## /dataconnect-generated/js/default-connector/package.json

```json
{
  "name": "@firebasegen/default-connector",
  "version": "1.0.0",
  "author": "Firebase <firebase-support@google.com> (https://firebase.google.com/)",
  "description": "Generated SDK For default",
  "license": "Apache-2.0",
  "engines": {
    "node": " >=18.0"
  },
  "typings": "index.d.ts",
  "module": "esm/index.esm.js",
  "main": "index.cjs.js",
  "browser": "esm/index.esm.js",
  "exports": {
    ".": {
      "types": "./index.d.ts",
      "require": "./index.cjs.js",
      "default": "./esm/index.esm.js"
    },
    "./package.json": "./package.json"
  },
  "peerDependencies": {
    "firebase": "^10.14.0 || ^11.0.0"
  }
}
```

---

## /dataconnect-generated/js/default-connector/esm/index.esm.js

```javascript
export const connectorConfig = {
  connector: 'default',
  service: 'geaux-academy',
  location: 'us-central1'
};
```

---

## /dataconnect-generated/js/default-connector/esm/package.json

```json
{"type":"module"}
```

---

# Summary

Total React-related files processed: 187
```

---


```

## backend/Artifacts/codecopy/react_codebase_summary.md

```
# React Codebase Export Summary

Generated on: 2025-02-17 09:19:40

Total files processed: 193
Total parts generated: 22

## Generated Files:
- react_codebase_part1.md
- react_codebase_part2.md
- react_codebase_part3.md
- react_codebase_part4.md
- react_codebase_part5.md
- react_codebase_part6.md
- react_codebase_part7.md
- react_codebase_part8.md
- react_codebase_part9.md
- react_codebase_part10.md
- react_codebase_part11.md
- react_codebase_part12.md
- react_codebase_part13.md
- react_codebase_part14.md
- react_codebase_part15.md
- react_codebase_part16.md
- react_codebase_part17.md
- react_codebase_part18.md
- react_codebase_part19.md
- react_codebase_part20.md
- react_codebase_part21.md
- react_codebase_part22.md

```

## backend/Artifacts/codecopy/react_codebase_part14.md

```
# React Application Structure and Content - Part 14

Generated on: 2025-02-17 09:19:40

## /react_codebase_part2.md (continued)

```markdown
        "ws": "^8.11.0",
        "xml-name-validator": "^4.0.0"
      },
      "engines": {
        "node": ">=14"
      },
```

---

```

---


```

## backend/Artifacts/codecopy/project-plan.md

```
# Milestone 1: Curriculum Development Project Plan

## Project Overview
This document outlines the key deliverables and responsibilities for the first milestone of the curriculum development project. All sections will be coordinated and reviewed by Dawn Hopkins (dhopkins@geauxspecialist.com).

## Section 1: Grade-Level Organization
**Deliverable:** Structured folder system with grade-level separation
**Coordinator:** Dawn Hopkins
**Tasks:**
- Create main project directory structure
- Establish separate folders for each grade level
- Implement naming conventions for folders and files
- Set up access permissions and sharing settings

## Section 2: Unit Development
**Deliverable:** Comprehensive unit themes and outlines for each grade
**Coordinator:** Dawn Hopkins
**Requirements:**
- 3-5 broad unit themes per grade level
- Detailed outline for each unit including:
  - Core concepts and learning objectives
  - Timeline and pacing guide
  - Required resources and materials
  - Assessment strategies

## Section 3: Lesson Planning
**Deliverable:** Initial set of lesson plans for each unit
**Coordinator:** Dawn Hopkins
**Specifications:**
- Minimum 3 lesson plans per unit
- Total of 10-15 lessons per grade level
- Each lesson must include:
  - Clear learning objectives
  - Detailed instructional activities
  - Assessment components
  - Required materials and resources

## Section 4: Template Development
**Deliverable:** Standardized lesson plan template
**Coordinator:** Dawn Hopkins
**Components:**
- Create template document with standardized sections
- Include formatting guidelines and instructions
- Develop sample lesson using template
- Document template usage guidelines

## Section 5: Quality Assurance
**Deliverable:** Initial quality review report
**Coordinator:** Dawn Hopkins
**Review Criteria:**
- Cross-grade alignment and progression
- Standards compliance and accuracy
- Consistency in format and approach
- Content appropriateness and rigor
- Resource availability and practicality

## Timeline and Dependencies
1. Template Creation must be completed before Lesson Planning begins
2. Grade-Level Organization must be established before Unit Development
3. Unit Development must be completed before Lesson Planning
4. Quality Assurance occurs after all other sections are drafted

## Contact Information
All deliverables and questions should be directed to:
Dawn Hopkins
Email: dhopkins@geauxspecialist.com

## Next Steps
1. Confirm folder structure and access permissions
2. Begin template development
3. Start unit theme brainstorming
4. Schedule initial review meeting with Dawn Hopkins
```

## backend/Artifacts/codecopy/react_codebase_part22.md

```
# React Application Structure and Content - Part 22

Generated on: 2025-02-17 09:19:40

## /src/pages/Login.tsx

```tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { FcGoogle } from 'react-icons/fc';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Login: React.FC = () => {
  const { loginWithGoogle, loading: authLoading, error: authError, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [localError, setLocalError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof clearError === 'function') {
      clearError();
    }
  }, [clearError]);

  const handleDismissError = () => {
    setLocalError('');
    if (typeof clearError === 'function') {
      clearError();
    }
  };

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setLocalError('');
      setLoading(true);
      await loginWithGoogle();
      const destination = location.state?.from?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to sign in');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || authLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  return (
    <LoginContainer>
      <LoginBox>
        <Title>Welcome Back</Title>
        {(localError || authError) && (
          <ErrorMessage>
            <span>{localError || authError}</span>
            <DismissButton 
              onClick={handleDismissError}
              type="button"
              aria-label="Dismiss error message"
            >✕</DismissButton>
          </ErrorMessage>
        )}
        
        <GoogleButton 
          onClick={handleGoogleLogin} 
          disabled={loading}
          type="button"
          aria-label="Sign in with Google"
        >
          <FcGoogle />
          Sign in with Google
        </GoogleButton>
        <SignUpPrompt>
          Don't have an account? <StyledLink to="/signup">Sign up</StyledLink>
        </SignUpPrompt>
      </LoginBox>
    </LoginContainer>
  );
};

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px);
`;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px);
  padding: 20px;
`;

const LoginBox = styled.div`
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
`;

const GoogleButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: white;
  color: #555;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SignUpPrompt = styled.p`
  text-align: center;
  margin-top: 1rem;
  color: #666;
`;

const StyledLink = styled(Link)`
  color: var(--primary-color);
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  background-color: #fee;
  color: #c00;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DismissButton = styled.button`
  background: none;
  border: none;
  color: #c00;
  cursor: pointer;
  padding: 0 0.5rem;
  
  &:hover {
    opacity: 0.7;
  }
`;

export default Login;
```

---

## /src/pages/NotFound.tsx

```tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';

const NotFound: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setError('');
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Login error:', err);
    }
  };

  return (
    <NotFoundContainer>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for might have been removed or doesn't exist.</p>
      <StyledLink to="/">Return to Home</StyledLink>
      <GoogleButton onClick={handleGoogleLogin}>
        <FcGoogle className="text-xl" />
        Sign in with Google
      </GoogleButton>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </NotFoundContainer>
  );
};

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 2rem;

  h1 {
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 2rem;
    color: var(--text-color);
  }
`;

const StyledLink = styled(Link)`
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--secondary-color);
  }
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: white;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const ErrorMessage = styled.div`
  margin-top: 1rem;
  color: red;
`;

export default NotFound;
```

---

## /src/pages/TakeAssessment.tsx

```tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { useParams } from "react-router-dom";
import { getStudentProfile, updateStudentAssessmentStatus } from "../services/profileService";
import type { Student } from '../types/student';
import styled from 'styled-components';
import LearningStyleChat from '../components/chat/LearningStyleChat';

const TakeAssessment: React.FC = () => {
  const { currentUser } = useAuth();
  const { studentId } = useParams<{ studentId: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudent = async (): Promise<void> => {
      if (!studentId || !currentUser) {
        setLoading(false);
        return;
      }
      
      try {
        const studentProfile = await getStudentProfile(studentId);
        if (!studentProfile || !studentProfile.id) {
          setError("Student profile not found");
        } else {
          setStudent({
            ...studentProfile,
            id: studentProfile.id
          });
        }
      } catch (error) {
        console.error("Error fetching student profile:", error);
        setError("Failed to load student profile");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [currentUser, studentId]);

  const handleAssessmentCompletion = async (): Promise<void> => {
    if (!studentId) {
      setError("Student ID is required");
      return;
    }

    try {
      setLoading(true);
      await updateStudentAssessmentStatus(studentId, "completed");
      setStudent(prev => prev ? { ...prev, hasTakenAssessment: true } : null);
    } catch (error) {
      console.error("Error completing assessment:", error);
      setError("Failed to complete assessment");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingContainer>Loading assessment...</LoadingContainer>;
  }

  if (error) {
    return <ErrorContainer>{error}</ErrorContainer>;
  }

  if (!student) {
    return <ErrorContainer>No student found</ErrorContainer>;
  }

  return (
    <AssessmentContainer>
      <Header>
        <h1>Learning Style Assessment</h1>
        <StudentName>for {student.name}</StudentName>
      </Header>

      <ContentSection>
        <p>Chat with our AI assistant to help determine your learning style. The assistant will ask you questions and analyze your responses to identify the learning style that best suits you.</p>
        <LearningStyleChat />
      </ContentSection>

      <ActionSection>
        <CompleteButton 
          onClick={handleAssessmentCompletion}
          disabled={loading}
        >
          {loading ? "Completing..." : "Complete Assessment"}
        </CompleteButton>
      </ActionSection>
    </AssessmentContainer>
  );
};

const AssessmentContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    color: var(--primary-color);
    margin-bottom: 0.5rem;
  }
`;

const StudentName = styled.h2`
  font-size: 1.25rem;
  color: var(--text-color);
`;

const ContentSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
`;

const ActionSection = styled.div`
  display: flex;
  justify-content: center;
`;

const CompleteButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--primary-dark);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  font-size: 1.1rem;
  color: var(--text-color);
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 2rem;
  color: #dc2626;
  background-color: #fee2e2;
  border-radius: 8px;
  margin: 2rem auto;
  max-width: 600px;
`;

export default TakeAssessment;
```

---

## /src/pages/VarkStyles.tsx

```tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion as m } from 'framer-motion';
import { FaEye, FaHeadphones, FaBookReader, FaRunning } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

interface LearningStyle {
  icon: JSX.Element;
  title: string;
  description: string;
  characteristics: string[];
}

const VarkStyles: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setError("");
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Login error:", err);
    }
  };

  const styles: LearningStyle[] = [
    {
      icon: <FaEye />,
      title: "Visual Learning",
      description: "Learn through seeing and observing",
      characteristics: [
        "Prefer diagrams and charts",
        "Remember visual details",
        "Benefit from visual aids",
        "Excel with graphic organizers"
      ]
    },
    {
      icon: <FaHeadphones />,
      title: "Auditory Learning",
      description: "Learn through listening and speaking",
      characteristics: [
        "Excel in discussions",
        "Remember spoken information",
        "Benefit from lectures",
        "Learn through verbal repetition"
      ]
    },
    {
      icon: <FaBookReader />,
      title: "Read/Write Learning",
      description: "Learn through written words",
      characteristics: [
        "Enjoy reading materials",
        "Take detailed notes",
        "Prefer written instructions",
        "Learn through writing summaries"
      ]
    },
    {
      icon: <FaRunning />,
      title: "Kinesthetic Learning",
      description: "Learn through doing and experiencing",
      characteristics: [
        "Learn by doing",
        "Prefer hands-on activities",
        "Remember through practice",
        "Benefit from role-playing"
      ]
    }
  ];

  return (
    <Container>
      <Header>
        <m.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Discover Your VARK Learning Style
        </m.h1>
        <m.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Understanding how you learn best is the first step to academic success
        </m.p>
      </Header>

      <StylesGrid>
        {styles.map((style, index) => (
          <StyleCard
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            <IconWrapper>{style.icon}</IconWrapper>
            <h2>{style.title}</h2>
            <p>{style.description}</p>
            <CharacteristicsList>
              {style.characteristics.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </CharacteristicsList>
          </StyleCard>
        ))}
      </StylesGrid>

      <CTASection>
        <h2>Ready to optimize your learning journey?</h2>
        <p>Take our assessment to discover your learning style and get personalized recommendations.</p>
        <ButtonGroup>
          <PrimaryButton to="/signup">Get Started Now</PrimaryButton>
          <SecondaryButton to="/about">Learn More</SecondaryButton>
        </ButtonGroup>
      </CTASection>

      <GoogleLoginSection>
        <GoogleButton onClick={handleGoogleLogin}>
          Sign in with Google
        </GoogleButton>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </GoogleLoginSection>
    </Container>
  );
};

const Container = styled(m.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
`;

const Header = styled(m.header)`
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    font-size: 2.5rem;
    color: var(--primary-color);
  }

  p {
    font-size: 1.25rem;
    color: var(--text-color);
  }
`;

const StylesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const StyleCard = styled(m.div)`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const IconWrapper = styled.div`
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
`;

const CharacteristicsList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 1rem;

  li {
    padding: 0.5rem 0;
    padding-left: 1.5rem;
    position: relative;

    &:before {
      content: "•";
      color: var(--primary-color);
      position: absolute;
      left: 0;
    }
  }
`;

const CTASection = styled.div`
  text-align: center;
  margin-top: 4rem;
  padding: 3rem;
  background: var(--background-alt);
  border-radius: 12px;

  h2 {
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 2rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled(Link)`
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const PrimaryButton = styled(Button)`
  background-color: var(--primary-color);
  color: white;
`;

const SecondaryButton = styled(Button)`
  background-color: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
`;

const GoogleLoginSection = styled.div`
  text-align: center;
  margin-top: 2rem;
`;

const GoogleButton = styled.button`
  background-color: #4285f4;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #357ae8;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 1rem;
`;

export default VarkStyles;
```

---

## /src/pages/values/Collaboration.tsx

```tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion as m } from 'framer-motion';
import { FaUsers } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { DefaultTheme } from 'styled-components';

interface ThemeProps {
  theme: DefaultTheme;
}

const Collaboration: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState<string>('');

  const handleGoogleLogin = async () => {
    try {
      setError('');
      await loginWithGoogle();
      // Handle navigation to /dashboard after successful login
    } catch (err) {
      // Handle error as string per user preference
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    }
  };

  return (
    <ValueContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ValueHeader>
        <FaUsers size={40} />
        <h1>Collaboration</h1>
      </ValueHeader>
      <ValueContent>
        <p>We believe in the power of working together:</p>
        <ValuePoints>
          <li>Fostering partnerships between teachers, students, and parents</li>
          <li>Creating supportive learning communities</li>
          <li>Encouraging peer-to-peer learning</li>
          <li>Building strong educational networks</li>
        </ValuePoints>
        <button onClick={handleGoogleLogin}>Sign in with Google</button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </ValueContent>
    </ValueContainer>
  );
};

const ValueContainer = styled(m.div)`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const ValueHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;

  h1 {
    font-size: 2rem;
    color: var(--primary-color);
  }

  svg {
    color: var(--primary-color);
  }
`;

const ValueContent = styled.div`
  p {
    font-size: 1.2rem;
    color: var(--text-color);
    margin-bottom: 1rem;
  }
`;

const ValuePoints = styled.ul`
  list-style: none;
  padding: 0;

  li {
    font-size: 1rem;
    color: var(--text-color);
    margin-bottom: 0.5rem;
    padding-left: 1.5rem;
    position: relative;

    &::before {
      content: '•';
      color: var(--primary-color);
      position: absolute;
      left: 0;
    }
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 1rem;
`;

export default Collaboration;
```

---

## /src/pages/values/Excellence.tsx

```tsx
import React, { useState } from 'react';
import styled, { DefaultTheme } from 'styled-components';
import { motion as m } from 'framer-motion';
import { FaTrophy } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

interface ThemeProps {
  theme: DefaultTheme;
}

const Excellence: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState<string>('');

  const handleGoogleLogin = async () => {
    try {
      setError('');
      await loginWithGoogle();
      // Handle navigation to /dashboard after successful login
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
      console.error('Login error:', err);
    }
  };

  return (
    <ValueContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ValueHeader>
        <FaTrophy size={40} />
        <h1>Excellence</h1>
      </ValueHeader>
      <ValueContent>
        <p>We strive for excellence in every aspect of education:</p>
        <ValuePoints>
          <li>Setting high academic standards while supporting individual growth</li>
          <li>Continuously improving our teaching methodologies</li>
          <li>Providing top-quality educational resources</li>
          <li>Measuring and celebrating student achievements</li>
        </ValuePoints>
        <GoogleButton onClick={handleGoogleLogin}>
          Sign in with Google
        </GoogleButton>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </ValueContent>
    </ValueContainer>
  );
};

const ValueContainer = styled(m.div)`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const ValueHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;

  h1 {
    font-size: 2rem;
    color: var(--primary-color);
  }

  svg {
    color: var(--primary-color);
  }
`;

const ValueContent = styled.div`
  p {
    font-size: 1.2rem;
    color: var(--text-color);
    margin-bottom: 1rem;
  }
`;

const ValuePoints = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    font-size: 1rem;
    color: var(--text-color);
    margin-bottom: 0.5rem;
    padding-left: 1rem;
    position: relative;

    &::before {
      content: '•';
      color: var(--primary-color);
      position: absolute;
      left: 0;
    }
  }
`;

const GoogleButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #357ae8;
  }
`;

const ErrorMessage = styled.div`
  margin-top: 1rem;
  color: red;
  font-size: 0.875rem;
`;

export default Excellence;
```

---

## /src/pages/values/Innovation.tsx

```tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion as m } from 'framer-motion';
import { FaLightbulb } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';

const Innovation: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setError('');
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Login error:', err);
    }
  };

  return (
    <ValueContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ValueHeader>
        <FaLightbulb size={40} />
        <h1>Innovation</h1>
      </ValueHeader>
      <ValueContent>
        <p>Innovation drives our approach to personalized learning:</p>
        <ValuePoints>
          <li>Leveraging cutting-edge educational technology</li>
          <li>Developing adaptive learning pathways</li>
          <li>Creating interactive and engaging content</li>
          <li>Implementing data-driven teaching methods</li>
        </ValuePoints>
        {error && (
          <ErrorMessage>{error}</ErrorMessage>
        )}
        <GoogleButton onClick={handleGoogleLogin}>
          <FcGoogle className="text-xl" />
          Sign in with Google
        </GoogleButton>
      </ValueContent>
    </ValueContainer>
  );
};

const ValueContainer = styled(m.div)`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

const ValueHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;

  h1 {
    font-size: 2rem;
    color: var(--primary-color);
  }

  svg {
    color: var(--primary-color);
  }
`;

const ValueContent = styled.div`
  p {
    font-size: 1.2rem;
    color: var(--text-color);
    margin-bottom: 1rem;
  }
`;

const ValuePoints = styled.ul`
  list-style: none;
  padding: 0;

  li {
    font-size: 1rem;
    color: var(--text-color);
    margin-bottom: 0.5rem;
    padding-left: 1.5rem;
    position: relative;

    &::before {
      content: '•';
      position: absolute;
      left: 0;
      color: var(--primary-color);
    }
  }
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  text-align: center;
`;

const GoogleButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: white;
  color: #333;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8fafc;
  }

  &:focus {
    outline: none;
    ring: 2px;
    ring-offset: 2px;
    ring-blue-500;
  }
`;

export default Innovation;
```

---

## /src/pages/values/Integrity.tsx

```tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaBalanceScale } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';

const Integrity: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setError("");
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Login error:", err);
    }
  };

  return (
    <ValueContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ValueHeader>
        <FaBalanceScale size={40} />
        <h1>Integrity</h1>
      </ValueHeader>
      <ValueContent>
        <p>At Geaux Academy, integrity is the foundation of everything we do. We believe in:</p>
        <ValuePoints>
          <li>Maintaining the highest ethical standards in education</li>
          <li>Being transparent with our teaching methods and student progress</li>
          <li>Creating a safe and honest learning environment</li>
          <li>Delivering on our promises to students and parents</li>
        </ValuePoints>
        {error && (
          <ErrorMessage>{error}</ErrorMessage>
        )}
        <GoogleButton onClick={handleGoogleLogin}>
          <FcGoogle className="text-xl" />
          Sign in with Google
        </GoogleButton>
      </ValueContent>
    </ValueContainer>
  );
};

const ValueContainer = styled(motion.div)`
  max-width: 800px;
  margin: 80px auto;
  padding: 2rem;
`;

const ValueHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  color: var(--primary-color);

  h1 {
    margin-top: 1rem;
    font-size: 2.5rem;
  }
`;

const ValueContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
`;

const ValuePoints = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-top: 1rem;

  li {
    padding: 1rem;
    margin-bottom: 1rem;
    background: var(--background-alt);
    border-radius: 4px;
    
    &:hover {
      transform: translateX(5px);
      transition: transform 0.2s;
    }
  }
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  text-align: center;
`;

const GoogleButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: white;
  color: #333;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8fafc;
  }

  &:focus {
    outline: none;
    ring: 2px;
    ring-offset: 2px;
    ring-blue-500;
  }
`;

export default Integrity;
```

---

## /src/pages/profile/ParentProfile/CreateStudent.tsx

```tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { addStudentProfile } from '../../../services/profileService';
import { useAuth } from '../../../contexts/AuthContext';
import StudentCard from '../../../components/student/StudentCard';

interface NewStudent {
  name: string;
  grade: string;
  parentId: string;
  hasTakenAssessment: boolean;
}

const CreateStudent: React.FC = () => {
  const [studentName, setStudentName] = useState<string>('');
  const [grade, setGrade] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newStudent: NewStudent = { 
        name: studentName, 
        grade, 
        parentId: currentUser.uid,
        hasTakenAssessment: false
      };

      await addStudentProfile(currentUser.uid, newStudent);
      setStudentName('');
      setGrade('');
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to create student profile. Please try again.');
      console.error('Error creating student:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <h2>Add a New Student</h2>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>
            Student Name:
            <Input
              type="text"
              value={studentName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStudentName(e.target.value)}
              placeholder="Enter student's name"
              required
            />
          </Label>
        </FormGroup>

        <FormGroup>
          <Label>
            Grade Level:
            <Select 
              value={grade} 
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setGrade(e.target.value)}
              required
            >
              <option value="">Select Grade</option>
              <option value="K">Kindergarten</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={String(i + 1)}>
                  Grade {i + 1}
                </option>
              ))}
            </Select>
          </Label>
        </FormGroup>

        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Creating Profile...' : 'Save Profile'}
        </SubmitButton>
      </Form>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h2 {
    margin-bottom: 1.5rem;
    color: var(--primary-color);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background: white;
`;

const SubmitButton = styled.button`
  background: var(--primary-color);
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: var(--primary-dark);
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  background: #fee2e2;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

export default CreateStudent;
```

---

## /src/pages/profile/ParentProfile/ParentDashboard.tsx

```tsx
import React, { useState, useEffect } from 'react';
import StudentProgressTracker from './components/StudentProgressTracker';
import NotificationCenter from './dashboard/components/NotificationCenter';
import LearningStyleInsights from '../components/LearningStyleInsights';
import CurriculumApproval from './dashboard/components/CurriculumApproval';
import styled from 'styled-components';
import { useAuth } from "../../../contexts/AuthContext";
import { getParentProfile } from '../../../services/profileService';
import { Parent, Student } from '../../../types/auth';
import { useNavigate } from 'react-router-dom';

interface ParentProfile extends Omit<Parent, 'students'> {
  name: string;
  students: Student[];
  createdAt: string;
  updatedAt: string;
}

const ParentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'curriculum' | 'insights'>('overview');
  const [parentProfile, setParentProfile] = useState<ParentProfile | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const { currentUser: user, loginWithGoogle } = useAuth();
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const profile = await getParentProfile(user.uid);
          if (profile) {
            setParentProfile({
              ...profile,
              name: profile.displayName,
              id: profile.id || user.uid,
              students: profile.students.map((student: string) => ({
                id: student,
                name: '',
                age: 0,
                grade: '',
                parentId: profile.id || user.uid,
                hasTakenAssessment: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              })) || [],
              createdAt: profile.createdAt || new Date().toISOString(),
              updatedAt: profile.updatedAt || new Date().toISOString()
            });
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };
    fetchProfile();
  }, [user]);

  const handleGoogleLogin = async () => {
    try {
      setError("");
      await loginWithGoogle();
    } catch (error) {
      setError("Login failed. Please try again.");
      console.error("Login error:", error);
    }
  };

  const handleProfileSwitch = (studentId: string) => {
    setSelectedStudent(studentId);
    navigate(`/student-dashboard/${studentId}`);
  };

  return (
    <DashboardContainer>
      <DashboardHeader>
        <h1>Parent Dashboard</h1>
      </DashboardHeader>

      <ProfileSection>
        <h2>Account Details</h2>
        <p>Name: {parentProfile?.name || "Parent"}</p>
        <p>Email: {user?.email}</p>
        {!user && (
          <GoogleButton onClick={handleGoogleLogin}>
            Sign in with Google
          </GoogleButton>
        )}
      </ProfileSection>

      {user && (
        <>
          <StudentManagement>
            <h2>Student Profiles</h2>
            <AddStudentButton>➕ Add Student</AddStudentButton>
            
            <StudentList>
              {parentProfile?.students?.map((student) => (
                <StudentCard key={student.id} onClick={() => handleProfileSwitch(student.id)}>
                  <h3>{student.name}</h3>
                  <p>Grade: {student.grade}</p>
                  <p>Assessment: {student.hasTakenAssessment ? 'Completed' : 'Pending'}</p>
                  <ViewProfileButton>View Profile</ViewProfileButton>
                </StudentCard>
              ))}
            </StudentList>
          </StudentManagement>

          <TabContainer>
            <TabList>
              <Tab active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>Overview</Tab>
              <Tab active={activeTab === 'progress'} onClick={() => setActiveTab('progress')}>Progress</Tab>
              <Tab active={activeTab === 'curriculum'} onClick={() => setActiveTab('curriculum')}>Curriculum</Tab>
              <Tab active={activeTab === 'insights'} onClick={() => setActiveTab('insights')}>Insights</Tab>
            </TabList>

            <TabContent>
              {activeTab === 'overview' && <OverviewTab />}
              {activeTab === 'progress' && <StudentProgressTracker />}
              {activeTab === 'curriculum' && <CurriculumApproval />}
              {activeTab === 'insights' && <LearningStyleInsights />}
            </TabContent>
          </TabContainer>

          <NotificationSection>
            <NotificationCenter />
          </NotificationSection>
        </>
      )}
    </DashboardContainer>
  );
};

// Styled components
const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const DashboardHeader = styled.div`
  margin-bottom: 2rem;
  h1 {
    font-size: 2rem;
    color: var(--primary-color);
  }
`;

const ProfileSection = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const StudentManagement = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const AddStudentButton = styled.button`
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: var(--primary-dark);
  }
`;

const StudentList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const StudentCard = styled.div`
  background: #f8fafc;
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
`;

const TabContainer = styled.div`
  margin-top: 2rem;
`;

const TabList = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

interface TabProps {
  active: boolean;
}

const Tab = styled.button<TabProps>`
  padding: 0.5rem 1rem;
  border: none;
  background: ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--text-color)'};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? 'var(--primary-dark)' : '#f0f0f0'};
  }
`;

const TabContent = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const NotificationSection = styled.div`
  margin-top: 2rem;
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 1px solid #ddd;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #f8f8f8;
  }
`;

const OverviewTab = styled.div`
  // Add specific styles for the overview tab content
`;

const ViewProfileButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--primary-dark);
  }
`;

export default ParentDashboard;
```

---

## /src/pages/profile/ParentProfile/ParentProfile.tsx

```tsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addStudent } from '../../../store/slices/profileSlice';
import { RootState } from '../../../store';
import { Student } from '../../../types/auth';  // Using the auth Student type consistently
import { useAuth } from '../../../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import styled from 'styled-components';
import { getStudentProfile } from '../../../services/profileService';

const ParentProfile: React.FC = () => {
  const dispatch = useDispatch();
  const parent = useSelector((state: RootState) => state.profile.parent);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudent, setNewStudent] = useState<Partial<Student>>({});
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState("");
  const [studentsData, setStudentsData] = useState<Student[]>([]);

  const handleAddStudent = () => {
    if (newStudent.name) {
      dispatch(addStudent({
        id: Date.now().toString(),
        name: newStudent.name || '',
        grade: newStudent.grade || '',
        parentId: parent?.id || '',
        hasTakenAssessment: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      setShowAddStudent(false);
      setNewStudent({});
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError("");
      await loginWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to login");
      console.error("Login error:", err);
    }
  };

  useEffect(() => {
    const fetchStudentsData = async () => {
      if (parent?.students) {
        try {
          const studentsPromises = parent.students.map(async studentId => {
            const student = await getStudentProfile(studentId);
            return student as Student;  // Ensure type consistency
          });
          const fetchedStudents = await Promise.all(studentsPromises);
          setStudentsData(fetchedStudents.filter((s): s is Student => s !== null));
        } catch (error) {
          console.error('Error fetching students:', error);
        }
      }
    };

    fetchStudentsData();
  }, [parent?.students]);

  return (
    <Container>
      <ProfileBox>
        <Title>Parent Profile</Title>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <GoogleButton onClick={handleGoogleLogin}>
          <FcGoogle className="text-xl" />
          Sign in with Google
        </GoogleButton>

        <div className="students-section">
          <h3>My Students</h3>
          <button onClick={() => setShowAddStudent(true)}>Add Student</button>

          {showAddStudent && (
            <div className="add-student-form">
              <input
                type="text"
                placeholder="Student Name"
                value={newStudent.name || ''}
                onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
              />
              <input
                type="text"
                placeholder="Grade"
                value={newStudent.grade || ''}
                onChange={(e) => setNewStudent({...newStudent, grade: e.target.value})}
              />
              <button onClick={handleAddStudent}>Save</button>
              <button onClick={() => setShowAddStudent(false)}>Cancel</button>
            </div>
          )}

          <div className="students-list">
            {studentsData.map((student) => (
              <div key={student.id} className="student-card">
                <h4>{student.name}</h4>
                {student.grade && <p>Grade: {student.grade}</p>}
                <p>Learning Style: {student.learningStyle || 'Not assessed'}</p>
                <div className="progress-summary">
                  {student.hasTakenAssessment ? (
                    <div className="assessment-status">Assessment Complete</div>
                  ) : (
                    <div className="assessment-status">Assessment Needed</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ProfileBox>
    </Container>
  );
};

const Container = styled.div`
  padding: 2rem;
`;

const ProfileBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  margin-bottom: 2rem;

  &:hover {
    background: #f5f5f5;
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  background: #fee2e2;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

export default ParentProfile;
```

---

## /src/pages/profile/ParentProfile/ParentProfileForm.tsx

```tsx
import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { createParentProfile } from '../../../services/profileService';
import styled from 'styled-components';

interface FormData {
  displayName: string;
  phone: string;
  email: string;
}

export const ParentProfileForm: React.FC = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    displayName: currentUser?.displayName || '',
    phone: '',
    email: currentUser?.email || ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) {
      setError('You must be logged in to create a profile');
      return;
    }

    setLoading(true);
    setError('');
    try {
      console.log('📝 Creating parent profile for:', currentUser.uid);
      await createParentProfile({
        uid: currentUser.uid,
        email: formData.email,
        displayName: formData.displayName,
        phone: formData.phone
      });
      setSuccess(true);
      console.log('✅ Parent profile created successfully');
    } catch (err) {
      console.error('❌ Error creating parent profile:', err);
      setError('Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <SuccessMessage>
        Profile created successfully! You can now add students to your account.
      </SuccessMessage>
    );
  }

  return (
    <FormContainer>
      <h2>Complete Your Parent Profile</h2>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="displayName">Full Name</Label>
          <Input
            id="displayName"
            type="text"
            placeholder="Your full name"
            value={formData.displayName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({
              ...formData,
              displayName: e.target.value
            })}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Your phone number"
            value={formData.phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({
              ...formData,
              phone: e.target.value
            })}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Your email"
            value={formData.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({
              ...formData,
              email: e.target.value
            })}
            required
            disabled={!!currentUser?.email}
          />
        </FormGroup>

        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Creating Profile...' : 'Create Profile'}
        </SubmitButton>
      </Form>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  h2 {
    margin-bottom: 1.5rem;
    color: var(--primary-color);
    text-align: center;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  background: var(--primary-color);
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: var(--primary-dark);
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  background: #fee2e2;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.div`
  color: #059669;
  background: #d1fae5;
  padding: 1rem;
  border-radius: 4px;
  text-align: center;
  margin: 1rem 0;
`;

export default ParentProfileForm;
```

---

## /src/pages/profile/ParentProfile/dashboard/components/CurriculumApproval.tsx

```tsx
import React from 'react';
import styled from 'styled-components';
import { Student } from '../../../../../types/auth';

interface CurriculumApprovalProps {
  studentData?: Student[];
}

const CurriculumApproval: React.FC<CurriculumApprovalProps> = ({ studentData }) => {
  return (
    <ApprovalContainer>
      <h3>Pending Curriculum Approvals</h3>
      {studentData?.map(student => (
        <ApprovalCard key={student.id}>
          <h4>{student.name}</h4>
          <ApprovalActions>
            <button className="approve">Approve</button>
            <button className="review">Review</button>
          </ApprovalActions>
        </ApprovalCard>
      ))}
    </ApprovalContainer>
  );
};

const ApprovalContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
`;

const ApprovalCard = styled.div`
  margin: 15px 0;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
`;

const ApprovalActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;

  button {
    padding: 5px 15px;
    border-radius: 4px;
    border: none;
    cursor: pointer;

    &.approve {
      background: #4CAF50;
      color: white;
    }

    &.review {
      background: #FFA726;
      color: white;
    }
  }
`;

export default CurriculumApproval;
```

---

## /src/pages/profile/ParentProfile/dashboard/components/NotificationCenter.tsx

```tsx
import React from 'react';
import styled from 'styled-components';

const NotificationCenter: React.FC = () => {
  return (
    <NotificationContainer>
      <h3>Notifications</h3>
      <NotificationList>
        {/* Placeholder for notifications */}
        <NotificationItem>
          <span>No new notifications</span>
        </NotificationItem>
      </NotificationList>
    </NotificationContainer>
  );
};

const NotificationContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const NotificationList = styled.div`
  margin-top: 15px;
`;

const NotificationItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom: none;
  }
`;

export default NotificationCenter;
```

---

## /src/pages/profile/ParentProfile/components/StudentProgressTracker.tsx

```tsx
import React from 'react';
import styled from 'styled-components';
import { Student } from '../../../../types/student';

interface StudentProgressTrackerProps {
  studentData?: Student[];
}

const StudentProgressTracker: React.FC<StudentProgressTrackerProps> = ({ studentData }) => {
  return (
    <ProgressContainer>
      <h3>Student Progress Overview</h3>
      {studentData?.map(student => (
        <ProgressCard key={student.id}>
          <h4>{student.name}</h4>
          <ProgressBar>
            <Progress width={75} />
          </ProgressBar>
        </ProgressCard>
      ))}
    </ProgressContainer>
  );
};

const ProgressContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const ProgressCard = styled.div`
  margin: 15px 0;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 10px;
  background: #eee;
  border-radius: 5px;
  overflow: hidden;
`;

const Progress = styled.div<{ width: number }>`
  width: ${props => props.width}%;
  height: 100%;
  background: #4CAF50;
  transition: width 0.3s ease;
`;

export default StudentProgressTracker;
```

---

## /src/pages/profile/StudentProfile/StudentDashboard.tsx

```tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion as m } from 'framer-motion';
import styled from 'styled-components';
import { FaGraduationCap, FaChartLine, FaBook } from 'react-icons/fa';
import { useAuth } from '../../../contexts/AuthContext';
import { getStudentProfile } from '../../../services/profileService';
import { Student } from '../../../types/auth';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import LearningStyleChat from '../../../components/chat/LearningStyleChat';
import { DefaultTheme } from 'styled-components';

interface ThemeProps {
  theme: DefaultTheme;
}

interface StudentData extends Student {
  recentActivities: Array<{
    id?: string;
    type: string;
    name: string;
    date: string;
  }>;
  progress: Array<{
    type: string;
    value: number;
  }>;
}

const StudentDashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!id) {
        setError('Student ID not found');
        return;
      }

      try {
        const data = await getStudentProfile(id);
        if (data) {
          setStudentData({
            ...data,
            id: data.id || id,
            recentActivities: [],
            progress: []
          } as StudentData);
        } else {
          setError('Student not found');
        }
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Failed to load student data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [id]);

  if (loading) {
    return (
      <StyledLoadingContainer>
        <LoadingSpinner />
      </StyledLoadingContainer>
    );
  }

  if (error) {
    return <StyledErrorContainer>{error}</StyledErrorContainer>;
  }

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <StyledHeader>
        <StyledHeaderLeft>
          <h1>Welcome, {studentData?.name}!</h1>
          <p>Grade {studentData?.grade}</p>
        </StyledHeaderLeft>
      </StyledHeader>

      <DashboardGrid>
        <MainSection>
          {!studentData?.hasTakenAssessment && (
            <AssessmentSection>
              <h2>Learning Style Assessment</h2>
              <p>Take your learning style assessment to get personalized recommendations.</p>
              <LearningStyleChat />
            </AssessmentSection>
          )}

          {studentData?.hasTakenAssessment && studentData.learningStyle && (
            <LearningStyleSection>
              <h2>Your Learning Style: {studentData.learningStyle}</h2>
              <p>Based on your assessment, we've customized your learning experience.</p>
            </LearningStyleSection>
          )}

          <ProgressSection>
            <h2>Recent Progress</h2>
            {/* Add progress visualization here */}
          </ProgressSection>
        </MainSection>
      </DashboardGrid>
    </m.div>
  );
};

const DashboardContainer = styled(m.div)`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const StyledLoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const StyledErrorContainer = styled.div`
  text-align: center;
  color: red;
  padding: 2rem;
`;

const StyledHeader = styled(m.header)`
  margin-bottom: 2rem;
`;

const StyledHeaderLeft = styled.div`
  h1 {
    margin: 0;
    color: var(--primary-color);
  }
  p {
    margin: 0.5rem 0 0;
    color: var(--text-secondary);
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  gap: 2rem;
`;

const MainSection = styled.div`
  display: grid;
  gap: 2rem;
`;

const AssessmentSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const LearningStyleSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ProgressSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

export default StudentDashboard;
```

---

## /src/pages/profile/StudentProfile/StudentProfile.tsx

```tsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";
import styled from "styled-components";
import CourseCard from "../../../components/CourseCard";

interface Course {
  title: string;
  type: "Video Animated" | "Quiz" | "Mind Map";
  category: string;
}

const StudentProfile: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string>("");
  const [filter, setFilter] = useState<string>("");

  const handleGoogleLogin = async () => {
    try {
      setError("");
      await loginWithGoogle();
      const destination = location.state?.from?.pathname || "/dashboard";
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to login");
      console.error("Login error:", err);
    }
  };

  const courses: Course[] = [
    { title: "Introduction to Learning Styles", type: "Video Animated", category: "Learning Fundamentals" },
    { title: "Learning Style Quiz", type: "Quiz", category: "Assessment" },
    { title: "Visual Learning Techniques", type: "Mind Map", category: "Learning Techniques" }
  ];

  return (
    <Container>
      <ProfileBox>
        <Title>Student Profile</Title>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <GoogleButton onClick={handleGoogleLogin}>
          <FcGoogle className="text-xl" />
          Sign in with Google
        </GoogleButton>

        {/* Search Filter */}
        <input
          type="text"
          placeholder="Search courses..."
          className="border px-4 py-2 w-full mb-4 rounded-lg"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />

        {/* Course List */}
        <div className="grid grid-cols-3 gap-4">
          {courses
            .filter((course) => course.title.toLowerCase().includes(filter.toLowerCase()))
            .map((course, index) => (
              <CourseCard key={index} {...course} />
            ))}
        </div>
      </ProfileBox>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f5f5;
`;

const ProfileBox = styled.div`
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: #2C3E50;
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  text-align: center;
`;

const GoogleButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: white;
  color: #333;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8fafc;
  }

  &:focus {
    outline: none;
    ring: 2px;
    ring-offset: 2px;
    ring-blue-500;
  }
`;

export default StudentProfile;
```

---

## /src/pages/profile/StudentProfile/StudentProfileForm.tsx

```tsx
import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import styled from 'styled-components';

interface StudentFormData {
  firstName: string;
  lastName: string;
  age: string;
  grade: string;
}

interface FormState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const StudentProfileForm: React.FC = () => {
  const [formData, setFormData] = useState<StudentFormData>({
    firstName: '',
    lastName: '',
    age: '',
    grade: ''
  });

  const [formState, setFormState] = useState<FormState>({
    loading: false,
    error: null,
    success: false
  });

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      age: '',
      grade: ''
    });
    setFormState({
      loading: false,
      error: null,
      success: false
    });
  };

  const validateForm = (): boolean => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setFormState(prev => ({ ...prev, error: 'First and last name are required' }));
      return false;
    }
    if (!formData.age || parseInt(formData.age) < 4 || parseInt(formData.age) > 18) {
      setFormState(prev => ({ ...prev, error: 'Age must be between 4 and 18' }));
      return false;
    }
    if (!formData.grade.trim()) {
      setFormState(prev => ({ ...prev, error: 'Grade is required' }));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parentId = auth.currentUser?.uid;
    
    if (!parentId) {
      setFormState(prev => ({ ...prev, error: 'Parent authentication required' }));
      return;
    }

    if (!validateForm()) return;

    setFormState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await addDoc(collection(db, 'students'), {
        ...formData,
        parentId,
        createdAt: new Date().toISOString()
      });
      
      setFormState({ loading: false, error: null, success: true });
      setTimeout(resetForm, 3000);
    } catch (error) {
      setFormState({
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
        success: false
      });
    }
  };

  return (
    <FormContainer>
      {formState.success && (
        <SuccessMessage>Student added successfully!</SuccessMessage>
      )}
      {formState.error && (
        <ErrorMessage>{formState.error}</ErrorMessage>
      )}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>First Name *</Label>
          <Input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            disabled={formState.loading}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Last Name *</Label>
          <Input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            disabled={formState.loading}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Age *</Label>
          <Input
            type="number"
            min="4"
            max="18"
            value={formData.age}
            onChange={(e) => setFormData({...formData, age: e.target.value})}
            disabled={formState.loading}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Grade *</Label>
          <Input
            type="text"
            value={formData.grade}
            onChange={(e) => setFormData({...formData, grade: e.target.value})}
            disabled={formState.loading}
            required
          />
        </FormGroup>
        <SubmitButton type="submit" disabled={formState.loading}>
          {formState.loading ? 'Adding Student...' : 'Add Student'}
        </SubmitButton>
      </Form>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: var(--text-color);
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: var(--secondary-color);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const Message = styled.div`
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
`;

const SuccessMessage = styled(Message)`
  background: var(--success-color);
  color: white;
`;

const ErrorMessage = styled(Message)`
  background: var(--danger-color);
  color: white;
`;

export default StudentProfileForm;
```

---

## /src/pages/profile/components/LearningStyleInsights.tsx

```tsx
import React from 'react';
import styled from 'styled-components';
import { Student } from '../../../types/student';

interface LearningStyleInsightsProps {
  studentData?: Student[];
}

const LearningStyleInsights: React.FC<LearningStyleInsightsProps> = ({ studentData }) => {
  return (
    <InsightsContainer>
      <h3>Learning Style Analytics</h3>
      {studentData?.map(student => (
        <InsightCard key={student.id}>
          <h4>{student.name}</h4>
          <InsightContent>
            <div>Learning Style: {student.learningStyle || 'Not assessed'}</div>
            <div>Recommended Activities: {student.recommendedActivities?.length || 0}</div>
          </InsightContent>
        </InsightCard>
      ))}
    </InsightsContainer>
  );
};

const InsightsContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
`;

const InsightCard = styled.div`
  margin: 15px 0;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
`;

const InsightContent = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export default LearningStyleInsights;
```

---

## /src/pages/__tests__/About.test.tsx

```tsx
// File: /src/pages/__tests__/About.test.tsx
// Description: Unit test for About page component.

import { screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { renderWithProviders } from "../../test/testUtils";
import About from "../About";

describe('About Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    renderWithProviders(<About />);
  });

  test("renders About component with correct content", () => {
    expect(screen.getByRole('heading', { name: /about geaux academy/i })).toBeInTheDocument();
    expect(screen.getByText(/Geaux Academy is an interactive learning platform that adapts to individual learning styles through AI-powered assessments and personalized content delivery./i)).toBeInTheDocument();
  });
});
```

---

## /src/pages/__tests__/Contact.test.tsx

```tsx
// File: /src/pages/__tests__/Contact.test.tsx
// Description: Unit test for Contact page component.

import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/testUtils";
import Contact from "../Contact";

describe('Contact Component', () => {
  test("renders Contact component with correct content", () => {
    renderWithProviders(<Contact />);
    expect(screen.getByRole('heading', { name: /contact us/i })).toBeInTheDocument();
    expect(screen.getByText(/Feel free to reach out to us with any questions or feedback./i)).toBeInTheDocument();
  });
});
```

---

## /src/pages/__tests__/Curriculum.test.tsx

```tsx
// File: /src/pages/__tests__/Curriculum.test.tsx
// Description: Unit test for Curriculum page component.

import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/testUtils";
import Curriculum from "../Curriculum";

describe('Curriculum Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Curriculum component with correct content", () => {
    renderWithProviders(<Curriculum />);
    expect(screen.getByRole('heading', { name: /curriculum/i })).toBeInTheDocument();
    expect(screen.getByText(/Our curriculum is designed to adapt to your learning style and pace./i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in with google to get started/i })).toBeInTheDocument();
  });
});
```

---

## /src/pages/__tests__/Features.test.tsx

```tsx
// File: /src/pages/__tests__/Features.test.tsx
// Description: Unit test for Features page component.

import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/testUtils";
import Features from "../Features";

describe('Features Component', () => {
  test("renders Features component with correct content", () => {
    renderWithProviders(<Features />);
    expect(screen.getByText("Features")).toBeInTheDocument();
    expect(screen.getByText("AI-powered learning style assessment")).toBeInTheDocument();
    expect(screen.getByText("Personalized learning paths")).toBeInTheDocument();
    expect(screen.getByText("Real-time progress tracking")).toBeInTheDocument();
    expect(screen.getByText("Interactive dashboard")).toBeInTheDocument();
  });
});
```

---

## /src/pages/__tests__/Home.test.tsx

```tsx
// File: /src/pages/__tests__/Home.test.tsx
// Description: Unit test for Home page component.

import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders, mockLoginWithGoogle } from "../../test/testUtils";
import Home from "../Home";

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Home component with correct content", () => {
    renderWithProviders(<Home />, { withRouter: true });
    expect(screen.getByRole('heading', { name: /welcome to geaux academy/i })).toBeInTheDocument();
    expect(screen.getByText(/empowering personalized learning through ai/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /ready to start your learning journey\?/i })).toBeInTheDocument();
  });

  test("handles Google login", async () => {
    renderWithProviders(<Home />, { withRouter: true });
    const loginButton = screen.getByRole('button', { name: /sign in with google/i });
    
    fireEvent.click(loginButton);
    
    expect(mockLoginWithGoogle).toHaveBeenCalled();
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });
});
```

---

## /src/pages/__tests__/LearningStyles.test.tsx

```tsx
// File: /src/pages/__tests__/LearningStyles.test.tsx
// Description: Unit test for Learning Styles page component.

import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/testUtils";
import LearningStyles from "../LearningStyles";

describe('LearningStyles Component', () => {
  test("renders Learning Styles component with correct content", () => {
    renderWithProviders(<LearningStyles />, { withRouter: true });
    expect(screen.getByText("Learning Styles")).toBeInTheDocument();
    expect(screen.getByText("Discover your preferred learning style and how Geaux Academy can help you learn more effectively.")).toBeInTheDocument();
  });
});
```

---

## /src/pages/styles/Contact.css

```css
.contact-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1rem;
}

.contact-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}
```

---

## /src/server/main.py

```plaintext
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.student_routes import router as student_router

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your Vue.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(student_router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

---

## /src/server/routes/studentRoutes.js

```javascript
const express = require('express');
const router = express.Router();

// ...existing code...

router.post('/students', async (req, res) => {
  try {
    const { name } = req.body;
    // Here you would typically create a new student in your database
    // This is a mock response
    const newStudent = {
      id: Date.now(),
      name,
      createdAt: new Date()
    };
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ error: `Failed to create student profile: ${error.message}` });
  }
});

router.get('/students/:student_id', async (req, res) => {
  try {
    const { student_id } = req.params;
    // Here you would typically fetch the student from your database
    // This is a mock response
    const student = {
      id: student_id,
      name: 'John Doe',
      createdAt: new Date()
    };
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: `Failed to get student profile: ${error.message}` });
  }
});

router.put('/students/:student_id', async (req, res) => {
  try {
    const { student_id } = req.params;
    const { name } = req.body;
    // Here you would typically update the student in your database
    // This is a mock response
    const updatedStudent = {
      id: student_id,
      name,
      createdAt: new Date()
    };
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ error: `Failed to update student profile: ${error.message}` });
  }
});

router.delete('/students/:student_id', async (req, res) => {
  try {
    const { student_id } = req.params;
    // Here you would typically delete the student from your database
    // This is a mock response
    res.status(200).json({ detail: `Student ${student_id} deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: `Failed to delete student profile: ${error.message}` });
  }
});

// ...existing code...

module.exports = router;
```

---

## /src/server/routes/student_routes.py

```plaintext
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
import time

router = APIRouter()

class StudentCreate(BaseModel):
    name: str

class StudentUpdate(BaseModel):
    name: str

class Student(StudentCreate):
    id: int
    created_at: datetime

students_db = {}

@router.post("/students", response_model=Student)
async def create_student(student: StudentCreate):
    try:
        new_student = Student(
            id=int(time.time()),
            name=student.name,
            created_at=datetime.now()
        )
        students_db[new_student.id] = new_student
        return new_student
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to create student profile")

@router.get("/students/{student_id}", response_model=Student)
async def get_student(student_id: int):
    student = students_db.get(student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@router.put("/students/{student_id}", response_model=Student)
async def update_student(student_id: int, student_update: StudentUpdate):
    student = students_db.get(student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    updated_student = Student(id=student_id, name=student_update.name, created_at=student.created_at)
    students_db[student_id] = updated_student
    return updated_student

@router.delete("/students/{student_id}")
async def delete_student(student_id: int):
    student = students_db.pop(student_id, None)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"detail": "Student deleted successfully"}
```

---

## /src/store/index.ts

```typescript
import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './slices/profileSlice';

const store = configureStore({
  reducer: {
    profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
```

---

## /src/store/slices/profileSlice.ts

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Parent, Student } from '../../types/profiles';

interface ProfileState {
  parent: Parent | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  parent: null,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setParentProfile: (state, action: PayloadAction<Parent>) => {
      state.parent = action.payload;
    },
    addStudent: (state, action: PayloadAction<Student>) => {
      if (state.parent) {
        state.parent.students.push(action.payload);
      }
    },
    updateStudent: (state, action: PayloadAction<Student>) => {
      if (state.parent) {
        const index = state.parent.students.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.parent.students[index] = action.payload;
        }
      }
    },
  },
});

export const { setParentProfile, addStudent, updateStudent } = profileSlice.actions;
export default profileSlice.reducer;
```

---

## /src/config/env.js

```javascript
const config = {
  AZURE_ENDPOINT: process.env.REACT_APP_AZURE_ENDPOINT || 'https://ai-geauxacademy8942ai219453410909.openai.azure.com/',
  AZURE_COGNITIVE_ENDPOINT: process.env.REACT_APP_AZURE_COGNITIVE_ENDPOINT || 'https://ai-geauxacademy8942ai219453410909.cognitiveservices.azure.com/',
  AZURE_DEPLOYMENT_ENDPOINT: process.env.REACT_APP_AZURE_DEPLOYMENT_ENDPOINT || 'https://ai-geauxacademy8942ai219453410909.services.ai.azure.com/models',
  MODEL_NAME: process.env.REACT_APP_MODEL_NAME || 'gpt-4',
  AZURE_API_KEY: process.env.REACT_APP_AZURE_API_KEY || process.env.VITE_OPENAI_API_KEY
};

export default config;
```

---

## /src/types/auth.ts

```typescript
import { UserCredential } from 'firebase/auth';

// Common types for auth context and components
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  metadata?: {
    lastSignInTime?: string;
    creationTime?: string;
  };
}

export interface AuthError {
  code?: string;
  message: string;
}

export interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<UserCredential>;
  loginWithGoogle: () => Promise<void>;
  signup: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  setAuthError: (error: string | null) => void;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  parentId: string;
  hasTakenAssessment: boolean;
  createdAt: string;
  updatedAt: string;
  learningStyle?: string;
  assessmentResults?: object;
}

export interface Parent {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  students: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthRouteProps {
  children: React.ReactNode;
}

export interface PrivateRouteProps {
  children: React.ReactNode;
}

declare global {
  interface WindowEventMap {
    'firebase-auth-worker-status': CustomEvent<{
      success: boolean;
      isSecure: boolean;
      supportsServiceWorker: boolean;
      error?: string;
    }>;
    'firebase-auth-error': CustomEvent<{
      error: string;
      fallbackToRedirect?: boolean;
      status?: number;
    }>;
    'firebase-auth-popup-ready': CustomEvent<{
      secure: boolean;
    }>;
    'firebase-auth-success': CustomEvent<{
      status: number;
    }>;
    'firebase-auth-security': CustomEvent<{
      secure: boolean;
    }>;
  }
}

export {};
```

---

## /src/types/css.d.ts

```typescript
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.css' {
  const css: { [key: string]: string };
  export default css;
}
```

---

## /src/types/dashboard.ts

```typescript
export interface StudentProgress {
  completionRate: number;
  timeSpent: number;
  accuracy: number;
  subjectProgress: {
    [subject: string]: {
      completed: number;
      total: number;
    };
  };
}

export interface LearningStyle {
  visual: number;
  auditory: number;
  reading: number;
  kinesthetic: number;
  recommendations: string[];
}

export interface DashboardState {
  activeTab: 'overview' | 'progress' | 'learning-styles' | 'curriculum';
  studentData: {
    progress: StudentProgress;
    learningStyle: LearningStyle;
  } | null;
}
```

---

## /src/types/firebase.d.ts

```typescript
// File: /src/types/firebase.d.ts
// Description: Type declarations for Firebase modules
// Author: GitHub Copilot
// Created: 2024-02-12

declare module 'firebase/app' {
  export * from '@firebase/app';
}

declare module 'firebase/auth' {
  export * from '@firebase/auth';
}

declare module 'firebase/firestore' {
  export * from '@firebase/firestore';
}

declare module 'firebase/analytics' {
  export * from '@firebase/analytics';
}

declare module 'firebase/messaging' {
  export * from '@firebase/messaging';
}
```

---

## /src/types/profiles.ts

```typescript
// Base Types
export interface BaseProfile {
    uid: string;
    email: string;
    displayName: string;
    createdAt: string;
    updatedAt: string;
}

// Parent Profile Types
export interface Parent extends BaseProfile {
    phone?: string;
    students: string[];
}

// Student Profile Types
export interface Student {
    id: string;
    parentId: string;
    name: string;
    grade: string;
    learningStyle?: LearningStyle;
    hasTakenAssessment: boolean;
    assessmentStatus?: string;
    createdAt: string;
    updatedAt: string;
    recommendedActivities?: string[];
    progress?: StudentProgress[];
    assessmentResults?: AssessmentResult[];
}

// Progress Types
export interface StudentProgress {
    courseId: string;
    completed: number;
    total: number;
    lastAccessed: string;
}

// Assessment Types
export interface AssessmentResult {
    date: string;
    score: number;
    subject: string;
    details: Record<string, unknown>;
}

// Learning Style Types
export interface LearningStyle {
    type: 'visual' | 'auditory' | 'kinesthetic' | 'reading/writing';
    strengths: string[];
    recommendations: string[];
}
```

---

## /src/types/service-worker.d.ts

```typescript

```

---

## /src/types/student.ts

```typescript
export interface Student {
  id: string;
  name: string;
  grade?: string;
  age?: number;
  learningStyle?: string;
  hasTakenAssessment: boolean;
  progress?: Array<{
    id: string;
    type: string;
    name: string;
    date: string;
  }>;
  recommendedActivities?: string[];
  createdAt?: string;
  updatedAt?: string;
  parentId: string;
}
```

---

## /src/types/styled.d.ts

```typescript
import 'styled-components';
import { Theme } from '@mui/material/styles';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {
    breakpoints: Theme['breakpoints'] & {
      mobile: string;
      tablet: string;
      desktop: string;
      large: string;
    };
    spacing: Theme['spacing'] & {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    colors: {
      border: string;
      text: string;
      background: {
        hover: string;
      };
      error: {
        main: string;
        light: string;
      };
    };
    borderRadius: {
      default: string;
    };
  }
}
```

---

## /src/types/types.ts

```typescript
// File: /types/types.ts
// Description: Core type definitions for user profiles, assessments, and course progress
// Author: Geaux Academy Team
// Created: 2024
export interface ParentProfile {
  uid: string;
  email: string;
  displayName: string;
  students: StudentProfile[];
}

export interface StudentProfile {
  id: string;
  parentId: string;
  firstName: string;
  lastName: string;
  age: number;
  grade: string;
  learningStyle?: LearningStyle;
  assessmentResults?: AssessmentResult[];
  progress?: CourseProgress[];
}

export interface LearningStyle {
  type: 'visual' | 'auditory' | 'kinesthetic' | 'reading/writing';
  strengths: string[];
  recommendations: string[];
}

export interface AssessmentResult {
  date: string;
  score: number;
  subject: string;
  details: Record<string, unknown>;
}

export interface CourseProgress {
  courseId: string;
  completed: number;
  total: number;
  lastAccessed: string;
}
```

---

## /src/types/userTypes.ts

```typescript
export interface BaseProfile {
  uid: string;
  email: string;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ParentProfile extends BaseProfile {
  role: 'parent';
  phone?: string;
  students: StudentProfile[];
}

export interface StudentProfile extends BaseProfile {
  role: 'student';
  parentId: string;
  grade: string;
  dateOfBirth: Date;
}
```

---

## /src/services/api.js

```javascript
import axios from 'axios';

import { auth } from '../firebase/config';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://learn.geaux.app',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 second timeout
  withCredentials: true // Enable sending cookies in cross-origin requests
});

// Add request interceptor for auth headers
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const token = await user.getIdToken(true); // Get a fresh token
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error("Error refreshing token:", error);
        localStorage.removeItem('token');
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor with enhanced error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle unauthorized errors and try token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const user = auth.currentUser;
        if (user) {
          const newToken = await user.getIdToken(true);
          localStorage.setItem('token', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed. Logging out...", refreshError);
        localStorage.removeItem('token');
        window.location.href = '/login'; // Redirect to login
      }
    }

    // Handle other error cases
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      request: error.request,
      message: error.message
    });

    // Enhanced error handling
    let errorMessage = "An error occurred. Please try again.";
    switch (error.response?.status) {
      case 400:
        errorMessage = "Bad request. Please check your input.";
        break;
      case 403:
        errorMessage = "You don't have permission to perform this action.";
        break;
      case 404:
        errorMessage = "The requested resource was not found.";
        break;
      case 500:
        errorMessage = "Internal server error. Please try again later.";
        break;
      case 503:
        errorMessage = "Service unavailable. Please try again later.";
        break;
      default:
        errorMessage = `Error: ${error.message}`;
    }

    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
```

---

## /src/services/cheshireService.ts

```typescript
import axios, { AxiosInstance } from 'axios';
import { auth } from '../firebase/config';

// Use environment variable if set, otherwise fall back to the production URL
const CHESHIRE_API_URL = import.meta.env.VITE_CHESHIRE_API_URL || 'https://cheshire.geaux.app';
const CHESHIRE_DEBUG = import.meta.env.VITE_CHESHIRE_DEBUG === 'true';

// Create axios instance with default configuration
const cheshireAxios: AxiosInstance = axios.create({
  baseURL: CHESHIRE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true,
  timeout: 30000
});

// Add authentication interceptor
cheshireAxios.interceptors.request.use(async (config) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error('Auth interceptor error:', error);
    return Promise.reject(error);
  }
});

// Add response interceptor for better error handling
cheshireAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (CHESHIRE_DEBUG) {
      console.error('Cheshire API Error:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
    }

    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - Unable to connect to Cheshire API:', error);
      console.error('Please ensure the TIPI container is running and accessible at:', CHESHIRE_API_URL);
    }
    return Promise.reject(error);
  }
);

interface CheshireResponse {
  text: string;
  response: string;
  memories?: Array<{
    metadata?: {
      learning_style?: string;
    };
  }>;
}

interface CheshireUser {
  username: string;
  permissions: {
    CONVERSATION: string[];
    MEMORY: string[];
    STATIC: string[];
    STATUS: string[];
  };
}

interface AuthResponse {
  access_token: string;
  token_type: string;
}

interface CheshireError {
  message: string;
  code?: string;
  response?: {
    status: number;
    data: unknown;
  };
  config?: {
    url: string;
    method: string;
    headers: Record<string, string>;
  };
}

export class CheshireService {
  private static async getAuthHeaders() {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Authentication required');
    }
    const token = await user.getIdToken();
    return {
      Authorization: `Bearer ${token}`
    };
  }

  private static async getFirebaseToken(): Promise<string | null> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user logged in');
      }
      return await user.getIdToken();
    } catch (error) {
      console.error('Error getting Firebase token:', error);
      return null;
    }
  }

  static async checkTipiHealth(): Promise<{ status: string; version: string }> {
    try {
      const response = await cheshireAxios.get('/');
      return {
        status: 'healthy',
        version: response.data.version || 'unknown'
      };
    } catch (error) {
      const err = error as CheshireError;
      console.error('TIPI health check failed:', err);
      if (err.code === 'ERR_NETWORK') {
        throw new Error('TIPI container is not accessible. Please ensure it is running.');
      }
      throw err;
    }
  }

  static async initialize(): Promise<void> {
    try {
      // Check TIPI container health
      await this.checkTipiHealth();
      
      console.log('✅ Cheshire Cat service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Cheshire Cat service:', error);
      throw error;
    }
  }

  static async checkConnection(): Promise<boolean> {
    try {
      const headers = await this.getAuthHeaders();
      await cheshireAxios.get('/', { headers });
      return true;
    } catch (error) {
      console.error('Cheshire API Connection Error:', error);
      return false;
    }
  }

  static async sendChatMessage(message: string, userId: string, chatId: string) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await cheshireAxios.post<CheshireResponse>(
        '/message',
        { text: message },
        { headers }
      );
      
      return {
        data: response.data.response,
        memories: response.data.memories
      };
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw this.getErrorMessage(error);
    }
  }

  static async createCheshireUser(firebaseUid: string, email: string): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      const payload: CheshireUser = {
        username: email,
        permissions: {
          CONVERSATION: ["WRITE", "EDIT", "LIST", "READ", "DELETE"],
          MEMORY: ["READ", "LIST"],
          STATIC: ["READ"],
          STATUS: ["READ"]
        }
      };

      await cheshireAxios.post('/users/', payload, { headers });
    } catch (error) {
      console.error('Error creating Cheshire user:', error);
      throw this.getErrorMessage(error);
    }
  }

  static getErrorMessage(error: CheshireError): string {
    if (error.message === 'Authentication required') {
      return "Please log in to continue.";
    }
    if (error.message === 'Failed to obtain Cheshire auth token') {
      return "Unable to connect to the chat service. Please try again later.";
    }
    if (error.code === 'ECONNABORTED') {
      return "The request timed out. Please try again.";
    }
    if (error.code === 'ERR_NETWORK') {
      if (error.message.includes('CORS')) {
        return "Unable to connect to the chat service due to CORS restrictions. Please contact support.";
      }
      return "Network error - Unable to connect to the chat service. Please check your connection and try again.";
    }
    if (error.response?.status === 401) {
      return "Your session has expired. Please try again.";
    }
    if (error.response?.status === 403) {
      return "You don't have permission to perform this action.";
    }
    if (error.response?.status === 404) {
      return "The chat service is not available. Please check if the service is running.";
    }
    return "Sorry, I'm having trouble connecting to the chat service. Please try again later.";
  }
}
```

---

## /src/services/firestore.ts

```typescript
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export async function getData(collectionName: string, docId: string) {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
}

export async function setData(collectionName: string, docId: string, data: any) {
  const docRef = doc(db, collectionName, docId);
  await setDoc(docRef, data, { merge: true });
  return true;
}

// ...other helper functions as needed...
```

---

## /src/services/openai.js

```javascript
import axios from 'axios';

const openaiClient = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

export default openaiClient;
```

---

## /src/services/profileService.ts

```typescript
import { db } from '../firebase/config';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { Parent, Student, LearningStyle } from "../types/profiles";

// Cache for storing profiles
const profileCache = new Map();

// Helper to check online status
const isOnline = () => navigator.onLine;

// Helper to handle offline errors
const handleOfflineError = (operation: string) => {
  const error = new Error(`Cannot ${operation} while offline`);
  error.name = 'OfflineError';
  return error;
};

// ✅ Create Parent Profile
export const createParentProfile = async (parentData: Partial<Parent>): Promise<string> => {
  try {
    if (!parentData.uid) throw new Error('User ID is required');
    
    const parentRef = doc(db, 'parents', parentData.uid);
    await setDoc(parentRef, {
      ...parentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      students: []
    });
    
    console.log('✅ Parent profile created successfully:', parentData.uid);
    return parentData.uid;
  } catch (error) {
    console.error('❌ Error creating parent profile:', error);
    throw error;
  }
};

// ✅ Fetch Parent Profile
export const getParentProfile = async (userId: string): Promise<Parent | null> => {
  try {
    console.log('🔍 Fetching parent profile for:', userId);

    // Check cache first
    if (profileCache.has(`parent_${userId}`)) {
      return profileCache.get(`parent_${userId}`);
    }

    const docRef = doc(db, 'parents', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      const parentProfile: Parent = {
        uid: data.uid || userId,
        email: data.email || '',
        displayName: data.displayName || '',
        students: data.students || [],
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString()
      };
      console.log('✅ Parent profile found:', parentProfile);
      // Cache the result
      profileCache.set(`parent_${userId}`, parentProfile);
      return parentProfile;
    }
    
    console.log('ℹ️ No parent profile found, creating one...');
    // If no profile exists, create one
    await createParentProfile({ uid: userId });
    return getParentProfile(userId); // Retry fetch after creation
    
  } catch (error) {
    if (!isOnline()) {
      console.warn('Offline: Using cached data if available');
      return profileCache.get(`parent_${userId}`) || null;
    }
    console.error('❌ Error fetching parent profile:', error);
    throw error;
  }
};

// ✅ Fetch Student Profile
export const getStudentProfile = async (studentId: string): Promise<Student> => {
  try {
    // Check cache first
    if (profileCache.has(`student_${studentId}`)) {
      return profileCache.get(`student_${studentId}`);
    }

    const studentRef = doc(db, "students", studentId);
    const studentDoc = await getDoc(studentRef);

    if (!studentDoc.exists()) {
      throw new Error("Student profile not found");
    }

    const studentData = studentDoc.data() as Student;
    // Cache the result
    profileCache.set(`student_${studentId}`, studentData);
    return studentData;
  } catch (error) {
    if (!isOnline()) {
      console.warn('Offline: Using cached data if available');
      return profileCache.get(`student_${studentId}`) || null;
    }
    throw error;
  }
};

// ✅ Add Student Profile
export const addStudentProfile = async (parentId: string, studentData: {
  name: string;
  grade: string;
  parentId: string;
  hasTakenAssessment: boolean;
}) => {
  try {
    console.log('📝 Adding student profile for parent:', parentId);
    
    // Add the student to the students collection
    const studentRef = await addDoc(collection(db, 'students'), {
      ...studentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Update the parent's students array
    const parentRef = doc(db, 'parents', parentId);
    const parentDoc = await getDoc(parentRef);

    if (parentDoc.exists()) {
      const currentStudents = parentDoc.data().students || [];
      await updateDoc(parentRef, {
        students: [...currentStudents, studentRef.id],
        updatedAt: new Date().toISOString()
      });
    }

    console.log('✅ Student profile added successfully:', studentRef.id);
    return studentRef.id;
  } catch (error) {
    console.error('❌ Error adding student profile:', error);
    throw error;
  }
};

// ✅ Update Student's Assessment Status
export const updateStudentAssessmentStatus = async (studentId: string, status: string) => {
  if (!isOnline()) {
    throw handleOfflineError('update assessment status');
  }

  const studentRef = doc(db, "students", studentId);
  try {
    await updateDoc(studentRef, {
      hasTakenAssessment: status === 'completed',
      assessmentStatus: status,
      updatedAt: new Date().toISOString(),
    });

    // Update cache
    const cachedData = profileCache.get(`student_${studentId}`);
    if (cachedData) {
      profileCache.set(`student_${studentId}`, {
        ...cachedData,
        hasTakenAssessment: status === 'completed',
        assessmentStatus: status,
        updatedAt: new Date().toISOString()
      });
    }
    console.log(`Assessment status updated to: ${status}`);
  } catch (error) {
    console.error("Error updating assessment status:", error);
    throw new Error("Failed to update assessment status");
  }
};

// ✅ Save Learning Style
export const saveLearningStyle = async (studentId: string, learningStyle: LearningStyle): Promise<void> => {
  if (!isOnline()) {
    throw handleOfflineError('save learning style');
  }

  try {
    console.log('📝 Saving learning style for student:', studentId);
    const studentRef = doc(db, 'students', studentId);
    
    await updateDoc(studentRef, {
      learningStyle,
      updatedAt: new Date().toISOString()
    });

    // Update cache
    const cachedData = profileCache.get(`student_${studentId}`);
    if (cachedData) {
      profileCache.set(`student_${studentId}`, {
        ...cachedData,
        learningStyle,
        updatedAt: new Date().toISOString()
      });
    }
    
    console.log('✅ Learning style saved successfully');
  } catch (error) {
    console.error('❌ Error saving learning style:', error);
    throw error;
  }
};

// Listen for online/offline events to manage cache
window.addEventListener('online', () => {
  console.info('Back online. Syncing data...');
  // Could add sync logic here if needed
});

window.addEventListener('offline', () => {
  console.warn('Gone offline. Using cached data...');
});

export class ProfileService {
  async getUserProfile(userId: string): Promise<any> {
    // ...existing API call logic...
    // Example:
    const response = await fetch(`/api/profiles/${userId}`);
    return response.json();
  }
}
```

---

## /src/theme/index.tsx

```tsx
// File: /src/theme/index.ts
// Description: Custom theme including breakpoint helpers

export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";

interface CustomBreakpoints {
  mobile: string;
  tablet: string;
  desktop: string;
  large: string;
  keys: (number | Breakpoint)[];
  up: (key: number | Breakpoint) => string;
  down: (key: number | Breakpoint) => string;
  between: (start: number | Breakpoint, end: number | Breakpoint) => string;
  only: (key: number | Breakpoint) => string;
}

export const breakpoints: CustomBreakpoints = {
  mobile: "0px",
  tablet: "768px",
  desktop: "1024px",
  large: "1440px",
  keys: ["xs", "sm", "md", "lg", "xl"],
  up: (key: number | Breakpoint) => {
    // implement using a strategy that works for both numbers and defined breakpoints
    // For simplicity, if key is number then convert to string with px otherwise use a mapping.
    if (typeof key === "number") {
      return `${key}px`;
    }
    const values: Record<Breakpoint, number> = { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 };
    return `${values[key]}px`;
  },
  down: (key: number | Breakpoint) => {
    if (typeof key === "number") {
      return `${key}px`;
    }
    const values: Record<Breakpoint, number> = { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 };
    return `${values[key]}px`;
  },
  between: (start: number | Breakpoint, end: number | Breakpoint) => {
    const getValue = (v: number | Breakpoint): number =>
      typeof v === "number" ? v : ({ xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 }[v]);
    return `${getValue(start)}px and ${getValue(end)}px`;
  },
  only: (key: number | Breakpoint) => {
    if (typeof key === "number") return `${key}px`;
    const values: Record<Breakpoint, number> = { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 };
    return `${values[key]}px`;
  }
};
```

---

## /src/theme/theme.js

```javascript
import { createTheme } from '@mui/material/styles';

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#C29A47', // Primary gold
      dark: '#9E7D39', // Darker gold for hover states
      light: '#D4B673', // Lighter gold for accents
    },
    secondary: {
      main: '#8C6B4D', // Deep gold accent
      dark: '#725640', // Darker accent for hover states
      light: '#A68B74', // Lighter accent
    },
    background: {
      default: '#F5F3F0', // Neutral background
      paper: '#FFF8E7',   // Highlight background
    },
    text: {
      primary: '#000000', // Black
      secondary: '#666666', // Secondary text
    },
    error: {
      main: '#E74C3C',
      dark: '#C0392B',
    },
    warning: {
      main: '#F1C40F',
      dark: '#D4AC0D',
    },
    info: {
      main: '#3498DB',
      dark: '#2980B9',
    },
    success: {
      main: '#2ECC71',
      dark: '#27AE60',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
  },
  breakpoints: {
    values: {
      xs: 320,
      sm: 768,
      md: 1024,
      lg: 1200,
      xl: 1536,
    },
  },
  spacing: 4, // This will multiply the spacing by 4px (MUI's default spacing unit)
});

// Create styled-components theme with the same values
export const styledTheme = {
  palette: {
    ...muiTheme.palette,
  },
  breakpoints: {
    ...muiTheme.breakpoints.values,
  },
  spacing: (factor) => `${0.25 * factor}rem`, // Keep rem units for styled-components
};
```

---

## /src/theme/theme.ts

```typescript
// File: /src/theme/theme.ts
// Description: Unified theme configuration for MUI and styled-components
// Author: GitHub Copilot
// Created: 2024-02-12

import { createTheme } from '@mui/material/styles';
import type { DefaultTheme } from 'styled-components';

// Create the base MUI theme
export const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#C29A47', // Primary gold
      dark: '#9E7D39', // Darker gold for hover states
      light: '#D4B673', // Lighter gold for accents
    },
    secondary: {
      main: '#8C6B4D', // Deep gold accent
      dark: '#725640', // Darker accent for hover states
      light: '#A68B74', // Lighter accent
    },
    background: {
      default: '#F5F3F0', // Neutral background
      paper: '#FFF8E7',   // Highlight background
    },
    text: {
      primary: '#000000', // Black
      secondary: '#666666', // Secondary text
    },
    error: {
      main: '#E74C3C',
      dark: '#C0392B',
      light: '#F9EBEA',
    },
    warning: {
      main: '#F1C40F',
      dark: '#D4AC0D',
      light: '#FEF9E7',
    },
    info: {
      main: '#3498DB',
      dark: '#2980B9',
      light: '#EBF5FB',
    },
    success: {
      main: '#2ECC71',
      dark: '#27AE60',
      light: '#E8F8F5',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
  },
  breakpoints: {
    values: {
      xs: 320,
      sm: 768,
      md: 1024,
      lg: 1200,
      xl: 1536,
    },
  },
  spacing: 4, // Base spacing unit (4px)
});

// Create spacing utility that returns rem values
const createSpacing = () => {
  const spacingFn = (value: number): string => `${0.25 * value}rem`;
  return Object.assign(spacingFn, {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '2rem',     // 32px
    xl: '3rem',     // 48px
  });
};

// Create the styled-components theme that extends MUI theme
export const styledTheme: DefaultTheme = {
  ...muiTheme,
  breakpoints: {
    ...muiTheme.breakpoints,
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    large: '1440px',
  },
  spacing: createSpacing(),
  colors: {
    border: '#e0e0e0',
    text: muiTheme.palette.text.primary,
    background: {
      hover: '#f5f5f5',
    },
    error: {
      main: muiTheme.palette.error.main,
      light: muiTheme.palette.error.light,
    },
  },
  borderRadius: {
    default: '4px',
  },
};
```

---

## /src/components/CourseCard.tsx

```tsx
import React from "react";
import { FaVideo, FaListAlt, FaBrain } from "react-icons/fa";
import Card from "./common/Card";
import styled from "styled-components";

interface CourseCardProps {
  title: string;
  type: "Video Animated" | "Quiz" | "Mind Map";
  category: string;
}

const iconMap = {
  "Video Animated": <FaVideo style={{ color: "#9333ea" }} />,
  "Quiz": <FaListAlt style={{ color: "#eab308" }} />,
  "Mind Map": <FaBrain style={{ color: "#ec4899" }} />,
};

const StyledCard = styled(Card)`
  border-left: 4px solid ${props => props.theme.palette.primary.main};
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const IconWrapper = styled.div`
  font-size: 1.875rem;
`;

const CategoryText = styled.p`
  color: ${props => props.theme.palette.text.secondary};
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const CourseCard: React.FC<CourseCardProps> = ({ title, type, category }) => {
  return (
    <StyledCard title={title} description={type}>
      <IconWrapper>{iconMap[type]}</IconWrapper>
      <CategoryText>{category}</CategoryText>
    </StyledCard>
  );
};

export default CourseCard;
```

---

## /src/components/GoogleLoginButton.test.tsx

```tsx
/** @jest-environment jsdom */
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../test/testUtils';
import GoogleLoginButton from './GoogleLoginButton';

describe('GoogleLoginButton', () => {
  const mockHandleGoogleLogin = jest.fn();
  const mockDismissError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders sign in button with correct accessibility', () => {
    renderWithProviders(<GoogleLoginButton handleGoogleLogin={mockHandleGoogleLogin} />);
    expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument();
  });

  it('shows loading state when loading prop is true', () => {
    renderWithProviders(<GoogleLoginButton handleGoogleLogin={mockHandleGoogleLogin} loading={true} />);
    const button = screen.getByRole('button', { name: /signing in/i });
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Signing in...');
  });

  it('displays error message with dismiss button', () => {
    const errorMessage = 'Test error message';
    renderWithProviders(
      <GoogleLoginButton 
        handleGoogleLogin={mockHandleGoogleLogin} 
        error={errorMessage}
        onDismissError={mockDismissError} 
      />
    );
    
    expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
    expect(screen.getByRole('button', { name: /dismiss error/i })).toBeInTheDocument();
  });

  it('calls onDismissError when dismiss button is clicked', async () => {
    const errorMessage = 'Test error message';
    renderWithProviders(
      <GoogleLoginButton 
        handleGoogleLogin={mockHandleGoogleLogin} 
        error={errorMessage}
        onDismissError={mockDismissError} 
      />
    );
    
    fireEvent.click(screen.getByRole('button', { name: /dismiss error/i }));
    await waitFor(() => {
      expect(mockDismissError).toHaveBeenCalledTimes(1);
    });
  });

  it('calls handleGoogleLogin when sign in button is clicked', async () => {
    renderWithProviders(<GoogleLoginButton handleGoogleLogin={mockHandleGoogleLogin} />);
    fireEvent.click(screen.getByRole('button', { name: /sign in with google/i }));
    await waitFor(() => {
      expect(mockHandleGoogleLogin).toHaveBeenCalled();
    });
  });
});
```

---

## /src/components/GoogleLoginButton.tsx

```tsx
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import React from 'react';
import styled from 'styled-components';
import { FcGoogle } from 'react-icons/fc';

interface GoogleLoginButtonProps {
  handleGoogleLogin: () => Promise<void>;
  loading?: boolean;
  error?: string;
  onDismissError?: () => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  handleGoogleLogin,
  loading = false,
  error,
  onDismissError
}): JSX.Element => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  const handleClick = async (): Promise<void> => {
    try {
      await signInWithPopup(auth, provider);
      await handleGoogleLogin();
    } catch (err) {
      console.error('Google login error:', err);
    }
  };

  return (
    <ButtonContainer>
      {error && (
        <ErrorMessage role="alert">
          <span>{error}</span>
          {onDismissError && (
            <DismissButton 
              onClick={onDismissError}
              aria-label="dismiss error"
            >
              ✕
            </DismissButton>
          )}
        </ErrorMessage>
      )}
      <LoginButton 
        onClick={handleClick}
        disabled={loading}
        aria-label={loading ? 'Signing in...' : 'Sign in with Google'}
      >
        <FcGoogle />
        {loading ? 'Signing in...' : 'Sign in with Google'}
      </LoginButton>
    </ButtonContainer>
  );
};

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
`;

const LoginButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.palette.divider};
  border-radius: 4px;
  background: white;
  color: ${({ theme }) => theme.palette.text.primary};
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.palette.action?.hover || '#f5f5f5'};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.palette.error.light};
  color: ${({ theme }) => theme.palette.error.main};
  border-radius: 4px;
  font-size: 0.875rem;
`;

const DismissButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  margin-left: ${({ theme }) => theme.spacing.sm};

  &:hover {
    opacity: 0.8;
  }
`;

export default GoogleLoginButton;
```

---

## /src/components/HomeContainer.js

```javascript
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const HomeContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (max-width: 768px) {
    padding: 0 0.5rem;
    h2 { 
      font-size: 1.5rem; 
    }
  }
`;

export const StyledLink = styled(Link).attrs(({ disabled }) => ({
  role: 'button',
  'aria-disabled': disabled,
}))`
  display: inline-block;
  padding: 1rem 2rem;
  background: var(--primary-color);
  color: white;
  border-radius: 4px;
  font-size: 1.1rem;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: var(--secondary-color);
  }

  &:focus-visible {
    outline: 2px dashed var(--secondary-color);
    outline-offset: 4px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
```

---

## /src/components/Login.tsx

```tsx
import React, { useState } from 'react';
import { useLocation, Location, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { FcGoogle } from 'react-icons/fc';

interface LocationState {
  from?: {
    pathname: string;
  };
  error?: string;
}

const Login: React.FC = (): JSX.Element => {
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as Location & { state: LocationState };
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setLoading(true);
      await login();
      navigate('/dashboard');
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      setLoading(true);
      await login();
      navigate('/dashboard');
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <LoginBox>
        <Title>Welcome Back</Title>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {location.state?.error && (
          <ErrorMessage>{location.state.error}</ErrorMessage>
        )}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input 
              type="email" 
              id="email" 
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input 
              type="password" 
              id="password" 
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </FormGroup>

          <LoginButton type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </LoginButton>
        </Form>

        <Divider>or</Divider>

        <GoogleButton onClick={handleGoogleLogin} disabled={loading}>
          <FcGoogle className="text-xl" />
          Sign in with Google
        </GoogleButton>
      </LoginBox>
    </Container>
  );
};

// Styled components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--background);
  padding: 1rem;
`;

const LoginBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  text-align: center;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: var(--text-color);
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  &:disabled {
    background-color: #f5f5f5;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--primary-dark);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  margin: 1.5rem 0;
  text-align: center;
  position: relative;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 45%;
    height: 1px;
    background-color: #ddd;
  }
  
  &::before {
    left: 0;
  }
  
  &::after {
    right: 0;
  }
`;

const GoogleButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  color: var(--text-color);
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8f8f8;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  background-color: #fee2e2;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

export default Login;
```

---

## /src/components/Message.tsx

```tsx
import React from 'react';
import styled from 'styled-components';

interface MessageProps {
  sender: 'user' | 'bot';
  children: React.ReactNode;
}

const Message: React.FC<MessageProps> = ({ sender, children }) => {
  return (
    <MessageContainer $sender={sender}>
      {children}
    </MessageContainer>
  );
};

const MessageContainer = styled.div<{ $sender: 'user' | 'bot' }>`
  margin: var(--spacing-xs) 0;
  padding: var(--spacing-sm);
  max-width: 80%;
  background: ${({ $sender }) => ($sender === 'user' ? "var(--accent-color)" : "var(--white)")};
  color: ${({ $sender }) => ($sender === 'user' ? "var(--white)" : "var(--text-color)")};
  border-radius: var(--border-radius);
  align-self: ${({ $sender }) => ($sender === 'user' ? "flex-end" : "flex-start")};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

export default Message;
```

---

## /src/components/Mission.tsx

```tsx
import styled from 'styled-components';
import React from 'react';

const MissionContainer = styled.div`
  max-width: 800px;
  margin: auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const MissionText = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  color: #444;
`;

interface MissionProps {
  text: string;
}

export const Mission: React.FC<MissionProps> = ({ text }) => {
  return (
    <MissionContainer>
      <MissionText>{text}</MissionText>
    </MissionContainer>
  );
};

export default Mission;
```

---

## /src/components/PrivateRoute.tsx

```tsx
// File: /src/components/PrivateRoute.tsx
// Description: A route component that protects routes from unauthorized access
// Author: GitHub Copilot

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './common/LoadingSpinner';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: rgba(255, 255, 255, 0.8);
`;

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }): JSX.Element => {
  const { currentUser, isAuthReady } = useAuth();
  const location = useLocation();

  // Show loading spinner while auth state is being determined
  if (!isAuthReady) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  // If not authenticated, redirect to login with current location
  if (!currentUser && isAuthReady) {
    // Only redirect if we're not already on the login page
    if (location.pathname !== '/login') {
      return (
        <Navigate 
          to="/login" 
          state={{ 
            from: location,
            error: "Please sign in to access this page" 
          }} 
          replace 
        />
      );
    }
  }

  // If authenticated, render the protected route
  return <>{children}</>;
};

export default PrivateRoute;
```

---

## /src/components/UserProfileCard.tsx

```tsx
import React from 'react';
import Card from '../common/Card';

interface UserProfileCardProps {
  username: string;
  role: string;
  avatar?: string;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ username, role, avatar }) => {
  return (
    <Card
      title="User Profile"
      icon={avatar}
      className="user-profile-card"
    >
      <div className="user-info">
        <label>Username:</label>
        <p>{username}</p>
      </div>
      <div className="user-info">
        <label>Role:</label>
        <p>{role}</p>
      </div>
    </Card>
  );
};

export default UserProfileCard;
```

---

## /src/components/layout/Footer.tsx

```tsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './layout.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles['footer-content']}>
        <div className={styles['footer-column']}>
          <h3>About</h3>
          <ul className={styles['footer-links']}>
            <li><Link to="/about">Our Story</Link></li>
            <li><Link to="/features">Features</Link></li>
            <li><Link to="/curriculum">Curriculum</Link></li>
          </ul>
        </div>

        <div className={styles['footer-column']}>
          <h3>Learning</h3>
          <ul className={styles['footer-links']}>
            <li><Link to="/learning-styles">Learning Styles</Link></li>
            <li><Link to="/learning-plan">Learning Plan</Link></li>
            <li><Link to="/assessment">Assessment</Link></li>
          </ul>
        </div>

        <div className={styles['footer-column']}>
          <h3>Support</h3>
          <ul className={styles['footer-links']}>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><a href="mailto:support@geauxacademy.com">Email Support</a></li>
            <li><Link to="/help">Help Center</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```

---

## /src/components/layout/Header.tsx

```tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import styles from './layout.module.css';

const Header = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  
  return (
    <header className={styles.header}>
      <div className={styles.navigation}>
        <Link to="/">
          <img src="/images/logo.svg" alt="Geaux Academy Logo" height="50" />
        </Link>
        
        <nav>
          <ul className={styles['navigation-list']}>
            <li>
              <Link to="/" className={location.pathname === '/' ? styles.active : ''}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className={location.pathname === '/about' ? styles.active : ''}>
                About
              </Link>
            </li>
            <li>
              <Link to="/features" className={location.pathname === '/features' ? styles.active : ''}>
                Features
              </Link>
            </li>
            <li>
              <Link to="/curriculum" className={location.pathname === '/curriculum' ? styles.active : ''}>
                Curriculum
              </Link>
            </li>
            <li>
              <Link to="/contact" className={location.pathname === '/contact' ? styles.active : ''}>
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <div className="auth-buttons">
          {!currentUser ? (
            <>
              <Button to="/login" className="btn btn-secondary">Login</Button>
              <Button to="/signup" className="btn btn-primary">Sign Up</Button>
            </>
          ) : (
            <Button to="/dashboard" className="btn btn-primary">Dashboard</Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
```

---

## /src/components/layout/Layout.tsx

```tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/global.css';

const Layout = () => {
  const { currentUser } = useAuth();

  return (
    <LayoutWrapper>
      <Header />
      <PageContainer>
        <Outlet />
      </PageContainer>
      <Footer />
    </LayoutWrapper>
  );
};

const LayoutWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: var(--header-height);
`;

const PageContainer = styled.main`
  flex: 1;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--spacing-lg);
  width: 100%;
  text-align: center;

  @media (max-width: 768px) {
    padding: var(--spacing-sm);
  }
`;

export default Layout;
```

---

## /src/components/layout/Navigation.tsx

```tsx
import React from "react";
import { Link } from "react-router-dom";
import './styles/Navigation.css';

const Navigation = () => {
  return (
    <nav className="flex space-x-6 text-lg font-medium">
      <Link to="/" className="hover:underline">Home</Link>
      <Link to="/about" className="hover:underline">About Us</Link>
      <Link to="/curriculum" className="hover:underline">Curriculum</Link>
      <Link to="/learning-styles" className="hover:underline">Learning Styles</Link>
      <Link to="/contact" className="hover:underline">Contact Us</Link>
    </nav>
  );
};

export default Navigation;
```

---

## /src/components/layout/Sidebar.tsx

```tsx
// src/components/SomeComponent.tsx

import React from 'react';

const SomeComponent: React.FC = () => {
  return (
    <div>
      <h1>Hello, World!</h1>
    </div>
  );
};

export default SomeComponent;
```

---

## /src/components/layout/layout.module.css

```css
/* Layout Components */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 1rem;
}

.navigation {
  max-width: var(--max-width);
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 var(--spacing-md);
  height: 100%;
}

.navigation-list {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.navigation-list a {
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius);
  transition: color 0.2s, background-color 0.2s;
}

.navigation-list a:hover {
  color: var(--primary-color);
  background-color: var(--light-bg);
}

.navigation-list a.active {
  color: var(--primary-color);
}

.auth-buttons {
  display: flex;
  gap: var(--spacing-sm);
}

.footer {
  background: var(--primary-color);
  color: var(--white);
  padding: var(--spacing-lg) 0;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.footer-column h3 {
  margin-bottom: var(--spacing-md);
}

.footer-links {
  list-style: none;
}

.footer-links li {
  margin-bottom: var(--spacing-sm);
}

.footer-links a {
  color: var(--white);
  text-decoration: none;
  transition: opacity 0.2s;
}

.footer-links a:hover {
  opacity: 0.8;
}

/* Mobile Navigation */
@media (max-width: 768px) {
  .navigation-list {
    display: none;
  }

  .navigation-list.active {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: var(--header-height);
    left: 0;
    right: 0;
    background: var(--white);
    padding: var(--spacing-md);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--white);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.modal-body {
  margin-bottom: var(--spacing-md);
}

/* Toast */
.toast {
  position: fixed;
  bottom: var(--spacing-lg);
  right: var(--spacing-lg);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  color: var(--white);
  animation: slideIn 0.3s ease-in-out;
  z-index: 1000;
}

.toast-info { background-color: var(--accent-color); }
.toast-success { background-color: #10b981; }
.toast-error { background-color: var(--secondary-color); }
.toast-warning { background-color: #f59e0b; }

/* Loading Spinner */
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: rgba(255, 255, 255, 0.8);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Card Components */
.card {
  background: var(--white);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  margin: var(--spacing-sm);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.card-icon {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: var(--spacing-sm);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: var(--spacing-xs);
}

.card-description {
  color: var(--text-color);
  line-height: var(--line-height);
}

.card-list {
  list-style-position: inside;
  color: var(--text-color);
  line-height: var(--line-height);
}

.card-list li {
  margin-bottom: var(--spacing-xs);
}

@media (max-width: 768px) {
  .card {
    padding: var(--spacing-md);
  }
}

/* Student Card Styles */
.student-card {
  background: var(--white);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: var(--spacing-md);
}

.student-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: var(--spacing-xs);
}

.student-info {
  color: var(--text-color);
  margin-bottom: var(--spacing-sm);
}

.assessment-status {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 500;
}

.status-complete {
  background-color: #10b981;
  color: var(--white);
}

.status-pending {
  background-color: #f59e0b;
  color: var(--white);
}

/* Animations */
@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

---

## /src/components/common/Button.tsx

```tsx
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  to?: string;
  $variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ to, children, $variant = 'primary', ...props }) => {
  const className = `btn btn-${$variant}`;
  
  if (to) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <StyledButton className={className} {...props}>
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button`
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default Button;
```

---

## /src/components/common/Card.tsx

```tsx
import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: IconProp | string;
  title?: string;
  description?: string | string[];
  className?: string;
  onClick?: () => void;
}

const Card = forwardRef<HTMLDivElement, CardProps>(({
  icon,
  title,
  description,
  children,
  className,
  onClick,
  ...props
}, ref) => {
  const isImagePath = typeof icon === 'string' && (icon.startsWith('/') || icon.startsWith('http'));
  
  return (
    <StyledCard 
      ref={ref}
      className={className} 
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {icon && (
        <IconContainer>
          {isImagePath ? (
            <img 
              src={icon} 
              alt={title || 'Card icon'}
              crossOrigin={icon.startsWith('http') ? "anonymous" : undefined}
            />
          ) : (
            typeof icon === 'object' && <FontAwesomeIcon icon={icon} />
          )}
        </IconContainer>
      )}
      {title && <CardTitle>{title}</CardTitle>}
      {description && (
        Array.isArray(description) ? (
          <CardList>
            {description.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </CardList>
        ) : (
          <CardDescription>{description}</CardDescription>
        )
      )}
      {children}
    </StyledCard>
  );
});

Card.displayName = 'Card';

const StyledCard = styled.div`
  background: ${({ theme }) => theme.palette.background.paper};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: ${({ theme }) => theme.spacing.lg};
  cursor: ${props => props.onClick ? 'pointer' : 'default'};
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    ${props => props.onClick && `
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    `}
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.palette.primary.main};
  
  img {
    max-width: 48px;
    height: auto;
  }
`;

const CardTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.palette.text.primary};
`;

const CardDescription = styled.p`
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const CardList = styled.ul`
  list-style: none;
  padding: 0;
  margin: ${({ theme }) => theme.spacing.sm} 0;
  
  li {
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    color: ${({ theme }) => theme.palette.text.secondary};
  }
`;

export default Card;
```

---

## /src/components/common/LoadingSpinner.tsx

```tsx
import React from 'react';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: rgba(255, 255, 255, 0.8);
`;

const SpinnerElement = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingSpinner: React.FC = () => {
  return (
    <LoadingContainer>
      <SpinnerElement />
    </LoadingContainer>
  );
};

export default LoadingSpinner;
```

---

## /src/components/common/Modal.tsx

```tsx
import React, { useEffect } from 'react';
import styled from 'styled-components';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Content onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <Header>
          <Title>{title}</Title>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </Header>
        <Body>{children}</Body>
      </Content>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Content = styled.div`
  background: ${({ theme }) => theme.palette.background.paper};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.lg};
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
`;

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.palette.text.primary};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.palette.text.secondary};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.palette.text.primary};
  }
`;

const Body = styled.div`
  color: ${({ theme }) => theme.palette.text.primary};
`;

export default Modal;
```

---

## /src/components/common/StyledLink.tsx

```tsx
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export interface StyledLinkProps {
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

const StyledLink = styled(Link).attrs<StyledLinkProps>(({ disabled }) => ({
  role: 'button',
  'aria-disabled': disabled,
}))<StyledLinkProps>`
  display: inline-block;
  padding: var(--spacing-md) var(--spacing-lg);
  background: ${props => props.variant === 'secondary' ? 'var(--secondary-color)' : 'var(--primary-color)'};
  color: var(--white);
  border-radius: var(--border-radius);
  font-size: 1.1rem;
  text-decoration: none;
  text-align: center;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background 0.2s, transform 0.2s;
  opacity: ${props => props.disabled ? 0.6 : 1};

  &:hover:not([aria-disabled="true"]) {
    background: ${props => props.variant === 'secondary' ? 'var(--primary-color)' : 'var(--secondary-color)'};
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 2px dashed var(--secondary-color);
    outline-offset: 4px;
  }
`;

export default StyledLink;
```

---

## /src/components/common/Toast.tsx

```tsx
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled, { css } from 'styled-components';

type ToastType = 'info' | 'success' | 'warning' | 'error';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <ToastContainer $type={type}>
      <p>{message}</p>
    </ToastContainer>
  );
};

const showToast = (props: ToastProps): void => {
  const toastElement = document.createElement('div');
  document.body.appendChild(toastElement);
  
  const onClose = () => {
    document.body.removeChild(toastElement);
    props.onClose?.();
  };
  
  const toastComponent = React.createElement(Toast, { ...props, onClose });
  ReactDOM.render(toastComponent, toastElement);
};

const getToastColor = (type: ToastType) => {
  switch (type) {
    case 'success':
      return css`
        background-color: ${({ theme }) => theme.palette.success?.main || '#2ECC71'};
        color: white;
      `;
    case 'warning':
      return css`
        background-color: ${({ theme }) => theme.palette.warning?.main || '#F1C40F'};
        color: white;
      `;
    case 'error':
      return css`
        background-color: ${({ theme }) => theme.palette.error?.main || '#E74C3C'};
        color: white;
      `;
    default:
      return css`
        background-color: ${({ theme }) => theme.palette.info?.main || '#3498DB'};
        color: white;
      `;
  }
};

const ToastContainer = styled.div<{ $type: ToastType }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
  ${props => getToastColor(props.$type)}

  p {
    margin: 0;
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

export default Toast;
```

---

## /src/components/common/types/index.ts

```typescript
// src/components/SomeComponent.tsx

import React from 'react';

// Reusable component prop types
export interface BaseComponentProps {
  className?: string;
  id?: string;
}

// Example component with proper types
export interface SomeComponentProps extends BaseComponentProps {
  title?: string;
}

// Use arrow function with explicit return for better type inference
export const SomeComponent: React.FC<SomeComponentProps> = ({ title = 'Hello, World!', className, id }): JSX.Element => {
  return React.createElement('div', { className, id },
    React.createElement('h1', null, title)
  );
};

// Example utility function with explicit return type
export const exampleFunction = (input: string): string => input.toUpperCase();
```

---

## /src/components/student/StudentCard.tsx

```tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getStudentProfile } from '../../services/profileService';
import Card from '../common/Card';

interface Student {
  name: string;
  grade: string;
  hasTakenAssessment: boolean;
}

interface StudentCardProps {
  studentId: string;
  onClick?: () => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ studentId, onClick }) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const studentData = await getStudentProfile(studentId);
        setStudent(studentData);
      } catch (err) {
        console.error('Error fetching student:', err);
        setError('Could not load student data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  if (loading) return <StyledCard onClick={onClick}>Loading student data...</StyledCard>;
  if (error) return <StyledCard onClick={onClick}>Error: {error}</StyledCard>;
  if (!student) return null;

  return (
    <StyledCard onClick={onClick}>
      <StudentName>{student.name}</StudentName>
      <StudentInfo>Grade: {student.grade}</StudentInfo>
      <AssessmentStatus $isComplete={student.hasTakenAssessment}>
        {student.hasTakenAssessment ? 'Assessment Complete' : 'Assessment Needed'}
      </AssessmentStatus>
    </StyledCard>
  );
};

const StyledCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const StudentName = styled.h3`
  color: ${({ theme }) => theme.palette.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StudentInfo = styled.div`
  color: ${({ theme }) => theme.palette.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const AssessmentStatus = styled.div<{ $isComplete: boolean }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: 4px;
  background-color: ${({ theme, $isComplete }) => 
    $isComplete ? theme.palette.success?.main || '#2ECC71' : theme.palette.warning?.main || '#F1C40F'};
  color: white;
  font-size: 0.875rem;
  text-align: center;
`;

export default StudentCard;
```

---

## /src/components/auth/AuthErrorDialog.tsx

```tsx
import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Theme } from '../../theme';
import styled from 'styled-components';

interface AuthError {
  message: string;
  retry?: boolean;
}

interface AuthErrorDialogProps {
  open: boolean;
  error: AuthError | null;
  onClose: () => void;
  onRetry?: () => Promise<void>;
}

const AuthErrorDialog: React.FC<AuthErrorDialogProps> = ({
  open,
  error,
  onClose,
  onRetry
}): JSX.Element | null => {
  if (!error) return null;

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      aria-labelledby="auth-error-dialog-title"
    >
      <DialogTitle id="auth-error-dialog-title">
        Authentication Error
        <CloseIconButton
          aria-label="close"
          onClick={onClose}
        >
          <CloseIcon />
        </CloseIconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{error.message}</DialogContentText>
      </DialogContent>
      <StyledDialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
        {error.retry && onRetry && (
          <Button 
            onClick={onRetry} 
            color="primary" 
            variant="contained" 
            autoFocus
          >
            Try Again
          </Button>
        )}
      </StyledDialogActions>
    </StyledDialog>
  );
};

interface StyledProps {
  theme: Theme;
}

const StyledDialog = styled(Dialog)`
  .MuiPaper-root {
    padding: ${({ theme }: StyledProps) => theme.spacing.md};
  }
`;

const CloseIconButton = styled(IconButton)`
  position: absolute;
  right: ${({ theme }: StyledProps) => theme.spacing.sm};
  top: ${({ theme }: StyledProps) => theme.spacing.sm};
`;

const StyledDialogActions = styled(DialogActions)`
  padding: ${({ theme }: StyledProps) => theme.spacing.md} 0 0;
`;

export default AuthErrorDialog;
```

---

## /src/components/auth/AuthRoute.tsx

```tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: rgba(255, 255, 255, 0.8);
`;

interface AuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  // If user is authenticated and tries to access auth pages, redirect to dashboard
  if (currentUser) {
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  // Allow access to auth pages if not authenticated
  return <>{children}</>;
};

export default AuthRoute;
```

---

## /src/components/auth/Login.css

```css
.login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 20px;
    background-color: #f5f5f5;
}

.login-form {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
}

.login-form h2 {
    text-align: center;
    color: #2C3E50;
    margin-bottom: 1.5rem;
    font-size: 1.75rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-color);
    font-weight: 500;
    font-size: 1rem;
}

.form-group input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.2s ease;
}

.form-group input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.form-group input::placeholder {
    color: #a0aec0;
}

.login-button {
    width: 100%;
    padding: 0.75rem;
    background-color: #4f46e5;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.login-button:hover {
    background-color: #4338ca;
}

.login-button:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
}

.error-message {
    background-color: #fee2e2;
    color: #dc2626;
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    font-size: 0.875rem;
    text-align: center;
}

.login-footer {
    margin-top: 1.5rem;
    text-align: center;
    font-size: 0.875rem;
}

.login-footer p {
    margin-bottom: 0.5rem;
    color: #4a5568;
}

.login-footer a {
    color: #4f46e5;
    text-decoration: none;
    font-weight: 500;
}

.login-footer a:hover {
    text-decoration: underline;
}

.divider {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 20px 0;
}

.divider::before,
.divider::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #e2e8f0;
}

.divider span {
    padding: 0 10px;
    color: #64748b;
    font-size: 0.875rem;
}

.google-button {
    width: 100%;
    padding: 0.75rem;
    background-color: white;
    color: #333;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: background-color 0.2s ease;
}

.google-button:hover {
    background-color: #f8fafc;
}

.google-button img {
    width: 18px;
    height: 18px;
}

@media (max-width: 480px) {
    .login-form {
        padding: 1.5rem;
    }
}
```

---

## /src/components/auth/LoginForm.tsx

```tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import GoogleLoginButton from '../GoogleLoginButton';
import './auth.css';

const ErrorMessage = styled.div`
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 10px;
  margin: 10px 0;
  font-size: 0.9rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 5px;
  color: #dc3545;
  &:hover {
    opacity: 0.7;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #357abd;
  }
`;

const LoginForm: React.FC = (): JSX.Element => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (): Promise<void> => {
    try {
      await login();
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleLogin();
    }}>
      {/* ...existing form JSX... */}
    </form>
  );
};

export default LoginForm;
```

---

## /src/components/auth/SignUp.css

```css
.signup-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.error-alert {
  background: #ffebee;
  color: #c62828;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border-radius: 4px;
}

form div {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-color);
  font-weight: 500;
  font-size: 1rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 0.75rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.7;
}
```

---

## /src/components/auth/SignUp.tsx

```tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../contexts/AuthContext';
import { CheshireService } from '../../services/cheshireService';
import Button from '../common/Button';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const createCheshireAccount = async (uid: string, email: string) => {
    try {
      await CheshireService.createCheshireUser(uid, email);
    } catch (error) {
      console.error('Error creating Cheshire account:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const userCredential = await signup(formData.email, formData.password);
      
      if (userCredential?.user) {
        await createCheshireAccount(userCredential.user.uid, userCredential.user.email || '');
      }
      
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      setError('');
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up with Google');
      console.error('Google signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SignUpContainer>
      <SignUpCard>
        <h2>Create an Account</h2>
        {error && (
          <ErrorMessage>
            <span>{error}</span>
            <DismissButton onClick={() => setError('')}>✕</DismissButton>
          </ErrorMessage>
        )}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={loading}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              disabled={loading}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              disabled={loading}
            />
          </FormGroup>

          <StyledButton type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </StyledButton>
        </Form>

        <Divider>
          <span>Or</span>
        </Divider>

        <GoogleButton onClick={handleGoogleSignup} disabled={loading}>
          <FcGoogle />
          <span>Sign up with Google</span>
        </GoogleButton>

        <LoginPrompt>
          Already have an account? <Link to="/login">Log In</Link>
        </LoginPrompt>
      </SignUpCard>
    </SignUpContainer>
  );
};

const SignUpContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  background-color: var(--background);
`;

const SignUpCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;

  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: var(--primary-color);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: var(--text-color);
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  &:disabled {
    background-color: #f5f5f5;
  }
`;

const StyledButton = styled.button`
  width: 100%;
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--primary-dark);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  background-color: #fee2e2;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1.5rem 0;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #ddd;
  }

  span {
    padding: 0 0.5rem;
    color: #666;
    font-size: 0.875rem;
  }
`;

const GoogleButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8f8f8;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const LoginPrompt = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: var(--text-color);
`;

const Link = styled.a`
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

export default SignUp;
```

---

## /src/components/auth/auth.css

```css
.auth-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background: #fff;
}

.auth-title {
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.auth-error {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  background-color: #fee2e2;
  color: #dc2626;
  font-size: 0.875rem;
}

.auth-error-dismiss {
  background: none;
  border: none;
  color: #dc2626;
  cursor: pointer;
  padding: 0.25rem;
  margin-left: 0.5rem;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.auth-error-dismiss:hover {
  opacity: 1;
}

.google-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background-color: #fff;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s, border-color 0.2s;
  gap: 0.5rem;
}

.google-button:hover:not(:disabled) {
  background-color: #f9fafb;
  border-color: #d1d5db;
}

.google-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.auth-divider {
  position: relative;
  text-align: center;
  margin: 1.5rem 0;
}

.auth-divider::before,
.auth-divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: calc(50% - 3rem);
  height: 1px;
  background-color: #e5e7eb;
}

.auth-divider::before {
  left: 0;
}

.auth-divider::after {
  right: 0;
}

.auth-divider span {
  background-color: #fff;
  padding: 0 1rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.btn.btn-secondary {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #f3f4f6;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
  transition: background-color 0.2s;
  cursor: pointer;
}

.btn.btn-secondary:hover {
  background-color: #e5e7eb;
}
```

---

## /src/components/dashboard/Dashboard.tsx

```tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CreateStudent from '../../pages/profile/ParentProfile/CreateStudent';
import { ProfileService, getStudentProfile } from '../../services/profileService';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../common/LoadingSpinner';
import type { Student, BaseProfile } from '../../types/profiles';

interface UserData {
  name: string;
  lastLogin: string;
}

interface ParentProfile {
  id?: string;
  students?: string[];
  name?: string;
  email?: string;
}

interface DashboardProps {
  onProfileUpdate?: (profile: BaseProfile) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onProfileUpdate }): JSX.Element => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [parentProfile, setParentProfile] = useState<ParentProfile | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      // Retry data fetch when back online
      if (currentUser) fetchUserData();
    };
    
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [currentUser]);

  const fetchUserData = useCallback(async (): Promise<void> => {
    try {
      if (!currentUser?.uid) {
        navigate('/login');
        return;
      }

      setLoading(true);
      setError('');
      
      // Set basic user data immediately from auth
      setUserData({
        name: currentUser.displayName || currentUser.email || '',
        lastLogin: currentUser.metadata?.lastSignInTime || 'N/A',
      });

      // Fetch parent profile with retry mechanism
      const fetchProfileWithRetry = async () => {
        try {
          const profileService = new ProfileService();
          const profile = await profileService.getUserProfile(currentUser.uid);
          if (profile) {
            setParentProfile(profile);
            if (onProfileUpdate) {
              onProfileUpdate(profile);
            }
            return profile;
          }
          throw new Error('Profile not found');
        } catch (err) {
          if (retryCount < MAX_RETRIES && !isOffline) {
            setRetryCount(prev => prev + 1);
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
            return fetchProfileWithRetry();
          }
          throw err;
        }
      };

      const profile = await fetchProfileWithRetry();

      // Fetch students data if profile exists
      if (profile?.students?.length) {
        const studentsData = await Promise.all(
          profile.students.map(async (studentId: string) => {
            try {
              const student = await getStudentProfile(studentId);
              return student;
            } catch (err) {
              console.error(`Error fetching student ${studentId}:`, err);
              return null;
            }
          })
        );
        
        // Filter out null values and cast to Student array
        setStudents(studentsData.filter((s): s is Student => s !== null && s.id !== undefined));
      }

      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      console.error('❌ Error fetching user data:', err);
      setError(isOffline ? 
        'You are currently offline. Some features may be limited.' :
        'Failed to fetch user data. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [currentUser, navigate, onProfileUpdate, retryCount, isOffline]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleStudentSelect = (student: Student) => {
    if (isOffline) {
      setError('This action is not available while offline');
      return;
    }
    
    if (!student.hasTakenAssessment) {
      navigate(`/learning-style-chat/${student.id}`);
    } else {
      navigate(`/student-profile/${student.id}`);
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      navigate('/login');
    } catch (err) {
      setError('Failed to log out');
    }
  };

  if (loading) {
    return (
      <DashboardContainer>
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <AnimatePresence>
        {isOffline && (
          <OfflineBanner
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            You are currently offline. Some features may be limited.
          </OfflineBanner>
        )}
      </AnimatePresence>

      <DashboardHeader>
        <h1>Welcome, {userData?.name}</h1>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </DashboardHeader>

      {error && (
        <ErrorMessage>
          {error}
          <RetryButton onClick={fetchUserData}>Retry</RetryButton>
        </ErrorMessage>
      )}

      <DashboardGrid>
        <ParentSection>
          <h2>Parent Dashboard</h2>
          {!isOffline && <CreateStudent />}
          <StudentsList>
            <h3>Your Students</h3>
            {students.length > 0 ? (
              <StudentGrid>
                {students.map((student) => (
                  <StudentCardWrapper 
                    key={student.id}
                    onClick={() => handleStudentSelect(student)}
                    disabled={isOffline}
                  >
                    <StudentName>{student.name}</StudentName>
                    <StudentInfo>Grade: {student.grade}</StudentInfo>
                    <AssessmentStatus $completed={student.hasTakenAssessment}>
                      {student.hasTakenAssessment ? 'Assessment Complete' : 'Take Assessment'}
                    </AssessmentStatus>
                  </StudentCardWrapper>
                ))}
              </StudentGrid>
            ) : (
              <EmptyState>
                No students found. {!isOffline && 'Add your first student to get started.'}
              </EmptyState>
            )}
          </StudentsList>
        </ParentSection>
      </DashboardGrid>
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  padding: 2rem;
  background-color: #f9fafb;
  min-height: 100vh;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
`;

const ParentSection = styled.section`
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const StudentsList = styled.div`
  margin-top: 1rem;
`;

const StudentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const StudentCardWrapper = styled.div<{ disabled?: boolean }>`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.7 : 1};
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const StudentName = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #2d3748;
`;

const StudentInfo = styled.p`
  color: #4a5568;
  margin: 0 0 0.5rem 0;
`;

const AssessmentStatus = styled.div<{ $completed: boolean }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  background-color: ${props => props.$completed ? '#48BB78' : '#4299E1'};
  color: white;
  margin-bottom: 1rem;
`;

const ActionButton = styled.button`
  width: 100%;
  background-color: #3B82F6;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  
  &:hover {
    background-color: #2563EB;
  }
`;

const EmptyState = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f1f5f9;
  border-radius: 0.5rem;
  text-align: center;
`;

const LogoutButton = styled.button`
  background-color: #ef4444;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #dc2626;
  }
`;

const OfflineBanner = styled(motion.div)`
  background: #fff3cd;
  color: #856404;
  padding: 0.75rem;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const LoadingOverlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #dc2626;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RetryButton = styled.button`
  background: none;
  border: 1px solid currentColor;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`;

export default Dashboard;
```

---

## /src/components/home/Features.css

```css
.features-section {
  padding: 4rem 2rem;
  background-color: #f8f9fa;
}

.features-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #2d3748;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  background-color: #e6b800; /* P920d */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* P920d */
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #2d3748;
}

.feature-description {
  color: #4a5568;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .features-section {
    padding: 2rem 1rem;
  }

  .features-title {
    font-size: 2rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## /src/components/home/Features.tsx

```tsx
import React from 'react';
import Card from '../common/Card';
import './Features.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullseye, faLightbulb, faChartLine, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';

const Features = () => {
  const features = [
    {
      title: "Personalized Learning",
      description: "Tailored learning paths based on your unique style",
      icon: faBullseye
    },
    {
      title: "Interactive Content",
      description: "Engage with dynamic and interactive learning materials",
      icon: faLightbulb
    },
    {
      title: "Progress Tracking",
      description: "Monitor your growth with detailed analytics",
      icon: faChartLine
    },
    {
      title: "Expert Support",
      description: "Get help from experienced educators",
      icon: faChalkboardTeacher
    }
  ];

  return (
    <section className="features-section">
      <h2 className="features-title">Why Choose Geaux Academy</h2>
      <div className="features-grid">
        {features.map((feature, index) => (
          <Card key={index} className="feature-card" icon={feature.icon}>
            <div className="feature-icon"><FontAwesomeIcon icon={feature.icon} /></div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Features;
```

---

## /src/components/home/Hero.css

```css
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

.hero-content {
  flex: 1;
  max-width: 600px;
}

.hero-content h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #333;
}

.hero-content p {
  font-size: 1.25rem;
  color: #666;
  margin-bottom: 2rem;
}

.hero-cta {
  display: flex;
  gap: 1rem;
}

.hero-cta .btn {
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.hero-cta .btn:hover {
  background-color: #e6b800;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
}

.hero-image img {
  max-width: 100%;
  height: auto;
}
```

---

## /src/components/home/Hero.tsx

```tsx
import { Link } from 'react-router-dom';
import './Hero.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Discover Your Learning Style</h1>
        <p>Personalized education tailored to how you learn best</p>
        <div className="hero-cta">
          <Link to="/assessment" className="btn btn-primary">
            <FontAwesomeIcon icon={faUser} /> Take Assessment
          </Link>
          <Link to="/about" className="btn btn-secondary">
            <FontAwesomeIcon icon={faUser} /> Learn More
          </Link>
        </div>
      </div>
      <div className="hero-image">
        <img src="/images/hero-learning.svg" alt="Learning illustration" />
      </div>
    </section>
  );
};

export default Hero;
```

---

## /src/components/home/LearningStyles.css

```css
:root {
  --primary-color: #2C3E50;
  --text-color: #333;
  --background-alt: #f8f9fa;
}

body {
  margin: 0;
  padding: 0;
}

.learning-styles-section {
  padding: 4rem 2rem;
  background-color: var(--light-bg);
}

.learning-styles-section h2 {
  text-align: center;
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 2rem;
}

.styles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.style-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.3s ease;
}

.style-card:hover {
  transform: translateY(-5px);
  background-color: #e6b800; /* P4a73 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* P4a73 */
}

.style-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.style-card h3 {
  color: var(--primary-color);
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.style-card p {
  color: var(--text-color);
  line-height: 1.5;
}

.main-content {
  margin-left: 250px;
  padding: 2rem;
  min-height: 100vh;
}

@media (max-width: 768px) {
  .styles-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
  
  .learning-styles-section {
    padding: 2rem 1rem;
  }

  .main-content {
    margin-left: 0;
    padding: 1rem;
  }
}
```

---

## /src/components/home/LearningStyles.tsx

```tsx
import React from 'react';
import styled from 'styled-components';
import InfoCard from '../common/InfoCard'; // Fixed path
import { motion } from 'framer-motion';
import Card from '../common/Card';
import './LearningStyles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEar, faBook, faRunning } from '@fortawesome/free-solid-svg-icons';

const LearningStyles = () => {
  const styles = [
    {
      title: 'Visual Learning',
      description: 'Learn through seeing and watching demonstrations',
      icon: faEye
    },
    {
      title: 'Auditory Learning',
      description: 'Learn through listening and discussion',
      icon: faEar
    },
    {
      title: 'Reading/Writing',
      description: 'Learn through reading and taking notes',
      icon: faBook
    },
    {
      title: 'Kinesthetic',
      description: 'Learn through doing and practicing',
      icon: faRunning
    }
  ];

  return (
    <section className="learning-styles-section">
      <div className="styles-grid">
        {styles.map((style, index) => (
          <Card key={index} className="style-card" icon={style.icon}>
            <div className="style-icon"><FontAwesomeIcon icon={style.icon} /></div>
            <h3>{style.title}</h3>
            <p>{style.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default LearningStyles;
```

---

## /src/components/chat/ChatUI.css

```css
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.chat-window {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fff;
}

.message {
  margin: 0.5rem 0;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  max-width: 80%;
}

.message.user {
  background-color: #e3f2fd;
  margin-left: auto;
  text-align: right;
}

.message.tutor {
  background-color: #f5f5f5;
  margin-right: auto;
}

.message.processing {
  background-color: #fafafa;
  opacity: 0.7;
  font-style: italic;
}

.input-container {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background-color: #fff;
  border-top: 1px solid #e0e0e0;
}

.input-container input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
}

.input-container button {
  padding: 0.75rem 1.5rem;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.input-container button:disabled {
  background-color: #bdbdbd;
  cursor: not-allowed;
}

.input-container input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}
```

---

## /src/components/chat/ChatUI.tsx

```tsx
import React, { useState } from 'react';
import { CheshireService } from '../../services/cheshireService';
import { useAuth } from '../../contexts/AuthContext';
import './ChatUI.css';

interface Message {
  sender: 'user' | 'tutor';
  text: string;
}

const ChatUI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { currentUser } = useAuth();

  const handleSend = async () => {
    if (!inputText.trim() || !currentUser?.uid) return;
    
    const userMessage: Message = { sender: 'user', text: inputText };
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      const chatId = 'default';
      const response = await CheshireService.sendChatMessage(
        inputText,
        currentUser.uid,
        chatId
      );

      const tutorMessage: Message = {
        sender: 'tutor',
        text: response.data
      };
      setMessages(prev => [...prev, tutorMessage]);

      const memories = response.memories || [];
      if (memories.length > 0) {
        const learningStyleMemory = memories.find(
          memory => memory.metadata?.learning_style
        );
        if (learningStyleMemory?.metadata?.learning_style) {
          console.log('Learning style detected:', learningStyleMemory.metadata.learning_style);
        }
      }
    } catch (error) {
      const errorMessage = CheshireService.getErrorMessage(error);
      setMessages(prev => [...prev, { sender: 'tutor', text: errorMessage }]);
    } finally {
      setIsProcessing(false);
    }
    setInputText('');
  };

  return (
    <div className="chat-container">
      <div className="chat-window">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isProcessing && (
          <div className="message tutor processing">
            Thinking...
          </div>
        )}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={inputText}
          placeholder="Type your message..."
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !isProcessing && handleSend()}
          disabled={isProcessing}
        />
        <button 
          onClick={handleSend}
          disabled={isProcessing || !inputText.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatUI;
```

---

## /src/components/chat/LearningStyleChat.tsx

```tsx
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaPaperPlane } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import Message from '../Message';
import { saveLearningStyle, updateStudentAssessmentStatus } from '../../services/profileService';
import { CheshireService } from '../../services/cheshireService';
import { LearningStyle } from '../../types/profiles';

type ValidLearningStyle = 'visual' | 'auditory' | 'kinesthetic' | 'reading/writing';

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
}

interface CheshireResponse {
  data: string;
  memories?: Array<{
    metadata?: {
      learning_style?: string;
    };
  }>;
}

interface CheshireError {
  code?: string;
  message: string;
}

const isValidLearningStyle = (style: string): style is ValidLearningStyle => {
  return ['visual', 'auditory', 'kinesthetic', 'reading/writing'].includes(style);
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const LearningStyleChat: React.FC<{ studentId?: string }> = ({ studentId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAuth();

  // Initialize chat with assessment start message
  useEffect(() => {
    setMessages([{ 
      text: "Hi! I'm here to help assess your learning style. Let's start with a few questions. How do you prefer to learn new things?", 
      sender: "bot" 
    }]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check API connection on mount and set up periodic checks
  useEffect(() => {
    checkApiConnection();
    const intervalId = setInterval(checkApiConnection, 30000); // Check every 30 seconds
    return () => clearInterval(intervalId);
  }, []);

  const checkApiConnection = async (): Promise<void> => {
    const isConnected = await CheshireService.checkConnection();
    setConnectionError(!isConnected);
  };

  const retryWithDelay = async (fn: () => Promise<void>, maxRetries = 3, delay = 1000): Promise<void> => {
    try {
      return await fn();
    } catch (error) {
      if (maxRetries > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return retryWithDelay(fn, maxRetries - 1, delay);
      }
      throw error;
    }
  };

  const handleResponse = async (response: CheshireResponse): Promise<void> => {
    const rawLearningStyle = response?.memories?.find(m => m.metadata?.learning_style)?.metadata?.learning_style;
    if (rawLearningStyle && isValidLearningStyle(rawLearningStyle) && studentId) {
      const learningStyle: LearningStyle = {
        type: rawLearningStyle,
        strengths: [],
        recommendations: []
      };
      try {
        await saveLearningStyle(studentId, learningStyle);
        await updateStudentAssessmentStatus(studentId, "completed");
      } catch (error) {
        console.error('Error saving learning style:', error);
        setMessages(prev => [...prev, { 
          text: "There was an error saving your learning style. Please try again.", 
          sender: "bot" 
        }]);
      }
    }
  };

  const sendMessage = async (): Promise<void> => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);

    try {
      setLoading(true);
      const response = await CheshireService.sendChatMessage(
        userMessage,
        currentUser?.uid || 'anonymous',
        studentId || 'default'
      );

      if (response) {
        setMessages(prev => [...prev, { text: response.data, sender: 'bot' }]);
        await handleResponse(response);
      }
      
      setConnectionError(false);
    } catch (error: unknown) {
      console.error('Error sending message:', error);
      const errorMessage = CheshireService.getErrorMessage(error as CheshireError);
      setMessages(prev => [...prev, { text: errorMessage, sender: 'bot' }]);
      setConnectionError(true);
      await checkApiConnection();
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatContainer className="card">
      <ChatHeader>
        🎓 Learning Style Assessment
        {connectionError && (
          <ConnectionError>
            ⚠️ Connection Error - Check if the chat service is running
          </ConnectionError>
        )}
      </ChatHeader>
      <ChatBody>
        {messages.map((msg, index) => (
          <Message key={index} sender={msg.sender}>{msg.text}</Message>
        ))}
        {loading && <Message sender="bot">Typing...</Message>}
        <div ref={chatEndRef} />
      </ChatBody>
      <ChatFooter>
        <ChatInput
          type="text"
          value={input}
          placeholder="Type your response..."
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          className="form-input"
        />
        <SendButton onClick={sendMessage} className="btn btn-primary">
          <FaPaperPlane />
        </SendButton>
      </ChatFooter>
    </ChatContainer>
  );
};

const ChatContainer = styled.div`
  height: 500px;
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  padding: var(--spacing-md);
  border-bottom: 1px solid #eee;
  font-weight: bold;
`;

const ConnectionError = styled.div`
  color: var(--color-error);
  font-size: 0.8em;
  margin-top: 4px;
`;

const ChatBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md);
`;

const ChatFooter = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-top: 1px solid #eee;
`;

const ChatInput = styled.input`
  flex: 1;
`;

const SendButton = styled.button`
  padding: var(--spacing-sm);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default LearningStyleChat;
```

---

## /src/components/chat/TestChat.tsx

```tsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CheshireService } from '../../services/cheshireService';
import { useAuth } from '../../contexts/AuthContext';

const TestChat: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<string>('Checking connection...');
  const [testMessage, setTestMessage] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { currentUser } = useAuth();

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const isConnected = await CheshireService.checkConnection();
      setConnectionStatus(isConnected ? 'Connected ✅' : 'Not connected ❌');
    } catch (error) {
      setConnectionStatus('Connection failed ❌');
      setError(CheshireService.getErrorMessage(error));
    }
  };

  const handleTestMessage = async () => {
    if (!testMessage.trim() || !currentUser?.uid) return;

    try {
      setError('');
      const result = await CheshireService.sendChatMessage(
        testMessage,
        currentUser.uid,
        'test'
      );
      setResponse(result.data);
      if (result.memories?.length) {
        console.log('Memories received:', result.memories);
      }
    } catch (error) {
      setError(CheshireService.getErrorMessage(error));
    }
  };

  return (
    <TestContainer>
      <TestCard>
        <h2>Cheshire Service Test</h2>
        
        <StatusSection>
          <h3>Connection Status:</h3>
          <StatusText>{connectionStatus}</StatusText>
          <RefreshButton onClick={checkConnection}>
            Refresh Connection
          </RefreshButton>
        </StatusSection>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <TestSection>
          <h3>Send Test Message:</h3>
          <TestInput
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Type a test message..."
          />
          <SendButton 
            onClick={handleTestMessage}
            disabled={!testMessage.trim() || !currentUser}
          >
            Send Message
          </SendButton>
        </TestSection>

        {response && (
          <ResponseSection>
            <h3>Response:</h3>
            <ResponseText>{response}</ResponseText>
          </ResponseSection>
        )}
      </TestCard>
    </TestContainer>
  );
};

const TestContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  background-color: var(--background);
`;

const TestCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 600px;

  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: var(--primary-color);
  }

  h3 {
    margin-bottom: 1rem;
    color: var(--text-color);
  }
`;

const StatusSection = styled.div`
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
`;

const StatusText = styled.div`
  font-size: 1.1rem;
  margin-bottom: 1rem;
`;

const TestSection = styled.div`
  margin-bottom: 2rem;
`;

const TestInput = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1rem;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const ResponseSection = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
`;

const ResponseText = styled.div`
  white-space: pre-wrap;
  font-family: monospace;
  padding: 1rem;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const RefreshButton = styled(Button)`
  background-color: #6c757d;
  color: white;

  &:hover:not(:disabled) {
    background-color: #5a6268;
  }
`;

const SendButton = styled(Button)`
  background-color: var(--primary-color);
  color: white;
  width: 100%;

  &:hover:not(:disabled) {
    background-color: var(--primary-dark);
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  background-color: #fee2e2;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

export default TestChat;
```

---

## /src/components/shared/ErrorBoundary.tsx

```tsx
import React, { Component, ErrorInfo } from 'react';
import styled from 'styled-components';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isOffline: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      isOffline: !navigator.onLine
    };
  }

  componentDidMount() {
    window.addEventListener('online', this.handleOnlineStatus);
    window.addEventListener('offline', this.handleOnlineStatus);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleOnlineStatus);
    window.removeEventListener('offline', this.handleOnlineStatus);
  }

  handleOnlineStatus = () => {
    this.setState({ isOffline: !navigator.onLine });
    if (navigator.onLine && this.state.error?.message.includes('offline')) {
      // Clear offline-related errors when back online
      this.setState({ hasError: false, error: null });
    }
  };

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      isOffline: !navigator.onLine
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Check if error is Firebase offline error
      const isFirebaseOffline = this.state.error?.message.includes('offline') || 
                               this.state.error?.message.includes('network');

      return (
        <ErrorContainer>
          <ErrorCard>
            <ErrorTitle>
              {this.state.isOffline ? '📡 You\'re Offline' : '❌ Something went wrong'}
            </ErrorTitle>
            
            <ErrorMessage>
              {this.state.isOffline || isFirebaseOffline ? (
                <>
                  <p>It looks like you're offline or having connection issues.</p>
                  <p>Some features may be limited until you're back online.</p>
                  <p>Your data will sync automatically when you reconnect.</p>
                </>
              ) : (
                <>
                  <p>An unexpected error occurred.</p>
                  <p>{this.state.error?.message}</p>
                </>
              )}
            </ErrorMessage>

            <RetryButton 
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
            >
              Try Again
            </RetryButton>
          </ErrorCard>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background: rgba(0, 0, 0, 0.05);
`;

const ErrorCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

const ErrorTitle = styled.h2`
  color: #e53e3e;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.div`
  color: #4a5568;
  margin-bottom: 1.5rem;
  
  p {
    margin: 0.5rem 0;
  }
`;

const RetryButton = styled.button`
  background: #4299e1;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #3182ce;
  }
`;

export default ErrorBoundary;
```

---

## /src/components/shared/styles/Button.css

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-secondary {
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  background: transparent;
}

/* Authentication Components Styling */
.auth-container {
  max-width: 400px;
  margin: 2rem auto;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.auth-title {
  text-align: center;
  margin-bottom: var(--spacing-lg);
  color: var(--primary-color);
}

.auth-divider {
  display: flex;
  align-items: center;
  margin: var(--spacing-md) 0;
  text-align: center;
}

.auth-divider::before,
.auth-divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #ddd;
}

.auth-divider span {
  padding: 0 var(--spacing-sm);
  color: #666;
}

.google-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  width: 100%;
  padding: var(--spacing-sm);
  background: var(--white);
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: background-color 0.2s;
}

.google-button:hover {
  background-color: #f5f5f5;
}

.auth-error {
  color: var(--secondary-color);
  text-align: center;
  margin-bottom: var(--spacing-md);
}

.auth-success {
  color: #4CAF50;
  text-align: center;
  margin-bottom: var(--spacing-md);
}

/* Form validation styling */
.auth-input.error {
  border-color: var(--secondary-color);
}

.error-message {
  color: var(--secondary-color);
  font-size: 0.875rem;
  margin-top: var(--spacing-xs);
}
```

---

## /src/components/features/vue/VueComponent.tsx

```tsx
/src/components/features/vue/VueComponent.tsx

import React from 'react';
import VueComponentWrapper from './VueComponentWrapper';

interface VueComponentProps {
  // Add any props if needed
}

const VueComponent: React.FC<VueComponentProps> = () => {
  return (
    <div>
      <h1>React + Vue Integration</h1>
      <VueComponentWrapper />
    </div>
  );
};

export default VueComponent;
```

---

## /src/components/features/vue/VueWrapper.tsx

```tsx
import React, { useEffect, useRef } from 'react';
import { createApp, App } from 'vue';

interface VueWrapperProps {
  component: any; // Vue component
  props?: Record<string, any>;
}

const VueWrapper: React.FC<VueWrapperProps> = ({ component, props = {} }) => {
  const vueRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<App | null>(null);

  useEffect(() => {
    if (!vueRef.current || !component) return;

    if (!appRef.current) {
      appRef.current = createApp(component, props);
      appRef.current.mount(vueRef.current);
    }

    return () => {
      if (appRef.current) {
        appRef.current.unmount();
        appRef.current = null;
      }
    };
  }, [component, props]);

  return <div ref={vueRef} />;
};

export default VueWrapper;
```

---

## /src/components/features/learning/LearningStyleInsightsWrapper.tsx

```tsx
/src/components/features/learning/LearningStyleInsightsWrapper.tsx

import React from 'react';
import VueWrapper from '../vue/VueWrapper';
import LearningStyleInsights from './LearningStyleInsights.vue';

interface LearningStyleInsightsWrapperProps {
  studentData?: any; // Add proper typing based on your Vue component props
}

const LearningStyleInsightsWrapper: React.FC<LearningStyleInsightsWrapperProps> = ({ studentData }) => {
  return <VueWrapper component={LearningStyleInsights} props={{ studentData }} />;
};

export default LearningStyleInsightsWrapper;
```

---

## /src/components/styles/CoreValues.styles.ts

```typescript
import styled from 'styled-components';

export const CoreValuesContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  text-align: center;
  padding: 1.5rem 0;
`;

export const CoreValue = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
`;
```

---

## /src/firebase/auth-service-worker.ts

```typescript
// File: /src/firebase/auth-service-worker.ts
// Description: Service worker initialization with enhanced security
// Author: GitHub Copilot
// Created: 2024-02-12

import { enableIndexedDbPersistence, type FirestoreSettings } from 'firebase/firestore';
import { db } from './config';

interface ServiceWorkerError extends Error {
  name: string;
  code?: string;
}

interface AuthServiceWorkerMessage {
  type: string;
  status?: number;
  ok?: boolean;
  fallbackToRedirect?: boolean;
  error?: string;
  secure?: boolean;
}

interface ServiceWorkerRegistrationResult {
  success: boolean;
  isSecure: boolean;
  supportsServiceWorker: boolean;
  error?: string;
}

const SW_TIMEOUT = Number(import.meta.env.VITE_SERVICE_WORKER_TIMEOUT) || 10000;
const MAX_RETRIES = Number(import.meta.env.VITE_MAX_AUTH_RETRIES) || 3;

const isSecureContext = (): boolean => {
  return window.isSecureContext && (
    window.location.protocol === 'https:' || 
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  );
};

let serviceWorkerRegistration: ServiceWorkerRegistration | null = null;
let retryCount = 0;

const registerWithRetry = async (): Promise<ServiceWorkerRegistration> => {
  try {
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/__/auth',
      type: 'module',
      updateViaCache: 'none'
    });
    return registration;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      await new Promise(resolve => setTimeout(resolve, 1000));
      return registerWithRetry();
    }
    throw error;
  }
};

export const registerAuthServiceWorker = async (): Promise<ServiceWorkerRegistrationResult> => {
  if (!('serviceWorker' in navigator)) {
    return {
      success: false,
      isSecure: false,
      supportsServiceWorker: false,
      error: 'Service workers are not supported in this browser'
    };
  }

  if (!isSecureContext()) {
    return {
      success: false,
      isSecure: false,
      supportsServiceWorker: true,
      error: 'Secure context required for authentication'
    };
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map(registration => registration.unregister()));

    serviceWorkerRegistration = await registerWithRetry();

    const activationPromise = new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Service worker activation timeout'));
      }, SW_TIMEOUT);

      if (serviceWorkerRegistration?.active) {
        clearTimeout(timeout);
        resolve();
        return;
      }

      serviceWorkerRegistration?.addEventListener('activate', () => {
        clearTimeout(timeout);
        resolve();
      });
    });

    await activationPromise;

    return {
      success: true,
      isSecure: isSecureContext(),
      supportsServiceWorker: true
    };

  } catch (error) {
    console.error('Service worker registration failed:', error);
    return {
      success: false,
      isSecure: isSecureContext(),
      supportsServiceWorker: true,
      error: error instanceof Error ? error.message : 'Service worker registration failed'
    };
  }
};

export const initAuthServiceWorker = async (): Promise<boolean> => {
  const result = await registerAuthServiceWorker();
  
  window.dispatchEvent(new CustomEvent('firebase-auth-worker-status', { 
    detail: result 
  }));

  if (!result.success) {
    console.warn('Auth service worker initialization failed:', result.error);
    return false;
  }

  // Initialize Firestore persistence after successful service worker registration
  try {
    const settings: FirestoreSettings = {
      cacheSizeBytes: 50000000, // 50 MB
    };
    
    await enableIndexedDbPersistence(db);
    
    return true;
  } catch (error) {
    console.error('Failed to enable persistence:', error);
    return false;
  }
};

function handleServiceWorkerMessage(event: MessageEvent<AuthServiceWorkerMessage>) {
  const { type, status, ok, fallbackToRedirect, error, secure } = event.data;

  const dispatch = (eventName: string, detail: any) => {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
  };

  switch (type) {
    case 'FIREBASE_SERVICE_WORKER_READY':
      console.debug('Firebase auth service worker ready');
      dispatch('firebase-auth-worker-ready', { secure });
      break;
      
    case 'FIREBASE_AUTH_POPUP_READY':
      console.debug('Firebase auth popup ready');
      dispatch('firebase-auth-popup-ready', { secure });
      break;
      
    case 'FIREBASE_AUTH_POPUP_ERROR':
      if (fallbackToRedirect && import.meta.env.VITE_AUTH_POPUP_FALLBACK === 'true') {
        console.warn('Popup authentication failed, falling back to redirect method');
      }
      dispatch('firebase-auth-error', { error, fallbackToRedirect });
      break;
      
    case 'AUTH_RESPONSE':
      if (!ok) {
        console.error('Authentication response error:', status);
        dispatch('firebase-auth-error', { status, error });
      } else {
        dispatch('firebase-auth-success', { status });
      }
      break;
      
    case 'SECURE_CONTEXT_CHECK':
      if (!secure) {
        console.warn('Authentication requires a secure context (HTTPS)');
        dispatch('firebase-auth-security', { secure: false });
      }
      break;
  }
}

navigator.serviceWorker?.addEventListener('message', handleServiceWorkerMessage);

export default initAuthServiceWorker;
```

---

## /src/firebase/auth-service.ts

```typescript
import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, Auth } from "firebase/auth";
import { auth } from './config';

export class AuthService {
  private provider: GoogleAuthProvider;
  private initialized: boolean = false;
  private popupOpen: boolean = false;
  private _auth: Auth;

  constructor() {
    this.provider = new GoogleAuthProvider();
    this.provider.setCustomParameters({
      prompt: 'select_account',
      scope: 'email profile'
    });
    this._auth = auth;
  }

  get auth(): Auth {
    return this._auth;
  }

  private async ensureInitialized() {
    if (!this.initialized) {
      await new Promise<void>((resolve) => {
        const unsubscribe = this._auth.onAuthStateChanged(() => {
          unsubscribe();
          this.initialized = true;
          resolve();
        });
      });
    }
  }

  async signInWithGoogle() {
    try {
      if (this.popupOpen) {
        throw new Error('Authentication popup is already open');
      }

      await this.ensureInitialized();
      this.popupOpen = true;

      const result = await signInWithPopup(this._auth, this.provider);
      return result;
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in cancelled by user');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Sign-in popup was blocked. Please allow popups for this site');
      }
      throw new Error(error.message || 'Failed to sign in with Google');
    } finally {
      this.popupOpen = false;
    }
  }

  async signOut() {
    try {
      await this.ensureInitialized();
      await firebaseSignOut(this._auth);
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error(error.message || 'Failed to sign out');
    }
  }
}
```

---

## /src/firebase/config.ts

```typescript
// File: /src/firebase/config.ts
// Description: Firebase configuration with Firestore persistence setup

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  initializeAuth, 
  indexedDBLocalPersistence,
  browserLocalPersistence,
  browserPopupRedirectResolver,
  type Auth
} from 'firebase/auth';
import { 
  initializeFirestore,
  CACHE_SIZE_UNLIMITED,
  persistentLocalCache,
  persistentSingleTabManager,
  type Firestore
} from 'firebase/firestore';
import { getAnalytics, type Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firestore with persistent cache settings
export const db: Firestore = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentSingleTabManager({ forceOwnership: true }),
    cacheSizeBytes: CACHE_SIZE_UNLIMITED
  })
});

// Initialize Auth with persistence and popup support (preferred method)
export const auth: Auth = initializeAuth(app, {
  persistence: [indexedDBLocalPersistence, browserLocalPersistence],
  popupRedirectResolver: browserPopupRedirectResolver
});

// Initialize Analytics
export const analytics: Analytics = getAnalytics(app);

// Export app instance for other Firebase services
export { app as firebase };
```

---

## /src/utils/animations.js

```javascript
export const pageTransitions = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, staggerChildren: 0.2 }
  },
};

export const containerVariants = {
  initial: { 
    opacity: 0, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      staggerChildren: 0.1 
    }
  },
  exit: { 
    opacity: 0, 
    y: -20 
  }
};

export const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  hover: { scale: 1.05 }
};
```

---

## /src/contexts/AuthContext.tsx

```tsx
// File: /src/contexts/AuthContext.tsx
// Description: Context for authentication using Firebase
// Author: GitHub Copilot
// Created: 2024-02-12

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { AuthService } from '../firebase/auth-service';

export interface AuthContextProps {
  currentUser: User | null;
  isAuthReady: boolean;
  loading: boolean;
  error: string | null;
  login: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const authService = new AuthService();

  useEffect(() => {
    const unsubscribe = authService.auth.onAuthStateChanged((firebaseUser: User | null) => {
      setCurrentUser(firebaseUser);
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      await authService.signInWithGoogle();
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    try {
      setLoading(true);
      await authService.signInWithGoogle();
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.signOut();
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value: AuthContextProps = {
    currentUser,
    isAuthReady,
    loading,
    error,
    login,
    loginWithGoogle,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

---

## /src/contexts/ProfileContext.tsx

```tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Profile {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  learningStyle?: string;
  grade?: string;
}

interface ProfileContextType {
  profile: Profile | null;
  updateProfile: (newProfile: Profile) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null);

  const updateProfile = (newProfile: Profile) => {
    setProfile(newProfile);
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};
```

---

## /src/test/mockThemes.ts

```typescript
import { createTheme } from '@mui/material/styles';
import type { DefaultTheme } from 'styled-components';
import type { Theme } from '@mui/material/styles';

const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      dark: '#115293',
      light: '#4791db'
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350'
    },
    background: {
      paper: '#ffffff',
      default: '#f5f5f5'
    },
    text: {
      primary: '#000000',
      secondary: '#666666'
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536
    }
  }
});

export const mockMuiTheme = muiTheme;

const spacing = Object.assign(
  ((factor: number) => `${0.25 * factor}rem`) as Theme['spacing'],
  {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '2rem',
    xl: '3rem',
  }
);

export const mockStyledTheme: DefaultTheme = {
  ...muiTheme,
  breakpoints: {
    ...muiTheme.breakpoints,
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    large: '1440px'
  },
  spacing,
  colors: {
    border: '#e0e0e0',
    text: '#000000',
    background: {
      hover: '#f5f5f5'
    },
    error: {
      main: '#d32f2f',
      light: '#ffebee'
    }
  },
  borderRadius: {
    default: '4px'
  }
};
```

---

## /src/test/setup.ts

```typescript
// File: /src/test/setup.ts
// Description: Jest setup file for testing environment configuration.

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import React from 'react';

// Run cleanup after each test
afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

// Mock react-icons
jest.mock('react-icons/fc', () => ({
  FcGoogle: function MockGoogleIcon() {
    return React.createElement('span', { 'data-testid': 'google-icon' }, 'Google Icon');
  }
}));

// Mock Firebase Auth
jest.mock('firebase/auth');

// Mock Firebase Config
jest.mock('../firebase/config', () => ({
  auth: jest.fn(),
  googleProvider: {
    setCustomParameters: jest.fn()
  }
}));
```

---

## /src/test/testUtils.tsx

```tsx
import React from "react";
import { render, RenderOptions, RenderResult } from "@testing-library/react";
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { AuthContext, type AuthContextProps } from "../contexts/AuthContext";
import '@testing-library/jest-dom';
import { mockMuiTheme, mockStyledTheme } from "./mockThemes";

// Enable React Router v7 future flags
const future = {
  v7_startTransition: true,
  v7_relativeSplatPath: true
};

export const mockLoginWithGoogle = jest.fn();

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  withRouter?: boolean;
  mockAuthValue?: Partial<AuthContextProps>;
}

export const renderWithProviders = (
  ui: React.ReactNode,
  { withRouter = true, mockAuthValue = {}, ...options }: RenderWithProvidersOptions = {}
): RenderResult => {
  const defaultAuthValue: AuthContextProps = {
    currentUser: null,
    isAuthReady: true,
    loading: false,
    error: null,
    login: mockLoginWithGoogle,
    loginWithGoogle: mockLoginWithGoogle,
    logout: jest.fn(),
    clearError: jest.fn(),
    ...mockAuthValue
  };

  const Providers = ({ children }: { children: React.ReactNode }) => (
    <MUIThemeProvider theme={mockMuiTheme}>
      <StyledThemeProvider theme={mockStyledTheme}>
        <AuthContext.Provider value={defaultAuthValue}>
          {children}
        </AuthContext.Provider>
      </StyledThemeProvider>
    </MUIThemeProvider>
  );

  if (withRouter) {
    const router = createMemoryRouter(
      [{ path: "*", element: <Providers>{ui}</Providers> }],
      { 
        initialEntries: ['/'],
        future
      }
    );
    return render(<RouterProvider router={router} future={future} />, options);
  }

  return render(<Providers>{ui}</Providers>, options);
};
```

---

## /src/styles/global.css

```css
:root {
  /* Colors */
  --primary-color: #2C3E50;
  --secondary-color: #E74C3C;
  --accent-color: #3498DB;
  --text-color: #333;
  --light-bg: #f8f9fa;
  --white: #ffffff;
  
  /* Layout */
  --header-height: 64px;
  --max-width: 1200px;
  --border-radius: 8px;
  
  /* Spacing */
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  
  /* Typography */
  --font-family: 'Arial', sans-serif;
  --line-height: 1.6;
}

/* Global Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-family);
  line-height: var(--line-height);
  color: var(--text-color);
}

/* Layout Components */
.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--spacing-lg);
  width: 100%;
}

.page-container {
  padding-top: var(--header-height);
}

/* Common Components */
.card {
  background: var(--white);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--border-radius);
  text-decoration: none;
  font-weight: 500;
  transition: transform 0.2s;
  cursor: pointer;
}

.btn-primary {
  background-color: var(--accent-color);
  color: var(--white);
  border: none;
}

.btn-secondary {
  background-color: var(--white);
  border: 1px solid var(--accent-color);
  color: var(--accent-color);
}

.btn:hover {
  transform: translateY(-2px);
}

/* Forms */
.form-group {
  margin-bottom: var(--spacing-md);
}

.form-label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  font-family: inherit;
}

/* Responsive Utilities */
@media (max-width: 768px) {
  .container {
    padding: var(--spacing-sm);
  }
}
```

---

## /src/styles/global.ts

```typescript
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: ${({ theme }) => theme.palette.background.default};
    color: ${({ theme }) => theme.palette.text.primary};
    line-height: 1.5;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    border: none;
    background: none;
    cursor: pointer;
    font: inherit;
  }

  ul, ol {
    list-style: none;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.2;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    html {
      font-size: 14px;
    }
  }
`;

export default GlobalStyle;
```

---

## /src/styles/theme.js

```javascript

```

---

## /src/styles/components/common.ts

```typescript
import styled from 'styled-components';
import { motion as m } from 'framer-motion';
import { DefaultTheme } from 'styled-components';

interface ThemeProps {
  theme: DefaultTheme;
}

interface ButtonProps extends ThemeProps {
  $variant?: 'primary' | 'secondary';
}

export const Container = styled(m.div)`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }: ThemeProps) => theme.spacing.md};
`;

export const Section = styled.section`
  padding: ${({ theme }: ThemeProps) => theme.spacing.xl} 0;
`;

export const Card = styled(m.div)`
  background: ${({ theme }: ThemeProps) => theme.palette.background.paper};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: ${({ theme }: ThemeProps) => theme.spacing.lg};
`;

export const Button = styled(m.button)<{ $variant?: 'primary' | 'secondary' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }: ThemeProps) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-radius: 4px;
  font-weight: 600;
  background: ${({ theme, $variant }: ButtonProps) => 
    $variant === 'secondary' 
      ? theme.palette.secondary.main 
      : theme.palette.primary.main};
  color: white;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme, $variant }: ButtonProps) => 
      $variant === 'secondary' 
        ? theme.palette.secondary.dark 
        : theme.palette.primary.dark};
  }
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.palette.primary.main};
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const StylesGrid = styled(m.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const StyleCard = styled(m.div)`
  padding: 2rem;
  text-align: center;
  background: ${({ theme }) => theme.palette.background.paper};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;
```

---

## /.vscode/settings.json

```json
{
    "github.copilot.chat.followUps": "always",
    "github.copilot.chat.scopeSelection": true,
    "github.copilot.chat.edits.codesearch.enabled": true,
    "github.copilot.nextEditSuggestions.enabled": true,
    "github.copilot.chat.completionContext.typescript.mode": "on",
    "github.copilot.chat.editor.temporalContext.enabled": true,
    "github.copilot.chat.enableUserPreferences": true,
    "github.copilot.chat.generateTests.codeLens": true,
    "github.copilot.chat.languageContext.typescript.enabled": true,
    "github.copilot.chat.search.semanticTextResults": true,
    "files.autoSave": "afterDelay",
    "editor.wordWrap": "on",
    "github.copilot.chat.codeGeneration.useInstructionFiles": true,
    "github.copilot.chat.edits.temporalContext.enabled": true,

    "github.copilot.chat.testGeneration.instructions": [
        {
            "file": "",
            "filePattern": "src/**/*.test.tsx",
            "instructions": "Generate unit tests using Jest & React Testing Library. Cover both success and failure cases. Use Mock Service Worker (MSW) for API mocking."
        },
        {
            "file": "",
            "filePattern": "backend/tests/**/*.py",
            "instructions": "Use FastAPI TestClient and Pytest for backend tests. Ensure JWT authentication and RBAC security tests are included."
        },
        {
            "file": "",
            "filePattern": "src/pages/**/*.test.tsx",
            "instructions": "For integration tests, use Cypress with end-to-end scenarios covering user authentication, navigation, and API calls."
        }
    ],

    "github.copilot.chat.commitMessageGeneration.instructions": [
        {
            "file": "",
            "filePattern": "*",
            "instructions": "Format commit messages using Conventional Commits: `feat:`, `fix:`, `chore:`, `test:`, `docs:`, `refactor:`. Provide a short, clear summary in the present tense."
        }
    ],

    "github.copilot.chat.reviewSelection.instructions": [
        {
            "file": "",
            "filePattern": "src/**/*.tsx",
            "instructions": "Ensure TypeScript compliance, proper prop typing, and React best practices. Avoid inline styles; prefer Styled Components or Tailwind CSS."
        },
        {
            "file": "",
            "filePattern": "backend/**/*.py",
            "instructions": "Ensure FastAPI routes use Pydantic models for validation, JWT authentication, and RBAC. Implement proper error handling and response models."
        },
        {
            "file": "",
            "filePattern": ".github/workflows/*.yml",
            "instructions": "Validate CI/CD pipeline integrity. Ensure workflows include ESLint, Jest, Cypress, and dependency security scans."
        }
    ],

    "github.copilot.chat.codeReview.instructions": [
        {
            "file": "",
            "filePattern": "src/**/*.tsx",
            "instructions": "Check for performance optimizations, React hooks best practices, and clean code formatting. Ensure absolute imports are used."
        },
        {
            "file": "",
            "filePattern": "backend/**/*.py",
            "instructions": "Validate API endpoint security, response models, and authentication handling. Ensure database queries use ORM best practices."
        },
        {
            "file": "",
            "filePattern": "firestore.rules",
            "instructions": "Ensure Firestore security rules enforce RBAC. No public read/write access unless explicitly required."
        }
    ],
    "github-actions.workflows.pinned.workflows": []
}
```

---

## /dataconnect-generated/js/default-connector/README.md

```markdown
#  Generated TypeScript README
This README will guide you through the process of using the generated TypeScript SDK package for the connector `default`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

You can use this generated SDK by importing from the package `@firebasegen/default-connector` as shown below. Both CommonJS and ESM imports are supported.
You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

# Accessing the connector
A connector is a collection of queries and mutations. One SDK is generated for each connector - this SDK is generated for the connector `default`.

You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

In order to call Data Connect queries and mutations, you need to create an instance of the connector in your application code.

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/default-connector';

const connector: DataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```javascript
// add connectDataConnectEmulator to your imports 
import { connectDataConnectEmulator, getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/default-connector';

const connector: DataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(connector, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK. 

# Queries
No queries were generated for the `default` connector.

If you want to learn more about how to use queries in Data Connect, you can follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

# Mutations
No mutations were generated for the `default` connector.

If you want to learn more about how to use mutations in Data Connect, you can follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).
```

---

## /dataconnect-generated/js/default-connector/index.cjs.js

```javascript
const connectorConfig = {
  connector: 'default',
  service: 'geaux-academy',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;
```

---

## /dataconnect-generated/js/default-connector/index.d.ts

```typescript
import { ConnectorConfig, DataConnect } from 'firebase/data-connect';
export const connectorConfig: ConnectorConfig;

export type TimestampString = string;

export type UUIDString = string;

export type Int64String = string;

export type DateString = string;
```

---

## /dataconnect-generated/js/default-connector/package.json

```json
{
  "name": "@firebasegen/default-connector",
  "version": "1.0.0",
  "author": "Firebase <firebase-support@google.com> (https://firebase.google.com/)",
  "description": "Generated SDK For default",
  "license": "Apache-2.0",
  "engines": {
    "node": " >=18.0"
  },
  "typings": "index.d.ts",
  "module": "esm/index.esm.js",
  "main": "index.cjs.js",
  "browser": "esm/index.esm.js",
  "exports": {
    ".": {
      "types": "./index.d.ts",
      "require": "./index.cjs.js",
      "default": "./esm/index.esm.js"
    },
    "./package.json": "./package.json"
  },
  "peerDependencies": {
    "firebase": "^10.14.0 || ^11.0.0"
  }
}
```

---

## /dataconnect-generated/js/default-connector/esm/index.esm.js

```javascript
export const connectorConfig = {
  connector: 'default',
  service: 'geaux-academy',
  location: 'us-central1'
};
```

---

## /dataconnect-generated/js/default-connector/esm/package.json

```json
{"type":"module"}
```

---


```

## backend/Artifacts/codecopy/react_codebase_part19.md

```
# React Application Structure and Content - Part 19

Generated on: 2025-02-17 09:19:40

## /public/images/logo.svg (continued)

```plaintext
```

---


```

## backend/Artifacts/codecopy/react_codebase_part4.md

```
# React Application Structure and Content - Part 4

Generated on: 2025-02-17 09:19:40

## /package.json

```json
{
  "name": "geaux-academy",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "engines": {
    "node": ">=18.20.6",
    "npm": ">=8.0.0"
  },
  "scripts": {
    "start": "vite",
    "dev": "node scripts/generate-certs.js && vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "serve": "firebase emulators:start",
    "deploy": "firebase deploy",
    "ci": "npm ci --legacy-peer-deps && npm run lint && npm test && npm run build",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "prepare": "git rev-parse --git-dir > /dev/null 2>&1 && husky install || true"
  },
  "dependencies": {
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.0",
    "@firebasegen/default-connector": "file:dataconnect-generated/js/default-connector",
    "@fontsource/poppins": "^5.1.1",
    "@fontsource/roboto": "^5.1.1",
    "@fortawesome/fontawesome-svg-core": "^6.7.2",
    "@fortawesome/free-solid-svg-icons": "^6.7.2",
    "@fortawesome/react-fontawesome": "^0.2.2",
    "@genkit-ai/googleai": "0.9.12",
    "@langchain/openai": "^0.4.2",
    "@mui/icons-material": "^6.4.4",
    "@mui/material": "^6.4.3",
    "@mui/styles": "^6.4.3",
    "@reduxjs/toolkit": "^2.5.0",
    "@vitejs/plugin-vue": "^5.2.1",
    "@vue/compiler-sfc": "^3.5.13",
    "axios": "^1.7.9",
    "chart.js": "^4.4.7",
    "dotenv": "^16.4.7",
    "express": "^4.18.2",
    "firebase": "^11.3.1",
    "firebase-admin": "12.7.0",
    "firebase-functions": "^4.4.1",
    "framer-motion": "^12.0.6",
    "genkit": "0.9.12",
    "google-auth-library": "^9.15.1",
    "google-gax": "^4.4.1",
    "langchain": "^0.3.13",
    "prettier": "^3.4.2",
    "react": "^18.0.0",
    "react-chartjs-2": "^5.3.0",
    "react-dom": "^18.0.0",
    "react-icons": "^5.4.0",
    "react-redux": "^9.2.0",
    "react-router": "^6.22.0",
    "react-router-dom": "^6.22.0",
    "styled-components": "^6.1.15",
    "vue": "^3.5.13",
    "vue-chartjs": "^5.3.2"
  },
  "devDependencies": {
    "@babel/preset-env": "^7.26.9",
    "@babel/preset-react": "^7.26.3",
    "@eslint/js": "^8.45.0",
    "@firebase/app-types": "^0.9.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^14.3.1",
    "@testing-library/user-event": "^14.6.1",
    "@types/jest": "29.5.12",
    "@types/node": "^22.13.1",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@typescript-eslint/eslint-plugin": "^5.62.0",
    "@typescript-eslint/parser": "^5.62.0",
    "@typescript-eslint/typescript-estree": "^6.0.0",
    "@vitejs/plugin-react": "^4.3.4",
    "@vitest/coverage-v8": "^1.6.1",
    "babel-jest": "^29.7.0",
    "eslint": "^8.0.0",
    "eslint-import-resolver-typescript": "^3.7.0",
    "eslint-plugin-import": "^2.31.0",
    "eslint-plugin-react": "^7.37.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.16",
    "eslint-plugin-vue": "^9.32.0",
    "firebase-functions-test": "^3.1.0",
    "genkit-cli": "^1.0.0",
    "glob": "^10.3.10",
    "globals": "^15.14.0",
    "husky": "^9.1.7",
    "identity-obj-proxy": "^3.0.0",
    "jest": "^29.0.0",
    "jest-environment-jsdom": "^29.7.0",
    "jsdom": "^22.1.0",
    "lru-cache": "^10.2.0",
    "prettier-eslint": "^15.0.0",
    "rimraf": "^5.0.5",
    "selfsigned": "^2.4.1",
    "ts-jest": "^29.0.0",
    "tsx": "^4.19.2",
    "typescript": "^5.1.6",
    "typescript-eslint": "^8.24.0",
    "vite": "^6.1.0",
    "vitest": "^1.6.1",
    "vue-loader": "^17.4.2"
  },
  "overrides": {
    "glob": "^10.3.10",
    "rimraf": "^5.0.5"
  }
}
```

---

## /react.md

```markdown
npm create vite@latest geaux-academy -- --template react
cd geaux-academy
npm install
Now, let's create the component structure:

First, let's set up the folder structure:
src/
├── components/
│   ├── layout/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── Navigation.jsx
│   ├── home/
│   │   ├── Hero.jsx
│   │   ├── Features.jsx
│   │   └── LearningStyles.jsx
│   └── common/
│       ├── Button.jsx
│       └── Card.jsx
├── assets/
├── styles/
├── utils/
└── App.jsx
Let's create the main components:
App.jsx:

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Features from './pages/Features';
import Curriculum from './pages/Curriculum';
import LearningStyles from './pages/LearningStyles';
import Contact from './pages/Contact';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/curriculum" element={<Curriculum />} />
            <Route path="/learning-styles" element={<LearningStyles />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
components/layout/Header.jsx:

import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import './Header.css';

const Header = () => {
  return (
    <header className="main-header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <img src="/logo.png" alt="Geaux Academy Logo" />
          </Link>
        </div>
        <Navigation />
        <div className="auth-buttons">
          <Link to="/login" className="btn btn-login">Login</Link>
          <Link to="/signup" className="btn btn-signup">Sign Up</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
components/layout/Navigation.jsx:

import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Navigation.css';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="main-nav">
      <button className="mobile-menu-toggle" onClick={toggleMenu}>
        <span className="hamburger"></span>
      </button>
      
      <ul className={`nav-links \${isOpen ? 'active' : ''}`}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/features">Features</Link></li>
        <li><Link to="/curriculum">Curriculum</Link></li>
        <li><Link to="/learning-styles">Learning Styles</Link></li>
        <li><Link to="/contact">Contact Us</Link></li>
      </ul>
    </nav>
  );
};

export default Navigation;
components/home/Hero.jsx:

import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Empowering Personalized Learning for Every Student</h1>
        <p>Discover your unique learning style and unlock your full potential</p>
        <div className="hero-cta">
          <Link to="/assessment" className="btn btn-primary">
            Take a Free Learning Style Assessment
          </Link>
          <Link to="/courses" className="btn btn-secondary">
            Explore Courses
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
components/home/Features.jsx:

import Card from '../common/Card';
import './Features.css';

const Features = () => {
  const features = [
    {
      icon: "road",
      title: "Personalized Learning Paths",
      description: "Tailored curriculum based on your unique learning style"
    },
    {
      icon: "trophy",
      title: "Gamification Rewards",
      description: "Earn rewards while you learn and stay motivated"
    },
    {
      icon: "chart-line",
      title: "Dynamic Progress Tracking",
      description: "Monitor your growth with real-time analytics"
    }
  ];

  return (
    <section className="features">
      <h2>Why Choose Geaux Academy</h2>
      <div className="features-grid">
        {features.map((feature, index) => (
          <Card
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
};

export default Features;
Install necessary dependencies:
npm install react-router-dom @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons styled-components
Create a basic styles file (styles/global.css):
:root {
  --primary-color: #2C3E50;
  --secondary-color: #E74C3C;
  --accent-color: #3498DB;
  --text-color: #333;
  --light-bg: #f8f9fa;
  --white: #ffffff;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  color: var(--text-color);
}

.btn {
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: var(--primary-color);
  color: var(--white);
}

.btn-secondary {
  background-color: var(--secondary-color);
  color: var(--white);
}
Create a reusable Card component (components/common/Card.jsx):
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Card.css';

const Card = ({ icon, title, description }) => {
  return (
    <div className="card">
      <div className="card-icon">
        <FontAwesomeIcon icon={icon} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default Card;


State Management:
npm install @reduxjs/toolkit react-redux
# or
npm install zustand
Example Redux store setup:

[plugin:vite:import-analysis] Failed to resolve import "./pages/Home" from "src/App.jsx". Does the file exist?
/home/wicked/GeauxCrewAI/GeauxCrewAI/geaux-academy/src/App.jsx:4:17
18 |  import Header from "./components/layout/Header";
19 |  import Footer from "./components/layout/Footer";
20 |  import Home from "./pages/Home";
   |                    ^
21 |  import About from "./pages/About";
22 |  import Features from "./pages/Features";
# .env.development
VITE_API_URL=http://localhost:3000/api
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
Form Handling with Validation:
npm install react-hook-form yup
// components/forms/AssessmentForm.jsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
});

const AssessmentForm = () => {
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
};
Testing Setup:
npm install -D vitest @testing-library/react @testing-library/jest-dom
// src/__tests__/Hero.test.jsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Hero from '../components/home/Hero';

describe('Hero Component', () => {
  it('renders hero title', () => {
    render(<Hero />);
    expect(screen.getByText(/Empowering Personalized Learning/i)).toBeInTheDocument();
  });
});
Performance Optimization:
// components/ImageOptimized.jsx
import { lazy, Suspense } from 'react';

const ImageOptimized = ({ src, alt, ...props }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        {...props}
      />
    </Suspense>
  );
};
Internationalization:
npm install react-i18next i18next
Analytics Integration:
// utils/analytics.js
export const trackEvent = (eventName, properties) => {
  if (typeof window !== 'undefined') {
    // Google Analytics
    window.gtag('event', eventName, properties);
    
    // Or other analytics services
  }
};
Progressive Web App Setup:
npm install vite-plugin-pwa
These additions will help create a more robust and production-ready application. Would you like me to elaborate on any of these features or provide more specific implementation details?


user avatar
can  you give me everything for .github folder to assist copilot in building this application for my github repository

model avatar
I'll create a comprehensive .github folder structure with workflows, templates, and configurations to help GitHub Copilot better understand and assist with the Geaux Academy project.

First, create the following structure:
.github/
├── ISSUE_TEMPLATE/
│   ├── bug_report.md
│   ├── feature_request.md
│   └── custom.md
├── workflows/
│   ├── ci.yml
│   ├── deploy.yml
│   └── dependency-review.yml
├── CODEOWNERS
├── CONTRIBUTING.md
├── pull_request_template.md
└── dependabot.yml
Bug Report Template (.github/ISSUE_TEMPLATE/bug_report.md):
---
name: Bug Report
about: Create a report to help us improve Geaux Academy
title: '[BUG] '
labels: bug
assignees: ''
---

**Describe the Bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g., iOS]
 - Browser: [e.g., chrome, safari]
 - Version: [e.g., 22]
 - Device: [e.g., iPhone 6, desktop]

**Additional Context**
Add any other context about the problem here.
Feature Request Template (.github/ISSUE_TEMPLATE/feature_request.md):
---
name: Feature Request
about: Suggest an idea for Geaux Academy
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.
CI Workflow (.github/workflows/ci.yml):
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [16.x, 18.x]

    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js \${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: \${{ matrix.node-version }}
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run linting
      run: npm run lint
      
    - name: Run tests
      run: npm test
      
    - name: Build
      run: npm run build

    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: build-files
        path: dist/
Deploy Workflow (.github/workflows/deploy.yml):
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18.x'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      env:
        VITE_API_URL: \${{ secrets.VITE_API_URL }}
        
    - name: Deploy to production
      uses: FirebaseExtended/action-hosting-deploy@v0
      with:
        repoToken: '\${{ secrets.GITHUB_TOKEN }}'
        firebaseServiceAccount: '\${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
        channelId: live
CODEOWNERS (.github/CODEOWNERS):
# These owners will be the default owners for everything in the repo
*       @project-lead @tech-lead

# Frontend specific files
/src/components/  @frontend-team
/src/styles/      @frontend-team

# Backend specific files
/server/          @backend-team

# Configuration files
/*.config.js      @tech-lead
/*.json           @tech-lead
Contributing Guidelines (.github/CONTRIBUTING.md):
# Contributing to Geaux Academy

## Development Process
1. Fork the repository
2. Create a new branch from `develop`
3. Make your changes
4. Write or update tests
5. Submit a pull request

## Commit Message Format
Use conventional commits format:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes
- refactor: Code refactoring
- test: Test updates
- chore: Build process or auxiliary tool changes

## Pull Request Process
1. Update the README.md with details of changes if needed
2. Update the CHANGELOG.md
3. The PR must pass all CI checks
4. Get approval from at least one maintainer

## Code Style
- Follow the ESLint configuration
- Write meaningful component and variable names
- Include JSDoc comments for complex functions
- Write unit tests for new features

## Branch Naming
- feature/description
- bugfix/description
- hotfix/description
- release/version

## Testing
- Write unit tests for new components
- Update existing tests when modifying components
- Ensure all tests pass before submitting PR
Pull Request Template (.github/pull_request_template.md):
## Description
Please include a summary of the change and which issue is fixed.

Fixes # (issue)

## Type of change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?
Please describe the tests that you ran to verify your changes.

## Checklist:
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
Dependabot Configuration (.github/dependabot.yml):
version: 2
updates:
  # Maintain dependencies for npm
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    target-branch: "develop"
    labels:
      - "dependencies"
      - "automerge"
    commit-message:
      prefix: "chore"
      include: "scope"
    
  # Maintain dependencies for GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
    labels:
      - "dependencies"
      - "automerge"
Security Policy (.github/SECURITY.md):
# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within Geaux Academy, please send an email to security@geauxacademy.com. All security vulnerabilities will be promptly addressed.

Please include:
- Type of issue
-

user avatar
Conti

model avatar
Continuing with the Security Policy and additional GitHub configurations:

Security Policy (.github/SECURITY.md) continued:
# Security Policy (continued)

## Reporting a Vulnerability

Please include:
- Type of issue
- Full paths of source file(s) related to the issue
- Location of the affected source code
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

## Security Update Process

1. The security team will acknowledge receipt of your vulnerability report within 48 hours
2. We will confirm the vulnerability and determine its impact
3. We will release a patch as soon as possible depending on complexity

## Security Best Practices for Contributors

1. Never commit sensitive credentials
2. Use environment variables for configuration
3. Keep dependencies updated
4. Follow secure coding guidelines
5. Implement proper input validation
6. Use proper authentication and authorization
Labels Configuration (.github/labels.yml):
- name: "bug"
  color: "d73a4a"
  description: "Something isn't working"

- name: "documentation"
  color: "0075ca"
  description: "Improvements or additions to documentation"

- name: "enhancement"
  color: "a2eeef"
  description: "New feature or request"

- name: "good first issue"
  color: "7057ff"
  description: "Good for newcomers"

- name: "help wanted"
  color: "008672"
  description: "Extra attention is needed"

- name: "priority: high"
  color: "d93f0b"
  description: "Needs immediate attention"

- name: "priority: low"
  color: "0e8a16"
  description: "Can wait for later"

- name: "testing"
  color: "fbca04"
  description: "Related to testing"

- name: "frontend"
  color: "1d76db"
  description: "Related to frontend"

- name: "backend"
  color: "0052cc"
  description: "Related to backend"
Issue Template Config (.github/ISSUE_TEMPLATE/config.yml):
blank_issues_enabled: false
contact_links:
  - name: Geaux Academy Support
    url: https://geauxacademy.com/support
    about: Please visit our support page for immediate assistance
  - name: Documentation
    url: https://docs.geauxacademy.com
    about: Check our documentation for answers to common questions
  - name: Community Forum
    url: https://community.geauxacademy.com
    about: Discuss with the community about features and issues
Stale Bot Configuration (.github/stale.yml):
# Configuration for probot-stale - https://github.com/probot/stale

# Number of days of inactivity before an Issue or Pull Request becomes stale
daysUntilStale: 60

# Number of days of inactivity before an Issue or Pull Request with the stale label is closed
daysUntilClose: 7

# Issues or Pull Requests with these labels will never be considered stale
exemptLabels:
  - pinned
  - security
  - "priority: high"

# Label to use when marking as stale
staleLabel: stale

# Comment to post when marking as stale
markComment: >
  This issue has been automatically marked as stale because it has not had
  recent activity. It will be closed if no further activity occurs. Thank you
  for your contributions.

# Comment to post when closing a stale Issue or Pull Request
closeComment: >
  This issue has been automatically closed due to inactivity. Please feel free
  to reopen it if the issue still exists.

# Limit the number of actions per hour, from 1-30. Default is 30
limitPerRun: 30
Release Workflow (.github/workflows/release.yml):
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18.x'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Generate changelog
        id: changelog
        uses: actions/github-script@v6
        with:
          script: |
            const { data: releases } = await github.rest.repos.listReleases({
              owner: context.repo.owner,
              repo: context.repo.repo,
            });
            
            const lastRelease = releases[0];
            const commitsSinceRelease = await github.rest.repos.compareCommits({
              owner: context.repo.owner,
              repo: context.repo.repo,
              base: lastRelease.tag_name,
              head: context.sha,
            });
            
            return commitsSinceRelease.data.commits
              .map(commit => `- \${commit.commit.message}`)
              .join('\n');

      - name: Create Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: \${{ github.ref }}
          release_name: Release \${{ github.ref }}
          body: |
            Changes in this Release:
            \${{ steps.changelog.outputs.result }}
          draft: false
          prerelease: false
Environment Configuration (.github/environments.yml):
development:
  protection_rules:
    - type: required_reviewers
      reviewers: []
    - type: wait_timer
      wait_time: 0

staging:
  protection_rules:
    - type: required_reviewers
      reviewers: ["tech-lead"]
    - type: wait_timer
      wait_time: 10

production:
  protection_rules:
    - type: required_reviewers
      reviewers: ["tech-lead", "project-lead"]
    - type: wait_timer
      wait_time: 60
These configurations will help GitHub Copilot understand:

Project structure and conventions
Code review requirements
Security policies
Testing requirements
Deployment processes
Issue and PR templates
Automated workflows
Release management
Environment configurations
Would you like me to provide any additional configurations or explain any of these in more detail?


user avatar
can you complete  the pages i need  pages/
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Features.jsx
│   ├── Curriculum.jsx
│   ├── LearningStyles.jsx
│   └── Contact.jsx

model avatar
I'll create all the necessary page components with proper structure and styling.

First, create a pages directory and add these files:
pages/Home.jsx:

import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import LearningStyles from '../components/home/LearningStyles';
import CallToAction from '../components/home/CallToAction';
import Testimonials from '../components/home/Testimonials';
import styled from 'styled-components';

const Home = () => {
  return (
    <HomeContainer>
      <Hero />
      <Features />
      <LearningStyles />
      <Testimonials />
      <CallToAction />
    </HomeContainer>
  );
};

const HomeContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

export default Home;
pages/About.jsx:

import { motion } from 'framer-motion';
import styled from 'styled-components';

const About = () => {
  return (
    <AboutContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <HeaderSection>
          <h1>About Geaux Academy</h1>
          <p>Empowering students through personalized learning experiences</p>
        </HeaderSection>

        <MissionSection>
          <h2>Our Mission</h2>
          <p>
            At Geaux Academy, we believe every student deserves an education
            tailored to their unique learning style. Our mission is to provide
            innovative, personalized learning solutions that help students reach
            their full potential.
          </p>
        </MissionSection>

        <TeamSection>
          <h2>Our Team</h2>
          <TeamGrid>
            {teamMembers.map((member) => (
              <TeamMember key={member.id}>
                <img src={member.image} alt={member.name} />
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </TeamMember>
            ))}
          </TeamGrid>
        </TeamSection>

        <ValuesSection>
          <h2>Our Values</h2>
          <ValuesList>
            <ValueItem>
              <h3>Innovation</h3>
              <p>Constantly evolving our methods to provide the best learning experience</p>
            </ValueItem>
            <ValueItem>
              <h3>Personalization</h3>
              <p>Tailoring education to individual learning styles</p>
            </ValueItem>
            <ValueItem>
              <h3>Excellence</h3>
              <p>Maintaining high standards in education delivery</p>
            </ValueItem>
          </ValuesList>
        </ValuesSection>
      </motion.div>
    </AboutContainer>
  );
};

const AboutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const HeaderSection = styled.section`
  text-align: center;
  margin-bottom: 4rem;

  h1 {
    font-size: 2.5rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    color: var(--text-color);
  }
`;

// Add remaining styled components...

export default About;
pages/Features.jsx:

import { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const Features = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);

  const features = [
    {
      id: 1,
      title: 'Personalized Learning Paths',
      description: 'Custom-tailored learning experiences based on individual learning styles',
      icon: '�',
      details: [
        'VARK learning style assessment',
        'Adaptive curriculum',
        'Progress tracking',
        'Personalized recommendations'
      ]
    },
    {
      id: 2,
      title: 'Interactive Learning Tools',
      description: 'Engaging tools and resources for enhanced learning',
      icon: '�',
      details: [
        'Virtual labs',
        'Interactive simulations',
        'Real-time feedback',
        'Collaborative tools'
      ]
    },
    // Add more features...
  ];

  return (
    <FeaturesContainer>
      <Header>
        <h1>Platform Features</h1>
        <p>Discover how Geaux Academy transforms learning</p>
      </Header>

      <FeatureGrid>
        {features.map((feature) => (
          <FeatureCard
            key={feature.id}
            onClick={() => setSelectedFeature(feature)}
            as={motion.div}
            whileHover={{ scale: 1.05 }}
          >
            <IconWrapper>{feature.icon}</IconWrapper>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </FeatureCard>
        ))}
      </FeatureGrid>

      <AnimatePresence>
        {selectedFeature && (
          <FeatureModal
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalContent>
              <CloseButton onClick={() => setSelectedFeature(null)}>×</CloseButton>
              <h2>{selectedFeature.title}</h2>
              <ul>
                {selectedFeature.details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </ModalContent>
          </FeatureModal>
        )}
      </AnimatePresence>
    </FeaturesContainer>
  );
};

// Styled components...

export default Features;
pages/Curriculum.jsx:

import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Curriculum = () => {
  const [selectedGrade, setSelectedGrade] = useState('elementary');

  const curriculumData = {
    elementary: {
      subjects: ['Math', 'Science', 'English', 'Social Studies'],
      features: ['Interactive Games', 'Visual Learning', 'Basic Concepts']
    },
    middle: {
      subjects: ['Advanced Math', 'Life Science', 'Literature', 'World History'],
      features: ['Project-Based Learning', 'Group Activities', 'Critical Thinking']
    },
    high: {
      subjects: ['Algebra', 'Biology', 'Composition', 'Economics'],
      features: ['Advanced Concepts', 'Research Projects', 'College Prep']
    }
  };

  return (
    <CurriculumContainer>
      <Header>
        <h1>Curriculum Overview</h1>
        <p>Comprehensive learning paths for every grade level</p>
      </Header>

      <GradeSelector>
        {Object.keys(curriculumData).map((grade) => (
          <GradeButton
            key={grade}
            selected={selectedGrade === grade}
            onClick={() => setSelectedGrade(grade)}
          >
            {grade.charAt(0).toUpperCase() + grade.slice(1)}
          </GradeButton>
        ))}
      </GradeSelector>

      <CurriculumContent
        as={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Subjects

user avatar
cont

model avatar
Continuing with the pages:

pages/Curriculum.jsx (continued):

const Curriculum = () => {
  // ... previous code ...

  return (
    <CurriculumContainer>
      {/* ... previous code ... */}

      <CurriculumContent
        as={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Subjects>
          <h2>Subjects</h2>
          <SubjectGrid>
            {curriculumData[selectedGrade].subjects.map((subject, index) => (
              <SubjectCard key={index}>
                <h3>{subject}</h3>
                <ViewButton>View Details</ViewButton>
              </SubjectCard>
            ))}
          </SubjectGrid>
        </Subjects>

        <Features>
          <h2>Grade-Level Features</h2>
          <FeatureList>
            {curriculumData[selectedGrade].features.map((feature, index) => (
              <FeatureItem key={index}>{feature}</FeatureItem>
            ))}
          </FeatureList>
        </Features>
      </CurriculumContent>
    </CurriculumContainer>
  );
};

const CurriculumContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    font-size: 2.5rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    color: var(--text-color);
  }
`;

// ... add remaining styled components

export default Curriculum;
pages/LearningStyles.jsx:

import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const LearningStyles = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({});

  const questions = [
    {
      id: 1,
      text: "When learning a new skill, I prefer to:",
      options: [
        { id: 'a', text: "Watch a video demonstration", type: "visual" },
        { id: 'b', text: "Listen to verbal instructions", type: "auditory" },
        { id: 'c', text: "Read written instructions", type: "reading" },
        { id: 'd', text: "Try it hands-on", type: "kinesthetic" }
      ]
    },
    // Add more questions...
  ];

  const handleAnswer = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
    if (currentStep < questions.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <StylesContainer>
      <Header>
        <h1>Discover Your Learning Style</h1>
        <p>Take our assessment to find your optimal learning approach</p>
      </Header>

      <AssessmentSection>
        <Progress>
          Question {currentStep} of {questions.length}
        </Progress>

        <QuestionCard
          as={motion.div}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2>{questions[currentStep - 1].text}</h2>
          <OptionsGrid>
            {questions[currentStep - 1].options.map((option) => (
              <OptionButton
                key={option.id}
                onClick={() => handleAnswer(currentStep, option.type)}
              >
                {option.text}
              </OptionButton>
            ))}
          </OptionsGrid>
        </QuestionCard>
      </AssessmentSection>
    </StylesContainer>
  );
};

const StylesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

// ... add remaining styled components

export default LearningStyles;
pages/Contact.jsx:

import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      // Add your form submission logic here
      console.log('Form data:', data);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <ContactContainer>
      <Header>
        <h1>Contact Us</h1>
        <p>Get in touch with our support team</p>
      </Header>

      <ContactSection>
        <ContactInfo>
          <InfoItem>
            <i className="fas fa-map-marker-alt"></i>
            <div>
              <h3>Address</h3>
              <p>123 Education Street<br />Baton Rouge, LA 70803</p>
            </div>
          </InfoItem>
          <InfoItem>
            <i className="fas fa-phone"></i>
            <div>
              <h3>Phone</h3>
              <p>(225) 555-0123</p>
            </div>
          </InfoItem>
          <InfoItem>
            <i className="fas fa-envelope"></i>
            <div>
              <h3>Email</h3>
              <p>support@geauxacademy.com</p>
            </div>
          </InfoItem>
        </ContactInfo>

        <ContactForm onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <label>Name</label>
            <input 
              {...register("name", { required: "Name is required" })}
              placeholder="Your name"
            />
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <label>Email</label>
            <input 
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\$/i,
                  message: "Invalid email address"
                }
              })}
              placeholder="Your email"
            />
            {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <label>Message</label>
            <textarea 
              {...register("message", { required: "Message is required" })}
              placeholder="Your message"
              rows="5"
            />
            {errors.message && <ErrorMessage>{errors.message.message}</ErrorMessage>}
          </FormGroup>

          <SubmitButton type="submit">Send Message</SubmitButton>
        </ContactForm>
      </ContactSection>

      {isSubmitted && (
        <ThankYouMessage
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Thank you for your message! We'll get back to you soon.
        </ThankYouMessage>
      )}
    </ContactContainer>
  );
};

const ContactContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

user avatar
cont

model avatar
Continuing with the Contact.jsx styling and completing the remaining pages:

pages/Contact.jsx (continued):

// ... previous Contact component code ...

const ContactContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    font-size: 2.5rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    color: var(--text-color);
  }
`;

const ContactSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContactInfo = styled.div`
  background-color: var(--light-bg);
  padding: 2rem;
  border-radius: 8px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.5rem;

  i {
    font-size: 1.5rem;
    color: var(--primary-color);
    margin-right: 1rem;
    width: 24px;
  }

  h3 {
    margin-bottom: 0.5rem;
    color: var(--primary-color);
  }
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-weight: 600;
  }

  input, textarea {
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }
  }
`;

const ErrorMessage = styled.span`
  color: #e74c3c;
  font-size: 0.875rem;
`;

const SubmitButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--secondary-color);
  }
`;

const ThankYouMessage = styled(motion.div)`
  text-align: center;
  margin-top: 2rem;
  padding: 1rem;
  background-color: #4caf50;
  color: white;
  border-radius: 4px;
`;

export default Contact;
Now, let's add some shared components that will be used across all pages:

components/shared/PageHeader.jsx:

import styled from 'styled-components';

const PageHeader = ({ title, subtitle }) => {
  return (
    <HeaderContainer>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem 0;

  h1 {
    font-size: 2.5rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    color: var(--text-color);
  }
`;

export default PageHeader;
components/shared/LoadingSpinner.jsx:

import styled, { keyframes } from 'styled-components';

const LoadingSpinner = () => {
  return (
    <SpinnerContainer>
      <Spinner />
    </SpinnerContainer>
  );
};

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid var(--primary-color);
  border-radius: 50%;
  animation: \${spin} 1s linear infinite;
`;

export default LoadingSpinner;
components/shared/ErrorBoundary.jsx:

import React from 'react';
import styled from 'styled-components';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <h2>Oops! Something went wrong.</h2>
          <p>Please try refreshing the page or contact support if the problem persists.</p>
          <button onClick={() => window.location.reload()}>Refresh Page</button>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

const ErrorContainer = styled.div`
  text-align: center;
  padding: 2rem;
  margin: 2rem auto;
  max-width: 600px;

  h2 {
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: var(--secondary-color);
    }
  }
`;

export default ErrorBoundary;
Finally, to ensure proper routing and page transitions, update your App.jsx:

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ErrorBoundary from './components/shared/ErrorBoundary';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Features from './pages/Features';
import Curriculum from './pages/Curriculum';
import LearningStyles from './pages/LearningStyles';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Header />
        <AnimatePresence mode='wait'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/curriculum" element={<Curriculum />} />
            <Route path="/learning-styles" element={<LearningStyles />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </AnimatePresence>
        <Footer />
      </ErrorBoundary>

user avatar
cont

model avatar
Continuing with the App.jsx and adding the remaining necessary configurations:

// App.jsx continued...

import { ThemeProvider } from 'styled-components';
import GlobalStyle from './styles/GlobalStyle';

const theme = {
  colors: {
    primary: '#2C3E50',
    secondary: '#E74C3C',
    accent: '#3498DB',
    background: '#FFFFFF',
    text: '#333333',
    lightBg: '#F8F9FA',
    error: '#E74C3C',
    success: '#2ECC71',
  },
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    large: '1200px',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '2rem',
    xl: '3rem',
  },
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <ErrorBoundary>
          <Header />
          <AnimatePresence mode='wait'>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/features" element={<Features />} />
              <Route path="/curriculum" element={<Curriculum />} />
              <Route path="/learning-styles" element={<LearningStyles />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </AnimatePresence>
          <Footer />
        </ErrorBoundary>
      </Router>
    </ThemeProvider>
  );
}

export default App;
Now, let's add the GlobalStyle:

// styles/GlobalStyle.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    --primary-color: \${props => props.theme.colors.primary};
    --secondary-color: \${props => props.theme.colors.secondary};
    --accent-color: \${props => props.theme.colors.accent};
    --background: \${props => props.theme.colors.background};
    --text-color: \${props => props.theme.colors.text};
    --light-bg: \${props => props.theme.colors.lightBg};
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: var(--text-color);
    background-color: var(--background);
  }

  h1, h2, h3, h4, h5, h6 {
    margin-bottom: 1rem;
    line-height: 1.2;
  }

  p {
    margin-bottom: 1rem;
  }

  a {
    color: var(--primary-color);
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: var(--secondary-color);
    }
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 \${props => props.theme.spacing.md};
  }

  .section {
    padding: \${props => props.theme.spacing.xl} 0;
  }

  @media (max-width: \${props => props.theme.breakpoints.tablet}) {
    html {
      font-size: 14px;
    }
  }
`;

export default GlobalStyle;
Let's also add a utility for animations that can be used across components:

// utils/animations.js
export const pageTransition = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -20,
  },
};

export const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const fadeInUp = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};
And a hooks directory for custom hooks:

// hooks/useScrollToTop.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
};

// hooks/useMediaQuery.js
import { useState, useEffect } from 'react';

export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
};
Finally, let's add a constants file for shared data:

// utils/constants.js
export const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/features', label: 'Features' },
  { path: '/curriculum', label: 'Curriculum' },
  { path: '/learning-styles', label: 'Learning Styles' },
  { path: '/contact', label: 'Contact' },
];

export const SOCIAL_LINKS = [
  { platform: 'Facebook', url: 'https://facebook.com/geauxacademy' },
  { platform: 'Twitter', url: 'https://twitter.com/geauxacademy' },
  { platform: 'Instagram', url: 'https://instagram.com/geauxacademy' },
  { platform: 'LinkedIn', url: 'https://linkedin.com/company/geauxacademy' },
];

export const LEARNING_STYLES = {
  visual: {
    title: 'Visual Learner',
    description: 'You learn best through seeing and observing',
    tips: [
      'Use diagrams and charts',
      'Watch video tutorials',
      'Create mind maps',
    ],
  },
  auditory: {
    title: 'Auditory Learner',
    description: 'You learn best through listening and speaking',
    tips: [
      'Listen to lectures',
      'Participate in group discussions',
      'Use audio recordings',
    ],
  },
  reading: {
    title: 'Reading/Writing Learner',
    description: 'You learn best through written words',
    tips: [
      'Take detailed notes',
      'Read textbooks and articles',
      'Write summaries',
    ],
  },
  kinesthetic: {
    title: 'Kinesthetic Learner',
    description: 'You learn best through doing and experiencing',
    tips: [
      'Hands-on activities',
      'Physical movement while studying',
      'Practice exercises',
    ],
  },

user avatar
cont

model avatar
Continuing with the remaining configurations and utilities:

// utils/constants.js (continued)
  // More constants...
  GRADE_LEVELS: {
    elementary: {
      name: 'Elementary School',
      grades: ['K', '1st', '2nd', '3rd', '4th', '5th'],
      features: [
        'Interactive Learning Games',
        'Basic Skills Development',
        'Foundational Knowledge',
        'Parent-Teacher Communication',
      ],
    },
    middle: {
      name: 'Middle School',
      grades: ['6th', '7th', '8th'],
      features: [
        'Project-Based Learning',
        'Critical Thinking Development',
        'Subject Specialization',
        'Study Skills Building',
      ],
    },
    high: {
      name: 'High School',
      grades: ['9th', '10th', '11th', '12th'],
      features: [
        'Advanced Placement Courses',
        'College Preparation',
        'Career Guidance',
        'Standardized Test Prep',
      ],
    },
  },

  SUBJECTS: {
    math: {
      name: 'Mathematics',
      topics: ['Algebra', 'Geometry', 'Statistics', 'Calculus'],
      icon: '�',
    },
    science: {
      name: 'Science',
      topics: ['Biology', 'Chemistry', 'Physics', 'Environmental Science'],
      icon: '�',
    },
    english: {
      name: 'English Language Arts',
      topics: ['Literature', 'Writing', 'Grammar', 'Comprehension'],
      icon: '�',
    },
    history: {
      name: 'Social Studies',
      topics: ['World History', 'U.S. History', 'Geography', 'Civics'],
      icon: '�',
    },
  },
};
Let's add some utility functions:

// utils/helpers.js
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

export const calculateProgress = (completed, total) => {
  return Math.round((completed / total) * 100);
};

export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-\$)+/g, '');
};

export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+\$/.test(email);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
Add a service for API calls:

// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer \${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh or logout
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  resetPassword: (email) => api.post('/auth/reset-password', { email }),
};

export const userService = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  updatePreferences: (preferences) => api.put('/user/preferences', preferences),
};

export const learningService = {
  getAssessment: () => api.get('/learning/assessment'),
  submitAssessment: (answers) => api.post('/learning/assessment', answers),
  getLearningPath: () => api.get('/learning/path'),
  updateProgress: (progressData) => api.post('/learning/progress', progressData),
};

export const courseService = {
  getCourses: (filters) => api.get('/courses', { params: filters }),
  getCourseDetails: (courseId) => api.get(`/courses/\${courseId}`),
  enrollCourse: (courseId) => api.post(`/courses/\${courseId}/enroll`),
  getProgress: (courseId) => api.get(`/courses/\${courseId}/progress`),
};
Add context for managing global state:

// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await authService.getProfile();
        setUser(response.data);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);
  };

  const logout = async () => {
    await authService.logout();
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
Add a context for managing learning styles:

// context/LearningStyleContext.jsx
import { createContext, useContext, useState } from 'react';
import { learningService } from '../services/api';

const LearningStyleContext = createContext({});

export const LearningStyleProvider = ({ children }) => {
  const [learningStyle, setLearningStyle] = useState(null);
  const [assessmentProgress, setAssessmentProgress] = useState(0);

  const startAssessment = async () => {
    try {
      const response = await learningService.getAssessment();
      return response.data;
    } catch (error) {
      console.error('Failed to start assessment:', error);
      throw error;
    }
  };

  const submitAssessment = async (answers) => {
    try {
      const response = await learningService.submitAssessment(answers);
      setLearningStyle(response.data.style);
      return response.data;
    } catch (error) {
      console.error('Failed to submit assessment:', error);
      throw error;
    }
  };

  return (
    <LearningStyleContext.

user avatar
cont


model avatar
Continuing with the LearningStyleContext and adding more necessary configurations:

// context/LearningStyleContext.jsx (continued)
    <LearningStyleContext.Provider 
      value={{ 
        learningStyle, 
        assessmentProgress, 
        startAssessment, 
        submitAssessment,
        setAssessmentProgress 
      }}
    >
      {children}
    </LearningStyleContext.Provider>
  );
};

export const useLearningStyle = () => useContext(LearningStyleContext);
Add a context for managing the curriculum:

// context/CurriculumContext.jsx
import { createContext, useContext, useState } from 'react';
import { courseService } from '../services/api';

const CurriculumContext = createContext({});

export const CurriculumProvider = ({ children }) => {
  const [currentCourse, setCurrentCourse] = useState(null);
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(false);

  const loadCourse = async (courseId) => {
    setLoading(true);
    try {
      const response = await courseService.getCourseDetails(courseId);
      setCurrentCourse(response.data);
      const progressResponse = await courseService.getProgress(courseId);
      setUserProgress(progressResponse.data);
    } catch (error) {
      console.error('Failed to load course:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (courseId, progressData) => {
    try {
      const response = await courseService.updateProgress(courseId, progressData);
      setUserProgress(prev => ({
        ...prev,
        [courseId]: response.data
      }));
    } catch (error) {
      console.error('Failed to update progress:', error);
      throw error;
    }
  };

  return (
    <CurriculumContext.Provider 
      value={{ 
        currentCourse,
        userProgress,
        loading,
        loadCourse,
        updateProgress
      }}
    >
      {children}
    </CurriculumContext.Provider>
  );
};

export const useCurriculum = () => useContext(CurriculumContext);
Add error handling utilities:

// utils/errorHandling.js
export class AppError extends Error {
  constructor(message, status = 'error', code = 500) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    return new AppError(
      error.response.data.message || 'Server error',
      'error',
      error.response.status
    );
  } else if (error.request) {
    // Request made but no response
    return new AppError('Network error', 'error', 503);
  } else {
    // Error setting up request
    return new AppError('Application error', 'error', 500);
  }
};

export const errorMessages = {
  network: 'Unable to connect to the server. Please check your internet connection.',
  auth: 'Authentication failed. Please log in again.',
  validation: 'Please check your input and try again.',
  server: 'Something went wrong on our end. Please try again later.',
  notFound: 'The requested resource was not found.',
  permission: 'You do not have permission to perform this action.',
};
Add a provider component to combine all contexts:

// providers/AppProvider.jsx
import { AuthProvider } from '../context/AuthContext';
import { LearningStyleProvider } from '../context/LearningStyleContext';
import { CurriculumProvider } from '../context/CurriculumContext';
import { ThemeProvider } from 'styled-components';
import { theme } from '../styles/theme';

const AppProvider = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <LearningStyleProvider>
          <CurriculumProvider>
            {children}
          </CurriculumProvider>
        </LearningStyleProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default AppProvider;
Add configuration for environment variables:

// config/config.js
const config = {
  development: {
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    debug: true,
    analyticsEnabled: false,
  },
  production: {
    apiUrl: import.meta.env.VITE_API_URL,
    debug: false,
    analyticsEnabled: true,
  },
  test: {
    apiUrl: 'http://localhost:3000/api',
    debug: true,
    analyticsEnabled: false,
  },
};

const environment = import.meta.env.MODE || 'development';

export default config[environment];
Update the main index file:

// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AppProvider from './providers/AppProvider';
import { registerSW } from 'virtual:pwa-register';

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  registerSW();
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
Finally, update the App component to use all providers and handle loading states:

// App.jsx
import { useAuth } from './context/AuthContext';
import LoadingSpinner from './components/shared/LoadingSpinner';
import ErrorBoundary from './components/shared/ErrorBoundary';
import { useScrollToTop } from './hooks/useScrollToTop';
import GlobalStyle from './styles/GlobalStyle';

function App() {
  const { loading } = useAuth();
  useScrollToTop();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary>
      <GlobalStyle />
      <Router>
        <Header />
        <AnimatePresence mode='wait'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/curriculum" element={<Curriculum />} />
            <Route path="/learning-styles" element={<LearningStyles />} />
            <Route path="/contact" element={<Contact />} />
            {/* Add more routes as needed */}
          </Routes>
        </AnimatePresence>
        <Footer />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
```

---


```

## backend/Artifacts/learning-assessment/README.md

```
# Learning Assessment & AI Evaluation

## Overview
The Learning Assessment module is responsible for evaluating student learning styles, progress, and educational achievements through AI-powered assessment tools.

## Core Components

### 1. Assessment Engines
- **learning-assessment-algorithms.py**: Core assessment logic
- **learning-style-assessment.py**: VARK model implementation
- **subject-specific-tests.py**: Subject-based evaluation tools
- **style-specific-tests.py**: Learning style-specific assessments

### 2. Scoring & Evaluation
- **assessment-scoring.py**: Scoring logic and metrics
- **advanced-evaluation.py**: Complex evaluation patterns
- **subject-scoring-rubrics.py**: Subject-specific scoring criteria
- **expanded-skill-rubrics.py**: Comprehensive skill evaluation

### 3. Learning Flow
- **learning-style-flow.py**: Learning style progression tracking

## Key Features
- AI-powered learning style detection
- Real-time assessment adaptation
- Multi-dimensional scoring
- Progress tracking
- Personalized evaluation
- Cross-subject assessment

## Technologies
- Python for assessment algorithms
- Machine Learning models for style detection
- Statistical analysis tools
- Data visualization for results
- Real-time processing

## Integration Points
- CrewAI Agent System
- Curriculum Management
- Analytics Dashboard
- Student Profiles
- Progress Reports

## Assessment Types
1. Learning Style Assessment
2. Subject Knowledge Tests
3. Skill Evaluation
4. Progress Checkpoints
5. Adaptive Quizzes

## Data Models
```typescript
interface AssessmentResult {
  studentId: string;
  learningStyle: {
    visual: number;
    auditory: number;
    reading: number;
    kinesthetic: number;
  };
  subjectScores: {
    [subject: string]: number;
  };
  recommendedApproach: string[];
  timestamp: Date;
}
```

## Best Practices
1. Regular calibration of assessment algorithms
2. Maintain assessment security
3. Ensure accessibility compliance
4. Implement progressive difficulty
5. Regular validation of results
6. Store detailed assessment metadata
```

## backend/Artifacts/GASpecialist/Project Structer.md

```
Below you’ll find example repository structures for each of the four core projects in Geaux Specialist LLC. Each project has three main documentation files:

README.md – Overview, Installation, Usage, and Roadmap
CONTRIBUTING.md – Guidelines for external and internal contributors
DEVELOPMENT.md – Detailed instructions for local development, environment configuration, testing, and deployment
Feel free to copy/paste, rename, or adjust these to match your exact technical stack and organizational standards.

1. Geaux Academy
README.md
markdown
Copy code
# Geaux Academy

**Geaux Academy** is a personalized K-12 educational platform with AI-driven learning style assessments, curriculum generation, and student dashboards.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Roadmap](#roadmap)
- [License](#license)

## Overview
Geaux Academy aims to transform the way students learn by providing:
- Customizable course content based on individual learning styles
- Intelligent tutoring and feedback via AI
- Progress tracking for students, parents, and administrators

## Features
1. **Learning Style Assessment**: AI-driven quizzes and analytics  
2. **Dynamic Curriculum Generation**: On-demand creation of lesson materials  
3. **Progress Tracking**: Real-time stats and data visualization  
4. **Role-Based Dashboards**: Separate views for students, parents, and admins

## Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/GeauxSpecialistLLC/geaux-academy.git
Navigate to the project folder:
bash
Copy code
cd geaux-academy
Install dependencies (example with Node.js and Python):
bash
Copy code
# Node.js (frontend)
cd frontend
npm install

# Python (backend)
cd ../backend
pip install -r requirements.txt
Usage
Set up environment variables (see DEVELOPMENT.md for details).
Run the backend (Python FastAPI):
bash
Copy code
uvicorn main:app --host 0.0.0.0 --port 8000
Run the frontend (Next.js):
bash
Copy code
npm run dev
Open your browser at http://localhost:3000 to explore Geaux Academy.
Roadmap
Phase 1: Basic user authentication and learning style quiz
Phase 2: Full AI integration for custom lesson generation
Phase 3: Analytics dashboards, with progress tracking at scale
Phase 4: Beta testing with real users
License
This project is licensed under the MIT License.

css
Copy code

### **CONTRIBUTING.md**
```markdown
# Contributing to Geaux Academy

Thank you for your interest in contributing to **Geaux Academy**! We welcome pull requests, bug reports, and feature suggestions.

## How to Contribute

1. **Fork the Project**  
   Create your own fork of the repository to work on.

2. **Create a New Branch**  
   ```bash
   git checkout -b feature/your-feature-name
Commit Your Changes

Use clear, concise commit messages.
Keep commits focused on a single topic.
Push to Your Fork

bash
Copy code
git push origin feature/your-feature-name
Open a Pull Request

Describe your changes and link any relevant issues.
Ensure your pull request follows the project’s coding style.
Code of Conduct
Please follow our Code of Conduct in all interactions with the project.

Reporting Bugs
Open an issue in the GitHub repository with a clear title and description.
Provide steps to reproduce and the expected/actual behavior.
Feature Requests
Open a Feature Request issue describing the enhancement you’d like to see.
Provide user stories or use cases to help us understand your request.
bash
Copy code

### **DEVELOPMENT.md**
```markdown
# Development Guide – Geaux Academy

This document covers the technical details for setting up a development environment, testing, and deploying **Geaux Academy**.

## Table of Contents
- [Architecture](#architecture)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Testing](#testing)
- [Deployment](#deployment)

## Architecture
- **Frontend**: Next.js + TailwindCSS
- **Backend**: FastAPI (Python) + Node.js microservices (for certain AI tasks)
- **Database**: PostgreSQL + Prisma ORM
- **AI Integration**: OpenAI API, with potential expansions for other providers

## Environment Variables
Create a `.env` file in the backend and frontend directories with the following variables:

```ini
# Backend (Python)
DATABASE_URL=postgresql://username:password@localhost:5432/geaux_academy
OPENAI_API_KEY=your_openai_api_key

# Frontend (Node.js)
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
Local Development
Database Setup
Ensure PostgreSQL is running.
Run migrations (Prisma):
bash
Copy code
npx prisma migrate dev
Backend
Install dependencies and run:
bash
Copy code
pip install -r requirements.txt
uvicorn main:app --reload
Frontend
Install dependencies and run:
bash
Copy code
npm install
npm run dev
Testing
Backend: Use pytest for unit tests and integration tests.
bash
Copy code
pytest --cov
Frontend: Use Jest + React Testing Library.
bash
Copy code
npm run test
Deployment
CI/CD: GitHub Actions or Jenkins for building, testing, and containerizing the application.
Hosting:
Backend: Deploy Docker container to AWS, Azure, or Porter.
Frontend: Deploy static build to Vercel or an S3 bucket (if applicable).
Monitoring:
Integrate application logs with CloudWatch or Datadog.
Use metrics dashboards for performance insights.
csharp
Copy code

---

## 2. Geaux HelpED

### **README.md**
```markdown
# Geaux HelpED

**Geaux HelpED** is a healthcare assistant app that helps caregivers with scheduling, reminders, and patient health tracking. This repository houses the Flutter mobile codebase and Firebase backend rules.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Roadmap](#roadmap)

## Overview
Geaux HelpED focuses on simplifying caregivers’ daily tasks with:
- Patient and caretaker profiles
- Task scheduling and reminders
- Appointment management
- Basic health metrics tracking

## Features
- **Cross-Platform Flutter App** (iOS + Android)
- **Firebase-Integrated** (Firestore, Auth)
- **AI-Powered Task Management** with GPT
- **HIPAA-Compliant** data handling

## Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/GeauxSpecialistLLC/geaux-helped.git
Install Flutter Dependencies:
bash
Copy code
flutter pub get
Configure Firebase using your own google-services.json (Android) and GoogleService-Info.plist (iOS).
Usage
Run the App on an emulator or physical device:
bash
Copy code
flutter run
Log In or Sign Up with email/password or third-party auth (if enabled).
Roadmap
Phase 1: Basic scheduling, reminders, and push notifications
Phase 2: Enhanced health metrics and caretaker-team collaboration
Phase 3: AI-driven insights for task optimization
bash
Copy code

### **CONTRIBUTING.md**
```markdown
# Contributing to Geaux HelpED

We appreciate your help in improving the **Geaux HelpED** platform!

## How to Contribute
1. **Fork & Branch**:
   ```bash
   git checkout -b fix/issue-xxx
Add/Modify Code:
Ensure you follow the Flutter style guide.
Document Your Changes:
Update relevant .md files or code comments.
Submit a Pull Request:
Provide a detailed description, referencing any open issues.
Code of Conduct
Please see CODE_OF_CONDUCT.md for contributor guidelines and behavior expectations.

Tests
Integration Tests: Flutter integration tests for UI flows.
Unit Tests: Dart unit tests for business logic.
less
Copy code

### **DEVELOPMENT.md**
```markdown
# Development Guide – Geaux HelpED

## Environment Setup
- **Flutter SDK**: v3.x or higher
- **Firebase Project**: Create a project in the [Firebase Console](https://console.firebase.google.com/)  
- **Android/iOS Build Tools**: Ensure you have the latest versions installed (Android Studio, Xcode)

## Environment Variables
Although Firebase configs are mostly contained in the `google-services.json` and `GoogleService-Info.plist`, you may add additional config in a `.env` file, e.g., AI keys:
```ini
GPT_API_KEY=your_api_key
Integrate with Flutter using a .env package if needed.

Running the App
Connect Device or open an Emulator.
Run:
bash
Copy code
flutter run
Testing
Dart Tests:
bash
Copy code
flutter test
Integration Tests:
bash
Copy code
flutter drive --target=test_driver/app.dart
Deployment
CI/CD: GitHub Actions or CodeMagic for building APK/IPA.
Release:
Increment version in pubspec.yaml.
Build release APK/IPA.
Deploy to app stores (Google Play, Apple App Store).
yaml
Copy code

---

## 3. ReanimatED Echos

### **README.md**
```markdown
# ReanimatED Echos

**ReanimatED Echos** is an AI voice reanimation platform designed to preserve and recreate the voices of loved ones through digital synthesis.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Ethical Considerations](#ethical-considerations)
- [Roadmap](#roadmap)

## Overview
ReanimatED Echos uses advanced AI speech models to:
- Upload and store audio samples in an encrypted S3 bucket.
- Clone voiceprints with a combination of Whisper for transcription and voice cloning APIs (e.g., ElevenLabs).
- Generate personalized voice outputs.

## Features
- **Secure File Uploads** to S3
- **AI Voice Cloning** (Whisper + ElevenLabs)
- **Consent & Privacy Focus** with user approvals

## Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/GeauxSpecialistLLC/reanimated-echos.git
Install Dependencies:
bash
Copy code
pip install -r requirements.txt
Configure AWS credentials for secure S3 usage.
Usage
Run the Flask App:
bash
Copy code
flask run
Access: Go to http://localhost:5000 to manage your voice profiles.
Ethical Considerations
Voice cloning is sensitive technology. Always ensure:

Consent: Obtain permission from living individuals before uploading audio.
Clear Disclaimers: Inform users about how data is stored and utilized.
Roadmap
Phase 1: Basic upload and voice cloning
Phase 2: Enhanced voice editing and personalization
Phase 3: Integration with additional AI speech services
bash
Copy code

### **CONTRIBUTING.md**
```markdown
# Contributing to ReanimatED Echos

Your help in improving the ReanimatED Echos platform is greatly appreciated.

## Contribution Process
1. **Fork the Repo** and clone locally.
2. **Branch**:
   ```bash
   git checkout -b feature/voice-filter
Make Changes with appropriate docs or comments.
Run Tests to ensure stability.
Pull Request:
Describe the motivation behind your changes.
Reference any open issues or relevant discussions.
Code of Conduct
We follow the Geaux Specialist LLC Code of Conduct. Be respectful and considerate in all communications.

Security
S3 Buckets must remain private; do not expose public read/write permissions.
AWS Keys should only reside in .env or environment variables and never be committed.
shell
Copy code

### **DEVELOPMENT.md**
```markdown
# Development Guide – ReanimatED Echos

## Tech Stack
- **Python Flask** for server-side logic
- **Whisper** for speech-to-text
- **ElevenLabs** for voice generation
- **Amazon S3** for secure storage

## Local Setup
1. **Install Python 3.9+**.
2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
Create .env for environment variables:
ini
Copy code
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
ELEVENLABS_API_KEY=xxx
Run Migrations if using a relational DB for user accounts (optional).
Testing
Pytest:
bash
Copy code
pytest --cov
Integration Tests for voice upload and AI calls:
Mock external services (Whisper, ElevenLabs) to avoid real charges.
Deployment
Containerize with Docker:
dockerfile
Copy code
FROM python:3.9
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
EXPOSE 5000
CMD ["flask", "run", "--host=0.0.0.0"]
AWS ECS or Lambda can be used for serverless approaches.
Monitoring & Logs:
Store logs in CloudWatch
Track AI usage metrics for cost management
csharp
Copy code

---

## 4. Geaux Emporium

### **README.md**
```markdown
# Geaux Emporium

**Geaux Emporium** is an educational marketplace for digital products, including eBooks, premium courses, and learning tools. It integrates with Geaux Academy content to provide a seamless user experience.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Roadmap](#roadmap)

## Overview
By integrating with Geaux Academy, Geaux Emporium allows:
- **Cross-selling** of courses, modules, and eBooks
- **Subscription Plans** for premium users
- **Payment Gateways** with Stripe for secure transactions

## Features
- **WooCommerce Integration** (WordPress)
- **Stripe for Payment** processing
- **Admin Dashboard** for product management
- **User Account Sync** with Geaux Academy

## Installation
1. **Clone Repository**:
   ```bash
   git clone https://github.com/GeauxSpecialistLLC/geaux-emporium.git
Install WordPress and WooCommerce locally or on a server.
Configure the plugin or theme to integrate with your Geaux Academy data endpoints.
Usage
Add Products in the WP admin area.
Checkout with Stripe or other supported gateways.
Sync user data with Geaux Academy for unified user experiences.
Roadmap
Phase 1: Basic eCommerce MVP
Phase 2: Subscription models and recurring billing
Phase 3: Advanced analytics and marketing automation
bash
Copy code

### **CONTRIBUTING.md**
```markdown
# Contributing to Geaux Emporium

We welcome community contributions to enhance the educational marketplace!

## Guidelines
1. **WordPress Best Practices**: Follow WP coding standards.
2. **Security**: Avoid storing sensitive data in plain text. Use secure WordPress functions for input sanitization and output escaping.
3. **Testing**: Provide unit or integration tests for any new functionality.

## How to Contribute
- **Fork & Branch**:
  ```bash
  git checkout -b feature/subscription-module
Pull Request:
Detail the changes with references to open issues.
Include screenshots of UI modifications (if any).
Code of Conduct
Please read and abide by the Geaux Specialist LLC Code of Conduct.

makefile
Copy code

### **DEVELOPMENT.md**
```markdown
# Development Guide – Geaux Emporium

## Architecture
- **Core**: WordPress + WooCommerce
- **Plugin / Theme**: Custom integration with Geaux Academy’s APIs
- **Stripe**: Payment gateway for secure transactions

## Local Development
1. **Local WP Environment**:
   - Use Docker or a local LAMP/LEMP stack to run WordPress.
2. **WooCommerce Setup**:
   - Install WooCommerce plugin and run the setup wizard.
3. **Custom Plugin** (optional):
   - Create a new plugin for integration with Geaux Academy endpoints.

## Environment Variables
For a Docker-based WP environment, create a `.env`:
```ini
WORDPRESS_DB_HOST=db
WORDPRESS_DB_USER=wp_user
WORDPRESS_DB_PASSWORD=wp_password
STRIPE_SECRET_KEY=your_stripe_key
Testing
PHPUnit: For WordPress plugin testing.
bash
Copy code
phpunit --configuration phpunit.xml
Integration Tests: Ensure product purchases sync with Geaux Academy user status.
Deployment
Build & Package:
If using a custom plugin/theme, ensure it’s versioned properly.
Migrate Database: Use WP Migrate DB or a similar tool.
Go Live:
Deploy to a WordPress hosting provider or your own server.
Verify SSL certificates and payment gateway configurations.
markdown
Copy code

---

# Recommendations & Additional Prompts

1. **Monorepo vs. Polyrepo**  
   - Consider whether to maintain a **monorepo** for all Geaux products or keep them in separate repositories. A monorepo can streamline dependency management but may complicate version control for distinct products.

2. **Continuous Integration**  
   - Set up a consistent CI pipeline (e.g., GitHub Actions) for all repos. Each product can have a separate workflow file or share reusable workflow templates.

3. **Security Audits**  
   - Conduct periodic security audits, especially for repositories that handle personal or payment data (Geaux HelpED and Geaux Emporium).

4. **Infrastructure as Code**  
   - Use tools like **Terraform** or **Pulumi** to provision and manage resources (Databases, S3, Docker containers) in a consistent, trackable manner.

5. **Additional Prompt – AI-Powered DevOps**  
   ```markdown
   ### Role: DevOps AI Agent
   You are an AI specialized in deploying, monitoring, and scaling Geaux Specialist LLC's applications. Your tasks:
   1. Generate Terraform files for each product’s infrastructure (AWS/Azure).
   2. Configure logging and metrics dashboards.
   3. Optimize hosting costs and resource utilization.
   4. Document all DevOps procedures in a `DEVOPS.md` file for each repo.
Localization & Accessibility

Ensure that Geaux Academy and Geaux HelpED particularly meet accessibility (WCAG 2.1) and multi-language support for broader audience reach.
Scaling Strategy

Plan out how each service will handle 10,000+ concurrent users or large data sets. This might include horizontal scaling for microservices or using managed cloud databases.
```

## backend/Artifacts/GASpecialist/GeauxAcademy-Dev.md

```
1. Geaux Academy
README.md
markdown
Copy code
# Geaux Academy

**Geaux Academy** is a personalized K-12 educational platform with AI-driven learning style assessments, curriculum generation, and student dashboards.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Roadmap](#roadmap)
- [License](#license)

## Overview
Geaux Academy aims to transform the way students learn by providing:
- Customizable course content based on individual learning styles
- Intelligent tutoring and feedback via AI
- Progress tracking for students, parents, and administrators

## Features
1. **Learning Style Assessment**: AI-driven quizzes and analytics  
2. **Dynamic Curriculum Generation**: On-demand creation of lesson materials  
3. **Progress Tracking**: Real-time stats and data visualization  
4. **Role-Based Dashboards**: Separate views for students, parents, and admins

## Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/GeauxSpecialistLLC/geaux-academy.git
Navigate to the project folder:
bash
Copy code
cd geaux-academy
Install dependencies (example with Node.js and Python):
bash
Copy code
# Node.js (frontend)
cd frontend
npm install

# Python (backend)
cd ../backend
pip install -r requirements.txt
Usage
Set up environment variables (see DEVELOPMENT.md for details).
Run the backend (Python FastAPI):
bash
Copy code
uvicorn main:app --host 0.0.0.0 --port 8000
Run the frontend (Next.js):
bash
Copy code
npm run dev
Open your browser at http://localhost:3000 to explore Geaux Academy.
Roadmap
Phase 1: Basic user authentication and learning style quiz
Phase 2: Full AI integration for custom lesson generation
Phase 3: Analytics dashboards, with progress tracking at scale
Phase 4: Beta testing with real users
License
This project is licensed under the MIT License.

css
Copy code

### **CONTRIBUTING.md**
```markdown
# Contributing to Geaux Academy

Thank you for your interest in contributing to **Geaux Academy**! We welcome pull requests, bug reports, and feature suggestions.

## How to Contribute

1. **Fork the Project**  
   Create your own fork of the repository to work on.

2. **Create a New Branch**  
   ```bash
   git checkout -b feature/your-feature-name
Commit Your Changes

Use clear, concise commit messages.
Keep commits focused on a single topic.
Push to Your Fork

bash
Copy code
git push origin feature/your-feature-name
Open a Pull Request

Describe your changes and link any relevant issues.
Ensure your pull request follows the project’s coding style.
Code of Conduct
Please follow our Code of Conduct in all interactions with the project.

Reporting Bugs
Open an issue in the GitHub repository with a clear title and description.
Provide steps to reproduce and the expected/actual behavior.
Feature Requests
Open a Feature Request issue describing the enhancement you’d like to see.
Provide user stories or use cases to help us understand your request.
bash
Copy code

### **DEVELOPMENT.md**
```markdown
# Development Guide – Geaux Academy

This document covers the technical details for setting up a development environment, testing, and deploying **Geaux Academy**.

## Table of Contents
- [Architecture](#architecture)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Testing](#testing)
- [Deployment](#deployment)

## Architecture
- **Frontend**: Next.js + TailwindCSS
- **Backend**: FastAPI (Python) + Node.js microservices (for certain AI tasks)
- **Database**: PostgreSQL + Prisma ORM
- **AI Integration**: OpenAI API, with potential expansions for other providers

## Environment Variables
Create a `.env` file in the backend and frontend directories with the following variables:

```ini
# Backend (Python)
DATABASE_URL=postgresql://username:password@localhost:5432/geaux_academy
OPENAI_API_KEY=your_openai_api_key

# Frontend (Node.js)
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
Local Development
Database Setup
Ensure PostgreSQL is running.
Run migrations (Prisma):
bash
Copy code
npx prisma migrate dev
Backend
Install dependencies and run:
bash
Copy code
pip install -r requirements.txt
uvicorn main:app --reload
Frontend
Install dependencies and run:
bash
Copy code
npm install
npm run dev
Testing
Backend: Use pytest for unit tests and integration tests.
bash
Copy code
pytest --cov
Frontend: Use Jest + React Testing Library.
bash
Copy code
npm run test
Deployment
CI/CD: GitHub Actions or Jenkins for building, testing, and containerizing the application.
Hosting:
Backend: Deploy Docker container to AWS, Azure, or Porter.
Frontend: Deploy static build to Vercel or an S3 bucket (if applicable).
Monitoring:
Integrate application logs with CloudWatch or Datadog.
Use metrics dashboards for performance insights.
csharp
Copy code

---

## 2. Geaux HelpED

### **README.md**
```markdown
# Geaux HelpED

**Geaux HelpED** is a healthcare assistant app that helps caregivers with scheduling, reminders, and patient health tracking. This repository houses the Flutter mobile codebase and Firebase backend rules.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Roadmap](#roadmap)

## Overview
Geaux HelpED focuses on simplifying caregivers’ daily tasks with:
- Patient and caretaker profiles
- Task scheduling and reminders
- Appointment management
- Basic health metrics tracking

## Features
- **Cross-Platform Flutter App** (iOS + Android)
- **Firebase-Integrated** (Firestore, Auth)
- **AI-Powered Task Management** with GPT
- **HIPAA-Compliant** data handling

## Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/GeauxSpecialistLLC/geaux-helped.git
Install Flutter Dependencies:
bash
Copy code
flutter pub get
Configure Firebase using your own google-services.json (Android) and GoogleService-Info.plist (iOS).
Usage
Run the App on an emulator or physical device:
bash
Copy code
flutter run
Log In or Sign Up with email/password or third-party auth (if enabled).
Roadmap
Phase 1: Basic scheduling, reminders, and push notifications
Phase 2: Enhanced health metrics and caretaker-team collaboration
Phase 3: AI-driven insights for task optimization
bash
Copy code

### **CONTRIBUTING.md**
```markdown
# Contributing to Geaux HelpED

We appreciate your help in improving the **Geaux HelpED** platform!

## How to Contribute
1. **Fork & Branch**:
   ```bash
   git checkout -b fix/issue-xxx
Add/Modify Code:
Ensure you follow the Flutter style guide.
Document Your Changes:
Update relevant .md files or code comments.
Submit a Pull Request:
Provide a detailed description, referencing any open issues.
Code of Conduct
Please see CODE_OF_CONDUCT.md for contributor guidelines and behavior expectations.

Tests
Integration Tests: Flutter integration tests for UI flows.
Unit Tests: Dart unit tests for business logic.
less
Copy code

### **DEVELOPMENT.md**
```markdown
# Development Guide – Geaux HelpED

## Environment Setup
- **Flutter SDK**: v3.x or higher
- **Firebase Project**: Create a project in the [Firebase Console](https://console.firebase.google.com/)  
- **Android/iOS Build Tools**: Ensure you have the latest versions installed (Android Studio, Xcode)

## Environment Variables
Although Firebase configs are mostly contained in the `google-services.json` and `GoogleService-Info.plist`, you may add additional config in a `.env` file, e.g., AI keys:
```ini
GPT_API_KEY=your_api_key
Integrate with Flutter using a .env package if needed.

Running the App
Connect Device or open an Emulator.
Run:
bash
Copy code
flutter run
Testing
Dart Tests:
bash
Copy code
flutter test
Integration Tests:
bash
Copy code
flutter drive --target=test_driver/app.dart
Deployment
CI/CD: GitHub Actions or CodeMagic for building APK/IPA.
Release:
Increment version in pubspec.yaml.
Build release APK/IPA.
Deploy to app stores (Google Play, Apple App Store).
yaml
Copy code

---

## 3. ReanimatED Echos

### **README.md**
```markdown
# ReanimatED Echos

**ReanimatED Echos** is an AI voice reanimation platform designed to preserve and recreate the voices of loved ones through digital synthesis.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Ethical Considerations](#ethical-considerations)
- [Roadmap](#roadmap)

## Overview
ReanimatED Echos uses advanced AI speech models to:
- Upload and store audio samples in an encrypted S3 bucket.
- Clone voiceprints with a combination of Whisper for transcription and voice cloning APIs (e.g., ElevenLabs).
- Generate personalized voice outputs.

## Features
- **Secure File Uploads** to S3
- **AI Voice Cloning** (Whisper + ElevenLabs)
- **Consent & Privacy Focus** with user approvals

## Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/GeauxSpecialistLLC/reanimated-echos.git
Install Dependencies:
bash
Copy code
pip install -r requirements.txt
Configure AWS credentials for secure S3 usage.
Usage
Run the Flask App:
bash
Copy code
flask run
Access: Go to http://localhost:5000 to manage your voice profiles.
Ethical Considerations
Voice cloning is sensitive technology. Always ensure:

Consent: Obtain permission from living individuals before uploading audio.
Clear Disclaimers: Inform users about how data is stored and utilized.
Roadmap
Phase 1: Basic upload and voice cloning
Phase 2: Enhanced voice editing and personalization
Phase 3: Integration with additional AI speech services
bash
Copy code

### **CONTRIBUTING.md**
```markdown
# Contributing to ReanimatED Echos

Your help in improving the ReanimatED Echos platform is greatly appreciated.

## Contribution Process
1. **Fork the Repo** and clone locally.
2. **Branch**:
   ```bash
   git checkout -b feature/voice-filter
Make Changes with appropriate docs or comments.
Run Tests to ensure stability.
Pull Request:
Describe the motivation behind your changes.
Reference any open issues or relevant discussions.
Code of Conduct
We follow the Geaux Specialist LLC Code of Conduct. Be respectful and considerate in all communications.

Security
S3 Buckets must remain private; do not expose public read/write permissions.
AWS Keys should only reside in .env or environment variables and never be committed.
shell
Copy code

### **DEVELOPMENT.md**
```markdown
# Development Guide – ReanimatED Echos

## Tech Stack
- **Python Flask** for server-side logic
- **Whisper** for speech-to-text
- **ElevenLabs** for voice generation
- **Amazon S3** for secure storage

## Local Setup
1. **Install Python 3.9+**.
2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
Create .env for environment variables:
ini
Copy code
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
ELEVENLABS_API_KEY=xxx
Run Migrations if using a relational DB for user accounts (optional).
Testing
Pytest:
bash
Copy code
pytest --cov
Integration Tests for voice upload and AI calls:
Mock external services (Whisper, ElevenLabs) to avoid real charges.
Deployment
Containerize with Docker:
dockerfile
Copy code
FROM python:3.9
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
EXPOSE 5000
CMD ["flask", "run", "--host=0.0.0.0"]
AWS ECS or Lambda can be used for serverless approaches.
Monitoring & Logs:
Store logs in CloudWatch
Track AI usage metrics for cost management
csharp
Copy code

---

## 4. Geaux Emporium

### **README.md**
```markdown
# Geaux Emporium

**Geaux Emporium** is an educational marketplace for digital products, including eBooks, premium courses, and learning tools. It integrates with Geaux Academy content to provide a seamless user experience.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Roadmap](#roadmap)

## Overview
By integrating with Geaux Academy, Geaux Emporium allows:
- **Cross-selling** of courses, modules, and eBooks
- **Subscription Plans** for premium users
- **Payment Gateways** with Stripe for secure transactions

## Features
- **WooCommerce Integration** (WordPress)
- **Stripe for Payment** processing
- **Admin Dashboard** for product management
- **User Account Sync** with Geaux Academy

## Installation
1. **Clone Repository**:
   ```bash
   git clone https://github.com/GeauxSpecialistLLC/geaux-emporium.git
Install WordPress and WooCommerce locally or on a server.
Configure the plugin or theme to integrate with your Geaux Academy data endpoints.
Usage
Add Products in the WP admin area.
Checkout with Stripe or other supported gateways.
Sync user data with Geaux Academy for unified user experiences.
Roadmap
Phase 1: Basic eCommerce MVP
Phase 2: Subscription models and recurring billing
Phase 3: Advanced analytics and marketing automation
bash
Copy code

### **CONTRIBUTING.md**
```markdown
# Contributing to Geaux Emporium

We welcome community contributions to enhance the educational marketplace!

## Guidelines
1. **WordPress Best Practices**: Follow WP coding standards.
2. **Security**: Avoid storing sensitive data in plain text. Use secure WordPress functions for input sanitization and output escaping.
3. **Testing**: Provide unit or integration tests for any new functionality.

## How to Contribute
- **Fork & Branch**:
  ```bash
  git checkout -b feature/subscription-module
Pull Request:
Detail the changes with references to open issues.
Include screenshots of UI modifications (if any).
Code of Conduct
Please read and abide by the Geaux Specialist LLC Code of Conduct.

makefile
Copy code

### **DEVELOPMENT.md**
```markdown
# Development Guide – Geaux Emporium

## Architecture
- **Core**: WordPress + WooCommerce
- **Plugin / Theme**: Custom integration with Geaux Academy’s APIs
- **Stripe**: Payment gateway for secure transactions

## Local Development
1. **Local WP Environment**:
   - Use Docker or a local LAMP/LEMP stack to run WordPress.
2. **WooCommerce Setup**:
   - Install WooCommerce plugin and run the setup wizard.
3. **Custom Plugin** (optional):
   - Create a new plugin for integration with Geaux Academy endpoints.

## Environment Variables
For a Docker-based WP environment, create a `.env`:
```ini
WORDPRESS_DB_HOST=db
WORDPRESS_DB_USER=wp_user
WORDPRESS_DB_PASSWORD=wp_password
STRIPE_SECRET_KEY=your_stripe_key
Testing
PHPUnit: For WordPress plugin testing.
bash
Copy code
phpunit --configuration phpunit.xml
Integration Tests: Ensure product purchases sync with Geaux Academy user status.
Deployment
Build & Package:
If using a custom plugin/theme, ensure it’s versioned properly.
Migrate Database: Use WP Migrate DB or a similar tool.
Go Live:
Deploy to a WordPress hosting provider or your own server.
Verify SSL certificates and payment gateway configurations.
markdown
Copy code

---

# Recommendations & Additional Prompts

1. **Monorepo vs. Polyrepo**  
   - Consider whether to maintain a **monorepo** for all Geaux products or keep them in separate repositories. A monorepo can streamline dependency management but may complicate version control for distinct products.

2. **Continuous Integration**  
   - Set up a consistent CI pipeline (e.g., GitHub Actions) for all repos. Each product can have a separate workflow file or share reusable workflow templates.

3. **Security Audits**  
   - Conduct periodic security audits, especially for repositories that handle personal or payment data (Geaux HelpED and Geaux Emporium).

4. **Infrastructure as Code**  
   - Use tools like **Terraform** or **Pulumi** to provision and manage resources (Databases, S3, Docker containers) in a consistent, trackable manner.

5. **Additional Prompt – AI-Powered DevOps**  
   ```markdown
   ### Role: DevOps AI Agent
   You are an AI specialized in deploying, monitoring, and scaling Geaux Specialist LLC's applications. Your tasks:
   1. Generate Terraform files for each product’s infrastructure (AWS/Azure).
   2. Configure logging and metrics dashboards.
   3. Optimize hosting costs and resource utilization.
   4. Document all DevOps procedures in a `DEVOPS.md` file for each repo.
Localization & Accessibility

Ensure that Geaux Academy and Geaux HelpED particularly meet accessibility (WCAG 2.1) and multi-language support for broader audience reach.
Scaling Strategy

Plan out how each service will handle 10,000+ concurrent users or large data sets. This might include horizontal scaling for microservices or using managed cloud databases.
```

## backend/Artifacts/GASpecialist/system-architecture.ts

```
// Core types and interfaces for the Geaux product suite

// Shared authentication and user management
interface BaseUser {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

enum UserRole {
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
  EDUCATOR = 'EDUCATOR',
  ADMIN = 'ADMIN',
  CAREGIVER = 'CAREGIVER'
}

// Geaux Academy specific types
interface LearningProfile {
  userId: string;
  learningStyle: LearningStyle[];
  preferences: UserPreferences;
  assessmentResults: AssessmentResult[];
}

interface LearningStyle {
  type: 'visual' | 'auditory' | 'kinesthetic' | 'reading_writing';
  strength: number; // 0-100
  recommendations: string[];
}

// Geaux HelpED specific types
interface HealthcareProfile {
  patientId: string;
  caregiverId: string;
  medicalHistory: MedicalRecord[];
  appointments: Appointment[];
  medications: Medication[];
  tasks: CareTask[];
}

interface CareTask {
  id: string;
  patientId: string;
  type: TaskType;
  dueDate: Date;
  priority: Priority;
  status: TaskStatus;
  notes?: string;
}

// ReanimatED Echos specific types
interface VoiceProfile {
  id: string;
  userId: string;
  originalAudioUrl: string;
  voiceFeatures: VoiceFeatures;
  consentVerified: boolean;
  createdAt: Date;
}

interface VoiceFeatures {
  pitch: number;
  tempo: number;
  timbre: number[];
  characteristics: string[];
}

// Geaux Emporium specific types
interface Product {
  id: string;
  type: ProductType;
  title: string;
  description: string;
  price: number;
  creatorId: string;
  relatedCourseIds?: string[];
}

// Base service interface for all products
abstract class BaseService<T> {
  abstract create(data: Partial<T>): Promise<T>;
  abstract get(id: string): Promise<T>;
  abstract update(id: string, data: Partial<T>): Promise<T>;
  abstract delete(id: string): Promise<void>;
  abstract list(filters?: FilterOptions): Promise<T[]>;
}

// Security middleware
class SecurityMiddleware {
  constructor(private authService: AuthenticationService) {}

  async authenticate(req: Request): Promise<BaseUser> {
    const token = this.extractToken(req);
    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    const user = await this.authService.validateToken(token);
    if (!user) {
      throw new UnauthorizedError('Invalid token');
    }

    return user;
  }

  private extractToken(req: Request): string | null {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }
}

// Base error handling
class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code: string
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// Database connection management
class DatabaseManager {
  private static instance: DatabaseManager;
  private connections: Map<string, any> = new Map();

  private constructor() {}

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  async getConnection(service: string) {
    if (!this.connections.has(service)) {
      // Initialize connection based on service
      const connection = await this.initializeConnection(service);
      this.connections.set(service, connection);
    }
    return this.connections.get(service);
  }

  private async initializeConnection(service: string) {
    // Implementation varies based on service requirements
    switch (service) {
      case 'academy':
        return this.initPostgres(process.env.ACADEMY_DB_URL);
      case 'helped':
        return this.initMongo(process.env.HELPED_DB_URL);
      // Add other services as needed
      default:
        throw new Error(`Unknown service: ${service}`);
    }
  }
}

// Telemetry and monitoring
class TelemetryService {
  private metrics: Map<string, number> = new Map();

  recordMetric(name: string, value: number) {
    const current = this.metrics.get(name) || 0;
    this.metrics.set(name, current + value);
  }

  async flush() {
    // Implementation to send metrics to monitoring service
    const metrics = Array.from(this.metrics.entries());
    await this.sendToMonitoring(metrics);
    this.metrics.clear();
  }

  private async sendToMonitoring(metrics: [string, number][]) {
    // Implementation depends on monitoring solution (e.g., Prometheus)
  }
}

```

## backend/Artifacts/GASpecialist/geaux-specialist-complete-docs.md

```
# Geaux Specialist LLC - Complete Documentation Suite

## Repository Structure
```
geaux-specialist/
├── docs/
│   ├── architecture/
│   ├── development/
│   └── deployment/
├── geaux-academy/
├── geaux-helped/
├── reanimated-echos/
├── geaux-emporium/
└── shared/
```

## Core Development Standards

### Version Control
- Git branch naming: `feature/`, `bugfix/`, `hotfix/`
- Commit messages follow Conventional Commits
- Pull request templates standardized across repos

### Code Quality
- Linting: ESLint, Black, Flutter Lint
- Testing: Jest, PyTest, Flutter Test
- CI/CD: GitHub Actions

### Documentation
Each project maintains three core documents:
- README.md: Project overview and setup
- CONTRIBUTING.md: Contribution guidelines
- DEVELOPMENT.md: Development workflow

## Project-Specific Documentation

### 1. Geaux Academy

#### System Architecture
```mermaid
graph TD
    A[Client] --> B[API Gateway]
    B --> C[Auth Service]
    B --> D[Learning Service]
    B --> E[Assessment Service]
    D --> F[AI Engine]
    E --> F
```

#### Tech Stack
- Frontend: Next.js + TypeScript
- Backend: FastAPI + Node.js
- Database: PostgreSQL
- Cache: Redis
- AI: OpenAI GPT-4

#### Data Models
```prisma
model Student {
  id            String    @id @default(uuid())
  profile       Profile?
  assessments   Assessment[]
  progress      Progress[]
}

model Assessment {
  id            String    @id
  studentId     String
  type          AssessmentType
  results       Json
  createdAt     DateTime  @default(now())
}

model Curriculum {
  id            String    @id
  title         String
  content       Json
  adaptations   Json?
}
```

#### Security Implementation
```typescript
// Auth middleware
const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = extractToken(req);
  if (!token) {
    throw new UnauthorizedError();
  }
  
  const session = await validateSession(token);
  req.user = session.user;
  next();
};
```

### 2. Geaux HelpED

#### Mobile Architecture
```mermaid
graph TD
    A[Flutter App] --> B[Firebase Auth]
    A --> C[Firestore]
    A --> D[Cloud Functions]
    D --> E[Task Management]
    D --> F[Notifications]
```

#### Tech Stack
- Frontend: Flutter
- Backend: Firebase
- Database: Firestore
- Functions: Node.js

#### Data Models
```dart
class Patient {
  final String id;
  final String caregiverId;
  final Map<String, dynamic> profile;
  final List<Appointment> appointments;
  final List<Task> tasks;
}

class Task {
  final String id;
  final String patientId;
  final DateTime dueDate;
  final TaskPriority priority;
  final TaskStatus status;
}
```

### 3. ReanimatED Echos

#### Voice Processing Pipeline
```python
class VoiceProcessor:
    def __init__(self):
        self.whisper = WhisperModel()
        self.voice_encoder = VoiceEncoder()
        
    async def process_audio(self, audio_file: UploadFile) -> VoiceProfile:
        audio_data = await self.validate_and_normalize(audio_file)
        features = self.voice_encoder.encode(audio_data)
        return VoiceProfile(
            original_audio=audio_data,
            features=features,
            embedding=self.generate_embedding(features)
        )
```

#### Security Measures
```python
def secure_audio_storage(audio_file: UploadFile, user_id: str) -> str:
    """Store audio securely with encryption"""
    file_hash = generate_file_hash(audio_file)
    encrypted_file = encrypt_file(audio_file)
    
    return store_in_s3(
        bucket_name=f"voice-data-{ENV}",
        key=f"users/{user_id}/audio/{file_hash}",
        body=encrypted_file,
        encryption='AES256'
    )
```

### 4. Geaux Emporium

#### Integration Architecture
```mermaid
graph TD
    A[WooCommerce] --> B[Custom Plugin]
    B --> C[Geaux Academy API]
    B --> D[Payment Gateway]
    D --> E[Stripe]
```

#### WordPress Configuration
```php
// Custom plugin integration
add_action('init', function() {
    add_rewrite_rule(
        'academy-content/([^/]+)/?$',
        'index.php?academy_content_id=$matches[1]',
        'top'
    );
});

// API integration
function geaux_academy_api_client() {
    return new GeauxAcademyClient(
        endpoint: getenv('ACADEMY_API_ENDPOINT'),
        apiKey: getenv('ACADEMY_API_KEY')
    );
}
```

## Shared Infrastructure

### Kubernetes Configuration
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: gateway
          image: geaux/api-gateway:latest
          resources:
            requests:
              memory: "256Mi"
              cpu: "200m"
            limits:
              memory: "512Mi"
              cpu: "500m"
```

### Monitoring Setup
```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: api-monitor
spec:
  endpoints:
    - port: http
      interval: 15s
  selector:
    matchLabels:
      app: api-gateway
```

## Security Standards

### Authentication Flow
```typescript
interface AuthService {
  login(credentials: Credentials): Promise<Session>;
  validateSession(token: string): Promise<User>;
  refreshToken(refreshToken: string): Promise<Tokens>;
  revokeSession(sessionId: string): Promise<void>;
}
```

### Data Encryption
- AES-256 for data at rest
- TLS 1.3 for data in transit
- Key rotation every 90 days

## Scaling Strategy
- Horizontal pod autoscaling
- Database read replicas
- CDN for static content
- Redis for caching

```

## backend/Artifacts/GASpecialist/Geauc Specialist roadmap.md

```
Geaux Specialist LLC – Comprehensive Development Guide
Overview
This document provides a step-by-step Auto-GPT-style guide for developing Geaux Specialist LLC's core products. The workflow spans from Geaux Academy (flagship education platform) to Geaux Emporium (educational product marketplace), focusing on iterative, autonomous AI-driven development.

Core Product Pipeline
Geaux Academy – Personalized K-12 educational platform with AI-driven learning style assessment.
Geaux HelpED – Healthcare assistant app for caregivers, focused on scheduling, task management, and personalized support.
ReanimatED Echos – AI voice reanimation platform for preserving and digitizing voices of loved ones.
Geaux Emporium – An educational marketplace for courses, eBooks, and learning materials.
Auto-GPT Development Prompt
This prompt is designed to be used in tools like Auto-GPT, CrewAI, or any agent capable of autonomous reasoning and development tasks.

markdown
Copy code
### Role: Autonomous AI Developer
You are an advanced autonomous AI agent tasked with developing a full suite of products for **Geaux Specialist LLC**. Your process should be iterative, comprehensive, and optimized for efficiency. The products must be built from **Geaux Academy** (flagship product) to **Geaux Emporium** (final phase).

### Core Objectives
1. **Plan**: Break down each project into milestones, deliverables, and timelines.
2. **Design**: Propose detailed UI/UX wireframes, data models, and system architecture.
3. **Implement**: Generate production-ready code and infrastructure setups for each platform.
4. **Test**: Ensure all code has unit, integration, and end-to-end tests.
5. **Deploy**: Automate CI/CD pipelines, infrastructure provisioning, and cloud deployment.
6. **Document**: Provide clear documentation for all code and system operations.

### Development Constraints
- **Security First**: Implement encryption, secure API keys, and proper authentication protocols.
- **Scalability**: Architect for growth, with microservices and modular data handling.
- **Cost Efficiency**: Leverage existing credits (Azure, AWS, Porter) and open-source tools.
- **Consistency**: Maintain a shared codebase style and modular structures.

---

## Product Roadmap & Development Steps

### **1. Geaux Academy** (Flagship Product)
**Objective:** Create a personalized K-12 learning platform with learning style assessments, curriculum generation, and student dashboards.

- **Phase 1:** Requirement Gathering
   - Define user roles: Student, Parent, Admin
   - Identify key features: Learning style assessment, curriculum generation, and student progress tracking.

- **Phase 2:** System Architecture
   - Microservices for assessment, curriculum generation, and content delivery.
   - Data models for user management and educational content storage.

- **Phase 3:** Implementation
   - **Frontend:** Next.js, TailwindCSS  
   - **Backend:** Node.js, FastAPI  
   - **Database:** PostgreSQL + Prisma ORM  
   - **AI Integration:** OpenAI API for assessments and tutoring  
   - **Deployment:** Porter + Azure credits  

- **Phase 4:** Testing & QA
   - Unit tests for curriculum generation and API validation.
   - Integration testing for multi-user workflows.

- **Phase 5:** Launch & Maintenance
   - Implement feedback loops and feature expansions.

---

### **2. Geaux HelpED** (Healthcare Assistance App)
**Objective:** Assist caregivers with task scheduling, reminders, and health tracking for patients.

- **Phase 1:** Define Core Features
   - Patient profiles, task reminders, appointment management, and multi-user dashboards.

- **Phase 2:** Design System
   - **Frontend:** Flutter for cross-platform (iOS, Android)  
   - **Backend:** Firebase Authentication and Firestore  
   - **AI Integration:** Task automation with GPT  

- **Phase 3:** Security & Compliance
   - HIPAA-compliant data handling.  
   - Secure token-based access control.  

- **Phase 4:** Testing & QA
   - Load testing for high user activity.  
   - Functional testing for task reminders and alerts.  

---

### **3. ReanimatED Echos** (AI Voice Reanimation Platform)
**Objective:** Digitally preserve and reanimate the voices of loved ones through AI audio synthesis.

- **Phase 1:** Core Features Definition
   - Upload audio files, voice cloning, and output generation.  

- **Phase 2:** Architecture Design
   - **Frontend:** React.js for web interaction  
   - **Backend:** Python Flask with Whisper + ElevenLabs API  
   - **Data Handling:** Encrypted S3 bucket storage  

- **Phase 3:** AI Integration
   - Use Whisper for transcription and voice embedding.  
   - Fine-tune models for voice generation.  

- **Phase 4:** Deployment & Ethics
   - Transparency on data usage and consent requirements.  

---

### **4. Geaux Emporium** (Educational Marketplace)
**Objective:** An educational marketplace for digital products, including eBooks, premium courses, and educational tools.

- **Phase 1:** Feature Definition
   - eCommerce platform with product listings, checkout, and subscription options.  

- **Phase 2:** System Design
   - **Frontend:** WooCommerce with WordPress  
   - **Payment Integration:** Stripe  
   - **Content Management:** Integrated with Geaux Academy content  

- **Phase 3:** Security & Performance
   - Payment gateway security with PCI compliance  
   - DDoS protection and rate limiting  

---

## Development Flow Example (Auto-GPT Style)
**Thought:** The next step is to outline the database schema for Geaux Academy.  
**Reason:** A solid schema ensures the platform can support multiple students, families, and unique learning profiles.  
**Plan:** 
1. Create a database schema in PostgreSQL.  
2. Define tables for `User`, `Course`, `LearningStyle`, and `Progress`.  
3. Implement Prisma ORM to manage schema migrations.  

**Action:** (Example code for Prisma schema)
```sql
// Prisma schema for Geaux Academy
model User {
  id          Int      @id @default(autoincrement())
  name        String
  email       String   @unique
  learningStyle LearningStyle
  progress    Progress[]
}

model LearningStyle {
  id      Int      @id @default(autoincrement())
  name    String
  description String
}

model Progress {
  id      Int      @id @default(autoincrement())
  userId  Int
  courseId Int
  completion Float
}
Check: The schema includes all necessary tables for personalized learning. Next, I will design the API routes for progress tracking.

Success Metrics
✅ Project Completion: Each product should reach a Minimum Viable Product (MVP) phase.
✅ Consistency: Standardized code, design patterns, and security practices across all projects.
✅ Scalability: Backend services capable of supporting 10,000+ active users.
✅ User Satisfaction: Achieve positive feedback from pilot user groups before the final launch.
Next Steps
Kickoff Geaux Academy Development: Assign project milestones and initiate the database setup.
AI Agent Setup: Implement CrewAI to automate initial coding tasks for backend and testing.
Collaborative Development: Sync repositories on GeauxCode GitHub Enterprise.
Feedback Cycles: Establish continuous feedback loops for each phase.
By following this Auto-GPT development approach, Geaux Specialist LLC can ensure efficient, autonomous, and collaborative progress across all projects, from Geaux Academy to Geaux Emporium. Let me know if you'd like any adjustments or additional prompts!
```

## backend/Artifacts/GASpecialist/geaux-specialist-docs.md

```
# Geaux Specialist LLC - Project Documentation

## Repository Structure

Each project follows a standardized repository structure:

```
project-root/
├── .github/
│   ├── workflows/           # CI/CD pipelines
│   └── ISSUE_TEMPLATE/     # Issue templates
├── docs/
│   ├── api/                # API documentation
│   ├── deployment/         # Deployment guides
│   └── development/        # Development guides
├── src/                    # Source code
├── tests/                  # Test suites
├── .env.example           # Environment variables template
├── README.md              # Project overview
├── CONTRIBUTING.md        # Contribution guidelines
├── DEVELOPMENT.md         # Development setup
├── SECURITY.md           # Security policies
└── LICENSE               # MIT License
```

## 1. Geaux Academy

### README.md
```markdown
# Geaux Academy

## Overview

Geaux Academy is a next-generation K-12 educational platform leveraging AI for personalized learning experiences. Our platform adapts to each student's unique learning style through continuous assessment and dynamic curriculum generation.

## Key Features

- **AI-Driven Learning Assessment**
  - Real-time learning style analysis
  - Adaptive difficulty scaling
  - Personalized feedback loops

- **Smart Curriculum Generation**
  - Dynamic content creation
  - Multi-modal learning resources
  - Progress-based adaptation

- **Advanced Analytics Dashboard**
  - Student performance tracking
  - Learning pattern visualization
  - Predictive progress modeling

## Technical Stack

- **Frontend**: Next.js + TypeScript + TailwindCSS
- **Backend**: FastAPI + Node.js microservices
- **Database**: PostgreSQL + Redis
- **AI Integration**: OpenAI GPT-4, Custom ML models
- **Infrastructure**: Kubernetes on Azure

## Quick Start

1. **Prerequisites**
   ```bash
   node >= 18.0.0
   python >= 3.9
   postgresql >= 14
   ```

2. **Installation**
   ```bash
   # Clone repository
   git clone https://github.com/GeauxSpecialistLLC/geaux-academy.git
   cd geaux-academy

   # Install dependencies
   npm install        # Frontend
   pip install -r requirements.txt  # Backend
   ```

3. **Configuration**
   ```bash
   # Copy environment templates
   cp .env.example .env
   cp backend/.env.example backend/.env
   ```

4. **Development**
   ```bash
   # Start development servers
   npm run dev           # Frontend
   python backend/main.py  # Backend
   ```

## Architecture

Our platform uses a microservices architecture for scalability and maintainability:

```mermaid
graph TD
    A[Client] --> B[API Gateway]
    B --> C[Auth Service]
    B --> D[Assessment Service]
    B --> E[Curriculum Service]
    B --> F[Analytics Service]
    D --> G[AI Engine]
    E --> G
```

## Security

- **Data Encryption**: AES-256 for data at rest
- **API Security**: JWT + OAuth2
- **Infrastructure**: Zero-trust network model

## License

MIT License - see LICENSE file for details

---

### DEVELOPMENT.md
```markdown
# Development Guide

## Environment Setup

### Required Tools
- Node.js >= 18.0.0
- Python >= 3.9
- Docker Desktop
- PostgreSQL >= 14
- Redis >= 6.2

### Environment Variables
```ini
# Backend (.env)
DATABASE_URL=postgresql://username:password@localhost:5432/geaux_academy
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=sk-your-key
JWT_SECRET=your-secret

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
```

### Development Workflow

1. **Code Style**
   - Frontend: ESLint + Prettier
   - Backend: Black + isort
   - Pre-commit hooks enforce styling

2. **Testing**
   ```bash
   # Frontend
   npm run test        # Unit tests
   npm run test:e2e    # E2E tests
   
   # Backend
   pytest              # Unit tests
   pytest tests/e2e    # Integration tests
   ```

3. **Database Migrations**
   ```bash
   # Generate migration
   alembic revision --autogenerate -m "description"
   
   # Apply migration
   alembic upgrade head
   ```

4. **Local Development**
   ```bash
   # Start all services
   docker-compose up -d
   
   # Frontend development
   npm run dev
   
   # Backend development
   uvicorn main:app --reload
   ```

## Deployment

### Production Build
```bash
# Frontend
npm run build
npm run start

# Backend
docker build -t geaux-academy-api .
docker run -p 8000:8000 geaux-academy-api
```

### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: geaux-academy-api
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: api
          image: geaux-academy-api:latest
          resources:
            requests:
              memory: "256Mi"
              cpu: "200m"
            limits:
              memory: "512Mi"
              cpu: "500m"
```

## Monitoring

- Prometheus + Grafana for metrics
- ELK Stack for logging
- Sentry for error tracking
```

[Additional documentation sections follow similar patterns for other projects...]

```

## backend/Artifacts/GASpecialist/local dev all repoos.md

```
Local Development
Database Setup
Ensure PostgreSQL is running.
Run migrations (Prisma):
bash
Copy code
npx prisma migrate dev
Backend
Install dependencies and run:
bash
Copy code
pip install -r requirements.txt
uvicorn main:app --reload
Frontend
Install dependencies and run:
bash
Copy code
npm install
npm run dev
Testing
Backend: Use pytest for unit tests and integration tests.
bash
Copy code
pytest --cov
Frontend: Use Jest + React Testing Library.
bash
Copy code
npm run test
Deployment
CI/CD: GitHub Actions or Jenkins for building, testing, and containerizing the application.
Hosting:
Backend: Deploy Docker container to AWS, Azure, or Porter.
Frontend: Deploy static build to Vercel or an S3 bucket (if applicable).
Monitoring:
Integrate application logs with CloudWatch or Datadog.
Use metrics dashboards for performance insights.
csharp
Copy code

---

## 2. Geaux HelpED

### `README.md`
```markdown
# Geaux HelpED

**Geaux HelpED** is a healthcare assistant app that helps caregivers with scheduling, reminders, and patient health tracking. This repository houses the Flutter mobile codebase and Firebase backend rules.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Roadmap](#roadmap)

## Overview
Geaux HelpED focuses on simplifying caregivers’ daily tasks with:
- Patient and caretaker profiles
- Task scheduling and reminders
- Appointment management
- Basic health metrics tracking

## Features
- **Cross-Platform Flutter App** (iOS + Android)
- **Firebase-Integrated** (Firestore, Auth)
- **AI-Powered Task Management** with GPT
- **HIPAA-Compliant** data handling

## Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/GeauxSpecialistLLC/geaux-helped.git
Install Flutter Dependencies:
bash
Copy code
flutter pub get
Configure Firebase using your own google-services.json (Android) and GoogleService-Info.plist (iOS).
Usage
Run the App on an emulator or physical device:
bash
Copy code
flutter run
Log In or Sign Up with email/password or third-party auth (if enabled).
Roadmap
Phase 1: Basic scheduling, reminders, and push notifications
Phase 2: Enhanced health metrics and caretaker-team collaboration
Phase 3: AI-driven insights for task optimization
bash
Copy code

### `CONTRIBUTING.md`
```markdown
# Contributing to Geaux HelpED

We appreciate your help in improving the **Geaux HelpED** platform!

## How to Contribute
1. **Fork & Branch**:
   ```bash
   git checkout -b fix/issue-xxx
Add/Modify Code:
Ensure you follow the Flutter style guide.
Document Your Changes:
Update relevant .md files or code comments.
Submit a Pull Request:
Provide a detailed description, referencing any open issues.
Code of Conduct
Please see CODE_OF_CONDUCT.md for contributor guidelines and behavior expectations.

Tests
Integration Tests: Flutter integration tests for UI flows.
Unit Tests: Dart unit tests for business logic.
less
Copy code

### `DEVELOPMENT.md`
```markdown
# Development Guide – Geaux HelpED

## Environment Setup
- **Flutter SDK**: v3.x or higher
- **Firebase Project**: Create a project in the [Firebase Console](https://console.firebase.google.com/)  
- **Android/iOS Build Tools**: Ensure you have the latest versions installed (Android Studio, Xcode)

## Environment Variables
Although Firebase configs are mostly contained in the `google-services.json` and `GoogleService-Info.plist`, you may add additional config in a `.env` file, e.g., AI keys:
```ini
GPT_API_KEY=your_api_key
Integrate with Flutter using a .env package if needed.

Running the App
Connect Device or open an Emulator.
Run:
bash
Copy code
flutter run
Testing
Dart Tests:
bash
Copy code
flutter test
Integration Tests:
bash
Copy code
flutter drive --target=test_driver/app.dart
Deployment
CI/CD: GitHub Actions or CodeMagic for building APK/IPA.
Release:
Increment version in pubspec.yaml.
Build release APK/IPA.
Deploy to app stores (Google Play, Apple App Store).
yaml
Copy code

---

## 3. ReanimatED Echos

### `README.md`
```markdown
# ReanimatED Echos

**ReanimatED Echos** is an AI voice reanimation platform designed to preserve and recreate the voices of loved ones through digital synthesis.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Ethical Considerations](#ethical-considerations)
- [Roadmap](#roadmap)

## Overview
ReanimatED Echos uses advanced AI speech models to:
- Upload and store audio samples in an encrypted S3 bucket.
- Clone voiceprints with a combination of Whisper for transcription and voice cloning APIs (e.g., ElevenLabs).
- Generate personalized voice outputs.

## Features
- **Secure File Uploads** to S3
- **AI Voice Cloning** (Whisper + ElevenLabs)
- **Consent & Privacy Focus** with user approvals

## Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/GeauxSpecialistLLC/reanimated-echos.git
Install Dependencies:
bash
Copy code
pip install -r requirements.txt
Configure AWS credentials for secure S3 usage.
Usage
Run the Flask App:
bash
Copy code
flask run
Access: Go to http://localhost:5000 to manage your voice profiles.
Ethical Considerations
Voice cloning is sensitive technology. Always ensure:

Consent: Obtain permission from living individuals before uploading audio.
Clear Disclaimers: Inform users about how data is stored and utilized.
Roadmap
Phase 1: Basic upload and voice cloning
Phase 2: Enhanced voice editing and personalization
Phase 3: Integration with additional AI speech services
bash
Copy code

### `CONTRIBUTING.md`
```markdown
# Contributing to ReanimatED Echos

Your help in improving the ReanimatED Echos platform is greatly appreciated.

## Contribution Process
1. **Fork the Repo** and clone locally.
2. **Branch**:
   ```bash
   git checkout -b feature/voice-filter
Make Changes with appropriate docs or comments.
Run Tests to ensure stability.
Pull Request:
Describe the motivation behind your changes.
Reference any open issues or relevant discussions.
Code of Conduct
We follow the Geaux Specialist LLC Code of Conduct. Be respectful and considerate in all communications.

Security
S3 Buckets must remain private; do not expose public read/write permissions.
AWS Keys should only reside in .env or environment variables and never be committed.
shell
Copy code

### `DEVELOPMENT.md`
```markdown
# Development Guide – ReanimatED Echos

## Tech Stack
- **Python Flask** for server-side logic
- **Whisper** for speech-to-text
- **ElevenLabs** for voice generation
- **Amazon S3** for secure storage

## Local Setup
1. **Install Python 3.9+**.
2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
Create .env for environment variables:
ini
Copy code
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
ELEVENLABS_API_KEY=xxx
Run Migrations if using a relational DB for user accounts (optional).
Testing
Pytest:
bash
Copy code
pytest --cov
Integration Tests for voice upload and AI calls:
Mock external services (Whisper, ElevenLabs) to avoid real charges.
Deployment
Containerize with Docker:
dockerfile
Copy code
FROM python:3.9
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
EXPOSE 5000
CMD ["flask", "run", "--host=0.0.0.0"]
AWS ECS or Lambda can be used for serverless approaches.
Monitoring & Logs:
Store logs in CloudWatch
Track AI usage metrics for cost management
csharp
Copy code

---

## 4. Geaux Emporium

### `README.md`
```markdown
# Geaux Emporium

**Geaux Emporium** is an educational marketplace for digital products, including eBooks, premium courses, and learning tools. It integrates with Geaux Academy content to provide a seamless user experience.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Roadmap](#roadmap)

## Overview
By integrating with Geaux Academy, Geaux Emporium allows:
- **Cross-selling** of courses, modules, and eBooks
- **Subscription Plans** for premium users
- **Payment Gateways** with Stripe for secure transactions

## Features
- **WooCommerce Integration** (WordPress)
- **Stripe for Payment** processing
- **Admin Dashboard** for product management
- **User Account Sync** with Geaux Academy

## Installation
1. **Clone Repository**:
   ```bash
   git clone https://github.com/GeauxSpecialistLLC/geaux-emporium.git
Install WordPress and WooCommerce locally or on a server.
Configure the plugin or theme to integrate with your Geaux Academy data endpoints.
Usage
Add Products in the WP admin area.
Checkout with Stripe or other supported gateways.
Sync user data with Geaux Academy for unified user experiences.
Roadmap
Phase 1: Basic eCommerce MVP
Phase 2: Subscription models and recurring billing
Phase 3: Advanced analytics and marketing automation
bash
Copy code

### `CONTRIBUTING.md`
```markdown
# Contributing to Geaux Emporium

We welcome community contributions to enhance the educational marketplace!

## Guidelines
1. **WordPress Best Practices**: Follow WP coding standards.
2. **Security**: Avoid storing sensitive data in plain text. Use secure WordPress functions for input sanitization and output escaping.
3. **Testing**: Provide unit or integration tests for any new functionality.

## How to Contribute
- **Fork & Branch**:
  ```bash
  git checkout -b feature/subscription-module
Pull Request:
Detail the changes with references to open issues.
Include screenshots of UI modifications (if any).
Code of Conduct
Please read and abide by the Geaux Specialist LLC Code of Conduct.

makefile
Copy code

### `DEVELOPMENT.md`
```markdown
# Development Guide – Geaux Emporium

## Architecture
- **Core**: WordPress + WooCommerce
- **Plugin / Theme**: Custom integration with Geaux Academy’s APIs
- **Stripe**: Payment gateway for secure transactions

## Local Development
1. **Local WP Environment**:
   - Use Docker or a local LAMP/LEMP stack to run WordPress.
2. **WooCommerce Setup**:
   - Install WooCommerce plugin and run the setup wizard.
3. **Custom Plugin** (optional):
   - Create a new plugin for integration with Geaux Academy endpoints.

## Environment Variables
For a Docker-based WP environment, create a `.env`:
```ini
WORDPRESS_DB_HOST=db
WORDPRESS_DB_USER=wp_user
WORDPRESS_DB_PASSWORD=wp_password
STRIPE_SECRET_KEY=your_stripe_key
Testing
PHPUnit: For WordPress plugin testing.
bash
Copy code
phpunit --configuration phpunit.xml
Integration Tests: Ensure product purchases sync with Geaux Academy user status.
Deployment
Build & Package:
If using a custom plugin/theme, ensure it’s versioned properly.
Migrate Database: Use WP Migrate DB or a similar tool.
Go Live:
Deploy to a WordPress hosting provider or your own server.
Verify SSL certificates and payment gateway configurations.
markdown
Copy code

---

# Recommendations & Additional Prompts

1. **Monorepo vs. Polyrepo**  
   - Consider whether to maintain a **monorepo** for all Geaux products or keep them in separate repositories. A monorepo can streamline dependency management but may complicate version control for distinct products.

2. **Continuous Integration**  
   - Set up a consistent CI pipeline (e.g., GitHub Actions) for all repos. Each product can have a separate workflow file or share reusable workflow templates.

3. **Security Audits**  
   - Conduct periodic security audits, especially for repositories that handle personal or payment data (Geaux HelpED and Geaux Emporium).

4. **Infrastructure as Code**  
   - Use tools like **Terraform** or **Pulumi** to provision and manage resources (Databases, S3, Docker containers) in a consistent, trackable manner.

5. **Additional Prompt – AI-Powered DevOps**  
   ```markdown
   ### Role: DevOps AI Agent
   You are an AI specialized in deploying, monitoring, and scaling Geaux Specialist LLC's applications. Your tasks:
   1. Generate Terraform files for each product’s infrastructure (AWS/Azure).
   2. Configure logging and metrics dashboards.
   3. Optimize hosting costs and resource utilization.
   4. Document all DevOps procedures in a `DEVOPS.md` file for each repo.
Localization & Accessibility

Ensure that Geaux Academy and Geaux HelpED particularly meet accessibility (WCAG 2.1) and multi-language support for broader audience reach.
Scaling Strategy

Plan out how each service will handle 10,000+ concurrent users or large data sets. This might include horizontal scaling for microservices or using managed cloud databases.
```

## backend/Artifacts/GASpecialist/geaux-specialist-technical-guide.md

```
# Geaux Specialist LLC - Technical Implementation Guide

## Architecture Overview

### System Design Principles
- Microservices architecture for independent scaling
- Event-driven communication between services
- Zero-trust security model
- Multi-tenant data isolation

### Core Infrastructure Stack
- **Frontend**: Next.js with TypeScript
- **Backend**: Node.js (API Gateway) + FastAPI (ML Services)
- **Database**: PostgreSQL with read replicas
- **Caching**: Redis for session management
- **Message Queue**: RabbitMQ for async processing
- **Storage**: S3-compatible object storage
- **CDN**: CloudFront/Cloudflare
- **Monitoring**: Prometheus + Grafana

## Product-Specific Implementation

### 1. Geaux Academy

#### Data Model
```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  role          UserRole
  profile       Profile?
  assessments   Assessment[]
  progress      Progress[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Profile {
  id              String    @id @default(uuid())
  userId          String    @unique
  learningStyle   Json      // Stores detailed learning preferences
  preferences     Json      // UI/UX preferences
  demographics    Json      // Optional demographic data
  user            User      @relation(fields: [userId], references: [id])
}

model Assessment {
  id            String    @id @default(uuid())
  userId        String
  type          AssessmentType
  responses     Json
  results       Json
  status        AssessmentStatus
  user          User      @relation(fields: [userId], references: [id])
  createdAt     DateTime  @default(now())
}

model Curriculum {
  id            String    @id @default(uuid())
  title         String
  description   String
  subject       Subject
  gradeLevel    GradeLevel
  units         Unit[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

#### API Structure
```typescript
// Core API Routes
interface APIRoutes {
  '/api/v1/auth': AuthController;
  '/api/v1/assessments': AssessmentController;
  '/api/v1/curriculum': CurriculumController;
  '/api/v1/progress': ProgressController;
  '/api/v1/analytics': AnalyticsController;
}

// Assessment Service
interface AssessmentService {
  createAssessment(userId: string, type: AssessmentType): Promise<Assessment>;
  submitResponse(assessmentId: string, response: Response): Promise<void>;
  generateResults(assessmentId: string): Promise<AssessmentResult>;
  getLearningStyle(userId: string): Promise<LearningStyle>;
}

// Curriculum Generation Service
interface CurriculumService {
  generatePersonalizedPath(userId: string): Promise<CurriculumPath>;
  adaptContent(content: Content, learningStyle: LearningStyle): Promise<Content>;
  trackProgress(userId: string, unitId: string): Promise<Progress>;
}
```

### 2. Geaux HelpED

#### Healthcare Data Model
```prisma
model Patient {
  id            String    @id @default(uuid())
  caregiverId   String
  profile       Json      // Medical profile
  schedule      Schedule[]
  tasks         Task[]
  vitals        VitalRecord[]
  medications   Medication[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Schedule {
  id            String    @id @default(uuid())
  patientId     String
  type          AppointmentType
  datetime      DateTime
  location      String?
  notes         String?
  status        AppointmentStatus
  patient       Patient   @relation(fields: [patientId], references: [id])
}

model Task {
  id            String    @id @default(uuid())
  patientId     String
  type          TaskType
  description   String
  dueDate       DateTime
  priority      Priority
  status        TaskStatus
  patient       Patient   @relation(fields: [patientId], references: [id])
}
```

### 3. ReanimatED Echos

#### Voice Processing Pipeline
```python
class VoiceProcessor:
    def __init__(self):
        self.whisper = WhisperModel()
        self.voice_encoder = VoiceEncoder()
        
    async def process_audio(self, audio_file: UploadFile) -> VoiceProfile:
        # Process uploaded audio
        audio_data = await self.validate_and_normalize(audio_file)
        
        # Extract voice characteristics
        voice_features = self.voice_encoder.encode(audio_data)
        
        # Generate voice embedding
        embedding = self.generate_embedding(voice_features)
        
        return VoiceProfile(
            original_audio=audio_data,
            features=voice_features,
            embedding=embedding
        )
    
    async def synthesize_voice(
        self, 
        profile: VoiceProfile, 
        text: str
    ) -> AudioOutput:
        # Generate new audio using voice profile
        return await self.voice_generator.generate(
            text=text,
            voice_embedding=profile.embedding
        )
```

### 4. Geaux Emporium

#### Marketplace Schema
```prisma
model Product {
  id            String    @id @default(uuid())
  type          ProductType
  title         String
  description   String
  price         Decimal
  creator       User      @relation(fields: [creatorId], references: [id])
  creatorId     String
  sales         Sale[]
  reviews       Review[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Sale {
  id            String    @id @default(uuid())
  productId     String
  buyerId       String
  amount        Decimal
  status        TransactionStatus
  product       Product   @relation(fields: [productId], references: [id])
  buyer         User      @relation(fields: [buyerId], references: [id])
  createdAt     DateTime  @default(now())
}
```

## Security Implementation

### Authentication Flow
```typescript
interface AuthService {
  async login(credentials: Credentials): Promise<Session>;
  async validateSession(token: string): Promise<User>;
  async refreshToken(refreshToken: string): Promise<Tokens>;
  async revokeSession(sessionId: string): Promise<void>;
}

class SecurityMiddleware {
  async validateRequest(req: Request): Promise<void> {
    const token = this.extractToken(req);
    const session = await this.authService.validateSession(token);
    
    if (!session.isValid()) {
      throw new UnauthorizedError();
    }
    
    // Attach user context to request
    req.user = session.user;
  }
}
```

## Deployment Configuration

### Kubernetes Manifests
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: geaux-academy-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: geaux-academy-api
  template:
    metadata:
      labels:
        app: geaux-academy-api
    spec:
      containers:
      - name: api
        image: geaux-specialist/academy-api:latest
        ports:
        - containerPort: 8080
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-secrets
              key: url
        resources:
          requests:
            memory: "256Mi"
            cpu: "200m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

```

## backend/Artifacts/deployment-architecture/deployment-config.tsx

```
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, Save, RefreshCcw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const DeploymentConfiguration = () => {
  const { user } = useAuth();
  const [config, setConfig] = useState({
    batch_size: 100,
    warm_up_iterations: 1000,
    health_check_interval: 60,
    performance_threshold: 0.8,
    roll
```

## backend/Artifacts/deployment-architecture/system-architecture-viz.tsx

```
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowRight, Database, Brain, Shield, LineChart, Book, Code } from 'lucide-react';

const SystemArchitecture = () => {
  const components = [
    {
      title: "Standards Alignment Engine",
      icon: <Brain className="w-8 h-8 text-blue-600" />,
      description: "Vector-based standard mapping (94.7% accuracy)",
      subComponents: ["Semantic Analysis", "Standard Vectors", "Weekly Updates"]
    },
    {
      title: "Ethical Web Scraping",
      icon: <Code className="w-8 h-8 text-green-600" />,
      description: "WCAG 2.1 compliant content harvesting",
      subComponents: ["robots.txt Check", "Rate Limiting", "ADA Compliance"]
    },
    {
      title: "Grade Differentiation",
      icon: <Book className="w-8 h-8 text-purple-600" />,
      description: "Cognitive load optimization by grade",
      subComponents: ["Lexile Scoring", "Visual Support", "Interactive Elements"]
    },
    {
      title: "Compliance System",
      icon: <Shield className="w-8 h-8 text-red-600" />,
      description: "FERPA/COPPA protection with 98% PII reduction",
      subComponents: ["PII Detection", "Bias Checking", "Accessibility Audit"]
    },
    {
      title: "Analytics Dashboard",
      icon: <LineChart className="w-8 h-8 text-orange-600" />,
      description: "Real-time performance monitoring",
      subComponents: ["Quality Metrics", "Teacher Feedback", "Compliance Tracking"]
    }
  ];

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold">AI Educational Content Generation Architecture</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {components.map((component, index) => (
            <div key={index} className="border rounded-lg p-4 bg-white">
              <div className="flex items-center gap-4 mb-2">
                {component.icon}
                <div>
                  <h3 className="font-semibold text-lg">{component.title}</h3>
                  <p className="text-gray-600">{component.description}</p>
                </div>
              </div>
              <div className="ml-12 mt-2">
                <div className="flex gap-2 flex-wrap">
                  {component.subComponents.map((sub, idx) => (
                    <span key={idx} className="bg-gray-100 px-2 py-1 rounded-full text-sm">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemArchitecture;

```

## backend/Artifacts/deployment-architecture/README.md

```
# Deployment & System Architecture

## Overview
The Deployment and System Architecture module manages the infrastructure, deployment processes, and overall system design of the Geaux Academy platform.

## Core Components

### 1. Deployment Management
- **deployment-config.tsx**: Deployment configuration interface
- **deployment-dashboard.tsx**: Deployment monitoring and control
- **model-deployment.txt**: AI model deployment system

### 2. System Architecture
- **system-architecture-viz.tsx**: Architecture visualization
- **model-version-control.txt**: Model versioning system

## Key Features
- Automated deployment pipelines
- Infrastructure as Code
- System health monitoring
- Architecture visualization
- Version control management
- Rollback capabilities
- Load balancing

## Technologies
- Docker containers
- Kubernetes orchestration
- CI/CD pipelines
- Cloud infrastructure
- Monitoring tools
- Version control systems

## Architecture Components
1. Frontend Layer
   - React application
   - Static assets
   - Client-side caching

2. Backend Services
   - API servers
   - Authentication service
   - AI model servers
   - WebSocket service

3. Data Layer
   - Databases
   - Cache systems
   - File storage

## Deployment Process
```typescript
interface DeploymentConfig {
  environment: 'development' | 'staging' | 'production';
  services: {
    name: string;
    version: string;
    replicas: number;
    resources: {
      cpu: string;
      memory: string;
    };
  }[];
  monitoring: {
    enabled: boolean;
    metrics: string[];
    alerts: AlertConfig[];
  };
}
```

## Best Practices
1. Infrastructure as Code
2. Automated testing
3. Blue-green deployments
4. Regular backups
5. Security scanning
6. Performance monitoring
7. Documentation updates
8. Disaster recovery planning
```

## backend/Artifacts/deployment-architecture/deployment-dashboard.tsx

```
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, Server, GitBranch, Play, Pause, RotateCcw, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

const ModelDeploymentDashboard = () => {
  const { user } = useAuth();
  const [deployments, setDeployments] = useState([]);
  const [selectedDeployment, setSelectedDeployment] = useState(null);
  const [healthMetrics, setHealthMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [deploymentsRes, metricsRes] = await Promise.all([
          fetch('/api/monitoring/deployments', {
            headers: {
              'Authorization': `Bearer ${await user.getIdToken()}`
            }
          }),
          fetch('/api/monitoring/health-metrics', {
            headers: {
              'Authorization': `Bearer ${await user.getIdToken()}`
            }
          })
        ]);

        if (!deploymentsRes.ok || !metricsRes.ok) {
          throw new Error('Failed to fetch deployment data');
        }

        const [deploymentData, metricsData] = await Promise.all([
          deploymentsRes.json(),
          metricsRes.json()
        ]);

        setDeployments(deploymentData.deployments);
        setHealthMetrics(metricsData);

        if (!selectedDeployment && deploymentData.deployments.length > 0) {
          setSelectedDeployment(deploymentData.deployments[0].deployment_id);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [user, selectedDeployment]);

  const DeploymentStatus = ({ deployment }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'completed':
          return 'text-green-500';
        case 'in_progress':
          return 'text-blue-500';
        case 'failed':
          return 'text-red-500';
        default:
          return 'text-gray-500';
      }
    };

    const getStatusIcon = (status) => {
      switch (status) {
        case 'completed':
          return <Server className="w-5 h-5" />;
        case 'in_progress':
          return <Play className="w-5 h-5" />;
        case 'failed':
          return <AlertTriangle className="w-5 h-5" />;
        default:
          return <Activity className="w-5 h-5" />;
      }
    };

    return (
      <div className="flex items-center space-x-2">
        <span className={getStatusColor(deployment.status)}>
          {getStatusIcon(deployment.status)}
        </span>
        <span className="capitalize">{deployment.status.replace('_', ' ')}</span>
      </div>
    );
  };

  const DeploymentControls = ({ deployment }) => {
    const handleRollback = async () => {
      if (!confirm('Are you sure you want to rollback this deployment?')) return;
      
      try {
        const response = await fetch(`/api/monitoring/deployments/${deployment.deployment_id}/rollback`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${await user.getIdToken()}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to initiate rollback');
        }

        // Refresh data
        await fetchData();
      } catch (err) {
        setError(err.message);
      }
    };

    const handlePause = async () => {
      try {
        const response = await fetch(`/api/monitoring/deployments/${deployment.deployment_id}/pause`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${await user.getIdToken()}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to pause deployment');
        }

        // Refresh data
        await fetchData();
      } catch (err) {
        setError(err.message);
      }
    };

    return (
      <div className="flex space-x-2">
        {deployment.status === 'in_progress' && (
          <button
            onClick={handlePause}
            className="p-2 text-yellow-500 hover:text-yellow-700"
            title="Pause Deployment"
          >
            <Pause className="w-5 h-5" />
          </button>
        )}
        {deployment.status !== 'failed' && (
          <button
            onClick={handleRollback}
            className="p-2 text-red-500 hover:text-red-700"
            title="Rollback Deployment"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  };

  const HealthMetricsChart = ({ metrics }) => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Health Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(time) => format(new Date(time), 'HH:mm')}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(time) => format(new Date(time), 'HH:mm:ss')}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="response_time"
                name="Response Time (ms)"
                stroke="#3B82F6"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="error_rate"
                name="Error Rate (%)"
                stroke="#EF4444"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="health_score"
                name="Health Score"
                stroke="#10B981"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  const DeploymentStages = ({ deployment }) => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Deployment Stages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {deployment.stages.map((stage, index) => (
            <div
              key={index}
              className={`p-4 border rounded-lg ${
                stage.status === 'completed'
                  ? 'bg-green-50 border-green-200'
                  : stage.status === 'in_progress'
                  ? 'bg-blue-50 border-blue-200'
                  : stage.status === 'failed'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{stage.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {stage.description}
                  </p>
                  {stage.error && (
                    <p className="text-sm text-red-600 mt-1">
                      Error: {stage.error}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <DeploymentStatus deployment={{ status: stage.status }} />
                  <span className="text-sm text-gray-500 block mt-1">
                    {format(new Date(stage.timestamp), 'HH:mm:ss')}
                  </span>
                </div>
              </div>
              {stage.metrics && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {Object.entries(stage.metrics).map(([key, value]) => (
                    <div key={key} className="text-sm">
                      <span className="text-gray-600 capitalize">
                        {key.replace('_', ' ')}:
                      </span>{' '}
                      <span className="font-medium">
                        {typeof value === 'number' ? value.toFixed(2) : value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const PerformanceComparison = ({ deployment }) => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Performance Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium mb-4">Response Time</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={deployment.performance_comparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="version" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="response_time"
                  fill="#3B82F6"
                  name="Response Time (ms)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-4">Error Rate</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={deployment.performance_comparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="version" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="error_rate"
                  fill="#EF4444"
                  name="Error Rate (%)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const selectedDeploymentData = deployments.find(
    d => d.deployment_id === selectedDeployment
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Model Deployment Monitor</h1>
          <p className="text-gray-600">
            Monitor and manage model deployments
          </p>
        </div>
        <GitBranch className="w-6 h-6 text-gray-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {deployments.map((deployment) => (
          <Card
            key={deployment.deployment_id}
            className={`cursor-pointer ${
              selectedDeployment === deployment.deployment_id
                ? 'ring-2 ring-blue-500'
                : ''
            }`}
            onClick={() => setSelectedDeployment(deployment.deployment_id)}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">
                    Version {deployment.version_id}
                  </h3>
                  <DeploymentStatus deployment={deployment} />
                </div>
                <DeploymentControls deployment={deployment} />
              </div>
              <div className="mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Started</p>
                    <p className="font-medium">
                      {format(new Date(deployment.started_at), 'MMM d, HH:mm')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Health Score</p>
                    <p className="font-medium">
                      {(deployment.health_score * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedDeploymentData && (
        <>
          <HealthMetricsChart metrics={healthMetrics} />
          <DeploymentStages deployment={selectedDeploymentData} />
          <PerformanceComparison deployment={selectedDeploymentData} />
        </>
      )}
    </div>
  );
};

export default ModelDeploymentDashboard;
```

## backend/Artifacts/github/project-showcase.tsx

```
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Bot, Brain, Building2, Code, MessageSquare, Search } from 'lucide-react';

const ProjectShowcase = () => {
  const [activeDemo, setActiveDemo] = useState(null);

  const projects = [
    {
      id: 'enterprise-bot',
      title: 'Enterprise Assistant',
      description: 'AI-powered enterprise solution for large-scale business operations',
      icon: <Building2 className="w-6 h-6" />,
      features: [
        'Multi-department support',
        'Custom workflow integration',
        'Advanced analytics dashboard',
        'Role-based access control'
      ],
      tags: ['Enterprise', 'GPT-4', 'Analytics', 'Workflow'],
      demoUrl: '#',
    },
    {
      id: 'support-bot',
      title: 'Technical Support Bot',
      description: 'Intelligent technical support assistant with code understanding',
      icon: <Code className="w-6 h-6" />,
      features: [
        'Code analysis',
        'Documentation integration',
        'GitHub issue tracking',
        'Automated troubleshooting'
      ],
      tags: ['Development', 'Support', 'Code', 'GitHub'],
      demoUrl: '#',
    },
    {
      id: 'research-bot',
      title: 'Research Assistant',
      description: 'Advanced research and analysis chatbot for academic and business research',
      icon: <Search className="w-6 h-6" />,
      features: [
        'Literature review',
        'Data analysis',
        'Citation management',
        'Research synthesis'
      ],
      tags: ['Research', 'Analysis', 'Academic', 'Data'],
      demoUrl: '#',
    },
    {
      id: 'customer-service',
      title: 'Customer Service Bot',
      description: 'Intelligent customer service automation with natural language understanding',
      icon: <MessageSquare className="w-6 h-6" />,
      features: [
        'Multi-language support',
        'Sentiment analysis',
        'CRM integration',
        'Automated ticket routing'
      ],
      tags: ['Customer Service', 'NLP', 'CRM', 'Support'],
      demoUrl: '#',
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our AI Solutions</h1>
        <p className="text-xl text-gray-600">
          Cutting-edge chatbot implementations for enterprise needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  {project.icon}
                </div>
                <div>
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Key Features:</h3>
                <ul className="space-y-2">
                  {project.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-blue-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {project.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <button 
                onClick={() => setActiveDemo(project.id)}
                className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300"
              >
                View Demo
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose Geaux Specialist?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Brain className="w-8 h-8 text-blue-500" />
                <CardTitle>Advanced AI</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p>State-of-the-art language models with custom training for your specific needs</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Code className="w-8 h-8 text-blue-500" />
                <CardTitle>Custom Integration</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p>Seamless integration with your existing systems and workflows</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <MessageSquare className="w-8 h-8 text-blue-500" />
                <CardTitle>24/7 Support</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p>Round-the-clock technical support and maintenance for your AI solutions</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectShowcase;
```

## backend/Artifacts/github/github-docs.md

```
# Geaux Specialist LLC Development Documentation

## Repository Structure
```
.github/
  ├── workflows/
  │   ├── build.yml
  │   ├── deploy.yml
  │   └── test.yml
  ├── ISSUE_TEMPLATE/
  │   ├── bug_report.md
  │   └── feature_request.md
  ├── PULL_REQUEST_TEMPLATE.md
docs/
  ├── CONTRIBUTING.md
  ├── COPILOT_INSTRUCTIONS.md
  └── README.md
```

## GitHub Actions Configuration

### .github/workflows/build.yml
```yaml
name: Build and Test
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
      - name: Build project
        run: npm run build
```

### .github/workflows/deploy.yml
```yaml
name: Deploy to Production
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: |
          npm install
          npm run build
          npm run deploy
```

## Issue Templates

### .github/ISSUE_TEMPLATE/bug_report.md
```markdown
---
name: Bug Report
about: Create a report to help us improve
title: '[BUG] '
labels: bug
assignees: ''
---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Additional context**
Add any other context about the problem here.
```

## COPILOT_INSTRUCTIONS.md
```markdown
# GitHub Copilot Instructions for Geaux Specialist LLC Projects

## Overview
This document provides guidelines for using GitHub Copilot effectively within Geaux Specialist LLC projects, particularly focusing on chatbot and GPT wrapper implementations.

### Code Style Guidelines
- Follow consistent naming conventions for AI-related components
- Use descriptive variable names that reflect AI/ML context
- Implement proper error handling for API calls
- Include comprehensive documentation for AI interactions

### Project Structure
Each chatbot implementation should follow this structure:
```typescript
class BotImplementation {
  constructor(config: BotConfig) {
    // Initialize with appropriate configuration
  }

  async processMessage(input: string): Promise<BotResponse> {
    // Process user input and return response
  }

  async handleError(error: Error): Promise<void> {
    // Error handling logic
  }
}
```

### Best Practices
1. Always implement rate limiting for API calls
2. Cache responses when appropriate
3. Implement proper error handling
4. Log all API interactions
5. Use environment variables for sensitive data
```

## README.md
```markdown
# Geaux Specialist LLC

## About Us
Geaux Specialist LLC is a leading technology company specializing in AI integration and chatbot implementations. We provide cutting-edge solutions for businesses looking to leverage AI technology through various GPT wrappers and custom chatbot implementations.

## Our Solutions

### 1. Customer Service Bot
- Custom GPT-powered chatbot for customer service
- Multi-language support
- Integration with popular platforms
- Analytics dashboard

### 2. Content Generation Assistant
- AI-powered content creation
- SEO optimization
- Multi-format support
- Custom training capabilities

### 3. Technical Support Bot
- Code-aware responses
- Documentation integration
- Issue tracking
- Automated troubleshooting

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- OpenAI API key
- MongoDB

### Installation
```bash
git clone https://github.com/geaux-specialist/main.git
cd main
npm install
npm run dev
```

## Contributing
Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

## License
MIT License - see LICENSE.md for details
```

## CONTRIBUTING.md
```markdown
# Contributing to Geaux Specialist LLC Projects

## Getting Started
1. Fork the repository
2. Create a new branch for your feature
3. Make your changes
4. Submit a pull request

## Code Style
- Use TypeScript for all new code
- Follow ESLint configuration
- Write comprehensive tests
- Document all public APIs

## Commit Messages
Follow conventional commits specification:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance

## Pull Request Process
1. Update documentation
2. Add tests for new features
3. Ensure CI passes
4. Get approval from maintainers
```

```

## backend/Artifacts/github/customer-service-demo.tsx

```
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageSquare, Send, Loader2, Languages, Bot } from 'lucide-react';

// Mock API client for demo purposes
const mockApiClient = {
  initializeChat: async () => {
    return {
      chatId: 'demo-' + Math.random().toString(36).substr(2, 9),
      suggestedResponses: [
        { text: "What are your business hours?", confidence: 0.9 },
        { text: "How do I reset my password?", confidence: 0.85 },
        { text: "Can I get a refund?", confidence: 0.8 }
      ]
    };
  },
  sendMessage: async (message) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    const responses = {
      "What are your business hours?": {
        text: "Our business hours are Monday to Friday, 9 AM to 6 PM EST.",
        type: "text"
      },
      "How do I reset my password?": {
        text: "To reset your password, please click on the 'Forgot Password' link on the login page. We'll send you an email with instructions.",
        type: "text"
      },
      "Can I get a refund?": {
        text: "Our refund policy allows returns within 30 days of purchase. Would you like to initiate a refund request?",
        type: "quick_replies",
        components: [
          { type: "button", data: { text: "Yes, start refund" } },
          { type: "button", data: { text: "No, just asking" } }
        ]
      }
    };

    return responses[message] || {
      text: "I understand you're asking about " + message + ". Let me help you with that. What specific information would you like to know?",
      type: "text"
    };
  }
};

const CustomerServiceDemo = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [suggestedResponses, setSuggestedResponses] = useState([]);
  const [error, setError] = useState(null);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsLoading(true);
        const response = await mockApiClient.initializeChat();
        setChatId(response.chatId);
        setSuggestedResponses(response.suggestedResponses);
      } catch (err) {
        setError('Failed to initialize chat. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();
  }, []);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    try {
      setIsLoading(true);
      setMessages(prev => [...prev, { type: 'user', content: message }]);
      setInputMessage('');

      const response = await mockApiClient.sendMessage(message);
      
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: response.text,
        components: response.components
      }]);
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReply = (text) => {
    handleSendMessage(text);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-blue-500" />
            <CardTitle>Customer Service Bot</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-500">EN</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Bot className="w-5 h-5 text-blue-500" />
              </div>
              <div className="bg-gray-100 rounded-lg p-3 max-w-md">
                <p>Hello! I'm here to help you. How can I assist you today?</p>
              </div>
            </div>
            
            {messages.map((message, index) => (
              <div key={index} className={`flex items-start gap-2 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' ? 'bg-blue-500' : 'bg-blue-100'
                }`}>
                  {message.type === 'user' ? (
                    <MessageSquare className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-blue-500" />
                  )}
                </div>
                <div className={`rounded-lg p-3 max-w-md ${
                  message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}>
                  <p>{message.content}</p>
                  {message.components && (
                    <div className="mt-2 flex gap-2">
                      {message.components.map((component, idx) => (
                        component.type === 'button' && (
                          <Button
                            key={idx}
                            variant="secondary"
                            size="sm"
                            onClick={() => handleQuickReply(component.data.text)}
                          >
                            {component.data.text}
                          </Button>
                        )
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                </div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <p>Typing...</p>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mx-4 my-2">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {suggestedResponses.length > 0 && messages.length === 0 && (
          <div className="p-4 border-t">
            <p className="text-sm text-gray-500 mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedResponses.map((response, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSendMessage(response.text)}
                >
                  {response.text}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={() => handleSendMessage(inputMessage)}
              disabled={isLoading || !inputMessage.trim()}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerServiceDemo;
```

## backend/Artifacts/github/project-showcase-docs.md

```
# Project Showcase Component Documentation

## Overview
The ProjectShowcase component is a feature-rich React component designed to display Geaux Specialist's AI solutions and chatbot implementations in an engaging, responsive layout. It provides a modern user interface for showcasing projects, their features, and company benefits.

## Installation

### Prerequisites
- Node.js 18 or higher
- React 18 or higher
- Tailwind CSS 3.0 or higher
- shadcn/ui components

### Required Dependencies
```bash
# Install shadcn/ui components
npm install @/components/ui/card
npm install @/components/ui/badge
npm install @/components/ui/tabs

# Install Lucide icons
npm install lucide-react@0.263.1
```

### Tailwind CSS Configuration
Ensure your `tailwind.config.js` includes the necessary configuration:

```javascript
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Any custom theme extensions
    },
  },
  plugins: [],
}
```

## Component Structure

### Main Components
```
ProjectShowcase/
├── ProjectShowcase.tsx      # Main component
├── types.ts                # TypeScript interfaces
└── components/            # Sub-components (if extracted)
    ├── ProjectCard.tsx
    ├── FeatureList.tsx
    └── BenefitsSection.tsx
```

### TypeScript Interfaces

```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  tags: string[];
  demoUrl: string;
}

interface ProjectShowcaseProps {
  customProjects?: Project[];
  onDemoClick?: (projectId: string) => void;
  className?: string;
}
```

## Usage

### Basic Implementation
```jsx
import { ProjectShowcase } from './components/ProjectShowcase';

function App() {
  return (
    <div className="app">
      <ProjectShowcase />
    </div>
  );
}
```

### Custom Projects Implementation
```jsx
import { ProjectShowcase } from './components/ProjectShowcase';
import { Bot } from 'lucide-react';

const customProjects = [
  {
    id: 'custom-bot',
    title: 'Custom Assistant',
    description: 'Specialized AI assistant for your needs',
    icon: <Bot className="w-6 h-6" />,
    features: [
      'Custom feature 1',
      'Custom feature 2',
      'Custom feature 3',
      'Custom feature 4'
    ],
    tags: ['Custom', 'Specialized', 'AI'],
    demoUrl: '#'
  }
];

function App() {
  const handleDemoClick = (projectId) => {
    // Custom demo handling logic
    console.log(`Opening demo for ${projectId}`);
  };

  return (
    <div className="app">
      <ProjectShowcase 
        customProjects={customProjects}
        onDemoClick={handleDemoClick}
      />
    </div>
  );
}
```

## Component API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| customProjects | Project[] | undefined | Optional array of custom projects to display |
| onDemoClick | (projectId: string) => void | undefined | Optional callback for demo button clicks |
| className | string | undefined | Optional additional CSS classes |

### Default Projects
The component comes with four pre-configured projects:
1. Enterprise Assistant
2. Technical Support Bot
3. Research Assistant
4. Customer Service Bot

### Styling
The component uses Tailwind CSS classes for styling. Key style classes include:

```css
/* Container styles */
.container
.mx-auto
.px-4
.py-8

/* Grid layout */
.grid
.grid-cols-1
.md:grid-cols-2
.lg:grid-cols-2
.gap-6

/* Card styles */
.hover:shadow-lg
.transition-shadow
.duration-300
```

## Customization

### Adding New Projects
```typescript
const newProject: Project = {
  id: 'new-project',
  title: 'New Project Title',
  description: 'Project description',
  icon: <YourIcon className="w-6 h-6" />,
  features: [
    'Feature 1',
    'Feature 2',
    'Feature 3',
    'Feature 4'
  ],
  tags: ['Tag1', 'Tag2', 'Tag3'],
  demoUrl: '#'
};

// Add to customProjects array
```

### Modifying Card Styles
```jsx
<Card className="your-custom-classes hover:your-custom-hover">
  {/* Card content */}
</Card>
```

### Custom Icon Integration
```jsx
import { YourCustomIcon } from 'your-icon-library';

const customIcon = <YourCustomIcon className="w-6 h-6" />;
```

## Accessibility

The component implements several accessibility features:

1. Semantic HTML structure
2. ARIA labels for interactive elements
3. Keyboard navigation support
4. Color contrast compliance
5. Screen reader-friendly content structure

## Best Practices

1. **Project Data Management**
   - Keep project data in a separate file/database
   - Use TypeScript interfaces for type safety
   - Validate project data before rendering

2. **Performance**
   - Implement lazy loading for images
   - Use memo for expensive computations
   - Optimize icon imports

3. **Responsive Design**
   - Test across different screen sizes
   - Ensure text remains readable
   - Maintain proper spacing on mobile

4. **Error Handling**
   - Implement fallbacks for missing data
   - Handle loading states gracefully
   - Provide meaningful error messages

## Examples

### Integration with React Router
```jsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ProjectShowcase } from './components/ProjectShowcase';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/projects" element={<ProjectShowcase />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Adding Analytics
```jsx
import { ProjectShowcase } from './components/ProjectShowcase';
import { trackEvent } from './analytics';

function App() {
  const handleDemoClick = (projectId) => {
    trackEvent('demo_viewed', { projectId });
  };

  return <ProjectShowcase onDemoClick={handleDemoClick} />;
}
```

## Troubleshooting

### Common Issues

1. **Icons Not Displaying**
   ```
   Solution: Ensure Lucide React is properly installed and imported
   npm install lucide-react@0.263.1
   ```

2. **Styling Inconsistencies**
   ```
   Solution: Check Tailwind CSS configuration and class names
   ```

3. **Type Errors**
   ```
   Solution: Verify proper TypeScript interface implementation
   ```

## Contributing

When contributing to the ProjectShowcase component:

1. Follow the established code style
2. Add appropriate TypeScript types
3. Update documentation for new features
4. Add unit tests for new functionality
5. Test across different browsers and devices

## Future Enhancements

Planned improvements include:

1. Interactive demo modal system
2. Advanced filtering and search
3. Animation and transition effects
4. Integration with backend APIs
5. Enhanced analytics tracking

```

## backend/Artifacts/github/chatbot-components-docs.md

```
# Geaux Specialist Chatbot Components

## Table of Contents
1. [Enterprise Assistant](#enterprise-assistant)
2. [Technical Support Bot](#technical-support-bot)
3. [Research Assistant](#research-assistant)
4. [Customer Service Bot](#customer-service-bot)

## Enterprise Assistant

### Overview
The Enterprise Assistant is a sophisticated AI-powered component designed for large-scale business operations, featuring department-specific knowledge and workflow integration.

### Component Structure
```typescript
// EnterpriseAssistant.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Department {
  id: string;
  name: string;
  workflows: Workflow[];
}

interface Workflow {
  id: string;
  name: string;
  steps: WorkflowStep[];
}

interface WorkflowStep {
  id: string;
  action: string;
  requiredRole: string;
}

const EnterpriseAssistant: React.FC<EnterpriseAssistantProps> = ({
  departments,
  currentUser,
  onWorkflowComplete
}) => {
  // Implementation
};
```

### Key Features
1. **Department Routing**
```typescript
const handleDepartmentRouting = (query: string): Department => {
  // NLP-based department detection
  const detectedDepartment = nlpRouter.analyze(query);
  return departments.find(d => d.id === detectedDepartment);
};
```

2. **Workflow Integration**
```typescript
const initiateWorkflow = async (workflow: Workflow) => {
  for (const step of workflow.steps) {
    if (await validateUserRole(currentUser, step.requiredRole)) {
      await executeWorkflowStep(step);
    }
  }
};
```

3. **Analytics Dashboard**
```typescript
interface AnalyticsData {
  departmentUsage: Record<string, number>;
  workflowCompletions: Record<string, number>;
  userEngagement: Record<string, UserEngagement>;
}

const AnalyticsDashboard: React.FC<{data: AnalyticsData}> = ({data}) => {
  // Implementation
};
```

### Usage Example
```tsx
import { EnterpriseAssistant } from './components/EnterpriseAssistant';

function App() {
  return (
    <EnterpriseAssistant
      departments={departmentConfig}
      currentUser={userContext}
      onWorkflowComplete={handleWorkflowComplete}
      analyticsConfig={analyticsOptions}
    />
  );
}
```

## Technical Support Bot

### Overview
A code-aware support assistant designed for development teams, featuring GitHub integration and documentation parsing capabilities.

### Component Structure
```typescript
// TechnicalSupportBot.tsx
interface CodeContext {
  language: string;
  framework?: string;
  errorStack?: string;
}

interface DocumentationSource {
  type: 'github' | 'docs' | 'stackoverflow';
  url: string;
  relevance: number;
}

const TechnicalSupportBot: React.FC<TechSupportProps> = ({
  githubToken,
  docsConfig,
  onSolutionFound
}) => {
  // Implementation
};
```

### Key Features
1. **Code Analysis**
```typescript
const analyzeCode = async (code: string): Promise<CodeAnalysis> => {
  const language = detectLanguage(code);
  const potentialIssues = await staticAnalyzer.scan(code);
  const suggestions = await generateSuggestions(potentialIssues);
  
  return {
    language,
    issues: potentialIssues,
    suggestions
  };
};
```

2. **Documentation Integration**
```typescript
const searchDocumentation = async (
  query: string,
  context: CodeContext
): Promise<DocumentationSource[]> => {
  const results = await Promise.all([
    searchGitHub(query, context),
    searchDocs(query, context),
    searchStackOverflow(query, context)
  ]);
  
  return rankAndFilterResults(results);
};
```

3. **Issue Tracking**
```typescript
interface IssueTracker {
  createIssue: (title: string, body: string) => Promise<string>;
  updateIssue: (id: string, update: Partial<Issue>) => Promise<void>;
  linkRelatedIssues: (issueId: string, relatedIds: string[]) => Promise<void>;
}
```

### Usage Example
```tsx
import { TechnicalSupportBot } from './components/TechnicalSupportBot';

function DevPortal() {
  return (
    <TechnicalSupportBot
      githubToken={process.env.GITHUB_TOKEN}
      docsConfig={{
        sources: ['github', 'readthedocs', 'stackoverflow'],
        maxResults: 5
      }}
      onSolutionFound={handleSolution}
    />
  );
}
```

## Research Assistant

### Overview
An advanced research tool designed for academic and business research, featuring literature review and data analysis capabilities.

### Component Structure
```typescript
// ResearchAssistant.tsx
interface ResearchContext {
  field: string;
  methodology: string;
  dataTypes: string[];
}

interface AnalysisResult {
  summary: string;
  keyFindings: string[];
  citations: Citation[];
  confidence: number;
}

const ResearchAssistant: React.FC<ResearchProps> = ({
  context,
  dataSources,
  outputFormat
}) => {
  // Implementation
};
```

### Key Features
1. **Literature Review**
```typescript
const conductLiteratureReview = async (
  topic: string,
  parameters: ReviewParameters
): Promise<Review> => {
  const sources = await searchAcademicDatabases(topic);
  const analysis = await analyzePapers(sources);
  return synthesizeFindings(analysis);
};
```

2. **Data Analysis**
```typescript
const analyzeDataset = async (
  data: Dataset,
  analysisType: AnalysisType
): Promise<AnalysisResult> => {
  const cleanData = await preprocessData(data);
  const statistics = await computeStatistics(cleanData);
  const visualization = await generateVisualizations(statistics);
  
  return {
    statistics,
    visualization,
    interpretation: await interpretResults(statistics)
  };
};
```

3. **Citation Management**
```typescript
interface CitationManager {
  addCitation: (source: Source) => string;
  formatCitation: (id: string, style: 'APA' | 'MLA' | 'Chicago') => string;
  exportBibliography: (style: string) => string;
}
```

### Usage Example
```tsx
import { ResearchAssistant } from './components/ResearchAssistant';

function ResearchPortal() {
  return (
    <ResearchAssistant
      context={{
        field: 'Computer Science',
        methodology: 'Quantitative',
        dataTypes: ['numerical', 'categorical']
      }}
      dataSources={configuredSources}
      outputFormat="academic"
    />
  );
}
```

## Customer Service Bot

### Overview
An intelligent customer service automation system with natural language understanding and sentiment analysis.

### Component Structure
```typescript
// CustomerServiceBot.tsx
interface CustomerContext {
  history: Interaction[];
  preferences: CustomerPreferences;
  sentiment: SentimentScore;
}

interface Response {
  message: string;
  actions?: Action[];
  followUp?: string;
}

const CustomerServiceBot: React.FC<CustomerServiceProps> = ({
  context,
  integrations,
  languageOptions
}) => {
  // Implementation
};
```

### Key Features
1. **Multi-language Support**
```typescript
const handleMultiLanguage = async (
  input: string,
  preferredLanguage: string
): Promise<Response> => {
  const detectedLanguage = await detectLanguage(input);
  const translatedInput = await translateIfNeeded(input, detectedLanguage);
  const response = await generateResponse(translatedInput);
  return translateResponse(response, preferredLanguage);
};
```

2. **Sentiment Analysis**
```typescript
const analyzeSentiment = async (
  interaction: Interaction
): Promise<SentimentAnalysis> => {
  const textSentiment = await analyzeText(interaction.message);
  const contextSentiment = await analyzeContext(interaction.context);
  
  return {
    overall: combineSentimentScores(textSentiment, contextSentiment),
    factors: identifySentimentFactors(textSentiment),
    trend: analyzeSentimentTrend(interaction.history)
  };
};
```

3. **CRM Integration**
```typescript
interface CRMIntegration {
  updateCustomerRecord: (customerId: string, update: Partial<CustomerRecord>) => Promise<void>;
  createTicket: (issue: Issue) => Promise<string>;
  routeToAgent: (ticket: Ticket, agentCriteria: AgentCriteria) => Promise<void>;
}
```

### Usage Example
```tsx
import { CustomerServiceBot } from './components/CustomerServiceBot';

function SupportPortal() {
  return (
    <CustomerServiceBot
      context={customerContext}
      integrations={{
        crm: crmConfig,
        ticketing: ticketingConfig,
        knowledge: knowledgeBaseConfig
      }}
      languageOptions={supportedLanguages}
    />
  );
}
```

## Common Utilities

### Error Handling
```typescript
class BotError extends Error {
  constructor(
    message: string,
    public code: string,
    public context: any
  ) {
    super(message);
    this.name = 'BotError';
  }
}

const handleBotError = (error: BotError) => {
  // Common error handling logic
};
```

### State Management
```typescript
interface BotState {
  status: 'idle' | 'processing' | 'error';
  context: any;
  history: Interaction[];
}

const useBotState = (initialState: BotState) => {
  // Bot state management hook
};
```

### Analytics Integration
```typescript
interface AnalyticsEvent {
  type: string;
  data: any;
  timestamp: number;
}

const trackBotAnalytics = (event: AnalyticsEvent) => {
  // Analytics tracking implementation
};
```

## Testing Strategies

### Unit Testing
```typescript
describe('Bot Components', () => {
  test('Enterprise Assistant Department Routing', () => {
    // Test implementation
  });
  
  test('Technical Support Code Analysis', () => {
    // Test implementation
  });
  
  // More tests...
});
```

### Integration Testing
```typescript
describe('Bot Integrations', () => {
  test('CRM Integration', () => {
    // Test implementation
  });
  
  test('Documentation Integration', () => {
    // Test implementation
  });
  
  // More tests...
});
```

## Performance Optimization

### Caching Strategy
```typescript
interface Cache {
  set: (key: string, value: any, ttl?: number) => void;
  get: (key: string) => any;
  invalidate: (key: string) => void;
}

const botCache: Cache = {
  // Cache implementation
};
```

### Rate Limiting
```typescript
const rateLimiter = {
  checkLimit: (key: string): boolean => {
    // Rate limiting logic
  },
  updateCount: (key: string): void => {
    // Update count logic
  }
};
```

## Security Considerations

### Data Sanitization
```typescript
const sanitizeInput = (input: string): string => {
  // Input sanitization logic
};
```

### Authentication
```typescript
const authenticateBot = async (
  credentials: BotCredentials
): Promise<AuthToken> => {
  // Authentication logic
};
```

## Deployment

### Environment Configuration
```typescript
interface BotConfig {
  environment: 'development' | 'staging' | 'production';
  apiKeys: Record<string, string>;
  features: Record<string, boolean>;
}
```

### Monitoring
```typescript
interface BotMonitoring {
  logError: (error: Error) => void;
  trackMetric: (metric: string, value: number) => void;
  reportHealth: () => Promise<HealthStatus>;
}
```

```

## backend/Artifacts/github/chatbot-api-docs.md

```
# Geaux Specialist Chatbot API Documentation

## API Overview

Base URL: `https://api.geaux-specialist.com/v1`

### Authentication
All API requests require an API key passed in the header:
```
Authorization: Bearer your-api-key
```

### Rate Limiting
- 100 requests per minute for standard tier
- 1000 requests per minute for enterprise tier
- Rate limit headers included in responses:
  ```
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 95
  X-RateLimit-Reset: 1582834800
  ```

### Response Format
All responses follow the format:
```json
{
  "status": "success" | "error",
  "data": object | array | null,
  "error": {
    "code": string,
    "message": string
  } | null
}
```

## Enterprise Assistant API

### Create Conversation
```http
POST /enterprise/conversations
```

Request body:
```json
{
  "department": "hr" | "it" | "finance" | "sales",
  "initialMessage": string,
  "userData": {
    "userId": string,
    "role": string,
    "permissions": string[]
  }
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "conversationId": string,
    "department": string,
    "createdAt": string,
    "context": object
  }
}
```

### Send Message
```http
POST /enterprise/conversations/{conversationId}/messages
```

Request body:
```json
{
  "message": string,
  "attachments": Array<{
    "type": "file" | "image" | "document",
    "url": string,
    "metadata": object
  }>,
  "context": {
    "workflowId": string?,
    "stepId": string?
  }
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "messageId": string,
    "response": string,
    "actions": Array<{
      "type": "button" | "form" | "workflow",
      "data": object
    }>,
    "workflow": {
      "status": "active" | "completed" | "pending",
      "nextStep": object?
    }
  }
}
```

### Get Workflows
```http
GET /enterprise/workflows
```

Query parameters:
- `department`: string
- `status`: "active" | "completed" | "all"
- `limit`: number
- `offset`: number

Response:
```json
{
  "status": "success",
  "data": {
    "workflows": Array<{
      "id": string,
      "name": string,
      "department": string,
      "steps": Array<{
        "id": string,
        "name": string,
        "requiredRole": string,
        "status": "pending" | "completed" | "blocked"
      }>,
      "status": "active" | "completed",
      "createdAt": string,
      "updatedAt": string
    }>,
    "pagination": {
      "total": number,
      "limit": number,
      "offset": number
    }
  }
}
```

## Technical Support Bot API

### Analyze Code
```http
POST /technical/analyze
```

Request body:
```json
{
  "code": string,
  "language": string,
  "context": {
    "framework": string?,
    "dependencies": Array<{
      "name": string,
      "version": string
    }>,
    "environment": object?
  }
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "analysis": {
      "language": string,
      "issues": Array<{
        "type": "error" | "warning" | "suggestion",
        "message": string,
        "line": number,
        "column": number,
        "severity": number
      }>,
      "suggestions": Array<{
        "description": string,
        "code": string?,
        "documentation": string?
      }>,
      "references": Array<{
        "type": "documentation" | "stackoverflow" | "github",
        "url": string,
        "relevance": number
      }>
    }
  }
}
```

### Search Documentation
```http
GET /technical/docs/search
```

Query parameters:
- `query`: string
- `sources`: Array<"github" | "docs" | "stackoverflow">
- `language`: string?
- `framework`: string?
- `limit`: number
- `offset`: number

Response:
```json
{
  "status": "success",
  "data": {
    "results": Array<{
      "title": string,
      "source": "github" | "docs" | "stackoverflow",
      "url": string,
      "content": string,
      "relevance": number,
      "metadata": {
        "author": string?,
        "datePublished": string?,
        "votes": number?,
        "views": number?
      }
    }>,
    "pagination": {
      "total": number,
      "limit": number,
      "offset": number
    }
  }
}
```

### Create Issue
```http
POST /technical/issues
```

Request body:
```json
{
  "title": string,
  "description": string,
  "type": "bug" | "feature" | "question",
  "priority": "low" | "medium" | "high",
  "labels": string[],
  "attachments": Array<{
    "type": string,
    "url": string
  }>,
  "assignees": string[]
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "issueId": string,
    "url": string,
    "status": "open",
    "createdAt": string
  }
}
```

## Research Assistant API

### Start Research
```http
POST /research/projects
```

Request body:
```json
{
  "topic": string,
  "field": string,
  "parameters": {
    "methodology": "qualitative" | "quantitative" | "mixed",
    "dateRange": {
      "start": string,
      "end": string
    },
    "sources": Array<"academic" | "journals" | "books" | "web">,
    "languages": string[]
  }
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "projectId": string,
    "status": "initiated",
    "estimatedDuration": number,
    "phases": Array<{
      "name": string,
      "status": "pending" | "active" | "completed",
      "estimatedCompletion": string
    }>
  }
}
```

### Analyze Dataset
```http
POST /research/analysis
```

Request body:
```json
{
  "dataset": {
    "type": "csv" | "json" | "excel",
    "url": string | {
      "data": Array<object>
    }
  },
  "analysis": {
    "type": Array<"descriptive" | "inferential" | "predictive">,
    "variables": Array<{
      "name": string,
      "type": "numerical" | "categorical" | "temporal",
      "role": "independent" | "dependent"
    }>,
    "methods": Array<"regression" | "classification" | "clustering">
  }
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "analysisId": string,
    "results": {
      "summary": object,
      "visualizations": Array<{
        "type": string,
        "data": object,
        "metadata": object
      }>,
      "insights": Array<{
        "description": string,
        "confidence": number,
        "support": object
      }>,
      "exports": {
        "pdf": string,
        "csv": string,
        "json": string
      }
    }
  }
}
```

## Customer Service Bot API

### Initialize Chat
```http
POST /customer-service/chats
```

Request body:
```json
{
  "customerId": string,
  "language": string,
  "channel": "web" | "mobile" | "email",
  "context": {
    "history": Array<{
      "type": "interaction" | "purchase" | "support",
      "timestamp": string,
      "data": object
    }>,
    "preferences": object
  }
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "chatId": string,
    "token": string,
    "supportedFeatures": Array<string>,
    "suggestedResponses": Array<{
      "text": string,
      "confidence": number
    }>
  }
}
```

### Send Customer Message
```http
POST /customer-service/chats/{chatId}/messages
```

Request body:
```json
{
  "message": string,
  "attachments": Array<{
    "type": string,
    "url": string
  }>,
  "sentiment": {
    "score": number,
    "labels": string[]
  }
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "messageId": string,
    "response": {
      "text": string,
      "type": "text" | "quick_replies" | "buttons" | "template",
      "components": Array<{
        "type": string,
        "data": object
      }>,
      "context": {
        "intent": string,
        "confidence": number,
        "entities": Array<{
          "type": string,
          "value": string,
          "confidence": number
        }>
      }
    },
    "actions": Array<{
      "type": string,
      "data": object
    }>
  }
}
```

### Create Ticket
```http
POST /customer-service/tickets
```

Request body:
```json
{
  "chatId": string,
  "customerId": string,
  "issue": {
    "type": string,
    "description": string,
    "priority": "low" | "medium" | "high",
    "category": string
  },
  "metadata": {
    "source": string,
    "tags": string[],
    "attachments": Array<{
      "type": string,
      "url": string
    }>
  }
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "ticketId": string,
    "status": "created",
    "assignedTo": string?,
    "estimatedResponse": string,
    "priority": string
  }
}
```

## Webhooks

### Register Webhook
```http
POST /webhooks
```

Request body:
```json
{
  "url": string,
  "events": Array<"message.created" | "workflow.completed" | "ticket.updated">,
  "secret": string,
  "metadata": {
    "description": string?,
    "version": string?
  }
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "webhookId": string,
    "status": "active",
    "createdAt": string
  }
}
```

### Webhook Payload Format
```json
{
  "id": string,
  "timestamp": string,
  "type": string,
  "data": object,
  "signature": string
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `auth_error` | Authentication failed |
| `invalid_request` | Invalid request parameters |
| `rate_limit_exceeded` | Rate limit exceeded |
| `resource_not_found` | Requested resource not found |
| `service_error` | Internal service error |
| `validation_error` | Request validation failed |

## SDK Examples

### Node.js
```javascript
const GeauxSpecialist = require('geaux-specialist-node');

const client = new GeauxSpecialist({
  apiKey: 'your-api-key',
  environment: 'production'
});

// Enterprise Assistant
const conversation = await client.enterprise.createConversation({
  department: 'hr',
  initialMessage: 'Need help with onboarding'
});

// Technical Support
const analysis = await client.technical.analyzeCode({
  code: sourceCode,
  language: 'javascript'
});

// Research Assistant
const research = await client.research.startProject({
  topic: 'AI Ethics',
  field: 'Computer Science'
});

// Customer Service
const chat = await client.customerService.initializeChat({
  customerId: 'customer-123',
  language: 'en'
});
```

### Python
```python
from geaux_specialist import Client

client = Client(
    api_key='your-api-key',
    environment='production'
)

# Enterprise Assistant
conversation = client.enterprise.create_conversation(
    department='hr',
    initial_message='Need help with onboarding'
)

# Technical Support
analysis = client.technical.analyze_code(
    code=source_code,
    language='python'
)

# Research Assistant
research = client.research.start_project(
    topic='AI Ethics',
    field='Computer Science'
)

# Customer Service
chat = client.customer_service.initialize_chat(
    customer_id='customer-123',
    language='en'
)
```

## Testing

### Test Environment
```
Base URL: https://api-test.geaux-specialist.com/v1
API Key: test-api-key
```

### Test Data
```json
{
  "customers": [
    {
      "id": "test-customer-1",
      "email": "test@example.com"
    }
  ],
  "workflows": [
    {
      "id": "test-workflow-1",
      "name": "Test Workflow"
    }
  ]
}
```

## Best Practices

1. **Error Handling**
   - Always check response status
   - Implement exponential backoff for retries
   - Log detailed error information

2. **Rate Limiting**
   - Monitor rate limit headers
   - Implement request queuing
   - Use bulk endpoints when possible

3. **Authentication**
   - Rotate API keys regularly
   - Use environment variables
   - Implement key expiration handling

4. **Webhooks**
   - Verify webhook signatures
   - Implement retry logic
   - Store webhook events

## Migration Guides

### v1 to v2 Migration
```javascript
// Old v1 format
client.sendMessage({
  text: message
});

// New v2 format
client.messages.create({
  content: message,
  metadata: {}
});
```

## Support

- Documentation: https://docs.geaux-specialist.com
- API Status: https://status.geaux-specialist.com
- Support Email: api-support@geaux-specialist.com


```

## backend/Artifacts/cat-plugin-artifact/firebase-functions.ts

```
// File: functions/src/index.ts
import { onCall } from "firebase-functions/v2/https";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { logger } from "firebase-functions";
import { cheshireService } from "./services/cheshire";

interface LearningStyleAssessment {
  userId: string;
  interactionData: {
    responseLatency: number;
    queryComplexity: number;
    feedbackIterations: number;
  };
  timestamp: string;
}

interface CurriculumRequest {
  userId: string;
  grade_level: number;
  subject: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  learning_style?: string;
  standards?: string[];
}

/**
 * Analyzes learning style based on interaction patterns
 * Integrates with CrewAI agents for pattern recognition
 */
export const analyzeLearningStyle = onCall<LearningStyleAssessment>(async (request) => {
  try {
    const { userId, interactionData, timestamp } = request.data;
    logger.info(`Analyzing learning style for user: ${userId}`, { 
      structuredData: true 
    });

    // Query Cheshire Cat's episodic memory
    const patterns = await cheshireService.post('/memory/recall', {
      metadata: {
        userId,
        type: 'interaction_pattern'
      },
      k: 50 // Last 50 interactions
    });

    // Process with CrewAI agent
    const analysis = await cheshireService.post('/plugins/learning-style-analyzer/analyze', {
      patterns: patterns.data,
      currentInteraction: interactionData,
      userId
    });

    // Store results in Firestore
    await updateLearningStyleProfile(userId, {
      style: analysis.data.style,
      confidence: analysis.data.confidence,
      lastUpdated: timestamp,
      evidence: {
        interactions: patterns.data.length,
        accuracy: analysis.data.accuracy,
        engagementScore: analysis.data.engagement
      }
    });

    return {
      success: true,
      data: analysis.data
    };
  } catch (error) {
    logger.error('Learning style analysis failed:', error);
    throw new Error('Failed to analyze learning style');
  }
});

/**
 * Generates curriculum based on learning style and requirements
 * Uses CrewAI agents for personalized content generation
 */
export const generateCurriculum = onCall<CurriculumRequest>(async (request) => {
  try {
    const { userId, grade_level, subject, difficulty, learning_style, standards } = request.data;
    logger.info(`Generating curriculum for user: ${userId}`, {
      subject,
      grade_level,
      structuredData: true
    });

    // Enhanced curriculum generation with CrewAI
    const curriculum = await cheshireService.post('/plugins/MyCurriculumDesigner/design-curriculum', {
      userId,
      grade_level,
      subject,
      difficulty,
      learning_style,
      standards,
      timestamp: new Date().toISOString()
    });

    // Store curriculum in Firestore
    await storeCurriculumData(userId, {
      ...curriculum.data,
      metadata: {
        generated_at: new Date().toISOString(),
        learning_style,
        grade_level,
        subject
      }
    });

    return {
      success: true,
      data: curriculum.data
    };
  } catch (error) {
    logger.error('Curriculum generation failed:', error);
    throw new Error('Failed to generate curriculum');
  }
});

/**
 * Monitors learning progress and triggers style reassessment
 * Reacts to changes in user interaction patterns
 */
export const monitorLearningProgress = onDocumentWritten('users/{userId}/interactions/{interactionId}', async (event) => {
  try {
    const userId = event.params.userId;
    const interactionData = event.data?.after.data();
    
    if (!interactionData) return;

    logger.info(`Processing interaction for user: ${userId}`, {
      structuredData: true
    });

    // Calculate engagement metrics
    const metrics = calculateEngagementMetrics(interactionData);

    // Check if style reassessment is needed
    if (shouldReassessStyle(metrics)) {
      await triggerStyleReassessment(userId, metrics);
    }

    // Update learning progress
    await updateLearningProgress(userId, {
      last_interaction: new Date().toISOString(),
      engagement_metrics: metrics,
      progress_indicators: calculateProgressIndicators(interactionData)
    });
  } catch (error) {
    logger.error('Failed to process learning progress:', error);
  }
});

// Utility functions
async function updateLearningStyleProfile(
  userId: string,
  styleData: Record<string, any>
): Promise<void> {
  // Implementation
}

async function storeCurriculumData(
  userId: string,
  curriculumData: Record<string, any>
): Promise<void> {
  // Implementation
}

function calculateEngagementMetrics(
  interactionData: Record<string, any>
): Record<string, number> {
  // Implementation
  return {};
}

function shouldReassessStyle(
  metrics: Record<string, number>
): boolean {
  // Implementation
  return false;
}

async function triggerStyleReassessment(
  userId: string,
  metrics: Record<string, number>
): Promise<void> {
  // Implementation
}

async function updateLearningProgress(
  userId: string,
  progressData: Record<string, any>
): Promise<void> {
  // Implementation
}

function calculateProgressIndicators(
  interactionData: Record<string, any>
): Record<string, number> {
  // Implementation
  return {};
}
```

## backend/Artifacts/cat-plugin-artifact/material-upload.tsx

```
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, BookOpen, X } from 'lucide-react';
import { declarativeMemory } from '@/services/declarativeMemory';

interface MaterialUploadProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const MaterialUpload: React.FC<MaterialUploadProps> = ({
  onSuccess,
  onError
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState({
    title: '',
    subject: '',
    gradeLevel: 1,
    type: 'lesson' as const,
    tags: [],
    author: '',
    status: 'draft' as const
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Auto-populate title from filename
      setMetadata(prev => ({
        ...prev,
        title: selectedFile.name.replace(/\.[^/.]+$/, '')
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      await declarativeMemory.storeCurriculumMaterial(file, {
        ...metadata,
        createdAt: new Date()
      });
      
      setFile(null);
      setMetadata({
        title: '',
        subject: '',
        gradeLevel: 1,
        type: 'lesson',
        tags: [],
        author: '',
        status: 'draft'
      });
      
      onSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload material';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Upload Curriculum Material
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">File</label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              {file ? (
                <div className="flex items-center justify-between">
                  <span>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 mx-auto text-gray-400" />
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.txt,.md"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer text-blue-500 hover:text-blue-700"
                  >
                    Choose a file
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Title</label>
              <input
                type="text"
                value={metadata.title}
                onChange={e => setMetadata(prev => ({
                  ...prev,
                  title: e.target.value
                }))}
                className="border rounded-lg p-2"
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <input
                type="text"
                
```

## backend/Artifacts/cat-plugin-artifact/curriculum-designer-component.tsx

```
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { cheshireService } from '@/services/cheshireService';

interface CurriculumRequest {
  grade_level: number;
  subject: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  standards?: string[];
}

interface CurriculumResponse {
  lesson_plan: Record<string, any>;
  resources: string[];
  estimated_duration: string;
  learning_objectives: string[];
  assessment_criteria: string[];
}

export const CurriculumDesigner: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [curriculum, setCurriculum] = useState<CurriculumResponse | null>(null);
  const [request, setRequest] = useState<CurriculumRequest>({
    grade_level: 1,
    subject: '',
    difficulty: 'beginner'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await cheshireService.post('/plugins/MyCurriculumDesigner/design-curriculum', {
        ...request,
        user_id: user?.uid
      });

      setCurriculum(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate curriculum');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Curriculum Designer</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="number"
              label="Grade Level"
              min={1}
              max={12}
              value={request.grade_level}
              onChange={(e) => setRequest(prev => ({
                ...prev,
                grade_level: parseInt(e.target.value)
              }))}
              required
            />

            <Input
              type="text"
              label="Subject"
              value={request.subject}
              onChange={(e) => setRequest(prev => ({
                ...prev,
                subject: e.target.value
              }))}
              required
            />

            <select
              className="w-full p-2 border rounded"
              value={request.difficulty}
              onChange={(e) => setRequest(prev => ({
                ...prev,
                difficulty: e.target.value as CurriculumRequest['difficulty']
              }))}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full"
            >
              {loading ? <LoadingSpinner /> : 'Generate Curriculum'}
            </Button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-500 rounded">
              {error}
            </div>
          )}

          {curriculum && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">Generated Curriculum</h3>
              
              <div className="space-y-2">
                <h4 className="font-medium">Duration</h4>
                <p>{curriculum.estimated_duration}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Learning Objectives</h4>
                <ul className="list-disc pl-5">
                  {curriculum.learning_objectives.map((objective, i) => (
                    <li key={i}>{objective}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Resources</h4>
                <ul className="list-disc pl-5">
                  {curriculum.resources.map((resource, i) => (
                    <li key={i}>{resource}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Assessment Criteria</h4>
                <ul className="list-disc pl-5">
                  {curriculum.assessment_criteria.map((criteria, i) => (
                    <li key={i}>{criteria}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CurriculumDesigner;
```

## backend/Artifacts/cat-plugin-artifact/adaptive-chat-component.tsx

```
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useInteractionAnalysis } from '@/hooks/useInteractionAnalysis';
import { Brain, Send } from 'lucide-react';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  learningStyle?: string;
}

export const LearningStyleChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const {
    startInteraction,
    recordFeedback,
    completeInteraction,
    adaptContent,
    learningStyle,
    loading
  } = useInteractionAnalysis();

  // Process and send message
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    // Start tracking interaction
    startInteraction();

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      // Get AI response
      let response = await processAIResponse(input);

      // Adapt response based on learning style
      if (learningStyle) {
        response = await adaptContent(response);
      }

      // Add AI message
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'ai',
        timestamp: new Date(),
        learningStyle: learningStyle?.style
      };

      setMessages(prev => [...prev, aiMessage]);

      // Complete interaction tracking
      await completeInteraction(input);
    } catch (error) {
      console.error('Error processing message:', error);
      // Handle error...
    }
  };

  // Request clarification or feedback
  const handleClarification = useCallback(async () => {
    recordFeedback();
    // Implement clarification request logic...
  }, [recordFeedback]);

  // Render learning style indicator
  const renderStyleIndicator = () => {
    if (!learningStyle) return null;

    const styles = {
      visual: { icon: '👁️', color: 'bg-blue-100' },
      auditory: { icon: '👂', color: 'bg-green-100' },
      reading: { icon: '📚', color: 'bg-yellow-100' },
      kinesthetic: { icon: '🤚', color: 'bg-purple-100' }
    };

    const style = styles[learningStyle.style as keyof typeof styles];

    return (
      <div className={`px-3 py-1 rounded-full ${style.color} flex items-center gap-2`}>
        <span>{style.icon}</span>
        <span className="capitalize">{learningStyle.style}</span>
        <span className="text-sm opacity-75">
          ({(learningStyle.confidence * 100).toFixed(0)}%)
        </span>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Adaptive Learning Chat
        </CardTitle>
        {renderStyleIndicator()}
      </CardHeader>

      <CardContent>
        <div className="h-[500px] overflow-y-auto mb-4 space-y-4 p-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80
```

## backend/Artifacts/cat-plugin-artifact/memory-hook.ts

```
// File: src/hooks/useMemorySystem.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { dualMemorySystem } from '@/services/memoryService';
import { LearningSession } from '@/types/memory';

export function useMemorySystem() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [learningPatterns, setLearningPatterns] = useState<LearningSession[]>([]);

  // Fetch learning patterns on mount and user change
  useEffect(() => {
    if (user) {
      fetchLearningPatterns();
    }
  }, [user]);

  // Store a new learning interaction
  const storeInteraction = useCallback(async (
    content: string,
    metadata: Record<string, any>
  ) => {
    if (!user) return false;

    setLoading(true);
    setError(null);

    try {
      const success = await dualMemorySystem.storeInteraction(content, {
        userId: user.uid,
        timestamp: new Date(),
        ...metadata
      });

      if (success) {
        // Refresh patterns after storing new interaction
        await fetchLearningPatterns();
      }

      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to store interaction');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch and analyze learning patterns
  const fetchLearningPatterns = useCallback(async (timeframe?: number) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const patterns = await dualMemorySystem.analyzeLearningPatterns(
        user.uid,
        timeframe
      );
      setLearningPatterns(patterns);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch learning patterns');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Search declarative memory
  const searchMemory = useCallback(async (
    query: string,
    metadata?: Record<string, any>
  ) => {
    if (!user) return [];

    try {
      return await dualMemorySystem.searchDeclarativeMemory(query, {
        userId: user.uid,
        ...metadata
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search memory');
      return [];
    }
  }, [user]);

  return {
    storeInteraction,
    fetchLearningPatterns,
    searchMemory,
    learningPatterns,
    loading,
    error
  };
}
```

## backend/Artifacts/cat-plugin-artifact/form-validation.ts

```
// File: src/hooks/useCurriculumForm.ts
import { useState, useCallback } from 'react';
import { cheshireService } from '@/services/cheshireService';
import { useAuth } from '@/contexts/AuthContext';

interface FormErrors {
  grade_level?: string;
  subject?: string;
  difficulty?: string;
  standards?: string;
}

interface ValidationRule {
  validate: (value: any) => boolean;
  message: string;
}

const validationRules: Record<string, ValidationRule> = {
  grade_level: {
    validate: (value: number) => value >= 1 && value <= 12,
    message: 'Grade level must be between 1 and 12'
  },
  subject: {
    validate: (value: string) => value.trim().length >= 2,
    message: 'Subject must be at least 2 characters long'
  },
  difficulty: {
    validate: (value: string) => ['beginner', 'intermediate', 'advanced'].includes(value),
    message: 'Invalid difficulty level'
  }
};

export function useCurriculumForm() {
  const { user } = useAuth();
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const validateForm = useCallback((formData: CurriculumRequest): boolean => {
    const newErrors: FormErrors = {};

    // Validate each field
    Object.entries(validationRules).forEach(([field, rule]) => {
      if (!rule.validate(formData[field])) {
        newErrors[field] = rule.message;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  const handleSubmit = useCallback(async (
    formData: CurriculumRequest,
    learningStyle: LearningStyleData | null,
    engagementMetrics: Record<string, number>
  ): Promise<CurriculumResponse | null> => {
    if (!user) return null;

    // Validate form
    if (!validateForm(formData)) {
      return null;
    }

    setLoading(true);
    try {
      // Enhanced curriculum generation with CrewAI
      const response = await cheshireService.post('/plugins/MyCurriculumDesigner/design-curriculum', {
        ...formData,
        learning_style: learningStyle?.style,
        engagement_metrics: engagementMetrics,
        user_id: user.uid,
        adaptationConfidence: learningStyle?.confidence || 0.5
      });

      // Store interaction in episodic memory
      await cheshireService.post('/memory/collections/episodic/points', {
        content: `Curriculum generation for ${formData.subject}`,
        metadata: {
          userId: user.uid,
          type: 'curriculum_generation',
          learningStyle: learningStyle?.style,
          engagement: engagementMetrics,
          timestamp: new Date().toISOString()
        }
      });

      return response.data;
    } catch (error) {
      throw new Error('Failed to generate curriculum');
    } finally {
      setLoading(false);
    }
  }, [user, validateForm]);

  return {
    errors,
    loading,
    handleSubmit,
    validateForm
  };
}
```

## backend/Artifacts/cat-plugin-artifact/declarative-hook.ts

```
// File: src/hooks/useDeclarativeMemory.ts
import { useState, useCallback } from 'react';
import { declarativeMemory } from '@/services/declarativeMemory';

interface UseDeclarativeMemoryOptions {
  onError?: (error: Error) => void;
}

export function useDeclarativeMemory(options: UseDeclarativeMemoryOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleError = useCallback((error: Error) => {
    setError(error);
    if (options.onError) {
      options.onError(error);
    }
  }, [options]);

  const uploadMaterial = useCallback(async (
    file: File,
    metadata: DocumentMetadata
  ) => {
    setLoading(true);
    try {
      await declarativeMemory.storeCurriculumMaterial(file, metadata);
      setError(null);
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to upload material');
      handleError(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const searchMaterials = useCallback(async (
    query: string,
    filters: Partial<DocumentMetadata> = {}
  ) => {
    setLoading(true);
    try {
      const results = await declarativeMemory.searchCurriculumMaterials(query, filters);
      setError(null);
      return results;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to search materials');
      handleError(error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const getRelated = useCallback(async (
    materialId: string,
    limit?: number
  ) => {
    setLoading(true);
    try {
      const results = await declarativeMemory.getRelatedMaterials(materialId, limit);
      setError(null);
      return results;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get related materials');
      handleError(error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const updateMetadata = useCallback(async (
    materialId: string,
    updates: Partial<DocumentMetadata>
  ) => {
    setLoading(true);
    try {
      await declarativeMemory.updateMaterialMetadata(materialId, updates);
      setError(null);
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update metadata');
      handleError(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  return {
    uploadMaterial,
    searchMaterials,
    getRelated,
    updateMetadata,
    loading,
    error
  };
}
```

## backend/Artifacts/cat-plugin-artifact/plugin-manifest.json

```
{
    "name": "MyCurriculumDesigner",
    "version": "1.0.0",
    "description": "AI-powered curriculum generation plugin for homeschool education",
    "author": "Geaux Specialist LLC",
    "author_url": "https://geaux.app",
    "plugin_url": "https://github.com/geaux-specialist/curriculum-designer",
    "tags": "education, curriculum, homeschool, AI",
    "thumb": "",
    "dependencies": [
        "scikit-learn>=0.24.2",
        "pandas>=1.3.0"
    ],
    "settings_schema": {
        "max_resources_per_lesson": {
            "type": "integer",
            "description": "Maximum number of resources per lesson",
            "default": 5,
            "minimum": 1,
            "maximum": 10
        },
        "include_assessments": {
            "type": "boolean",
            "description": "Include assessment criteria in curriculum",
            "default": true
        },
        "default_duration": {
            "type": "string",
            "description": "Default lesson duration",
            "default": "45 minutes"
        },
        "enable_standards_mapping": {
            "type": "boolean",
            "description": "Enable mapping to educational standards",
            "default": true
        }
    }
}
```

## backend/Artifacts/cat-plugin-artifact/progression-service.ts

```
// File: src/services/competencyProgression.ts
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  query, 
  where, 
  getDocs,
  Timestamp,
  orderBy,
  limit 
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { cheshireService } from './cheshireService';

interface CompetencyLevel {
  subject: string;
  topic: string;
  level: number;  // 0-100
  timestamp: Date;
  assessmentCount: number;
  lastReview: Date;
  nextReview: Date;
}

interface PrerequisiteMap {
  [key: string]: string[];  // topic -> prerequisites
}

export class CompetencyProgressionService {
  private readonly MASTERY_THRESHOLD = 85;
  private readonly REVIEW_INTERVALS = [
    1,    // 1 day for initial review
    3,    // 3 days for second review
    7,    // 1 week
    14,   // 2 weeks
    30,   // 1 month
    90    // 3 months for mastered topics
  ];

  /**
   * Records a new competency assessment result
   */
  async recordAssessment(
    userId: string,
    subject: string,
    topic: string,
    score: number
  ): Promise<void> {
    try {
      // Get current competency level
      const currentLevel = await this.getCompetencyLevel(userId, subject, topic);
      
      // Calculate new level using weighted average
      const newLevel = currentLevel ? 
        (currentLevel.level * 0.7 + score * 0.3) : 
        score;

      const competency: CompetencyLevel = {
        subject,
        topic,
        level: newLevel,
        timestamp: new Date(),
        assessmentCount: (currentLevel?.assessmentCount || 0) + 1,
        lastReview: new Date(),
        nextReview: this.calculateNextReview(newLevel, currentLevel?.assessmentCount || 0)
      };

      // Store in Firebase
      await setDoc(
        doc(db, 'competency_levels', `${userId}_${subject}_${topic}`),
        competency
      );

      // Check for mastery and unlock prerequisites
      if (newLevel >= this.MASTERY_THRESHOLD) {
        await this.handleMasteryAchieved(userId, subject, topic);
      }

      // Schedule next review
      await this.scheduleReview(userId, subject, topic, competency.nextReview);
    } catch (error) {
      console.error('Failed to record assessment:', error);
      throw error;
    }
  }

  /**
   * Retrieves current competency level for a topic
   */
  private async getCompetencyLevel(
    userId: string,
    subject: string,
    topic: string
  ): Promise<CompetencyLevel | null> {
    const docRef = doc(db, 'competency_levels', `${userId}_${subject}_${topic}`);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as CompetencyLevel : null;
  }

  /**
   * Calculates next review date based on spaced repetition
   */
  private calculateNextReview(
    level: number,
    assessmentCount: number
  ): Date {
    const intervalIndex = Math.min(
      assessmentCount,
      this.REVIEW_INTERVALS.length - 1
    );
    
    // Higher competency = longer intervals
    const intervalMultiplier = level >= this.MASTERY_THRESHOLD ? 1.5 : 1;
    const daysToAdd = this.REVIEW_INTERVALS[intervalIndex] * intervalMultiplier;
    
    return new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000);
  }

  /**
   * Handles mastery achievement and unlocks prerequisites
   */
  private async handleMasteryAchieved(
    userId: string,
    subject: string,
    topic: string
  ): Promise<void> {
    // Get prerequisites map
    const prerequisitesRef = doc(db, 'prerequisites', subject);
    const prerequisitesSnap = await getDoc(prerequisitesRef);
    const prerequisites = prerequisitesSnap.data() as PrerequisiteMap;

    // Find topics that this mastery unlocks
    const unlockedTopics = Object.entries(prerequisites)
      .filter(([_, prereqs]) => prereqs.includes(topic))
      .map(([topic]) => topic);

    // Update unlocked topics in user's profile
    const userProgressRef = doc(db, 'user_progress', userId);
    await setDoc(userProgressRef, {
      unlockedTopics: unlockedTopics,
      updatedAt: Timestamp.now()
    }, { merge: true });

    // Store mastery achievement in Cheshire Cat memory
    await cheshireService.post('/memory/collections/achievements/points', {
      content: `Mastered ${topic} in ${subject}`,
      metadata: {
        userId,
        subject,
        topic,
        type: 'mastery',
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Schedules a review using White Rabbit
   */
  private async scheduleReview(
    userId: string,
    subject: string,
    topic: string,
    reviewDate: Date
  ): Promise<void> {
    await cheshireService.post('/white_rabbit/schedule', {
      timestamp: reviewDate.toISOString(),
      task: {
        type: 'review',
        data: {
          userId,
          subject,
          topic
        }
      }
    });
  }

  /**
   * Gets topics ready for review
   */
  async getReviewDueTopics(userId: string): Promise<CompetencyLevel[]> {
    const now = new Date();
    
    const competencyQuery = query(
      collection(db, 'competency_levels'),
      where('userId', '==', userId),
      where('nextReview', '<=', now),
      orderBy('nextReview'),
      limit(5)
    );

    const querySnapshot = await getDocs(competencyQuery);
    return querySnapshot.docs.map(doc => doc.data() as CompetencyLevel);
  }

  /**
   * Gets learning path recommendations
   */
  async getRecommendedPath(
    userId: string,
    subject: string
  ): Promise<string[]> {
    // Get current competency levels
    const competencyQuery = query(
      collection(db, 'competency_levels'),
      where('userId', '==', userId),
      where('subject', '==', subject)
    );

    const competencies = (await getDocs(competencyQuery))
      .docs.map(doc => doc.data() as CompetencyLevel);

    // Get prerequisites map
    const prerequisitesRef = doc(db, 'prerequisites', subject);
    const prerequisites = (await getDoc(prerequisitesRef))
      .data() as PrerequisiteMap;

    // Find available topics based on prerequisites
    const availableTopics = this.calculateAvailableTopics(
      competencies,
      prerequisites
    );

    return this.prioritizeTopics(availableTopics, competencies);
  }

  /**
   * Calculates which topics are available based on prerequisites
   */
  private calculateAvailableTopics(
    competencies: CompetencyLevel[],
    prerequisites: PrerequisiteMap
  ): string[] {
    const masteredTopics = new Set(
      competencies
        .filter(c => c.level >= this.MASTERY_THRESHOLD)
        .map(c => c.topic)
    );

    return Object.entries(prerequisites)
      .filter(([topic, prereqs]) => 
        !masteredTopics.has(topic) && // Not already mastered
        prereqs.every(p => masteredTopics.has(p)) // All prerequisites met
      )
      .map(([topic]) => topic);
  }

  /**
   * Prioritizes topics based on competency levels and dependencies
   */
  private prioritizeTopics(
    availableTopics: string[],
    competencies: CompetencyLevel[]
  ): string[] {
    return availableTopics.sort((a, b) => {
      const aLevel = competencies.find(c => c.topic === a)?.level || 0;
      const bLevel = competencies.find(c => c.topic === b)?.level || 0;
      return bLevel - aLevel; // Prioritize topics with higher current competency
    });
  }
}

export const competencyProgression = new CompetencyProgressionService();
```

