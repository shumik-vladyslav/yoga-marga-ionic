import { AppDatePipe } from './datePipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogPipe } from './logPipe';

@NgModule({
    declarations: [LogPipe,AppDatePipe],
    imports: [ CommonModule ],
    exports: [LogPipe,AppDatePipe],
    providers: [],
})
export class AppPipesModule {}