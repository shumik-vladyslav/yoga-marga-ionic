import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { GoalsPage } from "../goals/goals";
import { UserProvider } from "../../providers/user/user";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

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
  
  myForm : FormGroup;
  customeValidation;

  data ={
    "spiritualName": "",
    "fullName" : "",
    "Status" : "",
    "Email" : "",
    "Password" : "",
    "PhoneNumber" : "",
    "gender" : ""
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userP: UserProvider,
    private formBuilder: FormBuilder
  ) {
    this.progresses = UserProvider.getUserGoals().map(a => {
      return {
        val: Math.round((a.achivement / a.goal) * 100),
        name: a.name
      };
    });

    this.achivements = UserProvider.getUserGoals().filter(a => a.achivement > 0);
    console.log(this.achivements);

    this.myForm = formBuilder.group({
              
      spiritualName : ['', Validators.required],
      fullName : ['', Validators.required],
      Status : [this.data.Status != ''],
      Email: ['', [ Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.pattern(".{8,}")]],
      PhoneNumber: ['', [Validators.required, Validators.pattern(".{10,}")]],
      gender: ['', Validators.required],
  });

  }

  goAllPracticesPage(){
    if(this.myForm.valid){
      // Do Some
    } else{
      this.customeValidation = false;
    }
  }

  goGoalsPage() {
    this.navCtrl.setRoot(GoalsPage);
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad PrivateOfficePage");
  }
}
