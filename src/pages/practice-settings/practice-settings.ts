import { ToastHelper } from './../../utils/toals-helper';
import { PracticeSettings } from './../../models/practice-settings';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment';
import { UserProvider } from '../../providers/user/user';
import { MetronomeComponent } from '../../components/metronome/metronome';
import { ToastController } from '@ionic/angular';

@IonicPage()
@Component({
  selector: 'page-practice-settings',
  templateUrl: 'practice-settings.html',
})
export class PracticeSettingsPage {
  @ViewChild(MetronomeComponent)  metronome: MetronomeComponent;
  exerciseDuration;
  practiceDuration;
  reminderDuration;

  settings: PracticeSettings;

  practice = {
    id: '',
    exercises: [],
    hasMetronome: false,
    hasMaxAchevement: false,
    hasAmountCounter: false,
    settings: this.settings
  };

  onChangeIntervals(event) {
    console.log(event);
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastHelper: ToastHelper
  ) {
    this.practice = {...this.navParams.get("practice")};
    console.log('practice settings ', this.practice);
    if (!this.practice.settings) {
      this.settings = PracticeSettings.createInstance();
    } else {
      this.settings = this.practice.settings;
    }
    this.reminderDuration = moment.utc(this.settings.reminderDuration).format('HH:mm:ss');
    this.practiceDuration = moment.utc(this.settings.practiceDuration).format('HH:mm:ss');
    this.onPracticeTimeChange(this.practiceDuration);
    // this.exerciseDuration = moment.utc(this.settings.exerciseDuration).format('HH:mm:ss');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PracticeSettingsPage');
  }

  onRemainderChange (time = null) {
  }

  onTimeForExerciseChange(time = null) {
    if (!time) return;
    if (!this.practice.exercises || this.practice.exercises.length == 0) return;

    const milli = moment.duration(time).asMilliseconds()
    const tmp = (milli || 0) * this.practice.exercises.length;
    this.settings.practiceDuration = tmp;

    // this.saveTimings(milli, tmp);
    this.practiceDuration = moment.utc(tmp).format('HH:mm:ss');
  }

  onPracticeTimeChange(time = null) {
    if (!time) return;
    const milli = moment.duration(time).asMilliseconds();
    this.settings.practiceDuration = milli;

    if (!this.practice.exercises || this.practice.exercises.length == 0) {
      // this.saveTimings(null, milli);
      return;
    }

    let tmp = (milli || 0) / this.practice.exercises.length;
    tmp = Math.round(tmp);
    this.exerciseDuration = moment.utc(tmp).format('HH:mm:ss');
    // this.saveTimings(tmp, milli);
  }

  // Practica time, exercises durations
  // saveTimings(exerciseDuration, practiceDuaration) {
  //   let patch = {};
  //   if (!exerciseDuration && practiceDuaration) {
  //     patch[`practices.${this.practice.id}.practiceDuaration`] = practiceDuaration;

  //     UserProvider.updateUser(patch)
  //       .then(res => console.log("res", res))
  //       .catch(err => console.log("err", err));
  //     return;
  //   };

  //   const exCount = this.practice.exercises.length;
  //   let tmpArr = new Array(exCount);
  //   tmpArr = tmpArr.fill(exerciseDuration);

  //   patch[`practices.${this.practice.id}.exercises`] = tmpArr
  //   patch[`practices.${this.practice.id}.praktikaTime`] = patch;
  //   this.settings.exercises = tmpArr;
  //   // this.settings = patch;

  //   UserProvider.updateUser(patch)
  //     .then(res => console.log("res", res))
  //     .catch(err => console.log("err", err));
  // }

  onChangeSolo() {
    if (this.settings.singleReminder) {
      this.settings.multiReminder = false;
    }
  }

  onChangeMulti() {
    if (this.settings.multiReminder) {
      this.settings.singleReminder = false;
    }
  }

  async onSave() {
    console.log('on save', this.practice.id);
    const patch = {practices: {}};
    patch.practices[this.practice.id] = this.settings;
    await UserProvider.updateUser(patch);
    await this.toastHelper.presentTopMess('Сохранено');
    await this.navCtrl.pop();
  }

}
