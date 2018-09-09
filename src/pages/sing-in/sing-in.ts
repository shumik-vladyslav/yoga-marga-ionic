import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MainPage } from '../main-page/main-page';
import { HomePage } from '../home/home';

/**
 * Generated class for the SingInPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-sing-in',
  templateUrl: 'sing-in.html',
})
export class SingInPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  goSingUp(){
    this.navCtrl.setRoot(MainPage);
  }

  goToHome(){
    this.navCtrl.setRoot(HomePage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SingInPage');
  }

}
