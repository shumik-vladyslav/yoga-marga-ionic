import { NgModule } from '@angular/core';
import { MetronomeComponent } from './metronome/metronome';
import { IonicModule } from 'ionic-angular';
@NgModule({
	declarations: [MetronomeComponent],
	imports: [IonicModule],
	exports: [MetronomeComponent]
})
export class ComponentsModule {}
