import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lwdlhiatqptnjjgyrdda.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3ZGxoaWF0cXB0bmpqZ3lyZGRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NTA1MzQsImV4cCI6MjA3NDEyNjUzNH0.UiaeaUo6_BjWQy3h7MKUnBtIImFH0xfSYn88ZW4p1s0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);