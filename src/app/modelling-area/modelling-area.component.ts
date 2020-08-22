import {Component, HostListener, Input, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import * as go from 'gojs';
import {ChangedEvent, GraphObject, InputEvent, Key, Point} from 'gojs';
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
  public modelSelectionDropdownConfig = {
    displayKey: 'label'
  };

  private selectedConnectorMode: PaletteElementModel;

  public diagramDetailsToDisplay: DiagramDetail;

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
  }

  private prepareModels() {
    this.mService.getModels().then(models => {
      this.models = models;

      this.models.forEach(model => {

        model.goJsModel = new go.GraphLinksModel();

        this.mService.getDiagrams(model.id).then(value => {
          model.diagrams = value;
          model.diagrams.forEach(diagram => {

            if (diagram.modelElementType === 'ModelingRelation') {

              let linkData = {
                key: diagram.id,
                element: diagram,
                text: diagram.label,
                from: diagram.modelElementAttributes.find(value => value.relation == 'modelingRelationHasSourceModelingElement').value,
                to: diagram.modelElementAttributes.find(value => value.relation == 'modelingRelationHasTargetModelingElement').value,
                fromArrow: diagram.fromArrow,
                toArrow: diagram.toArrow
              }

              model.goJsModel.addLinkData(linkData);

            } else {

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
                click: (e: InputEvent, obj: GraphObject) => {
                  if (obj.part.data.element != undefined) {
                    this.diagramDetailsToDisplay = obj.part.data.element;
                  }
                }
              };

              model.goJsModel.addNodeData(nodeData);
            }

          });
        });
      });

    });
  }

  /*getPalletteElements(): void {
      this.palletteElement_Observable = this.mService.queryPaletteElements();
      this.palletteElement_Observable.subscribe(palletteElement => {
        this.palletteElements = palletteElement;
        console.log('Inside getPalletteElements');
        console.log(this.palletteElements);
      });
    }*/

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
          // the first element is assumed to be main element: as if isPanelMain were true
          { stroke: "gray", strokeWidth: 2 }),
        $(go.Shape,  // the "from" arrowhead
          new go.Binding("fromArrow", "fromArrow"),
          { scale: 2, fill: "#FDE70E" }),
        $(go.Shape,  // the "to" arrowhead
          new go.Binding("toArrow", "toArrow"),
          { scale: 2, fill: "#FDE70E" }),
        $(go.TextBlock,
          {
            font: "11pt Helvetica, Arial, sans-serif",
            margin: 8,
            maxSize: new go.Size(200, NaN),
            wrap: go.TextBlock.WrapFit,
            editable: true,
            alignment: go.Spot.Bottom //or go.Spot.Bottom
          },
          new go.Binding("text").makeTwoWay()
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
        new go.Binding("click", "click"),
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
          )
        )
    );

    this.myDiagram.layout = new go.Layout();

    this.myDiagram.addModelChangedListener((evt: ChangedEvent) => {
      // ignore unimportant Transaction events
      if (!evt.isTransactionFinished) return;
      var txn = evt.object;  // a Transaction
      if (txn === null) return;

      if (txn.name === 'Move') {
        let lastMovedNodes = new Map();

        txn.changes.toArray().forEach(evt => {

          let nodeData = evt.object;

          let diagramDetail: DiagramDetail = nodeData.data.element;
          diagramDetail.x = toInteger(nodeData.location.x);
          diagramDetail.y = toInteger(nodeData.location.y);

          lastMovedNodes.set(diagramDetail.id, diagramDetail);
        });

        lastMovedNodes.forEach(diagramDetail => {
          this.mService.updateDiagram(diagramDetail, this.selectedModel.id);
        });
      }

      if (txn.name === 'TextEditing') {
        let nodeData = txn.changes.iteratorBackwards.first().object;
        let diagramDetail: DiagramDetail = nodeData.element;
        diagramDetail.label = nodeData.text;

        this.mService.updateDiagram(diagramDetail, this.selectedModel.id);
      }

      if (txn.name === 'Delete') {
        txn.changes.toArray().filter(element => element.propertyName === 'parts').forEach(evt => {
          // TODO: with this change, we can even omit trying to find out the connected diagrams in the backend
          this.mService.deleteDiagram(this.selectedModel.id, evt.oldValue.data.element.id);
        });
      }

      if (txn.name === 'Linking') {
        let change = txn.changes.toArray().find(element => element.propertyName === 'data');
        let link = this.myDiagram.findLinkForData(change.object.data);
        link.data.toArrow = this.selectedConnectorMode.toArrow;
        link.data.fromArrow = this.selectedConnectorMode.fromArrow;

        //this.myDiagram.rebuildParts();

        if (this.selectedConnectorMode === undefined) {
          // TODO: cancel link
        }

        let fromElement = change.newValue.from;
        let toElement = change.newValue.to;

        this.mService.createConnection(
          this.selectedModel.id,
          UUID.UUID(),
          change.object.location.x,
          change.object.location.y,
          fromElement,
          toElement,
          this.selectedConnectorMode.id.split('#')[1]
        ).then(response => {
          link.data.element = response;
        });

        this.myDiagram.rebuildParts();

      }
    });
  }

  selectionChanged($event: any) {

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

    var toData = {};
    if (element.paletteCategory === VariablesSettings.paletteCatogorySwimlanesURI) {
      console.log('inside swimlane');
      toData = {
        text: element.label,
        key: element.shape,
        fill: "#0000",
        source: imageURL,
        size: new go.Size(element.width, element.height),
        width: element.width,
        height: element.height,
        angle: 0,
        alignment: go.Spot.Left,
        element: element
      };
    }
    else
       toData = {
        text: element.label,
         key: elementKey,
         fill: "#0000",
         source: imageURL,
         size: new go.Size(element.width, element.height),
         width: element.width,
         height: element.height,
         alignment: go.Spot.Bottom,
         click: (e: InputEvent, obj: GraphObject) => {
           if (obj.part.data.element != undefined) {
             this.diagramDetailsToDisplay = obj.part.data.element;
           }
         }
      };

    // add the new node data to the model
    var model = this.myDiagram.model;
    model.addNodeData(toData);

    let newnode = this.myDiagram.findNodeForData(toData);
    this.myDiagram.select(newnode);

    this.myDiagram.commitTransaction("Add State");

    this.mService.createDiagram(
      this.selectedModel.id,
      elementKey,
      newnode.part.data.text,
      newnode.location.x,
      newnode.location.y,
      element.id.split('#')[1]
    ).then(response => {
      newnode.part.data.element = response;
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

  closeDetails() {
    this.diagramDetailsToDisplay = undefined;
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
}
// https://github.com/shlomiassaf/ngx-modialog
