import { ImgCacheModule } from '../../directives/ng-imgcache/img-cache.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PracticesListPage } from './practices-list';

@NgModule({
  declarations: [
    PracticesListPage,
  ],
  imports: [
    ImgCacheModule,
    IonicPageModule.forChild(PracticesListPage),
  ],
})
export class PracticesListPageModule {}
