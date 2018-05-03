import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {PaletteElementModel} from "../_models/PaletteElement.model";
import {ModalInsertPropertyComponent} from "../modal-insert-property/modal-insert-property.component";
import {ModellerService} from "../modeller.service";


@Component({
  selector: 'app-modal-palette-element-properties',
  templateUrl: './modal-palette-element-properties.component.html',
  styleUrls: ['./modal-palette-element-properties.component.css']
})
export class ModalPaletteElementPropertiesComponent implements OnInit {
  private domainName: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog,
              public dialogRef: MatDialogRef<ModalPaletteElementPropertiesComponent>,
              public mService: ModellerService) {
  }

  ngOnInit() {
    console.log(this.data.paletteElement);
    const domainNameArr = [] = this.data.paletteElement.representedLanguageClass.split('#');
    this.domainName = 'bpmn:' + domainNameArr[1];
    this.mService.queryDatatypeProperties(this.domainName);
  }

  openInsertNewProperty(element: PaletteElementModel) {
    const dialogRef = this.dialog.open(ModalInsertPropertyComponent, {
      data: {paletteElement: element },
      height:'80%',
      width: '800px',
      disableClose: false,
    });

    const sub = dialogRef.componentInstance.newPropertyAdded.subscribe(() => {
      this.mService.queryDatatypeProperties(this.domainName);
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed : ' + result);
    });
  }

  onCloseCancel() {
    this.dialogRef.close('Cancel');
  }
}
