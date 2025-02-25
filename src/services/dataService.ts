// File: /src/services/dataService.ts
// Description: Data service using Supabase
// Author: [Your Name]
// Created: [Date]

import { supabase } from '@/supabaseClient';

export const fetchData = async () => {
  const { data, error } = await supabase.from('your_table').select('*');
  if (error) throw error;
  return data;
};