import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, 
    public navParams: NavParams) {
      this.practices = this.navParams.get('practices');
      this.title = this.navParams.get('title');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PracticesListPage');
  }

}
