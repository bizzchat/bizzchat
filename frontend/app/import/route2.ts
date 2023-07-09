import { EmbedChain } from "./embeddings";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const embedchain = new EmbedChain();
  await embedchain.init_app;
  const result = await embedchain.query("tell me about Coach Slava Grigoriev");

  return NextResponse.json({ Answer: result });
}
