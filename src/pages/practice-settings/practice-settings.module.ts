import { ComponentsModule } from './../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PracticeSettingsPage } from './practice-settings';

@NgModule({
  declarations: [
    PracticeSettingsPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(PracticeSettingsPage),
  ],
})
export class PracticeSettingsPageModule {}
