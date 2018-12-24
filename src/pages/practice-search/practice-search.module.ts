import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PracticeSearchPage } from './practice-search';
import { ImgCacheModule } from '../../directives/ng-imgcache/img-cache.module';

@NgModule({
  declarations: [
    PracticeSearchPage,
  ],
  imports: [
    ImgCacheModule,
    IonicPageModule.forChild(PracticeSearchPage),
  ],
})
export class PracticeSearchPageModule {}
