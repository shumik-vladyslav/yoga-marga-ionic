import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';

/**
 * Generated class for the TermsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-terms',
  templateUrl: 'terms.html',
})

export class TermsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  
  goSettingsPage(){
    this.navCtrl.setRoot(SettingsPage);
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad TermsPage');
  }

}
