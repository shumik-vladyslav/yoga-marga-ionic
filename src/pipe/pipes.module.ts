import { MsToHoursPipe } from './msToHours';
import { AppDatePipe } from './datePipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogPipe } from './logPipe';
import { MillisecondsToDatePipe } from './millisecondsToDate';

@NgModule({
    declarations: [LogPipe,AppDatePipe, MsToHoursPipe,MillisecondsToDatePipe],
    imports: [ CommonModule ],
    exports: [LogPipe,AppDatePipe, MsToHoursPipe],
    providers: [],
})
export class AppPipesModule {}