import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-modal-connector-element-properties',
  templateUrl: './modal-connector-element-properties.component.html',
  styleUrls: ['./modal-connector-element-properties.component.css']
})
export class ModalConnectorElementPropertiesComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }

}
