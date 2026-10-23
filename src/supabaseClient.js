import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://afvrvpuyvjsgzsrrnuza.supabase.co'
const supabaseAnonKey = 'sb_publishable_vtMVCWqoC6QyBSCuX5PvMw_LNPXKMjz'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
