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
      accessToken: process.env.GOOLGE_ACCESS_TOKEN,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    });

    await driveManager.refreshAuth();

    // Split the URL string by the delimiter "/"
    const parts = folderUrl.split("/");

    // Find the index of "d/" in the array
    const index = parts.findIndex((part) => part === "folders");

    // Get the text after "d/"
    const fileId = parts[index + 1];

    const files = await driveManager.listFilesRecursive({
      folderId: fileId as string,
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
