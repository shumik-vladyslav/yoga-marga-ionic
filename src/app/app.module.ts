import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { HttpClientModule } from '@angular/common/http'

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MainPage } from '../pages/main-page/main-page';
import { SingInPage } from '../pages/sing-in/sing-in';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CreateComplexPage } from '../pages/create-complex/create-complex';
import { AllPracticesPage } from '../pages/all-practices/all-practices';
import { MorningPracticePage } from '../pages/morning-practice/morning-practice';
import { EveningPracticePage } from '../pages/evening-practice/evening-practice';
import { MeditativePracticesPage } from '../pages/meditative-practices/meditative-practices';
import { ComplexsPage } from '../pages/complexs/complexs';
import { MyComplexsPage } from '../pages/my-complexs/my-complexs';
import { PrivateOfficePage } from '../pages/private-office/private-office';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MainPage,
    SingInPage,
    CreateComplexPage,
    AllPracticesPage,
    MorningPracticePage,
    EveningPracticePage,
    MeditativePracticesPage,
    ComplexsPage,
    MyComplexsPage,
    PrivateOfficePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularSvgIconModule,
    HttpClientModule,
   
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MainPage,
    SingInPage,
    CreateComplexPage,
    AllPracticesPage,
    MorningPracticePage,
    EveningPracticePage,
    MeditativePracticesPage,
    ComplexsPage,
    MyComplexsPage,
    PrivateOfficePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
