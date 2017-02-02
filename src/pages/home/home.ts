import { Component, ViewChild, ElementRef, OnChanges, NgZone, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, ModalController} from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { MapPage } from '../map/map';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalAutocompleteItems } from '../modal-autocomplete-items/modal-autocomplete-items';
import { PlacesPage } from '../places/places';
import { Http } from '@angular/http';
import { AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import {googleMapsKey} from '../../api-keys';

declare var google;

@Component({
  selector: 'home-page',
  templateUrl: 'home.html'
})
export class HomePage {
  myDestinations: boolean = false;
  startingLocation: boolean = false;
  addressDestinations = [];
  startAddress: any = {};
  latLng:string;
  placesLatLong: any;
  address:any = {
      place: '',
      set: false,
  };
  placesService:any;
  map: any;
  @ViewChild('map') mapElement: ElementRef;
  placedetails: any;
  destinationForm: FormGroup;
  currentLocationToggle: boolean = true;
  places: any;
  startAddressName: string;
  placesArray: any;
  oLat: any;
  oLng: any;
  locationsPermutations: any;
  travelTimes: any;
  roundtrip: boolean = false;

  constructor(private ref: ChangeDetectorRef,
    public http: Http,
    private modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private alertCtrl: AlertController) {
    this.destinationForm = formBuilder.group({
       destination: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9]*')])],
   });
  }

  showStartingLocationContent() {
    if(this.startingLocation === true) {
        this.startingLocation = false;
    } else {
      this.startingLocation = true
    }
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad MapPage');
    this.loadMap();
  }
  loadMap(){
    Geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.oLat = position.coords.latitude;
      this.oLng = position.coords.longitude;
      this.placesLatLong = latLng;
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    }, (err) => {
      console.log(err);
    });
  }

  showModal() {
      this.reset();
      let modal = this.modalCtrl.create(ModalAutocompleteItems);
      modal.onDidDismiss(data => {
          // console.log('page > modal dismissed > data > ', data);
          if(data){
              this.address.place = data.description;
              this.getPlaceDetail(data.place_id,"dest");
          }
      })
      this.navCtrl.push(modal);
  }
  addCustomOrigin() {
    if (!this.currentLocationToggle){
    this.startAddress = {};
    this.startAddressName = "";
      let modal = this.modalCtrl.create(ModalAutocompleteItems);
      modal.onDidDismiss(data => {
          // console.log('page > modal dismissed > data > ', data);
          if(data){
              this.address.place = data.description;
              this.getPlaceDetail(data.place_id,"origin");
              this.startAddressName = data.description;
          }
      })
      this.navCtrl.push(modal);
      }
  }

  private reset() {
    this.address.place = '';
  }

  private getPlaceDetail(place_id:string, type:string):void {
      var self = this;
      var request = {
          placeId: place_id
      };
       this.placesService = new google.maps.places.PlacesService(this.map);
       if(type == "dest"){
        this.placesService.getDetails(request, callbackDest)
      } else if (type == "origin") {
        this.placesService.getDetails(request, callbackAddr)
      }

      function callbackDest(place, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
              self.latLng = place.geometry.location.lat()+","+place.geometry.location.lng();
              var addressObj = {
                name: place.formatted_address,
                latLng: self.latLng
              };
              self.addressDestinations.push(addressObj);
              self.ref.detectChanges()
              // console.log("added destination, here is the new array", self.addressDestinations)
          }else{
          }
      }

      function callbackAddr(place, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
              self.latLng = place.geometry.location.lat()+","+place.geometry.location.lng();
              var addressObj = {
                name: place.formatted_address,
                latLng: self.latLng
              };
              self.startAddress = addressObj;
              self.myDestinations = true;
          }else{
            //   console.log('page > getPlaceDetail > status > ', status);
          }
      }
  }
  goToPlaces(){
    // this.reset();
      let placesModal = this.modalCtrl.create(PlacesPage);
      placesModal.onDidDismiss(data => {
        //   console.log('page > placesModal dismissed > data > ', data);
          if(data){
              // console.log("places data back",data);
              let places = {
                name: data[0].name,
                latLng:[`${data[1].geometry.location.lat()},${data[1].geometry.location.lng()}`,
                        `${data[2].geometry.location.lat()},${data[2].geometry.location.lng()}`,
                        `${data[3].geometry.location.lat()},${data[3].geometry.location.lng()}`,
                        `${data[4].geometry.location.lat()},${data[4].geometry.location.lng()}`,
                        `${data[5].geometry.location.lat()},${data[5].geometry.location.lng()}`
                       ]
              }
              this.addressDestinations.push(places)
              // console.log(this.addressDestinations)
          }
      })
      let data = {
        lat: ["121"],
        lng: ["212"]
      }
      console.log("passing data:", data)
      this.navCtrl.push(placesModal, data);
  }

  starAddressDef() {
    // console.log(this.startAddress);
  }

  showDestinations() {
    if (this.myDestinations === true) {
      this.myDestinations = false;
    } else {
      this.myDestinations = true;
    }
  }

  permutator = (inputArr) => {
    let result = [];

    const permute = (arr, m = []) => {
      if (arr.length === 0) {
        result.push(m)
      } else {
        for (let i = 0; i < arr.length; i++) {
          let curr = arr.slice();
          let next = curr.splice(i, 1);
          permute(curr.slice(), m.concat(next))
      }
    }
  }

  permute(inputArr)

  return result;
  }



  getJson(originLatLng){
    let travelTimes: any[] = [];
    let baseUrl = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=';
    let latlngs = originLatLng+"|";
    let unixTime = Math.floor(Date.now()/1000).toString();
    let key = googleMapsKey;
    let addressArray: any[] = []
    // console.log("origin", this.addressDestinations)
    for (var i in this.addressDestinations){
      addressArray.push(parseInt(i)+1);
      latlngs+=this.addressDestinations[i].latLng;
      latlngs+="|"
    }

    console.log("latlngs", latlngs)

    this.http.get(baseUrl+latlngs+'&destinations=' + latlngs + '&departure_time='+ unixTime+'&traffic_model=best_guess&key='+key).map(res => res.json()).subscribe(data => {
      // console.log(data)
        for (var x in data.rows) {
          travelTimes[x] = new Array(data.rows);
          for (var y in data.rows[x].elements){
              travelTimes[x][y] = data.rows[x].elements[y].duration.value;
          }
        }
        });
        // console.log(travelTimes);
        // console.log("permu",addressArray," ", this.permutator(addressArray));
        this.locationsPermutations = this.permutator(addressArray)
        this.travelTimes = travelTimes;
  }

  getRoutes($event) {
    let originLatLng= "";
    (Object.keys(this.startAddress).length == 0) ? originLatLng=`${this.oLat},${this.oLng}` : originLatLng=this.startAddress.latLng ;
    if (this.addressDestinations.length === 0) {
      this.presentAlert();
    } else {
      this.getJson(originLatLng);
      for(var j in this.locationsPermutations){
        this.locationsPermutations[j].unshift(0)
        // console.log(this.locationsPermutations[j])
      }

      let data = {
        origin: [originLatLng],
        destination: this.addressDestinations,
        permutations: this.locationsPermutations,
        travelTimes: this.travelTimes,
        roundTrip: this.roundtrip
      }
      console.log("passing data:", data)
      this.navCtrl.push(MapPage, data);
    }
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'No Destinations',
      subTitle: 'Please enter at least one destination',
      buttons: ['Dismiss']
    });
    alert.present();
  }

  deleteDestination(address) {
    var counter = 0
    this.addressDestinations.forEach(destination => {
      if(address === destination) {
        this.addressDestinations.splice(counter, 1)
      }
      counter += 1;
    });
    this.ref.detectChanges()
  }

  deleteOriginDestination(startAddressName) {
    this.startAddressName = "";
    this.ref.detectChanges;
    this.currentLocationToggle = true;
  }

  activeStartingColor() {
    if (this.startingLocation === true) {
      return 'red';
    } else {
      return 'black';
    }
  }
  activeDestColor() {
    if (this.myDestinations === true) {
      return 'red';
    } else {
      return 'black';
    }
  }

}
