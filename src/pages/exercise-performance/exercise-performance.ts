import { FileCacheProvider } from './../../providers/file-cache/file-cache';
import { interval } from 'rxjs';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthProvider } from '../../providers/auth/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { HomePage } from '../home/home';
import { UserProvider } from '../../providers/user/user';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';

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
    private afStorage: AngularFireStorage,
    private fileCashe: FileCacheProvider,
    private fileCacheP: FileCacheProvider,
    private document: DocumentViewer
  ) {
    this.startTime = Date.now();
    this.practice = this.navParams.get('practice');
    this.nextExercise();

    this.fileCacheP.getUrl(`practices/${this.practice.id}/text.pdf`).subscribe(
      url => this.practice.text = url,
      err => {
        console.log('text err',JSON.stringify(err));
        this.url = null;
      }
    )

    this.fileCacheP.getUrl(`practices/${this.practice.id}/audio`).subscribe(
      url => this.practice.audio = new Audio(url),
      err => {
        console.log('text err',JSON.stringify(err));
        this.url = null;
      }
    )
  }

  opentText () {

    if(this.practice.text) {
      const options: DocumentViewerOptions = {
        title: 'Описание практики'
      }
      this.document.viewDocument(this.practice.text, 'application/pdf', options)
    } 
    
  }

 
  audioState = false;
  onToggleAudio() {
    if (this.practice.audio) {
      if (this.audioState) {
        this.practice.audio.play()
      } else {
        this.practice.audio.pause()
      }
      
    }
  }

  ionViewWillUnload() {
    for (const val of this.subscriptions) {
      val.unsubscribe();
    }
  }

  nextExercise() {
    if (this.exerciseCounter >= this.practice.exercises.length) {
      return this.savePracticeResultAndExit();
    }


    // get exercise
    this.exercise = this.practice.exercises[this.exerciseCounter];

    if (this.exercise.hasImg) {
      this.fileCashe.getUrl(`practices/${this.practice.id}/${this.exerciseCounter}.jpg`).subscribe(
        url => this.url = url,
        err => console.log(err)
      )
    } else {
      this.url = null;
    }
    

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

    const subs = interval(this.exercise.timespan * 60 * 1000).subscribe(
      val => {
        subs.unsubscribe();
        this.nextExercise();
        new Audio('assets/sound/gong.mp3').play();
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

  back() {

  }

  skip() {

  }

  ionViewCanEnter() {
    return UserProvider.user?true:false;
  }
  
  saveTimeForExercise() {
    console.log('set time for pract');
    
    // this.practice.userSpec.exercises
    // const path = `exercises;

    let tmpArr = new Array(this.practice.exercises.length);
    tmpArr= tmpArr.fill(+this.exercise.timespan);
    const tmp = {
      exercises: this.practice.userSpec.exercises || tmpArr
    };
    tmp.exercises[this.exerciseCounter] = (tmp.exercises[this.exerciseCounter] || 0)+ +this.exercise.timespan;

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

    this.navCtrl.pop();
    // this.navCtrl.setRoot(HomePage);
  }
}
