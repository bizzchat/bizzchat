import { URLDataType } from "@/app/api/import/_lib/import-types";
import { Database } from "./supabase";

export type DataSource = Database["public"]["Tables"]["datasources"]["Row"] & {
  meta: DataSourceMeta;
  type: URLDataType;
};

export type DataSourceMeta = {
  url: string;
};
