import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MorningPracticePage } from '../morning-practice/morning-practice';
import { EveningPracticePage } from '../evening-practice/evening-practice';
import { MeditativePracticesPage } from '../meditative-practices/meditative-practices';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  goMorningPracticePage(){
    this.navCtrl.setRoot(MorningPracticePage);
  }
  
  goEveningPracticePage(){
    this.navCtrl.setRoot(EveningPracticePage);
  }

  goMeditativePracticesPage(){
    this.navCtrl.setRoot(MeditativePracticesPage);
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad AllPracticesPage');
  }

}
