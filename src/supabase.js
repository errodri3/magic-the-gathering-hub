import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://zvlejllytozndncpihqr.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2bGVqbGx5dG96bmRuY3BpaHFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMzgyMzMsImV4cCI6MjA5MjgxNDIzM30.il2wR2esO3GySPjYuU786XLx6OH2crO1A5tdO4G8I5M'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)