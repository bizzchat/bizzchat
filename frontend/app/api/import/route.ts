import { NextResponse } from "next/server";
import { EmbedChain } from "./embeddings";

export async function POST(req: Request) {
  const embedchain = new EmbedChain();
  await embedchain.init_app;
  const req_params = await req.json();

  // const result = await embedchain.checkPineconeIds(
  //   req_params.record.organization,
  //   req_params.record.datastore_id
  // );

  const result = await embedchain.add(
    req_params.record.type,
    req_params.record.meta.url,
    req_params.record.organization,
    req_params.record.datastore_id
  );

  return NextResponse.json({ text: result });
}
