import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AllPracticesPage } from '../all-practices/all-practices';
import { PrivateOfficePage } from '../private-office/private-office';
import { ComplexsPage } from '../complexs/complexs';
import { Template_3Page } from '../template-3/template-3';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  practices$: Observable<any>;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private afs: AngularFirestore
    ) {
      this.practices$ = this.afs.collection('practices').valueChanges()
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
  
}
