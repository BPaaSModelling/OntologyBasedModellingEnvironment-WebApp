import { Component, OnInit, Output, EventEmitter, Inject} from '@angular/core';
import {ObjectPropertyModel} from '../_models/ObjectProperty.model';
import {ModellerService} from "../modeller.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-modal-insert-object-property',
  templateUrl: './modal-insert-object-property.component.html',
  styleUrls: ['./modal-insert-object-property.component.css']
})


export class ModalInsertObjectPropertyComponent implements OnInit {

  @Output() newRelationAdded = new EventEmitter();
  public objectProperty: ObjectPropertyModel;
  step = 0;
  public config: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public mService: ModellerService,
              public dialogRef: MatDialogRef<ModalInsertObjectPropertyComponent>) { }

  ngOnInit() {
    this.objectProperty = new ObjectPropertyModel();

    this.config = {
      displayKey: 'label',
      search: true,
      height: 'auto',
      placeholder: 'Select a Range',
      limitTo: 15,
      moreText: 'more',
      noResultsFound: 'No results found!',
      searchPlaceholder: 'Search'
    };
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  onCloseCancel() {
    this.dialogRef.close('Cancel');
  }

  selectionChanged(event) {
    console.log(event);
    this.objectProperty.range = event.value.id;
  }

  insertNewProperty() {
    this.objectProperty.id = (this.objectProperty.label).replace(new RegExp(' ', 'g'), '_');
    this.objectProperty.domainName = this.data.paletteElement.representedLanguageClass;
    console.log(this.objectProperty.range);
    this.mService.createNewObjectProperty(JSON.stringify(this.objectProperty)).subscribe(
      (response) => {
        this.newRelationAdded.emit(this.objectProperty);
        this.dialogRef.close('Cancel');
      }
    );
  }

}
