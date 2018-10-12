import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExercisePerformancePage } from './exercise-performance';

@NgModule({
  declarations: [
    ExercisePerformancePage,
  ],
  imports: [
    IonicPageModule.forChild(ExercisePerformancePage),
  ],
})
export class ExercisePerformancePageModule {}
