// File: /src/supabaseClient.ts
// Description: Initializes the Supabase client with proper TypeScript types and error handling
// Author: [Your Name]
// Created: [Date]

import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yivklahcdksdpifmapoh.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || import.meta?.env?.VITE_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  throw new Error('Missing Supabase anon key. Please check your environment variables.');
}

if (!isSecureContext && !supabaseUrl.startsWith('https://')) {
  throw new Error('Supabase client must be initialized in a secure context or with HTTPS URL');
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