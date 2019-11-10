import { ComponentsModule } from './../components/components.module';
import { PracticesListPageModule } from './../pages/practices-list/practices-list.module';
import { ActivationWarningPageModule } from './../pages/activation-warning/activation-warning.module';
import { PracticeSearchPageModule } from './../pages/practice-search/practice-search.module';
import { ProgressChartDirective } from './../directives/progress-chart/progress-chart';
import { ExercisePerformancePageModule } from './../pages/exercise-performance/exercise-performance.module';
import { PracticePerformancePageModule } from './../pages/practice-performance/practice-performance.module';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule,AngularFireStorage } from '@angular/fire/storage';
import { File } from '@ionic-native/file';
import { IonicStorageModule } from '@ionic/storage';

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
import { LoadScreenPage } from '../pages/load-screen/load-screen';

import { SettingsProvider } from '../providers/shared-services-settings/shared-services-settings';
import { config } from '../config';
import { AuthProvider } from '../providers/auth/auth';
import { ExercisePerformancePage } from '../pages/exercise-performance/exercise-performance';
import { FileCacheProvider } from '../providers/file-cache/file-cache';
import { FileTransfer } from '@ionic-native/file-transfer';
import { UserProvider } from '../providers/user/user';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PracticeSearchPage } from '../pages/practice-search/practice-search';

import { DocumentViewer } from '@ionic-native/document-viewer';

import { ImgCacheModule } from '../directives/ng-imgcache/img-cache.module';
import { Insomnia } from '@ionic-native/insomnia';
import { LogPipe } from '../pipe/logPipe';
import { AppDatePipe } from '../pipe/datePipe';
import { PracticePerformancePage } from '../pages/practice-performance/practice-performance';
import { AppPipesModule } from '../pipe/pipes.module';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { ToastHelper } from '../utils/toals-helper';


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
    LoadScreenPage,
    ProgressChartDirective
  ],
  imports: [
    ComponentsModule,
    AppPipesModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(
      {
        name: '__filecache',
           driverOrder: ['indexeddb', 'sqlite', 'websql']
      }
    ),
    AngularFireModule.initializeApp(config.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence(),
    AngularFireStorageModule,
    AngularSvgIconModule,
    PracticePerformancePageModule,
    HttpClientModule,
    ExercisePerformancePageModule,
    FormsModule,
    ReactiveFormsModule,
    PracticeSearchPageModule,
    ActivationWarningPageModule,
    ImgCacheModule,
    PracticesListPageModule,
    PracticePerformancePageModule,
    ExercisePerformancePageModule
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
    LoadScreenPage,
    ProgressChartDirective,
    PracticeSearchPage,
    SettingsPage
    // PracticePerformancePage,
    // ExercisePerformancePage
  ],
  providers: [
    AngularFireStorage,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SettingsProvider,
    AuthProvider,
    FileCacheProvider,
    FileTransfer,
    File,
    UserProvider,
    DocumentViewer,
    Insomnia,
    FileOpener,
    ToastHelper
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}