import {Component, HostListener, Input, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import * as go from 'gojs';
import {ChangedEvent} from 'gojs';
import {PaletteElementModel} from '../_models/PaletteElement.model';
import {VariablesSettings} from '../_settings/variables.settings';
import {ModellerService} from '../modeller.service';
import {ContextMenuComponent} from 'ngx-contextmenu';
import {Model} from '../_models/Model.model';
import {ModalModelCreation} from '../modal-model-creation/modal-model-creation.component';
import {MatDialog} from '@angular/material/dialog';
import {DiagramDetail} from '../_models/DiagramDetail.model';
import {UUID} from 'angular2-uuid';
import {toInteger} from '@ng-bootstrap/ng-bootstrap/util/util';
import * as _ from 'lodash';
import {InstantiationTargetType} from '../_models/InstantiationTargetType.model';
import {ModalViewDiagramDetail} from '../diagram-detail/modal-diagram-detail.component';
import {DiagramDetailAndModel} from '../_models/DiagramDetailAndModel';
import {ModalModelLink} from '../modal-model-link/modal-model-link';
import {ModalDiagramNote} from '../modal-diagram-note/modal-diagram-note';
import {
  ModalModellingLanguageConstructInstanceLink,
  VisualisationLinksData
} from '../modal-modelling-language-construct-instance-link/modal-modelling-language-construct-instance-link';
import {getQueryValue} from '@angular/core/src/view/query';

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

  @ViewChild(ContextMenuComponent) public elementRightClickMenu: ContextMenuComponent;
  @ViewChild(ContextMenuComponent) public paletteRightClickMenu: ContextMenuComponent;

  @Input() contextMenu: ContextMenuComponent;
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
  private connectorModeOn: boolean = false;
  private connectorId;
  //private palletteElement_Observable: Observable<PaletteElementModel[]>;
  private palletteElements: any;

  public models: Model[] = [];
  public selectedModel: Model;
  public selectedConnectorMode: PaletteElementModel;
  private pathPatterns: Map<string, string> = new Map();
  private dialog: MatDialog;

  public constructor(private mService: ModellerService, public matDialog: MatDialog) {
    console.log('Constructor of graph');
    (go as any).licenseKey = "54ff43e7b11c28c702d95d76423d38f919a52e63998449a35a0412f6be086d1d239cef7157d78cc687f84cfb487fc2898fc1697d964f073cb539d08942e786aab63770b3400c40dea71136c5ceaa2ea1fa2b24a5c5b775a2dc718cf3bea1c59808eff4d54fcd5cb92b280735562bac49e7fc8973f950cf4e6b3d9ba3fffbbf4faf3c7184ccb4569aff5a70deb6f2a3417f";
    //this.mService.queryPaletteCategories();
    //this.mService.queryPaletteElements();

    this.dialog = matDialog;
  }

  ngOnInit(): void {
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

  private static convertGeometryToShape(geometry: string) {

    if (!geometry) return null;

    return $(go.Shape,
      {
        geometryString: geometry,
        fill: "transparent",
        stroke: "black",
        strokeWidth: 1.5,
        strokeCap: "round"
      }
    );
  }

  private prepareModels() {
    this.mService.getModels().then(models => {
      this.models = models;

      this.models.forEach(model => {
        model.goJsModel = new go.GraphLinksModel();

        this.mService.getDiagrams(model.id).then(value => {
          this.prepareDiagrams(model, value);
        });
      });

    });
  }
  private prepareDiagrams(model: Model, value: DiagramDetail[]) {
    model.diagrams = value;
    model.diagrams.forEach(diagram => {

      if (diagram.modelElementType === 'ModelingRelation') {

        let linkData = {
          key: diagram.id,
          element: diagram,
          text: diagram.label,
          fromArrow: diagram.fromArrow || '',
          toArrow: diagram.toArrow || '',
          from: this.findDiagramById(model.diagrams, diagram.fromDiagram),
          to: this.findDiagramById(model.diagrams, diagram.toDiagram),
          pathPattern: this.pathPatterns.get(diagram.arrowStroke),
          diagramRepresentsModel: diagram.diagramRepresentsModel,
          otherVisualisationsOfSameLanguageConstruct: diagram.otherVisualisationsOfSameLanguageConstruct
        };

        if (diagram.fromArrow !== undefined) {
          linkData.fromArrow = diagram.fromArrow;
        }

        if (diagram.toArrow !== undefined) {
          linkData.toArrow = diagram.toArrow;
        }

        model.goJsModel.addLinkData(linkData);

      } else if (diagram.modelElementType === 'ModelingElement') {

        let nodeData = {
          text: diagram.label,
          key: diagram.id,
          fill: '#0000',
          source: VariablesSettings.IMG_ROOT + diagram.imageUrl,
          size: new go.Size(diagram.width, diagram.height),
          width: diagram.width,
          height: diagram.height,
          alignment: go.Spot.Bottom,
          loc: new go.Point(diagram.x, diagram.y),
          element: diagram,
          diagramRepresentsModel: diagram.diagramRepresentsModel,
          otherVisualisationsOfSameLanguageConstruct: diagram.otherVisualisationsOfSameLanguageConstruct
        };

        model.goJsModel.addNodeData(nodeData);
      } else if (diagram.modelElementType === 'ModelingContainer') {

        let nodeData = {
          text: diagram.label,
          key: diagram.id,
          fill: '#0000',
          source: VariablesSettings.IMG_ROOT + diagram.imageUrl,
          size: new go.Size(diagram.width, diagram.height),
          width: diagram.width,
          height: diagram.height,
          alignment: go.Spot.Bottom,
          loc: new go.Point(diagram.x, diagram.y),
          element: diagram,
          diagramRepresentsModel: diagram.diagramRepresentsModel,
          otherVisualisationsOfSameLanguageConstruct: diagram.otherVisualisationsOfSameLanguageConstruct,
          isGroup: true
        };

        model.goJsModel.addNodeData(nodeData);
      }

    });

    model.diagrams.forEach(diagram => {
      if (diagram.modelElementType === 'ModelingContainer') {
        let containedElements = diagram.containedDiagrams || [];
        containedElements.forEach(element => {
          var data = model.goJsModel.nodeDataArray.find(nodeData => nodeData.element.modelingLanguageConstructInstance === element);
          if (data == null) {
            data = model.goJsModel.linkDataArray.find(nodeData => nodeData.element.modelingLanguageConstructInstance === element);
          }
          if (data != null) {
            data.group = diagram.id;
          }
        });
      }

    });
  }

  private findDiagramById(diagrams: DiagramDetail[], diagramId: string) {

    let diagramDetail = diagrams.find(diag => diag.modelingLanguageConstructInstance === diagramId);
    if (diagramDetail !== undefined) {
      return diagramDetail.id;
    }

    return undefined;
  }

  /*getPalletteElements(): void {
        this.palletteElement_Observable = this.mService.queryPaletteElements();
        this.palletteElement_Observable.subscribe(palletteElement => {
          this.palletteElements = palletteElement;
          console.log('Inside getPalletteElements');
          console.log(this.palletteElements);
        });
      }*/
  selectedInstantiationType: InstantiationTargetType = InstantiationTargetType.INSTANCE;

  initDiagramCanvas() {

    $ = go.GraphObject.make;

    this.myDiagram =
      $(go.Diagram, "myDiagramDiv",
        {
          initialContentAlignment: go.Spot.Left,
          "undoManager.isEnabled": true, // enable Ctrl-Z to undo and Ctrl-Y to redo
          allowDrop: true,
          "draggingTool.dragsLink": false,
          "draggingTool.isGridSnapEnabled": true,
          "linkingTool.isUnconnectedLinkValid": false,
          "linkingTool.portGravity": 20,
          "relinkingTool.isUnconnectedLinkValid": false,
          "relinkingTool.portGravity": 20,
          "relinkingTool.fromHandleArchetype":
            $(go.Shape, "Diamond", { segmentIndex: 0, cursor: "pointer", desiredSize: new go.Size(8, 8), fill: "tomato", stroke: "darkred" }),
          "relinkingTool.toHandleArchetype":
            $(go.Shape, "Diamond", { segmentIndex: -1, cursor: "pointer", desiredSize: new go.Size(8, 8), fill: "darkred", stroke: "tomato" }),
          "linkReshapingTool.handleArchetype":
            $(go.Shape, "Diamond", { desiredSize: new go.Size(7, 7), fill: "lightblue", stroke: "deepskyblue" })
        }, // center Diagram contents
      );

    /*cxElement = document.getElementById("contextMenu");

    myContextMenu = $(go.HTMLInfo, {
      show: this.showContextMenu,
      mainElement: cxElement
    });*/

    const nodeSelectionAdornmentTemplate =
      $(go.Adornment, "Auto",
        $(go.Shape, { fill: null, stroke: "deepskyblue", strokeWidth: 1.5, strokeDashArray: [4, 2] }),
        $(go.Placeholder)
      );

    this.myDiagram.linkTemplate =
      $(go.Link,  // the whole link panel
        $(go.Shape,  // the link shape
        {
          stroke: "transparent",
          strokeWidth: 3
        },
          new go.Binding("pathPattern", "pathPattern", ModellingAreaComponent.convertGeometryToShape)
        ),
        $(go.Shape,  // the "from" arrowhead
          new go.Binding("fromArrow", "fromArrow"),
          { scale: 2 }),
        $(go.Shape,  // the "to" arrowhead
          new go.Binding("toArrow", "toArrow"),
          { scale: 2 }),
        $(go.TextBlock, "left",
          {
            font: "11pt Helvetica, Arial, sans-serif",
            margin: 8,
            maxSize: new go.Size(200, NaN),
            wrap: go.TextBlock.WrapFit,
            editable: true,
            segmentOffset: new go.Point(0, -10),
            alignment: go.Spot.Left //or go.Spot.Bottom
          },
          new go.Binding("text").makeTwoWay()
        ),
        $(go.Shape,
          {
            alignment: go.Spot.TopLeft,
            alignmentFocus: go.Spot.TopLeft,
            width: 12, height: 12, fill: "orange",
            visible: false,
            figure: "Arrow"
          },
          new go.Binding("visible", "diagramRepresentsModel", convertFieldExistenceToLinkVisibility)
        )
      );

    this.myDiagram.nodeTemplate =
      $(go.Node, "Auto", //this resizes the entire shape
        {
          name: "Node",
          locationSpot: go.Spot.Left,
          resizable: true,
          resizeObjectName: "PANEL" // Changing this to Picture resizes the images, however links are a problem
        },
        new go.Binding("location", "loc"),
        new go.Binding("group", "containedInContainer"),
        { selectable: true, selectionAdornmentTemplate: nodeSelectionAdornmentTemplate },
        new go.Binding("angle").makeTwoWay(),
        // the main object is a Panel that surrounds a TextBlock with a Shape

        $(go.Panel, "Auto",
          {
            name: "PANEL",
            angle:0
          },
          new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
          new go.Binding("angle"),
          $(go.Shape, "Rectangle",  // default figure
            {
              name: "SHAPE",
              portId: "", // the default port: if no spot on link data, use closest side
              fromLinkable: true, toLinkable: true, cursor: "pointer",
              fill: "#000000",  // default color
              //width: 835, height: 575,
              strokeWidth: 0
            },
            new go.Binding("fill")),
            new go.Binding("width"),
            new go.Binding("height"),
          $(go.Picture,
            {
              name: 'Picture',
              source: "/assets/images/BPMN-CMMN/Collapsed_Subprocess.png",
              margin: 12, //increase margin if text alignment is changed to bottom
              stretch: go.GraphObject.Fill //stretch image to fill whole area of shape
              //imageStretch: go.GraphObject.Fill //do not distort the image
            },
            new go.Binding("source"),
            new go.Binding("desiredSize")),
          $(go.TextBlock,
            {
              font: "11pt Helvetica, Arial, sans-serif",
              margin: 8,
              maxSize: new go.Size(200, NaN),
              wrap: go.TextBlock.WrapFit,
              editable: true,
              alignment: go.Spot.Bottom //or go.Spot.Bottom
            },
            new go.Binding("text").makeTwoWay(),
            new go.Binding("alignment")
          ),
          $(go.Shape,
            {
              alignment: go.Spot.TopLeft,
              alignmentFocus: go.Spot.TopLeft,
              width: 12, height: 12, fill: "orange",
              visible: false,
              figure: "Arrow"
            },
            new go.Binding("visible", "diagramRepresentsModel", convertFieldExistenceToLinkVisibility)
          ),
          $(go.Shape,
            {
              alignment: go.Spot.BottomLeft,
              alignmentFocus: go.Spot.BottomLeft,
              width: 12, height: 12, fill: "orange",
              visible: false,
              figure: "MultiDocument"
            },
            new go.Binding("visible", "otherVisualisationsOfSameLanguageConstruct", convertFieldExistenceToLinkVisibility)
          )
        )
    );

    function convertFieldExistenceToLinkVisibility (obj) {
      return obj != undefined;
    }

    this.myDiagram.groupTemplate =
      $(go.Group, "Auto",
        {
          name: "GROUP",
          angle:0,
          resizable: true,
          resizeObjectName: "PANEL"
        },
        new go.Binding("location", "loc"),
        new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
        new go.Binding("angle"),
        $(go.Shape, "Rectangle",  // default figure
          {
            name: "SHAPE",
            portId: "", // the default port: if no spot on link data, use closest side
            fromLinkable: true, toLinkable: true, cursor: "pointer",
            fill: "#000000",  // default color
            //width: 835, height: 575,
            strokeWidth: 0
          },
          new go.Binding("fill")),
        new go.Binding("width"),
        new go.Binding("height"),
        $(go.Picture,
          {
            name: 'Picture',
            source: "/assets/images/BPMN-CMMN/Collapsed_Subprocess.png",
            margin: 12, //increase margin if text alignment is changed to bottom
            stretch: go.GraphObject.Fill //stretch image to fill whole area of shape
            //imageStretch: go.GraphObject.Fill //do not distort the image
          },
          new go.Binding("source"),
          new go.Binding("desiredSize")),
        $(go.TextBlock,
          {
            font: "11pt Helvetica, Arial, sans-serif",
            margin: 8,
            maxSize: new go.Size(200, NaN),
            wrap: go.TextBlock.WrapFit,
            editable: true,
            alignment: go.Spot.Bottom //or go.Spot.Bottom
          },
          new go.Binding("text").makeTwoWay(),
          new go.Binding("alignment")
        ),
        $(go.Shape,
          {
            alignment: go.Spot.TopLeft,
            alignmentFocus: go.Spot.TopLeft,
            width: 12, height: 12, fill: "orange",
            visible: false,
            figure: "Arrow"
          },
          new go.Binding("visible", "diagramRepresentsModel", convertFieldExistenceToLinkVisibility)
        ),
        $(go.Shape,
          {
            alignment: go.Spot.BottomLeft,
            alignmentFocus: go.Spot.BottomLeft,
            width: 12, height: 12, fill: "orange",
            visible: false,
            figure: "MultiDocument"
          },
          new go.Binding("visible", "otherVisualisationsOfSameLanguageConstruct", convertFieldExistenceToLinkVisibility)
        )
      );

    this.myDiagram.nodeTemplate.contextMenu =
      $("ContextMenu",
        $("ContextMenuButton",
          $(go.TextBlock, "Details"),
          {
            click: (e, obj) => {
              let node = obj.part.adornedPart;
              if (node != null) {
                let element = node.data.element;

                let diagramDetailAndModel = new DiagramDetailAndModel();
                diagramDetailAndModel.modelId = this.selectedModel.id;
                diagramDetailAndModel.diagramDetail = element;

                this.dialog.open(ModalViewDiagramDetail, {
                  data: diagramDetailAndModel
                });
              }
            }
          }
        ),
        $("ContextMenuButton",
          $(go.TextBlock, "Model Link"),
          {
            click: (e, obj) => {
              let node = obj.part.adornedPart;
              if (node != null) {
                let element = node.data.element;

                let diagramDetailAndModel = new DiagramDetailAndModel();
                diagramDetailAndModel.modelId = this.selectedModel.id;
                diagramDetailAndModel.diagramDetail = element;

                let dialogRef = this.dialog.open(ModalModelLink, {
                  data: diagramDetailAndModel
                });

                dialogRef.afterClosed().subscribe(result => {

                  if (result === undefined) return;

                  if (result.action === 'Delete') {
                    delete element.diagramRepresentsModel;
                    this.mService.updateDiagram(element, this.selectedModel.id);
                  } else if (result.action === 'Save') {
                    element.diagramRepresentsModel = result.selectedModelId;
                    this.myDiagram.model.setDataProperty(node.data, 'element', element);
                    this.myDiagram.model.setDataProperty(node.data, 'diagramRepresentsModel', element.diagramRepresentsModel);
                    this.mService.updateDiagram(element, this.selectedModel.id);
                  }

                  this.myDiagram.rebuildParts();
                });
              }
            }
          }
        ),
        $("ContextMenuButton",
          $(go.TextBlock, "Note"),
          {
            click: (e, obj) => {
              let node = obj.part.adornedPart;
              if (node != null) {
                let element = node.data.element;

                let diagramDetailAndModel = new DiagramDetailAndModel();
                diagramDetailAndModel.modelId = this.selectedModel.id;
                diagramDetailAndModel.diagramDetail = element;

                this.dialog.open(ModalDiagramNote, {
                  data: diagramDetailAndModel
                });
              }
            }
          }
        ),
        $("ContextMenuButton",
          $(go.TextBlock, "Visualisations of same element"),
          {
            click: (e, obj) => {
              let node = obj.part.adornedPart;
              if (node != null) {
                let element = node.data.element;

                let otherVisualisationsData = new VisualisationLinksData();
                otherVisualisationsData.modelingLanguageConstructInstanceId = element.modelingLanguageConstructInstance;
                otherVisualisationsData.otherVisualisations = [];

                if (element.otherVisualisationsOfSameLanguageConstruct !== undefined) {
                  this.models.forEach(model => {
                    let diagramDetail = model.diagrams.find(diagram => element.otherVisualisationsOfSameLanguageConstruct.includes(diagram.id));
                    if (diagramDetail !== undefined) {
                      let data = new DiagramDetailAndModel();
                      data.modelId = model.id;
                      data.diagramDetail = diagramDetail;
                      otherVisualisationsData.otherVisualisations.push(data);
                    }
                  });
                }

                let data = new DiagramDetailAndModel();
                data.modelId = this.selectedModel.id;
                data.diagramDetail = element;
                otherVisualisationsData.otherVisualisations.push(data);

                this.dialog.open(ModalModellingLanguageConstructInstanceLink, {
                  data: otherVisualisationsData
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
      if (!evt.isTransactionFinished) return;
      var txn = evt.object;  // a Transaction
      if (txn === null) return;

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
    let data = txn.changes.toArray().find(change => change.propertyName = 'nodeDataArray').newValue;
    let pastedNodeDataElement = data.element;

    let paletteConstructName = pastedNodeDataElement.paletteConstruct.split(":")[1];
    let key = paletteConstructName + '_Diagram_' + UUID.UUID();

    pastedNodeDataElement.id = key;
    this.myDiagram.model.setDataProperty(data, "key", key);

    this.mService.copyDiagram(
      pastedNodeDataElement,
      this.selectedModel.id
    ).then(response => {
      data.element = response;
    });

  }

  private handleNodeResizing(txn: any) {

    // resizing should only be affecting one element, we are not interested in the others
    let latestChange = _.last(txn.changes.toArray().filter(change => change.propertyName === 'size'));
    let diagramDetail = latestChange.object.element;
    diagramDetail.width = toInteger(latestChange.newValue.split(" ")[0]);
    diagramDetail.height = toInteger(latestChange.newValue.split(" ")[1]);
    latestChange.object.width = diagramDetail.width;
    latestChange.object.height = diagramDetail.height;

    this.mService.updateDiagram(diagramDetail, this.selectedModel.id);
  }

  private handleNodeDeleted(txn) {
    txn.changes.toArray().filter(element => element.propertyName === 'parts').forEach(evt => {
      // notify the container about the delete
      // TODO: this does not work if you also delete containers - fix - can be also done in the backend (cleanup of modeling element)
      /*
      if (evt.oldValue.data.group != undefined) {
        this.removeElementFromContainer(evt.oldValue.data.group, evt.oldValue.data.element.id);
      }
*/
      // TODO as goJs seems to detect deletions of attached sequence flows, we can simplify the queries in the backend
      this.mService.deleteDiagram(this.selectedModel.id, evt.oldValue.data.element.id);
    });
  }

  private handleNodeTextEditing(txn) {
    let nodeData = txn.changes.iteratorBackwards.first().object;
    let diagramDetail: DiagramDetail = nodeData.element;
    diagramDetail.label = nodeData.text;

    this.mService.updateDiagram(diagramDetail, this.selectedModel.id);
  }

  private handleNodeLinking(txn) {
    let change = txn.changes.toArray().find(element => element.propertyName === 'data');
    let link = this.myDiagram.findLinkForData(change.object.data);

    if (this.selectedConnectorMode === undefined || this.selectedConnectorMode.arrowStroke === undefined) {
      this.myDiagram.model.removeLinkData(link.data);
      return;
    }

    link.data.toArrow = this.selectedConnectorMode.toArrow || "";
    link.data.fromArrow = this.selectedConnectorMode.fromArrow || "";
    link.data.pathPattern = this.pathPatterns.get(this.selectedConnectorMode.arrowStroke);

    let fromElement = change.newValue.from;
    let toElement = change.newValue.to;

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
    let lastMovedNodes = new Map();

    txn.changes.toArray().forEach(evt => {

      let nodeData = evt.object;

      let diagramDetail: DiagramDetail = nodeData.data.element;
      diagramDetail.x = toInteger(nodeData.location.x);
      diagramDetail.y = toInteger(nodeData.location.y);

      lastMovedNodes.set(
        diagramDetail.id,
        {
          diagramDetail: diagramDetail,
          node: nodeData.data
        }
      );
    });

    lastMovedNodes.forEach(nodeInfo => {
      if (nodeInfo.diagramDetail.modelElementType === 'ModelingElement' || nodeInfo.diagramDetail.modelElementType === 'ModelingContainer') {
        this.updateContainerInformationIfNeeded(nodeInfo);
        this.mService.updateDiagram(nodeInfo.diagramDetail, this.selectedModel.id);
      }
    });

    this.myDiagram.rebuildParts();
  }

  private updateContainerInformationIfNeeded(nodeInfo) {
    let initialContainerKey = nodeInfo.node.group;

    // check if element has been moved inside any of the containers and update those
    let overlappedContainers: DiagramDetail[] = [];

    this.myDiagram.model.nodeDataArray.forEach(containerNode => {
      if (
        containerNode.element.modelElementType === 'ModelingContainer' &&
        nodeInfo.diagramDetail.id != containerNode.element.id &&
        this.isNodeInContainer(containerNode, nodeInfo.diagramDetail)
      ) {
        overlappedContainers.push(containerNode.element);
      }
    });

    let mostSpecificContainer: DiagramDetail = undefined;
    overlappedContainers.forEach(value => {
      if (mostSpecificContainer === undefined) {
        mostSpecificContainer = value;
      }
      if (mostSpecificContainer.containedDiagrams !== undefined && mostSpecificContainer.containedDiagrams.includes(value.modelingLanguageConstructInstance)) {
        mostSpecificContainer = value;
      }
    });

    if (initialContainerKey !== undefined &&
      ((mostSpecificContainer !== undefined && initialContainerKey !== mostSpecificContainer.id) || // moved to another container
        (mostSpecificContainer === undefined)) // moved out of the container into the open space
    ) {
      this.removeElementFromContainer(nodeInfo.node.group, nodeInfo.diagramDetail.modelingLanguageConstructInstance);
      delete nodeInfo.node.group;
    }

    if (mostSpecificContainer !== undefined) {
      nodeInfo.node.group = mostSpecificContainer.id;
      let containedDiagrams = mostSpecificContainer.containedDiagrams || [];
      if (!containedDiagrams.includes(nodeInfo.diagramDetail.modelingLanguageConstructInstance)) {
        containedDiagrams.push(nodeInfo.diagramDetail.modelingLanguageConstructInstance);
        mostSpecificContainer.containedDiagrams = containedDiagrams;
        this.mService.updateDiagram(mostSpecificContainer, this.selectedModel.id);
      }
    }
  }

  private removeElementFromContainer(groupKey, elementKey) {
    let containerNode = this.myDiagram.model.findNodeDataForKey(groupKey);
    _.remove(containerNode.element.containedDiagrams, s => s === elementKey);
    this.mService.updateDiagram(containerNode.element, this.selectedModel.id);
  }

  private isNodeInContainer(containerNode, diagram) {
    return containerNode.element.x < diagram.x &&
      containerNode.element.x + containerNode.element.width > diagram.x + diagram.width &&
      containerNode.element.y < diagram.y &&
      containerNode.element.y + containerNode.element.height > diagram.y + diagram.height;
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

  openModelCreationModel() {
    let dialogRef = this.dialog.open(ModalModelCreation, {
      data: new Model()
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.mService.createModel(result)
          .then(model => {
            this.models = [...this.models, model];
          });
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
    console.log('icon url is: ' + VariablesSettings.IMG_ROOT + (element.paletteCategory).split("#")[1] + "/" + element.imageURL);
    var imageURL = VariablesSettings.IMG_ROOT + (element.paletteCategory).split("#")[1] + "/" + element.imageURL;

    console.log('shape: ' + element.shape + ' label: ' + element.label + 'bg color: ' + element.backgroundColor);

    var adornment = new $(go.Part);
    this.myDiagram.startTransaction("Add State");

    console.log('Palette category: ' + element.paletteCategory);

    let elementKey = element.id.split('#')[1] + '_Diagram_' + element.tempUuid;

    let toData = {
      text: element.label,
       key: elementKey,
       fill: "#0000",
       source: imageURL,
       size: new go.Size(element.width, element.height),
       width: element.width,
       height: element.height,
       alignment: go.Spot.Bottom,
       diagramRepresentsModel: undefined
    };

    // add the new node data to the model
    var model = this.myDiagram.model;
    model.addNodeData(toData);

    let newnode = this.myDiagram.findNodeForData(toData);
    this.myDiagram.select(newnode);

    this.mService.createDiagram(
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

      this.myDiagram.commitTransaction("Add State");
    });
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

  }

  makePort(name, spot, output, input) {
    // the port is basically just a small transparent square
    return $(go.Shape, "Circle",
      {
        fill: null,  // not seen, by default; set to a translucent gray by showSmallPorts, defined below
        stroke: null,
        desiredSize: new go.Size(7, 7),
        alignment: spot,  // align the port on the main Shape
        alignmentFocus: spot,  // just inside the Shape
        portId: name,  // declare this object to be a "port"
        fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
        fromLinkable: output, toLinkable: input,  // declare whether the user may draw links to/from here
        cursor: "pointer"  // show a different cursor to indicate potential link point
      });
  }

  showSmallPorts(node, show) {
    node.ports.each(function(port) {
      if (port.portId !== "") {  // don't change the default port, which is the big shape
        port.fill = show ? "rgba(0,0,0,.3)" : null;
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
    let arrowheads = go.Shape.getArrowheadGeometries().toKeySet().toArray();
    if (arrowheads.length % 2 === 1) arrowheads.push("");

    var linkdata = [];
    var nodedata = [];
    var i = 0;
    for (var j = 0; j < this.pathPatterns.size; j++) {
      nodedata.push({
        key: (j+1),
        text: Array.from(this.pathPatterns.keys())[j],
        fill: '#0000',
        source: "../assets/images/Category_Activities4BPMNProcessModelingView/Task.png",
        size: new go.Size(300, 50),
        width: 300,
        height: 50,
        alignment: go.Spot.Bottom,
        loc: new go.Point(0, j*50)
      });
      nodedata.push({
        key: -(j+1),
        text: Array.from(this.pathPatterns.keys())[j],
        fill: '#0000',
        source: "../assets/images/Category_Activities4BPMNProcessModelingView/Task.png",
        size: new go.Size(300, 50),
        width: 300,
        height: 50,
        alignment: go.Spot.Bottom,
        loc: new go.Point(500, j*50)
      });
      linkdata.push({
        from: j+1,
        to: -(j+1),
        fromArrow: "",
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
    let arrowheads = go.Shape.getArrowheadGeometries().toKeySet().toArray();
    if (arrowheads.length % 2 === 1) arrowheads.push("");

    var linkdata = [];
    var nodedata = [];
    var i = 0;
    for (var j = 0; j < arrowheads.length; j = j + 2) {
      nodedata.push({
        key: j,
        text: arrowheads[j],
        fill: '#0000',
        source: "../assets/images/Category_Activities4BPMNProcessModelingView/Task.png",
        size: new go.Size(300, 50),
        width: 300,
        height: 50,
        alignment: go.Spot.Bottom,
        loc: new go.Point(0, j*50)
      });
      nodedata.push({
        key: j+1,
        text: arrowheads[j+1],
        fill: '#0000',
        source: "../assets/images/Category_Activities4BPMNProcessModelingView/Task.png",
        size: new go.Size(300, 50),
        width: 300,
        height: 50,
        alignment: go.Spot.Bottom,
        loc: new go.Point(500, j*50)
      });
      linkdata.push({
        from: j,
        to: j+1,
        fromArrow: arrowheads[j],
        toArrow: arrowheads[j+1],
        pathPattern: this.pathPatterns.get("Single")
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

  getInstantiationTypes(): InstantiationTargetType[] {
    return _.values(InstantiationTargetType);
  }
}
// https://github.com/shlomiassaf/ngx-modialog
