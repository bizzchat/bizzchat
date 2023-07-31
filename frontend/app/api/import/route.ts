import { NextResponse } from "next/server";
import { EmbedChain } from "./embeddings";

export async function POST(req: Request) {
  const embedchain = new EmbedChain();
  await embedchain.init_app;
  const record = (await req.json()).record;

  const result = await embedchain.add(record);

  return NextResponse.json({ text: result });
}
