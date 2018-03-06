import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MetamodelElementModel} from '../_models/MetamodelElement.model';
import {ModellerService} from '../modeller.service';
import {PaletteElementModel} from '../_models/PaletteElement.model';
import {ContextMenuComponent} from 'ngx-contextmenu';
import {UUID} from 'angular2-uuid';
import { ContextMenuService } from 'ngx-contextmenu';

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
  constructor(private mService: ModellerService) {
    this.mService.queryPaletteCategories();
    this.mService.queryPaletteElements();


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

  removeFromPalette($event: any){
    console.log('clicked ', $event);
    console.log($event);
    if (confirm('Do you want to remove ' + $event.item.label + ' from palette?')) {
      // Save it!
    } else {
      // Do nothing!
    }
  };

  openPaletteElementPropertiesModal(element: PaletteElementModel){
    this.showPaletteElementPropertyModal.emit(element);
  }

  openExtendPaletteElementModal(element: PaletteElementModel){
    const ele = new PaletteElementModel();
    ele.id = '';
    ele.uuid = 'lo:SubReceiveActivity';
    ele.label = 'Subtask Receive Activity';
    ele.hiddenFromPalette = false;
    ele.parentElement = 'http://fhnw.ch/modelingEnvironment/LanguageOntology#ReceiveTask';
    ele.paletteCategory = 'lo:Category_Activities';
    ele.representedLanguageClass = 'bpmn:ReceiveActivity';

    console.log('stringified element:' + JSON.stringify(ele));
    this.mService.createElementInOntology(JSON.stringify(ele));
    this.showExtendPaletteElementModal.emit(element);
  }

}
