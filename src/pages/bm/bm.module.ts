import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BmPage } from './bm';
import { ImgCacheModule } from '../../directives/ng-imgcache/img-cache.module';

@NgModule({
  declarations: [
    BmPage,
  ],
  imports: [
    IonicPageModule.forChild(BmPage),
    ImgCacheModule
  ],
})
export class BmPageModule {}
