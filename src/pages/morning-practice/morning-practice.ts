import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AllPracticesPage } from '../all-practices/all-practices';

/**
 * Generated class for the MorningPracticePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-morning-practice',
  templateUrl: 'morning-practice.html',
})

export class MorningPracticePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  goAllPracticesPage(){
    this.navCtrl.setRoot(AllPracticesPage);
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad MorningPracticePage');
  }

}
