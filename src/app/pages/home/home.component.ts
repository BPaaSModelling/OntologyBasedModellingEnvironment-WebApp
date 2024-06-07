//rename folder and file with the new name , is not upload

import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {ModellerService} from '../../core/services/modeller/modeller.service';
import {PaletteElementModel} from '../../shared/models/PaletteElement.model';
import { MatDialog } from '@angular/material/dialog';
import {filter, finalize, switchMap, take, tap} from 'rxjs/operators';
import {Auth0Service} from '../../core/services/auth/auth0.service';


@Component({
  selector: 'app-modelling-environment',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  propElement: Object;
  new_element: PaletteElementModel;
  showProp: boolean;


  constructor(private modellerService: ModellerService,
              public dialog: MatDialog,
              private authService: Auth0Service) {
    this.showProp = false;
  }

  ngOnInit() {
  }
}
