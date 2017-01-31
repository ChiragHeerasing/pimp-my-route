import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Geolocation } from 'ionic-native';

declare var google;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

    destA: string;
    @ViewChild('map') mapElement: ElementRef;
    map: any;
    directionsService: any;
    directionsDisplay: any;
    origin:any;

    constructor(public navCtrl: NavController, public navParams: NavParams) {

      this.destA = this.navParams.data

    }

    ionViewDidLoad(){
      Geolocation.getCurrentPosition().then((position) => {
        this.origin = `${position.coords.latitude},${position.coords.longitude}`
        console.log("receiving data: ",this.navParams.data);
        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        this.directionsService = new google.maps.DirectionsService;
        this.directionsDisplay = new google.maps.DirectionsRenderer;
        this.directionsDisplay.setMap(this.map);
        this.calculateAndDisplayRoute(this.directionsService, this.directionsDisplay);
      },(err) => {
        console.log(err);
      });

    }
   calculateAndDisplayRoute(directionsService, directionsDisplay) {
        directionsService.route({
          origin: this.origin.toString(),
          destination: this.destA.toString(),
          travelMode: 'DRIVING'
        }, function(response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      }
}
