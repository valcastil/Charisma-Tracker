import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Get credentials from environment variables
const supabaseUrl = 'https://gdgbuvgmzaqeajwxhldr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkZ2J1dmdtemFxZWFqd3hobGRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjAxNjQsImV4cCI6MjA3ODY5NjE2NH0.Cp2iEcqZe-2_ZvAQ5soG5kNtYlwWVHhwq_zjXvoY5w4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Initialize anonymous session
export const initializeSupabase = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      // Sign in anonymously for now
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) {
        console.error('Error signing in anonymously:', error);
      } else {
        console.log('Signed in anonymously:', data);
      }
    }
  } catch (error) {
    console.error('Error initializing Supabase:', error);
  }
};