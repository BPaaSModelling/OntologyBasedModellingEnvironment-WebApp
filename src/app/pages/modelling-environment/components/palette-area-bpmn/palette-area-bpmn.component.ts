import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MetamodelElementModel} from '../../../../shared/models/MetamodelElement.model';
import {ModellerService} from '../../../../core/services/modeller/modeller.service';
import {PaletteElementModel} from '../../../../shared/models/PaletteElement.model';
import {ContextMenuComponent} from '@perfectmemory/ngx-contextmenu';
import {UUID} from 'angular2-uuid';
import {ModalExtendPaletteElementComponent} from "../../../../shared/modals/modal-extend-palette-element/modal-extend-palette-element.component";
import { MatDialog } from "@angular/material/dialog";
import {ModalCreateDomainElementsComponent} from "../../../../shared/modals/modal-create-domain-elements/modal-create-domain-elements.component";
import {ModalPaletteElementPropertiesComponent} from "../../../../shared/modals/modal-palette-element-properties/modal-palette-element-properties.component";
import {ModalEditPaletteElementComponent} from "../../../../shared/modals/modal-edit-palette-element/modal-edit-palette-element.component";
import {ModelingViewModel} from "../../../../shared/models/ModelingView.model";
import {PaletteCategoryModel} from "../../../../shared/models/PaletteCategory.model";
import {VariablesSettings} from "../../../../_settings/variables.settings";
import {ModalShowLanguageInstances} from '../../../../shared/modals/modal-show-language-instances/modal-show-language-instances';
import {ModelingLanguageModel} from '../../../../shared/models/ModelingLanguage.model';
import * as go from 'gojs';
import {BpmnTemplateService} from '../../gojs/bpmn-classes/bpmn-template.service';
const $ = go.GraphObject.make;

@Component({
  selector: 'app-palette-area-bpmn',
  templateUrl: './palette-area-bpmn.component.html',
  styleUrls: ['./palette-area-bpmn.component.css']
})
export class PaletteAreaBPMNComponent implements OnInit {

  @ViewChild(ContextMenuComponent, { static: true }) public elementRightClickMenu: ContextMenuComponent<any>;
  @ViewChild(ContextMenuComponent, { static: true }) public paletteRightClickMenu: ContextMenuComponent<any>;
  // Optional
  @Input() contextMenu: ContextMenuComponent<any>;
  @Input() contextMenuSubject: PaletteElementModel;


  @Output() sendElementFromPalette = new EventEmitter();
  @Output() showPaletteElementPropertyModal = new EventEmitter();
  @Output() showExtendPaletteElementModal = new EventEmitter();
  @Output() showCreateDomainElementModal = new EventEmitter();
  @Output() showConnectorElementPropertyModal = new EventEmitter();
  @Output() showActivityElementPropertyModal = new EventEmitter();
  @Output() showEditPaletteElementModal = new EventEmitter();

  public modelingViews: ModelingViewModel[] = [];
  // Heroku difference
  public modelingLanguages: ModelingLanguageModel[] = [];
  public paletteCategories: PaletteCategoryModel[] = [];
  public imageRoot: string = "";

  constructor(private mService: ModellerService, public dialog: MatDialog, private bpmnTemplateService: BpmnTemplateService) {
    // Heroku difference
    //this.mService.queryModelingLanguages()
    this.mService.queryModelingLanguages().subscribe(
      (response) => {
        console.log(response);
        this.modelingLanguages = response;
      }
    );
    //this.mService.queryPaletteCategories();


this.imageRoot = VariablesSettings.IMG_ROOT;
//console.log('Palette categories');
//console.log(this.mService.paletteCategories);

  }

  ngOnInit() {
  }

  private addNewShape(a: PaletteElementModel): void {
    //Here i give to the paletteElement a new ID, so that when this is received by the modeller, it recognize it as a new Element to create
    const uuid = UUID.UUID();
    const b: PaletteElementModel = Object.assign({}, a);
    //b.id = a.id;
    b.tempUuid = uuid;
    this.sendElementFromPalette.emit(b);
  }

  removeFromPalette(element: PaletteElementModel) {
    console.log('clicked ', element);
    if (confirm('Do you want to remove ' + element.label + ' from palette?')) {
      // Save it!
    } else {
      // Do nothing!
    }
  }

  openPaletteElementPropertiesModal(element: PaletteElementModel) {
    this.showPaletteElementPropertyModal.emit(element);
  }

  openExtendPaletteElementModal(element: PaletteElementModel){
    this.showExtendPaletteElementModal.emit(element);
  }

