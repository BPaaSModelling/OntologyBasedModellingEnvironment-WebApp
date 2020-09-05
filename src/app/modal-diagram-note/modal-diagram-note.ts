import {Component, Inject} from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Model} from '../_models/Model.model';
import {DiagramDetail} from '../_models/DiagramDetail.model';
import {ModellerService} from '../modeller.service';
import {DiagramDetailAndModel} from '../_models/DiagramDetailAndModel';

@Component({
  selector: 'modal-diagram-note',
  templateUrl: 'modal-diagram-note.html'
})
export class ModalDiagramNote {

  text: string;

  constructor(
    public dialogRef: MatDialogRef<ModalDiagramNote>,
    private modellerService: ModellerService,
    @Inject(MAT_DIALOG_DATA) public data: DiagramDetailAndModel) {}


  onNoClick(): void {
    this.dialogRef.close();
  }

  save() {
    this.modellerService.updateDiagram(this.data.diagramDetail, this.data.modelId);
    this.dialogRef.close();
  }

  delete() {
    delete this.data.diagramDetail.note;
    this.modellerService.updateDiagram(this.data.diagramDetail, this.data.modelId);
    this.dialogRef.close();
  }
}
