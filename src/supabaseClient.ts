// File: /src/supabaseClient.ts
// Description: Initializes the Supabase client
// Author: [Your Name]
// Created: [Date]

import { createClient } from '@supabase/supabase-js';

// Changed environment variable names to use VITE_ prefix
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);