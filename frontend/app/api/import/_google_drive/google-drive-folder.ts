import { GoogleDriveManager } from "@/lib/clients/google-drive-manager";
import {
  AcceptedDatasourceMimeTypes,
  LoaderResult,
  Metadata,
} from "../_lib/import-types";

export class GoogleDriveFolderLoader {
  isGroup = true;

  async load_data(foldeId: string): Promise<LoaderResult> {
    const driveManager = new GoogleDriveManager({
      accessToken:
        "ya29.a0AbVbY6M6-O9LrcPrNZiRtAaI3y-lNPa3RIufpEa8xJ46pJ0FId1GuK6bCOCZYoo71wDXADGhrrCbPPMYrBwm9Vm9iZoyvNv5HiaZTeBV0uqtviVJgSD-hsRUsHhQUoBWYZCAwDczHoTZ1lgiPnnf3end9y3G7kvpRAaCgYKAYMSARESFQFWKvPlnSz2oyWesKbPnDHEInsh2w0169",
      refreshToken:
        "1//04BibwCLiFLLFCgYIARAAGAQSNwF-L9IrmV8EVkUcDvOHZeEp75HswU5NKchfGXBHX6tQq61Lkvy0lhWj3iE0KtKQSMRFyU0Lj5g",
    });

    await driveManager.refreshAuth();

    console.log(foldeId);

    let files = await driveManager.listFilesRecursive({
      folderId: foldeId as string,
    });

    console.log(files);
    return [];
  }
}
