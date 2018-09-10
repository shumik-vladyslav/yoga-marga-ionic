import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { SignUpPage } from '../pages/sing-up/sing-up';
import { SingInPage } from '../pages/sing-in/sing-in';
import { ComplexsPage } from '../pages/complexs/complexs';
import { MyComplexsPage } from '../pages/my-complexs/my-complexs';
import { PrivateOfficePage } from '../pages/private-office/private-office';
import { SettingsPage } from '../pages/settings/settings';
import { Template_1Page } from '../pages/template-1/template-1';
import { Template_2Page } from '../pages/template-2/template-2';
import { Template_3Page } from '../pages/template-3/template-3';
import { Template_4Page } from '../pages/template-4/template-4';
import { LoadScreenPage } from '../pages/load-screen/load-screen';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Template_4Page;
  // rootPage: any = SingInPage;
  

  pages: Array<{title: string, icon:string, component: any}>;
 
  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Коталог', icon: '/assets/icon/svg/navigation/icon-nav1.svg', component: HomePage },
      { title: 'Комплексы', icon: '/assets/icon/svg/navigation/icon-nav2.svg', component: ComplexsPage },
      { title: 'Личный кабинет', icon: '/assets/icon/svg/navigation/icon-nav3.svg', component: PrivateOfficePage },
      { title: 'Настройки', icon: '/assets/icon/svg/navigation/icon-nav4.svg', component: SettingsPage },
      { title: 'Дхарма-вичара', icon: '/assets/icon/svg/navigation/icon-nav5.svg', component: SignUpPage },
      { title: 'Выйти', icon: '/assets/icon/svg/navigation/icon-nav6.svg', component: SignUpPage },
      { title: '', icon: '', component: '' },
      { title: 'sing-in', icon: '/assets/icon/svg/navigation/icon-nav3.svg', component: SingInPage },
      { title: 'sing-up', icon: '/assets/icon/svg/navigation/icon-nav3.svg', component: SignUpPage },
      { title: 'my-complexs', icon: '/assets/icon/svg/navigation/icon-nav3.svg', component: MyComplexsPage },
      { title: 'template-1', icon: '/assets/icon/svg/navigation/icon-nav3.svg', component: Template_1Page },
      { title: 'template-2', icon: '/assets/icon/svg/navigation/icon-nav3.svg', component: Template_2Page },
      { title: 'template-3', icon: '/assets/icon/svg/navigation/icon-nav3.svg', component: Template_3Page },
      { title: 'template-4', icon: '/assets/icon/svg/navigation/icon-nav3.svg', component: Template_4Page },
      { title: 'load-screen', icon: '/assets/icon/svg/navigation/icon-nav3.svg', component: LoadScreenPage },

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
