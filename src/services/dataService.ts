import { supabase } from '@/supabaseClient';

export const fetchData = async () => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw error;
  return data;
};

export const insertData = async (table: string, data: object) => {
  const { error } = await supabase.from(table).insert(data);
  if (error) throw error;
};

export const updateData = async (table: string, id: number, data: object) => {
  const { error } = await supabase.from(table).update(data).eq('id', id);
  if (error) throw error;
};

export const deleteData = async (table: string, id: number) => {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
};
