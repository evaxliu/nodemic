import { BaseEdge, type EdgeProps, type Edge, getBezierPath, useReactFlow, EdgeLabelRenderer } from '@xyflow/react';

// Initialize data types stored in edge
export type FlowEdge = Edge<{ value: number, kind: 'Infection' | 'Simple' }, 'custom-edge'>;
 
export default function CustomEdge({ id, sourceX, sourceY, targetX, targetY, data, selected, markerEnd }: EdgeProps<FlowEdge>) {
  // Create arrow style
  const [edgePath, labelX, labelY] = getBezierPath({ sourceX, sourceY, targetX, targetY });

  // Visual indication if arrow selected
  const activeMarkerEnd = selected ? 'url(#selected-marker)' : markerEnd;

  // Boolean if flow infection
  const isInfection = data?.kind === 'Infection';

  // Init hook to handle changes to edge
  const reactFlow = useReactFlow();

  // Handle edge value change
  const handleValueChange = (id: string, e: number) => {
    reactFlow.updateEdgeData(id, { value: e })
  }

  const handleKindChange = (id: string, e: 'Infection' | 'Simple') => {
    reactFlow.updateEdgeData(id, { kind: e })
  }

  return (
    <>
      <svg style={{ position: 'absolute', top: 0, left: 0 }}>
        <defs>
          <marker
            className="react-flow__arrowhead"
            id="selected-marker"
            markerWidth="20"
            markerHeight="20"
            viewBox="-10 -10 20 20"
            markerUnits="userSpaceOnUse"
            orient="auto-start-reverse"
            refX="0"
            refY="0"
          >
            <polyline
              className="arrowclosed"
              style={{
                strokeWidth: 1,
                stroke: '#A47DAB',
                fill: '#A47DAB',
              }}
              strokeLinecap="round"
              strokeLinejoin="round"
              points="-5,-4 0,0 -5,4 -5,-4"
            />
          </marker>
        </defs>
      </svg>
      <BaseEdge id={id} path={edgePath} markerEnd={activeMarkerEnd} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="edge-label-renderer__custom-edge nodrag nopan"
        >
          <div
            className={`flex items-center overflow-hidden rounded-md border bg-[#1b1d22] text-xs ${
              selected ? 'border-[#A47DAB]' : 'border-[#303238]'
            }`}
          >
            <input
              name="value"
              defaultValue={data?.value}
              className="nodrag w-12 bg-transparent px-2 py-1 text-center text-white outline-none"
              type="number"
              min="0"
              step="any"
              onChange={(e) => handleValueChange(id, Number(e.target.value))}
            />
            <button
              type="button"
              title={isInfection ? 'Infection flow (click for simple)' : 'Simple flow (click for infection)'}
              className={`nodrag border-l border-[#303238] px-1.5 py-1 font-mono font-semibold ${
                isInfection ? 'bg-red-300 text-red-950' : 'text-gray-400'
              }`}
              onClick={() => handleKindChange(id, isInfection ? 'Simple' : 'Infection')}
            >
              {isInfection ? 'INF' : 'SIM'}
            </button>
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}