import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  throw new Error('Missing Supabase anon key. Please check your environment variables.');
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'supabase.auth.token',
    storage: {
      getItem: (key) => {
        if (isSecureContext) {
          return sessionStorage.getItem(key);
        }
        throw new Error('Secure context required for authentication storage');
      },
      setItem: (key, value) => {
        if (isSecureContext) {
          sessionStorage.setItem(key, value);
        } else {
          throw new Error('Secure context required for authentication storage');
        }
      },
      removeItem: (key) => {
        if (isSecureContext) {
          sessionStorage.removeItem(key);
        } else {
          throw new Error('Secure context required for authentication storage');
        }
      },
    }
  }
});
