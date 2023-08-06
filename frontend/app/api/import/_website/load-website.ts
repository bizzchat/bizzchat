import { LoaderResult } from "@/app/api/import/_lib/import-types";
import { serverSupabaseClient } from "@/core/supabase/supabase-server";
import { getWebPage } from "../_utils/get-web-page";

const PAGELIMIT = Number(process.env.PAGELIMIT) ?? 5;

class WebSiteLoader {
  async load_data(
    startUrl: string,
    datasource_id: string
  ): Promise<LoaderResult> {
    const supabase = serverSupabaseClient();
    // Create a set to track visited URLs
    const visitedUrls = new Set<string>();
    let urls = [startUrl];
    const output = [];

    while (urls.length > 0 && visitedUrls.size < PAGELIMIT) {
      const url = urls.shift()!;
      if (visitedUrls.has(url)) continue;

      console.log("fetching url: ", url);
      visitedUrls.add(url);
      const page = await getWebPage(url);
      const links = getLinks(page.linkElements, startUrl, visitedUrls);

      urls = [...urls, ...links];
      urls = [...new Set(urls)];

      output.push({
        content: page.content,
        meta_data: page.meta_data,
      });
    }

    // update datasource with meta
    const { error: updateError } = await supabase
      .from("datasources")
      .update({
        meta: { url: startUrl, characters: 0, pages: [...visitedUrls] },
      })
      .eq("id", datasource_id);

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
