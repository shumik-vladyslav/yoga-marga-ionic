import { AngularFireStorage } from "@angular/fire/storage";
import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public afAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) {
    this.myForm = formBuilder.group(
      {
        spiritualName: ["", Validators.required],
        fullName: ["", Validators.required],
        Status: ["", Validators.required],
        Email: ["", [Validators.required, Validators.email]],
        // Password : ['', [ Validators.required, Validators.pattern("(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}")]],
        Password: ["", [Validators.required, Validators.pattern(".{8,}")]],
        RepeatPassword: ["", Validators.required],
      },
      { validator: this.matchingPasswords("Password", "RepeatPassword") }
    );
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
            // {"spiritualName":"Opa","fullName":"Opa","Status":false,
            // "Email":"Opa@gmail.com","Password":"11111111","RepeatPassword":"11111111","gender":"f"}
            console.log(JSON.stringify({
              spiritual_name: this.myForm.value.spiritualName,
              full_name: this.myForm.value.fullName,
              status: this.myForm.value.Status,
              id: auth.user.uid
            }));
            
            this.afs
              .doc(`users/${auth.user.email}`)
              .set({
                spiritual_name: this.myForm.value.spiritualName,
                full_name: this.myForm.value.fullName,
                status: this.myForm.value.Status,
                id: auth.user.uid
              })
              .then(res => console.log("user extra data saved"))
              .catch(err => console.log("user saving extra data error", err));
          }
        });
    } else {
      console.log("form is invalid");
      this.customeValidation = false;
    }
  }

  goSingIn() {
    this.navCtrl.setRoot(SingInPage);
  }
}
