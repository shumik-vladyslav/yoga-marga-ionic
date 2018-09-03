import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AllPracticesPage } from '../all-practices/all-practices';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams,) {
   
  }
  goAllPracticesPage(){
    this.navCtrl.setRoot(AllPracticesPage);
  }
  
}
