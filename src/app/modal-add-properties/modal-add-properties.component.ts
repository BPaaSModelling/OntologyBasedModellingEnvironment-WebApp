import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from "@angular/material";
import {ModellerService} from "../modeller.service";
import {DatatypePropertyModel} from "../_models/DatatypeProperty.model";
import {ObjectPropertyModel} from "../_models/ObjectProperty.model";
import {PaletteElementModel} from "../_models/PaletteElement.model";
import {DomainElementModel} from "../_models/DomainElement.model";
import {ModalInsertPropertyComponent} from "../modal-insert-datatype-property/modal-insert-datatype-property.component";
import {ModalInsertObjectPropertyComponent} from "../modal-insert-object-property/modal-insert-object-property.component";
import {ModalInsertLangobjectPropertyComponent} from "../modal-insert-langobject-property/modal-insert-langobject-property.component";
import {ModalEditPropertiesComponent} from "../modal-edit-datatype-property/modal-edit-datatype-property.component";
import {ModalEditBCObjectPropertyComponent} from "../modal-edit-bc-object-property/modal-edit-bc-object-property.component";
import {ModalEditSMObjectPropertyComponent} from "../modal-edit-sm-object-property/modal-edit-sm-object-property.component";

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
  public bridgingConnectors: ObjectPropertyModel[] = [];
  public semanticMappings: ObjectPropertyModel[] = [];

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

  openInsertNewDomainRelation(element: PaletteElementModel) {
    const dialogRef1 = this.dialog.open(ModalInsertObjectPropertyComponent, {
      data: {paletteElement: this.data.paletteElement },
      height:'80%',
      width: '800px',
      disableClose: false,
    });

    const sub = dialogRef1.componentInstance.newRelationAdded.subscribe(() => {
      this.mService.querySemanticMappings(this.domainName).subscribe(
        (response) => {
          this.semanticMappings = response;
        }
      );
    });
  }

  openInsertNewLanguageRelation(element: PaletteElementModel) {
    const dialogRef1 = this.dialog.open(ModalInsertLangobjectPropertyComponent, {
      data: {paletteElement: this.data.paletteElement, flag: 'lang' },
      height:'80%',
      width: '800px',
      disableClose: false,
    });

    const sub = dialogRef1.componentInstance.newLangRelationAdded.subscribe(() => {
      this.mService.queryBridgingConnectors(this.domainName).subscribe(
        (response) => {
          this.bridgingConnectors = response;
        }
      );
    });
  }

  modifyProperty(element: PaletteElementModel, property: DatatypePropertyModel) {
    const dialogRef1 = this.dialog.open(ModalEditPropertiesComponent, {
      data: {paletteElement: this.data.paletteElement, datatypeProperty: property },
      height:'80%',
      width: '800px',
      disableClose: false,
    });

    const sub = dialogRef1.componentInstance.propertyEdited.subscribe(() => {
      //const prefix = this.namespaceMap.get(this.domainName);
      //const domainStr = prefix + ":" + this.domainNameArr[1];
      this.mService.queryDatatypeProperties(this.domainName).subscribe(
        (response) => {
          this.datatypeProperties = response;
          dialogRef1.close('Cancel');
        }
      );

    });

    dialogRef1.afterClosed().subscribe(result => {
      console.log('The dialog was closed : ' + result);
    });
  }

  deleteProperty(property: DatatypePropertyModel) {
    this.mService.deleteDatatypeProperty(property).subscribe(
      (response) => {
        this.mService.queryDatatypeProperties(this.domainName).subscribe(
          (response1) => {
            this.datatypeProperties = response1;
          }
        );

      }
    );
  }

  modifyBridgingConnector(element: PaletteElementModel, property: ObjectPropertyModel) {
    const dialogRef1 = this.dialog.open(ModalEditBCObjectPropertyComponent, {
      data: {paletteElement: this.data.paletteElement, objectProperty: property },
      height:'80%',
      width: '800px',
      disableClose: false,
    });

    const sub = dialogRef1.componentInstance.bridgingConnectorEdited.subscribe(() => {
      //const prefix = this.namespaceMap.get(this.domainName);
      //const domainStr = prefix + ":" + this.domainNameArr[1];
      this.mService.queryBridgingConnectors(this.domainName).subscribe(
        (response) => {
          this.bridgingConnectors = response;
          dialogRef1.close('Cancel');
        }
      );

    });

    dialogRef1.afterClosed().subscribe(result => {
      console.log('The dialog was closed : ' + result);
    });
  }

  modifySemanticMapping(element: PaletteElementModel, property: ObjectPropertyModel) {
    const dialogRef1 = this.dialog.open(ModalEditSMObjectPropertyComponent, {
      data: {paletteElement: this.data.paletteElement, objectProperty: property },
      height:'80%',
      width: '800px',
      disableClose: false,
    });

    const sub = dialogRef1.componentInstance.semanticMappingEdited.subscribe(() => {
      //const prefix = this.namespaceMap.get(this.domainName);
      //const domainStr = prefix + ":" + this.domainNameArr[1];
      this.mService.querySemanticMappings(this.domainName).subscribe(
        (response) => {
          this.semanticMappings = response;
          dialogRef1.close('Cancel');
        }
      );

    });

    dialogRef1.afterClosed().subscribe(result => {
      console.log('The dialog was closed : ' + result);
    });
  }

  deleteBridgingConnector(property: ObjectPropertyModel) {
    this.mService.deleteObjectProperty(property).subscribe(
      (response) => {
        this.mService.queryBridgingConnectors(this.domainName).subscribe(
          (response1) => {
            this.bridgingConnectors = response1;
          }
        );

      }
    );
  }

  deleteSemanticMapping(property: ObjectPropertyModel) {
    this.mService.deleteObjectProperty(property).subscribe(
      (response) => {
        this.mService.querySemanticMappings(this.domainName).subscribe(
          (response1) => {
            this.semanticMappings = response1;
          }
        );

      }
    );
  }

}
