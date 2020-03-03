import { UserProvider } from './../../providers/user/user';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SlicePipe } from '@angular/common';
import { groupBy } from 'rxjs/internal/operators/groupBy';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { PracticesListPage } from '../practices-list/practices-list';
import { BmPage } from '../bm/bm';
import { MyComplexsPage } from '../my-complexs/my-complexs';
import { PracticePerformancePage } from '../practice-performance/practice-performance';

/**
 * Generated class for the AllPracticesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-all-practices',
  templateUrl: 'all-practices.html',
})

export class AllPracticesPage {

  subscriptions = [];
  practices;
  groupingPractices;

  ionViewCanEnter() {
    return UserProvider.user?true:false;
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afs: AngularFirestore,
  ) {
    const subs = this.afs.collection('practices').valueChanges().subscribe(
      practices => {
        const ps = UserProvider.getGlobalPractices();
        const res = [];
        for (const key in ps) {
          if (ps.hasOwnProperty(key)) {
            const p = ps[key];
            res.push(p);
          }
        }
        this.practices = res;
        this.groupPracticesBy();
      },
      err => console.log(err)
    )

    this.subscriptions.push(subs);
  }
  onMorePractices(practices, title) {
    
    this.navCtrl.push(PracticesListPage, {practices: practices, title: title});
    
  }
  /**
   * Util function for array grouping
   * @param xs source array
   * @param key key by grouping
   */
  groupBy(xs, key) {
    const resObj = xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
    
    const resArr = [];
    for (const key in resObj) {
      if (resObj.hasOwnProperty(key)) {
        const val = resObj[key];
        resArr.push([key, val]);
      }
    }

    return resArr;
  };

  // return object
  // groupBy(xs, key) {
  //   return xs.reduce(function(rv, x) {
  //     (rv[x[key]] = rv[x[key]] || []).push(x);
  //     return rv;
  //   }, {});
  // };

  groupPracticesBy(groupingBy = 'type') {
    if (!this.practices || this.practices.length == 0) return;

    this.groupingPractices = this.groupBy(this.practices, groupingBy);
  }

  switchGrouping(groupingBy = 'type') {
    console.log('switch type', groupingBy);
    this.groupPracticesBy(groupingBy);
    console.log('groupingPractices', this.groupingPractices);
    
  }

  goToPracticesListPage(practices) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AllPracticesPage');
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
}
