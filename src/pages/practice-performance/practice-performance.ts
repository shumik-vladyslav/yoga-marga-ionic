import { PracticeSettings } from './../../models/practice-settings';
import { DocumentViewer } from "@ionic-native/document-viewer";
import { ExercisePerformancePage } from "./../exercise-performance/exercise-performance";
import { Component, ContentChild, ViewChild } from "@angular/core";
import { IonicPage, NavController, NavParams, Platform, LoadingController } from "ionic-angular";
import { interval, timer } from "rxjs";
import { AlertController } from "ionic-angular";
import { AngularFirestore, DocumentSnapshot } from "@angular/fire/firestore";
import { AuthProvider } from "../../providers/auth/auth";
import { FileTransfer } from "@ionic-native/file-transfer";
import { File } from "@ionic-native/file";
import { ImgCacheService } from "../../directives/ng-imgcache/img-cache.service";
import { Insomnia } from "@ionic-native/insomnia";
import * as moment from 'moment';
import { MetronomeComponent } from "../../components/metronome/metronome";
import { UserProvider } from '../../providers/user/user';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Practice } from '../../models/practice';
import { Metronome } from '../../utils/metronome';

@IonicPage()
@Component({
  selector: "page-practice-performance",
  templateUrl: "practice-performance.html"
})
export class PracticePerformancePage {
  // @ViewChild(MetronomeComponent) metronome: MetronomeComponent;
  metronome: Metronome;
  public StateEnum = { Inited: 0, Started: 1, Paused: 2 };
  state = this.StateEnum.Inited;

  practice: Practice;
  url;

  remaiderSound = new Audio("assets/sound/pomni.mp3");
  gong = new Audio("assets/sound/gong.mp3");

