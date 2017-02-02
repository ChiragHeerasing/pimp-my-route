import { Component, ViewChild, ElementRef } from '@angular/core';
import { LoadingController, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { LaunchNavigator, LaunchNavigatorOptions } from 'ionic-native';

declare var google;
declare var StopIteration;

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
    loader = this.loadingController.create({
        content: 'Finding best routes...',
        spinner: 'bubbles'
      });

    constructor(private loadingController: LoadingController, public navCtrl: NavController, public navParams: NavParams) {
      console.log("receiving data: ",this.navParams.data);
      this.origin = this.navParams.data.origin[0].latLng
      this.destA = this.navParams.data.destination[this.navParams.data.destination.length-1];
      this.waypointsSent = this.navParams.data.destination.slice(0, -1);

    }

    ionViewDidLoad(){

       this.loader.present().then(( )=>{
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

      })


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
      this.loader.dismiss();
      }


  navigate(){
    let waypoints= ''
      for( var item of this.waypointsSent){
        waypoints+=item.latLng;
        waypoints+='+to:';
      }
    LaunchNavigator.navigate(waypoints+this.destA.latLng.toString(), {start: this.origin.toString()})
        .then(

    );
  };

// Array of Distances
allPossibilities = [[15658, 15990],[842, 15912]];
// Array of travel order possibilities (latLng each index)
allPossibilitiesEng = [['Portland','Medford','Vancouver'],['Portland','Vancouver','Medford']];

  yo(){
    (() => {
      if(typeof StopIteration == "undefined") {
        StopIteration = new Error("StopIteration");
      }

      let oldForEach = Array.prototype.forEach;

      if(oldForEach) {
        Array.prototype.forEach = function() {
          try {
            oldForEach.apply(this, [].slice.call(arguments, 0));
          }
          catch(e) {
            if(e !== StopIteration) {
              throw e;
            }
          }
        };
      }
    })();

    let allTimes = [];
    let total_result = 0;
    let fastest_time = 0;

    this.allPossibilities.forEach(function(innerArray, i){
      total_result = 0;
      innerArray.forEach(function(time_to, i2){
        total_result += time_to;

      if(i === 0){
        fastest_time = total_result
      } else if( i !== 0 && (innerArray.length -1) === i2) {
        if(total_result < fastest_time){
          fastest_time = total_result
        };
      };

      if(total_result > fastest_time){
        console.log("break");
        allTimes.push(9999999);
        throw StopIteration;
      } else if((innerArray.length -1) === i2){
        allTimes.push(total_result);
      };

     });
    });
  }
  lowestTime(fastest_time_var, allPosArray) {
    return this.allPossibilitiesEng[allPosArray.indexOf(fastest_time_var)];
  };

}
