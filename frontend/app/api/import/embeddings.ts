import { Document } from "langchain/document";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

import { BaseLoader } from "./_base/load";
import { CSVFileLoader } from "./_csv/load-csv";
import { PdfFileLoader } from "./_pdf/load-pdf";
import { WebPageLoader } from "./_webpage/load-webpage";
import { YouTubeLoader } from "./_youtube-video/load-youtube";

import { BaseChunker } from "./_base/chunk";
import { CSVFileChunker } from "./_csv/chunk-csv";
import { PdfFileChunker } from "./_pdf/chunk-pdf";
import { WebPageChunker } from "./_webpage/chunk-webpage";
import { YouTubeChunker } from "./_youtube-video/chunk-youtube";

import { BaseVectorDB } from "@/lib/clients/BaseVectorDb";
import { PineconeDB } from "@/lib/clients/pinecone-client";
import { PineconeStore } from "langchain/vectorstores/pinecone";

import { DataSource } from "@/types/database-types";
import { FormattedResult, Input, URLDataType } from "./_lib/import-types";
import { WebSiteChunker } from "./_website/chunk-website";
import { WebSiteLoader } from "./_website/load-website";
import { GoogleDriveFileChunker } from "./_google_drive/chunk-drive-file";
import { GoogleDriveFileLoader } from "./_google_drive/google-drive-file";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

class EmbedChain {
  db_client: any;
  // TODO: Definitely assign
  collection!: PineconeStore;
  user_asks: [URLDataType, Input][] = [];
  init_app: Promise<void>;

  constructor(db: BaseVectorDB | null = null) {
    if (!db) {
      this.init_app = this.setup_pinecone();
    } else {
      this.init_app = this.setup_other(db);
    }
  }

  async setup_pinecone(): Promise<void> {
    const db = new PineconeDB();
    await db.init_db;
    this.db_client = db.client;
    if (db.collection) {
      this.collection = db.collection;
    } else {
      // TODO: Add proper error handling
      console.error("No collection");
      return;
    }
  }

  async setup_other(db: BaseVectorDB): Promise<void> {
    await db.init_db;
    // TODO: Figure out how we can initialize an unknown database.
    // this.db_client = db.client;
    // this.collection = db.collection;
    this.user_asks = [];
  }

  _get_loader(data_type: URLDataType) {
    const loaders: { [t in URLDataType]: BaseLoader } = {
      pdf: new PdfFileLoader(),
      webpage: new WebPageLoader(),
      website: new WebSiteLoader(),
      youtube_video: new YouTubeLoader(),
      csv: new CSVFileLoader(),
      drive_file: new GoogleDriveFileLoader(),
    };
    return loaders[data_type];
  }

  _get_chunker(data_type: URLDataType) {
    const chunkers: { [t in URLDataType]: BaseChunker } = {
      pdf: new PdfFileChunker(),
      webpage: new WebPageChunker(),
      website: new WebSiteChunker(),
      youtube_video: new YouTubeChunker(),
      csv: new CSVFileChunker(),
      drive_file: new GoogleDriveFileChunker(),
    };
    return chunkers[data_type];
  }

  async add({
    type,
    meta,
    organization,
    datastore_id,
  }: DataSource): Promise<any> {
    const loader = this._get_loader(type);
    const chunker = this._get_chunker(type);
    this.user_asks.push([type, meta.url]);
    let result = await this.load_and_embed(
      loader,
      chunker,
      meta.url,
      organization,
      datastore_id
    );
    console.log(result);
    return result;
  }

  async load_and_embed(
    loader: any,
    chunker: BaseChunker,
    src: Input,
    organization: String,
    datastore: string
  ) {
    const embeddings_data = await chunker.create_chunks(loader, src);

    let { content, ids, metadatas } = embeddings_data;

    let docs = [];

    let existingIds = await this.checkExistngPineconeIds(
      organization,
      datastore,
      ids
    );

    const newIds = ids.filter(function (item) {
      return !existingIds.includes(item);
    });

    if (newIds.length >= 1) {
      for (let i = 0; i < newIds.length; i++) {
        let index = ids.indexOf(newIds[i]);

        docs.push({
          pageContent: content[index],
          metadata: { url: metadatas[index].url },
          id: ids[index],
        });
      }

      const documents = docs.map(
        (doc) =>
          new Document({
            metadata: { source: doc.metadata.url },
            pageContent: doc.pageContent,
          })
      );

      this.collection.namespace = organization + ":" + datastore;
      await this.collection.addDocuments(documents, ids);
      console.log(
        `Successfully saved ${src}. Total New Chunks Saved: ${newIds.length}`
      );

      return `Successfully saved ${src}. Total New Chunks Saved: ${newIds.length}`;
    } else {
      console.log(`Successfully saved ${src}. No New Chunks to Save`);
      return `Successfully saved ${src}. No New Chunks to Save`;
    }
  }

  async checkExistngPineconeIds(
    organization: String,
    datastore: string,
    ids: string[]
  ) {
    this.collection.namespace = organization + ":" + datastore;
    const index = this.db_client.Index("bizzchat");
    const fetchResult = await index.fetch({
      ids: ids,
      namespace: organization + ":" + datastore,
    });

    return Object.keys(fetchResult.vectors);
  }

  async _format_result(results: any): Promise<FormattedResult> {
    const content = results
      .map((item: { pageContent: any }) => item.pageContent)
      .join("");
    return content;
  }

  async get_openai_answer(prompt: string) {
    const messages: ChatCompletionRequestMessage[] = [
      { role: "user", content: prompt },
    ];
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-0613",
      messages: messages,
      temperature: 0,
      max_tokens: 1000,
      top_p: 1,
    });

    return (
      response.data.choices[0].message?.content ??
      "Response could not be processed."
    );
  }

  async retrieve_from_database(input_query: string) {
    this.collection.namespace = "test:5f0b4d20-e0f0-4488-9cf3-6b91ad6a2ee4";
    const results = await this.collection.similaritySearch(input_query, 2);

    const result_formatted = await this._format_result(results);

    return result_formatted;
  }

  generate_prompt(input_query: string, context: any) {
    return `Use the following pieces of context to answer the query at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.\n${context}\nQuery: ${input_query}\nHelpful Answer:`;
  }

  async query(input_query: string) {
    const context = await this.retrieve_from_database(input_query);
    const prompt = this.generate_prompt(input_query, context);
    // const answer = await this.get_openai_answer(prompt);
    return prompt;
  }
}

export { EmbedChain };
