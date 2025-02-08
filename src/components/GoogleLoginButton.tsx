import React from 'react';
import { FcGoogle } from 'react-icons/fc';

interface GoogleLoginButtonProps {
  handleGoogleLogin: () => Promise<void>;
  error?: string;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ handleGoogleLogin, error }) => {
  return (
    <>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-6 py-3 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <FcGoogle className="text-xl" />
        Sign in with Google
      </button>
    </>
  );
};

export default GoogleLoginButton;
