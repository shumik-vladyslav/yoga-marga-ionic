import { StatsProvider } from './../../providers/stats/stats';
import { ExercisesHelper } from './../../utils/exercises-helper';
import { PracticeSettings } from './../../models/practice-settings';
import { DocumentViewer } from "@ionic-native/document-viewer";
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, LoadingController } from "ionic-angular";
import { interval, timer } from "rxjs";
import { FileTransfer } from "@ionic-native/file-transfer";
import { File } from "@ionic-native/file";
import { ImgCacheService } from "../../directives/ng-imgcache/img-cache.service";
import { Insomnia } from "@ionic-native/insomnia";
import { UserProvider } from '../../providers/user/user';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Practice } from '../../models/practice';
import { Metronome } from '../../utils/metronome';
import * as moment from 'moment';
import { p } from '@angular/core/src/render3';

const TIMER_INTERVAL = 200;

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

  practiceDuration;
  exercisesHelper: ExercisesHelper;

  show = {
    img: '',
    imgMirror: false,
    title: '',
    description: '',
    practiceTimer: 0,
    exerciseTimer: null,
    audio: null
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private file: File,
    private transfer: FileTransfer,
    private insomnia: Insomnia,
    public loadingController: LoadingController,
    private statsProv: StatsProvider
  ) {
    this.StateEnum = { Inited: 0, Started: 1, Paused: 2 };
    this.practice = { ...this.navParams.get("practice") };

    if (this.practice.audio) {
      this.show.audio = new Audio(this.practice.audio);
      this.show.audio.addEventListener("ended", function () { this.currentTime = 0; this.play(); }, false);
    }

    this.show.img = this.practice.img;
    this.show.title = this.practice.name;
    this.show.description = this.practice.shortDescription;
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');

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

    // fetch user settings
    const userPractices = UserProvider.getUserPractices();
    let settings = userPractices ? userPractices[this.practice.id] : null;
    if (!settings) {
      settings = PracticeSettings.createInstance();
    }

    this.practice.settings = settings;

    this.exercisesHelper = new ExercisesHelper(this.practice);

    // init metronome
    if (settings.intervals && settings.intervals.length > 0) {
      this.metronome = Metronome.createMetronome(settings.intervals.map(i => i.value),
        'assets/sound/tik.mp3', 'assets/sound/gong.mp3');
    }

    // go to exercises performance page
    if (this.exercisesHelper.hasExercises()) {
      this.practiceDuration = this.exercisesHelper.calculatePracticeDuration()*1000;
    } else {
      this.practiceDuration = this.practice.settings.practiceDuration;
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
    if (this.practice.text) {
      window.open(this.practice.text, '_system');
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

  onToggleAudio() {
    if (this.show.audio) {
      if (this.isMuted) {
        console.log("audio play");
        this.show.audio.play();
        this.isMuted = false;
      } else {
        console.log("audio pause");
        this.show.audio.pause();
        this.isMuted = true;
      }
    }
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad PracticePerformancePage");
  }

  ionViewWillLeave() {
    console.log("Practice performance ionViewWillLeave");

    if (this.show.audio) {
      this.show.audio.pause();
    }
    this.stopTimer();
  }

  async startPausePractice() {
  }

  startPractice() {
    this.statsProv.event('practice_start', {practice_name: this.practice.name});
    this.resumeAudio();
    this.screenKeepAwake();
    this.startTimer(TIMER_INTERVAL);
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
    if (this.show.audio) {
      this.show.audio.pause();
    } 
  }

  resumeAudio() {
    if (this.show.audio && !this.isMuted) {
      this.show.audio.play()
    }
  }

  exitPractice() {
    //stop audio
    this.pauseAudio();

    // insomnia sleep again
    this.screenAllowSleep()

    this.savePracticeSpentTime().then( () => console.log('time is saved'));

    if (this.state !== this.StateEnum.Inited && (this.practice.isAmountCounter || this.practice.isMaxAchievement)) {
      this.navCtrl.push('PracticeResultPage', { practice: this.practice });
    } else {
      this.navCtrl.pop();
    }
  }

  savePracticeSettings(settings = this.practice.settings) {
    UserProvider.updateUserPracticeSettings(this.practice.id, this.practice.settings)
      .then(res => console.log("res", res))
      .catch(err => console.log("err", err));
  }

  async savePracticeSpentTime() {
    if (!this.startTime) {
      return;
    }
    // debugger
    const spent = this.practiceDuration - this.show.practiceTimer;
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
  startTime = 0;
  timerTickCb() {
    // this.countdown = this.practiceDuration - (Date.now() - this.startTime);
    this.countdown = this.countdown - TIMER_INTERVAL;
    if (this.exercisesHelper.hasExercises()) {
      this.show = this.exercisesHelper.nextTick(TIMER_INTERVAL, this.isMuted);
    } else {
      // practice timer section
      this.show.practiceTimer = this.countdown;
      // end practice timer section
    }
    if (this.show.practiceTimer <= 0) {
      this.show.practiceTimer = 0;
      this.stopTimer();
      this.gong.play();
      this.exitPractice();
    }

    // metronome section
    const currSecond = Math.floor((this.practiceDuration - this.countdown) / 1000);
    if (currSecond != this.prevSeccond && this.metronome) {
      this.prevSeccond = currSecond;
      this.metronome.nextTik(currSecond);
    }
    // end metronome section
    // reminder section
    const isTimeToRemind = currSecond % (this.practice.settings.reminderInterval / 1000 - 1) == 0;
    if (!isTimeToRemind || currSecond === 0) return;
    if (this.practice.settings.singleReminder && !this.isRemainderRunOnce) {
      this.remaiderSound.play();
      this.isRemainderRunOnce = true;
    } else if (this.practice.settings.multiReminder) {
      this.remaiderSound.currentTime = 0.0;
      this.remaiderSound.play();
    }
    // end reminder section
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
