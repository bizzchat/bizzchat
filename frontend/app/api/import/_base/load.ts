import { LoaderResult } from "../_lib/import-types";

export abstract class BaseLoader {
  abstract load_data(
    src: string,
    datasource_id?: string
  ): Promise<LoaderResult>;
}
