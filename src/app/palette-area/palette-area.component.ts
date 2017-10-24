import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MetamodelElementModel} from "../_models/MetamodelElement.model";


@Component({
  selector: 'app-palette-area',
  templateUrl: './palette-area.component.html',
  styleUrls: ['./palette-area.component.css']
})
export class PaletteAreaComponent implements OnInit {
  @Output()  sendElementFromPalette = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  private addNewShape(): void {
    let a: MetamodelElementModel = new MetamodelElementModel();
    this.sendElementFromPalette.emit(a);
  }

}
