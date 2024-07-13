import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {Edge, Node } from 'reactflow';

@Component({
  selector: 'app-palette-area-bpmn',
  templateUrl: './palette-area-bpmn.component.html',
  styleUrls: ['./palette-area-bpmn.component.css']
})
export class PaletteAreaBPMNComponent implements OnInit {
  @Output() sendElementFromPalette = new EventEmitter<Node>();
  @Output() sendEdgeFromPalette = new EventEmitter<Edge>();
  @Input() edges: Edge[] = [];
  //@Output() addNode = new EventEmitter<Node>();
  @Output() addEdge = new EventEmitter<Edge>();
  languages = ['ArchiMate', 'BPMN 2.0', 'BPMN4PP', 'BPaaS ModelingLanguage', 'SAP Scene', 'Control Element Modeling Language', 'Domain Specific Modeling Language for Patient Transferal Management'];
  views = ['Process Modeling View'];
  selectedView: string = '';
  selectedLanguage: string = '';

  constructor() {}

  ngOnInit() {}

  onLanguageChange(event: any) {
    this.selectedLanguage = event.value;
    console.log('Selected Language:', this.selectedLanguage);
  }

  onViewChange(event: any) {
    this.selectedView = event.value;
    console.log('Selected View:', this.selectedView);
  }

  protected addNodeToModel(node: Node) {
    this.sendElementFromPalette.emit(node);
  }
  protected onAddEdgeToModel(edge: Edge) {
    this.sendEdgeFromPalette.emit(edge);
  }
}

/*import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { ContextMenuComponent } from '@perfectmemory/ngx-contextmenu';
import { Node, Edge } from 'reactflow';

import {UUID} from 'angular2-uuid';
import { PaletteElementModel } from 'src/app/shared/model/PaletteElement.model';
@Component({
  selector: 'app-palette-area-bpmn',
  templateUrl: './palette-area-bpmn.component.html',
  styleUrls: ['./palette-area-bpmn.component.css']
})
export class PaletteAreaBPMNComponent implements OnInit {
 // @ViewChild(ContextMenuComponent, { static: true }) public elementRightClickMenu: ContextMenuComponent<any>;
  //@ViewChild(ContextMenuComponent, { static: true }) public paletteRightClickMenu: ContextMenuComponent<any>;
  //@Input() contextMenu: ContextMenuComponent<any>;
  @Output() sendElementFromPalette = new EventEmitter();
  @Input() nodes: Node[] = [];
  @Input() edges: Edge[] = [];
  //@Output() addNode = new EventEmitter<Node>();
  @Output() addEdge = new EventEmitter<Edge>();

  //newNodeLabel: string;
  constructor() {}

  languages = ['ArchiMate','BPMN 2.0','BPMN4PP','BPaaS ModelingLanguage','SAP Scene','Control Element Modeling Language','Domain Specific Modeling Language for Patient Transferal Management' ];
  views = ['Process Modeling View',];
  selectedView: string = '';
  selectedLanguage: string = '';
  id: string = '';
  position:string = '';


  ngOnInit() {}

  onLanguageChange(event: any) {
    this.selectedLanguage = event.value;
    console.log('Selected Language:', this.selectedLanguage);
  }

  onViewChange(event: any) {
    this.selectedView = event.value;
    console.log('Selected View:', this.selectedView);
  }

  protected addNodeToModel(node: Node) {
    this.sendElementFromPalette.emit(node);
  }
  onAddEdge(edge: Edge) {
    this.addEdge.emit(edge);
  }

}*/
/**
mport { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { Node, Edge, Connection, addEdge, MarkerType } from 'reactflow';

interface PaletteElement {
  name: string;
  type: string;
  data: {
    label: string;
  };
}

@Component({
  selector: 'app-palette-area-bpmn',
  templateUrl: './palette-area-bpmn.component.html',
  styleUrls: ['./palette-area-bpmn.component.css']
})
export class PaletteAreaBPMNComponent implements OnInit {
  languages = ['BPMN 2.0', 'Other Language'];
  views = ['Process Modeling View', 'Other View'];
  elements: PaletteElement[] = [];
  hoveredElement: PaletteElement | null = null;
  selectedView: string = '';
  selectedLanguage: string = '';
  newNodeLabel: any;

  @Input() nodes: Node[] = []; // Receives nodes from parent component
  @Input() edges: Edge[] = []; // Receives edges from parent component
  @Output() addNode = new EventEmitter<Node>(); // Emits event to add a node
  @Output() addEdge = new EventEmitter<Edge>(); // Emits event to add an edge
  @Output() connect = new EventEmitter<Connection>(); // Emits event on connection
  @Output() edgesChange = new EventEmitter<Edge[]>(); // Emits event when edges change

// Define newNodeLabel as string
  editingNodeId: string | undefined;

  constructor() {}

  ngOnInit() {}

  onLanguageChange(event: any) {
    this.selectedLanguage = event.value;
    console.log('Selected Language:', this.selectedLanguage);
  }

  onViewChange(event: any) {
    this.selectedView = event.value;
    console.log('Selected View:', this.selectedView);
  }

  addNodeToModel(event: any) {
    const nodeType: string = event?.type || ''; // Handle undefined or null
    const position: any = event?.position || { x: 0, y: 0 }; // Example default position
    const newNodeData: Node<any, string> = {
      id: this.generateUniqueId(),
      type: nodeType,
      position: position,
      data: {},
    };
    this.addNode.emit(newNodeData);
    this.newNodeLabel = '';
  }

  generateUniqueId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  onAddEdge(edge: Edge) {
    this.addEdge.emit(edge);
  }

  onConnect(event: any) {
    const newEdge: Edge = {
      id: `e${event.source}-${event.target}`,
      source: event.source,
      target: event.target,
      sourceHandle: event.sourceHandle,
      targetHandle: event.targetHandle,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    };
    this.edges = addEdge(newEdge, this.edges);
    this.edgesChange.emit(this.edges);
  }
}
 */