  openEditPaletteElementModal(element: PaletteElementModel){
    this.showEditPaletteElementModal.emit(element);
  }

  openCreateDomainElementModal(element: PaletteElementModel) {
    this.showCreateDomainElementModal.emit(element);
}

  openConnectorElementProperty(element: PaletteElementModel) {
    this.showConnectorElementPropertyModal.emit(element);
  }

  openActivityElementProperty(element: PaletteElementModel) {
    this.showActivityElementPropertyModal.emit(element);
  }

  toggleExtendPaletteElementModal(element: PaletteElementModel) {
    //console.log(element)
    let dialogRef = this.dialog.open(ModalExtendPaletteElementComponent, {
      data: { paletteElement: element},
      height:'80%',
      width: '800px',
      disableClose: false,
    });

    const sub = dialogRef.componentInstance.newElementCreated.subscribe(() => {
      this.mService.queryPaletteElements();
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed : ' + result);
    });
  }

  toggleEditPaletteElementModal(element: PaletteElementModel){
    let dialogRef = this.dialog.open(ModalEditPaletteElementComponent, {
      data: { paletteElement: element},
      height:'80%',
      width: '800px',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed : ' + result);
    });
  }

  toggleCreateDomainElementModalFromExtend(element: PaletteElementModel) {
    let dialogRef = this.dialog.open(ModalCreateDomainElementsComponent, {
      data: {paletteElement: element },
      height:'80%',
      width: '800px',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed : ' + result);
    });
  }

  toggleActivityElementPropertyModal(element: PaletteElementModel) {
    let dialogRef = this.dialog.open(ModalPaletteElementPropertiesComponent, {
      data: {paletteElement: element },
      height:'80%',
      width: '800px',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed : ' + result);
    });
  }

  hideFromPalette(element: PaletteElementModel) {
    console.log('Hiding element : ' + element.label);
    console.log(element.id);
    element.uuid = (element.label).replace(new RegExp(' ', 'g'), ''); // replace spaces
    this.mService.hidePaletteElement(JSON.stringify(element)).subscribe(
      (response) => {
        console.log(response);
        this.mService.queryPaletteElements();
      }
    );
  }

  selectLang($event: any) {
    console.log('Modeling language selected');
    console.log($event.value);
    this.modelingViews = [];
    this.paletteCategories = [];
    this.mService.queryModelingViews($event.value).subscribe(
    (response) => {
        console.log(response);
        this.modelingViews = response;
    }
    );
  }

  selectView($event: any) {
    console.log('Modeling View selected');
    console.log($event.value);
    this.paletteCategories = [];
    this.mService.queryPaletteCategories($event.value).subscribe(
      (response) => {
        console.log(response);
        this.paletteCategories = response;
        this.mService.queryPaletteElements();
        console.log('Palette elements:');
        console.log(this.mService.paletteElements);
      }
    );
    console.log('Palette categories');
    console.log(this.paletteCategories);
  }

  // Heroku difference
  addNewPaletteElement() {}

  managePaletteElements() {}

  showInstantiatedElements(element: PaletteElementModel) {
    this.dialog.open(ModalShowLanguageInstances, {data:element});
  }

