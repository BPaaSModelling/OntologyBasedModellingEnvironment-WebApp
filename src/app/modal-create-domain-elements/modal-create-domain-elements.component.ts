import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ModellerService} from "../modeller.service";
import {DomainElementModel} from "../_models/DomainElement.model";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FormControl,FormGroup} from '@angular/forms';

@Component({
  selector: 'app-modal-create-domain-elements',
  templateUrl: './modal-create-domain-elements.component.html',
  styleUrls: ['./modal-create-domain-elements.component.css']
})
export class ModalCreateDomainElementsComponent implements OnInit {

  public domainElement: DomainElementModel;
  checked = false;
  disabled = false;

  constructor(
    public dialogRef: MatDialogRef<ModalCreateDomainElementsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public mService: ModellerService) {
  }

  ngOnInit() {
    this.mService.queryDomainClasses();
    this.domainElement = new DomainElementModel();
  }

  createDomainElementInOntology() {
    console.log(this.domainElement.isRoot);
    console.log(this.domainElement.parentElement);
    console.log(this.domainElement.label);
    this.domainElement.id = (this.domainElement.label).replace(new RegExp(' ', 'g'), '_');
    this.domainElement.parentElement = (this.domainElement.parentElement).replace('http://fhnw.ch/modelingEnvironment/DomainOntology#', '');
    console.log(this.domainElement.parentElement);
    console.log(this.domainElement.id);

    this.mService.createDomainElementInOntology(JSON.stringify(this.domainElement));
  }

  onCloseCancel() {
    this.dialogRef.close('Cancel');
  }

}
