import { Component, OnInit } from '@angular/core';
import {ModellerService} from "../modeller.service";
import {MetamodelElementModel} from "../_models/MetamodelElement.model";

@Component({
  selector: 'app-modelling-environment',
  templateUrl: './modelling-environment.component.html',
  styleUrls: ['./modelling-environment.component.css']
})
export class ModellingEnvironmentComponent implements OnInit {
  count: number;
  elements: MetamodelElementModel[];
  new_element: MetamodelElementModel;

  constructor(private modellerService: ModellerService) {
    this.count = 0;
    //this.modellerService.queryPaletteElements();
  }

  ngOnInit() {
  }

  sendElementToCanvas(new_element: MetamodelElementModel) {
    this.count++;
    new_element.id = this.count.toString();
    this.new_element = new_element;
  }

}
