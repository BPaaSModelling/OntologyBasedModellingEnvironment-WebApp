import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { ReactFlowComponent } from 'ngx-reactflow'; // Adjust the import as per your library structure

@Component({
  selector: 'app-modelling-area',
  templateUrl: './modelling-area.component.html',
  styleUrls: ['./modelling-area.component.css']
})
export class ModellingAreaComponent implements AfterViewInit {
  @ViewChild('flowDiagram') flowDiagram!: ReactFlowComponent; // Adjust the ViewChild type

  nodes: any[] = []; // Example nodes array
  edges: any[] = []; // Example edges array

  constructor() {
    // Initialize nodes and edges if needed
    this.nodes = [
      // Example node objects
    ];
    this.edges = [
      // Example edge objects
    ];
  }

  ngAfterViewInit() {
    // Now you can access flowDiagram and interact with it programmatically
    console.log(this.flowDiagram);
  }

  onConnect(event: any) {
    // Handle connect event if needed
    console.log('Connect event:', event);
  }
}

/**
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Node, Edge, Connection, addEdge, MarkerType } from 'reactflow';
import _ from 'lodash';
//import { InstantiationTargetType } from 'src/app/shared/models/InstantiationTargetType.model';

@Component({
  selector: 'app-modelling-area',
  templateUrl: './modelling-area.component.html',
  styleUrls: ['./modelling-area.component.css']
})
export class ModellingAreaComponent implements OnChanges {
  @Input() nodes: Node[] = [];
  @Input() edges: Edge[] = [];
  //@Output() nodesChange = new EventEmitter<Node[]>();
  //@Output() edgesChange = new EventEmitter<Edge[]>();
  @Output() connect = new EventEmitter<Connection>();
  @Output() rightClick = new EventEmitter<{ event: MouseEvent, nodeId: string }>();
  name:string = "Modelling-area-Coponent"

  contextMenuVisible: boolean = false;
  contextMenuPosition = { x: 0, y: 0 };
  selectedNodeId: string | null = null;

  editingNodeId: string | null = null;
  newNodeLabel: string = '';


  //selectedInstantiationType: InstantiationTargetType = InstantiationTargetType.INSTANCE;
  nodesChange: any;


  ngOnChanges(changes: SimpleChanges) {
    if ('nodes' in changes) {
      this.nodes = changes['nodes'].currentValue;
    }
    if ('edges' in changes) {
      this.edges = changes['edges'].currentValue;
    }
  }
  onNodeDoubleClick(event: any) {
    const clickedNode = event.node;
    const newLabel = prompt('Enter new label:', clickedNode.data.label ?? '');
    if (newLabel !== null) {
      const updatedNode = { ...clickedNode, data: { ...clickedNode.data, label: newLabel } };
      this.nodes = this.nodes.map(n => (n.id === clickedNode.id ? updatedNode : n));
      this.nodesChange.emit(this.nodes);
    }
  }
  /*onNodesChange(event: any) {
    this.nodes = event.nodes;
    this.nodesChange.emit(this.nodes);
  }

  onEdgesChange(event: any) {
    this.edges = event.edges;
    this.edgesChange.emit(this.edges);
  }*/

  /*onConnect(event: any) {
    const newEdge: Edge = {
      id: `e${event.source}-${event.target}`,
      source: event.source,
      target: event.target,
      sourceHandle: event.sourceHandle || null,
      targetHandle: event.targetHandle || null,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    };
    this.edges = addEdge(newEdge, this.edges);
    this.edgesChange.emit(this.edges);
  }*/

  /*onRightClick(event: MouseEvent, nodeId?: string) {
    event.preventDefault();
    this.contextMenuVisible = true;
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };
    if (nodeId) {
      this.selectedNodeId = nodeId;
    }
  }*/

 /* onNodeContextMenu(event: any) {
    const { event: mouseEvent, node } = event;
    this.onRightClick(mouseEvent, node.id);
  }*/

  /*onCancelContextMenu() {
    this.contextMenuVisible = false;
    this.selectedNodeId = null;
  }*/

  /*onNodeMouseDown(event: MouseEvent, node: Node): void {
    event.preventDefault();
    event.stopPropagation();

    const initialMousePosition = {
      x: event.clientX,
      y: event.clientY
    };

    const initialNodePosition = {
      x: node.position.x,
      y: node.position.y
    };

    const onMouseMove = (moveEvent: MouseEvent) => {
      const offsetX = moveEvent.clientX - initialMousePosition.x;
      const offsetY = moveEvent.clientY - initialMousePosition.y;

      node.position = {
        x: initialNodePosition.x + offsetX,
        y: initialNodePosition.y + offsetY
      };

      this.nodesChange.emit([...this.nodes]);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }*/

