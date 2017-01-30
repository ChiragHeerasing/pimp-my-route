import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { MapPage } from '../map/map';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
declare var google;

@Component({
  selector: 'home-page',
  templateUrl: 'home.html'
})
export class HomePage {

  destinationForm: FormGroup;
  currentLocationToggle: boolean = true;;
  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder) {
    this.destinationForm = formBuilder.group({
       destination: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9]*')])],
   });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
  }

  goToMap(){
    this.navCtrl.push(MapPage);
  }

  getRoutes($event) {
    if (!this.destinationForm.valid){
      alert("you fucked up!")
    }else{
      this.navCtrl.push(MapPage, this.destinationForm.value.destination);
    }
  }
}
