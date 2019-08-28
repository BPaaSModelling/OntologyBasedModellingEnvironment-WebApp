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
import {ModalEditPaletteElementComponent} from "../modal-edit-palette-element/modal-edit-palette-element.component";
import {ModelingViewModel} from "../_models/ModelingView.model";
import {PaletteCategoryModel} from "../_models/PaletteCategory.model";
import {VariablesSettings} from "../_settings/variables.settings";

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
  @Output() showEditPaletteElementModal = new EventEmitter();

  public modelingViews: ModelingViewModel[] = [];
  public paletteCategories: PaletteCategoryModel[] = [];
  public imageRoot: string = "";

  constructor(private mService: ModellerService, public dialog: MatDialog) {
    this.mService.queryModelingLanguages()
    //this.mService.queryPaletteCategories();


this.imageRoot = VariablesSettings.IMG_ROOT;
//console.log('Palette categories');
//console.log(this.mService.paletteCategories);

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

  openEditPaletteElementModal(element: PaletteElementModel){
    this.showEditPaletteElementModal.emit(element);
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

    const sub = dialogRef.componentInstance.newElementCreated.subscribe(() => {
      this.mService.queryPaletteElements();
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
    console.log(element.id);
    element.uuid = (element.label).replace(new RegExp(' ', 'g'), ''); // replace spaces
    this.mService.hidePaletteElement(JSON.stringify(element)).subscribe(
      (response) => {
        console.log(response);
        this.mService.queryPaletteElements();
      }
    );
  }

  selectLang($event: any) {
    console.log('Modeling language selected');
    console.log($event.value);
    this.modelingViews = [];
    this.paletteCategories = [];
    this.mService.queryModelingViews($event.value).subscribe(
    (response) => {
        console.log(response);
        this.modelingViews = response;
    }
    );
  }

  selectView($event: any) {
    console.log('Modeling View selected');
    console.log($event.value);
    this.paletteCategories = [];
    this.mService.queryPaletteCategories($event.value).subscribe(
      (response) => {
        console.log(response);
        this.paletteCategories = response;
        this.mService.queryPaletteElements();
        console.log('Palette elements:');
        console.log(this.mService.paletteElements);
      }
    );
    console.log('Palette categories');
    console.log(this.paletteCategories);
  }
}
