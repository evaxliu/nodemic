import { Handle, Node, NodeProps, Position } from '@xyflow/react';
import { useCallback } from 'react';

type CustomNode = Node<{ name: string, symbol: string, value: number, infectious: boolean }, 'custom'>;

const badgeColors: Record<string, string> = {
  S: 'bg-blue-300 text-blue-950',
  I: 'bg-red-300 text-red-950',
  R: 'bg-emerald-300 text-emerald-950',
};

export default function CustomNode({ data, isConnectable, selected } : NodeProps<CustomNode>) {
  const stateClasses = selected
    ? 'border-[#A47DAB]'
    : 'border-[#303238] hover:border-[#7a7d86] in-focus:border-[#5f6470]';
  const badgeColor = badgeColors[data?.symbol] ?? 'bg-gray-300 text-gray-950';
  // const onChange = useCallback((evt) => {
  //   console.log(evt.target.value);
  // }, []);

  return (
    <div className={`min-w-28 rounded-sm border bg-[#1a1b1e] text-left text-[8px] text-white ${stateClasses}`}>
      <Handle
        type="target"
        position={Position.Top}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      <div className='flex items-center gap-1.5 px-2 py-1.5'>
        <p className={`px-1 font-mono font-semibold ${badgeColor}`}>{data?.symbol}</p>
        <p className='font-semibold'>{data?.name}</p>
      </div>
      <div className='flex items-center justify-between gap-3 border-t border-[#303238] px-2 py-1.5'>
        <p className='font-mono'>{data?.value}</p>
        <p className='text-gray-400'>{data?.infectious ? "Infectious" : "Non-Infectious"}</p>
      </div>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
    // <div className="text-updater-node">
      
    //   <div>
    //     <label htmlFor="text">Text:</label>
    //     {/* <input id="text" name="text" onChange={onChange} className="nodrag" /> */}
    //   </div>
    // </div>
  );
}