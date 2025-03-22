import { createClient } from "@supabase/supabase-js";

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "something";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "something";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
