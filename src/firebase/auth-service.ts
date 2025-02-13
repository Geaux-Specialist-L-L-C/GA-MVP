import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  browserPopupRedirectResolver,
  Auth,
  AuthError
} from 'firebase/auth';
import { auth } from './config';

const POPUP_BLOCKED_ERROR = 'auth/popup-blocked';
const POPUP_CLOSED_ERROR = 'auth/popup-closed-by-user';

interface AuthResponse {
  success: boolean;
  error?: {
    code: string;
    message: string;
    retry?: boolean;
  };
}

export class AuthService {
  private provider: GoogleAuthProvider;
  private authPromise: Promise<Auth>;

  constructor() {
    this.provider = new GoogleAuthProvider();
    this.authPromise = auth;
  }

  async signInWithGoogle(): Promise<AuthResponse> {
    try {
      const auth = await this.authPromise;
      try {
        await signInWithPopup(auth, this.provider, browserPopupRedirectResolver);
        return { success: true };
      } catch (popupError) {
        const error = popupError as AuthError;
        
        if (error.code === POPUP_BLOCKED_ERROR) {
          await signInWithRedirect(auth, this.provider);
          return { success: true };
        }

        if (error.code === POPUP_CLOSED_ERROR) {
          return {
            success: false,
            error: {
              code: error.code,
              message: 'Sign-in window was closed. Would you like to try again?',
              retry: true
            }
          };
        }

        return {
          success: false,
          error: {
            code: error.code,
            message: error.message || 'Authentication failed. Please try again.',
            retry: true
          }
        };
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'auth/initialization-error',
          message: 'Failed to initialize authentication. Please refresh the page.',
          retry: false
        }
      };
    }
  }

  async signOut(): Promise<void> {
    const auth = await this.authPromise;
    await auth.signOut();
  }

  async getAuth(): Promise<Auth> {
    return this.authPromise;
  }
}