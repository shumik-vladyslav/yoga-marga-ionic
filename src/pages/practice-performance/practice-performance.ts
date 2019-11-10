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

@IonicPage()
@Component({
  selector: "page-practice-performance",
  templateUrl: "practice-performance.html"
})
export class PracticePerformancePage {
  @ViewChild(MetronomeComponent) metronome: MetronomeComponent;
  public StateEnum = { Inited: 0, Started: 1, Paused: 2 };
  state = this.StateEnum.Inited;

  practice;
  url;

  audio = new Audio("assets/sound/pomni.mp3");
  gong = new Audio("assets/sound/gong.mp3");

  startTime = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afs: AngularFirestore,
    private authP: AuthProvider,
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
    this.practice.settings=settings;
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
      const loading = this.presentLoading();
      this.fetchTextFileUriFromCache().then(uri => {
        loading.dismiss().then();

        this.fileOpener.open(uri, 'application/pdf')
          .then(() => console.log('File is opened'))
          .catch(e => console.log('Error opening file', e));
        // this.document.viewDocument(
        //   uri,
        //   "application/pdf",
        //   {},
        //   null,
        //   null,
        //   err => this.openPdfErrorHandler(err),
        //   err => this.openPdfErrorHandler(err)
        // );
      }).catch(err => console.log('~~~openText', err));
    }
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

  audioState = false;
  onToggleAudio() {
    if (this.practice.audio) {
      if (!this.audioState) {
        console.log("audio play");
        this.practice.audio.play();
        this.audioState = true;
      } else {
        console.log("audio pause");
        this.practice.audio.pause();
        this.audioState = false;
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
  }

  async startPausePractice() {
  }

  startPractice() {
    // go to exercises performance page
    if (this.practice.exercises && this.practice.exercises.length > 0) {
      return this.navCtrl.push(ExercisePerformancePage, {
        practice: this.practice
      });
    }
    this.resumeAudio();
    this.screenKeepAwake();
    this.startRemainder();
    this.startMetronome();
    this.startTimer(100);
    this.state = this.StateEnum.Started;
  }

  pausePractice() {
    this.pauseTimer();
    this.pauseAudio();
    this.stopMetronome();
    // todo pause remaider
    this.state = this.StateEnum.Paused;
  }

  resumePractice() {
    this.resumeTimer();
    this.resumeAudio();
    // todo resume remainder
    this.startMetronome();
    this.state = this.StateEnum.Started;
  }

  isMuted = false;
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

  exitPractice() {
    // stop metronome
    this.stopMetronome();

    //stop audio
    this.pauseAudio();

    // insomnia sleep again
    this.screenAllowSleep()

    this.savePracticeSpentTime();

    if (this.practice.isAmountCounter || this.practice.isMaxAchievement) {
      this.navCtrl.push('PracticeResultPage');
    } else {
      this.navCtrl.pop();
    }
  }

  remainderSubs;
  startRemainder() {
    this.remainderSubs = interval(
      this.practice.settings.reminderInterval
    ).subscribe(() => {
      if (this.practice.settings.soloPomniFlag) {
        this.audio.play();
        this.remainderSubs.unsubscribe();
      } else if (this.practice.settings.multiPomniFlag) {
        this.audio.play();
      }
    });
  }

  stopRemainder() {
    if (this.remainderSubs) {
      this.remainderSubs.unsubscribe();
    }
  }

  savePracticeSettings(settings = this.practice.settings) {
    const patch = {};
    patch[`practices.${this.practice.id}`] = this.practice.settings;

    UserProvider.updateUser(patch)
      .then(res => console.log("res", res))
      .catch(err => console.log("err", err));
  }

  async onBack() {
    if (this.state === this.StateEnum.Inited) {
      return this.navCtrl.pop();
    }
    await this.savePracticeSpentTime();
  }

  async savePracticeSpentTime() {
    const settings = this.practice.settings;
    settings.spentTime = (settings.spentTime || 0) + (Date.now() - this.startTime);
    await this.savePracticeSettings(settings);
  }

  /// timer
  countdown;
  intervalSubs;
  timerInterval;

  startTimer(millisecons: number) {
    this.timerInterval = millisecons;
    this.countdown = this.practice.settings.practiceDuration;
    this.startTime = Date.now();
    this.startMetronome();
    this.intervalSubs = interval(millisecons)
      .subscribe(() => {
        this.countdown -= Date.now() - this.startTime;
        if (this.countdown <= 0) {
          this.stopTimer();
        }
      });
  }

  pauseTimer() {
    this.stopMetronome();
    if (this.intervalSubs) {
      this.intervalSubs.unsubscribe();
    }
  }

  resumeTimer() {
    this.startMetronome();
    this.intervalSubs = interval(this.timerInterval)
      .subscribe(() => {
        this.countdown -= Date.now() - this.startTime;
        if (this.countdown <= 0) {
          this.stopTimer();
        }
      });
  }

  stopTimer() {
    this.stopMetronome();
    if (this.intervalSubs) {
      this.intervalSubs.unsubscribe();
    }

    this.exitPractice();
  }
  // end timer


  // metronome
  startMetronome() {
    if (this.practice.settings.metronomeFlag && this.metronome) {
      this.metronome.onStart();
    }
  }

  stopMetronome() {
    if (this.practice.settings.metronomeFlag && this.metronome) {
      this.metronome.onStop();
    }
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
