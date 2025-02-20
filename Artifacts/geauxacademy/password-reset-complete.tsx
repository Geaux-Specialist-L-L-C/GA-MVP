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
