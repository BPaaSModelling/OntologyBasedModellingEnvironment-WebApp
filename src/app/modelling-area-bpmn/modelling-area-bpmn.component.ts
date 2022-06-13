import {Component, Input, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import * as go from 'gojs';
import {ChangedEvent} from 'gojs';
import {PaletteElementModel} from '../_models/PaletteElement.model';
import {VariablesSettings} from '../_settings/variables.settings';
import {ModellerService} from '../core/modeller/modeller.service';
import {ContextMenuComponent} from '@perfectmemory/ngx-contextmenu';
import {Model} from '../_models/Model.model';
import {MatDialog} from '@angular/material/dialog';
import {UUID} from 'angular2-uuid';
import * as _ from 'lodash-es';
import {InstantiationTargetType} from '../_models/InstantiationTargetType.model';
import {ModalModelLink} from '../modal-model-link/modal-model-link';
import {ModalElementNote} from '../modal-element-note/modal-element-note.component';
import {
  ModalModellingLanguageConstructInstanceLink,
  VisualisationLinksData
} from '../modal-modelling-language-construct-instance-link/modal-modelling-language-construct-instance-link';
import {ModalPaletteVisualisation} from '../modal-palette-visualisation/modal-palette-visualisation';
import {ModelElementDetail} from '../_models/ModelElementDetail.model';
import {ModelElementDetailAndModel} from '../_models/ModelElementDetailAndModel';
import {ModalViewElementDetail} from '../model-element-detail/model-element-detail.component';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {filter, switchMap, take, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs/internal/Subject';
import {of} from 'rxjs/internal/observable/of';

import { DrawCommandHandler } from './helpers/DrawCommandHandler';
import {LaneResizingTool} from './helpers/lane-resizing-tool.class';
import {PoolLayout} from './helpers/pool-layout.class';
import {Helpers} from './helpers/helpers';
import {PoolLink} from './helpers/bpmn-classes/pool-link.class';
import {BPMNLinkingTool} from './helpers/bpmn-classes/bpmn-linking-tool.class';
import {BPMNRelinkingTool} from './helpers/bpmn-classes/bpmn-relinking-tool.class';
import {Mappers} from './helpers/mappers';


const $ = go.GraphObject.make;

@Component({
  selector: 'app-modelling-area-bpmn',
  templateUrl: './modelling-area-bpmn.component.html',
  styleUrls: ['./modelling-area-bpmn.component.css']
})
export class ModellingAreaBPMNComponent implements OnInit, OnDestroy {
  public constructor(public mService: ModellerService, public matDialog: MatDialog, private activatedRoute: ActivatedRoute, private router: Router) {
    console.log('Constructor of graph');
    (go as any).licenseKey = '54ff43e7b11c28c702d95d76423d38f919a52e63998449a35a0412f6be086d1d239cef7157d78cc687f84cfb487fc2898fc1697d964f073cb539d08942e786aab63770b3400c40dea71136c5ceaa2ea1fa2b24a5c5b775a2dc718cf3bea1c59808eff4d54fcd5cb92b280735562bac49e7fc8973f950cf4e6b3d9ba3fffbbf4faf3c7184ccb4569aff5a70deb6f2a3417f';

    this.dialog = matDialog;
  }

  static myDiagram: go.Diagram;
  // constants for design choices
  private GradientYellow = $(go.Brush, 'Linear', { 0: 'LightGoldenRodYellow', 1: '#FFFF66' });
  private GradientLightGreen = $(go.Brush, 'Linear', { 0: '#E0FEE0', 1: 'PaleGreen' });
  private GradientLightGray = $(go.Brush, 'Linear', { 0: 'White', 1: '#DADADA' });

  private ActivityNodeFill = $(go.Brush, 'Linear', { 0: 'OldLace', 1: 'PapayaWhip' });
  private ActivityNodeStroke = '#CDAA7D';
  private ActivityMarkerStrokeWidth = 1.5;
  private ActivityNodeWidth = 120;
  private ActivityNodeHeight = 80;
  private ActivityNodeStrokeWidth = 1;
  private ActivityNodeStrokeWidthIsCall = 4;

  private SubprocessNodeFill = this.ActivityNodeFill;
  private SubprocessNodeStroke = this.ActivityNodeStroke;

  private EventNodeSize = 42;
  private EventNodeInnerSize = this.EventNodeSize - 6;
  private EventNodeSymbolSize = this.EventNodeInnerSize - 14;
  private EventEndOuterFillColor = 'pink';
  private EventBackgroundColor = this.GradientLightGreen;
  private EventSymbolLightFill = 'white';
  private EventSymbolDarkFill = 'dimgray';
  private EventDimensionStrokeColor = 'green';
  private EventDimensionStrokeEndColor = 'red';
  private EventNodeStrokeWidthIsEnd = 4;

  private GatewayNodeSize = 80;
  private GatewayNodeSymbolSize = 45;
  private GatewayNodeFill = this.GradientYellow;
  private GatewayNodeStroke = 'darkgoldenrod';
  private GatewayNodeSymbolStroke = 'darkgoldenrod';
  private GatewayNodeSymbolFill = this.GradientYellow;
  private GatewayNodeSymbolStrokeWidth = 3;

  private DataFill = this.GradientLightGray;
  private destroy$ = new Subject<void>();

  @ViewChild(ContextMenuComponent, { static: true }) public elementRightClickMenu: ContextMenuComponent<any>;
  @ViewChild(ContextMenuComponent, { static: true }) public paletteRightClickMenu: ContextMenuComponent<any>;

  @Input() contextMenu: ContextMenuComponent<any>;
  @Input() contextMenuSubject: PaletteElementModel;

  @Input() public elements: any;
  @Input() public style: any;
  @Input() public layout: any;
  @Input() public zoom: any;
  @Input() new_element: PaletteElementModel;

  public models: Model[] = [];
  public selectedModel: Model;
  public selectedConnectorMode: PaletteElementModel;
  private pathPatterns: Map<string, string> = new Map();
  private dialog: MatDialog;

  selectedFile: File;

  selectedInstantiationType: InstantiationTargetType = InstantiationTargetType.INSTANCE;

  // conversion functions used by data Bindings
  static nodeActivityTaskTypeConverter(s: number): Array<string> | string {
    const tasks = ['Empty',
      'BpmnTaskMessage',
      'BpmnTaskUser',
      'BpmnTaskManual',   // Custom hand symbol
      'BpmnTaskScript',
      'BpmnTaskMessage',  // should be black on white
      'BpmnTaskService',  // Custom gear symbol
      'InternalStorage'];
    if (s < tasks.length) { console.log(tasks[s]); return tasks[s]; }
    return 'NotAllowed'; // error
  }


  ngOnInit(): void {
    this.mService.queryPaletteElements();
    this.loadModels();
    this.prepareModel();
  }


  private prepareModel() {
    this.activatedRoute.queryParams
      .pipe(filter(params => !!params && params.id),
        switchMap((params) => {
          if (params.id) {
            this.selectedModel = new Model();
            this.selectedModel.id = params.id;
            this.selectedModel.label = params.label;
            return this.mService.getElements(params.id);
          }
          return of(null);
        }),
        takeUntil(this.destroy$))
      .subscribe(elements => {
        this.selectedModel.goJsModel = new go.GraphLinksModel();
        this.prepareModelElements(this.selectedModel, elements);
        console.log(this.selectedModel);
        this.selectionChanged();
        }
      );
  }

  private prepareModelElements(model: Model, value: ModelElementDetail[]) {
    model.elements = value;
    model.elements.forEach(element => {

      if (element.modelElementType === 'ModelingRelation') {

        const linkData = {
          key: element.id,
          element: element,
          text: element.label,
          fromArrow: element.fromArrow || '',
          toArrow: element.toArrow || '',
          from: this.findShapeById(model.elements, element.fromShape),
          to: this.findShapeById(model.elements, element.toShape),
          pathPattern: this.pathPatterns.get(element.arrowStroke),
          shapeRepresentsModel: element.shapeRepresentsModel,
          otherVisualisationsOfSameLanguageConstruct: element.otherVisualisationsOfSameLanguageConstruct,
          routing: go.Link.Orthogonal
        };

        if (element.fromArrow !== undefined) {
          linkData.fromArrow = element.fromArrow;
        }

        if (element.toArrow !== undefined) {
          linkData.toArrow = element.toArrow;
        }

        model.goJsModel.addLinkData(linkData);

      } else if (element.modelElementType === 'ModelingElement') {
        console.log(Mappers.dictionaryAOAMEBPMNGroupToGoJsGroup.get(element.modellingLanguageConstruct));

        const nodeData = {
          text: element.label,
          key: element.id,
          fill: '#0000',
          source: VariablesSettings.IMG_ROOT + element.imageUrl,
          size: new go.Size(element.width, element.height),
          width: element.width,
          height: element.height,
          alignment: go.Spot.Center,
          loc: new go.Point(element.x, element.y),
          element: element,
          shapeRepresentsModel: element.shapeRepresentsModel,
          otherVisualisationsOfSameLanguageConstruct: element.otherVisualisationsOfSameLanguageConstruct
        };

        this.addGoJsBPMNNodeFields(nodeData, element.modellingLanguageConstruct);

        model.goJsModel.addNodeData(nodeData);
      } else if (element.modelElementType === 'ModelingContainer') {

        const nodeData = {
          text: element.label,
          key: element.id,
          fill: '#0000',
          source: VariablesSettings.IMG_ROOT + element.imageUrl,
          size: new go.Size(element.width, element.height),
          width: element.width,
          height: element.height,
          alignment: go.Spot.Bottom,
          loc: new go.Point(element.x, element.y),
          element: element,
          shapeRepresentsModel: element.shapeRepresentsModel,
          otherVisualisationsOfSameLanguageConstruct: element.otherVisualisationsOfSameLanguageConstruct,
          isGroup: true
        };
        this.addGoJsBPMNGroupFields(nodeData, element.modellingLanguageConstruct);

        model.goJsModel.addNodeData(nodeData);
      }

    });

    model.elements.forEach(modelElement => {
      if (modelElement.modelElementType === 'ModelingContainer') {
        const containedElements = modelElement.containedShapes || [];
        containedElements.forEach(element => {
          let data = model.goJsModel.nodeDataArray.find(nodeData => nodeData.element.modelingLanguageConstructInstance === element);
          if (data == null) {
            data = model.goJsModel.linkDataArray.find(nodeData => nodeData.element.modelingLanguageConstructInstance === element);
          }
          if (data != null) {
            data.group = modelElement.id;
          }
        });
      }

    });
  }

  private findShapeById(modelElements: ModelElementDetail[], shapeId: string) {

    const modelElement = modelElements.find(diag => diag.modelingLanguageConstructInstance === shapeId);
    if (modelElement !== undefined) {
      return modelElement.id;
    }

    return undefined;
  }

  // private navigateToLinkedModel() {
  //   return (e, obj) => {
  //     const node = obj.part;
  //     if (node != null) {
  //       console.log(node);
  //       const element = node.data.element;
  //       const foundModel = this.models.find(e => e.id === element.shapeRepresentsModel);
  //
  //       if (!foundModel) {
  //         return;
  //       }
  //       const navExtras = {
  //         queryParams: {
  //           id: foundModel.id,
  //           label: foundModel.label
  //         }
  //       } as NavigationExtras;
  //       this.router.navigate(['/modeller'], navExtras);
  //     }
  //   };
  // }
  //
  // private handleNodePaste(txn: any) {
  //   // TODO handle case when several elements are copied (including containers and links)
  //   const data = txn.changes.toArray().find(change => change.propertyName = 'nodeDataArray').newValue;
  //   const element = data.element;
  //
  //   const paletteConstructName = element.paletteConstruct.split(':')[1];
  //   const key = paletteConstructName + '_Shape_' + UUID.UUID();
  //
  //   ModellingAreaBPMNComponent.myDiagram.model.setKeyForNodeData(data, key);
  //   const newElement = Object.assign({}, element); // apparently copying leads to referencing the same element from both data objects...
  //   newElement.id = key;
  //   const newNodeData = ModellingAreaBPMNComponent.myDiagram.model.findNodeDataForKey(key);
  //   newNodeData.element = newElement;
  //
  //   this.mService.copyElement(
  //     newElement,
  //     this.selectedModel.id
  //   ).then(response => {
  //     const nodeToManipulate = ModellingAreaBPMNComponent.myDiagram.model.findNodeDataForKey(key);
  //     ModellingAreaBPMNComponent.myDiagram.model.setDataProperty(nodeToManipulate, 'otherVisualisationsOfSameLanguageConstruct', response.otherVisualisationsOfSameLanguageConstruct);
  //     nodeToManipulate.element = response;
  //
  //     response.otherVisualisationsOfSameLanguageConstruct.forEach(otherElementDataKey => {
  //       const otherNodeData = ModellingAreaBPMNComponent.myDiagram.model.findNodeDataForKey(otherElementDataKey);
  //       if (otherNodeData) {
  //         const otherElements = otherNodeData.element.otherVisualisationsOfSameLanguageConstruct && otherNodeData.element.otherVisualisationsOfSameLanguageConstruct.slice() || [];
  //         otherElements.push(response.id);
  //         ModellingAreaBPMNComponent.myDiagram.model.setDataProperty(otherNodeData, 'otherVisualisationsOfSameLanguageConstruct', otherElements);
  //         otherNodeData.element.otherVisualisationsOfSameLanguageConstruct = otherElements;
  //       }
  //     });
  //   });
  // }
  //
  // private handleNodeResizing(txn: any) {
  //
  //   // resizing should only be affecting one element, we are not interested in the others
  //   const latestChange = _.last(txn.changes.toArray().filter(change => change.propertyName === 'size'));
  //   const modelElement = latestChange.object.element;
  //   modelElement.width = Math.trunc(Number.parseInt(latestChange.newValue.split(' ')[0], 10));
  //   modelElement.height = Math.trunc(Number.parseInt(latestChange.newValue.split(' ')[1], 10));
  //   latestChange.object.width = modelElement.width;
  //   latestChange.object.height = modelElement.height;
  //
  //   this.mService.updateElement(modelElement, this.selectedModel.id);
  // }
  //
  // private handleNodeDeleted(txn) {
  //   txn.changes.toArray().filter(element => element.propertyName === 'parts').forEach(evt => {
  //     this.mService.deleteElement(this.selectedModel.id, evt.oldValue.data.element.id);
  //   });
  // }
  //
  // private handleNodeTextEditing(txn) {
  //   const nodeData = txn.changes.iteratorBackwards.first().object;
  //   const modelElement: ModelElementDetail = nodeData.element;
  //   modelElement.label = nodeData.text;
  //
  //   this.mService.updateElement(modelElement, this.selectedModel.id);
  // }
  //
  // private handleNodeLinking(txn) {
  //   const change = txn.changes.toArray().find(element => element.propertyName === 'data');
  //   const link = ModellingAreaBPMNComponent.myDiagram.findLinkForData(change.object.data);
  //
  //   if (this.selectedConnectorMode === undefined || this.selectedConnectorMode.arrowStroke === undefined) {
  //     ModellingAreaBPMNComponent.myDiagram.model.removeLinkData(link.data);
  //     return;
  //   }
  //
  //   link.data.toArrow = this.selectedConnectorMode.toArrow || '';
  //   link.data.fromArrow = this.selectedConnectorMode.fromArrow || '';
  //   link.data.routing = this.selectedConnectorMode.routing || '';
  //   link.data.pathPattern = this.pathPatterns.get(this.selectedConnectorMode.arrowStroke);
  //
  //   const fromElement = change.newValue.from;
  //   const toElement = change.newValue.to;
  //
  //   this.mService.createConnection(
  //     this.selectedModel.id,
  //     UUID.UUID(),
  //     change.object.location.x,
  //     change.object.location.y,
  //     fromElement,
  //     toElement,
  //     this.selectedConnectorMode.id.split('#')[1],
  //     this.selectedInstantiationType
  //   ).then(response => {
  //     link.data.element = response;
  //   });
  //
  //   ModellingAreaBPMNComponent.myDiagram.rebuildParts();
  // }
  //
  // private handleNodeMove(txn) {
  //   const lastMovedNodes = new Map();
  //
  //   txn.changes.toArray()
  //     .filter(evt => ['location', 'position'].includes(evt.propertyName))
  //     .forEach(evt => {
  //
  //     const nodeData = evt.object;
  //
  //     const modelElement: ModelElementDetail = nodeData.data.element;
  //       modelElement.x = Math.trunc(nodeData.location.x);
  //       modelElement.y = Math.trunc(nodeData.location.y);
  //     nodeData.data.loc = new go.Point(modelElement.x, modelElement.y);
  //
  //     lastMovedNodes.set(
  //       modelElement.id,
  //       {
  //         modelElementDetail: modelElement,
  //         node: nodeData.data
  //       }
  //     );
  //   });
  //
  //   lastMovedNodes.forEach(nodeInfo => {
  //     if (nodeInfo.modelElementDetail.modelElementType === 'ModelingElement' || nodeInfo.modelElementDetail.modelElementType === 'ModelingContainer') {
  //       this.updateContainerInformationIfNeeded(nodeInfo);
  //       this.mService.updateElement(nodeInfo.modelElementDetail, this.selectedModel.id);
  //     }
  //   });
  //
  //   ModellingAreaBPMNComponent.myDiagram.rebuildParts();
  // }

  // private updateContainerInformationIfNeeded(nodeInfo) {
  //   const initialContainerKey = nodeInfo.node.group;
  //
  //   // check if element has been moved inside any of the containers and update those
  //   const overlappedContainers: ModelElementDetail[] = [];
  //
  //   ModellingAreaBPMNComponent.myDiagram.model.nodeDataArray.forEach(containerNode => {
  //     if (
  //       containerNode.element.modelElementType === 'ModelingContainer' &&
  //       nodeInfo.modelElementDetail.id != containerNode.element.id &&
  //       this.isNodeInContainer(containerNode, nodeInfo.modelElementDetail)
  //     ) {
  //       overlappedContainers.push(containerNode.element);
  //     }
  //   });
  //
  //   let mostSpecificContainer: ModelElementDetail;
  //   overlappedContainers.forEach(value => {
  //     if (mostSpecificContainer === undefined) {
  //       mostSpecificContainer = value;
  //     }
  //     if (mostSpecificContainer.containedShapes !== undefined && mostSpecificContainer.containedShapes.includes(value.modelingLanguageConstructInstance)) {
  //       mostSpecificContainer = value;
  //     }
  //   });
  //
  //   if (initialContainerKey !== undefined &&
  //     ((mostSpecificContainer !== undefined && initialContainerKey !== mostSpecificContainer.id) || // moved to another container
  //       (mostSpecificContainer === undefined)) // moved out of the container into the open space
  //   ) {
  //     this.removeElementFromContainer(nodeInfo.node.group, nodeInfo.modelElementDetail.modelingLanguageConstructInstance);
  //     delete nodeInfo.node.group;
  //   }
  //
  //   if (mostSpecificContainer !== undefined) {
  //     nodeInfo.node.group = mostSpecificContainer.id;
  //     const containedShapes = mostSpecificContainer.containedShapes || [];
  //     if (!containedShapes.includes(nodeInfo.modelElementDetail.modelingLanguageConstructInstance)) {
  //       containedShapes.push(nodeInfo.modelElementDetail.modelingLanguageConstructInstance);
  //       mostSpecificContainer.containedShapes = containedShapes;
  //       this.mService.updateElement(mostSpecificContainer, this.selectedModel.id);
  //     }
  //   }
  // }
  //
  // private removeElementFromContainer(groupKey, elementKey) {
  //   const containerNode = ModellingAreaBPMNComponent.myDiagram.model.findNodeDataForKey(groupKey);
  //   _.remove(containerNode.element.containedShapes, s => s === elementKey);
  //   this.mService.updateElement(containerNode.element, this.selectedModel.id);
  // }
  //
  // private isNodeInContainer(containerNode, node) {
  //   return containerNode.element.x < node.x &&
  //     containerNode.element.x + containerNode.element.width > node.x + node.width &&
  //     containerNode.element.y < node.y &&
  //     containerNode.element.y + containerNode.element.height > node.y + node.height;
  // }

  selectionChanged() {

    if (ModellingAreaBPMNComponent.myDiagram === undefined) {
      this.initDiagramCanvas();
    }

    if (this.selectedModel !== undefined) {
      if (this.selectedModel.goJsModel !== undefined) {
        ModellingAreaBPMNComponent.myDiagram.model = new go.GraphLinksModel(this.selectedModel.goJsModel.nodeDataArray, this.selectedModel.goJsModel.linkDataArray);
      } else {
        ModellingAreaBPMNComponent.myDiagram.model = new go.GraphLinksModel();
        this.selectedModel.goJsModel = ModellingAreaBPMNComponent.myDiagram.model;
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.new_element && changes.new_element.currentValue && this.selectedModel) {

      if (changes.new_element.currentValue.type === 'PaletteConnector') {
        this.setConnectorMode(changes.new_element.currentValue);
      } else {
        this.createElement(changes.new_element.currentValue);
      }
    }
  }

  setConnectorMode(element: PaletteElementModel) {
    this.selectedConnectorMode = element;
  }

  createElement(element: PaletteElementModel) {

    console.log('category is: ' + element.paletteCategory);
    console.log(VariablesSettings.paletteCategoryConnectorsURI);
    console.log('instantiation type ' + this.selectedInstantiationType);
    /*
    if (element.paletteCategory === VariablesSettings.paletteCategoryConnectorsURI) {
      this.connectorModeOn = true;
      console.log('connector mode: ' + this.connectorModeOn);
      this.connectorId = element.uuid;

      myDiagram.model.addLinkData({ from: 1, to: 2 });
      //myDiagram.model = model;
      console.log("added link");

      return null;
    }
    */
    const elementId = element.uuid;
    const nodeId = '#' + elementId;
    console.log('icon url is: ' + VariablesSettings.IMG_ROOT + (element.paletteCategory).split('#')[1] + '/' + element.imageURL);
    const imageURL = VariablesSettings.IMG_ROOT + (element.paletteCategory).split('#')[1] + '/' + element.imageURL;

    console.log('shape: ' + element.shape + ' label: ' + element.label + 'bg color: ' + element.backgroundColor);

    ModellingAreaBPMNComponent.myDiagram.startTransaction('Add State');

    console.log('Palette category: ' + element.paletteCategory);

    const elementKey = element.id.split('#')[1] + '_Shape_' + element.tempUuid;

    const toData = {
      text: element.label,
       key: elementKey,
       fill: '#0000',
       source: imageURL,
       size: new go.Size(element.width, element.height),
       width: element.width,
       height: element.height,
       alignment: go.Spot.Center,
       shapeRepresentsModel: undefined
    };

    // add the new node data to the model
    const model = ModellingAreaBPMNComponent.myDiagram.model;
    model.addNodeData(toData);

    const newnode = ModellingAreaBPMNComponent.myDiagram.findNodeForData(toData);
    ModellingAreaBPMNComponent.myDiagram.select(newnode);

    this.mService.createElement(
      this.selectedModel.id,
      elementKey,
      newnode.part.data.text,
      newnode.location.x,
      newnode.location.y,
      element.id.split('#')[1],
      this.selectedInstantiationType
    ).then(response => {
      newnode.part.data.element = response;
      if (response.modelElementType === 'ModelingContainer') {
        newnode.part.data.isGroup = true;
      }

      ModellingAreaBPMNComponent.myDiagram.commitTransaction('Add State');
    });
  }

  makePort(name, spot, output, input) {
    // the port is basically just a small transparent square
    return $(go.Shape, 'Circle',
      {
        fill: null,  // not seen, by default; set to a translucent gray by showSmallPorts, defined below
        stroke: null,
        desiredSize: new go.Size(7, 7),
        alignment: spot,  // align the port on the main Shape
        alignmentFocus: spot,  // just inside the Shape
        portId: name,  // declare this object to be a "port"
        fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
        fromLinkable: output, toLinkable: input,  // declare whether the user may draw links to/from here
        cursor: 'pointer'  // show a different cursor to indicate potential link point
      });
  }

  getInstantiationTypes(): InstantiationTargetType[] {
    return _.values(InstantiationTargetType);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadModels() {
    this.mService.getModels().pipe(take(1)).subscribe(models => {
      this.models = models;
    });
  }

  // custom figures for Shapes
  private initDiagramCanvas() {
    go.Shape.defineFigureGenerator('Empty', function (shape, w, h) {
      return new go.Geometry();
    });

    go.Shape.defineFigureGenerator('Annotation', function (shape, w, h) {
      const len = Math.min(w, 10);
      return new go.Geometry()
        .add(new go.PathFigure(len, 0)
          .add(new go.PathSegment(go.PathSegment.Line, 0, 0))
          .add(new go.PathSegment(go.PathSegment.Line, 0, h))
          .add(new go.PathSegment(go.PathSegment.Line, len, h)));
    });

    const gearStr = 'F M 391,5L 419,14L 444.5,30.5L 451,120.5L 485.5,126L 522,141L 595,83L 618.5,92L 644,106.5' +
      'L 660.5,132L 670,158L 616,220L 640.5,265.5L 658.122,317.809L 753.122,322.809L 770.122,348.309L 774.622,374.309' +
      'L 769.5,402L 756.622,420.309L 659.122,428.809L 640.5,475L 616.5,519.5L 670,573.5L 663,600L 646,626.5' +
      'L 622,639L 595,645.5L 531.5,597.5L 493.192,613.462L 450,627.5L 444.5,718.5L 421.5,733L 393,740.5L 361.5,733.5' +
      'L 336.5,719L 330,627.5L 277.5,611.5L 227.5,584.167L 156.5,646L 124.5,641L 102,626.5L 82,602.5L 78.5,572.5' +
      'L 148.167,500.833L 133.5,466.833L 122,432.5L 26.5,421L 11,400.5L 5,373.5L 12,347.5L 26.5,324L 123.5,317.5' +
      'L 136.833,274.167L 154,241L 75.5,152.5L 85.5,128.5L 103,105.5L 128.5,88.5001L 154.872,82.4758L 237,155' +
      'L 280.5,132L 330,121L 336,30L 361,15L 391,5 Z M 398.201,232L 510.201,275L 556.201,385L 505.201,491L 399.201,537' +
      'L 284.201,489L 242.201,385L 282.201,273L 398.201,232 Z';
    const gearGeo = go.Geometry.parse(gearStr);
    gearGeo.normalize();

    go.Shape.defineFigureGenerator('BpmnTaskService', function (shape, w, h) {
      const geo = gearGeo.copy();
      // calculate how much to scale the Geometry so that it fits in w x h
      const bounds = geo.bounds;
      const scale = Math.min(w / bounds.width, h / bounds.height);
      geo.scale(scale, scale);
      // text should go in the hand
      geo.spot1 = new go.Spot(0, 0.6, 10, 0);
      geo.spot2 = new go.Spot(1, 1);
      return geo;
    });

    const handGeo = go.Geometry.parse('F1M18.13,10.06 C18.18,10.07 18.22,10.07 18.26,10.08 18.91,' +
      '10.20 21.20,10.12 21.28,12.93 21.36,15.75 21.42,32.40 21.42,32.40 21.42,' +
      '32.40 21.12,34.10 23.08,33.06 23.08,33.06 22.89,24.76 23.80,24.17 24.72,' +
      '23.59 26.69,23.81 27.19,24.40 27.69,24.98 28.03,24.97 28.03,33.34 28.03,' +
      '33.34 29.32,34.54 29.93,33.12 30.47,31.84 29.71,27.11 30.86,26.56 31.80,' +
      '26.12 34.53,26.12 34.72,28.29 34.94,30.82 34.22,36.12 35.64,35.79 35.64,' +
      '35.79 36.64,36.08 36.72,34.54 36.80,33.00 37.17,30.15 38.42,29.90 39.67,' +
      '29.65 41.22,30.20 41.30,32.29 41.39,34.37 42.30,46.69 38.86,55.40 35.75,' +
      '63.29 36.42,62.62 33.47,63.12 30.76,63.58 26.69,63.12 26.69,63.12 26.69,' +
      '63.12 17.72,64.45 15.64,57.62 13.55,50.79 10.80,40.95 7.30,38.95 3.80,' +
      '36.95 4.24,36.37 4.28,35.35 4.32,34.33 7.60,31.25 12.97,35.75 12.97,' +
      '35.75 16.10,39.79 16.10,42.00 16.10,42.00 15.69,14.30 15.80,12.79 15.96,' +
      '10.75 17.42,10.04 18.13,10.06z ');
    handGeo.rotate(90, 0, 0);
    handGeo.normalize();
    go.Shape.defineFigureGenerator('BpmnTaskManual', function (shape, w, h) {
      const geo = handGeo.copy();
      // calculate how much to scale the Geometry so that it fits in w x h
      const bounds = geo.bounds;
      const scale = Math.min(w / bounds.width, h / bounds.height);
      geo.scale(scale, scale);
      // guess where text should go (in the hand)
      geo.spot1 = new go.Spot(0, 0.6, 10, 0);
      geo.spot2 = new go.Spot(1, 1);
      return geo;
    });


    // define the appearance of tooltips, shared by various templates
    const tooltiptemplate =
      $('ToolTip',
        $(go.TextBlock,
          { margin: 3, editable: true },
          new go.Binding('text', '', function (data) {
            if (data.item !== undefined) { return data.item; }
            return '(unnamed item)';
          }))
      );

    // ------------------------------------------  Activity Node Boundary Events   ----------------------------------------------

    const boundaryEventMenu =  // context menu for each boundaryEvent on Activity node
      $('ContextMenu',
        $('ContextMenuButton',
          $(go.TextBlock, 'Remove event'),
          // in the click event handler, the obj.part is the Adornment; its adornedObject is the port
          { click: function (e: go.InputEvent, obj: go.GraphObject) { this.removeActivityNodeBoundaryEvent((obj.part as go.Adornment).adornedObject); } })
      );

    const boundaryEventItemTemplate =
      $(go.Panel, 'Spot',
        {
          contextMenu: boundaryEventMenu,
          alignmentFocus: go.Spot.Center,
          fromLinkable: true, toLinkable: false, cursor: 'pointer', fromSpot: go.Spot.Bottom,
          fromMaxLinks: 1, toMaxLinks: 0
        },
        new go.Binding('portId', 'portId'),
        new go.Binding('alignment', 'alignmentIndex', this.nodeActivityBESpotConverter),
        $(go.Shape, 'Circle',
          { desiredSize: new go.Size(this.EventNodeSize, this.EventNodeSize) },
          new go.Binding('strokeDashArray', 'eventDimension', function (s) { return (s === 6) ? [4, 2] : null; }),
          new go.Binding('fromSpot', 'alignmentIndex',
            function (s) {
              //  nodeActivityBEFromSpotConverter, 0 & 1 go on bottom, all others on top of activity
              if (s < 2) { return go.Spot.Bottom; }
              return go.Spot.Top;
            }),
          new go.Binding('fill', 'color')),
        $(go.Shape, 'Circle',
          {
            alignment: go.Spot.Center,
            desiredSize: new go.Size(this.EventNodeInnerSize, this.EventNodeInnerSize), fill: null
          },
          new go.Binding('strokeDashArray', 'eventDimension', function (s) { return (s === 6) ? [4, 2] : null; })
        ),
        $(go.Shape, 'NotAllowed',
          {
            alignment: go.Spot.Center,
            desiredSize: new go.Size(this.EventNodeSymbolSize, this.EventNodeSymbolSize), fill: 'white'
          },
          new go.Binding('figure', 'eventType', this.nodeEventTypeConverter)
        )
      );

    // ------------------------------------------  Activity Node contextMenu   ----------------------------------------------

    const activityNodeMenu =
      $('ContextMenu',
        $('ContextMenuButton',
          $(go.TextBlock, 'Add Email Event', { margin: 3 }),
          { click: function (e: go.InputEvent, obj: go.GraphObject) { this.addActivityNodeBoundaryEvent(2, 5); } }),
        $('ContextMenuButton',
          $(go.TextBlock, 'Add Timer Event', { margin: 3 }),
          { click: function (e: go.InputEvent, obj: go.GraphObject) { this.addActivityNodeBoundaryEvent(3, 5); } }),
        $('ContextMenuButton',
          $(go.TextBlock, 'Add Escalation Event', { margin: 3 }),
          { click: function (e: go.InputEvent, obj: go.GraphObject) { this.addActivityNodeBoundaryEvent(4, 5); } }),
        $('ContextMenuButton',
          $(go.TextBlock, 'Add Error Event', { margin: 3 }),
          { click: function (e: go.InputEvent, obj: go.GraphObject) { this.addActivityNodeBoundaryEvent(7, 5); } }),
        $('ContextMenuButton',
          $(go.TextBlock, 'Add Signal Event', { margin: 3 }),
          { click: function (e: go.InputEvent, obj: go.GraphObject) { this.addActivityNodeBoundaryEvent(10, 5); } }),
        $('ContextMenuButton',
          $(go.TextBlock, 'Add N-I Escalation Event', { margin: 3 }),
          { click: function (e: go.InputEvent, obj: go.GraphObject) { this.addActivityNodeBoundaryEvent(4, 6); } }),
        $('ContextMenuButton',
          $(go.TextBlock, 'Rename', { margin: 3 }),
          { click: function (e: go.InputEvent, obj: go.GraphObject) { this.rename(obj); } }));


    const activityNodeTemplate =
      $(go.Node, 'Spot',
        {
          locationObjectName: 'SHAPE', locationSpot: go.Spot.Center,
          resizable: true, resizeObjectName: 'PANEL',
          toolTip: tooltiptemplate,
          selectionAdorned: false,  // use a Binding on the Shape.stroke to show selection
          contextMenu: activityNodeMenu,
          itemTemplate: boundaryEventItemTemplate
        },
        new go.Binding('itemArray', 'boundaryEventArray'),
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Panel, 'Auto',
          {
            name: 'PANEL',
            minSize: new go.Size(this.ActivityNodeWidth, this.ActivityNodeHeight),
            desiredSize: new go.Size(this.ActivityNodeWidth, this.ActivityNodeHeight)
          },
          new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(go.Size.stringify),
          $(go.Panel, 'Spot',
            $(go.Shape, 'RoundedRectangle',  // the outside rounded rectangle
              {
                name: 'SHAPE',
                fill: this.ActivityNodeFill, stroke: this.ActivityNodeStroke,
                parameter1: 10, // corner size
                portId: '', fromLinkable: true, toLinkable: true, cursor: 'pointer',
                fromSpot: go.Spot.RightSide, toSpot: go.Spot.LeftSide
              },
              new go.Binding('fill', 'color'),
              new go.Binding('strokeWidth', 'isCall',
                function (s) { return s ? this.ActivityNodeStrokeWidthIsCall : this.ActivityNodeStrokeWidth; })
            ),
            //        $(go.Shape, "RoundedRectangle",  // the inner "Transaction" rounded rectangle
            //          { margin: 3,
            //            stretch: go.GraphObject.Fill,
            //            stroke: this.ActivityNodeStroke,
            //            parameter1: 8, fill: null, visible: false
            //          },
            //          new go.Binding("visible", "isTransaction")
            //         ),
            // task icon
            $(go.Shape, 'BpmnTaskScript',    // will be None, Script, Manual, Service, etc via converter
              {
                alignment: new go.Spot(0, 0, 5, 5), alignmentFocus: go.Spot.TopLeft,
                width: 22, height: 22
              },
              new go.Binding('fill', 'taskType', this.nodeActivityTaskTypeColorConverter),
              new go.Binding('figure', 'taskType', ModellingAreaBPMNComponent.nodeActivityTaskTypeConverter)
            ), // end Task Icon
            this.makeMarkerPanel(false, 1) // sub-process,  loop, parallel, sequential, ad doc and compensation markers
          ),  // end main body rectangles spot panel
          $(go.TextBlock,  // the center text
            {
              alignment: go.Spot.Center, textAlign: 'center', margin: 12,
              editable: true
            },
            new go.Binding('text').makeTwoWay())
        )  // end Auto Panel
      );  // end go.Node, which is a Spot Panel with bound itemArray


    // ------------------------------- template for Activity / Task node in Palette  -------------------------------
    const palscale = 2;
    const activityNodeTemplateForPalette =
      $(go.Node, 'Vertical',
        {
          locationObjectName: 'SHAPE',
          locationSpot: go.Spot.Center,
          selectionAdorned: false
        },
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Panel, 'Spot',
          {
            name: 'PANEL',
            desiredSize: new go.Size(this.ActivityNodeWidth / palscale, this.ActivityNodeHeight / palscale)
          },
          $(go.Shape, 'RoundedRectangle',  // the outside rounded rectangle
            {
              name: 'SHAPE',
              fill: this.ActivityNodeFill, stroke: this.ActivityNodeStroke,
              parameter1: 10 / palscale  // corner size (default 10)
            },
            new go.Binding('strokeWidth', 'isCall',
              function (s) { return s ? this.ActivityNodeStrokeWidthIsCall : this.ActivityNodeStrokeWidth; })),
          $(go.Shape, 'RoundedRectangle',  // the inner "Transaction" rounded rectangle
            {
              margin: 3,
              stretch: go.GraphObject.Fill,
              stroke: this.ActivityNodeStroke,
              parameter1: 8 / palscale, fill: null, visible: false
            },
            new go.Binding('visible', 'isTransaction')),
          // task icon
          $(go.Shape, 'BpmnTaskScript',    // will be None, Script, Manual, Service, etc via converter
            {
              alignment: new go.Spot(0, 0, 5, 5), alignmentFocus: go.Spot.TopLeft,
              width: 22 / palscale, height: 22 / palscale
            },
            new go.Binding('fill', 'taskType', this.nodeActivityTaskTypeColorConverter),
            new go.Binding('figure', 'taskType', ModellingAreaBPMNComponent.nodeActivityTaskTypeConverter)),
          this.makeMarkerPanel(false, palscale) // sub-process,  loop, parallel, sequential, ad doc and compensation markers
        ), // End Spot panel
        $(go.TextBlock,  // the center text
          { alignment: go.Spot.Center, textAlign: 'center', margin: 2 },
          new go.Binding('text'))
      );  // End Node

    const subProcessGroupTemplateForPalette =
      $(go.Group, 'Vertical',
        {
          locationObjectName: 'SHAPE',
          locationSpot: go.Spot.Center,
          isSubGraphExpanded: false,
          selectionAdorned: false
        },
        $(go.Panel, 'Spot',
          {
            name: 'PANEL',
            desiredSize: new go.Size(this.ActivityNodeWidth / palscale, this.ActivityNodeHeight / palscale)
          },
          $(go.Shape, 'RoundedRectangle',  // the outside rounded rectangle
            {
              name: 'SHAPE',
              fill: this.ActivityNodeFill, stroke: this.ActivityNodeStroke,
              parameter1: 10 / palscale  // corner size (default 10)
            },
            new go.Binding('strokeWidth', 'isCall', function (s) { return s ? this.ActivityNodeStrokeWidthIsCall : this.ActivityNodeStrokeWidth; })
          ),
          $(go.Shape, 'RoundedRectangle',  // the inner "Transaction" rounded rectangle
            {
              margin: 3,
              stretch: go.GraphObject.Fill,
              stroke: this.ActivityNodeStroke,
              parameter1: 8 / palscale, fill: null, visible: false
            },
            new go.Binding('visible', 'isTransaction')),
          this.makeMarkerPanel(true, palscale) // sub-process,  loop, parallel, sequential, ad doc and compensation markers
        ), // end main body rectangles spot panel
        $(go.TextBlock,  // the center text
          { alignment: go.Spot.Center, textAlign: 'center', margin: 2 },
          new go.Binding('text'))
      );  // end go.Group

    // ------------------------------------------  Event Node Template  ----------------------------------------------

    const eventNodeTemplate =
      $(go.Node, 'Vertical',
        {
          locationObjectName: 'SHAPE',
          locationSpot: go.Spot.Center,
          toolTip: tooltiptemplate
        },
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        // can be resided according to the user's desires
        { resizable: false, resizeObjectName: 'SHAPE' },
        $(go.Panel, 'Spot',
          $(go.Shape, 'Circle',  // Outer circle
            {
              strokeWidth: 1,
              name: 'SHAPE',
              desiredSize: new go.Size(this.EventNodeSize, this.EventNodeSize),
              portId: '', fromLinkable: true, toLinkable: true, cursor: 'pointer',
              fromSpot: go.Spot.RightSide, toSpot: go.Spot.LeftSide
            },
            // allows the color to be determined by the node data
            new go.Binding('fill', 'eventDimension', function (s) { return (s === 8) ? this.EventEndOuterFillColor : this.EventBackgroundColor; }),
            new go.Binding('strokeWidth', 'eventDimension', function (s) { return s === 8 ? this.EventNodeStrokeWidthIsEnd : 1; }),
            new go.Binding('stroke', 'eventDimension', this.nodeEventDimensionStrokeColorConverter),
            new go.Binding('strokeDashArray', 'eventDimension', function (s) { return (s === 3 || s === 6) ? [4, 2] : null; }),
            new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(go.Size.stringify)
          ),  // end main shape
          $(go.Shape, 'Circle',  // Inner circle
            { alignment: go.Spot.Center, desiredSize: new go.Size(this.EventNodeInnerSize, this.EventNodeInnerSize), fill: null },
            new go.Binding('stroke', 'eventDimension', this.nodeEventDimensionStrokeColorConverter),
            // tslint:disable-next-line:max-line-length
            new go.Binding('strokeDashArray', 'eventDimension', function (s) { return (s === 3 || s === 6) ? [4, 2] : null; }), // dashes for non-interrupting
            new go.Binding('visible', 'eventDimension', function (s) { return s > 3 && s <= 7; }) // inner  only visible for 4 thru 7
          ),
          $(go.Shape, 'NotAllowed',
            { alignment: go.Spot.Center, desiredSize: new go.Size(this.EventNodeSymbolSize, this.EventNodeSymbolSize), stroke: 'black' },
            new go.Binding('figure', 'eventType', this.nodeEventTypeConverter),
            new go.Binding('fill', 'eventDimension', this.nodeEventDimensionSymbolFillConverter)
          )
        ),  // end Auto Panel
        $(go.TextBlock,
          { alignment: go.Spot.Center, textAlign: 'center', margin: 5, editable: true },
          new go.Binding('text').makeTwoWay())

      ); // end go.Node Vertical

    // ------------------------------------------  Gateway Node Template   ----------------------------------------------
    const gatewayNodeTemplate =
      $(go.Node, 'Vertical',
        {
          locationObjectName: 'SHAPE',
          locationSpot: go.Spot.Center,
          toolTip: tooltiptemplate
        },
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        // can be resided according to the user's desires
        { resizable: false, resizeObjectName: 'SHAPE' },
        $(go.Panel, 'Spot',
          $(go.Shape, 'Diamond',
            {
              strokeWidth: 1, fill: this.GatewayNodeFill, stroke: this.GatewayNodeStroke,
              name: 'SHAPE',
              desiredSize: new go.Size(this.GatewayNodeSize, this.GatewayNodeSize),
              portId: '', fromLinkable: true, toLinkable: true, cursor: 'pointer',
              fromSpot: go.Spot.NotLeftSide, toSpot: go.Spot.NotRightSide
            },
            new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(go.Size.stringify)),  // end main shape
          $(go.Shape, 'NotAllowed',
            { alignment: go.Spot.Center, stroke: this.GatewayNodeSymbolStroke, fill: this.GatewayNodeSymbolFill },
            new go.Binding('figure', 'gatewayType', this.nodeGatewaySymbolTypeConverter),
            // new go.Binding("visible", "gatewayType", function(s) { return s !== 4; }),   // comment out if you want exclusive gateway to be X instead of blank.
            new go.Binding('strokeWidth', 'gatewayType', function (s) { return (s <= 4) ? this.GatewayNodeSymbolStrokeWidth : 1; }),
            new go.Binding('desiredSize', 'gatewayType', this.nodeGatewaySymbolSizeConverter)),
          // the next 2 circles only show up for event gateway
          $(go.Shape, 'Circle',  // Outer circle
            {
              strokeWidth: 1, stroke: this.GatewayNodeSymbolStroke, fill: null, desiredSize: new go.Size(this.EventNodeSize, this.EventNodeSize)
            },
            new go.Binding('visible', 'gatewayType', function (s) { return s >= 5; }) // only visible for > 5
          ),  // end main shape
          $(go.Shape, 'Circle',  // Inner circle
            {
              alignment: go.Spot.Center, stroke: this.GatewayNodeSymbolStroke,
              desiredSize: new go.Size(this.EventNodeInnerSize, this.EventNodeInnerSize),
              fill: null
            },
            new go.Binding('visible', 'gatewayType', function (s) { return s === 5; }) // inner  only visible for == 5
          )
        ),
        $(go.TextBlock,
          { alignment: go.Spot.Center, textAlign: 'center', margin: 5, editable: true },
          new go.Binding('text').makeTwoWay())
      ); // end go.Node Vertical

    // --------------------------------------------------------------------------------------------------------------

    const gatewayNodeTemplateForPalette =
      $(go.Node, 'Vertical',
        {
          toolTip: tooltiptemplate,
          resizable: false,
          locationObjectName: 'SHAPE',
          locationSpot: go.Spot.Center,
          resizeObjectName: 'SHAPE'
        },
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Panel, 'Spot',
          $(go.Shape, 'Diamond',
            {
              strokeWidth: 1, fill: this.GatewayNodeFill, stroke: this.GatewayNodeStroke, name: 'SHAPE',
              desiredSize: new go.Size(this.GatewayNodeSize / 2, this.GatewayNodeSize / 2)
            }),
          $(go.Shape, 'NotAllowed',
            { alignment: go.Spot.Center, stroke: this.GatewayNodeSymbolStroke, strokeWidth: this.GatewayNodeSymbolStrokeWidth, fill: this.GatewayNodeSymbolFill },
            new go.Binding('figure', 'gatewayType', this.nodeGatewaySymbolTypeConverter),
            // new go.Binding("visible", "gatewayType", function(s) { return s !== 4; }),   // comment out if you want exclusive gateway to be X instead of blank.
            new go.Binding('strokeWidth', 'gatewayType', function (s) { return (s <= 4) ? this.GatewayNodeSymbolStrokeWidth : 1; }),
            new go.Binding('desiredSize', 'gatewayType', this.nodePalGatewaySymbolSizeConverter)),
          // the next 2 circles only show up for event gateway
          $(go.Shape, 'Circle',  // Outer circle
            {
              strokeWidth: 1, stroke: this.GatewayNodeSymbolStroke, fill: null, desiredSize: new go.Size(this.EventNodeSize / 2, this.EventNodeSize / 2)
            },
            // new go.Binding("desiredSize", "gatewayType", new go.Size(this.EventNodeSize/2, this.EventNodeSize/2)),
            new go.Binding('visible', 'gatewayType', function (s) { return s >= 5; }) // only visible for > 5
          ),  // end main shape
          $(go.Shape, 'Circle',  // Inner circle
            {
              alignment: go.Spot.Center, stroke: this.GatewayNodeSymbolStroke,
              desiredSize: new go.Size(this.EventNodeInnerSize / 2, this.EventNodeInnerSize / 2),
              fill: null
            },
            new go.Binding('visible', 'gatewayType', function (s) { return s === 5; }) // inner  only visible for == 5
          )),

        $(go.TextBlock,
          { alignment: go.Spot.Center, textAlign: 'center', margin: 5, editable: false },
          new go.Binding('text'))
      );


    // --------------------------------------------------------------------------------------------------------------

    const annotationNodeTemplate =
      $(go.Node, 'Auto',
        { background: this.GradientLightGray, locationSpot: go.Spot.Center },
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape, 'Annotation', // A left bracket shape
          {
            portId: '', fromLinkable: true, cursor: 'pointer', fromSpot: go.Spot.Left,
            strokeWidth: 2, stroke: 'gray', fill: 'transparent'
          }),
        $(go.TextBlock,
          { margin: 5, editable: true },
          new go.Binding('text').makeTwoWay())
      );

    const dataObjectNodeTemplate =
      $(go.Node, 'Vertical',
        { locationObjectName: 'SHAPE', locationSpot: go.Spot.Center },
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape, 'File',
          {
            name: 'SHAPE', portId: '', fromLinkable: true, toLinkable: true, cursor: 'pointer',
            fill: this.DataFill, desiredSize: new go.Size(this.EventNodeSize * 0.8, this.EventNodeSize)
          }),
        $(go.TextBlock,
          {
            margin: 5,
            editable: true
          },
          new go.Binding('text').makeTwoWay())
      );

    const dataStoreNodeTemplate =
      $(go.Node, 'Vertical',
        { locationObjectName: 'SHAPE', locationSpot: go.Spot.Center },
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape, 'Database',
          {
            name: 'SHAPE', portId: '', fromLinkable: true, toLinkable: true, cursor: 'pointer',
            fill: this.DataFill, desiredSize: new go.Size(this.EventNodeSize, this.EventNodeSize)
          }),
        $(go.TextBlock,
          { margin: 5, editable: true },
          new go.Binding('text').makeTwoWay())
      );

    // ------------------------------------------  private process Node Template Map   ----------------------------------------------

    const privateProcessNodeTemplate =
      $(go.Node, 'Auto',
        { layerName: 'Background', resizable: true, resizeObjectName: 'LANE' },
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape, 'Rectangle',
          { fill: null }),
        $(go.Panel, 'Table',     // table with 2 cells to hold header and lane
          {
            desiredSize: new go.Size(this.ActivityNodeWidth * 6, this.ActivityNodeHeight),
            background: this.DataFill, name: 'LANE', minSize: new go.Size(this.ActivityNodeWidth, this.ActivityNodeHeight * 0.667)
          },
          new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(go.Size.stringify),
          $(go.TextBlock,
            {
              row: 0, column: 0,
              angle: 270, margin: 5,
              editable: true, textAlign: 'center'
            },
            new go.Binding('text').makeTwoWay()),
          $(go.RowColumnDefinition, { column: 1, separatorStrokeWidth: 1, separatorStroke: 'black' }),
          $(go.Shape, 'Rectangle',
            {
              row: 0, column: 1,
              stroke: null, fill: 'transparent',
              portId: '', fromLinkable: true, toLinkable: true,
              fromSpot: go.Spot.TopBottomSides, toSpot: go.Spot.TopBottomSides,
              cursor: 'pointer', stretch: go.GraphObject.Fill
            })
        )
      );

    const privateProcessNodeTemplateForPalette =
      $(go.Node, 'Vertical',
        { locationSpot: go.Spot.Center },
        $(go.Shape, 'Process',
          { fill: this.DataFill, desiredSize: new go.Size(this.GatewayNodeSize / 2, this.GatewayNodeSize / 4) }),
        $(go.TextBlock,
          { margin: 5, editable: true },
          new go.Binding('text'))
      );

    const poolTemplateForPalette =
      $(go.Group, 'Vertical',
        {
          locationSpot: go.Spot.Center,
          computesBoundsIncludingLinks: false,
          isSubGraphExpanded: false
        },
        $(go.Shape, 'Process',
          { fill: 'white', desiredSize: new go.Size(this.GatewayNodeSize / 2, this.GatewayNodeSize / 4) }),
        $(go.Shape, 'Process',
          { fill: 'white', desiredSize: new go.Size(this.GatewayNodeSize / 2, this.GatewayNodeSize / 4) }),
        $(go.TextBlock,
          { margin: 5, editable: true },
          new go.Binding('text'))
      );

    const swimLanesGroupTemplateForPalette =
      $(go.Group, 'Vertical'); // empty in the palette

    const subProcessGroupTemplate =
      $(go.Group, 'Spot',
        {
          locationSpot: go.Spot.Center,
          locationObjectName: 'PH',
          // locationSpot: go.Spot.Center,
          isSubGraphExpanded: false,
          subGraphExpandedChanged: function(grp: go.Group) {
            if (grp.isSubGraphExpanded) { grp.isSelected = true; }
            Helpers.assignGroupLayer(grp);
          },
          selectionChanged: Helpers.assignGroupLayer,
          computesBoundsAfterDrag: true,
          memberValidation: function (group: go.Group, part: go.Part) {
            return !(part instanceof go.Group) ||
              (part.category !== 'Pool' && part.category !== 'Lane');
          },
          mouseDrop: function (e: go.InputEvent, grp: go.GraphObject) {
            if (e.shift || !(grp instanceof go.Group) || grp.diagram === null) { return; }
            const ok = grp.addMembers(grp.diagram.selection, true);
            if (!ok) { grp.diagram.currentTool.doCancel(); }
            else { Helpers.assignGroupLayer(grp); }
          },
          contextMenu: activityNodeMenu,
          itemTemplate: boundaryEventItemTemplate,
          avoidable: false
        },
        new go.Binding('itemArray', 'boundaryEventArray'),
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Panel, 'Auto',
          $(go.Shape, 'RoundedRectangle',
            {
              name: 'PH', fill: this.SubprocessNodeFill, stroke: this.SubprocessNodeStroke,
              minSize: new go.Size(this.ActivityNodeWidth, this.ActivityNodeHeight),
              portId: '', fromLinkable: true, toLinkable: true, cursor: 'pointer',
              fromSpot: go.Spot.RightSide, toSpot: go.Spot.LeftSide
            },
            new go.Binding('strokeWidth', 'isCall', function (s) { return s ? this.ActivityNodeStrokeWidthIsCall : this.ActivityNodeStrokeWidth; })
          ),
          $(go.Panel, 'Vertical',
            { defaultAlignment: go.Spot.Left },
            $(go.TextBlock,  // label
              { margin: 3, editable: true },
              new go.Binding('text', 'text').makeTwoWay(),
              new go.Binding('alignment', 'isSubGraphExpanded', function (s) { return s ? go.Spot.TopLeft : go.Spot.Center; })),
            // create a placeholder to represent the area where the contents of the group are
            $(go.Panel, 'Auto',
              $(go.Shape, { opacity: 0.0 }),
              $(go.Placeholder,
                { padding: new go.Margin(5, 5) })
            ),  // end nested Auto Panel
            this.makeMarkerPanel(true, 1)  // sub-process,  loop, parallel, sequential, ad doc and compensation markers
          )  // end Vertical Panel
        )  // end border Panel
      );  // end Group

    // ------------------------ Lanes and Pools ------------------------------------------------------------
    const laneEventMenu =  // context menu for each lane
      $('ContextMenu',
        $('ContextMenuButton',
          $(go.TextBlock, 'Add Lane'),
          // in the click event handler, the obj.part is the Adornment; its adornedObject is the port
          { click: function (e: go.InputEvent, obj: go.GraphObject) { this.addLaneEvent((obj.part as go.Adornment).adornedObject as go.Node); } })
      );

    const swimLanesGroupTemplate =
      $(go.Group, 'Spot', this.groupStyle(),
        {
          name: 'Lane',
          contextMenu: laneEventMenu,
          minLocation: new go.Point(NaN, -Infinity),  // only allow vertical movement
          maxLocation: new go.Point(NaN, Infinity),
          selectionObjectName: 'SHAPE',  // selecting a lane causes the body of the lane to be highlit, not the label
          resizable: true, resizeObjectName: 'SHAPE',  // the custom resizeAdornmentTemplate only permits two kinds of resizing
          layout: $(go.LayeredDigraphLayout,  // automatically lay out the lane's subgraph
            {
              isInitial: false,  // don't even do initial layout
              isOngoing: false,  // don't invalidate layout when nodes or links are added or removed
              direction: 0,
              columnSpacing: 10,
              layeringOption: go.LayeredDigraphLayout.LayerLongestPathSource
            }),
          computesBoundsAfterDrag: true,  // needed to prevent recomputing Group.placeholder bounds too soon
          computesBoundsIncludingLinks: false,  // to reduce occurrences of links going briefly outside the lane
          computesBoundsIncludingLocation: true,  // to support empty space at top-left corner of lane
          handlesDragDropForMembers: true,  // don't need to define handlers on member Nodes and Links
          mouseDrop: function (e: go.InputEvent, grp: go.GraphObject) {  // dropping a copy of some Nodes and Links onto this Group adds them to this Group
            // don't allow drag-and-dropping a mix of regular Nodes and Groups
            if (!e.diagram.selection.any((n) => (n instanceof go.Group && n.category !== 'subprocess') || n.category === 'privateProcess')) {
              if (!(grp instanceof go.Group) || grp.diagram === null) { return; }
              const ok = grp.addMembers(grp.diagram.selection, true);
              if (ok) {
                this.updateCrossLaneLinks(grp);
                this.relayoutDiagram();
              } else {
                grp.diagram.currentTool.doCancel();
              }
            }
          },
          subGraphExpandedChanged: function (grp: go.Group) {
            if (grp.diagram === null) { return; }
            if (grp.diagram.undoManager.isUndoingRedoing) { return; }
            const shp = grp.resizeObject;
            if (grp.isSubGraphExpanded) {
              shp.height = grp.data.savedBreadth;
            } else {
              if (!isNaN(shp.height)) { grp.diagram.model.set(grp.data, 'savedBreadth', shp.height); }
              shp.height = NaN;
            }
            this.updateCrossLaneLinks(grp);
          }
        },
        // new go.Binding("isSubGraphExpanded", "expanded").makeTwoWay(),

        $(go.Shape, 'Rectangle',  // this is the resized object
          { name: 'SHAPE', fill: 'white', stroke: null },  // need stroke null here or you gray out some of pool border.
          new go.Binding('fill', 'color'),
          new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(go.Size.stringify)),

        // the lane header consisting of a Shape and a TextBlock
        $(go.Panel, 'Horizontal',
          {
            name: 'HEADER',
            angle: 270,  // maybe rotate the header to read sideways going up
            alignment: go.Spot.LeftCenter, alignmentFocus: go.Spot.LeftCenter
          },
          $(go.TextBlock,  // the lane label
            { editable: true, margin: new go.Margin(2, 0, 0, 8) },
            new go.Binding('visible', 'isSubGraphExpanded').ofObject(),
            new go.Binding('text', 'text').makeTwoWay()),
          $('SubGraphExpanderButton', { margin: 4, angle: -270 })  // but this remains always visible!
        ),  // end Horizontal Panel
        $(go.Placeholder,
          { padding: 12, alignment: go.Spot.TopLeft, alignmentFocus: go.Spot.TopLeft }),
        $(go.Panel, 'Horizontal', { alignment: go.Spot.TopLeft, alignmentFocus: go.Spot.TopLeft },
          $(go.TextBlock,  // this TextBlock is only seen when the swimlane is collapsed
            {
              name: 'LABEL',
              editable: true, visible: false,
              angle: 0, margin: new go.Margin(6, 0, 0, 20)
            },
            new go.Binding('visible', 'isSubGraphExpanded', function (e) { return !e; }).ofObject(),
            new go.Binding('text', 'text').makeTwoWay())
        )
      );  // end swimLanesGroupTemplate

    // define a custom resize adornment that has two resize handles if the group is expanded
    // ModellingAreaBPMNComponent.myDiagram.groupTemplate.resizeAdornmentTemplate =
    swimLanesGroupTemplate.resizeAdornmentTemplate =
      $(go.Adornment, 'Spot',
        $(go.Placeholder),
        $(go.Shape,  // for changing the length of a lane
          {
            alignment: go.Spot.Right,
            desiredSize: new go.Size(7, 50),
            fill: 'lightblue', stroke: 'dodgerblue',
            cursor: 'col-resize'
          },
          new go.Binding('visible', '', function (ad) {
            if (ad.adornedPart === null) { return false; }
            return ad.adornedPart.isSubGraphExpanded;
          }).ofObject()),
        $(go.Shape,  // for changing the breadth of a lane
          {
            alignment: go.Spot.Bottom,
            desiredSize: new go.Size(50, 7),
            fill: 'lightblue', stroke: 'dodgerblue',
            cursor: 'row-resize'
          },
          new go.Binding('visible', '', function (ad) {
            if (ad.adornedPart === null) { return false; }
            return ad.adornedPart.isSubGraphExpanded;
          }).ofObject())
      );

    const poolGroupTemplate =
      $(go.Group, 'Auto', this.groupStyle(),
        {
          computesBoundsIncludingLinks: false,
          // use a simple layout that ignores links to stack the "lane" Groups on top of each other
          layout: $(PoolLayout, { spacing: new go.Size(0, 0) })  // no space between lanes
        },
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape,
          { fill: 'white' },
          new go.Binding('fill', 'color')),
        $(go.Panel, 'Table',
          { defaultColumnSeparatorStroke: 'black' },
          $(go.Panel, 'Horizontal',
            { column: 0, angle: 270 },
            $(go.TextBlock,
              { editable: true, margin: new go.Margin(5, 0, 5, 0) },  // margin matches private process (black box pool)
              new go.Binding('text').makeTwoWay())
          ),
          $(go.Placeholder,
            { background: 'darkgray', column: 1 })
        )
      ); // end poolGroupTemplate

    // ------------------------------------------  Template Maps  ----------------------------------------------

    // create the nodeTemplateMap, holding main view node templates:
    const nodeTemplateMap = new go.Map<string, go.Node>();
    // for each of the node categories, specify which template to use
    nodeTemplateMap.add('activity', activityNodeTemplate);
    nodeTemplateMap.add('event', eventNodeTemplate);
    nodeTemplateMap.add('gateway', gatewayNodeTemplate);
    nodeTemplateMap.add('annotation', annotationNodeTemplate);
    nodeTemplateMap.add('dataobject', dataObjectNodeTemplate);
    nodeTemplateMap.add('datastore', dataStoreNodeTemplate);
    nodeTemplateMap.add('privateProcess', privateProcessNodeTemplate);
    // for the default category, "", use the same template that Diagrams use by default
    // this just shows the key value as a simple TextBlock

    const groupTemplateMap = new go.Map<string, go.Group>();
    groupTemplateMap.add('subprocess', subProcessGroupTemplate);
    groupTemplateMap.add('Lane', swimLanesGroupTemplate);
    groupTemplateMap.add('Pool', poolGroupTemplate);

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

    // ------------------------------------------  Link Templates   ----------------------------------------------

    const sequenceLinkTemplate =
      $(go.Link,
        {
          contextMenu:
            $('ContextMenu',
              $('ContextMenuButton',
                $(go.TextBlock, 'Default Flow'),
                // in the click event handler, the obj.part is the Adornment; its adornedObject is the port
                { click: function (e: go.InputEvent, obj: go.GraphObject) { this.setSequenceLinkDefaultFlow((obj.part as go.Adornment).adornedObject as go.Link); } }),
              $('ContextMenuButton',
                $(go.TextBlock, 'Conditional Flow'),
                // in the click event handler, the obj.part is the Adornment; its adornedObject is the port
                { click: function (e: go.InputEvent, obj: go.GraphObject) { this.setSequenceLinkConditionalFlow((obj.part as go.Adornment).adornedObject as go.Link); } })
            ),
          routing: go.Link.AvoidsNodes, curve: go.Link.JumpGap, corner: 10,
          // fromSpot: go.Spot.RightSide, toSpot: go.Spot.LeftSide,
          reshapable: true, relinkableFrom: true, relinkableTo: true, toEndSegmentLength: 20
        },
        new go.Binding('points').makeTwoWay(),
        $(go.Shape, { stroke: 'black', strokeWidth: 1 }),
        $(go.Shape, { toArrow: 'Triangle', scale: 1.2, fill: 'black', stroke: null }),
        $(go.Shape, { fromArrow: '', scale: 1.5, stroke: 'black', fill: 'white' },
          new go.Binding('fromArrow', 'isDefault', function (s) {
            if (s === null) { return ''; }
            return s ? 'BackSlash' : 'StretchedDiamond';
          }),
          new go.Binding('segmentOffset', 'isDefault', function (s) {
            return s ? new go.Point(5, 0) : new go.Point(0, 0);
          })),
        $(go.TextBlock, { // this is a Link label
            name: 'Label', editable: true, text: 'label', segmentOffset: new go.Point(-10, -10), visible: false
          },
          new go.Binding('text', 'text').makeTwoWay(),
          new go.Binding('visible', 'visible').makeTwoWay())
      );


    const messageFlowLinkTemplate =
      $(PoolLink, // defined in BPMNClasses.js
        {
          routing: go.Link.Orthogonal, curve: go.Link.JumpGap, corner: 10,
          fromSpot: go.Spot.TopBottomSides, toSpot: go.Spot.TopBottomSides,
          reshapable: true, relinkableTo: true, toEndSegmentLength: 20
        },
        new go.Binding('points').makeTwoWay(),
        $(go.Shape, { stroke: 'black', strokeWidth: 1, strokeDashArray: [6, 2] }),
        $(go.Shape, { toArrow: 'Triangle', scale: 1, fill: 'white', stroke: 'black' }),
        $(go.Shape, { fromArrow: 'Circle', scale: 1, visible: true, stroke: 'black', fill: 'white' }),
        $(go.TextBlock, {
            editable: true, text: 'label'
          }, // Link label
          new go.Binding('text', 'text').makeTwoWay())
      );

    const dataAssociationLinkTemplate =
      $(go.Link,
        {
          routing: go.Link.AvoidsNodes, curve: go.Link.JumpGap, corner: 10,
          fromSpot: go.Spot.AllSides, toSpot: go.Spot.AllSides,
          reshapable: true, relinkableFrom: true, relinkableTo: true
        },
        new go.Binding('points').makeTwoWay(),
        $(go.Shape, { stroke: 'black', strokeWidth: 1, strokeDashArray: [1, 3] }),
        $(go.Shape, { toArrow: 'OpenTriangle', scale: 1, fill: null, stroke: 'blue' })
      );

    const annotationAssociationLinkTemplate =
      $(go.Link,
        {
          reshapable: true, relinkableFrom: true, relinkableTo: true,
          toSpot: go.Spot.AllSides,
          toEndSegmentLength: 20, fromEndSegmentLength: 40
        },
        new go.Binding('points').makeTwoWay(),
        $(go.Shape, { stroke: 'black', strokeWidth: 1, strokeDashArray: [1, 3] }),
        $(go.Shape, { toArrow: 'OpenTriangle', scale: 1, stroke: 'black' })
      );

    const linkTemplateMap = new go.Map<string, go.Link>();
    linkTemplateMap.add('msg', messageFlowLinkTemplate);
    linkTemplateMap.add('annotation', annotationAssociationLinkTemplate);
    linkTemplateMap.add('data', dataAssociationLinkTemplate);
    linkTemplateMap.add('', sequenceLinkTemplate);  // default

    // ------------------------------------------the main Diagram----------------------------------------------

    ModellingAreaBPMNComponent.myDiagram =
      $(go.Diagram, 'myDiagramDiv',
        {
          nodeTemplateMap: nodeTemplateMap,
          linkTemplateMap: linkTemplateMap,
          groupTemplateMap: groupTemplateMap,

          commandHandler: new DrawCommandHandler(),  // defined in DrawCommandHandler.js
          // default to having arrow keys move selected nodes
          'commandHandler.arrowKeyBehavior': 'move',

          mouseDrop: this.diagramOnMouseDrop,
          resizingTool: new LaneResizingTool(this.relayoutDiagram),
          linkingTool: new BPMNLinkingTool(), // defined in BPMNClasses.js
          relinkingTool: new BPMNRelinkingTool(), // defined in BPMNClasses.js
          'SelectionMoved': this.relayoutDiagram,  // defined below
          'SelectionCopied': this.relayoutDiagram,
          'LinkDrawn': function(e) { Helpers.assignGroupLayer(e.subject.containingGroup); },
          'LinkRelinked': function(e) { Helpers.assignGroupLayer(e.subject.containingGroup); }
        });

    ModellingAreaBPMNComponent.myDiagram.addDiagramListener('LinkDrawn', function (e) {
      if (e.subject.fromNode.category === 'annotation') {
        e.subject.category = 'annotation'; // annotation association
      } else if (e.subject.fromNode.category === 'dataobject' || e.subject.toNode.category === 'dataobject') {
        e.subject.category = 'data'; // data association
      } else if (e.subject.fromNode.category === 'datastore' || e.subject.toNode.category === 'datastore') {
        e.subject.category = 'data'; // data association
      }
    });
  }

  private diagramOnMouseDrop(e: go.InputEvent) {
    // when the selection is dropped in the diagram's background,
    // make sure the selected Parts no longer belong to any Group
    const ok = ModellingAreaBPMNComponent.myDiagram.commandHandler.addTopLevelParts(ModellingAreaBPMNComponent.myDiagram.selection, true);
    if (!ok) {
      ModellingAreaBPMNComponent.myDiagram.currentTool.doCancel();
    }
  }

