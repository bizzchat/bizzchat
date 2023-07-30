import axios from "axios";

import { clean_string } from "@/app/api/import/_lib/utils";
import { JSDOM } from "jsdom";

class WebPageLoader {
  async load_data(url: string) {
    const response = await axios(addSlashUrl(url), {
      headers: {
        "User-Agent": Date.now().toString(),
      },
    });
    const html = response.data;
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const unwantedTags = [
      "nav",
      "aside",
      "form",
      "header",
      "noscript",
      "svg",
      "canvas",
      "footer",
      "script",
      "style",
    ];
    unwantedTags.forEach((tagName) => {
      const elements = document.getElementsByTagName(tagName);
      for (const element of Array.from(elements)) {
        (element as HTMLElement).textContent = " ";
      }
    });

    const output = [];
    let content = document.body.textContent;
    if (!content) {
      throw new Error("Web page content is empty.");
    }

    content = clean_string(content);
    const meta_data = {
      url: url,
    };
    output.push({
      content: content,
      meta_data: meta_data,
    });

    return output;
  }
}

const addSlashUrl = (url: string) => {
  const urlObj = new URL(url);

  // Check if the pathname already ends with a slash
  if (!urlObj.pathname.endsWith("/")) {
    // If not, add a trailing slash to the pathname
    urlObj.pathname += "/";
  }

  return urlObj.toString();
};

export { WebPageLoader };
