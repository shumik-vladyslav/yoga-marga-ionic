import { FileCacheProvider } from './../../providers/file-cache/file-cache';
import { interval } from 'rxjs';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthProvider } from '../../providers/auth/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { HomePage } from '../home/home';
import { UserProvider } from '../../providers/user/user';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File, IWriteOptions } from "@ionic-native/file";
import { ImgCacheService } from '../../directives/ng-imgcache/img-cache.service';
import { take } from 'rxjs/operators';
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
    private document: DocumentViewer,
    private file: File, 
    private transfer: FileTransfer, 
    private platform: Platform,
    private imgCahce: ImgCacheService
  ) {
    this.startTime = Date.now();
    this.practice = {};
    Object.assign(this.practice, this.navParams.get("practice"));

    console.log('Practice', this.practice);
    this.nextExercise();
  }

  opentText() {
    if (this.practice.text) {
      this.fetchTextFileUriFromCache().then(uri =>
        this.document.viewDocument(
          uri,
          "application/pdf",
          {},
          null,
          null,
          err => this.openPdfErrorHandler(err),
          err => this.openPdfErrorHandler(err)
        )
      );
    }
  }

  openPdfErrorHandler(err) {
    console.log("error", JSON.stringify(err));
    localStorage.removeItem("text_" + this.practice.text);
  } 

  fetchTextFileUriFromCache(): Promise<any> {
    return new Promise((resolve, reject) => {
      const fileUri = localStorage.getItem("text_" + this.practice.text);
      if (fileUri) {
        console.log("Use cached text file");
        return resolve(fileUri);
      }
      let path = this.file.dataDirectory;
      const transfer = this.transfer.create();
      transfer
        .download(this.practice.text, path + this.practice.id + ".pdf")
        .then(entry => {
          let url = entry.toURL();
          console.log("Cache text file"); 
          localStorage.setItem("text_" + this.practice.text, url);
          return resolve(url);
        });
    });
  }
 
  audioState = false;
  exerciseAudio;
  onToggleAudio() {
    this.exercise = this.practice.exercises[this.exerciseCounter];
    
    if (this.exercise.audio && this.exerciseAudio)  {
      
      if (!this.audioState) {
        console.log("audio play");
        this.exerciseAudio.play();
        this.audioState = true;
      } else {
        console.log("audio pause");
        this.exerciseAudio.pause();
        this.audioState = false;
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
    
    if (this.exerciseAudio) {
      this.exerciseAudio.pause();
    }
    
    if (this.exercise.audio) {
      this.exerciseAudio = new Audio(this.exercise.audio);
      if (this.audioState) {
        this.exerciseAudio.play();
      }
    }
    

    if(this.practice[`ex_img${this.exerciseCounter}`]) {
      this.url = this.practice[`ex_img${this.exerciseCounter}`]
    } else if (this.exercise.hasImg) {
      this.fileCashe.getUrl(`practices/${this.practice.id}/${this.exerciseCounter}.jpg`).subscribe(
        url => {
          this.url = url;
          console.log(`practices/${this.practice.id}/${this.exerciseCounter}.jpg`, url);
          
        },
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
    
    this.timer = new Date(Math.round(this.exercise.timespan * 60000));
    console.log(this.timer);

    // for decrise practicaTime counter
    const subs2 = interval(1000).pipe(take(Math.round(this.exercise.timespan * 60))).subscribe(val => {
      console.log("subs2", val);
      this.timer -= 1000;
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
    
    if (this.practice.audio) {
      this.practice.audio.pause();
    }

    if (this.exerciseAudio) {
      this.exerciseAudio.pause();
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
    console.log('Save pract ex res', practiceRes);

    if (data) {
      if (data.amountCounter) {
        practiceRes.amountCounter = (+practiceRes.amountCounter || 0) + (+data.amountCounter);
      }

      if (data.maxAchievement) {
        practiceRes.maxAchievement = (practiceRes.maxAchievement < data.maxAchievement) ? +data.maxAchievement : practiceRes.maxAchievement;
      }
    }
    // Math.round(
    this.timespan = (Date.now() - this.startTime) / 1000 / 60;
    practiceRes.timespan = (+practiceRes.timespan || 0) + this.timespan;

    const tmp = {};
    tmp[`practices.${this.practice.id}`] = practiceRes;

    this.afs.doc(`users/${this.authP.getUserId()}`)
      .update(tmp)
      .then(res => console.log('res', res))
      .catch(err => console.log('err', err))

    this.navCtrl.pop();
  }
}
