//rename folder and file with the new name , is not upload

import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {ModellerService} from '../../core/services/modeller/modeller.service';
import {PaletteElementModel} from '../../shared/models/PaletteElement.model';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-modelling-environment',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  propElement: Object;
  new_element: PaletteElementModel;
  showProp: boolean;

  constructor(private uploadService: ModellerService, public dialog: MatDialog) {
    this.showProp = false;
  }

  ngOnInit() {

  }
  }