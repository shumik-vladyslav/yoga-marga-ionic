import { MsToHoursPipe } from './msToHours';
import { AppDatePipe } from './datePipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogPipe } from './logPipe';
import { MillisecondsToDatePipe } from './millisecondsToDate';
import { IsArrayPipe } from './is-array.pipe';

@NgModule({
    declarations: [LogPipe,AppDatePipe, MsToHoursPipe,MillisecondsToDatePipe,IsArrayPipe],
    imports: [ CommonModule ],
    exports: [LogPipe,AppDatePipe, MsToHoursPipe, IsArrayPipe],
    providers: [],
})
export class AppPipesModule {}