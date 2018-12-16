import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
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
  msg;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private alertCtrl: AlertController) {
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

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Успешно',
      subTitle: 'Сообщение отправлено',
      buttons: ['Ок']
    });
    alert.present();
  }

  submit() {
    console.log('submit');
    if(this.msg && this.msg !=='')
    UserProvider.sendFeedback(this.msg).then(
      res => this.presentAlert()
    )
  }
}
