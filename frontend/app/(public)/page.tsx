import { createServerSupabaseClient } from "@/core/supabase/supabase-server";
import { redirect } from "next/navigation";

export default async function Index() {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/chat");
  } else {
    redirect("/login");
  }
}
