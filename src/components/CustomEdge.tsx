import { BaseEdge, type EdgeProps, type Edge, EdgeText, getBezierPath } from '@xyflow/react';
 
type CustomEdge = Edge<{ value: string }, 'custom'>;
 
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
                stroke: '#FFCC00',
                fill: '#FFCC00',
              }}
              strokeLinecap="round"
              strokeLinejoin="round"
              points="-5,-4 0,0 -5,4 -5,-4"
            />
          </marker>
        </defs>
      </svg>
      <BaseEdge id={id} path={edgePath} markerEnd={activeMarkerEnd} label={data?.value} />
      <EdgeText x={labelX} y={labelY} label={data?.value} />
    </>
  );
}