/*}*/


/**import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Node, Edge, Connection, addEdge, MarkerType } from 'reactflow';

@Component({
  selector: 'app-modelling-area',
  templateUrl: './modelling-area.component.html',
  styleUrls: ['./modelling-area.component.css']
})
export class ModellingAreaComponent implements OnChanges {
  @Input() nodes: Node[] = [];
  @Input() edges: Edge[] = [];
  @Output() nodesChange = new EventEmitter<Node[]>();
  @Output() edgesChange = new EventEmitter<Edge[]>();
  @Output() connect = new EventEmitter<Connection>();
  @Output() rightClick = new EventEmitter<{ event: MouseEvent, nodeId: string }>();

  contextMenuVisible: boolean = false;
  contextMenuPosition = { x: 0, y: 0 };
  selectedNodeId: string | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if ('nodes' in changes) {
      this.nodes = changes['nodes'].currentValue;
    }
    if ('edges' in changes) {
      this.edges = changes['edges'].currentValue;
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
    const newEdge: Edge = {
      id: `e${event.source}-${event.target}`,
      source: event.source,
      target: event.target,
      sourceHandle: event.sourceHandle || null,
      targetHandle: event.targetHandle || null,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    };

    this.edges = addEdge(newEdge, this.edges);
    this.edgesChange.emit(this.edges);
  }

  onRightClick(event: MouseEvent, nodeId?: string) {
    event.preventDefault();
    this.contextMenuVisible = true;
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };
    if (nodeId) {
      this.selectedNodeId = nodeId;
    }
  }

  onNodeContextMenu(event: any) {
    const { event: mouseEvent, node } = event;
    this.onRightClick(mouseEvent, node.id);
  }

  onDeleteNode() {
    if (this.selectedNodeId) {
      this.nodes = this.nodes.filter(node => node.id !== this.selectedNodeId);
      this.edges = this.edges.filter(edge => edge.source !== this.selectedNodeId && edge.target !== this.selectedNodeId);
      this.nodesChange.emit(this.nodes);
      this.edgesChange.emit(this.edges);
      this.contextMenuVisible = false;
    }
  }

  onCancelContextMenu() {
    this.contextMenuVisible = false;
    this.selectedNodeId = null;
  }

  onNodeDragStop(event: any) {
    const updatedNode: Node = event.node;
    const index = this.nodes.findIndex(n => n.id === updatedNode.id);

    if (index !== -1) {
      this.nodes[index].position = updatedNode.position;
      this.nodesChange.emit([...this.nodes]);
    }

    console.log('Node drag stopped:', updatedNode);
  }
  onNodeMouseDown(event: MouseEvent, node: Node): void {
    event.preventDefault();
    event.stopPropagation();

    const initialMousePosition = {
      x: event.clientX,
      y: event.clientY
    };

    const initialNodePosition = {
      x: node.position.x,
      y: node.position.y
    };

    const onMouseMove = (moveEvent: MouseEvent) => {
      const offsetX = moveEvent.clientX - initialMousePosition.x;
      const offsetY = moveEvent.clientY - initialMousePosition.y;

      node.position = {
        x: initialNodePosition.x + offsetX,
        y: initialNodePosition.y + offsetY
      };

      this.nodesChange.emit([...this.nodes]);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    // Add event listeners to the node element, not the whole document
    event.target?.addEventListener('mousemove', onMouseMove as EventListener);
    event.target?.addEventListener('mouseup', onMouseUp as EventListener);
  }

}*/



