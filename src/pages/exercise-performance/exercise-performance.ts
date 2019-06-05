import { FileCacheProvider } from "./../../providers/file-cache/file-cache";
import { interval, timer } from "rxjs";
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Platform, LoadingController } from "ionic-angular";
import { AuthProvider } from "../../providers/auth/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { UserProvider } from "../../providers/user/user";
import {DocumentViewer} from "@ionic-native/document-viewer";
import { FileTransfer } from "@ionic-native/file-transfer";
import { File } from "@ionic-native/file";
import { take } from "rxjs/operators";
import { Insomnia } from "@ionic-native/insomnia";
import * as moment from 'moment';

/**
 * Generated class for the ExercisePerformancePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-exercise-performance",
  templateUrl: "exercise-performance.html"
})
export class ExercisePerformancePage {
  exDuration;
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
  totalTime = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afs: AngularFirestore,
    private authP: AuthProvider,
    private document: DocumentViewer,
    private file: File,
    private transfer: FileTransfer,
    private insomnia: Insomnia,
    public loadingController: LoadingController
  ) {
    this.insomnia
      .keepAwake()
      .then(
        () => console.log("insomnia success"),
        () => console.log("insomnia error")
      );

    this.startTime = Date.now();
    this.practice = {};
    Object.assign(this.practice, this.navParams.get("practice"));

    console.log("Practice", this.practice);

    if (
      this.practice.userSpec &&
      this.practice.userSpec.exercises
    ) {
      this.totalTime = this.practice.userSpec.exercises.reduce((a, i) => a + +i, 0);
    } else {

      this.totalTime = Math.trunc(this.practice.timeForExercise / 1000) * this.practice.exercises.length * 1000
    }

    this.nextExercise();
  }

  presentLoading() {
    const loading = this.loadingController.create({
      duration: 3000
    });
    loading.present().then();
    return loading;
  }

  opentText() {
    if (this.practice.text) {
      const loading = this.presentLoading();
      this.fetchTextFileUriFromCache().then(uri =>
        {
          loading.dismiss().then();
          this.document.viewDocument(
            uri,
            "application/pdf",
            {},
            null,
            null,
            err => this.openPdfErrorHandler(err),
            err => this.openPdfErrorHandler(err)
          )
        }
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
    console.log('~~~toggle audio ',this.exerciseCounter);

    if (this.exercise.audio && this.exerciseAudio) {
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
    this.subscriptions = [];
  }

  nextExercise() {
    if (this.timer) {
      this.totalTime = this.totalTime - this.timer * 1000;
    }
    
    this.ionViewWillUnload();
    console.log('~~~next exercise ',this.exerciseCounter);
    if (this.exerciseCounter >= this.practice.exercises.length) {
      return this.savePracticeResultAndExit();
    }

    // get exercise
    this.exercise = this.practice.exercises[this.exerciseCounter];
    console.log('exercise', this.exercise);

    if (this.exerciseAudio) {
      this.exerciseAudio.pause();
    }

    // hide img
    this.url = null;

    if (this.exercise.audio) {
      this.exerciseAudio = new Audio(this.exercise.audio);
      if (this.audioState) {
        this.exerciseAudio.play();
      }
    }

    if (this.exercise.hasImg || this.exercise.image) {
      this.url = this.exercise.image
    } else if (this.practice[`ex_img${this.exerciseCounter}`]) {
      this.url = this.practice[`ex_img${this.exerciseCounter}`];
    } else {
      this.url = null;
    }

    if (
      this.practice.userSpec &&
      this.practice.userSpec.exercises &&
      this.practice.userSpec.exercises[this.exerciseCounter]
    ) {
      this.exercise.timespan = this.practice.userSpec.exercises[
        this.exerciseCounter
      ]
    } else {
      this.exercise.timespan = 60000;
    }
    this.exDuration = moment.utc(this.exercise.timespan).format('HH:mm:ss');
    // this.exercise.timespan = 10000;
    console.log('timespan', this.practice.timeForExercise);

    this.timer = Math.trunc(this.exercise.timespan/1000)
    // debugger
    console.log(this.timer);
    
    this.isPause = true;
    this.startStopExTimer();
    // for decrise practicaTime counter
    // debugger
    // const subs2 = interval(1000)
    //   .pipe(take(Math.round(this.exercise.timespan/1000)))
    //   .subscribe(val => {
    //     console.log("subs2", val, this.timer);
    //     this.timer = this.timer - 1;
    //   });

    // const subs3 = timer(Math.round(this.exercise.timespan/1000) * 1000).subscribe(val => {
    //   this.nextExercise();
    //   new Audio("assets/sound/gong.mp3").play();
    // });

    // this.subscriptions.push(subs2);
    // this.subscriptions.push(subs3);
    this.exerciseCounter++;
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ExercisePerformancePage");
  }

  ionViewWillLeave() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    
    console.log("Ecercise performance ionViewWillLeave");
    for (const val of this.subscriptions) {
      val.unsubscribe();
    }

    if (this.practice.audio) {
      this.practice.audio.pause();
    }

    if (this.exerciseAudio) {
      this.exerciseAudio.pause();
    }

    this.insomnia
      .allowSleepAgain()
      .then(
        () => console.log("insomnia success off ex"),
        () => console.log("insomnia erro off")
      );
  }

  back() {}

  skip() {}

  ionViewCanEnter() {
    return UserProvider.user ? true : false;
  }

  formatTomespan () {
    return moment.utc(this.timespan).format('HH:mm:ss');
  }

  saveTimeForExercise(value) {
    if(!value) return;
   let tmpDate = moment.duration(value);
    console.log("set time for pract",value,  tmpDate.asMilliseconds());

    let tmpArr = new Array(this.practice.exercises.length);
    tmpArr = tmpArr.fill(+this.exercise.timespan);

    let userUpdate = {};
    userUpdate[`practices.${this.practice.id}.exercises`] = this.practice.userSpec.exercises || tmpArr
    userUpdate[`practices.${this.practice.id}.exercises`][this.exerciseCounter - 1] = tmpDate.asMilliseconds();
    this.afs
      .doc(`users/${this.authP.getUserId()}`)
      .update(userUpdate)
      .then(res => console.log("res", res))
      .catch(err => console.log("err", err));
  }

  async savePracticeResultAndExit(data = null) {
    let practiceRes = this.practice.userSpec;
    console.log("Save pract ex res", practiceRes);

    if (data) {
      if (data.amountCounter) {
        practiceRes.amountCounter =
          (+practiceRes.amountCounter || 0) + +data.amountCounter;
      }

      if (data.maxAchievement) {
        practiceRes.maxAchievement =
          practiceRes.maxAchievement < data.maxAchievement
            ? +data.maxAchievement
            : practiceRes.maxAchievement;
      }
    }
    // Math.round(
    this.timespan = (Date.now() - this.startTime) / 1000 / 60;
    practiceRes.timespan = (+practiceRes.timespan || 0) + this.timespan;

    const tmp = {};
    tmp[`practices.${this.practice.id}`] = practiceRes;

    this.afs
      .doc(`users/${this.authP.getUserId()}`)
      .update(tmp)
      .then(res => console.log("res", res))
      .catch(err => console.log("err", err));

    this.navCtrl.pop();
  }

  swipeEvent(event) {
    console.log('swipe', event);
    this.nextExercise();
  }

  pause() {
    
  }

  isPause = true;
  subscription;
  startStopExTimer() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.isPause) {

      this.subscription = interval(1000)
      .pipe(take(Math.trunc(this.exercise.timespan/1000)))
      .subscribe(val => {
        console.log("subs2", val, this.timer);
        this.timer = this.timer - 1;
        this.totalTime = this.totalTime - 1000;

        // this.totalTime = this.practice.userSpec.praktikaTime - ( Date.now() - this.startTime);


        if (this.timer <= 0) {
          new Audio("assets/sound/gong.mp3").play();
          if (this.subscription) {
            this.subscription.unsubscribe();
          }  
          this.nextExercise();
        }

      });

      this.isPause = !this.isPause;
    } else {
      this.isPause = !this.isPause;
    }
    console.log('isPaused', this.isPause);
  }
}
