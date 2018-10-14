import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SingInPage } from '../sing-in/sing-in';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'sing-up',
  templateUrl: 'sing-up.html'
})
export class SignUpPage {

  gender;
  
  myForm : FormGroup;

  data ={
    "spiritualName": "",
    "fullName" : "",
    "Status" : "",
    "Email" : "",
    "Password" : "",
    "RepeatPassword" : "",
    "gender" : ""
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder) {
      this.myForm = formBuilder.group({
              
        spiritualName : ['', Validators.required],
        fullName : ['', Validators.required],
        Status : [this.data.Status != ''],
        Email: ['', [ Validators.required, Validators.email]],
        // Password : ['', [ Validators.required, Validators.pattern("(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}")]],
        Password: ['', [Validators.required, Validators.pattern(".{8,}")]],
        RepeatPassword: ['', Validators.required],
        gender: ['', Validators.required],
    }, {validator: this.matchingPasswords('Password', 'RepeatPassword')});
  }

  customeValidation;


  matchingPasswords(passwordKey: string, RepeatPasswordKey: string) {
    return (group: FormGroup): {[key: string]: any} => {
      let NewPassword = group.controls[passwordKey];
      let RepeatPassword = group.controls[RepeatPasswordKey];
  
      if (NewPassword.value !== RepeatPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    }
  }

  goSingIn(){
    if(this.myForm.valid){
      this.navCtrl.setRoot(SingInPage);
    } else{
      this.customeValidation = false;
    }
    console.log(this.myForm)
  }

}
