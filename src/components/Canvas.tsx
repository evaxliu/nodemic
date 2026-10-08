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
  MiniMap,
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

// type InfectiousNode = Node<{ number: number }, 'infectious'>;
// type NonInfectiousNode = Node<{ number: number }, 'Non-infectious'>;

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

  function createNewNode(e: React.FormEvent<HTMLFormElement>) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.currentTarget;
    const formData = new FormData(form);
    const id = String(formData.get("Id") ?? "");
    const label = formData.get("Label");
    const value = formData.get("Value");
    const infectious = formData.get("Infectious");
    setNodes((nodes) => [...nodes, { id: id, position: { x: 50, y: 50 }, data: { label: id+"_"+label, value: value, infectious: infectious} }]);
    e.currentTarget.reset();
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
    [nodes, edges],
  );

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  function onEdgeValueChange(id: string, e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
  }

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
        <div className={showModal ? '' : 'hidden'}>
          <form onSubmit={createNewNode} className='flex flex-col items-start gap-2 m-5'>
            <div className='flex gap-3'>
              <input name="Id" className='border p-2 rounded-2xl' required placeholder='Id' />
              <select name="Label" className='border p-3 rounded-2xl' required>
                <option value="S">S</option>
                <option value="I">I</option>
                <option value="R">R</option>
              </select>
              <select name="Infectious" className='border p-3 rounded-2xl' required>
                <option value="True">Infectious</option>
                <option value="False">Non-Infectious</option>
              </select>
              <input name="Value" className='border p-2 rounded-2xl' required placeholder='Value' />
            </div>
            <button type="submit" className='select-none cursor-pointer border p-2 rounded-2xl'>Add Compartment</button>
          </form>
        </div>
        <div className='grid grid-cols-2'>
          <div className='m-5'>
            <p>Compartments</p>
            {nodes.map((node) => 
              <div key={node.id} className='border-b p-2'>
                <p>Id: {node.id}</p>
                <p>Label: {typeof node.data.symbol === 'string' ? node.data.symbol : 'None'}</p>
                <p>Label: {typeof node.data.name === 'string' ? node.data.name : 'None'}</p>
                <p>Value: {typeof node.data.value === 'string' ? node.data.value : 'None'}</p>
                Value: 
                <input
                  name="Value"
                  value={typeof node.data?.value === 'string' ? node.data.value : 'None'}
                  className='border-b'
                  onChange={e => onEdgeValueChange(node.id, e)}
                />
              </div>
            )}
          </div>
          <div className='m-5'>
            <p>Flow</p>
            {edges.map((edge) => 
              <div key={edge.id} className='border-b p-2'>
                <p>Id: {edge.id}</p>
                <p>Source: {edge.source}</p>
                <p>Target: {edge.target}</p>
                <p>Value: {typeof edge.data?.value === 'string' ? edge.data.value : 'None'}</p>
                Value: 
                <input
                  name="Value"
                  value={typeof edge.data?.value === 'string' ? edge.data.value : 'None'}
                  className='border-b'
                  onChange={e => onEdgeValueChange(edge.id, e)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}