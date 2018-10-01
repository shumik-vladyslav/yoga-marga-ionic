import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SignUpPage } from '../sing-up/sing-up';
import { HomePage } from '../home/home';
import { AngularFireAuth } from '@angular/fire/auth';

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
  email;
  password;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public afAuth: AngularFireAuth) {
  }

  goSingUp(){
    this.navCtrl.setRoot(SignUpPage);
  }

  async signIn() {
    try {
      const user = await this.afAuth.auth.signInWithEmailAndPassword(this.email, this.password);
      console.log('user', user);
      this.navCtrl.setRoot(HomePage);
    } catch (err) {
      console.log(err);
    }
  }

  goToHome(){
    this.navCtrl.setRoot(HomePage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SingInPage');
  }

}
