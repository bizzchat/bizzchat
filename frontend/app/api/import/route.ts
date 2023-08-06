import { serverSupabaseClient } from "@/core/supabase/supabase-server";
import { DataSource } from "@/types/database-types";
import { NextResponse } from "next/server";
import { EmbedChain } from "./embeddings";

export async function POST(req: Request) {
  const supabase = serverSupabaseClient();
  const embedchain = new EmbedChain();
  await embedchain.init_app;
  const datasource: DataSource = (await req.json()).record;

  const result = await embedchain.add(datasource);

  // update status of datasource indexed
  const { error: updateError } = await supabase
    .from("datasources")
    .update({ status: "ready" })
    .eq("id", datasource.id);

  if (updateError) {
    throw updateError;
  }

  return NextResponse.json({ text: result });
}
