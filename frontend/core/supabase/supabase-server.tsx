import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { cache } from "react";

export const serverSupabaseClient = cache(() =>
  createServerComponentClient<Database>({ cookies })
);
