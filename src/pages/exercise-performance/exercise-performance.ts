import { interval } from 'rxjs';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthProvider } from '../../providers/auth/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { HomePage } from '../home/home';

/**
 * Generated class for the ExercisePerformancePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-exercise-performance',
  templateUrl: 'exercise-performance.html',
})
export class ExercisePerformancePage {
  timer;
  practice;
  url;
  exerciseName;
  exerciseCounter = 0;
  exercise;
  subscriptions = [];
  
  startTime = 0;

  // Время выполнения практики
  timespan = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afs: AngularFirestore,
    private authP: AuthProvider,
    private afStorage: AngularFireStorage
  ) {
    this.startTime = Date.now();

    this.practice = this.navParams.get('practice');
    console.log(this.practice);

    this.nextExercise();
  }

  ionViewWillUnload() {
    for (const val of this.subscriptions) {
      val.unsubscribe();
    }
  }

  nextExercise() {
    if (this.exerciseCounter >= this.practice.exercises.length) {
      // todo save results;
      // todo goto start page
      // this.navCtrl.pop();
      return this.savePracticeResultAndExit();
    }


    // get exercise
    this.exercise = this.practice.exercises[this.exerciseCounter];

    this.getImgUrls(this.exercise.imgsIds).then(
      res => this.rotateExerciseImages()
    );

    if (this.practice.userSpec &&
      this.practice.userSpec.exercises &&
      this.practice.userSpec.exercises[this.exerciseCounter] && 
      this.practice.userSpec.exercises[this.exerciseCounter].timespan) {
      this.exercise.timespan = this.practice.userSpec.exercises[this.exerciseCounter].timespan;
    } else {
      this.exercise.timespan = this.practice.timeForExercise;
    }
    this.timer = new Date(this.exercise.timespan * 60000);
        // for decrise practicaTime counter
    const subs2 = interval(1000).subscribe(val => {
      console.log("subs2", val);
      this.timer -= 1000;
      if(this.timer <= 0) {
        subs2.unsubscribe();
      }
    });
    console.log('exercise timespan', this.exercise.timespan);
    
    const subs = interval(this.exercise.timespan * 60 * 1000).subscribe(
      val => {
        subs.unsubscribe();
        this.nextExercise();
      }
    )
    this.subscriptions.push(subs);
    this.subscriptions.push(subs2);
    this.exerciseCounter++;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExercisePerformancePage');
  }

  ionViewWillLeave() {
    console.log('Ecercise performance ionViewWillLeave');
    for (const val of this.subscriptions) {
      val.unsubscribe();
    }
  }

  rotateExerciseImages() {
    if (!this.exercise.imgsIds && this.exercise.imgsIds.length>0) return;
    if (this.exercise.imgsIds.length == 1) {
      this.url = this.exercise.imgsUrls[0];
      return;
    } else {
      this.url = this.exercise.imgsUrls[0];
      return;
    }

    // let showImgCounter = 0;
    // const showImgTime = this.exercise.timespan / this.exercise.imgsIds.length * 60 * 1000;
    // const sub = interval(showImgTime).subscribe( 
    //   val => {
    //     console.log('show img interval', val);
    //     this.url = this.exercise.imgsUrls[showImgCounter];
    //     showImgCounter++;
    //     if (showImgCounter >= this.exercise.imgsIds.length) {
    //       sub.unsubscribe;
    //     }
    //   }
    // )
    // this.subscriptions.push(sub);
  }

  async getImgUrls(ids) {
    if (!ids) return;
    this.exercise.imgsUrls = [];
    for (const id of this.exercise.imgsIds) {
      try {
        const url = await this.afStorage.ref(`practices/${this.practice.id}/${id}.jpg`).getDownloadURL().toPromise();
        this.exercise.imgsUrls.push(url);
      } catch (err) {
        console.log(err);
      }
    }

  }

  back() {

  }

  skip() {

  }

  saveTimeForExercise() {
    const path = `exercises.${this.exerciseCounter}.timespan`;
    const tmp = {};
    tmp[path] = +this.exercise.timespan;

    this.afs.doc(`users/${this.authP.getUserId()}/practices/${this.practice.id}/`)
      .update(tmp)
      .then(res => console.log('res', res))
      .catch(err => console.log('err', err))
  }

  async savePracticeResultAndExit(data = null) {
    let practiceRes = this.practice.userSpec;
    console.log('practiceRes', practiceRes);

    if (data) {
      if (data.amountCounter) {
        practiceRes.amountCounter = (+practiceRes.amountCounter || 0) + (+data.amountCounter);
      }

      if (data.maxAchievement) {
        practiceRes.maxAchievement = (practiceRes.maxAchievement < data.maxAchievement) ? +data.maxAchievement : practiceRes.maxAchievement;
      }
    }

    practiceRes.timespan = (+practiceRes.timespan || 0) + this.timespan;

    const tmp = {};
    tmp[`practices.${this.practice.id}`] = practiceRes;

    this.afs.doc(`users/${this.authP.getUserId()}`)
      .update(tmp)
      .then(res => console.log('res', res))
      .catch(err => console.log('err', err))

    // this.navCtrl.pop();
    this.navCtrl.setRoot(HomePage);
  }
}
