import {Component, Inject, SimpleChanges} from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Model} from '../_models/Model.model';
import {DiagramDetail} from '../_models/DiagramDetail.model';
import {RelationDatasource} from './RelationDatasource.model';
import {Relation} from '../_models/Relation.model';
import {ModellerService} from '../modeller.service';
import {DiagramDetailAndModel} from './DiagramDetailAndModel';
import {RelationEditorModel} from './RelationEditorModel';

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
    this.data.diagramDetail.diagramRepresentsModel = this.diagramDetailDatasource.data.getValue().find(value => value.relation.relation == 'diagramRepresentsModel').relation.value;
    this.data.diagramDetail.modelingLanguageConstructInstance = this.diagramDetailDatasource.data.getValue().find(value => value.relation.relation == 'modelingLanguageConstructInstance').relation.value;
    this.data.diagramDetail.note = this.diagramDetailDatasource.data.getValue().find(value => value.relation.relation == 'note').relation.value;
    this.data.diagramDetail.paletteConstruct = this.diagramDetailDatasource.data.getValue().find(value => value.relation.relation == 'paletteConstruct').relation.value;
    this.modellerService.updateDiagram(this.data.diagramDetail, this.data.modelId);

    this.dialogRef.close();
  }

  getDiagramDetailRelations(diagramDetail: DiagramDetail): RelationEditorModel[] {

    let diagramRelations: RelationEditorModel[] = [];

    let diagramRepresentsModel = new Relation();
    diagramRepresentsModel.relation = 'diagramRepresentsModel';
    diagramRepresentsModel.value = diagramDetail.diagramRepresentsModel;

    let modelingLanguageConstructInstance = new Relation();
    modelingLanguageConstructInstance.relation = 'modelingLanguageConstructInstance';
    modelingLanguageConstructInstance.value = diagramDetail.modelingLanguageConstructInstance;

    let note = new Relation();
    note.relation = 'note';
    note.value = diagramDetail.note;

    let paletteConstruct = new Relation();
    paletteConstruct.relation = 'paletteConstruct';
    paletteConstruct.value = diagramDetail.paletteConstruct;

    let modelEditor = new RelationEditorModel(diagramRepresentsModel);
    this.modellerService.getModels().then(value => modelEditor.selectorOptions = value.map(value1 => value1.id));
    diagramRelations.push(modelEditor);
    diagramRelations.push(new RelationEditorModel(modelingLanguageConstructInstance));
    diagramRelations.push(new RelationEditorModel(note));
    diagramRelations.push(new RelationEditorModel(paletteConstruct));

    return diagramRelations;
  }

  close() {
    this.dialogRef.close();
  }
}
