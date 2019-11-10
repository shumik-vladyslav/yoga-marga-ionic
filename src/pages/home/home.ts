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
    
    // if 
    // return false;
    return UserProvider.user?true:false;
  }
  
  progresses;
  achivements;
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

      this.achivements = UserProvider.getUserGoals().filter(a => a.achivement > 0).slice(0,3);
      console.log(this.achivements);
      this.complexes = UserProvider.getComplexes();


      const globalPractices = UserProvider.globalPractices;
      console.log('global practices', globalPractices);
      
      this.progresses = UserProvider.getUserGoals().map(a => {
        let val = Math.round(((+a.achivement) / (+a.goal)) * 100);
        if (!a.achivement || !a.goal) {
          val = 0;
        }
        return {
          val: val,
          name: a.name,
          ico: globalPractices[a.id]?globalPractices[a.id].ico:'',
          goal: a.goal,
          achivement: a.achivement?a.achivement:0
        };
      }).filter(a => +a.goal);
  
      console.log(this.progresses);
      
      this.achivements = UserProvider.getUserGoals().filter(
        a => a.achivement > 0
      );
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
}
