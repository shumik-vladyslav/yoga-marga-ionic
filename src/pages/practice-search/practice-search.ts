import { PracticePerformancePage } from './../practice-performance/practice-performance';
import { filter } from "rxjs/operators";
import { UserProvider } from "./../../providers/user/user";
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";

/**
 * Generated class for the PracticeSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-practice-search",
  templateUrl: "practice-search.html"
})
export class PracticeSearchPage {
  title;
  notes;
  location;
  startDate;
  startTime;
  endDate;
  endTime;

  practices;
  filtered;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.practices = Object.values(UserProvider.getGlobalPractices()).filter(
      (p: any) => p.active !== false
    );
    this.filtered = this.practices;
    // console.log('practices', this.practices);
    //
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad PracticeSearchPage");
  }

  onSearchChange(value) {
    console.log(value);
    this.filtered = this.practices.filter(
      p => p.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  // [navPush]="p.active === false?'':'PracticePerformancePage'" [navParams]="{practice: p}" 
  onPractice(p) {
    if (!p.active) return;
    this.navCtrl.push(PracticePerformancePage, {practice: p})
  }

}
