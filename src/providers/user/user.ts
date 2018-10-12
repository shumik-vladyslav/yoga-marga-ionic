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
  static user: any = {};
  static id: any;
  static userStatic;

  constructor(
  ) {
    console.log("Hello UserProvider Provider");
  }

  static async Init(afs, userId) {
    // const docSnapshot = 
    await afs
      .doc(`users/${userId}`)
      .get()
      .subscribe(docSnapshot => {
        console.log('docSnapshot', docSnapshot);
        if (!docSnapshot.exists) return;
        console.log('user', docSnapshot.data());
        this.id = docSnapshot.id;
        this.user = docSnapshot.data();
      });
  }

  static getUser = () => UserProvider.userStatic;

  static getUserGoals = () => UserProvider.user.goals;

  static getUserPractices = () => UserProvider.user.practices;

  static getUserPractAchievement() {
    const result = [];
    const practices = this.user.practices;
    for (const id in practices) {
      if (practices.hasOwnProperty(id)) {
        const practice = practices[id];
        result.push({ 
          name: id, 
          achivement: practice.amountCounter?practice.amountCounter:practice.timespan,
          goal: this.user.goals[id]});
      }
    }

    return result;
  }
}
