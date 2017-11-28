import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {ModellerService} from "../modeller.service";
import {MetamodelElementModel} from "../_models/MetamodelElement.model";
import {PaletteElementModel} from "../_models/PaletteElement.model";
import {PropertyWindowComponent} from "../property-window/property-window.component";
import {MatDialog} from "@angular/material";

@Component({
  selector: 'app-modelling-environment',
  templateUrl: './modelling-environment.component.html',
  styleUrls: ['./modelling-environment.component.css']
})
export class ModellingEnvironmentComponent implements OnInit {
  propElement: Object;
  new_element: PaletteElementModel;
  showProp: boolean;

  constructor(private modellerService: ModellerService, public dialog: MatDialog) {
    this.showProp = false;
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {

  }

  sendElementToCanvas(new_element: PaletteElementModel) {
    this.new_element = new_element;
  }

  togglePropertyWindow(element: Object){
    console.log("ricevuto elemento " + element);

      let dialogRef = this.dialog.open(PropertyWindowComponent, {
        height:'500px',
        disableClose: true,
      });

  }
}

// https://github.com/shlomiassaf/ngx-modialog
