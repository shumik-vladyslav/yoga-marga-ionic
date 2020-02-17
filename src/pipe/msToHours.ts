// timespan in milliseconds to hours

import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'msToHours' })
export class MsToHoursPipe implements PipeTransform {
    transform(value: any): any {
        if (!value) {
            return null;
        }

        let seconds = value / 1000;        
        let hours = parseInt(seconds / 3600);
        seconds = seconds % 3600;
        let minutes = parseInt(seconds / 60);
        seconds = seconds % 60;

        return `${hours}:${minutes}`;
    }
}