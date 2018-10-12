import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {normalizeURL} from 'ionic-angular';
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from "@ionic-native/file-transfer";
import { File } from "@ionic-native/file";
import { Storage } from "@ionic/storage";

/*
  Generated class for the FileCacheProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FileCacheProvider {
  fileTransfer: FileTransferObject = this.transfer.create();

  constructor(
    private transfer: FileTransfer,
    private file: File,
    private storage: Storage
  ) {
  }

  saveFile(url, practiceName, fileName) {
    return this.fileTransfer
      .download(url,`${this.file.dataDirectory}filecache/${practiceName}/${fileName}`)
      .then(filesystemInfo => {
        this.storage.set(`${practiceName}/${fileName}`, normalizeURL(filesystemInfo.nativeURL))
        .then()
        .catch(err => console.log(JSON.stringify(err)))
      });
  }

  getFileUrl(practiceName, fileName): Promise<string> {
    return this.storage.get(`${practiceName}/${fileName}`)
  }

  claerCache() {}
}
