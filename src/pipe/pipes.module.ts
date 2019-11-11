import { MsToHoursPipe } from './msToHours';
import { AppDatePipe } from './datePipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogPipe } from './logPipe';

@NgModule({
    declarations: [LogPipe,AppDatePipe, MsToHoursPipe],
    imports: [ CommonModule ],
    exports: [LogPipe,AppDatePipe, MsToHoursPipe],
    providers: [],
})
export class AppPipesModule {}