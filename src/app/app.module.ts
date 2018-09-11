import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { HttpClientModule } from '@angular/common/http'

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SignUpPage } from '../pages/sing-up/sing-up';
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
import { GoalsPage } from '../pages/goals/goals';
import { SettingsPage } from '../pages/settings/settings';
import { TermsPage } from '../pages/terms/terms';
import { Template_1Page } from '../pages/template-1/template-1';
import { Template_2Page } from '../pages/template-2/template-2';
import { Template_3Page } from '../pages/template-3/template-3';
import { Template_4Page } from '../pages/template-4/template-4';
import { LoadScreenPage } from '../pages/load-screen/load-screen';
import { SettingsProvider } from '../providers/shared-services-settings/shared-services-settings';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SignUpPage,
    SingInPage,
    CreateComplexPage,
    AllPracticesPage,
    MorningPracticePage,
    EveningPracticePage,
    MeditativePracticesPage,
    ComplexsPage,
    MyComplexsPage,
    PrivateOfficePage,
    GoalsPage,
    SettingsPage,
    TermsPage,
    Template_1Page,
    Template_2Page,
    Template_3Page,
    Template_4Page,
    LoadScreenPage
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
    SignUpPage,
    SingInPage,
    CreateComplexPage,
    AllPracticesPage,
    MorningPracticePage,
    EveningPracticePage,
    MeditativePracticesPage,
    ComplexsPage,
    MyComplexsPage,
    PrivateOfficePage,
    GoalsPage,
    SettingsPage,
    TermsPage,
    Template_1Page,
    Template_2Page,
    Template_3Page,
    Template_4Page,
    LoadScreenPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SettingsProvider
  ]
})
export class AppModule {}
