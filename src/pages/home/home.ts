import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ModalController} from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { MapPage } from '../map/map';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PageGmapAutocomplete } from '../page-gmap-autocomplete/page-gmap-autocomplete';
import { ModalAutocompleteItems } from '../modal-autocomplete-items/modal-autocomplete-items';

declare var google;

@Component({
  selector: 'home-page',
  templateUrl: 'home.html'
})
export class HomePage {
  address:any = {
      place: '',
      set: false,
  };
  placesService:any;
  map: any;
  @ViewChild('map') mapElement: ElementRef;
  placedetails: any;
  destinationForm: FormGroup;
  currentLocationToggle: boolean = true;;
  constructor(private modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder) {
    this.destinationForm = formBuilder.group({
       destination: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9]*')])],
   });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
    this.initPlacedetails();
    this.loadMap();
  }
  loadMap(){

    Geolocation.getCurrentPosition().then((position) => {

      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

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
          console.log('page > modal dismissed > data > ', data);
          if(data){
              this.address.place = data.description;
              // get details
              this.getPlaceDetail(data.place_id);
          }
      })
      modal.present();
  }
  private reset() {
      // this.initPlacedetails();
      this.address.place = '';
      this.address.set = false;
  }
  private getPlaceDetail(place_id:string):void {
      var self = this;
      var request = {
          placeId: place_id
      };
       this.placesService = new google.maps.places.PlacesService(this.map);
        this.placesService.getDetails(request, callback)
      function callback(place, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
              // set full address
              self.placedetails.address = place.formatted_address;
              self.placedetails.lat = place.geometry.location.lat();
              self.placedetails.lng = place.geometry.location.lng();
              for (var i = 0; i < place.address_components.length; i++) {
                  let addressType = place.address_components[i].types[0];
                  let values = {
                      short_name: place.address_components[i]['short_name'],
                      long_name: place.address_components[i]['long_name']
                  }
                  if(self.placedetails.components[addressType]) {
                      self.placedetails.components[addressType].set = true;
                      self.placedetails.components[addressType].short = place.address_components[i]['short_name'];
                      self.placedetails.components[addressType].long = place.address_components[i]['long_name'];
                  }
              }
              // populate
              // self.address.set = true;
              console.log('page > getPlaceDetail > details > ', self.placedetails);
          }else{
              console.log('page > getPlaceDetail > status > ', status);
          }
      }
  }
  private initPlacedetails() {
      this.placedetails = {
          address: '',
          lat: '',
          lng: '',
          components: {
              route: { set: false, short:'', long:'' },                           // calle
              street_number: { set: false, short:'', long:'' },                   // numero
              sublocality_level_1: { set: false, short:'', long:'' },             // barrio
              locality: { set: false, short:'', long:'' },                        // localidad, ciudad
              administrative_area_level_2: { set: false, short:'', long:'' },     // zona/comuna/partido
              administrative_area_level_1: { set: false, short:'', long:'' },     // estado/provincia
              country: { set: false, short:'', long:'' },                         // pais
              postal_code: { set: false, short:'', long:'' },                     // codigo postal
              postal_code_suffix: { set: false, short:'', long:'' },              // codigo postal - sufijo
          }
      };
  }
  goToMap(){
    this.navCtrl.push(MapPage);
  }

  test(){
    this.navCtrl.push(PageGmapAutocomplete);
  }

  getRoutes($event) {
      this.navCtrl.push(MapPage, this.destinationForm.value.destination);
  }
}
