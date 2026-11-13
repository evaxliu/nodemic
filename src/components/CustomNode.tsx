import { Handle, Node, NodeProps, Position, useReactFlow } from '@xyflow/react';

// Initialize data types stored in compartment
export type CompartmentNode = Node<{
  name: string, symbol: string, value: number, infectious: boolean 
}, 'custom-node'>;

// Symbol colors for compartments and graph lines
export const compartmentColors: Record<string, { badge: string; line: string }> = {
  S: { badge: 'bg-blue-300 text-blue-950', line: '#3b82f6' },
  E: { badge: 'bg-amber-300 text-amber-950', line: '#f59e0b' },
  I: { badge: 'bg-red-300 text-red-950', line: '#ef4444' },
  R: { badge: 'bg-emerald-300 text-emerald-950', line: '#10b981' },
  D: { badge: 'bg-gray-400 text-gray-950', line: '#6b7280' },
  V: { badge: 'bg-violet-300 text-violet-950', line: '#8b5cf6' },
};

// Future feature: have user pick their own colors

export default function CustomNode({ data, isConnectable, selected, id } : NodeProps<CompartmentNode>) {
  // Visual indication if node selected
  const stateClasses = selected
    ? 'border-[#A47DAB]'
    : 'border-[#303238] hover:border-[#7a7d86] in-focus:border-[#5f6470]';

  // Assign colors for each compartment type
  const badgeColor = compartmentColors[data?.symbol]?.badge ?? 'bg-gray-300 text-gray-950';

  // Init hook to handle changes to node
  const reactFlow = useReactFlow();

  // Handle node value change
  const handleValueChange = (id: string, e: number) => {
    reactFlow.updateNodeData(id, { value: e })
  }

  return (
    <div className={`min-w-10 rounded-sm border bg-[#1a1b1e] text-left text-[8px] text-white ${stateClasses}`}>
      <Handle
        type="target"
        position={Position.Top}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      <div className='flex items-center gap-1.5 px-2 py-1.5'>
        <p className={`px-1 font-mono font-semibold ${badgeColor}`}>{data.symbol}</p>
        <p className='font-semibold'>{data.name}</p>
      </div>
      <div className='flex items-center justify-between border-t border-[#303238] px-2 py-1.5'>
        <input 
          name="value"
          defaultValue={data.value}
          className="nodrag"
          type="number"
          min="0"
          step="any"
          onChange={(e) => handleValueChange(id, Number(e.target.value))}
        />
        <p className='text-gray-400'>{data.infectious ? "Infectious" : "Non-Infectious"}</p>
      </div>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
}