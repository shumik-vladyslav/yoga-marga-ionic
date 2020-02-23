import { ActivationWarningPage } from './../pages/activation-warning/activation-warning';
import { SignUpPage } from './../pages/sing-up/sing-up';
import { AngularFirestore } from "@angular/fire/firestore";
import { UserProvider } from "./../providers/user/user"; 
import { AuthProvider } from "./../providers/auth/auth";
import { Component, ViewChild } from "@angular/core";
import { Nav, Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

import { HomePage } from "../pages/home/home";
import { SingInPage } from "../pages/sing-in/sing-in";
import { ComplexsPage } from "../pages/complexs/complexs";
import { MyComplexsPage } from "../pages/my-complexs/my-complexs";
import { PrivateOfficePage } from "../pages/private-office/private-office";
import { SettingsPage } from "../pages/settings/settings";
import { AngularFireAuth } from "@angular/fire/auth";
import { PracticeSearchPage } from '../pages/practice-search/practice-search';
import { ImgCacheService } from '../directives/ng-imgcache/img-cache.service';
import { AllPracticesPage } from '../pages/all-practices/all-practices';


@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav)
  nav: Nav;

  // rootPage: any = SingInPage;
  rootPage: any;

  pages: Array<{ title: string; icon: string; component: any }>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public authP: AuthProvider,
    private userP: UserProvider,
    private afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public imgCache: ImgCacheService
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      {
        title: "Каталог",
        icon: "/assets/icon/svg/navigation/icon-nav1.svg",
        component: AllPracticesPage
      },
      
      {
        title: "Комплексы",
        icon: "/assets/icon/svg/navigation/icon-nav2.svg",
        component: ComplexsPage
      },
      {
        title: "Личный кабинет",
        icon: "/assets/icon/svg/navigation/icon-nav3.svg",
        component: PrivateOfficePage
      },
      {
        title: "Обратная связь",
        icon: "/assets/icon/svg/navigation/icon-nav4.svg",
        component: SettingsPage
      },
      {
        title: "Найти практику",
        icon: "/assets/icon/svg/navigation/icon-nav5.svg",
        component: PracticeSearchPage
      },
    ];

    this.authP.getInstance();
  }

  signOut() {
    this.afAuth.auth.signOut().then(
      res => {
        this.nav.setRoot(SingInPage);
        this.menyIsEnabled = false;
      }
    )
  }
  menyIsEnabled;
  initializeApp() {
    this.platform.ready().then(() => {
      // TODO Init current user

      this.afAuth.authState.subscribe((user: firebase.User) => {
        if (user) {
          UserProvider.Init(this.afs, user.email).then(res => {
            console.log('user init', res);
            if (res && res.active && res.active == true ) {
              this.rootPage = PracticeSearchPage;
              this.menyIsEnabled = true;
            } else {
              this.rootPage = ActivationWarningPage;
              this.menyIsEnabled = false;
            }
            this.statusBar.styleDefault();
            this.splashScreen.hide();
          });
        } else {
          this.afAuth.auth.signOut().then(
            _ => {
              this.rootPage = SingInPage;
              this.menyIsEnabled = false;
            }
          )
        }

        this.statusBar.styleDefault();
        this.splashScreen.hide();
      });

      console.log('app component');
      // Ensure you init once the platform is ready.
      // this.imgCache.init({
      //   cacheClearSize: 0,
      //   // debug: true,
      //   // useDataURI: true,
      //   skipURIencoding: true
      // }).then();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
