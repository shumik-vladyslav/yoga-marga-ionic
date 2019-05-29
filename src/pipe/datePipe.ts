import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({name: 'appdate'})
export class AppDatePipe implements PipeTransform {
    transform(value: any): any {
       if(!value) return null;
       return moment.utc(value).format('HH:mm:ss');
    }
}