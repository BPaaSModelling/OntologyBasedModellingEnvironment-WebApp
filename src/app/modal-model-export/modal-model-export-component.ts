import {Component, Inject} from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Model} from '../_models/Model.model';
import {ModellerService} from '../modeller.service';
import {HttpClient} from '@angular/common/http';
import {EndpointSettings} from '../_settings/endpoint.settings';
import {MatDialog} from '@angular/material/dialog';
import * as go from 'gojs';



@Component({
  selector: 'modal-model-export',
  templateUrl: 'modal-model-export.component.html'
})
export class ModalModelExport {

  selectedOption: string;
  httpClient: HttpClient;
  endpointSettings: EndpointSettings;
  service: ModellerService;


  constructor(private mService: ModellerService, public matDialog: MatDialog,




    public dialogRef: MatDialogRef<ModalModelExport>,
    @Inject(MAT_DIALOG_DATA) public model: Model) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  getLanguage(): void{
    //this.service(HttpClient,EndpointSettings);
    //var mservice = new ModellerService(this.httpClient,this.endpointSettings);

    this.mService.queryModelsAndLanguageADVANCEDwithDistinction(this.selectedOption);

  }



}
