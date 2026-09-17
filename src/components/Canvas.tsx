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
} from '@xyflow/react';
import CustomEdge from './CustomEdge';

// type InfectiousNode = Node<{ number: number }, 'infectious'>;
// type NonInfectiousNode = Node<{ number: number }, 'Non-infectious'>;

const edgeTypes = {
  'custom': CustomEdge,
};

const initialNodes: Node[] = [
  { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'S' } },
  { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'I' } },
];
const initialEdges: Edge[] = [{ id: 'n1-n2', source: 'n1', target: 'n2', data: { value: "23" }, type: 'custom', }];

export default function Canvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

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
    <div className='flex'>
      <div style={{ width: '60vw', height: '100vh' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodesDelete={onNodesDelete}
          onConnect={onConnect}
          fitView
          colorMode="dark"
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>
      <div className='flex flex-col grow items-start'>
        <form onSubmit={createNewNode} className='flex flex-col items-start gap-2 m-5'>
          <div className='flex'>
            <input name="Id" className='border p-2 rounded-2xl' required placeholder='Id' />
            <select name="Label" className='border p-3 rounded-2xl' required>
              <option value="S">S</option>
              <option value="I">I</option>
              <option value="R">R</option>
            </select>
            <select name="Infectious" className='border p-3 rounded-2xl' required>
              <option value="True">True</option>
              <option value="False">False</option>
            </select>
            <input name="Value" className='border p-2 rounded-2xl' required placeholder='Value' />
          </div>
          <button type="submit" className='select-none cursor-pointer border p-2 rounded-2xl'>Add Compartment</button>
        </form>
        {/* <button 
          onClick={() => createNewNode()} 
          className='select-none cursor-pointer border m-5 p-2 rounded-2xl'
        >
          Add Compartment
        </button> */}
        <div className='m-5'>
          {nodes.map((node) => 
            <div key={node.id} className='border-b p-2'>
              <p>Id: {node.id}</p>
              <p>Label: {typeof node.data.label === 'string' ? node.data.label : 'None'}</p>
              <p>Value: {typeof node.data.value === 'string' ? node.data.value : 'None'}</p>
            </div>
          )}
        </div>
        <div className='m-5'>
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
  );
}