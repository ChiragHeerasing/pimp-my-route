import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ModalController} from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { MapPage } from '../map/map';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalAutocompleteItems } from '../modal-autocomplete-items/modal-autocomplete-items';
import { PlacesPage } from '../places/places';

declare var google;

@Component({
  selector: 'home-page',
  templateUrl: 'home.html'
})
export class HomePage {
  addressDestinations = [];
  startAddress = [];
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

  constructor(private modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder) {
    this.destinationForm = formBuilder.group({
       destination: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9]*')])],
   });

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
      this.reset();
      let modal = this.modalCtrl.create(ModalAutocompleteItems);
      modal.onDidDismiss(data => {
          // console.log('page > modal dismissed > data > ', data);
          if(data){
              this.address.place = data.description;
              this.getPlaceDetail(data.place_id,"origin");
          }
      })
      this.navCtrl.push(modal);
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
        console.log("in");
      }

      function callbackDest(place, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
              self.latLng = place.geometry.location.lat()+","+place.geometry.location.lng();
              var addressObj = {
                formatted_address: place.formatted_address,
                latLng: self.latLng
              };
              self.addressDestinations.push(addressObj);
              console.log("added destination");
          }else{
            //   console.log('page > getPlaceDetail > status > ', status);
          }
      }

      function callbackAddr(place, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
              self.latLng = place.geometry.location.lat()+","+place.geometry.location.lng();
              var addressObj = {
                formatted_address: place.formatted_address,
                latLng: self.latLng
              };
              self.startAddress.push(addressObj);
              console.log(self.startAddress);
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
          }
      })
      this.navCtrl.push(placesModal);
  }


  getRoutes($event) {
      console.log("passing data:", this.latLng)
      this.navCtrl.push(MapPage, this.latLng);
  }
}
