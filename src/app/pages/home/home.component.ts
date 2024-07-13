//rename folder and file with the new name , is not upload

import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
//import {ModellerService} from '../../core/services/modeller/modeller.service';
//import {PaletteElementModel} from '../../shared/models/PaletteElement.model';
import { MatDialog } from '@angular/material/dialog';
import {filter, finalize, switchMap, take, tap} from 'rxjs/operators';
//import {AuthService} from '../../core/services/auth/auth.service';


@Component({
  selector: 'app-modelling-environment',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  propElement: Object;
  showProp: boolean;
  isLoading = false;  // boolean loading indicator flag

  constructor() {
    this.showProp = false;
  }

  ngOnInit() {

  }



  async loadPrefixesPreparation() {


  }
  async loadPrefixesPreparationFromGithub() {

  }

}