  startTime = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private file: File,
    private transfer: FileTransfer,
    private imgCahce: ImgCacheService,
    private document: DocumentViewer,
    private insomnia: Insomnia,
    public loadingController: LoadingController,
    private fileOpener: FileOpener
  ) {
    this.StateEnum = { Inited: 0, Started: 1, Paused: 2 };
    this.practice = { ...this.navParams.get("practice") };

    // for mirrored exercises
    const newExercises = [];
    if (this.practice.exercises) {
      this.practice.exercises.forEach(e => {
        newExercises.push(e);
        if (e.mirror) {
          const tmp: any = {};
          Object.assign(tmp, e);
          tmp.imgMirror = true;
          newExercises.push(tmp);
        }
      });
      this.practice.exercises = newExercises;
    }

    // fetch audio file
    this.imgCahce
      .init({
        // debug:true,
        skipURIencoding: true
      })
      .then(_ => {
        if (this.practice.audio) {
          this.imgCahce.fetchFromCache(this.practice.audio).then(url => {
            this.practice.audio = new Audio(url);
            this.practice.audio.addEventListener("ended", function () { this.currentTime = 0; this.play(); }, false);
          });
        }
      });

    // fetch user settings
    const userPractices = UserProvider.getUserPractices();
    let settings = userPractices ? userPractices[this.practice.id] : null;
    if (!settings) {
      settings = PracticeSettings.createInstance();
    }
    this.practice.settings = settings;

    // init metronome
    if (settings.intervals && settings.intervals.length > 0) {
      this.metronome = Metronome.createMetronome(settings.intervals.map(i => i.value),
        'assets/sound/tik.mp3', 'assets/sound/gong.mp3');
    }

  }

  presentLoading() {
    const loading = this.loadingController.create({
      duration: 3000
    });
    loading.present().then();
    return loading;
  }

  opentText() {
    console.log('open pdf~~~');
    if (this.practice.text) {
      this.fileOpener.open(this.practice.text, 'application/pdf')
        .then(() => console.log('File is opened'))
        .catch(e => console.log('Error opening file', e));
    }

    // if (this.practice.text) {
    //   const loading = this.presentLoading();
    //   this.fetchTextFileUriFromCache().then(uri => {
    //     loading.dismiss().then();

    //     this.fileOpener.open(uri, 'application/pdf')
    //       .then(() => console.log('File is opened'))
    //       .catch(e => console.log('Error opening file', e));
    //     // this.document.viewDocument(
    //     //   uri,
    //     //   "application/pdf",
    //     //   {},
    //     //   null,
    //     //   null,
    //     //   err => this.openPdfErrorHandler(err),
    //     //   err => this.openPdfErrorHandler(err)
    //     // );
    //   }).catch(err => console.log('~~~openText', err));
    // }
  }

  fetchTextFileUriFromCache(): Promise<any> {
    return new Promise((resolve, reject) => {
      const fileUri = localStorage.getItem("text_" + this.practice.text);
      if (fileUri) {
        console.log("Use cached text file", fileUri);
        return resolve(fileUri);
      }
      let path = this.file.dataDirectory;
      const transfer = this.transfer.create();
      transfer
        .download(this.practice.text, path + this.practice.id + ".pdf")
        .then(entry => {
          console.log('~~~File downloaded');
          let url = entry.toURL();
          console.log("Cache text file[", JSON.stringify(entry), url);
          localStorage.setItem("text_" + this.practice.text, url);
          return resolve(url);
        });
    });
  }

  onToggleAudio() {
    if (this.practice.audio) {
      if (this.isMuted) {
        console.log("audio play");
        this.practice.audio.play();
        this.isMuted = false;
      } else {
        console.log("audio pause");
        this.practice.audio.pause();
        this.isMuted = true;
      }
    }
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad PracticePerformancePage");
  }

  ionViewWillLeave() {
    console.log("Practice performance ionViewWillLeave");

    if (this.practice.audio) {
      this.practice.audio.pause();
    }
    this.stopTimer();
  }

  async startPausePractice() {
  }

  exerciseIndex;
  exercises;
  exercisesCount;
  practiceDuration;

  exercise;

  nextExercise() {
    // increment index
    if (!this.exerciseIndex) {
      this.exerciseIndex = 0;
    } else {
      this.exerciseIndex++;
    }

    this.exercise = this.exercises[this.exerciseIndex];

  }

  // need for custom duration of every exercise
  calculatePracticeDuration() {
    if (!this.exercises) {
      return this.practice.settings.practiceDuration || 60 * 60 * 1000;
    }
    let summ = 0;
    for (let e of this.exercises) {
      if (e.exerciseDuration) {
        summ += +e.exerciseDuration;
      } else {
        summ += this.practice.settings.exerciseDuration ?
          +this.practice.settings.exerciseDuration :
          +this.practice.settings.practiceDuration / this.exercisesCount;
      }
    }
    console.log('calculatePracticeDuration', summ);
    return summ;
  }

  hasExercises() {
    return this.practice.exercises && this.practice.exercises.length > 0;
  }

  startPractice() {
    this.resumeAudio();
    this.screenKeepAwake();

    // go to exercises performance page

    if (this.hasExercises()) {
      // init exercises
      this.exercises = this.practice.exercises;
      this.exercisesCount = this.practice.exercises.length;
      this.exerciseIndex = 0;
      this.practiceDuration = this.calculatePracticeDuration();
      this.nextExercise();
    } else {
      this.practiceDuration = this.practice.settings.practiceDuration;
    }

    this.startTimer(100);
    this.state = this.StateEnum.Started;
  }

  pausePractice() {
    this.pauseTimer();
    this.pauseAudio();
    this.screenAllowSleep();
    this.state = this.StateEnum.Paused;
  }

  resumePractice() {
    this.resumeTimer();
    this.resumeAudio();
    this.screenKeepAwake();
    this.state = this.StateEnum.Started;
  }

  isMuted = true;
  pauseAudio() {
    if (this.practice.audio) {
      this.practice.audio.pause();
    }
  }

  resumeAudio() {
    if (this.practice.audio && !this.isMuted) {
      this.practice.audio.play()
    }
  }

  async exitPractice() {
    //stop audio
    this.pauseAudio();

    // insomnia sleep again
    this.screenAllowSleep()

    await this.savePracticeSpentTime();

    if (this.state !== this.StateEnum.Inited && (this.practice.isAmountCounter || this.practice.isMaxAchievement)) {
      this.navCtrl.push('PracticeResultPage', { practice: this.practice });
    } else {
      this.navCtrl.pop();
    }
  }

  savePracticeSettings(settings = this.practice.settings) {
    const patch = {};
    patch[`practices.${this.practice.id}`] = this.practice.settings;

    UserProvider.updateUser(patch)
      .then(res => console.log("res", res))
      .catch(err => console.log("err", err));
  }

  async savePracticeSpentTime() {
    if (!this.startTime) {
      return;
    }
    const spent = this.practiceDuration - this.countdown;
    const settings = this.practice.settings;
    settings.spentTime = (settings.spentTime || 0) + spent;
    await this.savePracticeSettings(settings);
  }

  /// timer
  countdown;
  intervalSubs;
  timerInterval;
  prevSeccond;
  isRemainderRunOnce = false;
  
  timerTickCb() {
    this.countdown = this.practiceDuration - (Date.now() - this.startTime);
    if (this.countdown <= 0) {
      this.countdown = 0;
      this.stopTimer();
      this.gong.play();
      this.exitPractice();
    }
    
    // current second, counting starts from 0
    const currSecond = Math.floor((this.practiceDuration - this.countdown) / 1000);
    if (currSecond != this.prevSeccond) {
      this.prevSeccond = currSecond;
      this.metronome.nextTik(currSecond);
    }

    const isTimeToRemind = currSecond % (this.practice.settings.reminderInterval / 1000 - 1) == 0;
    // console.log('isTimeToRemind', currSeccond, this.practice.settings.reminderInterval / 1000, isTimeToRemind);
    if (!isTimeToRemind || currSecond === 0) return;

    if (this.practice.settings.singleReminder && !this.isRemainderRunOnce) {
      this.remaiderSound.play();
      this.isRemainderRunOnce = true;
    } else if (this.practice.settings.multiReminder) {
      this.remaiderSound.currentTime = 0.0;
      this.remaiderSound.play();
    }

  }

  startTimer(millisecons: number) {
    this.timerInterval = millisecons;
    this.countdown = this.practiceDuration;
    this.startTime = Date.now();
    this.intervalSubs = interval(millisecons).subscribe(() => this.timerTickCb());
  }

  pauseTimer() {
    if (this.intervalSubs) {
      this.intervalSubs.unsubscribe();
    }
  }

  resumeTimer() {
    this.intervalSubs = interval(this.timerInterval).subscribe(() => this.timerTickCb());
  }

  stopTimer() {
    if (this.intervalSubs) {
      this.intervalSubs.unsubscribe();
    }
  }
  // end timer


  // metronome
  toggleMetronome() {
    if (!this.metronome) {
      return;
    }
    this.metronome.toggleMute();
  }
  // end metronome

  // insomnia
  screenKeepAwake() {
    this.insomnia
      .keepAwake()
      .then(
        () => console.log("insomnia success"),
        () => console.log("insomnia error")
      );
  }

  screenAllowSleep() {
    this.insomnia
      .allowSleepAgain()
      .then(
        () => console.log("insomnia success off pr"),
        () => console.log("insomnia erro off")
      );
  }
  // exit insomnia
}
