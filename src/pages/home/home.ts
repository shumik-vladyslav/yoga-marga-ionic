import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AllPracticesPage } from '../all-practices/all-practices';
import { PrivateOfficePage } from '../private-office/private-office';
import { ComplexsPage } from '../complexs/complexs';
import { Template_3Page } from '../template-3/template-3';

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

  goToComplexsPage(){
    this.navCtrl.setRoot(ComplexsPage);
  }

  goToPrivateOffice(){
    this.navCtrl.setRoot(PrivateOfficePage);
  }

  goToAsana2(){
    this.navCtrl.setRoot(Template_3Page);
  }
  
}
