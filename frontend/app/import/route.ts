import { EmbedChain } from "./embeddings";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const embedchain = new EmbedChain();
  await embedchain.init_app;

  const result = await embedchain.add(
    "pdf_file",
    "https://www.bseindia.com/xml-data/corpfiling/AttachLive/411a4b81-6171-4960-881b-7e3627e8d24b.pdf"
  );

  return NextResponse.json({ text: result });
}
