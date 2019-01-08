import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ModellerService} from "../modeller.service";
import {ObjectPropertyModel} from "../_models/ObjectProperty.model";

@Component({
  selector: 'app-modal-edit-object-property',
  templateUrl: './modal-edit-object-property.component.html',
  styleUrls: ['./modal-edit-object-property.component.css']
})
export class ModalEditObjectPropertyComponent implements OnInit {

  step = 0;
  @Output() objectPropertyEdited = new EventEmitter();
  public objectProperty: ObjectPropertyModel;
  public editedProperty: ObjectPropertyModel;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public mService: ModellerService,
              public dialogRef: MatDialogRef<ModalEditObjectPropertyComponent>) { }

  ngOnInit() {
    this.objectProperty = this.data.objectProperty;
    this.editedProperty = new ObjectPropertyModel();
    //this.editedProperty.domainName = this.datatypeProperty.domainName;
    this.editedProperty.label = this.objectProperty.label;
    this.editedProperty.range = this.objectProperty.range;
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

  editProperty() {
    this.mService.editObjectProperty(this.objectProperty, this.editedProperty).subscribe(
      (response) => {
        console.log(this.objectProperty);
        console.log(this.editedProperty);
        this.objectPropertyEdited.emit(this.editedProperty);
      }
    );
  }

}
