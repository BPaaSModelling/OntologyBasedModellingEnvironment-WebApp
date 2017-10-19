import { Component, OnInit } from '@angular/core';
import {ModellerService} from "../modeller.service";

@Component({
  selector: 'app-modelling-environment',
  templateUrl: './modelling-environment.component.html',
  styleUrls: ['./modelling-environment.component.css']
})
export class ModellingEnvironmentComponent implements OnInit {

  constructor(private modellerService: ModellerService) {
    this.modellerService.queryPaletteElements();
  }

  ngOnInit() {
  }

}
