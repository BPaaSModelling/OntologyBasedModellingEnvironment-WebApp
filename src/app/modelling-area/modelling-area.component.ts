import {Component, Input, OnInit, OnChanges, SimpleChanges, HostListener, ViewChild} from '@angular/core';
import { Observable } from 'rxjs/Rx';
import * as go from 'gojs';
import {PaletteElementModel} from '../_models/PaletteElement.model';
import {VariablesSettings} from '../_settings/variables.settings';
import {GraphicalElementModel} from '../_models/GraphicalElement.model';
import {ModellerService} from "../modeller.service";
import {ContextMenuComponent, ContextMenuService} from 'ngx-contextmenu';


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

  public constructor(private mService: ModellerService) {
    console.log('Constructor of graph');
    (go as any).licenseKey = "54ff43e7b11c28c702d95d76423d38f919a52e63998449a35a0412f6be086d1d239cef7157d78cc687f84cfb487fc2898fc1697d964f073cb539d08942e786aab63770b3400c40dea71136c5ceaa2ea1fa2b24a5c5b775a2dc718cf3bea1c59808eff4d54fcd5cb92b280735562bac49e7fc8973f950cf4e6b3d9ba3fffbbf4faf3c7184ccb4569aff5a70deb6f2a3417f";
    //this.mService.queryPaletteCategories();
    this.mService.queryPaletteElements();
  }

  /*getPalletteElements(): void {
    this.palletteElement_Observable = this.mService.queryPaletteElements();
    this.palletteElement_Observable.subscribe(palletteElement => {
      this.palletteElements = palletteElement;
      console.log('Inside getPalletteElements');
      console.log(this.palletteElements);
    });
  }*/

  ngOnInit() {

    $ = go.GraphObject.make;

    myDiagram =
      $(go.Diagram, "myDiagramDiv",
        {
          initialContentAlignment: go.Spot.Left,
          "undoManager.isEnabled": true, // enable Ctrl-Z to undo and Ctrl-Y to redo
          allowDrop: true,
          "draggingTool.dragsLink": true,
          "draggingTool.isGridSnapEnabled": true,
          "linkingTool.isUnconnectedLinkValid": true,
          "linkingTool.portGravity": 20,
          "relinkingTool.isUnconnectedLinkValid": true,
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

    myDiagram.nodeTemplate =
      $(go.Node, "Auto", //this resizes the entire shape
        {
          name: "Node",
          locationSpot: go.Spot.Left,
          resizable: true,
          resizeObjectName: "PANEL" // Changing this to Picture resizes the images, however links are a problem
        },
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
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
            //new go.Binding("figure","key"),
            new go.Binding("fill")),
            new go.Binding("width"),
            new go.Binding("height"),
          $(go.Picture,
            {
              name: 'Picture',
              source: "/assets/images/BPMN-CMMN/Collapsed_Subprocess.png",
              margin: 5, //increase margin if text alignment is changed to bottom
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
              alignment: go.Spot.Center //or go.Spot.Bottom
            },
            new go.Binding("text").makeTwoWay(),
            new go.Binding("alignment")
          )
        )
  );


    model = new go.GraphLinksModel();



  }

  ngOnChanges(changes: SimpleChanges) {
    this.printNewElement(changes.new_element.currentValue);
  }

  printNewElement(element: PaletteElementModel): void {

    if (element !== undefined) {
      console.log('category is: ' + element.paletteCategory);
      console.log(VariablesSettings.paletteCategoryConnectorsURI);
      if (element.paletteCategory === VariablesSettings.paletteCategoryConnectorsURI) {
        this.connectorModeOn = true;
        console.log('connector mode: ' + this.connectorModeOn);
        this.connectorId = element.uuid;

        myDiagram.model.addLinkData({ from: 1, to: 2 });
        //myDiagram.model = model;
        console.log("added link");
      }
      else {
        const elementId = element.uuid;
        const nodeId = '#' + elementId;
        console.log('icon url is: ' + "assets/images/BPMN-CMMN/" + element.imageURL);
        var imageURL = "assets/images/BPMN-CMMN/" + element.imageURL;

        console.log('shape: ' + element.shape + ' label: ' + element.label + 'bg color: ' + element.backgroundColor);

        var adornment = new $(go.Part);
        var diagram = myDiagram;
        diagram.startTransaction("Add State");

        console.log('Palette category: ' + element.paletteCategory);

        var toData = {};
        if (element.paletteCategory === VariablesSettings.paletteCatogorySwimlanesURI) {
          console.log('inside swimlane');
          toData = {
            text: element.label, key: element.shape, fill: "#0000",
            source: imageURL, size: new go.Size(element.width, element.height),
            width: element.width, height: element.height, angle: 0, alignment: go.Spot.Left
          };
        }
        else
           toData = {text: element.label, key: element.shape, fill: "#0000", source: imageURL, size: new go.Size(element.width, element.height), width: element.width, height: element.height};

        // add the new node data to the model
        var model = diagram.model;
        model.addNodeData(toData);

        var newnode = diagram.findNodeForData(toData);
        diagram.select(newnode);

        diagram.commitTransaction("Add State");
      }
    }
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    console.log('OnClick Event');

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
}
// https://github.com/shlomiassaf/ngx-modialog
