import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Template_4Page } from '../template-4/template-4';

/**
 * Generated class for the Template_3Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-template-3',
  templateUrl: 'template-3.html',
})

export class Template_3Page {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  goToTemplate4(){
    this.navCtrl.setRoot(Template_4Page);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Template_3Page');
  }

}
