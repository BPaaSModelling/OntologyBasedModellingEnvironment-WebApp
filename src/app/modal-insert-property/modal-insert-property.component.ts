import {Component, Inject, OnInit, Output, EventEmitter} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ModellerService} from "../modeller.service";
import {PaletteElementModel} from "../_models/PaletteElement.model";

@Component({
  selector: 'app-modal-insert-property',
  templateUrl: './modal-insert-property.component.html',
  styleUrls: ['./modal-insert-property.component.css']
})
export class ModalInsertPropertyComponent implements OnInit {
step = 0;
  @Output() newPropertyAdded = new EventEmitter();
  public paletteElement: PaletteElementModel;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public mService: ModellerService,
              public dialogRef: MatDialogRef<ModalInsertPropertyComponent>) { }

  ngOnInit() {
    this.paletteElement = new PaletteElementModel();
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  onCloseCancel() {
  this.dialogRef.close('Cancel');
  }

  insertNewProperty() {
    this.paletteElement.datatypePropertyId = (this.paletteElement.datatypePropertyLabel).replace(new RegExp(' ', 'g'), '_');
    this.paletteElement.representedLanguageClass = this.data.paletteElement.representedLanguageClass;
    this.mService.createNewDatatypeProperty(JSON.stringify(this.paletteElement));
  }
}
