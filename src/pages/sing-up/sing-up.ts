import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SingInPage } from '../sing-in/sing-in';

@Component({
  selector: 'sing-up',
  templateUrl: 'sing-up.html'
})
export class SignUpPage {

  gender;
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  
  goSingIn(){
    this.navCtrl.setRoot(SingInPage);
  }

}
