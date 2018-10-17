import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AllPracticesPage } from '../all-practices/all-practices';
import { PrivateOfficePage } from '../private-office/private-office';
import { ComplexsPage } from '../complexs/complexs';
import { Template_3Page } from '../template-3/template-3';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UserProvider } from '../../providers/user/user';
import { MyComplexsPage } from '../my-complexs/my-complexs';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  complexes;
  practices$: Observable<any>;

  achivements;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private afs: AngularFirestore,
    private userP: UserProvider
    ) {
      this.practices$ = this.afs.collection('practices').valueChanges();
      this.achivements = UserProvider.getUserGoals().filter(a => a.achivement > 0).slice(0,3);
      console.log(this.achivements);
      this.complexes = UserProvider.getComplexes();
  }
  
  onClickPractice(practice) {
    console.log('click practice', practice);
    
  }

  goAllPracticesPage(){
    this.navCtrl.push(AllPracticesPage);
  }

  goToComplexsPage(){
    this.navCtrl.setRoot(ComplexsPage);
  }

  goToPrivateOffice(){
    this.navCtrl.setRoot(PrivateOfficePage);
  }

  goToAsana2(){
    this.navCtrl.setRoot(Template_3Page);
  }
 
  goToMyComplex(complex) {
    this.navCtrl.push(MyComplexsPage, {complex: complex});
  }
}
