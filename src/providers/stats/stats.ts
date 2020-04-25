import { UserProvider } from './../user/user';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

/*
  Generated class for the StatsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StatsProvider {

  constructor(
    private afs: AngularFirestore
  ) {
    console.log('Hello StatsProvider Provider');
  }

  event(name: string, extra: object = null) {
    const u = UserProvider.getUser();
    let data = {
      timestamp: Date.now(),
      event_name: name,
      user_email: u.email,
      user_full_name: u.full_name?u.full_name:'',
      user_spiritual_name: u.spiritual_name?u.spiritual_name:''
    }
    if (extra) {
      Object.keys(extra).forEach(k => data[k] = extra[k]);
    }
    this.afs.collection('stat').add(data).then();
  }
}