/**import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { Node, Edge, Connection, addEdge, MarkerType } from 'reactflow';

interface PaletteElement {
  name: string;
  type: string;
}

@Component({
  selector: 'app-palette-area-bpmn',
  templateUrl: './palette-area-bpmn.component.html',
  styleUrls: ['./palette-area-bpmn.component.css']
})
export class PaletteAreaBPMNComponent implements OnInit {
  languages = ['BPMN 2.0', 'Other Language'];
  views = ['Process Modeling View', 'Other View'];
  elements: PaletteElement[] = [];
  hoveredElement: PaletteElement | null = null;
  selectedView: string = '';
  selectedLanguage: string = '';

  @Input() nodes: Node[] = [];
  @Input() edges: Edge[] = [];
  @Output() addNode = new EventEmitter<Node>();
  @Output() addEdge = new EventEmitter<Edge>();
  @Output() connect = new EventEmitter<Connection>();
  @Output() edgesChange = new EventEmitter<Edge[]>();
  selectedSourceNodeId: string | null = null;
  selectedTargetNodeId: string | null = null;

  constructor() {}

  ngOnInit() {}

  onLanguageChange(event: any) {
    this.selectedLanguage = event.value;
    console.log('Selected Language:', this.selectedLanguage);
  }

  onViewChange(event: any) {
    this.selectedView = event.value;
    console.log('Selected View:', this.selectedView);
  }

  onAddNode(node: Node) {
    this.addNode.emit(node);
  }

  onAddEdge(edge: Edge) {
    this.addEdge.emit(edge);
  }

  onConnect(event: any) {
    const params: Connection = {
      source: event.source,
      sourceHandle: event.sourceHandle,
      target: event.target,
      targetHandle: event.targetHandle
    };
    const newEdge: Edge = {
      id: `e${event.source}-${event.target}`,
      source: event.source,
      target: event.target,
      sourceHandle: event.sourceHandle,
      targetHandle: event.targetHandle,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    };
    this.edges = addEdge(newEdge, this.edges);
    this.edgesChange.emit(this.edges);
  }
}

/***import {Component, EventEmitter, Output, OnInit, Input} from '@angular/core';
import {Node, Edge, Connection, addEdge, MarkerType, Position} from 'reactflow';

interface PaletteElement {
  name: string;
  type: string;
}


@Component({
  selector: 'app-palette-area-bpmn',
  templateUrl: './palette-area-bpmn.component.html',
  styleUrls: ['./palette-area-bpmn.component.css']
})
export class PaletteAreaBPMNComponent implements OnInit {
  languages = ['BPMN 2.0', 'Other Language'];
  views = ['Process Modeling View', 'Other View'];
  elements: PaletteElement[] = [];
  hoveredElement: PaletteElement | null = null;
  selectedView: string = '';
  @Input() nodes: Node[] = [];
  @Input() edges: Edge[] = [];
  @Output() addNode = new EventEmitter<Node>();
  @Output() addEdge = new EventEmitter<Edge>();
  @Output() connect = new EventEmitter<Connection>();
   //@Output() nodesChange = new EventEmitter<Node[]>();
  @Output() edgesChange = new EventEmitter<Edge[]>();
  selectedSourceNodeId: string | null = null;
  selectedTargetNodeId: string | null = null;
  node: string | undefined;


  constructor() {
  }

  ngOnInit() {
  }

  onLanguageChange(event: any) {
    const selectedLanguage = event.target.value;
  }

  onViewChange(event: any) {
    this.selectedView = event.target.value;
  }

  onAddNode(node: Node) {
    this.addNode.emit(node);
  }


  onAddEdge(edge: Edge) {
    this.addEdge.emit(edge);
  }


    onSelectNode(nodeId: string) {
      if (!this.selectedSourceNodeId) {
        this.selectedSourceNodeId = nodeId;
      } else {
        this.selectedTargetNodeId = nodeId;
        this.createEdge();
      }
    }

    createEdge() {
      if (this.selectedSourceNodeId && this.selectedTargetNodeId) {
        const newEdge: Edge = {
          id: `e${this.selectedSourceNodeId}-${this.selectedTargetNodeId}`,
          source: this.selectedSourceNodeId,
          target: this.selectedTargetNodeId,
          sourceHandle: null,
          targetHandle: null
        };
        this.addEdge.emit(newEdge);
        //this.resetSelection();
      }


   resetSelection() {
     this.selectedSourceNodeId = null;
     this.selectedTargetNodeId = null;
   }


  onConnect(event: any) {
    const params: Connection = {
      source: event.source,
      sourceHandle: event.sourceHandle,
      target: event.target,
      targetHandle: event.targetHandle
    };
    const newEdge: Edge = {
      id: `e${event.source}-${event.target}`,
      source: event.source,
      target: event.target,
      sourceHandle: event.sourceHandle,
      targetHandle: event.targetHandle,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    };
    this.edges = addEdge(newEdge, this.edges);
    this.edgesChange.emit(this.edges);
  }
}*/
/***import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { Node, Edge, Position, Connection, MarkerType } from 'reactflow';
interface BpmnElement {
  name: string;
  type: string;
  isConnectable: boolean;
  sourcePosition: string;
  targetPosition: string;
}

@Component({
  selector: 'app-palette-area-bpmn',
  templateUrl: './palette-area-bpmn.component.html',
  styleUrls: ['./palette-area-bpmn.component.css']
})
export class PaletteAreaBPMNComponent implements OnInit  {
  elements: BpmnElement[] = [
    { name: 'Non Event', type: 'nonEvent', isConnectable: true, sourcePosition: 'null', targetPosition: 'null' },
    { name: 'Task', type: 'task', isConnectable: true, sourcePosition: 'null', targetPosition: 'null' }
  ];

  showStartNode: boolean = false;
  showEndNode: boolean = false;
  showTaskOptions: boolean = false;
  lastNodePosition = { x: 0, y: 0 };
  lastNodeId: string | null = null;
  contextMenuVisible: boolean = false;
  contextMenuPosition = { x: 0, y: 0 };
  selectedNodeId: string | null = null;

  @Output() addNode = new EventEmitter<Node>();
  @Output() addEdge = new EventEmitter<Edge>();
  @Output() connect = new EventEmitter<Connection>();
  @Input() nodes: Node[] = [];
  @Input() edges: Edge[] = [];
  @Output() nodesChange = new EventEmitter<Node[]>();
  @Output() edgesChange = new EventEmitter<Edge[]>();

  constructor() {}

  ngOnInit() {}

  onHoverOverNonEvent() {
    this.showStartNode = true;
    this.showEndNode = true;
  }

  onHoverOverTask() {
    this.showTaskOptions = true;
  }

  onViewChange(event: any) {
    const selectedView = event.target.value;
    if (selectedView === 'Process Modeling View') {
      this.elements = [
        { name: '', type: 'event', isConnectable: true, sourcePosition: 'right', targetPosition: 'left' },
        { name: '', type: 'task', isConnectable: true, sourcePosition: 'right', targetPosition: 'left' }
      ];
    } else {
      this.elements = [];
    }
  }

  onOptionClick(element: BpmnElement, eventType: string) {
    const nodeId = `${eventType}-${Date.now()}`;
    const offset = 200;

    const newNodePosition = { x: this.lastNodePosition.x + offset, y: this.lastNodePosition.y };

    let newNode: Node;
    let newEdge: Edge | null = null;

    if (eventType === 'startEvent') {
      newNode = {
        id: nodeId,
        type: eventType,
        data: { label: '' },
        position: newNodePosition,
        sourcePosition: Position.Right,
        draggable: true,
        style: {
          border: '0.20px solid black',
          borderRadius: '50%',
          width: '58px',
          height: '58px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'url("assets/Simple_Start.png")',
          backgroundSize: 'cover',
          color: 'black',
          fontSize: '10px',
          cursor: 'pointer',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
          userSelect: 'none',
          transition: 'background-color 0.3s ease',
        }
      };
    } else if (eventType === 'endEvent') {
      newNode = {
        id: nodeId,
        type: eventType,
        data: { label: '' },
        position: newNodePosition,
        draggable: true,
        targetPosition: Position.Left,
        style: {
          border: '0.10px solid red',
          borderRadius: '50%',
          width: '58px',
          height: '58px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'url("assets/Simple_End.png")',
          backgroundSize: 'cover',
          color: 'black',
          fontSize: '10px',
          cursor: 'pointer',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
          userSelect: 'none',
          transition: 'background-color 0.3s ease',
        },
      };
    } else if (eventType === 'manualTask' || eventType === 'serviceTask') {
      newNode = {
        id: nodeId,
        type: eventType,
        data: { label: '' },
        position: newNodePosition,
        draggable: true,
        style: {
          border: '0.20px solid black',
          borderRadius: '13px',
          width: '103px',
          height: '58px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: eventType === 'manualTask' ? 'url("assets/Manual_Task.png")' : 'url("assets/Service_Task.png")',
          backgroundSize: 'cover',
          color: 'yellow',
          fontSize: '10px',
          cursor: 'pointer',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
          userSelect: 'none',
          transition: 'background-color 0.3s ease',
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left
      };
    } else {
      throw new Error(`Unknown event type: ${eventType}`);
    }

    if (this.lastNodeId) {
      newEdge = {
        id: `e${this.lastNodeId}-${nodeId}`,
        source: this.lastNodeId,
        target: nodeId,
        sourceHandle: null,
        targetHandle: null
      };
    }

    this.lastNodePosition = newNodePosition;
    this.lastNodeId = nodeId;
    this.nodes = [...this.nodes, newNode]; // Update local nodes array
    this.nodesChange.emit(this.nodes);
    this.addNode.emit(newNode);
    if (newEdge) {
      this.edges = [...this.edges, newEdge]; // Update local edges array
      this.edgesChange.emit(this.edges);
      this.addEdge.emit(newEdge);
    }
  }
}*/


