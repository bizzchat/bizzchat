import { GoogleDriveManager } from "@/lib/clients/google-drive-manager";
import {
  AcceptedDatasourceMimeTypes,
  LoaderResult,
  Metadata,
} from "../_lib/import-types";

import { fileBufferToDocs } from "../_lib/utils";

import { GaxiosResponse } from "gaxios";
import { Readable } from "stream";

export class GoogleDriveFolderLoader {
  isGroup = true;

  async load_data(folderUrl: string): Promise<LoaderResult> {
    const driveManager = new GoogleDriveManager({
      accessToken:
        "ya29.a0AbVbY6M6-O9LrcPrNZiRtAaI3y-lNPa3RIufpEa8xJ46pJ0FId1GuK6bCOCZYoo71wDXADGhrrCbPPMYrBwm9Vm9iZoyvNv5HiaZTeBV0uqtviVJgSD-hsRUsHhQUoBWYZCAwDczHoTZ1lgiPnnf3end9y3G7kvpRAaCgYKAYMSARESFQFWKvPlnSz2oyWesKbPnDHEInsh2w0169",
      refreshToken:
        "1//04BibwCLiFLLFCgYIARAAGAQSNwF-L9IrmV8EVkUcDvOHZeEp75HswU5NKchfGXBHX6tQq61Lkvy0lhWj3iE0KtKQSMRFyU0Lj5g",
    });

    await driveManager.refreshAuth();

    const files = await driveManager.listFilesRecursive({
      folderId: folderUrl.replace(
        "https://drive.google.com/drive/u/0/folders/",
        ""
      ) as string,
    });

    let output = [];
    for (let i = 0; i < files.length; i++) {
      const fileId = files[i].id as string;

      let content = "";
      let result: GaxiosResponse<Readable>;
      if (files[i].mimeType == "application/vnd.google-apps.spreadsheet") {
        result = await driveManager.drive.files.export(
          {
            fileId: fileId,
            mimeType:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
          { responseType: "stream" }
        );
      } else if (files[i].mimeType == "application/vnd.google-apps.document") {
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

      const fileContents = (await p) as ArrayBuffer;

      // Get google drive url for file
      const {
        data: { webViewLink },
      } = await driveManager.drive.files.get({
        fileId: fileId,
        fields: "webViewLink",
      });
      const meta_data: Metadata = { url: webViewLink as string };
      const mimeType = result?.headers?.["content-type"];

      if (AcceptedDatasourceMimeTypes.includes(mimeType!)) {
        content = await fileBufferToDocs({
          buffer: fileContents,
          mimeType,
        });
      }

      output.push({
        content: content,
        meta_data: meta_data,
      });
    }

    return output;
  }
}
