import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CreateComplexPage } from '../create-complex/create-complex';
import { MyComplexsPage } from '../my-complexs/my-complexs';

/**
 * Generated class for the ComplexsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-complexs',
  templateUrl: 'complexs.html',
})

export class ComplexsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  goCreateComplexPage() {
    this.navCtrl.setRoot(CreateComplexPage);
  }

  goToMyComplex() {
    this.navCtrl.setRoot(MyComplexsPage);
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad ComplexsPage');
  }

}
