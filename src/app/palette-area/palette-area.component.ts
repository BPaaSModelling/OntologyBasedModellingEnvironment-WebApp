import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MetamodelElementModel} from "../_models/MetamodelElement.model";
import {ModellerService} from "../modeller.service";


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
  }

  ngOnInit() {
  }

  private addNewShape(a: MetamodelElementModel): void {

    a.id = 'id' + this.count;
    this.count++;
    this.sendElementFromPalette.emit(a);
  }

}
