import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AllPracticesPage } from '../all-practices/all-practices';

/**
 * Generated class for the EveningPracticePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-evening-practice',
  templateUrl: 'evening-practice.html',
})

export class EveningPracticePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  goAllPracticesPage(){
    this.navCtrl.setRoot(AllPracticesPage);
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad EveningPracticePage');
  }

}
