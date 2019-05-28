import { DocumentViewer } from "@ionic-native/document-viewer";
import { FileCacheProvider } from "./../../providers/file-cache/file-cache";
import { ExercisePerformancePage } from "./../exercise-performance/exercise-performance";
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Platform, LoadingController } from "ionic-angular";
import { interval, timer } from "rxjs";
import { AlertController } from "ionic-angular";
import { AngularFirestore, DocumentSnapshot } from "@angular/fire/firestore";
import { AuthProvider } from "../../providers/auth/auth";
import { AngularFireStorage } from "@angular/fire/storage";
import { UserProvider } from "../../providers/user/user";
import { FileTransfer } from "@ionic-native/file-transfer";
import { File, IWriteOptions } from "@ionic-native/file";
import { ImgCacheService } from "../../directives/ng-imgcache/img-cache.service";
import { take } from "rxjs/operators";
import { normalizeURL } from 'ionic-angular';
import { Insomnia } from "@ionic-native/insomnia";
import * as moment from 'moment';
/**
 * Generated class for the PracticePerformancePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-practice-performance",
  templateUrl: "practice-performance.html"
})
export class PracticePerformancePage {
  intervals = [10,21]
  onMetr(evnt) {
    console.log('on change metronom', evnt, this.intervals);
  }
  practice;
  url;
  metronomeSubscription;
  isStarted = false;
  subscriptions = [];
  audio = new Audio("assets/sound/pomni.mp3");
  tik = new Audio("assets/sound/tik.mp3");

  startTime = 0;

  // Время выполнения практики
  timespan = 0;
  timeForExercise;

  metronom_sound = new Audio("assets/sound/zvuk-metronoma.mp3");
  test = '0-0-0T00:30:00';
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private afs: AngularFirestore,
    private authP: AuthProvider,
    private afStorage: AngularFireStorage,
    private fileCacheP: FileCacheProvider,
    private file: File,
    private transfer: FileTransfer,
    private platform: Platform,
    private imgCahce: ImgCacheService,
    private document: DocumentViewer,
    private insomnia: Insomnia,
    public loadingController: LoadingController
  ) {

    this.practice = {};
    Object.assign(this.practice, this.navParams.get("practice"));

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

    this.imgCahce
      .init({
        // debug:true,
        skipURIencoding: true
      })
      .then(_ => {
        // if (this.practice.text) {
        // this.imgCahce.fetchFromCache(this.practice.text).then(url => {
        //   this.practice.text = url;
        // });
        // }
        if (this.practice.audio) {
          this.imgCahce.fetchFromCache(this.practice.audio).then(url => {
            this.practice.audio = new Audio(url);
            this.practice.audio.addEventListener(
              "ended",
              function() {
                this.currentTime = 0;
                this.play();
              },
              false
            );
          });
        }

        this.resorePracticeSettings();
      });
  }

  onChangeMetronome() {
    if (this.practice.userSpec.metronomeFlag === false) {
      this.metronom_sound.pause();
    } else if (this.isStarted) {
      this.metronom_sound.play();
    }
  }

  resorePracticeSettings() {
    this.afs
      .doc(`users/${this.authP.getUserId()}`)
      .get()
      .toPromise()
      .then(res => {
        console.log("res", res);
        if (!res.exists) {
          this.practice.userSpec = {};
          return;
        }

        const userSettings: any = res.data();

        if (
          userSettings.practices &&
          userSettings.practices[this.practice.id]
        ) {
          this.practice.userSpec = userSettings.practices[this.practice.id];

          if (!this.practice.userSpec.praktikaTime) {
            this.practice.userSpec.praktikaTime = '0-0-0T00:30:00';
          }

          if (!this.practice.userSpec.pomniTime) {
            this.practice.userSpec.pomniTime = 15;
          }
        } else {
          this.practice.userSpec = {};
        }

        this.onPraktikaTimeChange();
      })
      .catch(err => console.log("err", err));
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
    // this.document.viewDocument('file:///data/user/0/com.ip.yoga_marga/files/opa.pdf',"application/pdf",{});
    if (this.practice.text) {
      const loading = this.presentLoading();
      this.fetchTextFileUriFromCache().then(uri => {
        loading.dismiss().then();
        this.document.viewDocument(
          uri,
          "application/pdf",
          {},
          null,
          null,
          err => this.openPdfErrorHandler(err),
          err => this.openPdfErrorHandler(err)
        );
      }).catch ( err => console.log('~~~openText', err));
    }
  }

  openPdfErrorHandler(err) {
    console.log("~~~error pdf opening", JSON.stringify(err));
    localStorage.removeItem("text_" + this.practice.text);
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

  onTimeForExerciseChange() {
    if (!this.practice.exercises || this.practice.exercises.length == 0) return;

    const tmp = (+this.timeForExercise || 0) * this.practice.exercises.length;
    this.practice.userSpec.praktikaTime = Math.round(tmp);
  }

  
  onPraktikaTimeChange(time = null) {
    // debugger
    if(!time) return;
    this.practice.userSpec.praktikaTime = time;
    let [hour, minute, second] = time.split(':');
    time = ((+hour) * 3600 + (+minute) * 60 + (+second)) * 1000;
    if (!this.practice.exercises || this.practice.exercises.length == 0) return;
    const tmp = (time || 0) / this.practice.exercises.length;
    this.timeForExercise = Math.round(tmp);
  }

  onChangeSolo() {
    if (this.practice.userSpec.soloPomniFlag) {
      this.practice.userSpec.multiPomniFlag = false;
    }
  }

  onChangeMulti() {
    if (this.practice.userSpec.multiPomniFlag) {
      this.practice.userSpec.soloPomniFlag = false;
    }
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad PracticePerformancePage");
  }

  ionViewWillUnload() {
    console.log("Practice Performace ViewWillUnload");

    for (const val of this.subscriptions) {
      val.unsubscribe();
    }
    if (this.practice.audio) {
      this.practice.audio.pause();
    }
  }

  ionViewWillLeave() {
    console.log("Practice performance ionViewWillLeave");
    for (const val of this.subscriptions) {
      val.unsubscribe();
    }
    if (this.practice.audio) {
      this.practice.audio.pause();
    }
    this.insomnia
    .allowSleepAgain()
    .then(() => console.log("insomnia success off"), () => console.log("insomnia erro off"));
  }

  timer;
  start() {
    console.log(this.practice);

    this.isStarted = !this.isStarted;
    if (!this.isStarted) {
      this.metronom_sound.pause();
      if (this.practice.audio) {
        this.practice.audio.pause();
      }
      this.timespan = (Date.now() - this.startTime) / 1000 / 60;
      if (this.practice.isAmountCounter || this.practice.isMaxAchievement) {
        this.presentPrompt();
      } else {
        this.savePracticeResult();
      }
      return;
    }

    // time for exercise
    this.onPraktikaTimeChange(this.practice.userSpec.praktikaTime);

    this.insomnia
    .keepAwake()
    .then(
      () => console.log("insomnia success"),
      () => console.log("insomnia error")
    );

    this.savePracticeSettings();
    this.startTime = Date.now();
    this.timer = new Date(this.practice.userSpec.praktikaTime * 60000);

    const subs = interval(
      Math.round(this.practice.userSpec.praktikaTime * 60000)
    )
      .pipe(take(1))
      .subscribe(val => {
        console.log("subs", val);
        this.timespan = this.practice.userSpec.praktikaTime;
        for (const val of this.subscriptions) {
          val.unsubscribe();
        }
        if (this.practice.exercises && this.practice.exercises.length > 0)
          return;
        return this.presentPrompt();
      });

    // Напоминание
    const subs1 = interval(
      Math.round(this.practice.userSpec.pomniTime * 60000)
    ).subscribe(val => {
      console.log("subs1", val);

      if (this.practice.userSpec.soloPomniFlag) {
        this.audio.play();
        subs1.unsubscribe();
      } else if (this.practice.userSpec.multiPomniFlag) {
        this.audio.play();
      }
    });

    this.pomniSubs = subs1;

    if (this.practice.exercises && this.practice.exercises.length > 0) {
      if (this.timeForExercise) {
        console.log('set time for exer', this.timeForExercise);
        this.practice.timeForExercise = this.timeForExercise;
      }
      return this.navCtrl.push(ExercisePerformancePage, {
        practice: this.practice
      });
    }

    // for decrise practicaTime counter
    const subs2 = interval(1000).subscribe(val => {
      console.log("subs2", val);
      this.timer -= 1000;
    });

    if (this.practice.userSpec.metronomeFlag) {
      this.metronom_sound.play();
    }

    this.subscriptions.push(subs);
    this.subscriptions.push(subs1);
    this.subscriptions.push(subs2);
  }

  pomniSubs;

  openTextInBrowser() {
    console.log("~text", this.practice.text);

    if (this.practice.text) {
      window.open(this.practice.text, "_system", "location=yes");
    }
  }

  presentPrompt() {
    const inputsArr = [];
    if (this.practice.isAmountCounter) {
      inputsArr.push({
        name: "amountCounter",
        placeholder: "Колличесство"
      });
    }

    if (this.practice.isMaxAchievement) {
      inputsArr.push({
        name: "maxAchievement",
        placeholder: "Максимальное достижение"
      });
    }

    let alert = this.alertCtrl.create({
      title: "Практика закончена",
      inputs: inputsArr,
      buttons: [
        {
          text: "Сохранить результат",
          handler: data => {
            console.log(data);
            this.savePracticeResult(data);
          }
        }
      ]
    });
    alert.present();
  }

  savePracticeSettings() {
    const tmp = {};
    tmp[`practices.${this.practice.id}`] = this.practice.userSpec;

    this.afs
      .doc(`users/${this.authP.getUserId()}`)
      .update(tmp)
      .then(res => console.log("res", res))
      .catch(err => console.log("err", err));
  }

  async savePracticeResult(data = null) {

    let practiceRes = this.practice.userSpec;
    console.log("practiceRes", practiceRes);

    if (data) {
      if (data.amountCounter) {
        practiceRes.amountCounter =
          (+practiceRes.amountCounter || 0) + +data.amountCounter;
      }

      if (data.maxAchievement) {
        if (!practiceRes.maxAchievement) {
          practiceRes.maxAchievement = data.maxAchievement;
        } else {
          practiceRes.maxAchievement =
            practiceRes.maxAchievement < data.maxAchievement
              ? +data.maxAchievement
              : practiceRes.maxAchievement;
        }
      }
    }

    practiceRes.timespan = (practiceRes.timespan || 0) + +this.timespan;

    const tmp = {};
    tmp[`practices.${this.practice.id}`] = practiceRes;

    this.afs
      .doc(`users/${this.authP.getUserId()}`)
      .update(tmp)
      .then(res => console.log("res", res))
      .catch(err => console.log("err", err));

    this.navCtrl.pop();
  }

  ionViewWillEnter() {
    console.log("ionViewWillEnter");

    if (this.isStarted) {
      this.pomniSubs.unsubscribe();
      console.log("ionViewWillEnter isStarted true");
      for (const val of this.subscriptions) {
        val.unsubscribe();
      }
      this.savePracticeResult().then();
    }
  }

}
