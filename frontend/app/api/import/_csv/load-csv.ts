import { clean_string } from "../_lib/utils";

import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { LoaderResult, Metadata } from "../_lib/import-types";

class CSVFileLoader {
  async load_data(url: string): Promise<LoaderResult> {
    const csv_data = await (await fetch(url)).blob();

    const loader = new CSVLoader(csv_data);

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
export { CSVFileLoader };
