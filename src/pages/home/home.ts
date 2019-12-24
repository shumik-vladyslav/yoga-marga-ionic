import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AllPracticesPage } from '../all-practices/all-practices';
import { PrivateOfficePage } from '../private-office/private-office';
import { ComplexsPage } from '../complexs/complexs';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UserProvider } from '../../providers/user/user';
import { MyComplexsPage } from '../my-complexs/my-complexs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  complexes;
  practices$: Observable<any>;
  practices;
  ionViewCanEnter() {
    console.log('canenter user provider', UserProvider.user);
    
    return UserProvider.user?true:false;
  }
  
  progresses;
  // achivements;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private afs: AngularFirestore,
    private userP: UserProvider
    ) {
      // this.practices = UserProvider.userPractices();
      this.practices$ = this.afs.collection('practices').valueChanges().pipe(map(
        (practices:any) => {
          return practices.filter(
            p => p.active !== false && UserProvider.arraysHasIntersection(UserProvider.user.groups, p.groups))
        }
      ));
      this.complexes = UserProvider.getComplexes();
  }
  
  onClickPractice(practice) {
    console.log('click practice', practice);
  }

  goAllPracticesPage() {
    this.navCtrl.push(AllPracticesPage);
  }

  goToComplexsPage() {
    this.navCtrl.setRoot(ComplexsPage);
  }

  goToPrivateOffice() {
    this.navCtrl.setRoot(PrivateOfficePage);
  }
 
  goToMyComplex(complex) {
    this.navCtrl.push(MyComplexsPage, {complex: complex});
  }


  ionViewWillEnter() {
    const practices = UserProvider.getUserPractices();
    const globalPractices = UserProvider.globalPractices;
    const keys = Object.keys(practices);

    this.progresses = keys.map( (key:any) => {
      const p = {...practices[key], ...globalPractices[key]}
      console.log(p);
      if (!this.practiceHasGoal(p)) return null;
      return this.calculateGoal(p);
    }).filter(p => p);
    console.log(this.progresses);
  }
  
  practiceHasGoal(pr) {
    return pr.spentTimeGoal || pr.amountCounterGoal || pr.maxAchievementGoal;
  }

  calculateGoal(pr) {
    if (pr.spentTimeGoal) {
      return {
        goal: Math.floor(+pr.spentTimeGoal / 1000 / 60/ 60),
        achivement: Math.floor(+pr.spentTime / 1000 / 60/ 60),  
        val: Math.round ((pr.spentTime ? +pr.spentTime / +pr.spentTimeGoal : 0) *100 ),
        name: pr.name,
        ico: pr.ico,
      }
    } else if (pr.amountCounterGoal) {
      return {
        goal: +pr.amountCounterGoal,
        achivement: +pr.amountCounter,  
        val: Math.round ((pr.amountCounter? +pr.amountCounter / +pr.amountCounterGoal : 0) *100 ),
        name: pr.name,
        ico: pr.ico,
      }
    } else if (pr.maxAchievementGoal) {
      return {
        goal: +pr.maxAchievementGoal,
        achivement: +pr.maxAchievement,  
        val: Math.round ((pr.maxAchievement? +pr.maxAchievement / +pr.maxAchievementGoal : 0) *100 ),
        name: pr.name,
        ico: pr.ico,
      }
    } else return null;
  }
}
