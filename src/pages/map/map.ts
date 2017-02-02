import { Component, ViewChild, ElementRef } from '@angular/core';
import { LoadingController, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { LaunchNavigator, LaunchNavigatorOptions } from 'ionic-native';

declare var google;
var StopIteration: any = "hi";

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
    allPossibilities:any[] = [];
    allPossibilitiesLocations:any[] = [];
    // Array of Distances
    // allPossibilities = [[15658, 15990],[842, 15912]];
    // Array of travel order possibilities (latLng each index)
    // allPossibilitiesLocations = [['Portland','Medford','Vancouver'],['Portland','Vancouver','Medford']];

    loader = this.loadingController.create({
        content: 'Finding best routes...',
        spinner: 'bubbles'
      });

    constructor(private loadingController: LoadingController, public navCtrl: NavController, public navParams: NavParams) {
      console.log("receiving data: ",this.navParams.data);
      this.origin = this.navParams.data.origin[0].latLng
      this.destA = this.navParams.data.destination[this.navParams.data.destination.length-1];
      this.waypointsSent = this.navParams.data.destination.slice(0, -1);
      this.allPossibilities = this.navParams.data.travelTimes;
      this.allPossibilitiesLocations = this.navParams.data.permutations;
      console.log("poss ", this.allPossibilities, " possloc ", this.allPossibilitiesLocations);

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
      this.fastRouteAlgorithm(this.allPossibilities);
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

  lowestTime(fastest_time_var, allPosArray) {
    console.log(fastest_time_var, " and ", allPosArray, " and ", this.allPossibilitiesLocations);
    console.log("FUCK ME TO TEARS", allPosArray.indexOf(fastest_time_var));
    var theIndex = allPosArray.indexOf(fastest_time_var);
    return this.allPossibilitiesLocations[theIndex];
  };

  fastRouteAlgorithm(allPossibilities){

    let allTimes = [];
    let total_result = 0;
    let fastest_time = 0;



      allPossibilities.forEach((innerArray, i) => {
      total_result = 0;
      innerArray.forEach((time_to, i2) => {
        console.log("math happening", total_result);
        total_result += time_to;

      if(i === 0){
        fastest_time = total_result
      } else if( i !== 0 && (innerArray.length -1) === i2) {
        if(total_result < fastest_time){
          fastest_time = total_result
        };
      };

      if(total_result > fastest_time || total_result === 0){
        // console.log("break");
        // console.log("being pushed", i);
        // console.log(total_result);
        allTimes.push(9999999);
      } else if((innerArray.length -1) === i2){
        // console.log("being pushed", i, " ", total_result);
        allTimes.push(total_result);
      };
      // console.log(fastest_time, " total " + total_result);
     });
    });
    console.log(fastest_time, allTimes);
    console.log("Diego joto", this.lowestTime(fastest_time, allTimes));
  }


}
