import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/timer';

/**
 * Generated class for the Template_2Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-template-2',
  templateUrl: 'template-2.html',
})

export class Template_2Page {
  soloPomniFlag;
  multiPomniFlag;
  pomniTime = 0;
  praktikaTime = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Template_2Page');
  }

  start(){
    console.log(this.soloPomniFlag, this.pomniTime)
    if(this.soloPomniFlag){
      let pomniTaimer = Observable.timer(this.pomniTime * 60000);
      pomniTaimer
      // .takeUntil(this.subjectPomni)
      .subscribe(() => {
        new Audio('assets/sound/pomni.mp3').play();
      })
    }

    if(this.multiPomniFlag){
      let pomniTaimer = Observable.timer(this.pomniTime * 60000, this.pomniTime * 60000);
      pomniTaimer
      // .takeUntil(this.subjectPomni)
      .subscribe(() => {
        new Audio('assets/sound/pomni.mp3').play();
      })
    }

    if(this.praktikaTime){
      let pomniTaimer = Observable.timer(this.praktikaTime * 60000);
      pomniTaimer
      // .takeUntil(this.subjectPomni)
      .subscribe(() => {
        new Audio('assets/sound/gong.mp3').play();
      })
    }
  }

}
