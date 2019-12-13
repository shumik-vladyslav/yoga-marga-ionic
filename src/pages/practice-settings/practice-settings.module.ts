import { ComponentsModule } from './../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PracticeSettingsPage } from './practice-settings';
import { AppPipesModule } from '../../pipe/pipes.module';

@NgModule({
  declarations: [
    PracticeSettingsPage,
  ],
  imports: [
    ComponentsModule,
    AppPipesModule,
    IonicPageModule.forChild(PracticeSettingsPage),
  ],
})
export class PracticeSettingsPageModule {}
