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
  achivements;
  goals;

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
    return UserProvider.user?true:false;
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
    console.log('global practices', globalPractices);
    
    this.progresses = UserProvider.getUserGoals().map(a => {
      return {
        val: Math.round(((+a.achivement) / (+a.goal)) * 100),
        name: a.name,
        ico: globalPractices[a.id].ico,
        goal: a.goal,
        achivement: a.achivement
      };
    }).filter(a => +a.goal);

    console.log(this.progresses);
    
    this.achivements = UserProvider.getUserGoals().filter(
      a => a.achivement > 0
    );

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

  goGoalsPage() {
    this.navCtrl.setRoot(GoalsPage);
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad PrivateOfficePage");
  }

  submit() {
    
    if(this.myForm.valid) {
      UserProvider.updateUser(this.myForm.value)
      .then(res => this.navCtrl.setRoot(HomePage))
      .catch(err => console.log('error', err));
    }
  }
}
