type Question = string;
type Answer = string;
import { Document as LangchainDocument } from "langchain/document";
import { z } from "zod";

export type Metadata = {
  url: string;
};

export enum URLDataType {
  pdf = "pdf",
  youtube_video = "youtube_video",
  webpage = "webpage",
  csv = "csv",
  website = "website",
  drive_file = "drive_file",
  drive_folder = "drive_folder",
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

export const AcceptedDatasourceMimeTypes = [
  "text/csv",
  "text/plain",
  "text/markdown",
  "application/pdf",
  "application/json",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.google-apps.spreadsheet",
  "application/vnd.google-apps.document",
] as const;
