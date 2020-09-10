import {Component, Inject} from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Model} from '../_models/Model.model';
import {DiagramDetail} from '../_models/DiagramDetail.model';
import {ModellerService} from '../modeller.service';
import {DiagramDetailAndModel} from '../_models/DiagramDetailAndModel';

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
    @Inject(MAT_DIALOG_DATA) public data: DiagramDetailAndModel) {}

  ngOnInit(): void {
    this.modellerService.getModels().then(value => {
      this.models = value;
      if (this.data.diagramDetail.diagramRepresentsModel != undefined) {
        this.selectedModel = this.models.find(value1 => value1.id == this.data.diagramDetail.diagramRepresentsModel);
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