// location of event on boundary of Activity is based on the index of the event in the boundaryEventArray
  private nodeActivityBESpotConverter(s: number) {
    const x = 10 + (this.EventNodeSize / 2);
    if (s === 0) { return new go.Spot(0, 1, x, 0); }    // bottom left
    if (s === 1) { return new go.Spot(1, 1, -x, 0); }   // bottom right
    if (s === 2) { return new go.Spot(1, 0, -x, 0); }   // top right
    return new go.Spot(1, 0, -x - (s - 2) * this.EventNodeSize, 0);    // top ... right-to-left-ish spread
  }

  private nodeActivityTaskTypeColorConverter(s: number) {
    return (s === 5) ? 'dimgray' : 'white';
  }

  private nodeEventTypeConverter(s: number) {  // order here from BPMN 2.0 poster
    const tasks = ['NotAllowed',
      'Empty',
      'BpmnTaskMessage',
      'BpmnEventTimer',
      'BpmnEventEscalation',
      'BpmnEventConditional',
      'Arrow',
      'BpmnEventError',
      'ThinX',
      'BpmnActivityCompensation',
      'Triangle',
      'Pentagon',
      'ThinCross',
      'Circle'];
    if (s < tasks.length) { return tasks[s]; }
    return 'NotAllowed'; // error
  }

  private nodeEventDimensionStrokeColorConverter(s: number) {
    if (s === 8) { return this.EventDimensionStrokeEndColor; }
    return this.EventDimensionStrokeColor;
  }

  private nodeEventDimensionSymbolFillConverter(s: number) {
    if (s <= 6) { return this.EventSymbolLightFill; }
    return this.EventSymbolDarkFill;
  }

  // removing a boundary event doesn't not reposition other BE circles on the node
  // just reassigning alignmentIndex in remaining BE would do that.
  private removeActivityNodeBoundaryEvent(obj: go.GraphObject | null) {
    if (obj === null || obj.panel === null || obj.panel.itemArray === null) { return; }
    ModellingAreaBPMNComponent.myDiagram.startTransaction('removeBoundaryEvent');
    const pid = obj.portId;
    const arr = obj.panel.itemArray;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].portId === pid) {
        ModellingAreaBPMNComponent.myDiagram.model.removeArrayItem(arr, i);
        break;
      }
    }
    ModellingAreaBPMNComponent.myDiagram.commitTransaction('removeBoundaryEvent');
  }

  // sub-process,  loop, parallel, sequential, ad doc and compensation markers in horizontal array
  private makeSubButton(sub: boolean) {
    if (sub) {
      return [$('SubGraphExpanderButton'),
        { margin: 2, visible: false },
        new go.Binding('visible', 'isSubProcess')];
    }
    return [];
  }

  // sub-process,  loop, parallel, sequential, ad doc and compensation markers in horizontal array
  private makeMarkerPanel(sub: boolean, scale: number) {
    return $(go.Panel, 'Horizontal',
      { alignment: go.Spot.MiddleBottom, alignmentFocus: go.Spot.MiddleBottom },
      $(go.Shape, 'BpmnActivityLoop',
        { width: 12 / scale, height: 12 / scale, margin: 2, visible: false, strokeWidth: this.ActivityMarkerStrokeWidth },
        new go.Binding('visible', 'isLoop')),
      $(go.Shape, 'BpmnActivityParallel',
        { width: 12 / scale, height: 12 / scale, margin: 2, visible: false, strokeWidth: this.ActivityMarkerStrokeWidth },
        new go.Binding('visible', 'isParallel')),
      $(go.Shape, 'BpmnActivitySequential',
        { width: 12 / scale, height: 12 / scale, margin: 2, visible: false, strokeWidth: this.ActivityMarkerStrokeWidth },
        new go.Binding('visible', 'isSequential')),
      $(go.Shape, 'BpmnActivityAdHoc',
        { width: 12 / scale, height: 12 / scale, margin: 2, visible: false, strokeWidth: this.ActivityMarkerStrokeWidth },
        new go.Binding('visible', 'isAdHoc')),
      $(go.Shape, 'BpmnActivityCompensation',
        { width: 12 / scale, height: 12 / scale, margin: 2, visible: false, strokeWidth: this.ActivityMarkerStrokeWidth, fill: null },
        new go.Binding('visible', 'isCompensation')),
      this.makeSubButton(sub)
    ); // end activity markers horizontal panel
  }

  private nodeGatewaySymbolTypeConverter(s: number) {
    const tasks = ['NotAllowed',
      'ThinCross',      // 1 - Parallel
      'Circle',         // 2 - Inclusive
      'AsteriskLine',   // 3 - Complex
      'ThinX',          // 4 - Exclusive  (exclusive can also be no symbol, just bind to visible=false for no symbol)
      'Pentagon',       // 5 - double cicle event based gateway
      'Pentagon',       // 6 - exclusive event gateway to start a process (single circle)
      'ThinCross'] ;   // 7 - parallel event gateway to start a process (single circle)
    if (s < tasks.length) { return tasks[s]; }
    return 'NotAllowed'; // error
  }

  // tweak the size of some of the gateway icons
  private nodeGatewaySymbolSizeConverter(s: number) {
    const size = new go.Size(this.GatewayNodeSymbolSize, this.GatewayNodeSymbolSize);
    if (s === 4) {
      size.width = size.width / 4 * 3;
      size.height = size.height / 4 * 3;
    } else if (s > 4) {
      size.width = size.width / 1.6;
      size.height = size.height / 1.6;
    }
    return size;
  }

  private nodePalGatewaySymbolSizeConverter(s: number) {
    const size = this.nodeGatewaySymbolSizeConverter(s);
    size.width = size.width / 2;
    size.height = size.height / 2;
    return size;
  }

  private groupStyle() {  // common settings for both Lane and Pool Groups
    return [
      {
        layerName: 'Background',  // all pools and lanes are always behind all nodes and links
        background: 'transparent',  // can grab anywhere in bounds
        movable: true, // allows users to re-order by dragging
        copyable: false,  // can't copy lanes or pools
        avoidable: false  // don't impede AvoidsNodes routed Links
      },
      new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify)
    ];
  }

  // hide links between lanes when either lane is collapsed
  private updateCrossLaneLinks(group: go.Group) {
    group.findExternalLinksConnected().each((l) => {
      l.visible = (l.fromNode !== null && l.fromNode.isVisible() && l.toNode !== null && l.toNode.isVisible());
    });
  }

  // Add a lane to pool (lane parameter is lane above new lane)
  private addLaneEvent(lane: go.Node) {
    ModellingAreaBPMNComponent.myDiagram.startTransaction('addLane');
    if (lane != null && lane.data.category === 'Lane') {
      // create a new lane data object
      const shape = lane.findObject('SHAPE');
      const size = new go.Size(shape ? shape.width : Helpers.MINLENGTH, Helpers.MINBREADTH);
      const newlanedata = {
        category: 'Lane',
        text: 'New Lane',
        color: 'white',
        isGroup: true,
        loc: go.Point.stringify(new go.Point(lane.location.x, lane.location.y + 1)), // place below selection
        size: go.Size.stringify(size),
        group: lane.data.group
      };
      // and add it to the model
      ModellingAreaBPMNComponent.myDiagram.model.addNodeData(newlanedata);
    }
    ModellingAreaBPMNComponent.myDiagram.commitTransaction('addLane');
  }


  // set Default Sequence Flow (backslash From Arrow)
  private setSequenceLinkDefaultFlow(obj: go.Link) {
    ModellingAreaBPMNComponent.myDiagram.startTransaction('setSequenceLinkDefaultFlow');
    const model = ModellingAreaBPMNComponent.myDiagram.model;
    model.setDataProperty(obj.data, 'isDefault', true);
    // Set all other links from the fromNode to be isDefault=null
    if (obj.fromNode !== null) {
      obj.fromNode.findLinksOutOf().each(function (link) {
        if (link !== obj && link.data.isDefault) {
          model.setDataProperty(link.data, 'isDefault', null);
        }
      });
    }
    ModellingAreaBPMNComponent.myDiagram.commitTransaction('setSequenceLinkDefaultFlow');
  }

  // set Conditional Sequence Flow (diamond From Arrow)
  private setSequenceLinkConditionalFlow(obj: go.Link) {
    ModellingAreaBPMNComponent.myDiagram.startTransaction('setSequenceLinkConditionalFlow');
    const model = ModellingAreaBPMNComponent.myDiagram.model;
    model.setDataProperty(obj.data, 'isDefault', false);
    ModellingAreaBPMNComponent.myDiagram.commitTransaction('setSequenceLinkConditionalFlow');
  }

  // this is called after nodes have been moved or lanes resized, to layout all of the Pool Groups again
  private relayoutDiagram() {
    ModellingAreaBPMNComponent.myDiagram.layout.invalidateLayout();
    ModellingAreaBPMNComponent.myDiagram.findTopLevelGroups().each(function (g) { if (g.category === 'Pool' && g.layout !== null) { g.layout.invalidateLayout(); } });
    ModellingAreaBPMNComponent.myDiagram.layoutDiagram();
  }

  // ------------------------------------------  Overview   ----------------------------------------------

  // const myOverview =
  //   $(go.Overview, 'myOverviewDiv',
  //     { observed: ModellingAreaBPMNComponent.myDiagram, maxScale: 0.5, contentAlignment: go.Spot.Center });
  // // change color of viewport border in Overview
  // (myOverview.box.elt(0) as go.Shape).stroke = 'dodgerblue';


  // ------------------------------------------  Commands for this application  ----------------------------------------------

  // Add a port to the specified side of the selected nodes.   name is beN  (be0, be1)
  // evDim is 5 for Interrupting, 6 for non-Interrupting
  public addActivityNodeBoundaryEvent(evType: number, evDim: number) {
    ModellingAreaBPMNComponent.myDiagram.startTransaction('addBoundaryEvent');
    ModellingAreaBPMNComponent.myDiagram.selection.each(function (node) {
      // skip any selected Links
      if (!(node instanceof go.Node)) { return; }
      if (node.data && (node.data.category === 'activity' || node.data.category === 'subprocess')) {
        // compute the next available index number for the side
        let i = 0;
        const defaultPort = node.findPort('');
        // tslint:disable-next-line:max-line-length
        while (node.findPort('be' + i.toString()) !== defaultPort) { i++; }           // now this new port name is unique within the whole Node because of the side prefix
        const name = 'be' + i.toString();
        if (!node.data.boundaryEventArray) { ModellingAreaBPMNComponent.myDiagram.model.setDataProperty(node.data, 'boundaryEventArray', []); }       // initialize the Array of port data if necessary
        // create a new port data object
        const newportdata = {
          portId: name,
          eventType: evType,
          eventDimension: evDim,
          color: 'white',
          alignmentIndex: i
          // if you add port data properties here, you should copy them in copyPortData above  ** BUG...  we don't do that.
        };
        // and add it to the Array of port data
        ModellingAreaBPMNComponent.myDiagram.model.insertArrayItem(node.data.boundaryEventArray, -1, newportdata);
      }
    });
    ModellingAreaBPMNComponent.myDiagram.commitTransaction('addBoundaryEvent');
  }

  // changes the item of the object
  public rename(obj: go.GraphObject) {
    if (obj === null || obj.part === null || obj.part.data === null) { return; }
    ModellingAreaBPMNComponent.myDiagram.startTransaction('rename');
    const newName = prompt('Rename ' + obj.part.data.item + ' to:');
    ModellingAreaBPMNComponent.myDiagram.model.setDataProperty(obj.part.data, 'item', newName);
    ModellingAreaBPMNComponent.myDiagram.commitTransaction('rename');
  }

  // shows/hides gridlines
  // to be implemented onclick of a button
  public updateGridOption() {
    ModellingAreaBPMNComponent.myDiagram.startTransaction('grid');
    const grid = document.getElementById('grid') as any;
    ModellingAreaBPMNComponent.myDiagram.grid.visible = grid.checked;
    ModellingAreaBPMNComponent.myDiagram.commitTransaction('grid');
  }

  // enables/disables snapping tools, to be implemented by buttons
  public updateSnapOption() {
    // no transaction needed, because we are modifying tools for future use
    const snap = document.getElementById('snap') as any;
    if (snap.checked) {
      ModellingAreaBPMNComponent.myDiagram.toolManager.draggingTool.isGridSnapEnabled = true;
      ModellingAreaBPMNComponent.myDiagram.toolManager.resizingTool.isGridSnapEnabled = true;
    } else {
      ModellingAreaBPMNComponent.myDiagram.toolManager.draggingTool.isGridSnapEnabled = false;
      ModellingAreaBPMNComponent.myDiagram.toolManager.resizingTool.isGridSnapEnabled = false;
    }
  }

  // user specifies the amount of space between nodes when making rows and column
  public askSpace(): number {
    const space = parseFloat(prompt('Desired space between nodes (in pixels):') || '0');
    return space;
  }

  public undo() { ModellingAreaBPMNComponent.myDiagram.commandHandler.undo(); }
  public redo() { ModellingAreaBPMNComponent.myDiagram.commandHandler.redo(); }
  public cutSelection() { ModellingAreaBPMNComponent.myDiagram.commandHandler.cutSelection(); }
  public copySelection() { ModellingAreaBPMNComponent.myDiagram.commandHandler.copySelection(); }
  public pasteSelection() { ModellingAreaBPMNComponent.myDiagram.commandHandler.pasteSelection(); }
  public deleteSelection() { ModellingAreaBPMNComponent.myDiagram.commandHandler.deleteSelection(); }
  public selectAll() { ModellingAreaBPMNComponent.myDiagram.commandHandler.selectAll(); }
  public alignLeft() { (ModellingAreaBPMNComponent.myDiagram.commandHandler as DrawCommandHandler).alignLeft(); }
  public alignRight() { (ModellingAreaBPMNComponent.myDiagram.commandHandler as DrawCommandHandler).alignRight(); }
  public alignTop() { (ModellingAreaBPMNComponent.myDiagram.commandHandler as DrawCommandHandler).alignTop(); }
  public alignBottom() { (ModellingAreaBPMNComponent.myDiagram.commandHandler as DrawCommandHandler).alignBottom(); }
  public alignCemterX() { (ModellingAreaBPMNComponent.myDiagram.commandHandler as DrawCommandHandler).alignCenterX(); }
  public alignCenterY() { (ModellingAreaBPMNComponent.myDiagram.commandHandler as DrawCommandHandler).alignCenterY(); }
  public alignRows() { (ModellingAreaBPMNComponent.myDiagram.commandHandler as DrawCommandHandler).alignRow(this.askSpace()); }
  public alignColumns() { (ModellingAreaBPMNComponent.myDiagram.commandHandler as DrawCommandHandler).alignColumn(this.askSpace()); }

  private addGoJsBPMNNodeFields(nodeData: any, modellingLanguageConstruct: string) {
    const dicEntry = Mappers.dictionaryAOAMEBPMNElementToGoJsNode.get(modellingLanguageConstruct);
    if (!dicEntry) {
      return;
    }
    nodeData.key = dicEntry.key;
    nodeData.category = dicEntry.category;
    nodeData.taskType = dicEntry.taskType;
    nodeData.isLoop = dicEntry.isLoop;
    nodeData.isSubProcess = dicEntry.isSubProcess;
    nodeData.isTransaction = dicEntry.isTransaction;
    nodeData.isGroup = dicEntry.isGroup;
    nodeData.isSequential = dicEntry.isSequential;
    nodeData.isAdHoc = dicEntry.isAdHoc;
    nodeData.eventType = dicEntry.eventType;
    nodeData.eventDimension = dicEntry.eventDimension;
    nodeData.gatewayType = dicEntry.gatewayType;
  }

  private addGoJsBPMNGroupFields(nodeData: any, modellingLanguageConstruct: string) {
    const dicEntry = Mappers.dictionaryAOAMEBPMNGroupToGoJsGroup.get(modellingLanguageConstruct);
    if (!dicEntry) {
      return;
    }
    nodeData.key = dicEntry.key;
    nodeData.category = dicEntry.category;
    nodeData.isGroup = dicEntry.isGroup;
    nodeData.text = dicEntry.text;
    nodeData.group = dicEntry.group;
    nodeData.color = dicEntry.color;
  }
}