/**import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { Node, Edge, Position, Connection, MarkerType, addEdge } from 'reactflow';
import { ReactFlowComponent } from 'ngx-reactflow';

interface BpmnElement {
  name: string;
  type: string;
  isConnectable: boolean;
}

@Component({
  selector: 'app-palette-area-bpmn',
  templateUrl: './palette-area-bpmn.component.html',
  styleUrls: ['./palette-area-bpmn.component.css']
})
export class PaletteAreaBpmnComponent implements OnInit {
  elements: BpmnElement[] = [
    { name: 'Non Event', type: 'nonEvent', isConnectable: true },
    { name: 'Task', type: 'task', isConnectable: true }
  ];

  showStartNode: boolean = false;
  showEndNode: boolean = false;
  showTaskOptions: boolean = false;
  lastNodePosition = { x: 0, y: 0 };
  lastNodeId: string | null = null;

  @Output() addNode = new EventEmitter<Node<any, string | undefined>>();
  @Output() addEdge = new EventEmitter<Edge>();
  @Output() connect = new EventEmitter<Connection>();
  @Input() nodes: Node[] = [];
  @Input() edges: Edge[] = [];
  @Output() nodesChange = new EventEmitter<Node[]>();
  @Output() edgesChange = new EventEmitter<Edge[]>();

  constructor() {}

  ngOnInit() {}

  onHoverOverNonEvent() {
    this.showStartNode = true;
    this.showEndNode = true;
  }

  onHoverOverTask() {
    this.showTaskOptions = true;
  }

  onViewChange(event: any) {
    const selectedView = event.target.value;
    if (selectedView === 'Process Modeling View') {
      this.elements = [
        { name: '', type: 'event', isConnectable: true },
        { name: '', type: 'task', isConnectable: true }
      ];
    } else {
      this.elements = [];
    }
  }

  onOptionClick(element: BpmnElement, eventType: string) {
    const nodeId = `${eventType}-${Date.now()}`;
    const offset = 200;

    const newNodePosition = { x: this.lastNodePosition.x + offset, y: this.lastNodePosition.y };

    let newNode: Node;
    let newEdge: Edge | null = null;

    if (eventType === 'startEvent') {
      newNode = {
        id: nodeId,
        type: eventType,
        data: { label: '' },
        position: newNodePosition,
        sourcePosition: Position.Right, // Only source handle on the right
        draggable: true,
        selectable: true,
        style: {
          border: '0.20px solid black',
          borderRadius: '50%',
          width: '58px',
          height: '58px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'url("assets/Simple_Start.png")',
          backgroundSize: 'cover',
          color: 'black',
          fontSize: '10px',
          cursor: 'pointer',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
          userSelect: 'none',
          transition: 'background-color 0.3s ease',
        }
      };
    } else if (eventType === 'endEvent') {
      newNode = {
        id: nodeId,
        type: eventType,
        data: { label: '' },
        position: newNodePosition,
        targetPosition: Position.Left, // Only target handle on the left
        draggable: true,
        selectable: true,
        style: {
          border: '0.10px solid red',
          borderRadius: '50%',
          width: '58px',
          height: '58px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'url("assets/Simple_End.png")',
          backgroundSize: 'cover',
          color: 'black',
          fontSize: '10px',
          cursor: 'pointer',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
          userSelect: 'none',
          transition: 'background-color 0.3s ease',
        }
      };
    } else if (eventType === 'manualTask' || eventType === 'serviceTask') {
      newNode = {
        id: nodeId,
        type: eventType,
        data: { label: '' },
        position: newNodePosition,
        draggable: true,
        selectable: true,
        style: {
          border: '0.20px solid black',
          borderRadius: '13px',
          width: '103px',
          height: '58px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: eventType === 'manualTask' ? 'url("assets/Manual_Task.png")' : 'url("assets/Service_Task.png")',
          backgroundSize: 'cover',
          color: 'yellow',
          fontSize: '10px',
          cursor: 'pointer',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
          userSelect: 'none',
          transition: 'background-color 0.3s ease',
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left
      };
    } else {
      throw new Error(`Unknown event type: ${eventType}`);
    }

    if (this.lastNodeId) {
      newEdge = {
        id: `e${this.lastNodeId}-${nodeId}`,
        source: this.lastNodeId,
        target: nodeId,
        sourceHandle: null,
        targetHandle: null
      };
    }

    this.lastNodePosition = newNodePosition;
    this.lastNodeId = nodeId;
    this.addNode.emit(newNode);
    if (newEdge) {
      this.addEdge.emit(newEdge);
    }
  }

  onNodesChange(event: any) {
    const updatedNodes = event.nodes;
    this.nodes = updatedNodes;
    this.nodesChange.emit(updatedNodes);
  }

  onEdgesChange(event: any) {
    const updatedEdges = event.edges;
    this.edges = updatedEdges;
    this.edgesChange.emit(updatedEdges);
  }

  onConnect(event: any) {
    const params: Connection = {
      source: event.source,
      sourceHandle: event.sourceHandle,
      target: event.target,
      targetHandle: event.targetHandle
    };
    const newEdge: Edge = {
      id: `e${event.source}-${event.target}`,
      source: event.source,
      target: event.target,
      sourceHandle: event.sourceHandle,
      targetHandle: event.targetHandle,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    };

    this.edges = addEdge(newEdge, this.edges);
    this.edgesChange.emit(this.edges);
  }
}*/
