import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateComplexNamePage } from './create-complex-name';

@NgModule({
  declarations: [
    CreateComplexNamePage,
  ],
  imports: [
    IonicPageModule.forChild(CreateComplexNamePage),
  ],
  entryComponents: [
    CreateComplexNamePage
  ]
})
export class CreateComplexNamePageModule {}
