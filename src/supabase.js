import { createClient } from '@supabase/supabase-js'

// Reemplaza esto con tus datos reales de Supabase (Settings > API)
const supabaseUrl = 'https://iwrlvdcblvzwoaqtyild.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3cmx2ZGNibHZ6d29hcXR5aWxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNzAzMzAsImV4cCI6MjA4ODg0NjMzMH0.Q8yAQqld3d4vIpIp8BrQZSDqGfABKicUqhgeWg740Bk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)