import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from "@angular/material";
import {ModellerService} from "../modeller.service";
import {DatatypePropertyModel} from "../_models/DatatypeProperty.model";
import {PaletteElementModel} from "../_models/PaletteElement.model";
import {DomainElementModel} from "../_models/DomainElement.model";
import {ModalInsertPropertyComponent} from "../modal-insert-datatype-property/modal-insert-datatype-property.component";

@Component({
  selector: 'app-modal-add-properties',
  templateUrl: './modal-add-properties.component.html',
  styleUrls: ['./modal-add-properties.component.css']
})
export class ModalAddPropertiesComponent implements OnInit {

  @Output() propertiesAdded = new EventEmitter();

  public domainElement: DomainElementModel;
  private domainName: string;

  constructor(
    public dialogRef: MatDialogRef<ModalAddPropertiesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public mService: ModellerService, public dialog: MatDialog) {
    this.domainElement = new DomainElementModel();
    this.domainName = data.paletteElement.representedLanguageClass;
  }

  ngOnInit() {
  }

  onCloseCancel() {
    this.dialogRef.close('Cancel');
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
      //this.dialogRef.close('Cancel');
    });
  }

}
