import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import { AngularFireAuth } from '@angular/fire/auth';

/**
 * Generated class for the ActivationWarningPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-activation-warning',
  templateUrl: 'activation-warning.html',
})
export class ActivationWarningPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public afAuth: AngularFireAuth,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ActivationWarningPage');
  }

  onClick() {
    this.navCtrl.push(SettingsPage);
  }

  onSignOut() {
    this.afAuth.auth.signOut().then();
  }
}
