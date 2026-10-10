import { Edge, Node } from '@xyflow/react';
import { useCallback } from 'react';

type InspectorProps = {nodes: Node[], edges: Edge[]}

export default function Inspector({nodes, edges} : InspectorProps) {

  const changeEdgeValue = useCallback((id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log(e.currentTarget.value);
  }, []);

  const changeNodeValue = useCallback((id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log(e.currentTarget.value);
  }, []);

  return (
    <div>
      Inspector
      <div className='grid grid-cols-2'>
          <div className='m-5'>
            <p>Compartments</p>
            {nodes.map((node) => 
              <div key={node.id} className='border-b p-2'>
                <p>Id: {node.id}</p>
                <p>Symbol: {typeof node.data.symbol === 'string' ? node.data.symbol : 'None'}</p>
                <p>Name: {typeof node.data.name === 'string' ? node.data.name : 'None'}</p>
                <label htmlFor="text">Value:</label>
                <input
                  name="node_val"
                  defaultValue={typeof node.data?.value === 'string' ? node.data.value : 'None'}
                  className='border-b px-1'
                  onChange={e => changeNodeValue(node.id, e)}
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
                <label htmlFor="text">Value:</label>
                <input
                  name="edge_val"
                  defaultValue={typeof edge.data?.value === 'string' ? edge.data.value : 'None'}
                  className='border-b px-1'
                  onChange={e => changeEdgeValue(edge.id, e)}
                />
              </div>
            )}
          </div>
        </div>
    </div>
  );
}