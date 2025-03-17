import { supabase } from './supabase';
import { User, Course, UserProgress } from '@/types';

/**
 * Authentication helpers
 */
export const authHelpers = {
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  },
  
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },
  
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },
  
  getCurrentUser: async () => {
    const { data } = await supabase.auth.getUser();
    return data?.user;
  }
};

/**
 * Course data helpers
 */
export const courseHelpers = {
  getCourses: async (): Promise<Course[]> => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Course[];
  },
  
  getCourseById: async (courseId: string): Promise<Course | null> => {
    const { data, error } = await supabase
      .from('courses')
      .select('*, lessons(*)')
      .eq('id', courseId)
      .single();
    
    if (error) throw error;
    return data as Course;
  },
  
  getUserProgress: async (userId: string): Promise<UserProgress[]> => {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data as UserProgress[];
  },
  
  updateUserProgress: async (userId: string, lessonId: string, isCompleted: boolean) => {
    const { data, error } = await supabase
      .from('user_progress')
      .upsert({ 
        user_id: userId,
        lesson_id: lessonId,
        is_completed: isCompleted,
        last_updated: new Date().toISOString()
      });
    
    return { data, error };
  }
};
