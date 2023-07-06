import { PineconeClient } from "@pinecone-database/pinecone";
// import "dotenv/config.js";
// import fg from "fast-glob";

import { NextResponse } from "next/server";
import { Document } from "langchain/document";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import * as crypto from "crypto";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";

export async function GET(req: Request) {
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPEN_API_KEY,
  });

  const file =
    "/Users/mohitagarwal/Projects/bizzchat/frontend/app/import/_pdf/_files/examplePdf.pdf";
  const loader = new PDFLoader(file, { splitPages: false });

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 0,
  });

  const rawDocuments = await loader.load();

  const output = await splitter.splitDocuments(rawDocuments);

  const documents = output.map(
    (doc) =>
      new Document({
        metadata: { source: doc.metadata.source },
        pageContent: doc.pageContent,
      })
  );

  const ids = documents.map((item) =>
    crypto
      .createHash("sha256")
      .update(item.pageContent + item.metadata.source)
      .digest("hex")
  );

  const pinecone = new PineconeClient();

  await pinecone.init({
    apiKey: "ec394e05-d39a-40a4-8eb7-f639e90d1d6b",
    environment: "asia-southeast1-gcp-free",
  });

  const index = pinecone.Index("bizzchat");
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: index,
  });

  vectorStore.namespace = "mohit";

  console.log("ids", ids);
  const result = await vectorStore.addDocuments(documents, ids);
  console.log("result", result);
  return NextResponse.json({ text: documents });
}
