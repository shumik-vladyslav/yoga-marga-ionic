import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {
  // current user info
  user: firebase.User;
  userData;

  constructor(
    public http: HttpClient,
    public afAuth: AngularFireAuth,
    // public navCtrl: NavController,
  ) {
    this.getInstance();
  }

  getInstance() {
    if (!this.user) {
      this.afAuth.authState.subscribe(
        (user: firebase.User) => {
          // console.log('auth provicer current user', user);
          this.user = user;
          // if (this.user) {
          //   this.navCtrl.push(HomePage)
          // } else {
          //   this.navCtrl.push(SingInPage)
          // }
        }
      )
    } 
    return  this.user;
  }

  getUserId() {
    this.getInstance();
    return this.user.email;
  }

  getUserData() {
  }

}
