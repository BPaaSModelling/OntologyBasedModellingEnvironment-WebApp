import {Component, Inject} from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Model} from '../_models/Model.model';
import {ModellerService} from '../modeller.service';
import {HttpClient} from '@angular/common/http';
import {EndpointSettings} from '../_settings/endpoint.settings';
import {MatDialog} from '@angular/material/dialog';
import * as go from 'gojs';
import { IDropdownSettings } from 'ng-multiselect-dropdown';



@Component({
  selector: 'modal-model-export',
  templateUrl: 'modal-model-export.component.html'
})
export class ModalModelExport {
//for multiple selection
  dropdownList = [];
  selectedItems = [];
  dropdownSettings:IDropdownSettings;
//for single selection
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
//for multiple selection
  ngOnInit() {
    this.dropdownList = [
      { item_id: 1, item_text: 'mod' },
      { item_id: 2, item_text: 'bpmn' },
      { item_id: 3, item_text: 'cmmn' },
      { item_id: 4, item_text: 'apqc' },
      { item_id: 5, item_text: 'archi' }
    ];

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true
    };
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }


}
