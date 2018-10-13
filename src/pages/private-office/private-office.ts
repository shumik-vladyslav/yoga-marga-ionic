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
    this.progresses = UserProvider.getUserGoals().map(a => {
      return {
        val: Math.round((a.achivement / a.goal) * 100),
        name: a.name
      };
    });

    this.achivements = UserProvider.getUserGoals().filter(a => a.achivement > 0);
    console.log(this.achivements);
  }

  goGoalsPage() {
    this.navCtrl.setRoot(GoalsPage);
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad PrivateOfficePage");
  }
}
