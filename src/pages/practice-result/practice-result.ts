import { ToastHelper } from './../../utils/toals-helper';
import { Practice } from './../../models/practice';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the PracticeResultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-practice-result',
  templateUrl: 'practice-result.html',
})
export class PracticeResultPage {
  practice: Practice;
  amountCounter = 0;
  maxAchievement = 0;
  savingState = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastHelper: ToastHelper) {
    this.practice = { ...this.navParams.get("practice") };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PracticeResultPage');
  }

  async onSave() {
    // calculate amount counter
    if (this.practice.isAmountCounter) {
      if (this.practice.settings.amountCounter) {
        this.practice.settings.amountCounter = +this.practice.settings.amountCounter + +this.amountCounter;
      } else {
        this.practice.settings.amountCounter = +this.amountCounter;
      }
    }
    
    // calculate max achivement
    if (this.practice.isMaxAchievement) {
      this.practice.settings.maxAchievement = this.maxAchievement > this.practice.settings.maxAchievement ?
      this.maxAchievement : this.practice.settings.maxAchievement;
    }
    this.savingState = true;
    await  UserProvider.updateUserPracticeSettings(this.practice.id, this.practice.settings);
    await this.toastHelper.presentTopMess('Сохранено');
    this.savingState = false;
    // await this.navCtrl.popTo();
    this.navCtrl.pop().then(() => this.navCtrl.pop());
  }

}
