
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Node, Edge } from 'reactflow';
import { MatDialog } from "@angular/material/dialog";
import { PaletteElementModel } from 'src/app/shared/models/PaletteElement.model';

@Component({
  selector: 'app-modelling-environment',
  templateUrl: './modelling-environment.component.html',
  styleUrls: ['./modelling-environment.component.css']
})
export class ModellingEnvironmentComponent implements OnInit {
  nodes: Node[] = [];
  edges: Edge[] = [];
  editingNodeId: string | null = null;
  newNodeLabel: string | null = null;
  showProp: boolean = false;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

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

  onDoubleClickNode(event: { event: MouseEvent; node: Node }) {
    this.editingNodeId = event.node.id;
    const node = this.nodes.find(n => n.id === this.editingNodeId);
    if (node) {
      this.newNodeLabel = node.data.label as string;
    }
  }

  toggleInstancePropertiesModal(event: any) {
    console.log('Show element property modal:', event);
  }
}

/*import { Node, Edge, Connection } from 'reactflow';

import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { PaletteElementModel } from 'src/app/shared/models/PaletteElement.model';



@Component({
  selector: 'app-modelling-environment',
  templateUrl: './modelling-environment.component.html',
  styleUrls: ['./modelling-environment.component.css']
})
export class ModellingEnvironmentComponent implements OnInit {
  nodes: Node[] = [];
  edges: Edge[] = [];
  @Output() nodeDoubleClick = new EventEmitter<{ event: MouseEvent, node: Node }>();
  editingNodeId: any;
  newNodeLabel: any;

  propElement: Object;
  new_element: PaletteElementModel;
  showProp: boolean;

  constructor(public dialog: MatDialog) {
    this.showProp = false;
  }


  ngOnInit(): void {}

  sendElementToCanvas(new_element: PaletteElementModel) {
    this.new_element = new_element;
  }


  onAddNode(node: Node) {
    this.nodes = [...this.nodes, node];
  }

  onAddEdge(edge: Edge) {
    this.edges = [...this.edges, edge];
  }

  onNodesChange(nodes: Node[]) {
    this.nodes = nodes;
  }

  onEdgesChange(edges: Edge[]) {
    this.edges = edges;
  }


  onDoubleClickNode(event: any) {
    this.editingNodeId = event.node.id;
    const node = this.nodes.find(n => n.id === this.editingNodeId);
    if (node) {
      this.newNodeLabel = node.data.label;
    }
  }
  toggleInstancePropertiesModal(event: any) {
    console.log('Show element property modal:', event);
  }

}*/



/**import {Component, EventEmitter, Output, OnInit} from '@angular/core';
import { Node, Edge, Connection, MarkerType } from 'reactflow';

@Component({
  selector: 'app-modelling-environment',
  templateUrl: './modelling-environment.component.html',
  styleUrls: ['./modelling-environment.component.css']
})
export class ModellingEnvironmentComponent {
  nodes: Node[] = [];
  edges: Edge[] = [];
  @Output() rightClick = new EventEmitter<{ event: MouseEvent, nodeId: string }>();
  @Output() nodesChange = new EventEmitter<Node[]>();
  @Output() edgesChange = new EventEmitter<Edge[]>();
  @Output() nodeDoubleClick = new EventEmitter<{ event: MouseEvent, node: Node }>();

  constructor() {
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
    this.rightClick.emit({ event, nodeId });
  }
  onNodesChange(event: any) {
    this.nodes = event.nodes;
    this.nodesChange.emit(this.nodes);
  }

  onEdgesChange(event: any) {
    this.edges = event.edges;
    this.edgesChange.emit(this.edges);
  }

  handleDoubleClick(event: any) {
    const nodeId = event.node.id;
    this.nodeDoubleClick.emit({ event, node: event.node });
  }
  ngOnInit() {}
}
  /**nodes: Node[] = [];
  edges: Edge[] = [];

  onAddNode(node: Node) {
    this.nodes = [...this.nodes, node];
  }

  handleNodesChange(updatedNodes: Node[]) {
    this.nodes = updatedNodes;
  }

  handleEdgesChange(updatedEdges: Edge[]) {
    this.edges = updatedEdges;
  }

  handleConnect(connection: Connection) {
    if (connection.source && connection.target) {
      const newEdge: Edge = {
        id: `${connection.source}-${connection.target}`,
        source: connection.source,
        target: connection.target,
        label: 'this is an edge label'
      };
      this.edges = [...this.edges, newEdge];
    }
    */

  /**
  nodes: Node[] = [];
  edges: Edge[] = [];
  @Output() connect = new EventEmitter<Connection>();

  handleNodesChange(updatedNodes: Node[]) {
    this.nodes = updatedNodes;
  }
  handleEdgesChange(updatedEdges: Edge[]) {
    this.edges = updatedEdges;
  }
  onAddNode(node: Node) {
    this.nodes = [...this.nodes, node];
  }
  onConnect(event: Connection) {
    this.connect.emit(event);
  }*/

  /*//////Recent works
  onNodesChange(nodes: Node[]) {
    this.nodes = nodes;
  }

  onEdgesChange(edges: Edge[]) {
    this.edges = edges;
  }*/



  /*
  edges: Edge[] = [];

  onAddNode(newNode: Node) {
    this.nodes = [...this.nodes, newNode];
  }

  nodes: any[] = [];

  handleAddNode(node: any) {
    this.nodes.push(node);
  }
*/

