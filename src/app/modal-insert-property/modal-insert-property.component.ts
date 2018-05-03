import {Component, Inject, OnInit, Output, EventEmitter} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ModellerService} from "../modeller.service";
import {DatatypePropertyModel} from "../_models/DatatypeProperty.model";

@Component({
  selector: 'app-modal-insert-property',
  templateUrl: './modal-insert-property.component.html',
  styleUrls: ['./modal-insert-property.component.css']
})
export class ModalInsertPropertyComponent implements OnInit {
step = 0;
  @Output() newPropertyAdded = new EventEmitter();
  public datatypeProperty: DatatypePropertyModel;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public mService: ModellerService,
              public dialogRef: MatDialogRef<ModalInsertPropertyComponent>) { }

  ngOnInit() {
    this.datatypeProperty = new DatatypePropertyModel();
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
    this.datatypeProperty.id = (this.datatypeProperty.label).replace(new RegExp(' ', 'g'), '_');
    this.datatypeProperty.domainName = this.data.paletteElement.representedLanguageClass;
    this.mService.createNewDatatypeProperty(JSON.stringify(this.datatypeProperty));
    this.newPropertyAdded.emit(this.datatypeProperty);
  }
}
