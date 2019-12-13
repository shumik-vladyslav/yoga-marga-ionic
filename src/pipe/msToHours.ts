// timespan in milliseconds to hours

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'msToHours'})
export class MsToHoursPipe implements PipeTransform {
    transform(value: any): any {
        if (!value) {
            return null;
        }
        // return Math.floor(value/1000/60/60) / 100;
        return (value/1000/60/60).toFixed(1);
    }
}