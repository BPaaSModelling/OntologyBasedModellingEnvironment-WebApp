import {Component, EventEmitter, Input, OnInit, SimpleChanges} from '@angular/core';
import 'fabric';
import {MetamodelElementModel} from "../_models/MetamodelElement.model";

declare let fabric;


@Component({
  selector: 'app-modelling-area',
  templateUrl: './modelling-area.component.html',
  styleUrls: ['./modelling-area.component.css'],
  inputs: ['data_elements'],
  outputs: ['dataChange'],
})
export class ModellingAreaComponent implements OnInit {

  @Input() new_element: MetamodelElementModel;
  data_elements: MetamodelElementModel[];
  dataChange: EventEmitter<MetamodelElementModel[]> = new EventEmitter();
  private canvas;
  private boundBox;
  private shape;

  constructor() { }

  ngOnInit() {
    console.log(fabric.version);

    this.canvas = new fabric.Canvas('canvas',{

    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.printNewElement(changes.new_element.currentValue);
  }

  printNewElement(element: MetamodelElementModel): void {
    if (element !== undefined) {
      this.shape = new fabric.Rect({
        width: 200,
        height: 200,
        fill: 'red'
      });
      this.canvas.add(this.shape);
    }

  }
}
