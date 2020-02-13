import { UtilsFuncs } from './../../utils/utils-funcs';
import { ExercisesHelper } from './../../utils/exercises-helper';
import { ToastHelper } from './../../utils/toals-helper';
import { PracticeSettings } from './../../models/practice-settings';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment';
import { UserProvider } from '../../providers/user/user';
import { MetronomeComponent } from '../../components/metronome/metronome';
import { Practice } from '../../models/practice';

@IonicPage()
@Component({
  selector: 'page-practice-settings',
  templateUrl: 'practice-settings.html',
})
export class PracticeSettingsPage {
  @ViewChild(MetronomeComponent) metronome: MetronomeComponent;
  exerciseDuration;
  practiceDuration;
  reminderInterval;

  settings: PracticeSettings;
  practice: Practice;
  exercisesHelper: ExercisesHelper;
  savingState = false;
  onChangeIntervals(event) {
    console.log(event);
  }

  transformTime(value, direction) {
    if (!value) return;
    // milliseconds time to string HH:mm:ss
    if (direction === 'T->S') {
      return moment.utc(value).format('HH:mm:ss');
    }
    // string HH:mm:ss to milliseconds
    return moment.duration(value).asMilliseconds();
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastHelper: ToastHelper
  ) {
    this.practice = UtilsFuncs.deepCopy(this.navParams.get("practice"));
    if (!this.practice.settings) {
      this.settings = PracticeSettings.createInstance();
    } else {
      this.settings = this.practice.settings;
    }
    this.exercisesHelper = new ExercisesHelper(this.practice);

    this.reminderInterval = this.transformTime(this.settings.reminderInterval, 'T->S');

    if (this.exercisesHelper.hasExercises()) {
      this.settings.exercises = UtilsFuncs.deepCopy(this.exercisesHelper.exercises);

      const exDur = this.exercisesHelper.calculateExerciseDurations()*1000;
      this.practiceDuration = this.transformTime(this.exercisesHelper.calculatePracticeDuration()*1000, 'T->S');
      this.exerciseDuration = this.transformTime(exDur, 'T->S');
      if (!this.settings.exercises[0].exerciseDuration) {
        for (let e of this.settings.exercises) {
          e.exerciseDuration = exDur;
        }
      }
    } else {
      this.practiceDuration = this.transformTime(this.settings.practiceDuration, 'T->S');
    }
  }

  setExDurationsByDefault () {
    this.settings.exercises = UtilsFuncs.deepCopy(this.practice.exercises);

    const exercises = this.settings.exercises;
    let summ = 0;
    for (let e of exercises) {
        if (e.exerciseDuration) {
            summ += +e.exerciseDuration;
        }
    }

    this.practiceDuration = this.transformTime(summ, 'T->S');
    this.exerciseDuration = this.transformTime(Math.floor(summ/exercises.length), 'T->S');
  }

  /**
   * Выставление времени в боксах и в списке
   * проблема все отрезки времени хранятся в милиссекундах на интерфейсе они могут отображаться 
   * в минутах или в формате строки. При изменении нужно производить преобразование в обе стороны.
   * 
   * Вторая проблема. Если в практике имеются упражнения. То алгоритм просчета усложняется.
   */
  ionViewDidLoad() {
    console.log('ionViewDidLoad PracticeSettingsPage');
  }

  onRemainderItervalChange(time = null) {
    if (!time) return;
    const milli = moment.duration(time).asMilliseconds();
    this.settings.reminderInterval = milli;
  }

  onTimeForExerciseChange (time = null) {
    if (!time) return;
    if (!this.practice.exercises || this.practice.exercises.length == 0) return;

    const milli = moment.duration(time).asMilliseconds()
    const tmp = (milli || 0) * this.practice.exercises.length;
    this.settings.practiceDuration = tmp;

    // this.saveTimings(milli, tmp);
    this.practiceDuration = moment.utc(tmp).format('HH:mm:ss');

    for (let e of this.settings.exercises) {
      e.exerciseDuration = milli;
    }
  }

  onPracticeTimeChange (time = null) {
    if (!time) return;
    const milli = moment.duration(time).asMilliseconds();
    this.settings.practiceDuration = milli;

    if (!this.practice.exercises || this.practice.exercises.length == 0) {
      return;
    }

    let tmp = (milli || 0) / this.practice.exercises.length;
    tmp = Math.round(tmp);
    this.exerciseDuration = moment.utc(tmp).format('HH:mm:ss');

    // todo fille exercises durations
    if (!this.settings.exercises) return;
    for (let e of this.settings.exercises) {
      e.exerciseDuration = tmp;
    }
  }

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
    // console.log('on save', this.settings);
    // const patch = { practices: this.settings };
    // patch.practices[this.practice.id] = this.settings;
    // await UserProvider.updateUser(patch);
    this.savingState = true;
    await  UserProvider.updateUserPracticeSettings(this.practice.id,this.settings);
    await this.toastHelper.presentTopMess('Сохранено');
    this.savingState = false;
    await this.navCtrl.pop();
  }
}
