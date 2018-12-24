import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PracticePerformancePage } from './practice-performance';
import { ImgCacheModule } from '../../directives/ng-imgcache/img-cache.module';

@NgModule({
  declarations: [
    PracticePerformancePage,
  ],
  imports: [
    ImgCacheModule,
    IonicPageModule.forChild(PracticePerformancePage),
  ],
})
export class PracticePerformancePageModule {}
