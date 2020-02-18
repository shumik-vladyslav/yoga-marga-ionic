import { AngularFireStorage } from "@angular/fire/storage";
import { Component } from "@angular/core";
import { NavController, NavParams, AlertController } from "ionic-angular";
import { SingInPage } from "../sing-in/sing-in";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";

@Component({
  selector: "sing-up",
  templateUrl: "sing-up.html"
})
export class SignUpPage {
  gender;

  myForm: FormGroup;

  data = {
    spiritualName: "",
    fullName: "",
    Status: "",
    Email: "",
    Password: "",
    RepeatPassword: "",
    gender: ""
  };

  groups$
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private alertCtrl: AlertController
  ) {
    this.myForm = formBuilder.group(
      {
        spiritualName: [""],
        fullName: ["", Validators.required],
        Status: ["", Validators.required],
        Email: ["", [Validators.required, Validators.email]],
        // Password : ['', [ Validators.required, Validators.pattern("(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}")]],
        Password: ["", [Validators.required, Validators.pattern(".{8,}")]],
        RepeatPassword: ["", Validators.required],
      },
      { validator: this.matchingPasswords("Password", "RepeatPassword") }
    );

    this.groups$ = afs
    .collection(`groups`)
    .valueChanges();

  }

  presentAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ["Закрыть"]
    });
    alert.present();
  }

  customeValidation;

  matchingPasswords(passwordKey: string, RepeatPasswordKey: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let NewPassword = group.controls[passwordKey];
      let RepeatPassword = group.controls[RepeatPasswordKey];

      if (NewPassword.value !== RepeatPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    };
  }

  signUp() {
    console.log(JSON.stringify(this.myForm.value));
    if (this.myForm.valid) {
      this.afAuth.auth
        .createUserAndRetrieveDataWithEmailAndPassword(
          this.myForm.value.Email,
          this.myForm.value.Password
        )
        .then(auth => {
          console.log(JSON.stringify(auth.user));
          if (auth.user) {
            if (this.myForm.value.Status == 'Неофит'){

            }

            this.afs
              .doc(`users/${auth.user.email}`)
              .set({
                spiritual_name: this.myForm.value.spiritualName,
                full_name: this.myForm.value.fullName,
                status: this.myForm.value.Status,
                id: auth.user.uid,
                email: auth.user.email,
                active: this.myForm.value.Status == 'Неофит'
              })
              .then(res => console.log("user extra data saved"))
              .catch(err => console.log("user saving extra data error", err));
          }
        });
    } else {
      this.presentAlert('Ошибка', 'Проверьте правильность полей');
      this.customeValidation = false;
    }
  }

  goSingIn() {
    this.navCtrl.setRoot(SingInPage);
  }
}
