import { BaseEdge, type EdgeProps, type Edge, getBezierPath, useReactFlow, EdgeLabelRenderer } from '@xyflow/react';
 
type CustomEdge = Edge<{ value: string }, 'custom-edge'>;
 
export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  selected,
  markerEnd
}: EdgeProps<CustomEdge>) {
  const [edgePath, labelX, labelY] = getBezierPath({ sourceX, sourceY, targetX, targetY });
  const activeMarkerEnd = selected ? 'url(#selected-marker)' : markerEnd;

  const reactFlow = useReactFlow();
  const handleValueChange = (id: string, e: string) => {
    reactFlow.updateEdgeData(id, { value: e })
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
          <input
            name="value"
            defaultValue={data?.value}
            className={`nodrag w-14 rounded-md border bg-[#1b1d22] px-2 py-1 text-center text-xs text-white outline-none focus:border-[#A47DAB] ${
              selected ? 'border-[#A47DAB]' : 'border-[#303238]'
            }`}
            onChange={(e) => handleValueChange(id, e.target.value)}
          />
        </div>
      </EdgeLabelRenderer>
    </>
  );
}