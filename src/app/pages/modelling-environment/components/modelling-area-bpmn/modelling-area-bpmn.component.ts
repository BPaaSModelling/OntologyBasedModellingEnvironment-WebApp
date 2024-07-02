import {Component, Input, Output, EventEmitter, OnInit, SimpleChanges} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
//import {Node, Edge, Connection, MarkerType, addEdge} from 'reactflow';
//import { Model } from 'src/app/shared/models/Model.model';
import { Node, Edge, Connection, NodeChange, EdgeChange} from 'reactflow';
import MouseEvent from "reactflow";
interface NodeWithLabel extends Node {
  data: {
    label: string;
  };
}

@Component({
  selector: 'app-modelling-area-bpmn',
  templateUrl: './modelling-area-bpmn.component.html',
  styleUrls: ['./modelling-area-bpmn.component.css']
})
export class ModellingAreaBPMNComponent implements OnInit {
  @Input() nodes: Node[] = [];
  @Input() edges: Edge[] = [];
  @Input() node!: Node[];
  //@Output() nodeDoubleClick = new EventEmitter<{ event: MouseEvent, node: NodeWithLabel }>();
  @Output() nodeDoubleClick = new EventEmitter<{ event: MouseEvent, node: Node }>();
  /*@Output() nodesChange = new EventEmitter<Node[]>();
  @Output() edgesChange = new EventEmitter<Edge[]>();
 */
  private lastNodePosition: any;
  private nodesChange: any;
 // edges: Edge[] = [];

  selectedNode: Node | null = null;
  newLabel: string = '';

  onAddNode(node: Node) {
    this.nodes = [...this.nodes, node];
  }

  onAddEdge(edge: Edge) {
    // Replace existing edge if one with the same id exists
    this.edges = this.edges.filter(e => e.id !== edge.id);
    this.edges = [...this.edges, edge];
  }

  onNodesChange(nodes: Node[]) {
    this.nodes = nodes;
  }

  onEdgesChange(edges: Edge[]) {
    this.edges = edges;
  }

  emitNodeDoubleClick(event: MouseEvent, node: Node) {
    this.nodeDoubleClick.emit({ event, node });
  }

  onNodeDragEnd(event: any) {
    const { node } = event; // Destructure the node object from the event
    this.lastNodePosition = node.position; // Update your lastNodePosition property (if needed)
  }

  handleNodeDoubleClick(node: Node) {
    this.selectedNode = node;
    this.newLabel = node.data.label;
  }

  updateNodeLabel() {
    if (this.selectedNode) {
      const nodeIndex = this.nodes.findIndex(node => node.id === this.selectedNode!.id);
      if (nodeIndex !== -1) {
        this.nodes[nodeIndex].data.label = this.newLabel;
        this.selectedNode = null;
        this.newLabel = '';
      }
    }
  }
  /*onNodesChange(event: any) {
    this.nodes = event.nodes;
    this.nodesChange.emit(this.nodes);
  }*/

  /*onEdgesChange(event: any) {
    this.edges = event.edges;
    this.edgesChange.emit(this.edges);
  }*/

  ngOnInit(): void {}
}




/***import {Component, Input, Output, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import { Node, Edge, Connection, addEdge, MarkerType } from 'reactflow';
//import * as console from "node:console";
import {ReactFlowComponent } from 'ngx-reactflow';

@Component({
  selector: 'app-modelling-area-bpmn',
  templateUrl: './modelling-area-bpmn.component.html',
  styleUrls: ['./modelling-area-bpmn.component.css']
})
export class ModellingAreaBPMNComponent implements OnInit, OnDestroy {
  editingNodeId: string | null = null;
  newNodeLabel: string = '';
  @Input() nodes!: Node[];
  @Input() edges!: Edge[];
  @Output() nodesChange = new EventEmitter<Node[]>();
  @Output() edgesChange = new EventEmitter<Edge[]>();
  @Output() connect = new EventEmitter<Connection>();
  @Output() rightClick = new EventEmitter<{ event: MouseEvent, nodeId: string }>();

  contextMenuVisible: boolean = false;
  contextMenuPosition = {x: 0, y: 0};
  selectedNodeId: string | null = null;


  onNodesChange(event: any) {
    this.nodes = event.nodes;
    this.nodesChange.emit(this.nodes);
  }

  onEdgesChange(event: any) {
    this.edges = event.edges;
    this.edgesChange.emit(this.edges);
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
    this.contextMenuPosition = {x: event.clientX, y: event.clientY};
    if (nodeId) {
      this.selectedNodeId = nodeId;
    }
  }

  onNodeContextMenu(event: any) {
    const {event: mouseEvent, node} = event;
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

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
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

  onNodeDoubleClick(nodeId: string) {
    this.editingNodeId = nodeId;
    const node = this.nodes.find(n => n.id === nodeId);
    if (node) {
      this.newNodeLabel = node.data.label;
    }
  }

  saveNodeLabel(nodeId: string) {
    const node = this.nodes.find(n => n.id === nodeId);
    if (node) {
      node.data.label = this.newNodeLabel;
      this.nodesChange.emit([...this.nodes]);
      this.editingNodeId = null;
      this.newNodeLabel = '';
    }
  }

  cancelEdit() {
    this.editingNodeId = null;
    this.newNodeLabel = '';
  }

  handleAddNode(node: Node) {
    this.nodes = [...this.nodes, node];
  }

  handleAddEdge(edge: Edge) {
    this.edges = [...this.edges, edge];
  }

  handleNodesChange(updatedNodes: Node[]) {
    this.nodes = updatedNodes;
  }

  handleEdgesChange(updatedEdges: Edge[]) {
    this.edges = updatedEdges;
  }

  onAddNode(node: Node) {
    this.nodes = [...this.nodes, node];
  }

  onAddEdge(edge: Edge) {
    this.edges = [...this.edges, edge];
  }

  handleConnect(connection: Connection) {
    if (connection.source && connection.target) {
      const newEdge: Edge = {
        id: `${connection.source}-${connection.target}`,
        source: connection.source,
        target: connection.target,
        label: 'this is an edge label',
        markerEnd: {type: MarkerType.ArrowClosed},
      };
      this.edges = [...this.edges, newEdge];
    }
  }

  handleRightClick(event: MouseEvent, nodeId: string) {
    this.rightClick.emit({event, nodeId});
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }
}*/

