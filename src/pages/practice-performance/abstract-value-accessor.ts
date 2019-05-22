import { forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export abstract class AbstractValueAccessor implements ControlValueAccessor {
    _intervals: any = '';
    get intervals(): any { return this._intervals; };
    set intervals(v: any) {
        console.log('set intervals', v);
      if (v !== this._intervals) {
        this._intervals = v;
        this.onChange(v);
      }
    }

    writeValue(intervals: any) {
      this._intervals = intervals;
      // warning: comment below if only want to emit on user intervention
      this.onChange(intervals);
    }

    onChange = (_) => {console.log('ch intervals', this._intervals);};
    onTouched = () => {};
    registerOnChange(fn) { console.log('register on change', fn); this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }
}

export function MakeProvider(type : any){
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => type),
    multi: true
  };
}