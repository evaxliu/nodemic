import { getStraightPath, BaseEdge, type EdgeProps, type Edge, EdgeLabelRenderer } from '@xyflow/react';
 
type CustomEdge = Edge<{ value: number }, 'custom'>;
 
export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data
}: EdgeProps<CustomEdge>) {
  const [edgePath, labelX, labelY] = getStraightPath({ sourceX, sourceY, targetX, targetY });
 
  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        <p
          style={{
            position: 'absolute',
            transform: `translate(50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan text-white"
        >
          {data?.value}
        </p>
      </EdgeLabelRenderer>
    </>
  );
}