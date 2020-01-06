import { BmPage } from './../bm/bm';
import { PracticePerformancePage } from './../practice-performance/practice-performance';
import { filter } from "rxjs/operators";
import { UserProvider } from "./../../providers/user/user";
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { MyComplexsPage } from '../my-complexs/my-complexs';

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams) 
  {
  }

  ionViewWillEnter() {
    const uspr = UserProvider.getUserPractices();

    const glpr = Object.values(UserProvider.getGlobalPractices()).filter(
      (p: any) => p.active !== false
    );

    this.practices = glpr.map((gp: any) => ({ ...uspr[gp.id], ...gp }));
    console.log('pract 1', this.practices);
    this.practices = this.practices.sort((a, b) => {
      const ap = a.priority ? a.priority : 0;
      const bp = b.priority ? b.priority : 0;
      return bp - ap;
    });
    console.log('pract 2', this.practices);
    let com = UserProvider.getComplexes();
    this.practices = [...com, ...this.practices];
    console.log('pract 3', this.practices);
    this.filtered = [...this.practices];
    console.log('filtered 1', this.filtered);
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad PracticeSearchPage");
  }

  onSearchChange(value) {
    console.log(value);
    if (!value) {
      return this.filtered = this.practices;
    }
    this.filtered = this.practices.filter(
      p => p.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  onPractice(p) {
    if (!p.active) return;
    if (p.isBm) {
      this.navCtrl.push(BmPage, { practice: p })
    } else if (p.isComplex) {
      this.navCtrl.push(MyComplexsPage, { complex: p });
    } else {
      this.navCtrl.push(PracticePerformancePage, { practice: p })
    }
  }

  calculateGoal(pr) {
    if (pr.spentTimeGoal) {
      return pr.spentTime ? +pr.spentTime / +pr.spentTimeGoal : 0;
    } else if (pr.amountCounterGoal) {
      return pr.amountCounter ? +pr.amountCounter / +pr.amountCounterGoal : 0;
    } else if (pr.maxAchievementGoal) {
      return pr.maxAchievement ? +pr.maxAchievement / +pr.maxAchievementGoal : 0;
    } else return 0;
  }

}
