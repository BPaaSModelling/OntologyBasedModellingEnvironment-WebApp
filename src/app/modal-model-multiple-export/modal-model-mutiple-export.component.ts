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

  /*
    @Inject(MAT_DIALOG_DATA) public data: any, public mService: ModellerService, public dialog: MatDialog, private changeDetection: ChangeDetectorRef) {
    this.currentPaletteElement = new PaletteElementModel();
    this.VariablesSettings = VariablesSettings;
  }
    */

  constructor( public matDialog: MatDialog,public mService: ModellerService,

               public dialogRef: MatDialogRef<ModalModelMultipleExport>,
               @Inject(MAT_DIALOG_DATA) public model: Model) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  //MULTIPLE SELECTION
  getLanguageMultipleSelection(): void{


   // this.ttlResult="";
    //aSelectedItemsArray: string[]=[];


//WORKS
    /*
    var aSelectedItemsArray :string[]=[];
    var idea= this.selectedItems[0].item_text;
    var idea2 = this.selectedItems[1].item_text;



    let fruits: string[] = [idea,idea2]
    this.mService.queryModelsAndLanguageADVANCEDwithDistinctionMultipleSelection(fruits);
*/
//Test with a for
    var aSelectedLangArray :string[]=[];
    for (let i = 0; i < this.selectedItems.length; i++) {
      aSelectedLangArray[i]=this.selectedItems[i].item_text;
    }
    this.mService.queryModelsAndLanguageADVANCEDwithDistinctionMultipleSelection(aSelectedLangArray);

    /*
        var count=0;
        this.selectedItems.forEach(function (item_text) {

          aSelectedItemsArray.splice(count,0,item_text);
          count++
        });
        count=0;
    */

//


    // };

    //for download
   /* const filename = "AOAME.ttl";
    var myblob = new Blob([this.ttlResult], {
      type: 'text/trig'
    });
    saveAs(myblob, filename);
*/





   /* var myblob2 = new Blob([this.mService.modelAndLanguageAdvanced], {
      type: 'text/trig'
    });
    saveAs(myblob2, filename);*/
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
