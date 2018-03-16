import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {QueryAnswerModel} from "../_models/QueryAnswer.model";
import {ModellerService} from "../modeller.service";
import {PaletteElementModel} from "../_models/PaletteElement.model";

@Component({
  selector: 'app-modal-extend-palette-element',
  templateUrl: './modal-extend-palette-element.component.html',
  styleUrls: ['./modal-extend-palette-element.component.css']
})
export class ModalExtendPaletteElementComponent implements OnInit {

 /*constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public mService: ModellerService) {

  }*/

private ontologyClasses: QueryAnswerModel[] = [];
public currentPaletteElement: PaletteElementModel;

  constructor(
    public dialogRef: MatDialogRef<ModalExtendPaletteElementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public mService: ModellerService) {
    this.currentPaletteElement = new PaletteElementModel();
  }


  ngOnInit() {
    this.mService.queryDomainClasses();
    this.mService.queryPaletteCategories();
  }

  answer(val) {

    const ele = this.currentPaletteElement;
    ele.id = '';
    ele.uuid = (this.currentPaletteElement.label).replace(new RegExp(' ', 'g'), ''); // replace spaces
    console.log('uuid:' + ele.uuid);
    ele.label = this.currentPaletteElement.label;
    ele.hiddenFromPalette = false;
    ele.usesImages = false;
    ele.parentElement = (this.data.paletteElement.label).replace(new RegExp(' ', 'g'), ''); // replace spaces
    console.log('parent:' + ele.parentElement);
    ele.paletteCategory = this.currentPaletteElement.paletteCategory; // 'lo:Category_Activities';
    console.log('category: ' + this.currentPaletteElement.paletteCategory);
    ele.representedLanguageClass = 'bpmn:' + (this.currentPaletteElement.label).replace(new RegExp(' ', 'g'), ''); /*important property to display in the pallette*/

    console.log('stringified element:' + JSON.stringify(ele));


    const isSuccess: Boolean = this.mService.createElementInOntology(JSON.stringify(ele));

    console.log("Here is the result of the query: " + isSuccess);
    //HERE I GET THE VALUES FROM THE GUI
    //console.log('label val:' + this.currentPaletteElement.label);
    //console.log('domain ontology val: ' + this.currentPaletteElement.representedLanguageClass);
    //THEN I SUPPOSE TO CALL THE SERVICE AND INSERT THE currentPaletteElement IN THE ONTOLOGY
   //console.log('val: ' + val);
   //console.log(this.data);
   if (isSuccess){
     this.dialogRef.close();
   }
  }



}
