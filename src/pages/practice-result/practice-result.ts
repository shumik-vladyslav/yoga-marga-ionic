import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
  practice;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams) {
      this.practice = {...this.navParams.get("practice")};
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PracticeResultPage');
  }

  // presentPrompt() {
  //   const inputsArr = [];
  //   if (this.practice.isAmountCounter) {
  //     inputsArr.push({
  //       name: "amountCounter",
  //       placeholder: "Колличесство"
  //     });
  //   }

  //   if (this.practice.isMaxAchievement) {
  //     inputsArr.push({
  //       name: "maxAchievement",
  //       placeholder: "Максимальное достижение"
  //     });
  //   }

  //   let alert = this.alertCtrl.create({
  //     title: "Практика закончена",
  //     inputs: inputsArr,
  //     buttons: [
  //       {
  //         text: "Сохранить результат",
  //         handler: data => {
  //           console.log(data);
  //           this.savesettingsult(data);
  //         }
  //       }
  //     ]
  //   });
  //   this.gong.play();
  //   alert.present();
  // }

  // save() {
  //   const settings = this.practice.settings;

  //   if (data) {
  //     if (data.amountCounter) {
  //       settings.amountCounter =
  //         (+settings.amountCounter || 0) + +data.amountCounter;
  //     }

  //     if (data.maxAchievement) {
  //       if (!settings.maxAchievement) {
  //         settings.maxAchievement = data.maxAchievement;
  //       } else {
  //         settings.maxAchievement =
  //           settings.maxAchievement < data.maxAchievement
  //             ? +data.maxAchievement
  //             : settings.maxAchievement;
  //       }
  //     }
  //   }

  //   settings.timespan = (settings.timespan || 0) + (Date.now() - this.startTime);

  //   await this.savePracticeSettings(settings);
  // }
}
