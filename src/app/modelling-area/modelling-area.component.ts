import { Component, OnInit } from '@angular/core';
import 'fabric';

declare let fabric;


@Component({
  selector: 'app-modelling-area',
  templateUrl: './modelling-area.component.html',
  styleUrls: ['./modelling-area.component.css']
})
export class ModellingAreaComponent implements OnInit {

  private canvas;
  private boundBox;
  private shape;

  constructor() { }

  ngOnInit() {
    console.log(fabric.version);

    this.canvas = new fabric.Canvas('canvas',{

    });
    this.boundBox = new fabric.Rect({
      width: 500,
      height: 500,
      fill: 'transparent',
      stroke: '#666',
      strokeDashArray: [5, 5]
    });

    this.shape = new fabric.Rect({
      width: 200,
      height: 200,
      fill: 'red'
    });

    this.canvas.add(this.boundBox);
    this.canvas.add(this.shape);

  }

}
