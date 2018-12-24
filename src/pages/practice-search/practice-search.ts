import { PracticePerformancePage } from './../practice-performance/practice-performance';
import { filter } from "rxjs/operators";
import { UserProvider } from "./../../providers/user/user";
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Calendar } from "@ionic-native/calendar";

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
  calendar;

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
  getCalender() {
    var startDateTimeISO = this.buildISODate(this.startDate, this.startTime);
    var enddateTimeISO = this.buildISODate(this.endDate, this.endTime);

    this.calendar.requestWritePermission();
    this.calendar
      .createEvent(
        this.title,
        this.location,
        this.notes,
        new Date(startDateTimeISO),
        new Date(enddateTimeISO)
      )
      .then(
        msg => {
          alert("msg " + msg);
        },
        err => {
          alert("err " + err);
        }
      );
  }

  buildISODate(date, time) {
    var dateArray = date && date.split("-");
    var timeArray = time && time.split(":");
    var normalDate = new Date(
      parseInt(dateArray[0]),
      parseInt(dateArray[1]) - 1,
      parseInt(dateArray[2]),
      parseInt(timeArray[0]),
      parseInt(timeArray[1]),
      0,
      0
    );
    return normalDate.toISOString();
  }
}
