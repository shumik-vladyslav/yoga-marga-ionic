// import { filter } from 'rxjs/operators';
import { PracticePerformancePage } from './../practice-performance/practice-performance';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AllPracticesPage } from '../all-practices/all-practices';
import { UserProvider } from '../../providers/user/user';
import { BmPage } from '../bm/bm';

/**
 * Generated class for the MyComplexsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-my-complexs',
  templateUrl: 'my-complexs.html',
})

export class MyComplexsPage {
  practices;
  complex;

  isStarted = false;
  practiceCounter = 0;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public userP: UserProvider) {
    this.complex = navParams.get('complex');
    const gp = UserProvider.globalPractices || [];

    this.practices = []
    for (const val of this.complex.practices) {
      this.practices.push(gp[val]);
    }
  }

  goAllPracticesPage() {
    this.navCtrl.setRoot(AllPracticesPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyComplexsPage');
  }

  switchState() {
    this.isStarted = !this.isStarted;
    if (this.isStarted) {
      this.navCtrl.push(PracticePerformancePage, { practice: this.practices[this.practiceCounter] });
    }
  }

  ionViewWillEnter() { 
    if (this.isStarted) {
      this.practiceCounter++;
      if (this.practiceCounter >= this.practices.length) {
        return this.navCtrl.pop();
      }
      this.onPractice(this.practices[this.practiceCounter]);
      // this.navCtrl.push(PracticePerformancePage, { practice: this.practices[this.practiceCounter] });
    }
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

  onDelete() {
    console.log('on delete');
    const com = UserProvider.getComplexes();
    UserProvider.updateUser({ complexes: com.filter(c => this.complex.name != c.name) }).then(
      () => this.navCtrl.pop()
    )
  }
}
