import { Component } from '@angular/core';

/**
 * Generated class for the SingUpComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'sing-up',
  templateUrl: 'sing-up.html'
})
export class SingUpComponent {

  text: string;

  constructor() {
    console.log('Hello SingUpComponent Component');
    this.text = 'Hello World';
  }

}
