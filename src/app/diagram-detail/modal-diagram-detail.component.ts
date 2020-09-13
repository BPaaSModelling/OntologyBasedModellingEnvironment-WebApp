import {Component, Inject, SimpleChanges} from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DiagramDetail} from '../_models/DiagramDetail.model';
import {RelationDatasource} from './RelationDatasource.model';
import {Relation} from '../_models/Relation.model';
import {ModellerService} from '../modeller.service';
import {DiagramDetailAndModel} from '../_models/DiagramDetailAndModel';
import {RelationEditorModel} from './RelationEditorModel';
import {ValueModel} from './ValueModel';
import {RelationOption} from '../_models/RelationOption.model';
import * as _ from 'lodash';

@Component({
  selector: 'modal-diagram-detail',
  templateUrl: 'diagram-detail.html'
})
export class ModalViewDiagramDetail {

  displayedColumnsDiagramAttrs: string[] = ['key', 'value'];
  displayedColumnsModelAttrs: string[] = ['key', 'value', 'actions'];
  hiddenValueOptions: string[] = [
    'modelingContainerContainsModelingLanguageConstruct',
    'modelingRelationHasSourceModelingElement',
    'modelingRelationHasTargetModelingElement'
  ];

  diagramDetailDatasource: RelationDatasource;
  modelElementAttributeDatasource: RelationDatasource;

  options: RelationOption[];
  selectedOption: RelationOption;

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

    this.prepareModelingLanguageElementAttributes();
    let diagramDetailRelations = this.getDiagramDetailRelations(this.data.diagramDetail);
    this.diagramDetailDatasource = new RelationDatasource(diagramDetailRelations);
  }

  private prepareModelingLanguageElementAttributes() {

    this.options = this.data.diagramDetail.modelElementAttributes.options.filter(opt => this.isAvailableInDetailsView(opt.relation));

    let promises: Promise<RelationEditorModel>[] = [];

    this.data.diagramDetail.modelElementAttributes
      .values.filter(value => {
        return this.isAvailableInDetailsView(value.relation);
      })
      .forEach(value => {
        let editor = new RelationEditorModel(value);
        let promise = this.modellerService.getOptionsForRelation(value.relationPrefix + ':' + value.relation)
          .then(response => {
            editor.selectorOptions = response.instances.concat(response.classes)
              .map(option => new ValueModel(option.split(':')[0], option.split(':')[1]));

            editor.selectedValue = new ValueModel(value.valuePrefix, value.value);
            return editor;
          });

        promises.push(promise);
      });

    Promise.all(promises).then(promiseResult => {
      this.modelElementAttributeDatasource = new RelationDatasource(promiseResult);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.setupDatasources();
  }

  save() {
    let tableValues = this.modelElementAttributeDatasource.data.getValue()
      .filter(tableValue => {
        return tableValue.selectedValue != undefined;
      })
      .map(tableValue => {
        let rel = tableValue.relation;
        rel.valuePrefix = tableValue.selectedValue.id;
        rel.value = tableValue.selectedValue.value;
        return rel;
    });

    let notInTableValues = [];

    if (this.data.diagramDetail.modelElementAttributes.values !== undefined) {
      notInTableValues = this.data.diagramDetail.modelElementAttributes
        .values.filter(value => {
        return !this.isAvailableInDetailsView(value.relation);
      });
    }

    this.data.diagramDetail.modelElementAttributes.values = notInTableValues.concat(tableValues);
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

  addRelation() {
    let rel = new Relation();
    rel.relation = this.selectedOption.relation;
    rel.relationPrefix = this.selectedOption.relationPrefix;
    let editor = new RelationEditorModel(rel);

    this.modellerService.getOptionsForRelation(rel.relationPrefix + ':' + rel.relation)
      .then(response => {

        let valueModels = response.instances.concat(response.classes).map(option => new ValueModel(option.split(':')[0], option.split(':')[1]));
        editor.selectorOptions = valueModels;
        let values = this.modelElementAttributeDatasource.data.getValue();
        values.push(editor);
        this.modelElementAttributeDatasource = new RelationDatasource(values)
      });
  }

  isAvailableInDetailsView(relation: string) {
    return !this.hiddenValueOptions.includes(relation);
  }

  compareModelValues(o1: ValueModel, o2: ValueModel) {
    return _.isEqual(o1, o2);
  }

  removeRelation(element: RelationEditorModel) {
    let values = this.modelElementAttributeDatasource.data.getValue();
    _.remove(values, value => {
      return _.isEqual(value, element);
    });

    this.modelElementAttributeDatasource = new RelationDatasource(values)
  }
}
