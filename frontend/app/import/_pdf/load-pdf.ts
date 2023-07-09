import * as pdfjsLib from "pdfjs-dist";

import { clean_string } from "../../utils";
import { LoaderResult } from "../_lib/LoaderResult";
import { Metadata } from "../_lib/Metadata";
import { TextContent } from "pdfjs-dist/types/src/display/api";

import { Document } from "langchain/document";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

class PdfFileLoader {
  async load_data(url: string): Promise<LoaderResult> {
    const file =
      "/Users/mohitagarwal/Projects/bizzchat/frontend/app/import/_pdf/_files/examplePdf.pdf";
    const loader = new PDFLoader(file, { splitPages: false });
    const rawDocuments = await loader.load();

    let output = [];
    let content: string = rawDocuments[0].pageContent;
    content = clean_string(content);
    const meta_data: Metadata = { url: url };
    output.push({
      content: content,
      meta_data: meta_data,
    });

    return output;
  }
}
export { PdfFileLoader };
