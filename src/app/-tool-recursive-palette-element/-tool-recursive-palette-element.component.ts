import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {PaletteElementModel} from '../_models/PaletteElement.model';
import {MetamodelElementModel} from '../_models/MetamodelElement.model';
import {IShContextMenuItem} from 'ng2-right-click-menu';
import {ContextMenuComponent} from "ngx-contextmenu";

@Component({
  selector: 'app--tool-recursive-palette-element',
  templateUrl: './-tool-recursive-palette-element.component.html',
  styleUrls: ['./-tool-recursive-palette-element.component.css']
})
export class ToolRecursivePaletteElementComponent implements OnInit {
@Input() child: PaletteElementModel;
@Output() sendElementFromRecursiveElement = new EventEmitter();
  @ViewChild(ContextMenuComponent) public rightClickMenu: ContextMenuComponent;
  // Optional
  @Input() contextMenu: ContextMenuComponent;
  @Input() contextMenuSubject: PaletteElementModel;
  constructor() {

  }

  ngOnInit() {
  }

  private addNewShape(a: MetamodelElementModel): void {
    let b: MetamodelElementModel = Object.assign({}, a);
    this.sendElementFromRecursiveElement.emit(b);
  }

}
