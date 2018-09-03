import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { MainPage } from '../pages/main-page/main-page';
import { SingInPage } from '../pages/sing-in/sing-in';
import { CreateComplexPage } from '../pages/create-complex/create-complex';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, icon:string, component: any}>;
 
  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Коталог', icon: '/assets/icon/svg/navigation/icon-nav1.svg', component: HomePage },
      { title: 'Комплексы', icon: '/assets/icon/svg/navigation/icon-nav2.svg', component: MainPage },
      { title: 'Личный кабинет', icon: '/assets/icon/svg/navigation/icon-nav3.svg', component: MainPage },
      { title: 'Настройки', icon: '/assets/icon/svg/navigation/icon-nav4.svg', component: MainPage },
      { title: 'Дхарма-вичара', icon: '/assets/icon/svg/navigation/icon-nav5.svg', component: MainPage },
      { title: 'Выйти', icon: '/assets/icon/svg/navigation/icon-nav6.svg', component: MainPage },
      { title: 'sing-in', icon: '/assets/icon/svg/navigation/icon-nav3.svg', component: SingInPage },
      { title: 'sing-up', icon: '/assets/icon/svg/navigation/icon-nav3.svg', component: MainPage },
      { title: 'crete-complex', icon: '/assets/icon/svg/navigation/icon-nav3.svg', component: CreateComplexPage },

    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
