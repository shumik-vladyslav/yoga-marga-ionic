import { filter } from 'rxjs/operators';
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
  static user:any = {};
  static id: any;
  static globalPractices;

  static afs: AngularFirestore;
  static uid;
  
  constructor() {
    console.log("Hello UserProvider Provider");
  }

  static stepFlag = false;

  // static userPractices() {
  //   return this.user.practices.filter(
  //     p => p.active !== false && UserProvider.arraysHasIntersection(UserProvider.user.groups, p.groups)
  //     )
  // }

  static Init(afs: AngularFirestore, userId): Promise<any> {
    this.afs = afs;
    this.uid = userId;
    return new Promise<any>((resolve,reject) => {
      afs
      .doc(`users/${userId}`)
      .snapshotChanges()
      .subscribe(action => {
        
        const docSnapshot = action.payload;

        if (!docSnapshot.exists) return;
        UserProvider.id = docSnapshot.id;
        UserProvider.user = docSnapshot.data();

        if (UserProvider.stepFlag) {
          resolve(UserProvider.user);
        } else {
          UserProvider.stepFlag = true;
        }
      });

    afs
      .collection(`practices`)
      .valueChanges()
      .subscribe(value => {
        
        if (UserProvider.stepFlag) {
          resolve(UserProvider.user);
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
  
  static arraysHasIntersection(arr1, arr2) {
    if (!arr1 && !arr2) {
      return true;
    } else if (!arr1) {
      return false;
    } else if (!arr2) {
      return false;
    } 
    const res = arr1.filter(value => -1 !== arr2.indexOf(value));
    return res.length > 0
  }
  
  static getGlobalPractices() {
    const res = {};
    const ps = UserProvider.globalPractices;

    for (const p in ps) {
      if (ps.hasOwnProperty(p)) {
        const item = ps[p];
        if (this.arraysHasIntersection(item.groups, this.user.groups)) {
          res[p] = item;
        }
      }
    }
    // return UserProvider.globalPractices.filter(p => this.arraysHasIntersection(p.groups, this.user.groups));
    return res;
  }

  static getUser = () => UserProvider.user;

  static updateUser (patch): Promise<void> {
    return this.afs.doc(`users/${this.uid}`).update(patch);
  }

  static sendFeedback (msg): Promise<any> {
    console.log(JSON.stringify({
      timestamp: Date.now(),
      user: this.uid,
      msg: msg
    }));
    
    return this.afs.collection(`feedbacks`).add({
      timestamp: Date.now(),
      user: this.uid,
      msg: msg
    })
  }

  static getComplexes() {
    
    const pr = UserProvider.globalPractices;
    const cm = UserProvider.user.complexes;
    
    if(!cm) return undefined;
    
    for (const val of cm) {
      val.ico = pr[val.practices[0]].ico;
    }
    return cm;
  }

  static getUserGoals() {
    const result = [];
    const gps = this.getGlobalPractices();
    const goals = UserProvider.user.goals;
    const practices = UserProvider.user.practices;
    if(!goals || !practices) return [];
    for (const key in goals) {
      if (goals.hasOwnProperty(key)) {
        if(!gps[key]) continue;
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
    return UserProvider.user.practices;
  }

  static getUserPractAchievement() {
    const result = [];
    const practices = UserProvider.user.practices;
    console.log("practices", practices);

    const gps = this.getGlobalPractices();
    for (const id in practices) {
      if (practices.hasOwnProperty(id)) {
        if(!gps[id]) continue;
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
