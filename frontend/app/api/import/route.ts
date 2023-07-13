import { NextResponse } from "next/server";
import { EmbedChain } from "./embeddings";

export async function POST(req: Request) {
  const embedchain = new EmbedChain();
  await embedchain.init_app;
  const req_params = await req.json();
  console.log(req_params.file_type);

  const result = await embedchain.add(req_params.file_type, req_params.url);

  return NextResponse.json({ text: result });
}
