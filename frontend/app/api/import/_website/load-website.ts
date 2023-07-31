import { LoaderResult } from "@/app/api/import/_lib/import-types";
import { getWebPage } from "../_utils/get-web-page";

class WebSiteLoader {
  async load_data(startUrl: string): Promise<LoaderResult> {
    // Create a set to track visited URLs
    const visitedUrls = new Set<string>();
    const pageLimit = 5;
    let urls = [startUrl];
    const output = [];

    while (urls.length > 0) {
      if (visitedUrls.size >= pageLimit) break;

      const url = urls.shift()!;
      if (visitedUrls.has(url)) continue;
      console.log("fetching url", url, visitedUrls, urls);
      visitedUrls.add(url);

      const page = await getWebPage(url);
      console.log("page fetch completed", page);
      const links = getLinks(page.linkElements, startUrl, visitedUrls);
      console.log("links", links);

      if (urls.length < pageLimit) urls = [...urls, ...links];

      output.push({
        content: page.content,
        meta_data: page.meta_data,
      });
    }

    return output;
  }
}

const getLinks = (
  linkElements: Element[],
  startUrl: string,
  visitedUrls: Set<string>
) => {
  const origin = new URL(startUrl).origin;
  const hostname = new URL(startUrl).hostname;

  return linkElements
    .map((e: any) => e.href)
    .filter((href) => href !== undefined && href !== "")
    .map((href: string | undefined) => {
      if (href === undefined) {
        return undefined;
      }

      try {
        return new URL(href, origin).href;
      } catch {
        return undefined;
      }
    })
    .filter(
      (href) =>
        href !== undefined &&
        href !== "" &&
        !visitedUrls.has(href) &&
        new URL(href!).hostname === hostname
    ) as string[];
};

export { WebSiteLoader };
