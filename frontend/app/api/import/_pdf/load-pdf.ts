import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { LoaderResult, Metadata } from "../_lib/import-types";
import { clean_string } from "../_lib/utils";

class PdfFileLoader {
  async load_data(url: string): Promise<LoaderResult> {
    const pdf_data = await (await fetch(url)).blob();

    const loader = new PDFLoader(pdf_data, { splitPages: false });

    const docs = await loader.load();

    var content = docs.map((item) => item.pageContent).join("");
    let output = [];
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
