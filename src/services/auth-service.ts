import { signInWithPopup, GoogleAuthProvider, getAuth } from 'firebase/auth';

const auth = getAuth();

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw new Error('Failed to sign in with Google');
  }
};
