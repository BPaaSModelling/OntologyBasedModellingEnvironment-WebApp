import {Component, Inject} from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Model} from '../_models/Model.model';

@Component({
  selector: 'modal-model-export',
  templateUrl: 'modal-model-export.component.html'
})
export class ModalModelExport {
  constructor(
    public dialogRef: MatDialogRef<ModalModelExport>,
    @Inject(MAT_DIALOG_DATA) public model: Model) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
