import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ModellerService} from "../modeller.service";

@Component({
  selector: 'app-modal-create-domain-elements',
  templateUrl: './modal-create-domain-elements.component.html',
  styleUrls: ['./modal-create-domain-elements.component.css']
})
export class ModalCreateDomainElementsComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ModalCreateDomainElementsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public mService: ModellerService) {
  }

  ngOnInit() {
  }

}
