import { StatsProvider } from './../../providers/stats/stats';
import { FileCacheProvider } from './../../providers/file-cache/file-cache';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Insomnia } from '@ionic-native/insomnia';
import { UserProvider } from '../../providers/user/user';
import { PracticeSettings } from '../../models/practice-settings';

/**
 * Generated class for the BmPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bm',
  templateUrl: 'bm.html',
})
export class BmPage {
  practice;
  played;
  paused = true;
  playedIdx;
  audio;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private insomnia: Insomnia,
    private fileCache: FileCacheProvider,
    private statsProv: StatsProvider
  ) {
    this.practice = { ...this.navParams.get("practice") };
    console.log(this.practice);
    const userPractices = UserProvider.getUserPractices();
    let settings = userPractices ? userPractices[this.practice.id] : null;
    if (!settings) {
      settings = PracticeSettings.createInstance();
    }
    
    this.practice.settings = settings;
  }

  onBack() {
    if (this.playedIdx == null) return;
    const count = this.practice.bmtracks.length;
    this.playedIdx = this.playedIdx - 1 < 0 ?  this.playedIdx : this.playedIdx - 1;
    this.onSelectTrack(this.playedIdx);
  }

  onForw() {
    if (this.playedIdx == null) return;
    const count = this.practice.bmtracks.length;
    this.playedIdx = this.playedIdx + 1 >= count? this.playedIdx: this.playedIdx + 1;
    this.onSelectTrack(this.playedIdx);
  }

  async onSelectTrack(i) {
    this.onPause();
    this.playedIdx = i;
    this.played = this.practice.bmtracks[i];
    const url = await this.checkCache(this.played.url) 
    this.played.audio = new Audio(url);
    this.played.audio.addEventListener("ended",  () => {
      if (this.playedIdx + 1 >= this.practice.bmtracks.length) return;
      this.onForw();
    }, false);  
    await this.onPlay();
  }

  onPause() {
    this.paused = true;
    if (this.played && this.played.audio) {
      this.played.audio.pause();
    }
  }

  async checkCache(url) {
    return await this.fileCache.get(url);
  }

  async onPlay() {
    this.paused = false;
    // first click on play
    if (!this.played || !this.played.audio) {
      
      this.playedIdx = 0;
      this.played = this.practice.bmtracks[0];
      const url = await this.checkCache(this.played.url) 
      this.played.audio = new Audio(url);  
      this.played.audio.addEventListener("ended",  () => {
        if (this.playedIdx + 1 >= this.practice.bmtracks.length) return;
        this.onForw();
      }, false);  
    }
    this.played.audio.play();
  }

  ionViewDidLoad() {
    this.statsProv.event('bm_opened', {practice_name: this.practice.name});
    this.screenKeepAwake();
    console.log('ionViewDidLoad BmPage');
  }
  
  ionViewDidLeave() {
    this.screenAllowSleep();
    this.practice.bmtracks.forEach(t => t.audio? t.audio.pause():0);
  }

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
