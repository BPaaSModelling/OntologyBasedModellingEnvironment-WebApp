import { Component, OnInit, Output, EventEmitter, Inject} from '@angular/core';
import {AddIoTDeviceModel} from '../../models/AddIoTDevice.model';
import {ModellerService} from "../../../core/services/modeller/modeller.service";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'modal-add-IoT',
  templateUrl: './modal-add-IoT.html',
  styleUrls: ['./modal-add-IoT.css']
})
export class ModalAddIoT implements OnInit {
  @Output() newIoTDeviceAdded = new EventEmitter();
  public IoTModel: AddIoTDeviceModel;
  step = 0;
  public config: any;
  isConnected = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: AddIoTDeviceModel,
              public mService: ModellerService,
              public dialogRef: MatDialogRef<ModalAddIoT>,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.IoTModel = new AddIoTDeviceModel();

    this.config = {
      displayKey: 'label',
      search: true,
      height: 'auto',
      placeholder: 'Select a Range',
      limitTo: 15,
      moreText: 'more',
      noResultsFound: 'No results found!',
      searchPlaceholder: 'Search'
    };
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.mService.queryIoTdevice(this.data);
    this.dialogRef.close();
  }

  delete(): void {
    delete this.data.elementDetail.xCoorDobotMagician;
    delete this.data.elementDetail.yCoorDobotMagician;
    delete this.data.elementDetail.zCoorDobotMagician;
    this.mService.queryIoTdevice(this.data);
    this.dialogRef.close();
  }

  setStep(index: number) {
    this.step = index;
  }

  connectToDobotMagician(): void {
    this.mService.getPositionDobotMagician().subscribe({
      next: (response) => {
        console.log('Connection success:', response);
        if (this.isValidResponse(response)) {
          this.isConnected = true;
          console.log('Valid response detected, connected set to true');
        } else {
          this.isConnected = false;
          console.log('Invalid response, connected set to false');
        }
      },
      error: (error) => {
        console.error('Failed connection:', error);
        this.isConnected = false;
      }
    });
  }

  isValidResponse(response: any): boolean {
    console.log('Validating response:', response);
    if (response && typeof response === 'object') {
      const hasValidProperties = ['x', 'y', 'z'].every(prop => prop in response);
      const allNumbers = ['x', 'y', 'z'].every(prop => typeof response[prop] === 'number');
      if (hasValidProperties && allNumbers) {
        return true;
      } else {
        console.warn('Invalid response structure:', response);
        return false;
      }
    } else {
      console.warn('Response is not an object:', response);
      return false;
    }
  }


}
