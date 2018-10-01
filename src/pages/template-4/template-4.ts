import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { SettingsProvider } from '../../providers/shared-services-settings/shared-services-settings';
import 'rxjs/add/observable/timer';

/**
 * Generated class for the Template_4Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-template-4',
  templateUrl: 'template-4.html',
})

export class Template_4Page {

  active;
  index;
  timer;

  data = [];

  settings;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private settingsProvider: SettingsProvider) {
    this.settings = this.settingsProvider.getSettings();
    this.data = this.settingsProvider.getData();

    this.init(0);
    if(this.settings.soloPomniFlag){
      let pomniTaimer = Observable.timer(this.settings.pomniTime * 60000);
      pomniTaimer
      .takeUntil(this.subjectPomni)
      .subscribe(() => {
        new Audio('assets/sound/pomni.mp3').play();
      })
    }

    if(this.settings.multiPomniFlag){
      let pomniTaimer = Observable.timer(this.settings.pomniTime * 60000, this.settings.pomniTime * 60000);
      pomniTaimer
      .takeUntil(this.subjectPomni)
      .subscribe(() => {
        new Audio('assets/sound/pomni.mp3').play();
      })
    }
  }
  
  subject = new Subject();
  subjectPomni = new Subject();
  
  init(i){
    if(i >= 0 && this.data.length > i){
      new Audio('assets/sound/gong.mp3').play();
      this.active = this.data[i];
      this.index = i;
      this.timer = Observable.timer(this.settings.fullTime > 0 ? (this.settings.fullTime / this.data.length * 60000) : (this.settings.eachTime > 0 ? 
        this.settings.eachTime * 60000 : this.active.defTime));
      this.timer
      .takeUntil(this.subject)
      .subscribe((value) => {
        console.log(value)
        if(this.data.length > (i + 1) && i >= 0){
          this.init(i + 1);
        } else {
          this.subjectPomni.next();
        }
      });
    }
   
    // Rx.Observable.timer(3000, 1000);
  }

  skip(){
    this.subject.next();
    // this.timer.unsubscribe();
    this.init(this.index + 1);
  }

  back(){
    this.subject.next(1);
    // this.timer.unsubscribe();
    this.init(this.index - 1);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Template_4Page');
  }

}
