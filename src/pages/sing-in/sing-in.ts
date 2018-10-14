import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
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
    public formBuilder: FormBuilder
  ) {
      this.myForm = formBuilder.group({
              
        Email : ['', [ Validators.required, Validators.email]],
        Password: ['', [Validators.required, Validators.pattern(".{8,}")]],
      
      });
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


