import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PrivateOfficePage } from '../private-office/private-office';

/**
 * Generated class for the GoalsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-goals',
  templateUrl: 'goals.html',
})

export class GoalsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  
  goPrivateOfficePage(){
    this.navCtrl.setRoot(PrivateOfficePage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GoalsPage');
  }

}
