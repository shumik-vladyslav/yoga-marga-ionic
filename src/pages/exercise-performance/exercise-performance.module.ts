import { AppPipesModule } from './../../pipe/pipes.module';
import { AppDatePipe } from './../../pipe/datePipe';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExercisePerformancePage } from './exercise-performance';
import { ImgCacheModule } from '../../directives/ng-imgcache/img-cache.module';
import { LogPipe } from '../../pipe/logPipe';
// import { ImgCacheModule } from 'ng-imgcache';


@NgModule({
  declarations: [
    ExercisePerformancePage
  ],
  imports: [
    AppPipesModule,
    ImgCacheModule,
    IonicPageModule.forChild(ExercisePerformancePage)
  ],
})
export class ExercisePerformancePageModule {}