/**import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Node, Edge, Connection, addEdge, MarkerType } from 'reactflow';

@Component({
  selector: 'app-modelling-area',
  templateUrl: './modelling-area.component.html',
  styleUrls: ['./modelling-area.component.css']
})
export class ModellingAreaComponent implements OnChanges {
  @Input() nodes: Node[] = [];
  @Input() edges: Edge[] = [];
  @Output() nodesChange = new EventEmitter<Node[]>();
  @Output() edgesChange = new EventEmitter<Edge[]>();
  @Output() connect = new EventEmitter<Connection>();
  @Output() rightClick = new EventEmitter<{ event: MouseEvent, nodeId: string }>();
  contextMenuVisible: boolean = false;
  contextMenuPosition = { x: 0, y: 0 };
  selectedNodeId: string | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['nodes']) {
      this.nodes = changes['nodes'].currentValue;
    }
    if (changes['edges']) {
      this.edges = changes['edges'].currentValue;
    }
  }

  onNodesChange(event: any) {
    const updatedNodes = event.nodes;
    this.nodesChange.emit(updatedNodes);
  }

  onEdgesChange(event: any) {
    const updatedEdges = event.edges;
    this.edgesChange.emit(updatedEdges);
  }

  onConnect(event: any) {
    const newEdge: Edge = {
      id: `e${event.source}-${event.target}`,
      source: event.source,
      target: event.target,
      sourceHandle: event.sourceHandle || null,
      targetHandle: event.targetHandle || null,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    };

    this.edges = addEdge(newEdge, this.edges);
    this.edgesChange.emit(this.edges);
  }

  onRightClick(event: MouseEvent, nodeId?: string) {
    event.preventDefault();
    this.rightClick.emit({ event, nodeId: nodeId || '' });
  }

  onNodeContextMenu(event: any) {
    const { event: mouseEvent, node } = event;
    this.onRightClick(mouseEvent, node.id);
  }
  onDeleteNode() {
    if (this.selectedNodeId) {
      this.nodes = this.nodes.filter(node => node.id !== this.selectedNodeId);
      this.edges = this.edges.filter(edge => edge.source !== this.selectedNodeId && edge.target !== this.selectedNodeId);
      this.contextMenuVisible = false;
      this.selectedNodeId = null;
    }
  }

  onCancelContextMenu() {
    this.contextMenuVisible = false;
    this.selectedNodeId = null;
  }
}*/
/*this works well
/**import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Node, Edge, Connection, addEdge, MarkerType } from 'reactflow';

@Component({
  selector: 'app-modelling-area',
  templateUrl: './modelling-area.component.html',
  styleUrls: ['./modelling-area.component.css']
})
export class ModellingAreaComponent implements OnChanges {
  @Input() nodes: Node[] = [];
  @Input() edges: Edge[] = [];
  @Output() nodesChange = new EventEmitter<Node[]>();
  @Output() edgesChange = new EventEmitter<Edge[]>();
  @Output() connect = new EventEmitter<Connection>();
  @Output() rightClick = new EventEmitter<{ event: MouseEvent, nodeId: string }>();
  contextMenuVisible: boolean = false;
  contextMenuPosition = { x: 0, y: 0 };
  selectedNodeId: string | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['nodes']) {
      this.nodes = changes['nodes'].currentValue;
    }
    if (changes['edges']) {
      this.edges = changes['edges'].currentValue;
    }
  }

  onNodesChange(event: any) {
    const updatedNodes = event.nodes;
    this.nodesChange.emit(updatedNodes);
  }

  onEdgesChange(event: any) {
    const updatedEdges = event.edges;
    this.edgesChange.emit(updatedEdges);
  }

  onConnect(event: any) {
    const newEdge: Edge = {
      id: `e${event.source}-${event.target}`,
      source: event.source,
      target: event.target,
      sourceHandle: event.sourceHandle || null,
      targetHandle: event.targetHandle || null,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    };

    this.edges = addEdge(newEdge, this.edges);
    this.edgesChange.emit(this.edges);
  }

  onRightClick(event: MouseEvent, nodeId?: string) {
    event.preventDefault();
    this.contextMenuVisible = true;
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };
    if (nodeId) {
      this.selectedNodeId = nodeId;
    }
  }

  onNodeContextMenu(event: any) {
    const { event: mouseEvent, node } = event;
    this.onRightClick(mouseEvent, node.id);
  }

  onDeleteNode() {
    if (this.selectedNodeId) {
      this.nodes = this.nodes.filter(node => node.id !== this.selectedNodeId);
      this.edges = this.edges.filter(edge => edge.source !== this.selectedNodeId && edge.target !== this.selectedNodeId);
      this.nodesChange.emit(this.nodes);
      this.edgesChange.emit(this.edges);
      this.contextMenuVisible = false;
      this.selectedNodeId = null;
    }
  }

  onCancelContextMenu() {
    this.contextMenuVisible = false;
    this.selectedNodeId = null;
  }
}*/

