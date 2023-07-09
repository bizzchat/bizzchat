import { Metadata } from "./Metadata";

export type ChunkResult = {
  content: string[];
  ids: string[];
  metadatas: Metadata[];
};
