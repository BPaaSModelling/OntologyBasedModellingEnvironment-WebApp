import {Component, HostListener, Input, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import * as go from 'gojs';
import {ChangedEvent} from 'gojs';
import {PaletteElementModel} from '../_models/PaletteElement.model';
import {VariablesSettings} from '../_settings/variables.settings';
import {ModellerService} from '../modeller.service';
import {ContextMenuComponent} from '@perfectmemory/ngx-contextmenu';
import {Model} from '../_models/Model.model';
import {ModalModelCreation} from '../modal-model-creation/modal-model-creation.component';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
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
import {ModalModelEdit} from '../modal-model-edit/modal-model-edit.component';
import {ModelElementDetail} from '../_models/ModelElementDetail.model';
import {ModelElementDetailAndModel} from '../_models/ModelElementDetailAndModel';
import {ModalViewElementDetail} from '../model-element-detail/model-element-detail.component';
import {ModalModelExport} from '../modal-model-export/modal-model-export-component';
import {ModalModelMultipleExport} from '../modal-model-multiple-export/modal-model-multiple-export.component';
import {ActivatedRoute} from '@angular/router';
import {take} from 'rxjs/operators';

let $: any;
let myDiagram: any;
let myModel: any;
let myPalette: any;
let model: any;
let nodeArray: any;
let nodeDataArray: any;
let linkDataArray: any;
let myContextMenu: any;
let cxElement: any;

@Component({
  selector: 'app-modelling-area',
  templateUrl: './modelling-area.component.html',
  // template: '<div id="cy"></div>',
  styleUrls: ['./modelling-area.component.css']
})
export class ModellingAreaComponent implements OnInit {

  public constructor(public mService: ModellerService, public matDialog: MatDialog, private activatedRoute: ActivatedRoute) {
    console.log('Constructor of graph');
    (go as any).licenseKey = '54ff43e7b11c28c702d95d76423d38f919a52e63998449a35a0412f6be086d1d239cef7157d78cc687f84cfb487fc2898fc1697d964f073cb539d08942e786aab63770b3400c40dea71136c5ceaa2ea1fa2b24a5c5b775a2dc718cf3bea1c59808eff4d54fcd5cb92b280735562bac49e7fc8973f950cf4e6b3d9ba3fffbbf4faf3c7184ccb4569aff5a70deb6f2a3417f';
    // this.mService.queryPaletteCategories();
    // this.mService.queryPaletteElements();

    this.dialog = matDialog;
  }

  @ViewChild(ContextMenuComponent, { static: true }) public elementRightClickMenu: ContextMenuComponent<any>;
  @ViewChild(ContextMenuComponent, { static: true }) public paletteRightClickMenu: ContextMenuComponent<any>;

  @Input() contextMenu: ContextMenuComponent<any>;
  @Input() contextMenuSubject: PaletteElementModel;

  @Input() public elements: any;
  @Input() public style: any;
  @Input() public layout: any;
  @Input() public zoom: any;
  @Input() new_element: PaletteElementModel;
  private elementCnt = 0;
  private node1;
  private node2;
  private key;

  private myDiagram: any;
  private connectorModeOn = false;
  private connectorId;
  // private palletteElement_Observable: Observable<PaletteElementModel[]>;
  private palletteElements: any;

  public models: Model[] = [];
  public selectedModel: Model;
  public selectedConnectorMode: PaletteElementModel;
  private pathPatterns: Map<string, string> = new Map();
  private dialog: MatDialog;

  public canvasTextBoxText: string;
  selectedFile: File;

  /*getPalletteElements(): void {
        this.palletteElement_Observable = this.mService.queryPaletteElements();
        this.palletteElement_Observable.subscribe(palletteElement => {
          this.palletteElements = palletteElement;
          console.log('Inside getPalletteElements');
          console.log(this.palletteElements);
        });
      }*/
  selectedInstantiationType: InstantiationTargetType = InstantiationTargetType.INSTANCE;

  private static convertGeometryToShape(geometry: string) {

    if (!geometry) { return null; }

    return $(go.Shape,
      {
        geometryString: geometry,
        fill: 'transparent',
        stroke: 'black',
        strokeWidth: 1.5,
        strokeCap: 'round'
      }
    );
  }

  ngOnInit(): void {
    this.mService.queryPaletteElements();
    this.prepareModels();
    this.prepareCustomRelations();
  }

  private prepareCustomRelations() {
    // https://gojs.net/latest/samples/relationships.html
    this.pathPatterns.set('Single', 'M0 0 L1 0');
    this.pathPatterns.set('Double', 'M0 0 L1 0 M0 3 L1 3');
    this.pathPatterns.set('Triple', 'M0 0 L1 0 M0 3 L1 3 M0 6 L1 6');
    this.pathPatterns.set('Dash', 'M0 0 M3 0 L6 0');
    this.pathPatterns.set('DoubleDash', 'M0 0 M3 0 L6 0 M3 3 L6 3');
    this.pathPatterns.set('Dot', 'M0 0 M4 0 L4.1 0');
    this.pathPatterns.set('DoubleDot', 'M0 0 M4 0 L4.1 0 M4 3 L4.1 3');
    this.pathPatterns.set('BackSlash', 'M0 3 L2 6 M1 0 L5 6 M4 0 L6 3');
    this.pathPatterns.set('Slash', 'M0 3 L2 0 M1 6 L5 0 M4 6 L6 3');
    this.pathPatterns.set('Coil', 'M0 0 C2.5 0  5 2.5  5 5  C5 7.5  5 10  2.5 10  C0 10  0 7.5  0 5  C0 2.5  2.5 0  5 0');
    this.pathPatterns.set('Square', 'M0 0 M1 0 L7 0 7 6 1 6z');
    this.pathPatterns.set('Circle', 'M0 3 A3 3 0 1 0 6 4  A3 3 0 1 0 0 3');
    this.pathPatterns.set('BigCircle', 'M0 5 A5 5 0 1 0 10 5  A5 5 0 1 0 0 5');
    this.pathPatterns.set('Triangle', 'M0 0 L4 4 0 8z');
    this.pathPatterns.set('Diamond', 'M0 4 L4 0 8 4 4 8z');
    this.pathPatterns.set('Dentil', 'M0 0 L2 0  2 6  6 6  6 0  8 0');
    this.pathPatterns.set('Greek', 'M0 0 L1 0  1 3  0 3  M0 6 L4 6  4 0  8 0  M8 3 L7 3  7 6  8 6');
    this.pathPatterns.set('Seed', 'M0 0 A9 9 0 0 0 12 0  A9 9 180 0 0 0 0');
    this.pathPatterns.set('SemiCircle', 'M0 0 A4 4 0 0 1 8 0');
    this.pathPatterns.set('BlindHem', 'M0 4 L2 4  4 0  6 4  8 4');
    this.pathPatterns.set('Zipper', 'M0 4 L1 4 1 0 8 0 8 4 9 4  M0 6 L3 6 3 2 6 2 6 6 9 6');
    this.pathPatterns.set('Herringbone', 'M0 2 L2 4 0 6  M2 0 L4 2  M4 6 L2 8');
    this.pathPatterns.set('Sawtooth', 'M0 3 L4 0 2 6 6 3');
  }

  private prepareModels() {
    this.mService.getModels().then(models => {
      this.models = models;

      this.models.forEach(model => {
        model.goJsModel = new go.GraphLinksModel();

        this.mService.getElements(model.id).then(value => {
          this.prepareModelElements(model, value);
          this.setQueryParams();
        });
      });

    });
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
          otherVisualisationsOfSameLanguageConstruct: element.otherVisualisationsOfSameLanguageConstruct
        };

        if (element.fromArrow !== undefined) {
          linkData.fromArrow = element.fromArrow;
        }

        if (element.toArrow !== undefined) {
          linkData.toArrow = element.toArrow;
        }

        model.goJsModel.addLinkData(linkData);

      } else if (element.modelElementType === 'ModelingElement') {

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

  initDiagramCanvas() {

    $ = go.GraphObject.make;

    this.myDiagram =
      $(go.Diagram, 'myDiagramDiv',
        {
          initialContentAlignment: go.Spot.Left,
          'undoManager.isEnabled': true, // enable Ctrl-Z to undo and Ctrl-Y to redo
          allowDrop: true,
          'draggingTool.dragsLink': false,
          'draggingTool.isGridSnapEnabled': true,
          'linkingTool.isUnconnectedLinkValid': false,
          'linkingTool.portGravity': 20,
          'relinkingTool.isUnconnectedLinkValid': false,
          'relinkingTool.portGravity': 20,
          'relinkingTool.fromHandleArchetype':
            $(go.Shape, 'Diamond', { segmentIndex: 0, cursor: 'pointer', desiredSize: new go.Size(8, 8), fill: 'tomato', stroke: 'darkred' }),
          'relinkingTool.toHandleArchetype':
            $(go.Shape, 'Diamond', { segmentIndex: -1, cursor: 'pointer', desiredSize: new go.Size(8, 8), fill: 'darkred', stroke: 'tomato' }),
          'linkReshapingTool.handleArchetype':
            $(go.Shape, 'Diamond', { desiredSize: new go.Size(7, 7), fill: 'lightblue', stroke: 'deepskyblue' })
        }, // center Diagram contents
      );

    /*cxElement = document.getElementById("contextMenu");

    myContextMenu = $(go.HTMLInfo, {
      show: this.showContextMenu,
      mainElement: cxElement
    });*/

    const nodeSelectionAdornmentTemplate =
      $(go.Adornment, 'Auto',
        $(go.Shape, { fill: null, stroke: 'deepskyblue', strokeWidth: 1.5, strokeDashArray: [4, 2] }),
        $(go.Placeholder)
      );

    this.myDiagram.linkTemplate =
      $(go.Link,  // the whole link panel
        $(go.Shape,  // the link shape
        {
          stroke: 'transparent',
          strokeWidth: 3
        },
          new go.Binding('pathPattern', 'pathPattern', ModellingAreaComponent.convertGeometryToShape)
        ),
        $(go.Shape,  // the "from" arrowhead
          new go.Binding('fromArrow', 'fromArrow'),
          { scale: 2 }),
        $(go.Shape,  // the "to" arrowhead
          new go.Binding('toArrow', 'toArrow'),
          { scale: 2 }),
        $(go.TextBlock,
          {
            font: '11pt Helvetica, Arial, sans-serif',
            wrap: go.TextBlock.WrapFit,
            editable: true,
            textAlign: 'center',
            segmentOffset: new go.Point(0, -10),
            alignment: go.Spot.Left // or go.Spot.Bottom
          },
          new go.Binding('text').makeTwoWay()
        ),
        $(go.Shape,
          {
            alignment: go.Spot.TopLeft,
            alignmentFocus: go.Spot.TopLeft,
            width: 12, height: 12, fill: 'orange',
            visible: false,
            figure: 'Arrow'
          },
          new go.Binding('visible', 'shapeRepresentsModel', convertFieldExistenceToLinkVisibility)
        )
      );

    this.myDiagram.nodeTemplate =
      $(go.Node, 'Auto', // this resizes the entire shape
        {
          name: 'Node',
          locationSpot: go.Spot.Left,
          resizable: true,
          resizeObjectName: 'PANEL' // Changing this to Picture resizes the images, however links are a problem
        },
        new go.Binding('location', 'loc'),
        new go.Binding('group', 'containedInContainer'),
        { selectable: true, selectionAdornmentTemplate: nodeSelectionAdornmentTemplate },
        new go.Binding('angle').makeTwoWay(),
        // the main object is a Panel that surrounds a TextBlock with a Shape

        $(go.Panel, 'Auto',
          {
            name: 'PANEL',
            angle: 0
          },
          new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(go.Size.stringify),
          new go.Binding('angle'),
          $(go.Shape, 'Rectangle',  // default figure
            {
              name: 'SHAPE',
              portId: '', // the default port: if no spot on link data, use closest side
              fromLinkable: true, toLinkable: true, cursor: 'pointer',
              fill: '#000000',  // default color
              // width: 835, height: 575,
              strokeWidth: 0
            },
            new go.Binding('fill')),
            new go.Binding('width'),
            new go.Binding('height'),
          $(go.Picture,
            {
              name: 'Picture',
              source: '/assets/images/BPMN-CMMN/Collapsed_Subprocess.png',
              margin: 12, // increase margin if text alignment is changed to bottom
              stretch: go.GraphObject.Fill // stretch image to fill whole area of shape
              // imageStretch: go.GraphObject.Fill //do not distort the image
            },
            new go.Binding('source'),
            new go.Binding('desiredSize')),
          $(go.TextBlock,
            {
              font: '11pt Helvetica, Arial, sans-serif',
              margin: 8,
              maxSize: new go.Size(200, NaN),
              wrap: go.TextBlock.WrapFit,
              editable: true,
              alignment: go.Spot.Bottom // or go.Spot.Bottom
            },
            new go.Binding('text').makeTwoWay(),
            new go.Binding('alignment')
          ),
          $(go.Shape,
            {
              alignment: go.Spot.TopLeft,
              alignmentFocus: go.Spot.TopLeft,
              width: 12, height: 12, fill: 'orange',
              visible: false,
              figure: 'Arrow'
            },
            new go.Binding('visible', 'shapeRepresentsModel', convertFieldExistenceToLinkVisibility)
          ),
          $(go.Shape,
            {
              alignment: go.Spot.BottomLeft,
              alignmentFocus: go.Spot.BottomLeft,
              width: 12, height: 12, fill: 'orange',
              visible: false,
              figure: 'MultiDocument'
            },
            new go.Binding('visible', 'otherVisualisationsOfSameLanguageConstruct', convertFieldExistenceToLinkVisibility)
          )
        )
    );

    function convertFieldExistenceToLinkVisibility (obj) {
      return obj != undefined;
    }

    this.myDiagram.groupTemplate =
      $(go.Group, 'Auto',
        {
          name: 'GROUP',
          angle: 0,
          resizable: true,
          resizeObjectName: 'PANEL'
        },
        new go.Binding('location', 'loc'),
        new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(go.Size.stringify),
        new go.Binding('angle'),
        $(go.Shape, 'Rectangle',  // default figure
          {
            name: 'SHAPE',
            portId: '', // the default port: if no spot on link data, use closest side
            fromLinkable: true, toLinkable: true, cursor: 'pointer',
            fill: '#000000',  // default color
            // width: 835, height: 575,
            strokeWidth: 0
          },
          new go.Binding('fill')),
        new go.Binding('width'),
        new go.Binding('height'),
        $(go.Picture,
          {
            name: 'Picture',
            source: '/assets/images/BPMN-CMMN/Collapsed_Subprocess.png',
            margin: 12, // increase margin if text alignment is changed to bottom
            stretch: go.GraphObject.Fill // stretch image to fill whole area of shape
            // imageStretch: go.GraphObject.Fill //do not distort the image
          },
          new go.Binding('source'),
          new go.Binding('desiredSize')),
        $(go.TextBlock,
          {
            font: '11pt Helvetica, Arial, sans-serif',
            margin: 8,
            maxSize: new go.Size(200, NaN),
            wrap: go.TextBlock.WrapFit,
            editable: true,
            alignment: go.Spot.Bottom // or go.Spot.Bottom
          },
          new go.Binding('text').makeTwoWay(),
          new go.Binding('alignment')
        ),
        $(go.Shape,
          {
            alignment: go.Spot.TopLeft,
            alignmentFocus: go.Spot.TopLeft,
            width: 12, height: 12, fill: 'orange',
            visible: false,
            figure: 'Arrow'
          },
          new go.Binding('visible', 'shapeRepresentsModel', convertFieldExistenceToLinkVisibility)
        ),
        $(go.Shape,
          {
            alignment: go.Spot.BottomLeft,
            alignmentFocus: go.Spot.BottomLeft,
            width: 12, height: 12, fill: 'orange',
            visible: false,
            figure: 'MultiDocument'
          },
          new go.Binding('visible', 'otherVisualisationsOfSameLanguageConstruct', convertFieldExistenceToLinkVisibility)
        )
      );

    this.myDiagram.nodeTemplate.contextMenu =
      $('ContextMenu',
        $('ContextMenuButton',
          $(go.TextBlock, 'Model Element Attributes'),
          {
            click: (e, obj) => {
              const node = obj.part.adornedPart;
              if (node != null) {
                const element = node.data.element;

                const modelElementAndModel = new ModelElementDetailAndModel();
                modelElementAndModel.modelId = this.selectedModel.id;
                modelElementAndModel.elementDetail = element;

                this.dialog.open(ModalViewElementDetail, {
                  data: modelElementAndModel
                });
              }
            }
          }
        ),
        $('ContextMenuButton',
          $(go.TextBlock, 'Model Link'),
          {
            click: (e, obj) => {
              const node = obj.part.adornedPart;
              if (node != null) {
                const element = node.data.element;

                const modelElementDetailAndModel = new ModelElementDetailAndModel();
                modelElementDetailAndModel.modelId = this.selectedModel.id;
                modelElementDetailAndModel.elementDetail = element;

                const dialogRef = this.dialog.open(ModalModelLink, {
                  data: modelElementDetailAndModel
                });

                dialogRef.afterClosed().subscribe(result => {

                  if (result === undefined) { return; }

                  if (result.action === 'Delete') {
                    delete element.shapeRepresentsModel;
                    this.mService.updateElement(element, this.selectedModel.id);
                  } else if (result.action === 'Save') {
                    element.shapeRepresentsModel = result.selectedModelId;
                    this.myDiagram.model.setDataProperty(node.data, 'element', element);
                    this.myDiagram.model.setDataProperty(node.data, 'shapeRepresentsModel', element.shapeRepresentsModel);
                    this.mService.updateElement(element, this.selectedModel.id);
                  }

                  this.myDiagram.rebuildParts();
                });
              }
            }
          }
        ),
        $('ContextMenuButton',
          $(go.TextBlock, 'Note'),
          {
            click: (e, obj) => {
              const node = obj.part.adornedPart;
              if (node != null) {
                const element = node.data.element;

                const modelElementDetailAndModel = new ModelElementDetailAndModel();
                modelElementDetailAndModel.modelId = this.selectedModel.id;
                modelElementDetailAndModel.elementDetail = element;

                this.dialog.open(ModalElementNote, {
                  data: modelElementDetailAndModel
                });
              }
            }
          }
        ),
        $('ContextMenuButton',
          $(go.TextBlock, 'Visualisations of same element'),
          {
            click: (e, obj) => {
              const node = obj.part.adornedPart;
              if (node != null) {
                const element = node.data.element;

                const otherVisualisationsData = new VisualisationLinksData();
                otherVisualisationsData.modelingLanguageConstructInstanceId = element.modelingLanguageConstructInstance;
                otherVisualisationsData.otherVisualisations = [];

                // referenced shapes
                if (element.otherVisualisationsOfSameLanguageConstruct !== undefined) {
                  this.models.forEach(model => {
                    const modelElementDetail = model.elements.find(modelElement => element.otherVisualisationsOfSameLanguageConstruct.includes(modelElement.id));
                    if (modelElementDetail !== undefined) {
                      const data = new ModelElementDetailAndModel();
                      data.modelId = model.id;
                      data.modelLabel = model.label;
                      data.elementDetail = modelElementDetail;
                      otherVisualisationsData.otherVisualisations.push(data);
                    }
                  });
                }

                // current element
                const data = new ModelElementDetailAndModel();
                data.modelId = this.selectedModel.id;
                data.modelLabel = this.selectedModel.label;
                data.elementDetail = element;
                otherVisualisationsData.otherVisualisations.push(data);

                this.dialog.open(ModalModellingLanguageConstructInstanceLink, {
                  data: otherVisualisationsData
                });
              }
            }
          }
        ),
        $('ContextMenuButton',
          $(go.TextBlock, 'Visualisation'),
          {
            click: (e, obj) => {
              const node = obj.part.adornedPart;
              if (node != null) {
                const element = node.data.element;

                const modelElementDetailAndModel = new ModelElementDetailAndModel();
                modelElementDetailAndModel.modelId = this.selectedModel.id;
                modelElementDetailAndModel.elementDetail = element;

                const dialogRef = this.dialog.open(ModalPaletteVisualisation, {
                  data: modelElementDetailAndModel
                });

                dialogRef.afterClosed().subscribe(result => {
                  if (result !== 'Cancel') {
                    element.paletteConstruct = result.paletteConstruct;
                    this.mService.updateElement(element, this.selectedModel.id);
                    this.myDiagram.rebuildParts();
                  }
                });

              }
            }
          }
        )
      );

    this.myDiagram.linkTemplate.contextMenu = this.myDiagram.nodeTemplate.contextMenu;
    this.myDiagram.groupTemplate.contextMenu = this.myDiagram.nodeTemplate.contextMenu;

    this.myDiagram.layout = new go.Layout();

    this.myDiagram.addModelChangedListener((evt: ChangedEvent) => {
      // ignore unimportant Transaction events
      if (!evt.isTransactionFinished) { return; }
      const txn = evt.object;  // a Transaction
      if (txn === null) { return; }

      if (txn.name === 'Move') {
        this.handleNodeMove(txn);
      }

      if (txn.name === 'TextEditing') {
        this.handleNodeTextEditing(txn);
      }

      if (txn.name === 'Delete') {
        this.handleNodeDeleted(txn);
      }

      if (txn.name === 'Linking') {
        this.handleNodeLinking(txn);
      }

      if (txn.name === 'Resizing') {
        this.handleNodeResizing(txn);
      }

      if (txn.name === 'Paste') {
        this.handleNodePaste(txn);
      }
    });
  }

  private handleNodePaste(txn: any) {
    // TODO handle case when several elements are copied (including containers and links)
    const data = txn.changes.toArray().find(change => change.propertyName = 'nodeDataArray').newValue;
    const element = data.element;

    const paletteConstructName = element.paletteConstruct.split(':')[1];
    const key = paletteConstructName + '_Shape_' + UUID.UUID();

    this.myDiagram.model.setKeyForNodeData(data, key);
    const newElement = Object.assign({}, element); // apparently copying leads to referencing the same element from both data objects...
    newElement.id = key;
    const newNodeData = this.myDiagram.model.findNodeDataForKey(key);
    newNodeData.element = newElement;

    this.mService.copyElement(
      newElement,
      this.selectedModel.id
    ).then(response => {
      const nodeToManipulate = this.myDiagram.model.findNodeDataForKey(key);
      this.myDiagram.model.setDataProperty(nodeToManipulate, 'otherVisualisationsOfSameLanguageConstruct', response.otherVisualisationsOfSameLanguageConstruct);
      nodeToManipulate.element = response;

      response.otherVisualisationsOfSameLanguageConstruct.forEach(otherElementDataKey => {
        const otherNodeData = this.myDiagram.model.findNodeDataForKey(otherElementDataKey);
        if (otherNodeData) {
          const otherElements = otherNodeData.element.otherVisualisationsOfSameLanguageConstruct && otherNodeData.element.otherVisualisationsOfSameLanguageConstruct.slice() || [];
          otherElements.push(response.id);
          this.myDiagram.model.setDataProperty(otherNodeData, 'otherVisualisationsOfSameLanguageConstruct', otherElements);
          otherNodeData.element.otherVisualisationsOfSameLanguageConstruct = otherElements;
        }
      });
    });
  }

  private handleNodeResizing(txn: any) {

    // resizing should only be affecting one element, we are not interested in the others
    const latestChange = _.last(txn.changes.toArray().filter(change => change.propertyName === 'size'));
    const modelElement = latestChange.object.element;
    modelElement.width = Math.trunc(Number.parseInt(latestChange.newValue.split(' ')[0], 10));
    modelElement.height = Math.trunc(Number.parseInt(latestChange.newValue.split(' ')[1], 10));
    latestChange.object.width = modelElement.width;
    latestChange.object.height = modelElement.height;

    this.mService.updateElement(modelElement, this.selectedModel.id);
  }

  private handleNodeDeleted(txn) {
    txn.changes.toArray().filter(element => element.propertyName === 'parts').forEach(evt => {
      this.mService.deleteElement(this.selectedModel.id, evt.oldValue.data.element.id);
    });
  }

  private handleNodeTextEditing(txn) {
    const nodeData = txn.changes.iteratorBackwards.first().object;
    const modelElement: ModelElementDetail = nodeData.element;
    modelElement.label = nodeData.text;

    this.mService.updateElement(modelElement, this.selectedModel.id);
  }

  private handleNodeLinking(txn) {
    const change = txn.changes.toArray().find(element => element.propertyName === 'data');
    const link = this.myDiagram.findLinkForData(change.object.data);

    if (this.selectedConnectorMode === undefined || this.selectedConnectorMode.arrowStroke === undefined) {
      this.myDiagram.model.removeLinkData(link.data);
      return;
    }

    link.data.toArrow = this.selectedConnectorMode.toArrow || '';
    link.data.fromArrow = this.selectedConnectorMode.fromArrow || '';
    link.data.pathPattern = this.pathPatterns.get(this.selectedConnectorMode.arrowStroke);

    const fromElement = change.newValue.from;
    const toElement = change.newValue.to;

    this.mService.createConnection(
      this.selectedModel.id,
      UUID.UUID(),
      change.object.location.x,
      change.object.location.y,
      fromElement,
      toElement,
      this.selectedConnectorMode.id.split('#')[1],
      this.selectedInstantiationType
    ).then(response => {
      link.data.element = response;
    });

    this.myDiagram.rebuildParts();
  }

  private handleNodeMove(txn) {
    const lastMovedNodes = new Map();

    txn.changes.toArray()
      .filter(evt => ['location', 'position'].includes(evt.propertyName))
      .forEach(evt => {

      const nodeData = evt.object;

      const modelElement: ModelElementDetail = nodeData.data.element;
        modelElement.x = Math.trunc(nodeData.location.x);
        modelElement.y = Math.trunc(nodeData.location.y);
      nodeData.data.loc = new go.Point(modelElement.x, modelElement.y);

      lastMovedNodes.set(
        modelElement.id,
        {
          modelElementDetail: modelElement,
          node: nodeData.data
        }
      );
    });

    lastMovedNodes.forEach(nodeInfo => {
      if (nodeInfo.modelElementDetail.modelElementType === 'ModelingElement' || nodeInfo.modelElementDetail.modelElementType === 'ModelingContainer') {
        this.updateContainerInformationIfNeeded(nodeInfo);
        this.mService.updateElement(nodeInfo.modelElementDetail, this.selectedModel.id);
      }
    });

    this.myDiagram.rebuildParts();
  }

  private updateContainerInformationIfNeeded(nodeInfo) {
    const initialContainerKey = nodeInfo.node.group;

    // check if element has been moved inside any of the containers and update those
    const overlappedContainers: ModelElementDetail[] = [];

    this.myDiagram.model.nodeDataArray.forEach(containerNode => {
      if (
        containerNode.element.modelElementType === 'ModelingContainer' &&
        nodeInfo.modelElementDetail.id != containerNode.element.id &&
        this.isNodeInContainer(containerNode, nodeInfo.modelElementDetail)
      ) {
        overlappedContainers.push(containerNode.element);
      }
    });

    let mostSpecificContainer: ModelElementDetail;
    overlappedContainers.forEach(value => {
      if (mostSpecificContainer === undefined) {
        mostSpecificContainer = value;
      }
      if (mostSpecificContainer.containedShapes !== undefined && mostSpecificContainer.containedShapes.includes(value.modelingLanguageConstructInstance)) {
        mostSpecificContainer = value;
      }
    });

    if (initialContainerKey !== undefined &&
      ((mostSpecificContainer !== undefined && initialContainerKey !== mostSpecificContainer.id) || // moved to another container
        (mostSpecificContainer === undefined)) // moved out of the container into the open space
    ) {
      this.removeElementFromContainer(nodeInfo.node.group, nodeInfo.modelElementDetail.modelingLanguageConstructInstance);
      delete nodeInfo.node.group;
    }

    if (mostSpecificContainer !== undefined) {
      nodeInfo.node.group = mostSpecificContainer.id;
      const containedShapes = mostSpecificContainer.containedShapes || [];
      if (!containedShapes.includes(nodeInfo.modelElementDetail.modelingLanguageConstructInstance)) {
        containedShapes.push(nodeInfo.modelElementDetail.modelingLanguageConstructInstance);
        mostSpecificContainer.containedShapes = containedShapes;
        this.mService.updateElement(mostSpecificContainer, this.selectedModel.id);
      }
    }
  }

  private removeElementFromContainer(groupKey, elementKey) {
    const containerNode = this.myDiagram.model.findNodeDataForKey(groupKey);
    _.remove(containerNode.element.containedShapes, s => s === elementKey);
    this.mService.updateElement(containerNode.element, this.selectedModel.id);
  }

  private isNodeInContainer(containerNode, node) {
    return containerNode.element.x < node.x &&
      containerNode.element.x + containerNode.element.width > node.x + node.width &&
      containerNode.element.y < node.y &&
      containerNode.element.y + containerNode.element.height > node.y + node.height;
  }

  selectionChanged() {

    if (this.myDiagram === undefined) {
      this.initDiagramCanvas();
    }

    if (this.selectedModel !== undefined) {
      if (this.selectedModel.goJsModel !== undefined) {
        this.myDiagram.model = new go.GraphLinksModel(this.selectedModel.goJsModel.nodeDataArray, this.selectedModel.goJsModel.linkDataArray);
      } else {
        this.myDiagram.model = new go.GraphLinksModel();
        this.selectedModel.goJsModel = this.myDiagram.model;
      }
    }
  }

  openModelEditModel() {
    const dialogRef = this.dialog.open(ModalModelEdit, {
      data: this.selectedModel
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedModel.label = result.label;
        this.models = [...this.models];
      }
    });
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

    this.myDiagram.startTransaction('Add State');

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
    const model = this.myDiagram.model;
    model.addNodeData(toData);

    const newnode = this.myDiagram.findNodeForData(toData);
    this.myDiagram.select(newnode);

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

      this.myDiagram.commitTransaction('Add State');
    });
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

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

  showSmallPorts(node, show) {
    node.ports.each(function(port) {
      if (port.portId !== '') {  // don't change the default port, which is the big shape
        port.fill = show ? 'rgba(0,0,0,.3)' : null;
      }
    });
  }

  deleteModel() {
    if (this.selectedModel !== undefined) {
      this.mService.deleteModel(this.selectedModel.id).then(response => {
        this.selectedModel = undefined;
        this.prepareModels();
        this.myDiagram.model.nodeDataArray = [];
        this.myDiagram.model.linkDataArray = [];
      });
    }
  }

  private prepareStrokeDemoModel() {
    const arrowheads = go.Shape.getArrowheadGeometries().toKeySet().toArray();
    if (arrowheads.length % 2 === 1) { arrowheads.push(''); }

    const linkdata = [];
    const nodedata = [];
    const i = 0;
    for (let j = 0; j < this.pathPatterns.size; j++) {
      nodedata.push({
        key: (j + 1),
        text: Array.from(this.pathPatterns.keys())[j],
        fill: '#0000',
        source: '../assets/images/Category_Activities4BPMNProcessModelingView/Task.png',
        size: new go.Size(300, 50),
        width: 300,
        height: 50,
        alignment: go.Spot.Bottom,
        loc: new go.Point(0, j * 50)
      });
      nodedata.push({
        key: -(j + 1),
        text: Array.from(this.pathPatterns.keys())[j],
        fill: '#0000',
        source: '../assets/images/Category_Activities4BPMNProcessModelingView/Task.png',
        size: new go.Size(300, 50),
        width: 300,
        height: 50,
        alignment: go.Spot.Bottom,
        loc: new go.Point(500, j * 50)
      });
      linkdata.push({
        from: j + 1,
        to: -(j + 1),
        fromArrow: '',
        toArrow: arrowheads[0],
        pathPattern: Array.from(this.pathPatterns.values())[j]
      });
    }

    this.myDiagram.model =
      $(go.GraphLinksModel,
        { // this gets copied automatically when there's a link data reference to a new node key
          // and is then added to the nodeDataArray
          archetypeNodeData: {},
          // the node array starts with just the special Center node
          nodeDataArray: nodedata,
          // the link array was created above
          linkDataArray: linkdata
        });
  }

  private prepareArrowsHeadDemoModel() {
    const arrowheads = go.Shape.getArrowheadGeometries().toKeySet().toArray();
    if (arrowheads.length % 2 === 1) { arrowheads.push(''); }

    const linkdata = [];
    const nodedata = [];
    const i = 0;
    for (let j = 0; j < arrowheads.length; j = j + 2) {
      nodedata.push({
        key: j,
        text: arrowheads[j],
        fill: '#0000',
        source: '../assets/images/Category_Activities4BPMNProcessModelingView/Task.png',
        size: new go.Size(300, 50),
        width: 300,
        height: 50,
        alignment: go.Spot.Bottom,
        loc: new go.Point(0, j * 50)
      });
      nodedata.push({
        key: j + 1,
        text: arrowheads[j + 1],
        fill: '#0000',
        source: '../assets/images/Category_Activities4BPMNProcessModelingView/Task.png',
        size: new go.Size(300, 50),
        width: 300,
        height: 50,
        alignment: go.Spot.Bottom,
        loc: new go.Point(500, j * 50)
      });
      linkdata.push({
        from: j,
        to: j + 1,
        fromArrow: arrowheads[j],
        toArrow: arrowheads[j + 1],
        pathPattern: this.pathPatterns.get('Single')
      });
    }

    this.myDiagram.model =
      $(go.GraphLinksModel,
        { // this gets copied automatically when there's a link data reference to a new node key
          // and is then added to the nodeDataArray
          archetypeNodeData: {},
          // the node array starts with just the special Center node
          nodeDataArray: nodedata,
          // the link array was created above
          linkDataArray: linkdata
        });
  }

  // processImageUpload(imageInput: any, type: string) {
  //   const file: File = imageInput.files[0];
  //   const reader = new FileReader();
  //
  //   reader.addEventListener('load', async (event: any) => {
  //
  //     this.selectedFile = file;
  //     let filename = file.name;
  //     if (type === 'thumbnail') {
  //       filename = 'Thumbnail_' + file.name;
  //     }
  //
  //     const currentPalletteCategory = this.mService.selectedModelingLanguage.substring(3);
  //     await this.mService.uploadNewImageToBackend(file, filename, currentPalletteCategory);
  //
  //     this.canvasTextBoxText = 'Uploaded ' + type + ' image ' + filename + ' to ' + currentPalletteCategory;
  //   });
  //   reader.readAsDataURL(file);
  // }

  getInstantiationTypes(): InstantiationTargetType[] {
    return _.values(InstantiationTargetType);
  }


  private setQueryParams() {
    this.activatedRoute.queryParams
      .pipe(take(1))
      .subscribe(params => {
        if (params.id && this.models.length > 0) {
          const paramsModel = this.models.find(m => m.id === params.id);
          if (paramsModel) {
            this.selectedModel = paramsModel;
            this.selectionChanged();
          }
        }
        console.log(this.selectedModel);
        }
      );
  }
}
// https://github.com/shlomiassaf/ngx-modialog
