import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { AuthProvider } from '../../providers/auth/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastHelper } from '../../utils/toals-helper';

/**
 * Generated class for the CreateComplexPracticesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-complex-practices',
  templateUrl: 'create-complex-practices.html',
})
export class CreateComplexPracticesPage {
  practices = [];
  selected = [];
  model = { practices: [], name: null }
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userP: UserProvider,
    private authP: AuthProvider,
    private afs: AngularFirestore,
    public toastHelper: ToastHelper
  ) {
    const practices = UserProvider.getGlobalPractices();
    this.practices = Object.values(practices);
    this.model.name = this.navParams.get("name");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateComplexPracticesPage');
  }

  uselect(pract) {
    this.practices.push(pract);
    this.model.practices = this.model.practices.filter(p => p.id !== pract.id);
  }

  select(pract) {
    this.model.practices.push(pract);
    this.practices = this.practices.filter(p => p.id !== pract.id);
  }

  onSave() {
    if (this.model.practices.length <= 0) return;

    let com = UserProvider.getComplexes();

    const tmp = {
      complexes: com || []
    };
    this.afs.doc(`complex-settings/ico`).valueChanges().subscribe(
      (doc:any) => {
        console.log(doc)
        tmp.complexes.push({
          ico: doc.url,
          isComplex: true,
          active: true,
          name: this.model.name,
          practices: this.model.practices.map(p => p.id)
        });

        this.afs
          .doc(`users/${this.authP.getUserId()}`)
          .update(tmp)
          .then(res => {
            this.toastHelper.presentTopMess('Сохранено').then(
              () => this.navCtrl.popToRoot()
            );
          })
          .catch(err => {
            console.log("err", err);
            this.toastHelper.presentTopMess('Ошибка, попробуйте позже').then(
              () => this.navCtrl.pop()
            );
          });
      })
  }
}
