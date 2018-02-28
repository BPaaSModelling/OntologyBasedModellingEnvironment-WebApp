import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material";
import {PaletteElementModel} from "../_models/PaletteElement.model";
import {ModalInsertPropertyComponent} from "../modal-insert-property/modal-insert-property.component";

@Component({
  selector: 'app-modal-palette-element-properties',
  templateUrl: './modal-palette-element-properties.component.html',
  styleUrls: ['./modal-palette-element-properties.component.css']
})
export class ModalPaletteElementPropertiesComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  openInsertNewProperty(element):void{
    console.log("arriva: " + element);
    let dialogRef = this.dialog.open(ModalInsertPropertyComponent, {
      data: { paletteElement: element},
      height:'80%',
      width: '800px',
      disableClose: true,
    });

  }
}
