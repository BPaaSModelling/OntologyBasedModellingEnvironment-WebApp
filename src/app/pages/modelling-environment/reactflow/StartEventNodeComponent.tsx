import React from 'react';
import { useNodes } from 'react-flow-renderer'; // Import the correct hook
import { BpmnElement } from '../models/bpmn-element.interface';

interface StartEventNodeProps {
  data: BpmnElement; // Use the BpmnElement interface for data
}

const StartEventNodeComponent: React.FC<StartEventNodeProps> = ({ data }) => {
  const { id } = data;

  // Access nodes state using useNodes
  const nodes = useNodes();

  // Find the current node by its id
  const currentNode = nodes.find((node) => node.id === id);
  const isSelected = currentNode?.selected || false; // Handle potential undefined

  const nodeStyle = {
    backgroundColor: isSelected ? '#ddd' : '#fff',
    border: '1px solid #ccc',
    padding: '10px',
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div style={nodeStyle}>
      <circle cx="25" cy="25" r="15" fill="#fff" stroke="#000" /> {/* Render circle for StartEvent */}
    </div>
  );
};

export default StartEventNodeComponent;
