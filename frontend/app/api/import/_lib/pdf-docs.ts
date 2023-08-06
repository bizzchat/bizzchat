import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { LoaderResult, Metadata } from "../_lib/import-types";
import { clean_string } from "../_lib/utils";

const pdfToDocs = async (buffer: ArrayBuffer) => {
  const blob = new Blob([buffer], { type: "application/pdf" });

  const loader = new PDFLoader(blob, { splitPages: false });

  const docs = await loader.load();

  var content = docs.map((item) => item.pageContent).join("");

  content = clean_string(content);

  return content;
};

export { pdfToDocs };
