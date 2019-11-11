export class Metronome {
    private constructor() {
    }
    
    private tik: HTMLAudioElement;
    private gong: HTMLAudioElement;

    private playGongSecconds = [];
    private cicleDuration;
    private _isMuted: boolean;

    static createMetronome(intervals: number[], tik: string, gong: string, isMute: boolean = false): Metronome {
        if (!intervals ||
            intervals.length == 0 ||
            !tik ||
            !gong
        ) {
            return;
        }

        const metronome = new Metronome();
        metronome.tik = new Audio(tik);
        metronome.gong = new Audio(gong);
        metronome.isMuted = isMute;

        let prevIntervalsSum = 0;

        for (let i of intervals) {
            prevIntervalsSum += Number(i);
            metronome.playGongSecconds.push(prevIntervalsSum);
        }

        metronome.cicleDuration = intervals.reduce((a, b) => a + (+b), 0);
        return metronome;
    }

    public toggleMute() {
        this._isMuted = !this._isMuted;
    }
    
    public get isMuted() : boolean {
        return this._isMuted;
    }
    
    public set isMuted(v : boolean) {
        this._isMuted = v;
    }
    
    nextTik(second: number) {
        if (this._isMuted) {
            return;
        }
        
        const cicleSeccond = (second % this.cicleDuration) + 1;
        if (this.playGongSecconds.includes(cicleSeccond)) {
            // play one more time
            this.gong.currentTime = 0.0;
            this.gong.play();
            // console.log(second, cicleSeccond,'gong');
        } else {
            // play one more time
            this.tik.currentTime = 0.0;
            this.tik.play();
            // console.log(second, cicleSeccond,'tik');
        }
    }
}