//  uncomment this if you want a subprocess to expand on drop.  We decided we didn't like this behavior
//  ModellingAreaBPMNComponent.myDiagram.addDiagramListener("ExternalObjectsDropped", function(e) {
//    // e.subject is the collection that was just dropped
//    e.subject.each(function(part) {
//        if (part instanceof go.Node && part.data.item === "end") {
//          part.move(new go.Point(part.location.x  + 350, part.location.y))
//        }
// ModellingAreaBPMNComponent.myDiagram.addDiagramListener('Modified', function (e) {
//   const currentFile = document.getElementById('currentFile') as HTMLDivElement;
//   const idx = currentFile.textContent!.indexOf('*');
//   if (ModellingAreaBPMNComponent.myDiagram.isModified) {
//     if (idx < 0) { currentFile.textContent = currentFile.textContent + '*'; }
//   } else {
//     if (idx >= 0) { currentFile.textContent = currentFile.textContent!.slice(0, idx); }
//   }
// }); //      });
//    ModellingAreaBPMNComponent.myDiagram.commandHandler.expandSubGraph();
//  });

// change the title to indicate that the diagram has been modified



// ------------------------------------------  Palette   ----------------------------------------------

// Make sure the pipes are ordered by their key in the palette inventory
// function keyCompare(a: go.Part, b: go.Part) {
//   const at = a.data.key;
//   const bt = b.data.key;
//   if (at < bt) { return -1; }
//   if (at > bt) { return 1; }
//   return 0;
// }
//
// // initialize the first Palette, BPMN Spec Level 1
// const myPaletteLevel1 =
//   $(go.Palette, 'myPaletteLevel1',
//     { // share the templates with the main Diagram
//       nodeTemplateMap: palNodeTemplateMap,
//       groupTemplateMap: palGroupTemplateMap,
//       layout: $(go.GridLayout,
//         {
//           cellSize: new go.Size(1, 1),
//           spacing: new go.Size(5, 5),
//           comparer: keyCompare
//         })
//     });
//
// // initialize the second Palette, BPMN Spec Level 2
// const myPaletteLevel2 =
//   $(go.Palette, 'myPaletteLevel2',
//     { // share the templates with the main Diagram
//       nodeTemplateMap: palNodeTemplateMap,
//       groupTemplateMap: palGroupTemplateMap,
//       layout: $(go.GridLayout,
//         {
//           cellSize: new go.Size(1, 1),
//           spacing: new go.Size(5, 5),
//           comparer: keyCompare
//         })
//     });
//
// // initialize the third Palette, random other stuff
// const myPaletteLevel3 =
//   $(go.Palette, 'myPaletteLevel3',
//     { // share the templates with the main Diagram
//       nodeTemplateMap: palNodeTemplateMap,
//       groupTemplateMap: palGroupTemplateMap,
//       layout: $(go.GridLayout,
//         {
//           cellSize: new go.Size(1, 1),
//           spacing: new go.Size(5, 5),
//           comparer: keyCompare
//         })
//     });
//
// myPaletteLevel1.model = $(go.GraphLinksModel,
//   {
//     copiesArrays: true,
//     copiesArrayObjects: true,
//     nodeDataArray: [
//       // -------------------------- Event Nodes
//       { key: 101, category: 'event', text: 'Start', eventType: 1, eventDimension: 1, item: 'start' },
//       { key: 102, category: 'event', text: 'Message', eventType: 2, eventDimension: 2, item: 'Message' }, // BpmnTaskMessage
//       { key: 103, category: 'event', text: 'Timer', eventType: 3, eventDimension: 3, item: 'Timer' },
//       { key: 104, category: 'event', text: 'End', eventType: 1, eventDimension: 8, item: 'End' },
//       { key: 107, category: 'event', text: 'Message', eventType: 2, eventDimension: 8, item: 'Message' }, // BpmnTaskMessage
//       { key: 108, category: 'event', text: 'Terminate', eventType: 13, eventDimension: 8, item: 'Terminate' },
//       // -------------------------- Task/Activity Nodes
//       { key: 131, category: 'activity', text: 'Task', item: 'generic task', taskType: 0 },
//       { key: 132, category: 'activity', text: 'User Task', item: 'User task', taskType: 2 },
//       { key: 133, category: 'activity', text: 'Service\nTask', item: 'service task', taskType: 6 },
//       // subprocess and start and end
//       { key: 134, category: 'subprocess', loc: '0 0', text: 'Subprocess', isGroup: true, isSubProcess: true, taskType: 0 },
//       { key: -802, category: 'event', loc: '0 0', group: 134, text: 'Start', eventType: 1, eventDimension: 1, item: 'start' },
//       { key: -803, category: 'event', loc: '350 0', group: 134, text: 'End', eventType: 1, eventDimension: 8, item: 'end', name: 'end' },
//       // -------------------------- Gateway Nodes, Data, Pool and Annotation
//       { key: 201, category: 'gateway', text: 'Parallel', gatewayType: 1 },
//       { key: 204, category: 'gateway', text: 'Exclusive', gatewayType: 4 },
//       { key: 301, category: 'dataobject', text: 'Data\nObject' },
//       { key: 302, category: 'datastore', text: 'Data\nStorage' },
//       { key: 401, category: 'privateProcess', text: 'Black Box' },
//       { key: '501', 'text': 'Pool 1', 'isGroup': 'true', 'category': 'Pool' },
//       { key: 'Lane5', 'text': 'Lane 1', 'isGroup': 'true', 'group': '501', 'color': 'lightyellow', 'category': 'Lane' },
//       { key: 'Lane6', 'text': 'Lane 2', 'isGroup': 'true', 'group': '501', 'color': 'lightgreen', 'category': 'Lane' },
//       { key: 701, category: 'annotation', text: 'note' }
//     ]  // end nodeDataArray
//   });  // end model
//
// // an activity with a boundary event:
// //        {
// //          key: 1,
// //          category: "activity",
// //          text: "Message",
// //          taskType: 1,
// //          item: "Message Task",
// //          boundaryEventArray: [{ "portId": "be0", alignmentIndex: 0, eventType: 2, color: "white" }]   // portId # and alignmentIndex should match
// //        },
//
// myPaletteLevel2.model = $(go.GraphLinksModel,
//   {
//     copiesArrays: true,
//     copiesArrayObjects: true,
//     nodeDataArray: [
//       { key: 1, category: 'activity', taskType: 1, text: 'Receive Task', item: 'Receive Task' },
//       { key: 2, category: 'activity', taskType: 5, text: 'Send Task', item: 'Send Task' },
//       { key: 3, category: 'activity', taskType: 7, text: 'Business\nRule Task', item: 'Business Rule Task' },
//       { key: 4, category: 'activity', taskType: 2, text: 'User Task', item: 'User Task', isCall: true },
//
//       { key: 101, text: 'Adhoc\nSubprocess', isGroup: true, isSubProcess: true, category: 'subprocess', isAdHoc: true, taskType: 0, loc: '0 0' },
//       { key: -812, group: 101, category: 'event', text: 'Start', eventType: 1, eventDimension: 1, item: 'start', loc: '0 0' },
//       { key: -813, group: 101, category: 'event', text: 'End', eventType: 1, eventDimension: 8, item: 'end', name: 'end' },
//
//       { key: 102, text: 'Transactional\nSubprocess', isGroup: true, isSubProcess: true, category: 'subprocess', isTransaction: true, taskType: 0, loc: '0 0' },
//       { key: -822, group: 102, category: 'event', text: 'Start', eventType: 1, eventDimension: 1, item: 'start', loc: '0 0' },
//       { key: -823, group: 102, category: 'event', text: 'End', eventType: 1, eventDimension: 8, item: 'end', name: 'end', loc: '350 0' },
//
//       { key: 103, text: 'Looping\nActivity', isGroup: true, isLoop: true, isSubProcess: true, category: 'subprocess', taskType: 0, loc: '0 0' },
//       { key: -831, group: 103, category: 'event', text: 'Start', eventType: 1, eventDimension: 1, item: 'start', loc: '0 0' },
//       { key: -832, group: 103, category: 'event', text: 'End', eventType: 1, eventDimension: 8, item: 'end', name: 'end', loc: '350 0' },
//
//       { key: 104, text: 'Multi-Instance\nActivity', isGroup: true, isSubProcess: true, isParallel: true, category: 'subprocess', taskType: 0, loc: '0 0' },
//       { key: -841, group: 104, category: 'event', text: 'Start', eventType: 1, eventDimension: 1, item: 'start', loc: '0 0' },
//       { key: -842, group: 104, category: 'event', text: 'End', eventType: 1, eventDimension: 8, item: 'end', name: 'end', loc: '350 0' },
//
//       { key: 105, text: 'Call\nSubprocess', isGroup: true, isSubProcess: true, category: 'subprocess', isCall: true, taskType: 0, loc: '0 0' },
//       { key: -861, group: 105, category: 'event', text: 'Start', eventType: 1, eventDimension: 1, item: 'start', loc: '0 0' },
//       { key: -862, group: 105, category: 'event', text: 'End', eventType: 1, eventDimension: 8, item: 'end', name: 'end', loc: '350 0' },
//
//       // gateway nodes
//       { key: 301, category: 'gateway', gatewayType: 2, text: 'Inclusive' },
//       { key: 302, category: 'gateway', gatewayType: 5, text: 'Event\nGateway' },
//
//       // events
//       { key: 401, category: 'event', eventType: 5, eventDimension: 1, text: 'Conditional\nStart', item: 'BpmnEventConditional' },
//       { key: 402, category: 'event', eventType: 10, eventDimension: 1, text: 'Signal\nStart', item: 'BpmnEventSignal' },  // start signal
//       { key: 403, category: 'event', eventType: 10, eventDimension: 8, text: 'Signal\nEnd', item: 'end signal' },
//       { key: 404, category: 'event', eventType: 7, eventDimension: 8, text: 'Error', item: 'BpmnEventError' },
//       { key: 405, category: 'event', eventType: 4, eventDimension: 8, text: 'Escalation', item: 'BpmnEventEscalation' },
//       // throwing / catching intermedicate events
//       { key: 502, category: 'event', eventType: 6, eventDimension: 4, text: 'Catch\nLink', item: 'BpmnEventOffPage' },
//       { key: 503, category: 'event', eventType: 6, eventDimension: 7, text: 'Throw\nLink', item: 'BpmnEventOffPage' },
//       { key: 504, category: 'event', eventType: 2, eventDimension: 4, text: 'Catch\nMessage', item: 'Message' },
//       { key: 505, category: 'event', eventType: 2, eventDimension: 7, text: 'Throw\nMessage', item: 'Message' },
//       { key: 506, category: 'event', eventType: 5, eventDimension: 4, text: 'Catch\nConditional', item: '' },
//       { key: 507, category: 'event', eventType: 3, eventDimension: 4, text: 'Catch\nTimer', item: '' },
//       { key: 508, category: 'event', eventType: 4, eventDimension: 7, text: 'Throw\nEscalation', item: 'Escalation' },
//       { key: 509, category: 'event', eventType: 10, eventDimension: 4, text: 'Catch\nSignal', item: '' },
//       { key: 510, category: 'event', eventType: 10, eventDimension: 7, text: 'Throw\nSignal', item: '' }
//     ]  // end nodeDataArray
//   });  // end model
//
// myPaletteLevel3.model = $(go.GraphLinksModel,
//   {
//     copiesArrays: true,
//     copiesArrayObjects: true,
//     nodeDataArray: [
//       { key: 108, category: 'event', eventType: 8, eventDimension: 5, text: 'Cancel', item: 'BpmnEventCancel' },
//       { key: 109, category: 'event', eventType: 9, eventDimension: 5, text: 'Compensation', item: 'BpmnEventCompensation' },
//
//       { key: 111, category: 'event', eventType: 11, eventDimension: 1, text: 'Multiple', item: 'Multiple' },
//       { key: 112, category: 'event', eventType: 12, eventDimension: 1, text: 'Parallel', item: 'Parallel' },
//       // activity nodes
//       { key: 203, category: 'activity', taskType: 3, isAdHoc: true, text: 'Manual', item: 'Manual Task' },
//       { key: 204, category: 'activity', taskType: 4, isSequential: true, text: 'Script', item: 'Script Task' },
//       { key: 205, category: 'activity', taskType: 5, isParallel: true, text: 'Send Msg', item: 'Send Msg Task' },
//       { key: 206, category: 'activity', taskType: 6, isLoop: true, isSubProcess: true, isTransaction: true, text: 'Service', item: 'service task' },
//
//       // gateway nodes not in Level 1 or Level 2
//       { key: 603, category: 'gateway', text: 'Complex', gatewayType: 3 },
//       { key: 606, category: 'gateway', text: 'Exclusive Start', gatewayType: 6 },
//       { key: 607, category: 'gateway', text: 'Parallel Start', gatewayType: 7 },
//
//       {
//         key: 4, category: 'activity', taskType: 2, text: 'User Task', item: 'User Task',
//         isCall: true, isLoop: true, isParallel: true, isSequential: true
//       }
//     ]  // end nodeDataArray
//   });  // end model
