import { Component, OnDestroy, Input, forwardRef } from "@angular/core";
import { interval, Subscription } from "rxjs";
import { AbstractValueAccessor, MakeProvider } from "../../pages/practice-performance/abstract-value-accessor";
import { NG_VALUE_ACCESSOR } from "@angular/forms";

/**
 * Generated class for the MetronomeComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: "metronome",
  templateUrl: "metronome.html",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MetronomeComponent),
      multi: true
    }
  ]
})
export class MetronomeComponent extends AbstractValueAccessor implements OnDestroy {
  context;
  tikBuff;
  gongBuff;
  
  // intervals: number[];


  state = "paused";
  subscription = new Subscription();

  async loadSoundIntoBuffer(url) {
    let response = await window.fetch(url);
    let arrayBuffer = await response.arrayBuffer();
    let audioBuffer = await this.context.decodeAudioData(arrayBuffer);
    return audioBuffer;
  }

  playBuffer(buffer, delay = 0) {
    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.start(delay);
    source.connect(this.context.destination);
    source.onended = () => {
      console.log('playback finished');
      source.disconnect();
    }
    return source;
  }

  sources = []
  
  playSedule(delay = 0) {
    // this.sources.forEach( s => s.disconnect());
    // this.sources = [];
    const sum = this.intervals.reduce((a,b) => a+(+b), 0);
    const currTime = this.context.currentTime;

    let prevIntervalsSum = 0;
    let prevIntervalsSumArr = [];
    for (let i = 0; i < this.intervals.length; i++) {
      const interval = this.intervals[i];
      prevIntervalsSum = prevIntervalsSum + Number(interval);
      prevIntervalsSumArr.push(prevIntervalsSum);
      console.log('gong', prevIntervalsSum, currTime + prevIntervalsSum + delay);
      this.sources.push(this.playBuffer(this.gongBuff, currTime + prevIntervalsSum + delay));
    }

    for (let i = 1; i <= sum; i++) {
      if (prevIntervalsSumArr.includes(i)) continue;
      console.log('tuk', currTime + i + delay);
      this.sources.push(this.playBuffer(this.tikBuff, currTime + i + delay));
    }
  }

  tikSource
  
  async onStart() {
    await this.context.resume();

    let prevIntervalsSumArr = [];
    let prevIntervalsSum = 0;
    this.subscription = new Subscription();

    for (let i = 0; i < this.intervals.length; i++) {
      const inter = this.intervals[i];
      prevIntervalsSum = prevIntervalsSum + Number(inter);
      prevIntervalsSumArr.push(prevIntervalsSum);
    }
    
    const sum = this.intervals.reduce((a,b) => a+(+b), 0);
    this.subscription.add(
      interval(1000).subscribe( sec => {
        console.log('sec', sec, this.context.currentTime);
        
        if(prevIntervalsSumArr.includes(((sec % sum ) + 1))) {
          this.playBuffer(this.gongBuff);
        } else {
          // if (this.tikSource) {
          //   this.tikSource.disconnect();
          // }
          this.tikSource = this.playBuffer(this.tikBuff);
        }
      })
    );

    console.log('start');
    this.state = 'played';
    
    // const sum = this.intervals.reduce((a,b) => a+(+b), 0);
    // this.playSedule();
    // this.subscription = new Subscription();
    // this.subscription.add(
    //   // 2 secc before shedule ends≈
    //   interval((sum) * 1000).subscribe(_ => this.playSedule())
    // );
  }

  async onStop() {
    console.log('stop');
    await this.context.suspend();
    this.state = 'paused';
    this.subscription.unsubscribe();
  }

  createAudioContext() {
    var AudioContext =
    (window as any).AudioContext || (window as any).webkitAudioContext;
    this.context = new AudioContext();
  }

  constructor() {
    super();
    this.createAudioContext()

    this.loadSoundIntoBuffer("assets/sound/tik.mp3").then(b => this.tikBuff = b);
    this.loadSoundIntoBuffer("assets/sound/gong.mp3").then(b => this.gongBuff = b);

    this.intervals = [];
    this.state = "paused";
    this.context.suspend().then();
  }

  ngOnDestroy() {    
    this.subscription.unsubscribe();
    this.context.close().then( _=> console.log('context is cleared'));
  }
}
