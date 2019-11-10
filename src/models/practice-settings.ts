export class PracticeSettings {
    reminderDuration: number;
    // practice duration
    practiceDuration: number;
    exerciseDuration: number;
    exercises?: any[];
    // intervalse for metronome
    intervals?: [{ value: number }];
    // total time spent in the practice
    spentTime: number;
    singleReminder: boolean;
    multiReminder: boolean;
    metronomeFlag: boolean;
    maxAchevement?: number;
    amountCounter?: number;

    spentTimeGoal?: number;
    maxAchevementGoal?: number;
    amountCounterGoal?: number;
    
    // fabric method
    public static createInstance(): PracticeSettings {
        return {
            reminderDuration: 60 * 1000,
            // practice duration
            practiceDuration: 60 * 60 * 1000,
            exerciseDuration: 0,
            intervals: [{ value: 1 }],
            // total time spent in the practice
            spentTime: 0,
            singleReminder: false,
            multiReminder: false,
            metronomeFlag: false
        }
    }
}