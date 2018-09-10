import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AllPracticesPage } from '../all-practices/all-practices';

/**
 * Generated class for the MyComplexsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-my-complexs',
  templateUrl: 'my-complexs.html',
})

export class MyComplexsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  
  goAllPracticesPage(){
    this.navCtrl.setRoot(AllPracticesPage);
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad MyComplexsPage');
  }

}
