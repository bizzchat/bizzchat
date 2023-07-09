import { Input } from "../_lib/Input";
import { LoaderResult } from "../_lib/LoaderResult";

export abstract class BaseLoader {
  abstract load_data(src: Input): Promise<LoaderResult>;
}
