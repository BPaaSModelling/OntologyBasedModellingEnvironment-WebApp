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
  private line;
  private group;

  private cnt = 0;

  constructor() { }

  ngOnInit() {
    console.log(fabric.version);

    this.canvas = new fabric.Canvas('canvas', {
    });

    /*const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
        this.canvas.remove(activeObject);
    }*/
  }

  ngOnChanges(changes: SimpleChanges) {
    this.printNewElement(changes.new_element.currentValue);
  }

  printNewElement(element: MetamodelElementModel): void {

    if (element !== undefined) {
      this.shape = new fabric.Rect({
        width: 200,
        height: 150,
        fill: 'white',
        stroke: 'black'
      });
      this.shape.id = 'id' + this.cnt;
      this.cnt++;
      this.canvas.add(this.shape);

      this.canvas.getObjects().forEach(function (o) {
        console.log(o.id);
      });

      if (this.canvas.getObjects().length === 2) {
        const sourceObj = this.canvas.item(0);
        console.log('Got id:' + sourceObj.id);
        const targetObj = this.canvas.item(1);
        console.log('Got id:' + targetObj.id);

        console.log(sourceObj);
        console.log(targetObj);

        const leftX = targetObj.aCoords.br.x;
        const leftY = targetObj.aCoords.tr.y + (targetObj.height) / 2;

        const rightX = sourceObj.aCoords.bl.x;
        const rightY = sourceObj.aCoords.tl.y + (sourceObj.height) / 2;

        console.log(leftX + ' ' + leftY + ' ' + rightX + ' ' + rightY);
        this.line = new fabric.Line([leftX, leftY, rightX, rightY], {
          stroke: 'black'
        });
        this.canvas.add(this.line);

        /*this.canvas.remove(sourceObj);
        this.canvas.remove(targetObj);
        this.group = new fabric.Group([sourceObj, targetObj, this.line], {});
        this.canvas.add(this.group);*/

      }
    }

  }

}
