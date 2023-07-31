import axios from "axios";

import { clean_string } from "@/app/api/import/_lib/utils";
import { JSDOM } from "jsdom";

export const getWebPage = async (url: string) => {
  const response = await axios.get(url);
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
  const linkElements = Array.from(document.getElementsByTagName("a"));

  let content = document.body.textContent;
  if (!content) {
    throw new Error("Web page content is empty.");
  }

  content = clean_string(content);
  const meta_data = {
    url: url,
  };

  return { content, meta_data, linkElements };
};
