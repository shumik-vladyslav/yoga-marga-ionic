import { PracticeSearchPage } from './../practice-search/practice-search';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { SignUpPage } from '../sing-up/sing-up';
import { HomePage } from '../home/home';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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

  customeValidation;
  myForm: FormGroup;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public afAuth: AngularFireAuth,
    public formBuilder: FormBuilder,
    private alertCtrl: AlertController
  ) {
      this.myForm = formBuilder.group({
              
        Email : ['', [ Validators.required, Validators.email]],
        Password: ['', [Validators.required, Validators.pattern(".{8,}")]],
      
      });
  }

  presentAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ["Закрыть"]
    });
    alert.present();
  }

  goSingUp(){
    this.navCtrl.setRoot(SignUpPage);
  }

  async signIn() {
    if(this.myForm.invalid){
      this.customeValidation = false;
    }
    try {
      const user = await this.afAuth.auth.signInWithEmailAndPassword(this.email, this.password);
      console.log('user', user);
      this.navCtrl.setRoot(PracticeSearchPage);
    } catch (err) {
      console.log(err);
      this.presentAlert('Ошибка', err);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SingInPage');
  }

}


