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
  @ViewChild(MetronomeComponent) 
  metronome: MetronomeComponent;

  practice;
  url;
  
  isStarted = false;
  subscriptions = [];
  audio = new Audio("assets/sound/pomni.mp3");
  gong = new Audio("assets/sound/gong.mp3");

  startTime = 0;

  // Время выполнения практики
  timespan = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private afs: AngularFirestore,
    private authP: AuthProvider,
    private file: File,
    private transfer: FileTransfer,
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
          !userSettings.practices ||
          !userSettings.practices[this.practice.id]
        ) {
          this.practice.userSpec = {
            pomniTime: 15,
            praktikaTime: 3600000,
            intervals: []
          };
          this.onPraktikaTimeChange(3600000);
        } else {
          this.practice.userSpec = userSettings.practices[this.practice.id];
        }
        this.initTimings();
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

  ////////////////////////////////////////////////////////////
  pr;
  ex;

  initTimings() {
    if (this.practice.userSpec.exercises) {
      this.practice.userSpec.praktikaTime = this.practice.userSpec.exercises.reduce((a, i) => a + +i, 0);
    }

    this.pr = moment.utc(this.practice.userSpec.praktikaTime).format('HH:mm:ss');
    let tmp = (this.practice.userSpec.praktikaTime || 0) / this.practice.exercises.length;
    tmp = Math.round(tmp);

    this.ex = moment.utc(tmp).format('HH:mm:ss');
  }

  onTimeForExerciseChange(time = null) {  
    if (!time) return;
    if (!this.practice.exercises || this.practice.exercises.length == 0) return;
    
    const milli = moment.duration(time).asMilliseconds()
    const tmp = (milli || 0) * this.practice.exercises.length;
    this.practice.userSpec.praktikaTime = tmp;
    
    this.saveTimings(milli, tmp);
    this.pr = moment.utc(tmp).format('HH:mm:ss');
  }

  onPraktikaTimeChange(time = null) {
    if(!time) return;
    const milli = moment.duration(time).asMilliseconds();
    this.practice.userSpec.praktikaTime = milli;
    

    if (!this.practice.exercises || this.practice.exercises.length == 0) {
      this.saveTimings(null, milli);
      return;
    }
    
    
    
    let tmp = (milli || 0) / this.practice.exercises.length;
    tmp = Math.round(tmp);
    this.ex = moment.utc(tmp).format('HH:mm:ss');
    this.saveTimings(tmp, milli);
   
  }

  // Practica time, exercises durations
  saveTimings(exerciseDuration, prakticaDuration) {
    let userUpdate = {};
    if(!exerciseDuration && prakticaDuration) {
      userUpdate[`practices.${this.practice.id}.praktikaTime`] = prakticaDuration;
      this.afs
      .doc(`users/${this.authP.getUserId()}`)
      .update(userUpdate)
      .then(res => console.log("res", res))
      .catch(err => console.log("err", err));
      return;
    };
    
    const exCount = this.practice.exercises.length;
    
    let tmpArr = new Array(exCount);
    tmpArr = tmpArr.fill(exerciseDuration);

   
    userUpdate[`practices.${this.practice.id}.exercises`] = tmpArr
    userUpdate[`practices.${this.practice.id}.praktikaTime`] = prakticaDuration;
    this.practice.userSpec.exercises = tmpArr;
    this.practice.userSpec.praktikaTime = prakticaDuration;
    this.afs
      .doc(`users/${this.authP.getUserId()}`)
      .update(userUpdate)
      .then(res => console.log("res", res))
      .catch(err => console.log("err", err));
  }

  ///////////////////////////////////////////////////////////////
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
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

  }

  timer;
  start() {
    console.log(this.practice);

    this.isStarted = !this.isStarted;
    if (!this.isStarted) {
      if (this.practice.userSpec.metronomeFlag && this.metronome) {
        this.metronome.onStop();
      }

      if (this.practice.audio) {
        this.practice.audio.pause();
      }
      this.insomnia
        .allowSleepAgain()
        .then(() => console.log("insomnia success off pr"), () => console.log("insomnia erro off"));

      debugger
      this.timespan = (Date.now() - this.startTime) / 1000 / 60;
      if (this.practice.isAmountCounter || this.practice.isMaxAchievement) {
        this.presentPrompt();
      } else {
        this.savePracticeResult();
      }
      return;
    }

    // time for exercise
    // this.onPraktikaTimeChange(this.practice.userSpec.praktikaTime);

    this.insomnia
    .keepAwake()
    .then(
      () => console.log("insomnia success"),
      () => console.log("insomnia error")
    );

    this.savePracticeSettings();
    this.startTime = Date.now();
    this.timer = this.practice.userSpec.praktikaTime;

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
    this.subscriptions.push(subs1);
    this.pomniSubs = subs1;

    // go to practice performance page
    if (this.practice.exercises && this.practice.exercises.length > 0) {
      return this.navCtrl.push(ExercisePerformancePage, {
        practice: this.practice
      });
    }

    if (this.practice.userSpec.metronomeFlag && this.metronome) {
      this.metronome.onStart();
    }
    // for decrise practicaTime counter
    this.startStopExTimer()
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
    this.gong.play();
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

  onBack() {
    if (!this.isStarted) {
      this.navCtrl.pop();
      return;
    }
    this.savePracticeResult().then();
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

    practiceRes.timespan = (practiceRes.timespan || 0) + (Date.now() - this.startTime);

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

  isPause = true;
  subscription;
  startStopExTimer() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.isPause) {
      
      this.subscription = interval(500)
      .subscribe(val => {
        
        console.log("subs2", val, this.timer);
        // debugger
        this.timer = this.practice.userSpec.praktikaTime - ( Date.now() - this.startTime);

        if (this.timer <= 0) {
          this.subscription.unsubscribe();
          if (this.practice.userSpec.metronomeFlag && this.metronome) {
            this.metronome.onStop();
          }
          this.timespan = this.practice.userSpec.praktikaTime;
          for (const val of this.subscriptions) {
            val.unsubscribe();
          }
          if (this.practice.exercises && this.practice.exercises.length > 0)
            return;
          return this.presentPrompt();
        }

      });

      this.isPause = !this.isPause;

      if (this.practice.userSpec.metronomeFlag && this.metronome) {
        this.metronome.onStart();
      }
    } else {
      this.isPause = !this.isPause;
      if (this.practice.userSpec.metronomeFlag && this.metronome) {
        this.metronome.onStop();
      }
    }
    console.log('isPaused', this.isPause);
  }
}
