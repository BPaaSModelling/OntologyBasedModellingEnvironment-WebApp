import {Component, Inject} from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Model} from '../_models/Model.model';

@Component({
  selector: 'modal-model-creation',
  templateUrl: 'modal-model-creation.component.html'
})
export class ModalModelCreation {
  constructor(
    public dialogRef: MatDialogRef<ModalModelCreation>,
    @Inject(MAT_DIALOG_DATA) public model: Model) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
