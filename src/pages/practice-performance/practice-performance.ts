import { FileCacheProvider } from "./../../providers/file-cache/file-cache";
import { ExercisePerformancePage } from "./../exercise-performance/exercise-performance";
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { interval } from "rxjs";
import { AlertController } from "ionic-angular";
import { AngularFirestore, DocumentSnapshot } from "@angular/fire/firestore";
import { AuthProvider } from "../../providers/auth/auth";
import { AngularFireStorage } from "@angular/fire/storage";
import { UserProvider } from "../../providers/user/user";

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
  window = window;
  practice;

  isStarted = false;
  subscriptions = [];
  audio = new Audio("assets/sound/pomni.mp3");
  startTime = 0;

  // Время выполнения практики
  timespan = 0;
  imgUrls = [];
  timeForExercise;

  url;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private afs: AngularFirestore,
    private authP: AuthProvider,
    private afStorage: AngularFireStorage,
    private fileCacheP: FileCacheProvider
  ) {
    this.practice = this.navParams.get("practice");
    this.resorePracticeSettings();
    
    console.log('get url for anuloma viloma',`practices/${this.practice.id}/m.jpg`);
    
    this.fileCacheP.getUrl(`practices/${this.practice.id}/m.jpg`).subscribe(
      url => this.url = url,
      err => {
        console.log('error get url for anuloma viloma',JSON.stringify(err));
        this.url = null;
      }
    )
  }
  ionViewCanEnter() {
    return UserProvider.user?true:false;
  }
  
  resorePracticeSettings() {

    this.fileCacheP.getUrl(`practices/${this.practice.id}/text.pdf`).subscribe(
      url => this.practice.text = url,
      err => {
        console.log('text err',JSON.stringify(err));
        this.url = null;
      }
    )

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
            this.practice.userSpec.praktikaTime = 60;
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
  
  opentText () {

  }

  onTimeForExerciseChange() {
    if (!this.practice.exercises) return;

    const tmp = (+this.timeForExercise || 0) * this.practice.exercises.length;
    this.practice.userSpec.praktikaTime = Math.round(tmp * 10) / 10;
  }

  onPraktikaTimeChange() {
    if (!this.practice.exercises) return;
    const tmp =
      (+this.practice.userSpec.praktikaTime || 0) /
      this.practice.exercises.length;
    this.timeForExercise = Math.round(tmp * 10) / 10;
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
  }

  ionViewWillLeave() {
    console.log("Practice performance ionViewWillLeave");
    for (const val of this.subscriptions) {
      val.unsubscribe();
    }
  }

  timer;
  start() {
    console.log(this.practice);

    this.isStarted = !this.isStarted;

    if (!this.isStarted) {
      this.timespan = Math.round((Date.now() - this.startTime) / 1000 / 3600);
      if (this.practice.isAmountCounter || this.practice.isMaxAchievement) {
        this.presentPrompt();
      } else {
        this.savePracticeResult();
      }
    }

    this.savePracticeSettings();
    this.startTime = Date.now();
    this.timer = new Date(this.practice.userSpec.praktikaTime * 60000);

    const subs = interval(
      Math.round(this.practice.userSpec.praktikaTime * 60000)
    ).subscribe(val => {
      console.log("subs", val);
      this.timespan = this.practice.userSpec.praktikaTime;
      for (const val of this.subscriptions) {
        val.unsubscribe();
      }
      if (this.practice.exercises && this.practice.exercises.length > 0) return;
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

    if (this.practice.exercises) {
      if (this.timeForExercise) {
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

    this.subscriptions.push(subs);
    this.subscriptions.push(subs1);
    this.subscriptions.push(subs2);
  }
pomniSubs;
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
          (practiceRes.maxAchievement < data.maxAchievement)
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
    console.log('ionViewWillEnter' );
    
    if (this.isStarted) {
      this.pomniSubs.unsubscribe();
      console.log('ionViewWillEnter isStarted true' );
      for (const val of this.subscriptions) {
        val.unsubscribe();
      }
      this.savePracticeResult().then();
    }
  }

  openTextInBrowser() {
    console.log('~text', this.practice.text);
    
    if (this.practice.text) {
      window.open(this.practice.text,'_system', 'location=yes')
    }
    
  }
  
}
