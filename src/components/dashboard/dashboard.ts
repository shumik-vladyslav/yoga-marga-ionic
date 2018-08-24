import { Component } from '@angular/core';

/**
 * Generated class for the DashboardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardComponent {

  text: string;

  constructor() {
    console.log('Hello DashboardComponent Component');
    this.text = 'Hello World';
  }

}
