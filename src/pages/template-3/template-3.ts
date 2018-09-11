import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Template_4Page } from '../template-4/template-4';
import { SettingsProvider } from '../../providers/shared-services-settings/shared-services-settings';

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
  fullTime = 0;
  eachTime = 0;
  pomniTime = 0;
  soloPomniFlag = false;
  multiPomniFlag = false;

  data = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private settingsProvider: SettingsProvider) {
      this.data = this.settingsProvider.getData();
  }

  goToTemplate4(){
    console.log();
    this.settingsProvider.setSettings({
      fullTime: this.fullTime,
      eachTime: this.eachTime,
      pomniTime: this.pomniTime,
      soloPomniFlag: this.soloPomniFlag,
      multiPomniFlag: this.multiPomniFlag

    });
    this.navCtrl.setRoot(Template_4Page);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Template_3Page');
  }

}
