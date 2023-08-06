import { serverSupabaseClient } from "@/core/supabase/supabase-server";
import { redirect } from "next/navigation";

export default async function Index() {
  const supabase = serverSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/chat");
  } else {
    redirect("/login");
  }
}
