import { BaseChunker } from "../_base/chunk";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

interface TextSplitterChunkParams {
  chunkSize: number;
  chunkOverlap: number;
  keepSeparator: boolean;
}

const TEXT_SPLITTER_CHUNK_PARAMS: TextSplitterChunkParams = {
  chunkSize: 1000,
  chunkOverlap: 50,
  keepSeparator: false,
};

class YouTubeChunker extends BaseChunker {
  constructor() {
    const text_splitter = new RecursiveCharacterTextSplitter(
      TEXT_SPLITTER_CHUNK_PARAMS
    );
    super(text_splitter);
  }
}

export { YouTubeChunker };
