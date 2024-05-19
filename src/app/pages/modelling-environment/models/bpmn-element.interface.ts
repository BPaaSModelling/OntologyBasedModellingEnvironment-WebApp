// models/bpmn-element.interface.ts

export interface BpmnElement {
  id: string;
  type: string; // e.g., "StartEvent", "Task", "Gateway"
  position: { x: number; y: number };
  label?: string;
  data?: any; // Optional for element specific data
}
