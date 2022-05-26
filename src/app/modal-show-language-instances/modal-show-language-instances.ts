import {Component, Inject} from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {ModellerService} from '../modeller.service';
import {ModelElementDetailAndModel} from '../_models/ModelElementDetailAndModel';
import {DataSource} from '@angular/cdk/collections';
import ModellingLanguageConstructInstance from '../_models/ModellingLanguageConstructInstance.model';
import {PaletteElementModel} from '../_models/PaletteElement.model';
import {BehaviorSubject, Observable} from "rxjs";

@Component({
  selector: 'modal-show-language-instances',
  templateUrl: 'modal-show-language-instances.html'
})
export class ModalShowLanguageInstances {

  displayedColumns: string[] = ['modelId', 'modelLabel', 'shapeId', 'instanceId'];
  datasource: ModalShowLanguageInstancesData;

  constructor(
    public dialogRef: MatDialogRef<PaletteElementModel>,
    private modellerService: ModellerService,
    @Inject(MAT_DIALOG_DATA) public data: PaletteElementModel) {
    this.modellerService.getModels().then(models => {
      this.modellerService.getInstancesOfConceptualElements(data.id).then(values => {
        const data = values.map(value => {
          const label = models.find(model => model.id === value.modelId).label;
          return {...value, modelLabel: label}
        })
        this.datasource = new ModalShowLanguageInstancesData(data)
      })
    })

  }


  onNoClick(): void {
    this.dialogRef.close();
  }
}

export class ModalShowLanguageInstancesData extends DataSource<ModellingLanguageConstructInstance> {

  data: BehaviorSubject<ModellingLanguageConstructInstance[]>;

  public constructor(private entries: ModellingLanguageConstructInstance[]) {
    super();
    this.data = new BehaviorSubject<ModellingLanguageConstructInstance[]>(entries);
  }

  /** Stream of data that is provided to the table. */


  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<ModellingLanguageConstructInstance[]> {
    return this.data;
  }

  disconnect() {}
}
