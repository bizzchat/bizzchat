import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { randomUUID } from "crypto";
import { cookies } from "next/dist/client/components/headers";

export default async function AddDataSource(url: string, data_type: string) {
  const supabase = createServerComponentClient({ cookies });

  const { error } = await supabase.from("datasources").insert({
    type: data_type,
    status: "queued",

    meta: { url: url, characters: 100 },
  });

  return error;
}
