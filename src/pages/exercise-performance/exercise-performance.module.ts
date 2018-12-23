import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExercisePerformancePage } from './exercise-performance';
import { ImgCacheModule } from '../../directives/ng-imgcache/img-cache.module';
// import { ImgCacheModule } from 'ng-imgcache';


@NgModule({
  declarations: [
    ExercisePerformancePage,
  ],
  imports: [
    ImgCacheModule,
    IonicPageModule.forChild(ExercisePerformancePage)
  ],
})
export class ExercisePerformancePageModule {}
