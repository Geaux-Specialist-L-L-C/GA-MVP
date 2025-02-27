import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yivklahcdksdpifmapoh.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseSSL = import.meta.env.VITE_SUPABASE_SSL === 'true';

if (!supabaseKey) {
  throw new Error('Missing Supabase anon key. Please check your environment variables.');
}

if (!isSecureContext && !supabaseUrl.startsWith('https://')) {
  throw new Error('Supabase client must be initialized in a secure context or with HTTPS URL');
}

const options = {
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
};

if (supabaseSSL) {
  options.ssl = { rejectUnauthorized: true };
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey, options);
