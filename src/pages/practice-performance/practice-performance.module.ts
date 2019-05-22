import { ComponentsModule } from './../../components/components.module';
import { LogPipe } from './../../pipe/logPipe';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PracticePerformancePage } from './practice-performance';
import { ImgCacheModule } from '../../directives/ng-imgcache/img-cache.module';

@NgModule({
  declarations: [
    PracticePerformancePage,
    LogPipe
  ],
  imports: [
    ImgCacheModule,
    IonicPageModule.forChild(PracticePerformancePage),
    ComponentsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PracticePerformancePageModule {}
