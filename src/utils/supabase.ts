import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pzyryihuzjablnicmcza.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6eXJ5aWh1emphYmxuaWNtY3phIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MjA4MTcsImV4cCI6MjA1ODk5NjgxN30.LaF7yVNw-u6lno1cc0tjEuS9pkOID1LD1PEMJjVJaQM'

export const supabase = createClient(supabaseUrl, supabaseKey)
