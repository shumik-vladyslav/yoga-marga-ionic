import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

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
  data = [
    {
      name: 'Тадасана',
      description: `Стоим прямо.`,
      url: '/assets/imgs/photo/asana-2/asana1.jpg',
      time: 0,
      defTime: 3000,
      skipFlag: false
    },
    {
      name: 'Врикшасана',
      description: `Дерево в лево.`,
      url: '/assets/imgs/photo/asana-2/asana2-1.jpg',
      time: 0,
      defTime: 3000,
      skipFlag: false
    },
    {
      name: 'Врикшасана',
      description: `Верево в право.`,
      url: '/assets/imgs/photo/asana-2/asana2-2.jpg',
      time: 0,
      defTime: 3000,
      skipFlag: false
    },
    {
      name: 'Триконасана',
      description: `Триконасана подготовка.`,
      url: '/assets/imgs/photo/asana-2/asana3-1.jpg',
      time: 0,
      defTime: 3000,
      skipFlag: true
    },
    {
      name: 'Триконасана',
      description: `Триконасана лево.`,
      url: '/assets/imgs/photo/asana-2/asana3-2.5.jpg',
      time: 0,
      defTime: 3000,
      skipFlag: false
    },
    {
      name: 'Триконасана',
      description: `Триконасана право.`,
      url: '/assets/imgs/photo/asana-2/asana3-3.jpg',
      time: 0,
      defTime: 3000,
      skipFlag: false
    },
    {
      name: 'Триконасана',
      description: `Триконасана перевернутая в лево.`,
      url: '/assets/imgs/photo/asana-2/asana4-1.2.jpg',
      time: 0,
      defTime: 3000,
      skipFlag: false
    },
    {
      name: 'Триконасана',
      description: `Триконасана перевернутая в право.`,
      url: '/assets/imgs/photo/asana-2/asana4-2.jpg',
      time: 0,
      defTime: 3000,
      skipFlag: false
    },

  ]

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.init(0);
    let pomniTaimer = Observable.timer(3000, 10000);
    pomniTaimer
    .takeUntil(this.subjectPomni)
    .subscribe(() => {
      new Audio('assets/sound/pomni.mp3').play();
    })
  }
  subject = new Subject();
  subjectPomni = new Subject();
  init(i){
    if(i >= 0 && this.data.length > i){
      new Audio('assets/sound/gong.mp3').play();
      this.active = this.data[i];
      this.index = i;
      this.timer = Observable.timer(this.active.defTime);
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
