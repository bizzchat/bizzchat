type Question = string;
type Answer = string;

export type Metadata = {
  url: string;
};

export enum URLDataType {
  pdf = "pdf",
  youtube_video = "youtube_video",
  webpage = "webpage",
  csv = "csv",
}

export type ChunkResult = {
  content: string[];
  ids: string[];
  metadatas: Metadata[];
};

export type RemoteInput = string;

export type LocalInput = QnaPair;

export type Input = RemoteInput | LocalInput;

export type QnaPair = [Question, Answer];

export type LoaderResult = { content: any; meta_data: Metadata }[];

export type FormattedResult = string;
