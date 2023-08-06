import { URLDataType } from "@/app/api/import/_lib/import-types";

export type AdminFormInput = {
  url: string;
  file_type: URLDataType;
  organization: string;
  datastore: string;
};
