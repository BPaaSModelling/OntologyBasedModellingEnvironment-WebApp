import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {PaletteElementModel} from '../_models/PaletteElement.model';
import {ModellerService} from '../modeller.service';
import {Model} from '../_models/Model.model';
import {DiagramDetail} from '../_models/DiagramDetail.model';
import {Relation} from '../_models/Relation.model';
import {DataSource} from '@angular/cdk/collections';
import {RelationDatasource} from '../_models/RelationDatasource.model';

@Component({
  selector: 'diagram-detail',
  templateUrl: './diagram-detail.html',
  // template: '<div id="cy"></div>',
  //styleUrls: ['./modelling-area.component.css']
})
export class DiagramDetailComponent implements OnInit {

  @Input() diagramDetail: DiagramDetail;
  @Input() model: Model;
  @Output() closeRequest = new EventEmitter();

  displayedColumns: string[] = ['key', 'value'];

  diagramDetailDatasource: RelationDatasource;
  modelElementAttributeDatasource: RelationDatasource;

  diagramRelations: string[] = [
    "diagramRepresentsModel",
    "modelingLanguageConstructInstance",
    "note",
    "paletteConstruct"
  ];

  public constructor(private modellerService: ModellerService) {}

  ngOnInit(): void {
    this.setupDatasources();
  }

  private setupDatasources() {
    this.modelElementAttributeDatasource = new RelationDatasource(this.diagramDetail.modelElementAttributes);
    let diagramDetailRealtions = this.getDiagramDetailRelations(this.diagramDetail);
    this.diagramDetailDatasource = new RelationDatasource(diagramDetailRealtions);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.setupDatasources();
  }

  save() {
    this.diagramDetail.modelElementAttributes = this.modelElementAttributeDatasource.data.getValue();
    this.diagramDetail.diagramRepresentsModel = this.diagramDetailDatasource.data.getValue().find(value => value.relation == 'diagramRepresentsModel').value;
    this.diagramDetail.modelingLanguageConstructInstance = this.diagramDetailDatasource.data.getValue().find(value => value.relation == 'modelingLanguageConstructInstance').value;
    this.diagramDetail.note = this.diagramDetailDatasource.data.getValue().find(value => value.relation == 'note').value;
    this.diagramDetail.paletteConstruct = this.diagramDetailDatasource.data.getValue().find(value => value.relation == 'paletteConstruct').value;
    this.modellerService.updateDiagram(this.diagramDetail, this.model.id);
  }

  getDiagramDetailRelations(diagramDetail: DiagramDetail): Relation[] {

    return diagramDetail.modelElementAttributes.filter(value => this.diagramRelations.includes(value.relation));
  }

  close() {
    this.closeRequest.emit();
  }
}
