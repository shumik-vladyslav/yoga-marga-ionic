import { Practice } from './../../models/practice';
import { HomePage } from './../home/home';
import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { GoalsPage } from "../goals/goals";
import { UserProvider } from "../../providers/user/user";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AngularFirestore } from "@angular/fire/firestore";

/**
 * Generated class for the PrivateOfficePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: "page-private-office",
  templateUrl: "private-office.html"
})
export class PrivateOfficePage {
  progresses;
  gender;
  myForm: FormGroup;
  customeValidation;

  data = {
    spiritualName: "",
    fullName: "",
    Status: "",
    Email: "",
    Password: "",
    PhoneNumber: "",
    gender: ""
  };

  ionViewCanEnter() {
    return UserProvider.user ? true : false;
  }

  user
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userP: UserProvider,
    private formBuilder: FormBuilder,
    afs: AngularFirestore
  ) {
    const globalPractices = UserProvider.globalPractices;
    const user = UserProvider.getUser();

    this.myForm = formBuilder.group({
      spiritual_name: [user.spiritual_name || "", Validators.required],
      full_name: [user.full_name || "", Validators.required],
      status: [user.status || this.data.Status != "", Validators.required],
      // email: [user.email || "", [Validators.required, Validators.email]],
      // password: [user.password || "", [Validators.required, Validators.pattern(".{8,}")]],
      phone: [user.phone || "", [Validators.pattern(".{10,}")]],
      gender: [user.gender || "", Validators.required]
    });
  }

  goAllPracticesPage() {
    if (this.myForm.valid) {
      // Do Some
    } else {
      this.customeValidation = false;
    }
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad PrivateOfficePage");
  }

  submit() {
    if (this.myForm.valid) {
      UserProvider.updateUser(this.myForm.value)
        .then(res => this.navCtrl.setRoot(HomePage))
        .catch(err => console.log('error', err));
    }
  }


  ionViewWillEnter() {
    const practices = UserProvider.getUserPractices();
    const globalPractices = UserProvider.globalPractices;
    const keys = Object.keys(practices);

    this.progresses = keys.map( (key:any) => {
      const p = {...practices[key], ...globalPractices[key]}
      console.log(p);
      if (!this.practiceHasGoal(p)) return null;
      return this.calculateGoal(p);
    }).filter(p => p);
    console.log(this.progresses);
  }

  practiceHasGoal(pr) {
    return pr.spentTimeGoal || pr.amountCounterGoal || pr.maxAchievementGoal;
  }

  calculateGoal(pr) {
    if (pr.spentTimeGoal) {
      return {
        goal: Math.floor(+pr.spentTimeGoal / 1000 / 60/ 60),
        achivement: Math.floor(+pr.spentTime / 1000 / 60/ 60),  
        val: Math.round ((pr.spentTime ? +pr.spentTime / +pr.spentTimeGoal : 0) *100 ),
        name: pr.name,
        ico: pr.ico,
      }
    } else if (pr.amountCounterGoal) {
      return {
        goal: +pr.amountCounterGoal,
        achivement: +pr.amountCounter,  
        val: Math.round ((pr.amountCounter? +pr.amountCounter / +pr.amountCounterGoal : 0) *100 ),
        name: pr.name,
        ico: pr.ico,
      }
    } else if (pr.maxAchievementGoal) {
      return {
        goal: +pr.maxAchievementGoal,
        achivement: +pr.maxAchievement,  
        val: Math.round ((pr.maxAchievement? +pr.maxAchievement / +pr.maxAchievementGoal : 0) *100 ),
        name: pr.name,
        ico: pr.ico,
      }
    } else return null;
  }
}
