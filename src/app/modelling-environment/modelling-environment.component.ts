import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {ModellerService} from "../modeller.service";
import {MetamodelElementModel} from "../_models/MetamodelElement.model";
import {PaletteElementModel} from "../_models/PaletteElement.model";
import {ModalInstancePropertiesComponent,} from "../modal-instance-properties/modal-instance-properties.component";
import {MatDialog} from "@angular/material";
import {ModalPaletteElementPropertiesComponent} from "../modal-palette-element-properties/modal-palette-element-properties.component";
import {ModalExtendPaletteElementComponent} from "../modal-extend-palette-element/modal-extend-palette-element.component";
import {VariablesSettings} from "../_settings/variables.settings";
import {ModalConnectorElementPropertiesComponent} from "../modal-connector-element-properties/modal-connector-element-properties.component";
import {ModalCreateDomainElementsComponent} from "../modal-create-domain-elements/modal-create-domain-elements.component";
import {ModalEditPaletteElementComponent} from "../modal-edit-palette-element/modal-edit-palette-element.component";


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

  toggleInstancePropertiesModal(element: Object){
    console.log("ricevuto elemento " + element);

    let dialogRef = this.dialog.open(ModalInstancePropertiesComponent, {
      height:'80%',
      width: '800px',
      disableClose: true,
    });

  }
  togglePaletteElementPropertiesModal(element: PaletteElementModel){
    //console.log(element)
    console.log(element.paletteCategory);
    console.log(VariablesSettings.paletteCategoryConnectorsURI);
    if (element.paletteCategory === VariablesSettings.paletteCategoryConnectorsURI) {
      //Here i call another modal for defining connectors
      let dialogRef = this.dialog.open(ModalConnectorElementPropertiesComponent, {
        data: { paletteElement: element},
        height:'80%',
        width: '800px',
        disableClose: true,
      });
    } else {
      let dialogRef = this.dialog.open(ModalPaletteElementPropertiesComponent, {
        data: { paletteElement: element},
        height:'80%',
        width: '800px',
        disableClose: true,
      });


    }

  }

  toggleExtendPaletteElementModal(element: PaletteElementModel){
    //console.log(element)
    let dialogRef = this.dialog.open(ModalExtendPaletteElementComponent, {
      data: { paletteElement: element},
      height:'80%',
      width: '800px',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed : ' + result);
    });
  }

  toggleEditPaletteElementModal(element: PaletteElementModel){
    let dialogRef = this.dialog.open(ModalEditPaletteElementComponent, {
      data: { paletteElement: element},
      height:'80%',
      width: '800px',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed : ' + result);
    });
  }

  toggleCreateDomainElementModal(element: PaletteElementModel) {
    let dialogRef = this.dialog.open(ModalCreateDomainElementsComponent, {
      data: {paletteElement: element },
      height:'80%',
      width: '800px',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed : ' + result);
    });
  }

  toggleActivityElementPropertyModal(element: PaletteElementModel) {
    let dialogRef = this.dialog.open(ModalPaletteElementPropertiesComponent, {
      data: {paletteElement: element },
      height:'80%',
      width: '800px',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed : ' + result);
    });
  }
}

// https://github.com/shlomiassaf/ngx-modialog
