import { Observable, of } from "rxjs";
import { tap, map } from "rxjs/operators";

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { normalizeURL } from "ionic-angular";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from "@ionic-native/file-transfer";
import { File, IWriteOptions } from "@ionic-native/file";
import { Storage } from "@ionic/storage";
import { AngularFireStorage } from "@angular/fire/storage";

/*
  Generated class for the FileCacheProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FileCacheProvider {
  fileTransfer: FileTransferObject = this.transfer.create();

  in_memory = {};

  constructor(
    private transfer: FileTransfer,
    private file: File,
    private storage: Storage,
    private afStorage: AngularFireStorage
  ) {
    console.log("opa", this.file.dataDirectory);
    // this.storage.clear().then()
    // this.init().then(
    //   _ => console.log(JSON.stringify(this.in_memory))
    // );
    this.file
      .readAsText(this.file.dataDirectory, "cachedUrls")
      .then(text => {
        console.log("file readed", text);

        this.in_memory = JSON.parse(text);
      })
      .catch(err => console.log("file read error"));
  }

  async init() {
    try {
      const keys = await this.storage.keys();
      for (const key of keys) {
        this.in_memory[key] = await this.storage.get(key);
      }
    } catch (err) {
      console.log(err);
    }
  }

  saveFile(url, practiceName, fileName) {
    return this.fileTransfer
      .download(
        url,
        `${this.file.dataDirectory}filecache/${practiceName}/${fileName}`
      )
      .then(filesystemInfo => {
        this.storage
          .set(
            `${practiceName}/${fileName}`,
            normalizeURL(filesystemInfo.nativeURL)
          )
          .then()
          .catch(err => console.log(JSON.stringify(err)));
      });
  }

  getFileUrl(practiceName, fileName): Promise<string> {
    return this.storage.get(`${practiceName}/${fileName}`);
  }

  getUrl(path): Observable<string> {
    let url = this.in_memory[path];
    if (url) return of(url);

    return this.afStorage
      .ref(path)
      .getDownloadURL()
      .pipe(
        tap(val => {
          this.in_memory[path] = val;
          this.file
            .writeFile(
              this.file.dataDirectory,
              "cachedUrls",
              JSON.stringify(this.in_memory),
              { replace: true }
            )
            .then(res => console.log("file writed"))
            .catch(err => console.log("write error"));
        })
      );
  }

  claerCache() {}
}
