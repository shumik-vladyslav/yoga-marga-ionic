import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PracticeSearchPage } from './practice-search';

@NgModule({
  declarations: [
    PracticeSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(PracticeSearchPage),
  ],
})
export class PracticeSearchPageModule {}
