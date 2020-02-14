// timespan in milliseconds to hours

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'msToHours'})
export class MsToHoursPipe implements PipeTransform {
    transform(value: any): any {
        if (!value) {
            return null;
        }
        const minutes = Math.floor((value / (1000 * 60)) % 60);
        const hours = Math.floor((value / (1000 * 60 * 60)) % 24);
        return `${hours}:${minutes}`;
    }
}