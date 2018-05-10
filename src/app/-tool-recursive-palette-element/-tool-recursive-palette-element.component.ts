import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {PaletteElementModel} from "../_models/PaletteElement.model";
import {GraphicalElementModel} from "../_models/GraphicalElement.model";
import {ContextMenuComponent} from 'ngx-contextmenu';
import {ModellerService} from '../modeller.service';


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
constructor(private mService: ModellerService) {

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

  openPaletteElementPropertiesModal(element: PaletteElementModel){
    this.showPaletteElementPropertyModal1.emit(element);
  }

  openExtendPaletteElementModal(element: PaletteElementModel){
    this.showExtendPaletteElementModal1.emit(element);
  }

  openCreateDomainElementModal(element: PaletteElementModel) {
    this.showCreateDomainElementModal1.emit(element);
  }
}
