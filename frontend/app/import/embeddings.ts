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

import { FormattedResult } from "./_lib/FormattedResult";
import { Input, LocalInput, RemoteInput } from "./_lib/Input";
import { URLDataType } from "./_lib/import-types";

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
      youtube_video: new YouTubeLoader(),
      csv: new CSVFileLoader(),
    };
    return loaders[data_type];
  }

  _get_chunker(data_type: URLDataType) {
    const chunkers: { [t in URLDataType]: BaseChunker } = {
      pdf: new PdfFileChunker(),
      webpage: new WebPageChunker(),
      youtube_video: new YouTubeChunker(),
      csv: new CSVFileChunker(),
    };
    return chunkers[data_type];
  }

  async add(data_type: URLDataType, url: RemoteInput): Promise<any> {
    const loader = this._get_loader(data_type);
    const chunker = this._get_chunker(data_type);
    this.user_asks.push([data_type, url]);
    let result = await this.load_and_embed(loader, chunker, url);
    return result;
  }

  async add_local(data_type: URLDataType, content: LocalInput) {
    const loader = this._get_loader(data_type);
    const chunker = this._get_chunker(data_type);
    this.user_asks.push([data_type, content]);
    await this.load_and_embed(loader, chunker, content);
  }

  async load_and_embed(loader: any, chunker: BaseChunker, src: Input) {
    const embeddings_data = await chunker.create_chunks(loader, src);

    let { content, ids, metadatas } = embeddings_data;

    let docs = [];

    for (let i = 0; i < ids.length; i++) {
      docs.push({
        pageContent: content[i],
        metadata: { url: metadatas[i].url },
      });
    }

    const documents = docs.map(
      (doc) =>
        new Document({
          metadata: { source: doc.metadata.url },
          pageContent: doc.pageContent,
        })
    );
    console.log(ids);

    this.collection.namespace = "mohit";
    await this.collection.addDocuments(documents, ids);
    console.log(`Successfully saved ${src}. Total chunks count: ${ids.length}`);

    return documents;
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
    console.log("messages", messages);
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-0613",
      messages: messages,
      temperature: 0,
      max_tokens: 1000,
      top_p: 1,
    });

    console.log("response", response);

    return (
      response.data.choices[0].message?.content ??
      "Response could not be processed."
    );
  }

  async retrieve_from_database(input_query: string) {
    this.collection.namespace = "mohit";
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
