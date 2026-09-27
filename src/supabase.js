import { createClient } from "@supabase/supabase-js";

const defaultSupabaseUrl = "https://ciqpijerujseknxdlwog.supabase.co";
const defaultSupabaseKey =
  "sb_publishable_Y4jB2Vtz-xH6F8mi0JoNXg_BPHFNCec";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || defaultSupabaseUrl;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || defaultSupabaseKey;

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn(
    "Using fallback Supabase values for the public GitHub Pages build. Add your own values in a local .env file for development."
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
