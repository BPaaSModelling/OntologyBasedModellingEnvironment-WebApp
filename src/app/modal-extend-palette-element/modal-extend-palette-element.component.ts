import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material";
import {QueryAnswerModel} from "../_models/QueryAnswer.model";
import {ModellerService} from "../modeller.service";

@Component({
  selector: 'app-modal-extend-palette-element',
  templateUrl: './modal-extend-palette-element.component.html',
  styleUrls: ['./modal-extend-palette-element.component.css']
})
export class ModalExtendPaletteElementComponent implements OnInit {

 constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public mService: ModellerService) {

  }

  ngOnInit() {
    this.mService.queryDomainClasses();
    this.mService.queryPaletteCategories();
  }

}
