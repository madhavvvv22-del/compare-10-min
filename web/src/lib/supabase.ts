import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ighiuogqhykhzqzlnqsn.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_VIwjAZA3yIpBknPmdMofgw_6OgWhxdo";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
