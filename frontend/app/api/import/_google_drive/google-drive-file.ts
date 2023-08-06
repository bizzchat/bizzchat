import {
  AcceptedDatasourceMimeTypes,
  LoaderResult,
  Metadata,
} from "../_lib/import-types";

import { GoogleDriveManager } from "@/lib/clients/google-drive-manager";
import { fileBufferToDocs } from "../_lib/utils";
import { GaxiosResponse } from "gaxios";
import { Readable } from "stream";

export class GoogleDriveFileLoader {
  async load_data(fileUrl: string): Promise<LoaderResult> {
    const driveManager = new GoogleDriveManager({
      accessToken:
        "ya29.a0AbVbY6M6-O9LrcPrNZiRtAaI3y-lNPa3RIufpEa8xJ46pJ0FId1GuK6bCOCZYoo71wDXADGhrrCbPPMYrBwm9Vm9iZoyvNv5HiaZTeBV0uqtviVJgSD-hsRUsHhQUoBWYZCAwDczHoTZ1lgiPnnf3end9y3G7kvpRAaCgYKAYMSARESFQFWKvPlnSz2oyWesKbPnDHEInsh2w0169",
      refreshToken:
        "1//04BibwCLiFLLFCgYIARAAGAQSNwF-L9IrmV8EVkUcDvOHZeEp75HswU5NKchfGXBHX6tQq61Lkvy0lhWj3iE0KtKQSMRFyU0Lj5g",
    });

    await driveManager.refreshAuth();

    // Split the URL string by the delimiter "/"
    const parts = fileUrl.split("/");

    // Find the index of "d/" in the array
    const index = parts.findIndex((part) => part === "d");

    // Get the text after "d/"
    const fileId = parts[index + 1];

    let content = "";

    // Get google drive url for file
    const { data } = await driveManager.drive.files.get({
      fileId: fileId,
      fields: "webViewLink,mimeType",
    });

    const meta_data: Metadata = { url: data.webViewLink as string };

    let result: GaxiosResponse<Readable>;

    if (data.mimeType == "application/vnd.google-apps.spreadsheet") {
      result = await driveManager.drive.files.export(
        {
          fileId: fileId,
          mimeType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
        { responseType: "stream" }
      );
    } else if (data.mimeType == "application/vnd.google-apps.document") {
      result = await driveManager.drive.files.export(
        {
          fileId: fileId,
          mimeType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        },
        { responseType: "stream" }
      );
    } else {
      result = await driveManager.drive.files.get(
        {
          fileId: fileId,
          alt: "media",
        },
        { responseType: "stream" }
      );
    }

    const p = new Promise(async (resolve, reject) => {
      try {
        let data = [] as any;
        result.data.on("data", (chunk) => data.push(chunk));
        result.data.on("end", () => {
          let fileData = Buffer.concat(data);
          // Do something with fileData

          resolve(fileData);
        });
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });

    const fileContents = await p;
    const mimeType = result?.headers?.["content-type"];

    if (AcceptedDatasourceMimeTypes.includes(mimeType!)) {
      content = await fileBufferToDocs({
        buffer: fileContents,
        mimeType,
      });
    }

    let output = [];
    output.push({
      content: content,
      meta_data: meta_data,
    });

    console.log(output);
    return output;
  }
}