/*import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Node, Edge, Connection, addEdge, MarkerType } from 'reactflow';

@Component({
  selector: 'app-modelling-area',
  templateUrl: './modelling-area.component.html',
  styleUrls: ['./modelling-area.component.css']
})
export class ModellingAreaComponent implements OnChanges {
  @Input() nodes: Node[] = [];
  @Input() edges: Edge[] = [];
  @Output() nodesChange = new EventEmitter<Node[]>();
  @Output() edgesChange = new EventEmitter<Edge[]>();
  @Output() connect = new EventEmitter<Connection>();
  @Output() addEdge = new EventEmitter<Edge>();

  contextMenuVisible: boolean = false;
  contextMenuPosition = { x: 0, y: 0 };
  selectedNodeId: string | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['nodes']) {
      this.nodes = changes['nodes'].currentValue;
    }
    if (changes['edges']) {
      this.edges = changes['edges'].currentValue;
    }
  }

  onNodesChange(event: any) {
    const updatedNodes = event.nodes;
    this.nodesChange.emit(updatedNodes);
  }

  onEdgesChange(event: any) {
    const updatedEdges = event.edges;
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
  onRightClick(event: MouseEvent, nodeId?: string) {
    event.preventDefault();
    this.contextMenuVisible = true;
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };
    if (nodeId) {
      this.selectedNodeId = nodeId;
    }
  }

  onDeleteNode() {
    if (this.selectedNodeId) {
      this.nodes = this.nodes.filter(node => node.id !== this.selectedNodeId);
      this.edges = this.edges.filter(edge => edge.source !== this.selectedNodeId && edge.target !== this.selectedNodeId);
      this.nodesChange.emit(this.nodes);
      this.edgesChange.emit(this.edges);
      this.contextMenuVisible = false;
    }
  }

  onCancelContextMenu() {
    this.contextMenuVisible = false;
    this.selectedNodeId = null;
  }
}*/

/**import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Node, Edge, Connection, addEdge, MarkerType } from 'reactflow';

@Component({
  selector: 'app-modelling-area',
  templateUrl: './modelling-area.component.html',
  styleUrls: ['./modelling-area.component.css']
})
export class ModellingAreaComponent implements OnChanges {
  @Input() nodes: Node[] = [];
  @Input() edges: Edge[] = [];
  @Output() nodesChange = new EventEmitter<Node[]>();
  @Output() edgesChange = new EventEmitter<Edge[]>();
  @Output() connect = new EventEmitter<Connection>();
  @Output() addEdge = new EventEmitter<Edge>();

  contextMenuVisible: boolean = false;
  contextMenuPosition = { x: 0, y: 0 };
  selectedNodeId: string | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['nodes']) {
      this.nodes = changes['nodes'].currentValue;
    }
    if (changes['edges']) {
      this.edges = changes['edges'].currentValue;
    }
  }

  onNodesChange(event: any) {
    const updatedNodes = event.nodes;
    this.nodesChange.emit(updatedNodes);
  }

  onEdgesChange(event: any) {
    const updatedEdges = event.edges;
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
  onRightClick(event: MouseEvent, nodeId?: string) {
    event.preventDefault();
    this.contextMenuVisible = true;
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };
    if (nodeId) {
      this.selectedNodeId = nodeId;
    }
  }


  onDeleteNode() {
    if (this.selectedNodeId) {
      this.nodes = this.nodes.filter(node => node.id !== this.selectedNodeId);
      this.edges = this.edges.filter(edge => edge.source !== this.selectedNodeId && edge.target !== this.selectedNodeId);
      this.nodesChange.emit(this.nodes);
      this.edgesChange.emit(this.edges);
      this.contextMenuVisible = false;
    }
  }
  onCancelContextMenu() {
    this.contextMenuVisible = false;
    this.selectedNodeId = null;
  }
}*/

