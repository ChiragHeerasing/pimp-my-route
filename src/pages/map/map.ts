import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Geolocation } from 'ionic-native';

declare var google;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

    destA: any;
    waypointsSent: any;
    @ViewChild('map') mapElement: ElementRef;
    map: any;
    directionsService: any;
    directionsDisplay: any;
    origin:any;


    constructor(public navCtrl: NavController, public navParams: NavParams) {
      console.log("receiving data: ",this.navParams.data);
      this.origin = this.navParams.data.origin[0].latLng
      this.destA = this.navParams.data.destination[this.navParams.data.destination.length-1];
      this.waypointsSent = this.navParams.data.destination.slice(0, -1);

    }

    ionViewDidLoad(){
      Geolocation.getCurrentPosition().then((position) => {
      if (this.origin === undefined){
        this.origin = `${position.coords.latitude},${position.coords.longitude}`
      }
        console.log("origin: ",this.origin)
        
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
     var waypts = [];

    for (var i = 0; i < this.waypointsSent.length; i++) {
      var tempObj= {
       location: this.waypointsSent[i].latLng,
       stopover: true
      };
      waypts.push(tempObj);
    }

      directionsService.route({
        origin: this.origin.toString(),
        destination: this.destA.latLng.toString(),
        waypoints: waypts,
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