  loadPaletteGoJSElements() {
    const self = this;
    const tooltiptemplate = this.bpmnTemplateService.getTooltipTemplate();
    const activityNodeTemplateForPalette = self.bpmnTemplateService.getActivityNodeTemplateForPalette();
    const eventNodeTemplate = this.bpmnTemplateService.getEventNodeTemplate(tooltiptemplate);
    const gatewayNodeTemplateForPalette = this.bpmnTemplateService.getGatewayNodeTemplateForPalette(tooltiptemplate);
    const annotationNodeTemplate = this.bpmnTemplateService.getAnnotationNodeTemplate();
    const dataObjectNodeTemplate = this.bpmnTemplateService.getDataObjectNodeTemplate();
    const dataStoreNodeTemplate = this.bpmnTemplateService.getDataStoreNodeTemplate();
    const privateProcessNodeTemplateForPalette = this.bpmnTemplateService.getPrivateProcessingNodeTempalteForPalette();

    const subProcessGroupTemplateForPalette = this.bpmnTemplateService.getSubProcessGroupTemplateForPalette();
    const poolTemplateForPalette = this.bpmnTemplateService.getPoolTemplateForPalette();
    const swimLanesGroupTemplateForPalette = this.bpmnTemplateService.getSwimLanesGroupTemplateForPalette();

    // create the nodeTemplateMap, holding special palette "mini" node templates:
    const palNodeTemplateMap = new go.Map<string, go.Node>();
    palNodeTemplateMap.add('activity', activityNodeTemplateForPalette);
    palNodeTemplateMap.add('event', eventNodeTemplate);
    palNodeTemplateMap.add('gateway', gatewayNodeTemplateForPalette);
    palNodeTemplateMap.add('annotation', annotationNodeTemplate);
    palNodeTemplateMap.add('dataobject', dataObjectNodeTemplate);
    palNodeTemplateMap.add('datastore', dataStoreNodeTemplate);
    palNodeTemplateMap.add('privateProcess', privateProcessNodeTemplateForPalette);

    const palGroupTemplateMap = new go.Map<string, go.Group>();
    palGroupTemplateMap.add('subprocess', subProcessGroupTemplateForPalette);
    palGroupTemplateMap.add('Pool', poolTemplateForPalette);
    palGroupTemplateMap.add('Lane', swimLanesGroupTemplateForPalette);

    // ------------------------------------------  Palette   ----------------------------------------------

    // initialize the first Palette, BPMN Spec Level 1
    const myPaletteLevel1 =
      $(go.Palette, 'myPalette',
        { // share the templates with the main Diagram
          nodeTemplateMap: palNodeTemplateMap,
          groupTemplateMap: palGroupTemplateMap,
          layout: $(go.GridLayout,
            {
              cellSize: new go.Size(1, 1),
              spacing: new go.Size(5, 5),
              comparer: self.keyCompare
            })
        });


    myPaletteLevel1.model = $(go.GraphLinksModel,
      {
        copiesArrays: true,
        copiesArrayObjects: true,
        nodeDataArray: [
          // -------------------------- Event Nodes
          { key: 101, category: 'event', text: 'Start', eventType: 1, eventDimension: 1, item: 'start' },
          { key: 102, category: 'event', text: 'Message', eventType: 2, eventDimension: 2, item: 'Message' }, // BpmnTaskMessage
          { key: 103, category: 'event', text: 'Timer', eventType: 3, eventDimension: 3, item: 'Timer' },
          { key: 104, category: 'event', text: 'End', eventType: 1, eventDimension: 8, item: 'End' },
          { key: 107, category: 'event', text: 'Message', eventType: 2, eventDimension: 8, item: 'Message' }, // BpmnTaskMessage
          { key: 108, category: 'event', text: 'Terminate', eventType: 13, eventDimension: 8, item: 'Terminate' },
          // -------------------------- Task/Activity Nodes
          { key: 131, category: 'activity', text: 'Task', item: 'generic task', taskType: 0 },
          { key: 132, category: 'activity', text: 'User Task', item: 'User task', taskType: 2 },
          { key: 133, category: 'activity', text: 'Service\nTask', item: 'service task', taskType: 6 },
          // subprocess and start and end
          { key: 134, category: 'subprocess', loc: '0 0', text: 'Subprocess', isGroup: true, isSubProcess: true, taskType: 0 },
          { key: -802, category: 'event', loc: '0 0', group: 134, text: 'Start', eventType: 1, eventDimension: 1, item: 'start' },
          { key: -803, category: 'event', loc: '350 0', group: 134, text: 'End', eventType: 1, eventDimension: 8, item: 'end', name: 'end' },
          // -------------------------- Gateway Nodes, Data, Pool and Annotation
          { key: 201, category: 'gateway', text: 'Parallel', gatewayType: 1 },
          { key: 204, category: 'gateway', text: 'Exclusive', gatewayType: 4 },
          { key: 301, category: 'dataobject', text: 'Data\nObject' },
          { key: 302, category: 'datastore', text: 'Data\nStorage' },
          { key: 401, category: 'privateProcess', text: 'Black Box' },
          { key: '501', 'text': 'Pool 1', 'isGroup': 'true', 'category': 'Pool' },
          { key: 'Lane5', 'text': 'Lane 1', 'isGroup': 'true', 'group': '501', 'color': 'lightyellow', 'category': 'Lane' },
          { key: 'Lane6', 'text': 'Lane 2', 'isGroup': 'true', 'group': '501', 'color': 'lightgreen', 'category': 'Lane' },
          { key: 701, category: 'annotation', text: 'note' }
        ]  // end nodeDataArray
      });  // end model
  }

  // Make sure the pipes are ordered by their key in the palette inventory
  private keyCompare(a: go.Part, b: go.Part) {
    const at = a.data.key;
    const bt = b.data.key;
    if (at < bt) { return -1; }
    if (at > bt) { return 1; }
    return 0;
  }
}
