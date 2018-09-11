import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the SharedServicesSettingsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SettingsProvider {
  settings = {
    fullTime: 0,
    eachTime: 0,
    pomniTime: 0,
    soloPomniFlag: false,
    multiPomniFlag: false
  };

  data = [
    {
      name: 'Тадасана',
      description: `Стоим прямо.`,
      url: '/assets/imgs/photo/asana-2/asana1.jpg',
      time: 0,
      defTime: 3000,
      skipFlag: false
    },
    {
      name: 'Врикшасана',
      description: `Дерево в лево.`,
      url: '/assets/imgs/photo/asana-2/asana2-1.jpg',
      time: 0,
      defTime: 3000,
      skipFlag: false
    },
    {
      name: 'Врикшасана',
      description: `Верево в право.`,
      url: '/assets/imgs/photo/asana-2/asana2-2.jpg',
      time: 0,
      defTime: 3000,
      skipFlag: false
    },
    {
      name: 'Триконасана',
      description: `Триконасана подготовка.`,
      url: '/assets/imgs/photo/asana-2/asana3-1.jpg',
      time: 0,
      defTime: 3000,
      skipFlag: true
    },
    {
      name: 'Триконасана',
      description: `Триконасана лево.`,
      url: '/assets/imgs/photo/asana-2/asana3-2.5.jpg',
      time: 0,
      defTime: 3000,
      skipFlag: false
    },
    {
      name: 'Триконасана',
      description: `Триконасана право.`,
      url: '/assets/imgs/photo/asana-2/asana3-3.jpg',
      time: 0,
      defTime: 3000,
      skipFlag: false
    },
    {
      name: 'Триконасана',
      description: `Триконасана перевернутая в лево.`,
      url: '/assets/imgs/photo/asana-2/asana4-1.2.jpg',
      time: 0,
      defTime: 3000,
      skipFlag: false
    },
    {
      name: 'Триконасана',
      description: `Триконасана перевернутая в право.`,
      url: '/assets/imgs/photo/asana-2/asana4-2.jpg',
      time: 0,
      defTime: 3000,
      skipFlag: false
    },
  ]

  constructor(public http: HttpClient) {
    console.log('Hello SharedServicesSettingsProvider Provider');
  }

  setSettings(obj){
    this.settings = obj;
  }

  getSettings(){
    return this.settings;
  }

  getData(){
    return this.data;
  }
}
