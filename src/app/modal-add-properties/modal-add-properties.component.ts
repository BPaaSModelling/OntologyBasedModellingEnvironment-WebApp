import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from "@angular/material";
import {ModellerService} from "../modeller.service";
import {DatatypePropertyModel} from "../_models/DatatypeProperty.model";
import {PaletteElementModel} from "../_models/PaletteElement.model";
import {DomainElementModel} from "../_models/DomainElement.model";
import {ModalInsertPropertyComponent} from "../modal-insert-datatype-property/modal-insert-datatype-property.component";
import {ModalInsertObjectPropertyComponent} from "../modal-insert-object-property/modal-insert-object-property.component";

@Component({
  selector: 'app-modal-add-properties',
  templateUrl: './modal-add-properties.component.html',
  styleUrls: ['./modal-add-properties.component.css']
})
export class ModalAddPropertiesComponent implements OnInit {

  @Output() propertiesAdded = new EventEmitter();

  public domainElement: DomainElementModel;
  public domainName: string;
  private namespaceMap: Map<string, string>;
  public datatypeProperties: DatatypePropertyModel[] = [];

  constructor(
    public dialogRef: MatDialogRef<ModalAddPropertiesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public mService: ModellerService, public dialog: MatDialog) {
    this.domainElement = new DomainElementModel();
    this.domainName = data.paletteElement.representedLanguageClass;
  }

  ngOnInit() {
    /*console.log(this.domainName.indexOf('#'));
    if (this.domainName.indexOf('#') !== -1) {
      const domainNameArr = [] = this.data.paletteElement.representedLanguageClass.split('#');
      const domainStr = domainNameArr[0] + '#';
      this.mService.queryNamespaceMap().subscribe(
        (response) => {
          this.namespaceMap = response;
          console.log(this.namespaceMap);
          const prefix = this.namespaceMap.get(domainStr);
          this.domainName = prefix + domainNameArr[1];
        }
      );
    }*/
    this.mService.queryDatatypeProperties(this.domainName).subscribe(
      (response) => {
        this.datatypeProperties = response;
      }
    );
  }

  onCloseCancel() {
    this.dialogRef.close('Cancel');
  }

  openInsertNewProperty(element: PaletteElementModel) {
    const dialogRef1 = this.dialog.open(ModalInsertPropertyComponent, {
      data: {paletteElement: this.data.paletteElement },
      height:'80%',
      width: '800px',
      disableClose: false,
    });

    const sub = dialogRef1.componentInstance.newPropertyAdded.subscribe(() => {
      this.mService.queryDatatypeProperties(this.domainName).subscribe(
        (response) => {
          this.datatypeProperties = response;
        }
      );
      //this.dialogRef.close('Cancel');
    });
  }

  openInsertNewRelation(element: PaletteElementModel) {
    const dialogRef1 = this.dialog.open(ModalInsertObjectPropertyComponent, {
      data: {paletteElement: element },
      height:'80%',
      width: '800px',
      disableClose: false,
    });

    const sub = dialogRef1.componentInstance.newRelationAdded.subscribe(() => {
      /*this.mService.queryDatatypeProperties(this.domainName).subscribe(
        (response) => {
          this.datatypeProperties = response;
          dialogRef1.close('Cancel');
        }
      );*/
    });

    dialogRef1.afterClosed().subscribe(result => {
      console.log('The dialog was closed : ' + result);
    });
  }

}
