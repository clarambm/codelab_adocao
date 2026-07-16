// js/supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://nuzkhwgmyoojnwqysmmo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51emtod2dteW9vam53cXlzbW1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5NTA2OTksImV4cCI6MjA5OTUyNjY5OX0.pakHFKKKJUNT7eWr2d35HakLD3HJWLvhlhh3WiqbmmM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);