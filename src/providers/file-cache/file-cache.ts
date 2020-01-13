import { UtilsFuncs } from './../../utils/utils-funcs';
import { Observable, of } from "rxjs";
import { tap, map, take } from "rxjs/operators";

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { normalizeURL, Platform } from "ionic-angular";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from "@ionic-native/file-transfer";
import { File, IWriteOptions } from "@ionic-native/file";
import { Storage } from "@ionic/storage";
import { AngularFireStorage } from "@angular/fire/storage";

declare var window: any;

/*
  Generated class for the FileCacheProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FileCacheProvider {
  fileTransfer: FileTransferObject = this.transfer.create();
  
  inited = false;
  cacheEnties;
  constructor(
    private transfer: FileTransfer,
    private file: File,
    private platform: Platform
  ) {
    console.log('FileCacheProvider constructor');
    console.log('Cache directory path', this.file.dataDirectory);
    this.init().then();
  }

  async init() {
    return this.file.listDir(this.file.dataDirectory, '.').then(
      entries => {
        this.cacheEnties = new Set();
        console.log('cache init ');
        entries.forEach(e => this.cacheEnties.add(e.name));
        console.log('cacheEnties', Array.from(this.cacheEnties).join(' '))
        this.inited = true;
      }
    )
  }

  // check if cache contains file
  check(key): Promise<any> {
    console.log('check');
    console.log('cache inited',this.inited,Array.from(this.cacheEnties).join(' '));
    console.log('this.cacheEnties.has(key)',key, this.cacheEnties.has(key));
    if (!this.inited)
      return this.file.checkFile(this.file.dataDirectory, key);
    return Promise.resolve(this.cacheEnties.has(key));
  }

  // return file uri in the native storage
  get(url: string): Promise<any> {
    if (!url) return;
    if (!this.platform.is('cordova')) return Promise.resolve(url);

    const ext = UtilsFuncs.getUrlExtension(url);
    const fileName = `${UtilsFuncs.cyrb53Hash(url)}.${ext}`;
    const ionicUrl = window.Ionic.WebView.convertFileSrc(`${this.file.dataDirectory}${fileName}`);

    return this.check(fileName)
      .then(isExists => {
        console.log('check file existing', isExists);
        if (isExists) {
          console.log('file exists', fileName);
          return ionicUrl;
        }
        console.log('file does not exist');
        this.put(url).then();
        return Promise.resolve(url);
      }).catch(err => {
        // console.log('file existing check error', JSON.stringify(err));
        this.put(url).then();
        return Promise.resolve(url);
      });
  }

  // put file into native storage
  put(url) {
    const ext = UtilsFuncs.getUrlExtension(url);
    const fileName = `${UtilsFuncs.cyrb53Hash(url)}.${ext}`;
    console.log('put file into cash', fileName);
    return this.fileTransfer
      .download(
        url,
        `${this.file.dataDirectory}${fileName}`
      )
      .then(filesystemInfo => {
        this.cacheEnties.add(fileName);
        console.log('file saved into filesystem', fileName);
      });
  }

  claerCache() {

  }
}
