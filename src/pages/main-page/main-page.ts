import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SingInPage } from '../sing-in/sing-in';

@Component({
  selector: 'main-page',
  templateUrl: 'main-page.html'
})
export class MainPage {
  gender;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  
  goSingIn(){
    this.navCtrl.setRoot(SingInPage);
  }

}
