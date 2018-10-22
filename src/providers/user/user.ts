import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AuthProvider } from "../auth/auth";

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {
  static user;
  static id: any;
  static userStatic;
  static globalPractices;

  static afs: AngularFirestore;
  static uid;
  constructor() {
    console.log("Hello UserProvider Provider");
  }

  static stepFlag = false;

  static Init(afs: AngularFirestore, userId): Promise<any> {
    this.afs = afs;
    this.uid = userId;
    return new Promise<any>((resolve,reject) => {
      afs
      .doc(`users/${userId}`)
      .snapshotChanges()
      .subscribe(action => {
        
        if (UserProvider.stepFlag) {
          resolve();
        } else {
          UserProvider.stepFlag = true;
        }
        
        const docSnapshot = action.payload;

        if (!docSnapshot.exists) return;
        UserProvider.id = docSnapshot.id;
        UserProvider.user = docSnapshot.data();
      });

    afs
      .collection(`practices`)
      .valueChanges()
      .subscribe(value => {
        
        if (UserProvider.stepFlag) {
          resolve();
        } else {
          UserProvider.stepFlag = true;
        }

        if (!value) return;
        const result: any = {};
        for (const val of value) {
          const tmp: any = val;
          result[tmp.id] = val;
        }
        UserProvider.globalPractices = result;
      });
    }); 
  }

  static getGlobalPractices() {
    return UserProvider.globalPractices;
  }

  static getUser = () => UserProvider.user;

  static updateUser (patch): Promise<void> {
    return this.afs.doc(`users/${this.uid}`).update(patch);
  }
  static getComplexes() {
    if (!this.user) return null;
    const pr = UserProvider.globalPractices;
    const cm = UserProvider.user.complexes;
    
    if(!cm) return undefined;
    
    for (const val of cm) {
      val.ico = pr[val.practices[0]].ico;
    }
    return cm;
  }

  static getUserGoals() {
    if (!this.user) return null;
    const result = [];
    const goals = UserProvider.user.goals;
    const practices = UserProvider.user.practices;

    for (const key in goals) {
      if (goals.hasOwnProperty(key)) {
        const goal = goals[key];
        let achivement;
        if (practices[key]) {
          achivement = practices[key].amountCounter
            ? practices[key].amountCounter
            : practices[key].timespan;
        } else {
          achivement = 0;
        }

        result.push({
          name: UserProvider.globalPractices[key]
            ? UserProvider.globalPractices[key].name
            : "",
          id: key,
          goal: +goal,
          achivement: achivement
        });
      }
    }
    return result;
  }

  static getUserPractices(){
    if (!UserProvider.user) return null;
    return UserProvider.user.practices;
  }

  static getUserPractAchievement() {
    if (!UserProvider.user) return null;
    const result = [];
    const practices = UserProvider.user.practices;
    console.log("practices", practices);

    for (const id in practices) {
      if (practices.hasOwnProperty(id)) {
        const practice = practices[id];
        result.push({
          id: id,
          name: UserProvider.globalPractices[id]
            ? UserProvider.globalPractices[id].name
            : "",
          achivement: practice.amountCounter
            ? practice.amountCounter
            : practice.timespan,
          goal: UserProvider.user.goals[id]
        });
      }
    }

    return result;
  }
}
