import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rallpixftuphykuhowds.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhbGxwaXhmdHVwaHlrdWhvd2RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0ODM0OTMsImV4cCI6MjA2MDA1OTQ5M30._o48hNCSHFeIWkrKE_14wvKfpb2lzlsd8OWy7GgXAF0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 