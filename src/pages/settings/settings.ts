import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TermsPage } from '../terms/terms';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  
  ionViewCanEnter() {
    return UserProvider.user?true:false;
  }
  
  goTermsPage(){
    this.navCtrl.setRoot(TermsPage);
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

}
