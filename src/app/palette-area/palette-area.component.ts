import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MetamodelElementModel} from "../_models/MetamodelElement.model";
import {ModellerService} from "../modeller.service";
import {PaletteElementModel} from "../_models/PaletteElement.model";
import {ToolRecursivePaletteElementComponent} from "../-tool-recursive-palette-element/-tool-recursive-palette-element.component";


@Component({
  selector: 'app-palette-area',
  templateUrl: './palette-area.component.html',
  styleUrls: ['./palette-area.component.css']
})
export class PaletteAreaComponent implements OnInit {
  @Output()  sendElementFromPalette = new EventEmitter();
  private count: number;
  constructor(private mService: ModellerService) {
    this.mService.queryPaletteCategories();
    this.mService.queryPaletteElements();
    this.count = 0;
  }

  ngOnInit() {
  }

  private addNewShape(a: MetamodelElementModel): void {
    let b: MetamodelElementModel = Object.assign({}, a);
    b.id = 'id' + this.count;
    this.count++;
    this.sendElementFromPalette.emit(b);
      }
}
