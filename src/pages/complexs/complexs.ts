import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CreateComplexPage } from '../create-complex/create-complex';

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
  goCreateComplexPage(){
    this.navCtrl.setRoot(CreateComplexPage);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ComplexsPage');
  }

}
