import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {PaletteElementModel} from "../_models/PaletteElement.model";
import {GraphicalElementModel} from "../_models/GraphicalElement.model";
import {ContextMenuComponent} from 'ngx-contextmenu';
import {ModellerService} from '../modeller.service';
import {ModalExtendPaletteElementComponent} from "../modal-extend-palette-element/modal-extend-palette-element.component";
import {ModalPaletteElementPropertiesComponent} from "../modal-palette-element-properties/modal-palette-element-properties.component";
import {MatDialog} from "@angular/material";
import {ModalEditPaletteElementComponent} from "../modal-edit-palette-element/modal-edit-palette-element.component";


@Component({
  selector: 'app--tool-recursive-palette-element',
  templateUrl: './-tool-recursive-palette-element.component.html',
  styleUrls: ['./-tool-recursive-palette-element.component.css']
})
export class ToolRecursivePaletteElementComponent implements OnInit {
  @ViewChild(ContextMenuComponent) public elementRightClickMenu: ContextMenuComponent;

  @Input() child: PaletteElementModel;
  @Input() contextMenu: ContextMenuComponent;
  @Input() contextMenuSubject: PaletteElementModel;

  @Output() sendElementFromRecursiveElement = new EventEmitter();

  @Output() sendElementFromPalette = new EventEmitter();
  @Output() showPaletteElementPropertyModal1 = new EventEmitter();
  @Output() showExtendPaletteElementModal1 = new EventEmitter();
  @Output() showCreateDomainElementModal1 = new EventEmitter();
  @Output() showActivityElementPropertyModal1 = new EventEmitter();
  @Output() showEditPaletteElementModal1 = new EventEmitter();
constructor(private mService: ModellerService, public dialog: MatDialog) {

  }

  ngOnInit() {
    //console.log(this.child.id);
  }

  private addNewShape(a: GraphicalElementModel): void {
    let b: GraphicalElementModel = Object.assign({}, a);
    this.sendElementFromRecursiveElement.emit(b);
  }

  removeFromPalette(element: PaletteElementModel) {
    console.log('clicked ', element);
    console.log(element.label + ' ' + element.childElements);
    if(element.childElements.length > 0) {
      alert(element.label + ' has child elements, cannot be deleted');
    } else {
      if (confirm('Do you want to remove ' + element.label + ' from palette?')) {
        this.mService.deletePaletteElement(JSON.stringify(element));
      } else {
        // Do nothing!
      }
    }
  }

  toggleExtendPaletteElementModal(element: PaletteElementModel){
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

  toggleEditPaletteElementModal(element: PaletteElementModel){
    let dialogRef = this.dialog.open(ModalEditPaletteElementComponent, {
      data: { paletteElement: element},
      height:'80%',
      width: '800px',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed : ' + result);
    });
  }

  /*toggleCreateDomainElementModalFromExtend(element: PaletteElementModel) {
    let dialogRef = this.dialog.open(ModalCreateDomainElementsComponent, {
      data: {paletteElement: element },
      height:'80%',
      width: '800px',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed : ' + result);
    });
  }*/

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

  openPaletteElementPropertiesModal(element: PaletteElementModel){
    this.showPaletteElementPropertyModal1.emit(element);
  }

  openExtendPaletteElementModal(element: PaletteElementModel){
    this.showExtendPaletteElementModal1.emit(element);
  }

  openActivityElementProperty(element: PaletteElementModel) {
    this.showActivityElementPropertyModal1.emit(element);
  }

  openCreateDomainElementModal(element: PaletteElementModel) {
    this.showCreateDomainElementModal1.emit(element);
  }

  openEditPaletteElementModal(element: PaletteElementModel){
    this.showEditPaletteElementModal1.emit(element);
  }

  hideFromPalette(element: PaletteElementModel) {
    console.log('Hiding element : ' + element.label);
    element.uuid = (element.label).replace(new RegExp(' ', 'g'), ''); // replace spaces
    this.mService.hidePaletteElement(JSON.stringify(element));
  }
}
