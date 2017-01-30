import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { MapPage } from '../map/map';
import { FormControl, FormGroup } from '@angular/forms';
declare var google;

@Component({
  selector: 'home-page',
  templateUrl: 'home.html'
})
export class HomePage {

  currentLocationToggle: boolean = true;
  destA: string;
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
  }

  goToMap(){
    this.navCtrl.push(MapPage);
  }

  getRoutes($event) {
    this.navCtrl.push(MapPage, this.destA);
  }
}
