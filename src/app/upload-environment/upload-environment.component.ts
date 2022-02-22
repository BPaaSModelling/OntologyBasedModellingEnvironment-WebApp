//rename folder and file with the new name , is not upload

import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {ModellerService} from '../modeller.service';
import {MetamodelElementModel} from '../_models/MetamodelElement.model';
import {PaletteElementModel} from '../_models/PaletteElement.model';
import {ModalInstancePropertiesComponent,} from '../modal-instance-properties/modal-instance-properties.component';
import {MatDialog} from '@angular/material';
import {ModalPaletteElementPropertiesComponent} from '../modal-palette-element-properties/modal-palette-element-properties.component';
import {ModalExtendPaletteElementComponent} from '../modal-extend-palette-element/modal-extend-palette-element.component';
import {VariablesSettings} from '../_settings/variables.settings';
import {ModalConnectorElementPropertiesComponent} from '../modal-connector-element-properties/modal-connector-element-properties.component';
import {ModalCreateDomainElementsComponent} from '../modal-create-domain-elements/modal-create-domain-elements.component';
import {ModalEditPaletteElementComponent} from '../modal-edit-palette-element/modal-edit-palette-element.component';
import {ModalModelExport} from '../modal-model-export/modal-model-export-component';
import {ModalModelMultipleExport} from '../modal-model-multiple-export/modal-model-mutiple-export.component';
import {delay} from 'rxjs/operators';


@Component({
  selector: 'app-modelling-environment',
  templateUrl: './upload-environment.component.html',
  styleUrls: ['./upload-environment.component.css']
})
export class UploadEnvironmentComponent implements OnInit {
  propElement: Object;
  new_element: PaletteElementModel;
  showProp: boolean;

  constructor(private uploadService: ModellerService, public dialog: MatDialog) {
    this.showProp = false;
  }

  ngOnInit() {
    //ask for prefixes to the database when the component is initalized
    this.loadPrefixesPreparation();
  }

  ngOnChanges(changes: SimpleChanges) {

  }

  sendElementToCanvas(new_element: PaletteElementModel) {
    this.new_element = new_element;
  }

  toggleInstancePropertiesModal(element: Object) {
    console.log('ricevuto elemento ' + element);

    let dialogRef = this.dialog.open(ModalInstancePropertiesComponent, {
      height: '80%',
      width: '800px',
      disableClose: true,
    });

  }

  togglePaletteElementPropertiesModal(element: PaletteElementModel) {
    //console.log(element)
    console.log(element.paletteCategory);
    console.log(VariablesSettings.paletteCategoryConnectorsURI);
    if (element.paletteCategory === VariablesSettings.paletteCategoryConnectorsURI) {
      //Here i call another modal for defining connectors
      let dialogRef = this.dialog.open(ModalConnectorElementPropertiesComponent, {
        data: {paletteElement: element},
        height: '80%',
        width: '800px',
        disableClose: true,
      });
    } else {
      let dialogRef = this.dialog.open(ModalPaletteElementPropertiesComponent, {
        data: {paletteElement: element},
        height: '80%',
        width: '800px',
        disableClose: true,
      });


    }

  }

  toggleExtendPaletteElementModal(element: PaletteElementModel) {
    //console.log(element)
    let dialogRef = this.dialog.open(ModalExtendPaletteElementComponent, {
      data: {paletteElement: element},
      height: '80%',
      width: '800px',
      disableClose: false,
    });

    const sub = dialogRef.componentInstance.newElementCreated.subscribe(() => {
      this.uploadService.queryPaletteElements();
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed : ' + result);
    });
  }

  toggleEditPaletteElementModal(element: PaletteElementModel) {
    let dialogRef = this.dialog.open(ModalEditPaletteElementComponent, {
      data: {paletteElement: element},
      height: '80%',
      width: '800px',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed : ' + result);
    });
  }

  toggleCreateDomainElementModal(element: PaletteElementModel) {
    let dialogRef = this.dialog.open(ModalCreateDomainElementsComponent, {
      data: {paletteElement: element},
      height: '80%',
      width: '800px',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed : ' + result);
    });
  }

  toggleActivityElementPropertyModal(element: PaletteElementModel) {
    let dialogRef = this.dialog.open(ModalPaletteElementPropertiesComponent, {
      data: {paletteElement: element},
      height: '80%',
      width: '800px',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed : ' + result);
    });
  }

  goToLink(url: string) {
    window.open(url, '_blank');
  }


  getModelsAndLanguages() {

    console.log('Export button selected');
    this.uploadService.queryModelsAndLanguage();

  }


  //Old function for single prefix export
  getModelsAndLanguagesADVANCEDwithDistinction() {

    const dialogRef = this.dialog.open(ModalModelExport);

  }


//open dialog box for multiple selection
  getModelsAndLanguagesMultipleSelection() {
    //Open the dialog box only when the prefixes are stored in the variable prefixesAdvaced
    this.loadPrefixesPreparation().then(
      () => {
        console.log('Task Complete!');


        const dialogRef = this.dialog.open(ModalModelMultipleExport, {
          height: '80%',
          width: '80%'
        });


      });
  }

  // Ask for data to the server
  async loadPrefixesPreparation() {

    await this.uploadService.queryLanguagesFromFuseki();

  }


}

// https://github.com/shlomiassaf/ngx-modialog