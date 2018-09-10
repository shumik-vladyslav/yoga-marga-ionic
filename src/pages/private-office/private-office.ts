import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GoalsPage } from '../goals/goals';

/**
 * Generated class for the PrivateOfficePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-private-office',
  templateUrl: 'private-office.html',
})

export class PrivateOfficePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  goGoalsPage(){
    this.navCtrl.setRoot(GoalsPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrivateOfficePage');
  }
  
}
