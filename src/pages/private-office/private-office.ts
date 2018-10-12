import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { GoalsPage } from "../goals/goals";
import { UserProvider } from "../../providers/user/user";

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userP: UserProvider
  ) {
    this.achivements = UserProvider.getUserPractAchievement();
    this.progresses = this.achivements.filter(a => a.goal).map(a => Math.round(a.achivement/a.goal*100));
    console.log(this.achivements);
    console.log(UserProvider.getUser());
    console.log(this.progresses);
    
    
  }

  goGoalsPage() {
    this.navCtrl.setRoot(GoalsPage);
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad PrivateOfficePage");
  }
}
