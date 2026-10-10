"use client"
import { useState, useCallback } from 'react';
import {
  ReactFlow,
  addEdge,
  type Node,
  type Edge,
  type OnConnect,
  Background,
  BackgroundVariant,
  Controls,
  useNodesState,
  useEdgesState,
  getIncomers,
  getOutgoers,
  getConnectedEdges,
  OnNodesDelete,
  MarkerType,
  Panel,
} from '@xyflow/react';
import CustomEdge from './CustomEdge';
import Graph from './Graph';
import { Button } from '@base-ui/react';
import CustomNode from './CustomNode';
import Inspector from './Inspector';
import NodeCreate from './NodeCreate';

const nodeTypes = {
  'custom': CustomNode
}

const edgeTypes = {
  'custom': CustomEdge,
};

const initialNodes: Node[] = [
  { id: 'n1', position: { x: 0, y: 0 }, data: { name: 'Susceptible', symbol: "S", value: "99,995", infectious: false }, type: 'custom' },
  { id: 'n2', position: { x: 0, y: 120 }, data: { name: 'Infected', symbol: "I", value: "5", infectious: true }, type: 'custom' },
  { id: 'n3', position: { x: 0, y: 240 }, data: { name: 'Recovered', symbol: "R", value: "0", infectious: false }, type: 'custom' }
];
const initialEdges: Edge[] = [
  { id: 'n1-n2', source: 'n1', target: 'n2', data: { value: "23" }, type: 'custom', 
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
    },
  },
  { id: 'n2-n3', source: 'n2', target: 'n3', data: { value: "24" }, type: 'custom', 
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
    },
  }
];

const toolbarButton =
  'cursor-pointer rounded-md bg-[#24262c] px-3 py-1.5 hover:bg-[#30333b]';

export default function Canvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [showModal, setShowModal] = useState<boolean>(false);

  function toggleModal() {
    setShowModal(!showModal);
  }

  const onNodesDelete: OnNodesDelete = useCallback(
    (deleted) => {
      let remainingNodes = [...nodes];
      setEdges(
        deleted.reduce((acc, node) => {
          const incomers = getIncomers(node, remainingNodes, acc);
          const outgoers = getOutgoers(node, remainingNodes, acc);
          const connectedEdges = getConnectedEdges([node], acc);
 
          const remainingEdges = acc.filter((edge) => !connectedEdges.includes(edge));
 
          const createdEdges = incomers.flatMap(({ id: source }) =>
            outgoers.map(({ id: target }) => ({
              id: `${source}->${target}`,
              source,
              target,
            })),
          );
 
          remainingNodes = remainingNodes.filter((rn) => rn.id !== node.id);
 
          return [...remainingEdges, ...createdEdges];
        }, edges),
      );
    },
    [nodes, setEdges, edges],
  );

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  return (
    <div className='flex flex-1 min-h-0'>
      <div style={{ width: '50%', height: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodesDelete={onNodesDelete}
          onConnect={onConnect}
          fitView
          colorMode="dark"
        >
          <Controls />
          <Background variant={BackgroundVariant.Cross} gap={12} size={1} />
          <Panel
            position="bottom-center"
            className='flex items-center gap-1 rounded-lg border border-[#303238] bg-[#1a1b1e] p-1 text-xs text-gray-100'
          >
            <p className='select-none px-2 text-gray-400'>Add</p>
            <Button className={toolbarButton} onClick={toggleModal}>+ Component</Button>
            <Button className={toolbarButton}>+ Flow</Button>
          </Panel>
          <Panel
            position='top-right'
            className='grid select-none grid-cols-[auto_auto] gap-x-6 gap-y-2 rounded-md border border-[#303238] bg-[#1a1b1e] px-3 py-2 text-xs text-gray-300'
          >
            <p className='col-span-2 font-semibold text-white'>Controls</p>
            <p>Delete</p>
            <p>Select + Backspace</p>
            <p>Connect</p>
            <p>Drag dot to dot</p>
          </Panel>
        </ReactFlow>
      </div>
      <div className='flex flex-col grow items-start overflow-y-auto'>
        <Graph nodes={nodes} edges={edges} />
        <NodeCreate setNodes={setNodes} showModal={showModal} />
        <Inspector nodes={nodes} edges={edges}/>
      </div>
    </div>
  );
}