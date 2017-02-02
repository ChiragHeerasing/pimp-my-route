import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ViewController, NavController } from 'ionic-angular';
import { HomePage } from '../home/home';

declare var google: any;

@Component({
    selector: 'page-modal-autocomplete-items',
    templateUrl: 'modal-autocomplete-items.html'
})
export class ModalAutocompleteItems implements OnInit{

    autocompleteItems: any;
    autocomplete: any;
    acService:any;
    placesService: any;

    constructor(private ref: ChangeDetectorRef,public viewCtrl: ViewController, private nav: NavController) {
    }

    ngOnInit() {
        this.acService = new google.maps.places.AutocompleteService();
        this.autocompleteItems = [];
        this.autocomplete = {
            query: ''
        };
    }

    navigate(){
      this.nav.pop(HomePage);
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    chooseItem(item: any) {
        // console.log('modal > chooseItem > item > ', item);
        this.viewCtrl.dismiss(item);
    }

    updateSearch() {
        console.log('modal > updateSearch');
        if (this.autocomplete.query == '') {
            this.autocompleteItems = [];
            return;
        }
        let self = this;
        let config = {
            types:  ['geocode'],
            input: this.autocomplete.query,
            componentRestrictions: { country: 'US' }
        }
        this.acService.getPlacePredictions(config, function (predictions, status) {
            // console.log('modal > getPlacePredictions > status > ', status);
            self.autocompleteItems = [];
            predictions.forEach(function (prediction) {
                self.autocompleteItems.push(prediction);
                self.ref.detectChanges()
            });
        });
    }

}