/**import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Node, Edge, Connection, addEdge, MarkerType } from 'reactflow';
@Component({
  selector: 'app-modelling-area',
  templateUrl: './modelling-area.component.html',
  styleUrls: ['./modelling-area.component.css']
})
export class ModellingAreaComponent implements OnChanges {
  @Input() nodes: Node[] = [];
  @Input() edges: Edge[] = [];
  @Output() nodesChange = new EventEmitter<Node[]>();
  @Output() edgesChange = new EventEmitter<Edge[]>();
  @Output() connect = new EventEmitter<Connection>();
  @Output() addEdge = new EventEmitter<Edge>();
  ngOnChanges(changes: SimpleChanges) {
    if (changes['nodes']) {
      this.nodes = changes['nodes'].currentValue;
    }
    if (changes['edges']) {
      this.edges = changes['edges'].currentValue;
    }
  }

  onNodesChange(event: any) {
    const updatedNodes = event.nodes;
    this.nodesChange.emit(updatedNodes);
  }

  onEdgesChange(event: any) {
    const updatedEdges = event.edges;
    this.edgesChange.emit(updatedEdges);
  }
  onConnect(event: any) {
    const params: Connection = {
      source: event.source,
      sourceHandle: event.sourceHandle,
      target: event.target,
      targetHandle: event.targetHandle
    };
    const newEdges = addEdge(params, this.edges);
    this.edges = [...this.edges, ...newEdges];
    this.edgesChange.emit(this.edges);
  }


  /*onConnect(event: any) {
    // Ensure that the event contains the necessary connection information
    const connection: Connection = {
      source: event.source,
      sourceHandle: event.sourceHandle,
      target: event.target,
      targetHandle: event.targetHandle
    };
    this.connect.emit(connection);
  }*/




/**import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Node, Edge, Connection, addEdge, MarkerType } from 'reactflow';

@Component({
  selector: 'app-modelling-area',
  templateUrl: './modelling-area.component.html',
  styleUrls: ['./modelling-area.component.css']
})
export class ModellingAreaComponent implements OnChanges {
  @Input() nodes: Node[] = [];
  @Input() edges: Edge[] = [];
  @Output() nodesChange = new EventEmitter<Node[]>();
  @Output() edgesChange = new EventEmitter<Edge[]>();
  @Output() connect = new EventEmitter<Connection>();
  addEdge: any;
  ngOnChanges(changes: SimpleChanges) {
    if (changes['nodes']) {
      this.nodes = changes['nodes'].currentValue;
    }
    if (changes['edges']) {
      this.edges = changes['edges'].currentValue;
    }
  }

  onNodesChange(event: any) {
    const updatedNodes = event.nodes;
    this.nodesChange.emit(updatedNodes);
  }

  onEdgesChange(event: any) {
    const updatedEdges = event.edges;
    this.edgesChange.emit(updatedEdges);
  }

}
*/
  /*@Input() nodes: Node[] = [];
  @Input() edges: Edge[] = [];
  @Output() nodesChange = new EventEmitter<Node[]>();
  @Output() edgesChange = new EventEmitter<Edge[]>();
  @Output() connect = new EventEmitter<Connection>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['nodes']) {
      this.nodes = changes['nodes'].currentValue;
    }
    if (changes['edges']) {
      this.edges = changes['edges'].currentValue;
    }
  }

  onNodesChange(event: any) {
    const updatedNodes = event.nodes;
    this.nodesChange.emit(updatedNodes);
  }

  onEdgesChange(event: any) {
    const updatedEdges = event.edges;
    this.edgesChange.emit(updatedEdges);
  }
}*/
