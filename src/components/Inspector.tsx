import { Edge, Node} from '@xyflow/react';

type InspectorProps = { nodes: Node[], edges: Edge[] }

export default function Inspector({nodes, edges} : InspectorProps) {
  const idToName = new Map<string, string>;
  for (const node of nodes) {
    idToName.set(node.id, typeof node.data.name === 'string' ? node.data.name : 'None')
  }

  return (
    <div className='p-4 text-gray-900 m-5 border-t'>
      <div className='mt-3 grid grid-cols-2 gap-6 text-gray-700'>
          <div className='flex flex-col gap-2'>
            <p className='text-gray-500'>Compartments</p>
            {nodes.map((node) => 
              <div key={node.id} className={`space-y-1 rounded-md px-3 py-2 ${node.data.infectious ? 'bg-red-50' : 'bg-emerald-50'}`}>
                <p className='text-gray-400'>Id: {node.id}</p>
                <p className={node.data.infectious ? 'text-red-700' : 'text-emerald-700'}>Type: {typeof node.data.infectious === 'boolean' ? (node.data.infectious ? 'Infectious' : 'Non-infectious') : 'None' }</p>
                <p>Symbol: {typeof node.data.symbol === 'string' ? node.data.symbol : 'None'}</p>
                <p>Name: {typeof node.data.name === 'string' ? node.data.name : 'None'}</p>
                <p>Value: {typeof node.data.value === 'string' ? node.data.value : 'None'}</p>
              </div>
            )}
          </div>
          <div className='flex flex-col gap-2'>
            <p className='text-gray-500'>Flows</p>
            {edges.map((edge) => 
              <div key={edge.id} className='space-y-1 rounded-md bg-gray-50 px-3 py-2'>
                <p className='text-gray-400'>Id: {edge.id}</p>
                <p>Flow: {idToName.get(edge.source)} → {idToName.get(edge.target)}</p>
                <p>Value: {typeof edge.data?.value === 'string' ? edge.data.value : 'None'}</p>
              </div>
            )}
          </div>
        </div>
    </div>
  );
}