import {ChangeDetectorRef, Component, Inject} from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Model} from '../_models/Model.model';
import {ModellerService} from '../modeller.service';
import {HttpClient} from '@angular/common/http';
import {EndpointSettings} from '../_settings/endpoint.settings';
import {MatDialog} from '@angular/material/dialog';
import * as go from 'gojs';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { saveAs } from 'file-saver';
import {element} from 'protractor';
import {PaletteElementModel} from '../_models/PaletteElement.model';
import {delay} from 'rxjs/operators';
import {Router} from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import {ModellingAreaComponent} from '../modelling-area/modelling-area.component';



@Component({
  selector: 'modal-model-multiple-export',
  templateUrl: 'modal-model-multiple-export.component.html'
})
export class ModalModelMultipleExport {
//for multiple selection
  dropdownList = [];
  selectedItems = [];
  dropdownSettings:IDropdownSettings;
//for single selection
  selectedOption: string;
  httpClient: HttpClient;
  endpointSettings: EndpointSettings;
  service: ModellerService;
  ttlResult: string;
  modellingareacomponent: ModellingAreaComponent;

  /*
    @Inject(MAT_DIALOG_DATA) public data: any, public mService: ModellerService, public dialog: MatDialog, private changeDetection: ChangeDetectorRef) {
    this.currentPaletteElement = new PaletteElementModel();
    this.VariablesSettings = VariablesSettings;
  }
    */

  constructor( public matDialog: MatDialog,public mService: ModellerService,
               private router: Router,
               private route : ActivatedRoute,
               public dialogRef: MatDialogRef<ModalModelMultipleExport>,
               @Inject(MAT_DIALOG_DATA) public model: Model) {}


  onNoClick(): void {
    this.dialogRef.close();
  }


  //load languages into multiple selection
  public getLanguagesFromFusekiHtml(): void{
    if (this.mService.prefixAdvanced !== undefined){
    var array = this.mService.prefixAdvanced.split(',');

   for(let i=1;i<array.length;i++){
     this.dropdownList.push({ item_id: i, item_text: array[i-1] });
   }}


  }


  //MULTIPLE SELECTION
  getLanguageMultipleSelection(): void{

    var aSelectedLangArray :string[]=[];
    for (let i = 0; i < this.selectedItems.length; i++) {
      aSelectedLangArray[i]=this.selectedItems[i].item_text;
    }
    this.mService.queryModelsAndLanguageADVANCEDwithDistinctionMultipleSelection(aSelectedLangArray);

  }

  //for multiple selection
  ngOnInit() : void{


    if(this.mService.modelAndLanguageAdvanced!==undefined){
      this.getLanguagesFromFusekiHtml();
      //this.getLanguagesFromFusekiHtml();
    }



    if(this.dropdownList.length===0){

      var x = document.getElementById("myDIV");
      x.style.display ="block";
      this.getLanguagesFromFusekiHtml();

    }else{

      var x = document.getElementById("myDIV");
      x.style.display ="none";

    }




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
