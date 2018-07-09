import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MetamodelElementModel} from '../_models/MetamodelElement.model';
import {ModellerService} from '../modeller.service';
import {PaletteElementModel} from '../_models/PaletteElement.model';
import {ContextMenuComponent} from 'ngx-contextmenu';
import {UUID} from 'angular2-uuid';
import { ContextMenuService } from 'ngx-contextmenu';
import {ModalExtendPaletteElementComponent} from "../modal-extend-palette-element/modal-extend-palette-element.component";
import {MatDialog} from "@angular/material";
import {ModalCreateDomainElementsComponent} from "../modal-create-domain-elements/modal-create-domain-elements.component";
import {ModalPaletteElementPropertiesComponent} from "../modal-palette-element-properties/modal-palette-element-properties.component";

@Component({
  selector: 'app-palette-area',
  templateUrl: './palette-area.component.html',
  styleUrls: ['./palette-area.component.css']
})
export class PaletteAreaComponent implements OnInit {

  @ViewChild(ContextMenuComponent) public elementRightClickMenu: ContextMenuComponent;
  @ViewChild(ContextMenuComponent) public paletteRightClickMenu: ContextMenuComponent;
  // Optional
  @Input() contextMenu: ContextMenuComponent;
  @Input() contextMenuSubject: PaletteElementModel;


  @Output() sendElementFromPalette = new EventEmitter();
  @Output() showPaletteElementPropertyModal = new EventEmitter();
  @Output() showExtendPaletteElementModal = new EventEmitter();
  @Output() showCreateDomainElementModal = new EventEmitter();
  @Output() showConnectorElementPropertyModal = new EventEmitter();
  @Output() showActivityElementPropertyModal = new EventEmitter();
  constructor(private mService: ModellerService, public dialog: MatDialog) {
    this.mService.queryPaletteCategories();
    this.mService.queryPaletteElements();
    console.log('Palette elements:');
console.log(this.mService.paletteElements);
console.log('Palette categories');
console.log(this.mService.paletteCategories);

  }

  ngOnInit() {
  }

  private addNewShape(a: PaletteElementModel): void {
    //Here i give to the paletteElement a new ID, so that when this is received by the modeller, it recognize it as a new Element to create
    const uuid = UUID.UUID();
    const b: PaletteElementModel = Object.assign({}, a);
    //b.id = a.id;
    b.tempUuid = uuid;
    this.sendElementFromPalette.emit(b);
  }

  removeFromPalette(element: PaletteElementModel) {
    console.log('clicked ', element);
    if (confirm('Do you want to remove ' + element.label + ' from palette?')) {
      // Save it!
    } else {
      // Do nothing!
    }
  }

  openPaletteElementPropertiesModal(element: PaletteElementModel) {
    this.showPaletteElementPropertyModal.emit(element);
  }

  openExtendPaletteElementModal(element: PaletteElementModel){
    this.showExtendPaletteElementModal.emit(element);
  }

  openCreateDomainElementModal(element: PaletteElementModel) {
    this.showCreateDomainElementModal.emit(element);
}

  openConnectorElementProperty(element: PaletteElementModel) {
    this.showConnectorElementPropertyModal.emit(element);
  }

  openActivityElementProperty(element: PaletteElementModel) {
    this.showActivityElementPropertyModal.emit(element);
  }

  toggleExtendPaletteElementModal(element: PaletteElementModel) {
    //console.log(element)
    let dialogRef = this.dialog.open(ModalExtendPaletteElementComponent, {
      data: { paletteElement: element},
      height:'80%',
      width: '800px',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed : ' + result);
    });
  }

  toggleCreateDomainElementModalFromExtend(element: PaletteElementModel) {
    let dialogRef = this.dialog.open(ModalCreateDomainElementsComponent, {
      data: {paletteElement: element },
      height:'80%',
      width: '800px',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed : ' + result);
    });
  }

  toggleActivityElementPropertyModal(element: PaletteElementModel) {
    let dialogRef = this.dialog.open(ModalPaletteElementPropertiesComponent, {
      data: {paletteElement: element },
      height:'80%',
      width: '800px',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed : ' + result);
    });
  }

  hideFromPalette(element: PaletteElementModel) {
    console.log('Hiding element : ' + element.label);
    element.uuid = (element.label).replace(new RegExp(' ', 'g'), ''); // replace spaces
    this.mService.hidePaletteElement(JSON.stringify(element));
  }

}
