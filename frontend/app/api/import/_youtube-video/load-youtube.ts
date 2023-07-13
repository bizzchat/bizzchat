import { LoaderResult, Metadata } from "../_lib/import-types";
import { clean_string } from "../_lib/utils";

import { YoutubeTranscript } from "youtube-transcript";

class YouTubeLoader {
  async load_data(url: string): Promise<LoaderResult> {
    const rawDocuments = await YoutubeTranscript.fetchTranscript(url);

    let output = [];
    let content = rawDocuments.map((item) => item.text).join("");

    content = clean_string(content);
    const meta_data: Metadata = { url: url };
    output.push({
      content: content,
      meta_data: meta_data,
    });

    return output;
  }
}
export { YouTubeLoader };
