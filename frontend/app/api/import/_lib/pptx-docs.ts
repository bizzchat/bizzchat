import { DOMParser } from "@xmldom/xmldom";
import { clean_string } from "./utils";

const pptxToDocs = async (buffer: ArrayBuffer) => {
  const JSZip = (await import("jszip")).default;

  const zip = await JSZip.loadAsync(buffer);
  const slidePromises = [] as any[];

  zip?.folder?.("ppt/slides")?.forEach((relativePath, file) => {
    slidePromises.push(file.async("text"));
  });

  const slideContents = await Promise.all(slidePromises);

  const all = [] as string[];

  slideContents.forEach((slideContent) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(slideContent, "application/xml");
    const texts = xmlDoc.getElementsByTagName("a:t");

    Array.from(texts).forEach((el: any) => {
      if (el?.textContent) {
        all.push(el.textContent);
      }
    });
  });

  const content = clean_string(all.join("\n\n"));
  return content;
};

export default pptxToDocs;
