import { NextResponse } from "next/server";
import { EmbedChain } from "./embeddings";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";

import { cookies } from "next/headers";

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const embedchain = new EmbedChain();
  await embedchain.init_app;
  const record = (await req.json()).record;

  const result = await embedchain.add(record);

  // update status of datasource indexed
  const { error: updateError, data } = await supabase
    .from("datasources")
    .update({ status: "ready" })
    .eq("id", record.id);

  if (updateError) {
    throw updateError;
  }

  return NextResponse.json({ text: result });
}
