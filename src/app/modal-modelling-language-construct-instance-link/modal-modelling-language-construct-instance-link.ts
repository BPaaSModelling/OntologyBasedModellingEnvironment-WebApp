import {Component, Inject} from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DiagramDetailAndModel} from '../_models/DiagramDetailAndModel';
import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'modal-modelling-language-construct-instance-link',
  templateUrl: 'modal-modelling-language-construct-instance-link.html'
})
export class ModalModellingLanguageConstructInstanceLink {

  displayedColumns: string[] = ['modelId', 'modelLabel', 'diagram'];

  modelingLanguageConstructInstanceId: string;
  otherVisualisations: VisualisationLinksDataDatasource;

  constructor(
    public dialogRef: MatDialogRef<ModalModellingLanguageConstructInstanceLink>,
    @Inject(MAT_DIALOG_DATA) public data: VisualisationLinksData) {}

  ngOnInit(): void {
    this.modelingLanguageConstructInstanceId = this.data.modelingLanguageConstructInstanceId;
    let tableDataSource = this.data.otherVisualisations.map(value => {

      let data = new VisualisationLinksTableEntry();
      data.diagram = value.diagramDetail.id;
      data.modelId = value.modelId;
      data.modelLabel = value.modelLabel;

      return data;
    });

    this.otherVisualisations = new VisualisationLinksDataDatasource(tableDataSource);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

export class VisualisationLinksData {
  modelingLanguageConstructInstanceId: string
  otherVisualisations: DiagramDetailAndModel[]
}

export class VisualisationLinksTableEntry {
  modelId: string
  modelLabel: string
  diagram: string
}

export class VisualisationLinksDataDatasource extends DataSource<VisualisationLinksTableEntry> {

  data: BehaviorSubject<VisualisationLinksTableEntry[]>;

  public constructor(private entries: VisualisationLinksTableEntry[]) {
    super();
    this.data = new BehaviorSubject<VisualisationLinksTableEntry[]>(entries);
  }

  /** Stream of data that is provided to the table. */


  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<VisualisationLinksTableEntry[]> {
    return this.data;
  }

  disconnect() {}
}
