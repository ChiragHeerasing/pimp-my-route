import { Component, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { NavController, NavParams, ModalController} from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { MapPage } from '../map/map';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalAutocompleteItems } from '../modal-autocomplete-items/modal-autocomplete-items';
import { PlacesPage } from '../places/places';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

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

  constructor(public http: Http, private modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder) {
    this.destinationForm = formBuilder.group({
       destination: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9]*')])],
   });

    this.http.get('https://maps.googleapis.com/maps/api/distancematrix/json?origins=Portland+OR|40.6655101,-73.89188969999998&destinations=Bridgewater+Commons,+Commons+Way,+Bridgewater,+NJ|The+Mall+At+Short+Hills,+Morris+Turnpike,+Short+Hills,+NJ|Monmouth+Mall,+Eatontown,+NJ|Westfield+Garden+State+Plaza,+Garden+State+Plaza+Boulevard,+Paramus,+NJ|Newport+Centre+Mall,+Jersey+City,+NJ&departure_time=1541202457&traffic_model=best_guess&key=AIzaSyCPy5-96A3XCWTruphGYRPd9fqj3y66BZ8').map(res => res.json()).subscribe(data => {
        console.log(data)
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
    console.log('ionViewDidLoad MapPage');
    this.loadMap();
  }
  loadMap(){
    Geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(-34.9290, 138.6010);
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
    this.startAddress = {};
    if (!this.currentLocationToggle){
      this.reset();
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
    this.startAddressName = "";
    this.address.place = '';
    this.startAddress = {};
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
              console.log("added destination");
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
              console.log("places data back",data);
              this.addressDestinations.push(data[0])
          }
      })
      this.navCtrl.push(placesModal);
  }

  starAddressDef() {
    console.log(this.startAddress);
  }

  showDestinations() {
    if (this.myDestinations === true) {
      this.myDestinations = false;
    } else {
      this.myDestinations = true;
    }
  }


  getRoutes($event) {
      let data = {
        origin: [this.startAddress],
        destination: this.addressDestinations
      }
      console.log("passing data:", data)
      this.navCtrl.push(MapPage, data);
  } 
}
