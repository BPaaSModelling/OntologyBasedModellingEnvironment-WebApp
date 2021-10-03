import {Component, Inject} from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Model} from '../_models/Model.model';
import {ModellerService} from '../modeller.service';
import {ModelElementDetailAndModel} from '../_models/ModelElementDetailAndModel';

@Component({
  selector: 'modal-model-link',
  templateUrl: 'modal-model-link.html'
})
export class ModalModelLink {

  selectedModel: Model;
  models: Model[];

  constructor(
    public dialogRef: MatDialogRef<ModalModelLink>,
    private modellerService: ModellerService,
    @Inject(MAT_DIALOG_DATA) public data: ModelElementDetailAndModel) {}

  ngOnInit(): void {
    this.modellerService.getModels().then(value => {
      this.models = value;
      if (this.data.elementDetail.shapeRepresentsModel != undefined) {
        this.selectedModel = this.models.find(value1 => value1.id == this.data.elementDetail.shapeRepresentsModel);
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close({
      action: 'Save',
      selectedModelId: this.selectedModel.id
    });
  }

  delete() {
    this.dialogRef.close({
      action: 'Delete'
    });
  }
}