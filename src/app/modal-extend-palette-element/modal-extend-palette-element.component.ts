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
    this.currentPaletteElement = this.data.paletteElement;
  }


  ngOnInit() {
    this.mService.queryDomainClasses();
    this.mService.queryPaletteCategories();
  }

  answer(val) {
    //HERE I GET THE VALUES FROM THE GUI
    console.log('label val:' + this.currentPaletteElement.label);
    console.log('domain ontology val: ' + this.currentPaletteElement.representedLanguageClass);
    //THEN I SUPPOSE TO CALL THE SERVICE AND INSERT THE currentPaletteElement IN THE ONTOLOGY
   console.log('val: ' + val);
   console.log(this.data);
   this.dialogRef.close();
  }



}
