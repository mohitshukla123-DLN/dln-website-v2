import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://wcbuhcjjcofvuxokduyh.supabase.co";

const supabaseAnonKey =
  "sb_publishable_IBJ3SCUCouI4g5NBXfis_A_MSoW_z6R";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);


