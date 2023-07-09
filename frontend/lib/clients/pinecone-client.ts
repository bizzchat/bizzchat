import { PineconeClient } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { BaseVectorDB } from "./BaseVectorDb";

const embedder = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPEN_API_KEY,
});
class PineconeDB extends BaseVectorDB {
  client: PineconeClient | undefined;
  collection: PineconeStore | null = null;

  async get_client_and_collection(): Promise<void> {
    this.client = new PineconeClient();
    await this.client.init({
      apiKey: "ec394e05-d39a-40a4-8eb7-f639e90d1d6b",
      environment: "asia-southeast1-gcp-free",
    });
    const index = this.client.Index("bizzchat");
    try {
      this.collection = await PineconeStore.fromExistingIndex(embedder, {
        pineconeIndex: index,
      });
    } catch (err) {
      console.log(err);
    }
  }
}

export { PineconeDB };
