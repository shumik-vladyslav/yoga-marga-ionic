import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isArray'
})
export class IsArrayPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) return false;
    return Array.isArray(value);
  }

}
