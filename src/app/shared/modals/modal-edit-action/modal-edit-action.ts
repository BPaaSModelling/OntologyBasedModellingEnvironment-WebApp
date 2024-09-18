import {Component, Inject} from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {ModellerService} from '../../../core/services/modeller/modeller.service';
import {AddIoTDeviceModel} from '../../models/AddIoTDevice.model';

@Component({
  selector: 'modal-edit-action',
  templateUrl: 'modal-edit-action.html',
  styleUrls: ['./modal-edit-action.css']
})

export class ModalEditAction {
  selectedAction = 'move';
  isActionSelected = false;
  isSuctionOn = this.data.elementDetail.sucCupOnDobotMagician;
  isSuctionOff = this.data.elementDetail.sucCupOffDobotMagician;
  isCalibrated = this.data.elementDetail.calDobotMagician;
  text: string;
  constructor(
    public dialogRef: MatDialogRef<ModalEditAction>,
    private modellerService: ModellerService,
    @Inject(MAT_DIALOG_DATA) public data: AddIoTDeviceModel) {}

  determineCurrentAction(): string {
    if (this.data.elementDetail.xCoorDobotMagician != null || this.data.elementDetail.yCoorDobotMagician != null || this.data.elementDetail.zCoorDobotMagician != null) {
      return 'move';
    }
    if (this.data.elementDetail.sucCupOnDobotMagician || this.data.elementDetail.sucCupOffDobotMagician) {
      return 'suction';
    }
    if (this.data.elementDetail.calDobotMagician) {
      return 'calibrate';
    }
    return 'move';
  }

  suctionCupOn(): void {
    this.isSuctionOn = !this.isSuctionOn;
    this.isSuctionOff = false;
    this.data.elementDetail.sucCupOnDobotMagician = this.isSuctionOn;
    this.isActionSelected = !this.isActionSelected;
  }

  suctionCupOff(): void {
    this.isSuctionOff = !this.isSuctionOff;
    this.isSuctionOn = false;
    this.data.elementDetail.sucCupOffDobotMagician = this.isSuctionOff;
    this.isActionSelected = !this.isActionSelected;
  }
  calibrateArm(): void {
    this.isCalibrated = !this.isCalibrated;
    this.data.elementDetail.calDobotMagician = this.isCalibrated;
    this.isActionSelected = !this.isActionSelected;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  save() {
    this.modellerService.updateElement(this.data.elementDetail, this.data.modelId);
    this.dialogRef.close();
    this.isActionSelected = true;
    this.selectedAction = this.determineCurrentAction();
  }
  delete(): void {
    delete this.data.elementDetail.xCoorDobotMagician;
    delete this.data.elementDetail.yCoorDobotMagician;
    delete this.data.elementDetail.zCoorDobotMagician;
    delete this.data.elementDetail.calDobotMagician;
    delete this.data.elementDetail.sucCupOnDobotMagician;
    delete this.data.elementDetail.sucCupOffDobotMagician;
    this.modellerService.updateElement(this.data.elementDetail, this.data.modelId);
    this.selectedAction = null;
    this.isActionSelected = false;
    this.isSuctionOn = false;
    this.isSuctionOff = false;
    this.isCalibrated = false;
  }
  ngOnInit() {
    this.isActionSelected = this.isAnyActionSelected();
    this.selectedAction = this.determineCurrentAction();
  }

  isAnyActionSelected(): boolean {
    return (
      (this.data.elementDetail.xCoorDobotMagician != null && this.data.elementDetail.xCoorDobotMagician !== '') ||
      (this.data.elementDetail.yCoorDobotMagician != null && this.data.elementDetail.yCoorDobotMagician !== '') ||
      (this.data.elementDetail.zCoorDobotMagician != null && this.data.elementDetail.zCoorDobotMagician !== '') ||
      this.data.elementDetail.sucCupOnDobotMagician || this.data.elementDetail.sucCupOffDobotMagician ||
      this.data.elementDetail.calDobotMagician
    );
  }

}

