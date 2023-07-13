import { Input, LoaderResult } from "../_lib/import-types";

export abstract class BaseLoader {
  abstract load_data(src: Input): Promise<LoaderResult>;
}
