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
    permutations:any[] = [];
    travelTime:any[] = [];
    destinations:any;


    loader = this.loadingController.create({
        content: 'Finding best routes...',
        spinner: 'bubbles'
      });

    constructor(private loadingController: LoadingController, public navCtrl: NavController, public navParams: NavParams) {
      console.log("receiving data: ",this.navParams.data);
      this.origin = this.navParams.data.origin[0].latLng
      this.destA = this.navParams.data.destination[this.navParams.data.destination.length-1];
      this.waypointsSent = this.navParams.data.destination.slice(0, -1);

      this.destinations = this.navParams.data.destination;
      this.travelTime = this.navParams.data.travelTimes;
      this.permutations = this.navParams.data.permutations;
      console.log("travelTime ", this.travelTime, " permutations ", this.permutations);

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
  fastest: any[] = [];
  getFastestRoute(){
    let time1: number = 0;
    let time2: number = 99999999;
    for(var x = 0; x<(this.permutations.length); x++){
      for(var y = 0; y<this.permutations[x].length-1; y++){
        time1+=this.travelTime[this.permutations[x][y]][this.permutations[x][y+1]];
      }
      if (time1<time2){
        time2 = time1;
        this.fastest[0]=(this.permutations[x])
      }
      //  console.log("---", "time1:", time1, " time2: ",time2, " fastest: ",this.fastest)
      time1 = 0;
    }
    time2 = 999999;
  }
 waypts = [];
   calculateAndDisplayRoute(directionsService, directionsDisplay) {
    this.getFastestRoute()
     this.waypts = [];
     this.fastest[0].shift()
     this.fastest[0]= this.fastest[0].map(x=>x-1);
    //  console.log("check here", this.waypointsSent, this.destinations, this.fastest[0])
    for (var i = 0; i < this.destinations.length-1; i++) {
      // console.log("fastest:",this.fastest, this.fastest[0][i])
      var tempObj= {
       location: this.destinations[this.fastest[0][i]].latLng,
       stopover: true
      };
      this.waypts.push(tempObj);
    }
      // console.log("final check: origin ", this.origin, " waypoints, ", waypts, " destination: ",this.destinations[this.fastest[0][this.fastest.length-1]] )
      directionsService.route({
        origin: this.origin.toString(),
        destination: this.destinations[this.fastest[0][this.fastest[0].length-1]].latLng.toString(),
        waypoints: this.waypts,
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
      for( var item of this.waypts){
        waypoints+=item.latLng;
        waypoints+='+to:';
      }
    LaunchNavigator.navigate(waypoints+this.destinations[this.fastest[0][this.fastest[0].length-1]].latLng.toString(), {start: this.origin.toString()})
        .then(

    );
  };

}
