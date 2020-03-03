import { PracticePerformancePage } from './../practice-performance/practice-performance';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { BmPage } from '../bm/bm';
import { MyComplexsPage } from '../my-complexs/my-complexs';

/**
 * Generated class for the PracticesListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-practices-list',
  templateUrl: 'practices-list.html',
})
export class PracticesListPage {
  
  practices=[];
  title;
  ionViewCanEnter() {
    return UserProvider.user?true:false;
  }
  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams) {
      this.practices = this.navParams.get('practices');
      this.title = this.navParams.get('title');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PracticesListPage');
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
