import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MapPage } from '../pages/map/map';
import { PageGmapAutocomplete } from '../pages/page-gmap-autocomplete/page-gmap-autocomplete';
import { ModalAutocompleteItems } from  '../pages/modal-autocomplete-items/modal-autocomplete-items';
import { PlacesPage } from '../pages/places/places';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MapPage,
    PageGmapAutocomplete,
    ModalAutocompleteItems,
    PlacesPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MapPage,
    PageGmapAutocomplete,
    ModalAutocompleteItems,
    PlacesPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
