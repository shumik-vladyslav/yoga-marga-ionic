import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BmPage } from './bm';

@NgModule({
  declarations: [
    BmPage,
  ],
  imports: [
    IonicPageModule.forChild(BmPage),
  ],
})
export class BmPageModule {}
