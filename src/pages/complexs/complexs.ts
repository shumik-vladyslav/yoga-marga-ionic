import { UserProvider } from './../../providers/user/user';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CreateComplexPage } from '../create-complex/create-complex';
import { MyComplexsPage } from '../my-complexs/my-complexs';
import { UserInfo } from 'firebase';

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
  presets;
  complexes;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public userP: UserProvider) {
      this.complexes = UserProvider.getComplexes();
      console.log('this.complexes' ,this.complexes);
  }

  goCreateComplexPage() {
    this.navCtrl.push(CreateComplexPage);
  }

  goToMyComplex(complex) {
    this.navCtrl.push(MyComplexsPage, {complex: complex});
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad ComplexsPage');
    
  }
  
  ionViewWillEnter() {
    this.complexes = UserProvider.getComplexes();
  } 
}
