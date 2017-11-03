import {Component, EventEmitter, Input, OnInit, SimpleChanges} from '@angular/core';
import 'fabric';
import {MetamodelElementModel} from "../_models/MetamodelElement.model";
import {PaletteElementModel} from "../_models/PaletteElement.model";

declare let fabric;


@Component({
  selector: 'app-modelling-area',
  templateUrl: './modelling-area.component.html',
  styleUrls: ['./modelling-area.component.css']
})
export class ModellingAreaComponent implements OnInit {

  @Input() new_element: PaletteElementModel;
  private canvas;
  private boundBox;
  private shape;

  constructor() {
  }

  ngOnInit() {
    console.log(fabric.version);

    this.canvas = new fabric.Canvas('canvas', {});
    this.canvas.setHeight(document.getElementById('container').offsetHeight);
    this.canvas.setWidth(document.getElementById('container').offsetWidth);
  }

  ngOnChanges(changes: SimpleChanges) {
    //TODO to change with ngDoCheck
    this.printNewElement(changes.new_element.currentValue);
    console.log(changes.new_element.currentValue);
  }

  printNewElement(element: PaletteElementModel): void {
    if (element !== undefined) {
      fabric.Image.fromURL('../assets/images/'+element.imageURL, (img) =>{
        let oImg = img.set({
          left: 0,
          top: 0,
          angle: 0}).scale(1);
        this.canvas.add(oImg).renderAll();
        });
      }
    }

  printNewElement2(element: PaletteElementModel): void {
    if (element !== undefined) {
      this.shape = new fabric.Rect({
        width: 200,
        height: 150,
        fill: 'white',
        stroke: 'black'
      });
      this.shape.id = 'id' + 1;
      this.canvas.add(this.shape);
    }
  }
}
