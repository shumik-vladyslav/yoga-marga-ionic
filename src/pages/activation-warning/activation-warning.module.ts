import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActivationWarningPage } from './activation-warning';

@NgModule({
  declarations: [
    ActivationWarningPage,
  ],
  imports: [
    IonicPageModule.forChild(ActivationWarningPage),
  ],
})
export class ActivationWarningPageModule {}
