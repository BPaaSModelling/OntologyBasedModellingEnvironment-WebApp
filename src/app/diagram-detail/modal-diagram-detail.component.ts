import {Component, Inject, SimpleChanges} from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Model} from '../_models/Model.model';
import {DiagramDetail} from '../_models/DiagramDetail.model';
import {RelationDatasource} from './RelationDatasource.model';
import {Relation} from '../_models/Relation.model';
import {ModellerService} from '../modeller.service';
import {DiagramDetailAndModel} from '../_models/DiagramDetailAndModel';
import {RelationEditorModel} from './RelationEditorModel';
import {ValueModel} from './ValueModel';

@Component({
  selector: 'modal-diagram-detail',
  templateUrl: 'diagram-detail.html'
})
export class ModalViewDiagramDetail {

  displayedColumns: string[] = ['key', 'value'];

  diagramDetailDatasource: RelationDatasource;
  modelElementAttributeDatasource: RelationDatasource;

  constructor(
    public dialogRef: MatDialogRef<ModalViewDiagramDetail>,
    private modellerService: ModellerService,
    @Inject(MAT_DIALOG_DATA) public data: DiagramDetailAndModel) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.setupDatasources();
  }

  private setupDatasources() {
    //this.modelElementAttributeDatasource = new RelationDatasource(this.data.diagramDetail.modelElementAttributes.values);
    let diagramDetailRelations = this.getDiagramDetailRelations(this.data.diagramDetail);
    this.diagramDetailDatasource = new RelationDatasource(diagramDetailRelations);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.setupDatasources();
  }

  save() {
    //this.data.diagramDetail.modelElementAttributes.values = this.modelElementAttributeDatasource.data.getValue();
    this.data.diagramDetail.modelingLanguageConstructInstance = this.diagramDetailDatasource.data.getValue().find(value => value.relation.relation == 'modelingLanguageConstructInstance').relation.value;
    this.data.diagramDetail.paletteConstruct = this.diagramDetailDatasource.data.getValue().find(value => value.relation.relation == 'paletteConstruct').relation.value;
    this.modellerService.updateDiagram(this.data.diagramDetail, this.data.modelId);

    this.dialogRef.close();
  }

  getDiagramDetailRelations(diagramDetail: DiagramDetail): RelationEditorModel[] {

    let diagramRelations: RelationEditorModel[] = [];

    let modelingLanguageConstructInstance = new Relation();
    modelingLanguageConstructInstance.relation = 'modelingLanguageConstructInstance';
    modelingLanguageConstructInstance.value = diagramDetail.modelingLanguageConstructInstance;

    let paletteConstruct = new Relation();
    paletteConstruct.relation = 'paletteConstruct';
    paletteConstruct.value = diagramDetail.paletteConstruct;

    diagramRelations.push(new RelationEditorModel(modelingLanguageConstructInstance));
    diagramRelations.push(new RelationEditorModel(paletteConstruct));

    return diagramRelations;
  }

  close() {
    this.dialogRef.close();
  }
}
