import { Practice } from './../models/practice';
import { Exercise } from './../models/exercise';

export class ExercisesHelper {
    gong = new Audio("assets/sound/gong.mp3");
    practice: Practice;
    exercises: Exercise[];

    // current exercise;
    exercise: Exercise;

    exerciseIndex: number;
    exercisesCount: number;

    // current exercise duration
    duration: number;
    practiceDuration;
    // imgMirror: any;
    constructor(practice: Practice) {
        this.practice = practice;
        if (this.practice.settings.exercises && this.practice.settings.exercises.length > 0) {
            this.exercises = this.practice.settings.exercises;
        } else if (this.practice.exercises && this.practice.exercises.length > 0) {
            this.exercises = this.practice.exercises;
        }
        else return;

        this.exercisesCount = this.exercises.length;
        this.exerciseIndex = 0;
        this.exercise = this.exercises[0];
        this.practiceDuration = this.calculatePracticeDuration();
        this.duration = this.calculateExerciseDurations();
    }

    hasExercises() {
        return this.exercises;
    }

    // returns value in secconds
    calculateExerciseDurations() {
        if (!this.exercise) return null;
        // let duration  = Math.floor((this.practiceDuration / this.exercisesCount)/1000)*1000;
        return Math.floor(this.practiceDuration / this.exercisesCount);
    }

    /**
     * длительность практики и длетельность упражнения.
     * 1. Выставлена только длительность практики: ду = дп / ку
     * 2. Выставлена длительность практики, но в некоторых упражнениях изменена длительность: 
     * как только мы изменяем длительность хотябы в одном упражнении то во всех упражнениях выставляеться 
     * длительность ду = дп / ку а в этом конкретном та которая выставлена пользователем, и тогда 
     * дп = ду1 + ду2 + ... + дуN. Если в таком случае поменять длительность практики то все длительноси 
     * упражнений пересчитаются по фомуле ду = дп / ку.
     * Где ду - длительность упражнения, дп - длительность практики, ку - количество упражнений
     */
    // returns value in secconds
    calculatePracticeDuration() {
        if (!this.exercises) {
            return this.practice.settings.practiceDuration || 60 * 60 * 1000;
        }
        let summ = 0;
        for (let e of this.exercises) {
            if (e.exerciseDuration) {
                summ += +e.exerciseDuration;
            }
        }
        console.log('calculatePracticeDuration', summ);
        return Math.floor(summ / 1000);;
    }

    show;
    startTime;
    startExerciseTime;
    firstTick = true;

    createAudioFromUrl(url) {
        if (!url) return null;
        const audio = new Audio(url);
        // audio.addEventListener("ended", function () { this.currentTime = 0; this.play(); }, false);
        return audio;
    }

    nextTick(TIMER_INTERVAL) {
        // debugger
        if (!this.exercises) return;
        const now = Math.floor(performance.now() / 1000);
        console.log(now);
        if (this.firstTick) {
            this.startTime = now;
            this.startExerciseTime = this.startTime;

            this.show = {
                img: this.exercise.image,
                title: this.exercise.name,
                description: this.exercise.description,
                practiceTimer: this.practiceDuration * 1000,
                exerciseTimer: this.duration * 1000,
                imgMirror: this.exercise.imgMirror,
                audio: this.createAudioFromUrl(this.exercise.audio)
            }
            this.firstTick = false;
            return this.show;
        }


        // next exercise
        // if (now - this.startExerciseTime >= this.duration) {
        if (this.show.exerciseTimer <= 0) {
            // debugger
            this.startExerciseTime = now;
            this.privateNextExercise();
        }

        // this.show.practiceTimer = (this.practiceDuration - (now - this.startTime)) * 1000;
        // this.show.exerciseTimer = (this.duration - (now - this.startExerciseTime)) * 1000;
        this.show.practiceTimer = this.show.practiceTimer - TIMER_INTERVAL;
        this.show.exerciseTimer = this.show.exerciseTimer - TIMER_INTERVAL;
        return this.show;
    }

    paused = true;
    privateNextExercise() {
        this.gong.play();
        const now = Math.floor(performance.now() / 1000);
        // this.startExerciseTime = Date.now();
        this.startExerciseTime = now;
        this.exerciseIndex++;
        this.exercise = this.exercises[this.exerciseIndex];
        if (!this.exercise) {
            return;
        }
        this.duration = this.calculateExerciseDurations();

        this.show.img = this.exercise.image;
        this.show.title = this.exercise.name;
        this.show.description = this.exercise.description;
        this.show.imgMirror = this.exercise.imgMirror;
        this.show.exerciseTimer = this.duration * 1000;

        if (this.show.audio) {
            this.paused = this.show.audio.paused;
            this.show.audio.pause();
        }
        this.show.audio = this.createAudioFromUrl(this.exercise.audio);
        if (!this.paused && this.show.audio) {
            this.show.audio.play();
        }
    }

    onSkipExercise() {
        this.privateNextExercise();
        const now = Math.floor(performance.now() / 1000);
        this.startExerciseTime = now;
        // this.show.practiceTimer = this.practiceDuration - this.show.exerciseTimer;
        this.startTime = this.startTime - Math.floor(this.show.exerciseTimer / 1000);
        this.show.exerciseTimer = this.duration * 1000;
    }

    prevExercise() {

    }
}