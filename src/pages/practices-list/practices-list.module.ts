import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PracticesListPage } from './practices-list';

@NgModule({
  declarations: [
    PracticesListPage,
  ],
  imports: [
    IonicPageModule.forChild(PracticesListPage),
  ],
})
export class PracticesListPageModule {}
