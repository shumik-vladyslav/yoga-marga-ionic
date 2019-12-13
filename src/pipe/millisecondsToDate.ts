import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({name: 'milli2date'})
export class MillisecondsToDatePipe implements PipeTransform {
    transform(value: any): any {
        if(!value) return null;
        moment.utc(value).valueOf()
    }
}