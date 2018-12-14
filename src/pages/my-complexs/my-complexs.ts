import { PracticePerformancePage } from './../practice-performance/practice-performance';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AllPracticesPage } from '../all-practices/all-practices';
import { UserProvider } from '../../providers/user/user';

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
  
  goAllPracticesPage(){
    this.navCtrl.setRoot(AllPracticesPage);
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad MyComplexsPage');
  }

  switchState() {
    this.isStarted = !this.isStarted;
    if (this.isStarted) {
      this.navCtrl.push(PracticePerformancePage,{practice: this.practices[this.practiceCounter]});
    }
  }

  ionViewWillEnter() {
    if (this.isStarted) {
      this.practiceCounter++;
      if ( this.practiceCounter >= this.practices.length) {
        return this.navCtrl.pop();
      }
      this.navCtrl.push(PracticePerformancePage,{practice: this.practices[this.practiceCounter]});
    }
  }
}
