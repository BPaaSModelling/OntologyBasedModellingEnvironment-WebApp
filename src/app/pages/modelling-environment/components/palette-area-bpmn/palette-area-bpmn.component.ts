import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MetamodelElementModel} from '../../../../shared/models/MetamodelElement.model';
import {ModellerService} from '../../../../core/services/modeller/modeller.service';
import {PaletteElementModel} from '../../../../shared/models/PaletteElement.model';
import {ContextMenuComponent} from '@perfectmemory/ngx-contextmenu';
import {UUID} from 'angular2-uuid';
import {ModalExtendPaletteElementComponent} from "../../../../shared/modals/modal-extend-palette-element/modal-extend-palette-element.component";
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
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
import {FiguresClass} from '../../gojs/figures.class';
import {timeout} from 'rxjs/operators';
import {ModalInstancePropertiesComponent} from '../../../../shared/modals/modal-instance-properties/modal-instance-properties.component';
import {
  ModalConnectorElementPropertiesComponent
} from '../../../../shared/modals/modal-connector-element-properties/modal-connector-element-properties.component';
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

  public modelingViews: ModelingViewModel[] = [];
  // Heroku difference
  public modelingLanguages: ModelingLanguageModel[] = [];
  public paletteCategories: PaletteCategoryModel[] = [];
  public imageRoot: string = "";
  private selectedLang: string;
  private selectedView: string;

  constructor(private mService: ModellerService, public dialog: MatDialog, private bpmnTemplateService: BpmnTemplateService, private cdRef: ChangeDetectorRef) {
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
    //this.loadPaletteElement();
  }

  public isBPMNNotationSelected(): boolean {
    return (this.selectedLang === 'lo:BPMN_2_0' && this.selectedView === 'lo:BPMNProcessModelingView') ||
      (this.selectedLang === 'lo:BPaaS_ModelingLanguage' && this.selectedView === 'lo:BPaaSProcessModelingView');
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

    this.handleDialogClose(dialogRef);
  }

  toggleEditPaletteElementModal(element: PaletteElementModel){
    let dialogRef = this.dialog.open(ModalEditPaletteElementComponent, {
      data: { paletteElement: element},
      height:'80%',
      width: '800px',
      disableClose: false,
    });

    this.handleDialogClose(dialogRef);
  }

  private handleDialogClose(dialogRef: MatDialogRef<any, any>) {
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed : ' + result);
      setTimeout(() => {
        this.loadPaletteGoJSElements();
      }, 500);
    });
  }

  toggleCreateDomainElementModalFromExtend(element: PaletteElementModel) {
    let dialogRef = this.dialog.open(ModalCreateDomainElementsComponent, {
      data: {paletteElement: element },
      height:'80%',
      width: '800px',
      disableClose: false,
    });

    this.handleDialogClose(dialogRef);
  }

  toggleActivityElementPropertyModal(element: PaletteElementModel) {
    let dialogRef = this.dialog.open(ModalPaletteElementPropertiesComponent, {
      data: {paletteElement: element },
      height:'80%',
      width: '800px',
      disableClose: false,
    });

    this.handleDialogClose(dialogRef);
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
        this.selectedLang = $event.value;
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
        this.selectedView = $event.value;
        this.cdRef.detectChanges();
        setTimeout(() => {
          this.loadPaletteGoJSElements();
        }, 1000);

      }
    );
    console.log('Palette categories');
    console.log(this.paletteCategories);
  }

  showInstantiatedElements(element: PaletteElementModel) {
    this.dialog.open(ModalShowLanguageInstances, {data:element});
  }

  isElementMappedToBPMNMappers(element: PaletteElementModel): boolean {
    return this.bpmnTemplateService.isElementMappedToBPMNMappers(element);
  }

  loadPaletteGoJSElements() {
    const figuresClass = new FiguresClass();
    figuresClass.defineShapes();

    const tooltiptemplate = this.bpmnTemplateService.getTooltipTemplate();
    const activityNodeTemplateForPalette = this.bpmnTemplateService.getActivityNodeTemplateForPalette();
    const eventNodeTemplate = this.bpmnTemplateService.getEventNodeTemplate(tooltiptemplate, 1);
    const gatewayNodeTemplateForPalette = this.bpmnTemplateService.getGatewayNodeTemplateForPalette(tooltiptemplate);
    const annotationNodeTemplate = this.bpmnTemplateService.getAnnotationNodeTemplate();
    const dataObjectNodeTemplate = this.bpmnTemplateService.getDataObjectNodeTemplate();
    const dataStoreNodeTemplate = this.bpmnTemplateService.getDataStoreNodeTemplate();
    const privateProcessNodeTemplateForPalette = this.bpmnTemplateService.getPrivateProcessingNodeTempalteForPalette();

    const subProcessGroupTemplateForPalette = this.bpmnTemplateService.getSubProcessGroupTemplateForPalette();
    const poolTemplateForPalette = this.bpmnTemplateService.getPoolTemplateForPalette();
    const swimLanesGroupTemplateForPalette = this.bpmnTemplateService.getSwimLanesGroupTemplateForPalette();
    gatewayNodeTemplateForPalette.selectionAdorned = false;
    dataObjectNodeTemplate.selectionAdorned = false;
    dataStoreNodeTemplate.selectionAdorned = false;
    eventNodeTemplate.selectionAdorned = false;
    poolTemplateForPalette.selectionAdorned = false;

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
    this.paletteCategories.forEach((category, indexCategory) => {
      this.mService.paletteElements.forEach((element, indexElement) => {
        if (element.paletteCategory === category.id && !element.hiddenFromPalette && element.type !== 'PaletteConnector'
          && this.isElementMappedToBPMNMappers(element) && !this.isElementBlacklisted(element)) {
          const paletteId = 'myPalette' + '-' + indexCategory.toString() + '-' + indexElement.toString();
          const canvasElement = document.getElementById(paletteId)?.querySelector('canvas');
          // if canvas element already exists, then don't instantiate again
          if (document.getElementById(paletteId) && !canvasElement) {
            this.instatiatePaletteElement(element, paletteId, palNodeTemplateMap, palGroupTemplateMap);
          }
        }
      });
    });

    const canvasContainers = document.getElementsByClassName('bpmn-canvas-container');
    for (let i = 0; i < canvasContainers.length; i++) {
      const foundDiv = canvasContainers[i].querySelector('div');
      if (foundDiv) {
        foundDiv.style.overflow = 'hidden';
      }
    }
  }


  private instatiatePaletteElement(element: PaletteElementModel, paletteId: string, palNodeTemplateMap: go.Map<string, go.Node>, palGroupTemplateMap: go.Map<string, go.Group>) {
    const self = this;
    // initialize the first Palette, BPMN Spec Level 1
    const myPalette =
      $(go.Palette, paletteId,
        { // share the templates with the main Diagram
          "draggingTool.isEnabled": false,
          "panningTool.isEnabled": false,
          allowHorizontalScroll: false,
          allowVerticalScroll: false,
          nodeTemplateMap: palNodeTemplateMap,
          groupTemplateMap: palGroupTemplateMap,
          layout: $(go.GridLayout,
            {
              cellSize: new go.Size(1, 1),
              spacing: new go.Size(5, 5),
            })
        });


    if (PaletteElementModel.getProbableElementType(element) === 'ModelingElement') {
      this.bpmnTemplateService.addGoJsBPMNNodeFields(element, PaletteElementModel.getProbableModellingConstruct(element));
    } else if (PaletteElementModel.getProbableElementType(element) === 'ModelingContainer') {
      const probableModellingConstruct = PaletteElementModel.getProbableModellingConstruct(element);
      this.bpmnTemplateService.addGoJsBPMNGroupFields(element, probableModellingConstruct);
    }
    // @ts-ignore
    element.text = element.label.split(' ').join('\n');

    myPalette.model = $(go.GraphLinksModel,
      {
        copiesArrays: true,
        copiesArrayObjects: true,
        nodeDataArray: [
          // -------------------------- Event Nodes
          element
        ]  // end nodeDataArray
      });  // end model
  }

  public isElementBlacklisted(element: PaletteElementModel) {
    return this.bpmnTemplateService.isElementBlacklisted(element);
  }

  toggleCreateDomainElementModal(element: PaletteElementModel) {
    let dialogRef = this.dialog.open(ModalCreateDomainElementsComponent, {
      data: {paletteElement: element },
      height:'80%',
      width: '800px',
      disableClose: false,
    });

    this.handleDialogClose(dialogRef);
  }
}
