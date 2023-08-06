import wordToDocs from "./word-docs";
import excelToDocs from "./excel-docs";
import pptxToDocs from "./pptx-docs";
import { pdfToDocs } from "./pdf-docs";

export function clean_string(text: string): string {
  text = text.replace(/\n/g, " ");

  // Stripping and reducing multiple spaces to single:
  let cleaned_text: string = text.trim().replace(/\s+/g, " ");

  // Removing backslashes:
  cleaned_text = cleaned_text.replace(/\\/g, "");

  // Replacing hash characters:
  cleaned_text = cleaned_text.replace(/#/g, " ");
  cleaned_text = cleaned_text.replace(/([^\w\s])\1*/g, "$1");

  return cleaned_text;
}

export const fileBufferToDocs = async (props: {
  buffer: any;
  mimeType: string;
}) => {
  let docs: string = "";

  switch (props.mimeType) {
    case "text/csv":
    case "text/plain":
    case "application/json":
    case "text/markdown":
      docs = new TextDecoder("utf-8").decode(props.buffer);
      break;
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      docs = await pptxToDocs(props.buffer);
      break;
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      docs = await wordToDocs(props.buffer);
      break;
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      docs = await excelToDocs(props.buffer);
      break;
    case "application/pdf":
      docs = await pdfToDocs(props.buffer);
      break;
    default:
      break;
  }

  return docs;
};
