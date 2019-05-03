import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'applog'})
export class LogPipe implements PipeTransform {
    transform(value: any): any {
        console.log(value);
    }
}