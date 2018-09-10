import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ComplexsPage } from '../complexs/complexs';

/**
 * Generated class for the CreateComplexPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-create-complex',
  templateUrl: 'create-complex.html',
})

export class CreateComplexPage {

  morningData = [
    {name: 'Крия-йога', checkId: '1'},
    {name: 'Сурья-намаскар', checkId: '2'},
    {name: 'Ассаны 1', checkId: '3'},
    {name: 'Ассаны 2', checkId: '4'},
    {name: 'Управление ветром 1', checkId: '5'},
    {name: 'Управление ветром 2', checkId: '6'},
    {name: 'Управление ветром 3', checkId: '7'},
    {name: 'Пранаяма анулома-вилома', checkId: '8'},
    {name: 'Пранаяма сахати-кумбхака', checkId: '9'},
    {name: 'Пранаяма бхастрика', checkId: '10'},
    {name: 'Маха-мудра', checkId: '11'},
    {name: 'Маха-бандха', checkId: '12'},
    {name: 'Маха-ведха', checkId: '13'},
    {name: 'Тройбадха-мудра', checkId: '14'},
    {name: 'Простирание', checkId: '15'},
    {name: 'Сукшма-вьяяма', checkId: '16'},
  ];

  eveningData = [
    {name: 'Випарита-карани', checkId: '17'},
    {name: 'Махашавамудра', checkId: '18'},
    {name: 'Молитва йоги сновидений', checkId: '19'},
    {name: 'Йога сновидений', checkId: '20'}
  ];

  meditativeData = [
    {name: 'Анапанасати', checkId: '21'},
    {name: 'Махашанти', checkId: '22'},
    {name: '4 БСБ', checkId: '23'},
    {name: 'Атма-вичар', checkId: '24'},
    {name: 'Мантра Ом', checkId: '25'},
    {name: 'Мантра Ом Драм Даттатрейяя намаха', checkId: '26'},
    {name: 'Чандали', checkId: '27'},
    {name: 'Мягкое масло', checkId: '28'},
    {name: 'Практика растирания', checkId: '29'},
    {name: '4 осознаности', checkId: '30'},
    {name: 'Практика очищения с опорой на 21 Ом', checkId: '31'},
    {name: 'Аналитическая медитация пустоты', checkId: '32'},
    {name: 'Концентрация грубая и тонкая', checkId: '33'},
    {name: '24 налитических медитации', checkId: '34'},
    {name: 'Чанкроманам (4 основы внимательности)', checkId: '35'},
    {name: 'Хотьба с заземлением', checkId: '36'},
    {name: 'Медитация на символ веры', checkId: '37'},
    {name: 'Визуализация Дерева Прибежища', checkId: '38'}
  ];
  
  ritualData = [
    {name: 'Сутра', checkId: '1'},
    {name: 'Бхаджан-мандала (по шести дням недели)', checkId: '39'},
    {name: 'Теургии', checkId: '40'},
    {name: 'Бхаджаны', checkId: '41'}
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  goComplexsPage(){
    this.navCtrl.setRoot(ComplexsPage);
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateComplexPage');
  }

}
