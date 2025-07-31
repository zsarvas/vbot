import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zywthnmeikffxbzusxkb.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5d3Robm1laWtmZnhienVzeGtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjI2NzIxODYsImV4cCI6MTk3ODI0ODE4Nn0.g8Nam0FhgnGb2-NFH3eGLc-GvUBuXBfE2RwtutKh6Zo';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 