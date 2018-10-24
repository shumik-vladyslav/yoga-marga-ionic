import { Component } from "@angular/core";
import { NavController, NavParams, AlertController } from "ionic-angular";
import { PrivateOfficePage } from "../private-office/private-office";
import { AngularFirestore, DocumentSnapshot } from "@angular/fire/firestore";
import { AuthProvider } from "../../providers/auth/auth";
import { UserProvider } from "../../providers/user/user";

/**
 * Generated class for the GoalsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: "page-goals",
  templateUrl: "goals.html"
})
export class GoalsPage {
  goals: any = {
    om: "",
    om_dram: "",
    prostiraniya: "",
    chandaly: "",
    anuloma_viloma: "",
    sahita_kumbhaka: ""
  };
  ionViewCanEnter() {
    return UserProvider.user ? true : false;
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afs: AngularFirestore,
    private authP: AuthProvider,
    private alertCtrl: AlertController
  ) {
    this.afs
      .doc(`users/${this.authP.getUserId()}`)
      .get()
      .subscribe(docSnap => {
        if (!docSnap.exists) return;
        const data = docSnap.data();
        console.log(data);
        if (data.goals) {
          this.goals = data.goals;
        }
      });
  }

  onChangeGoal(practiceId, value) {
    console.log(practiceId, value);
    this.goals[practiceId] = value;
  }

  async savePracticeGoal(practiceId, goal) {
    try {
      let practSett;
      const docSnapshot = await this.afs
        .collection(`users/${this.authP.getUserId()}/practices/${practiceId}/`)
        .get()
        .toPromise();

      if (docSnapshot.empty) {
        practSett = { goal: goal };
      } else {
        practSett.goal = goal;
      }

      const tmp = {};
      tmp[`practices.${practiceId}`] = practSett;

      await this.afs.doc(`users/${this.authP.getUserId()}`).update(tmp);
    } catch (err) {
      console.log(err);
    }
  }

  presentAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ["Закрыть"]
    });
    alert.present();
  }

  async submit() {
    try {
      const tmp = {};
      tmp[`goals`] = this.goals;
      await this.afs.doc(`users/${this.authP.getUserId()}`).update(tmp);
      this.presentAlert('Сохранено', 'Цели сохранены');
    } catch (err) {
      this.presentAlert('Ошибка', err);
    }
  }

  goPrivateOfficePage() {
    this.navCtrl.setRoot(PrivateOfficePage);
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad GoalsPage");
  }
}
