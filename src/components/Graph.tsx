"use client"
import React, { useEffect, useMemo } from 'react';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { type CompartmentNode } from './CustomNode';
import { type FlowEdge } from './CustomEdge';
import { calculate } from '@/lib/model_equations';

interface Props { nodes: CompartmentNode[], edges: FlowEdge[], days: number }

type NodeKey = [id: string, value: number, infectious: boolean, name: string]
type EdgeKey = [source: string, target: string, rate: number, kind: string]

export default function Graph({nodes, edges, days} : Props) {
  // Make node and edges string because string can still be equal even if rebuilt. Doesn't recompile like objects do when rebuilt.
  // No recompile for every repositioning of compartment, performance im provement
  const nodeSig = JSON.stringify(
    nodes.map((n): NodeKey => [n.id, n.data.value, n.data.infectious, n.data.name])
  )
  const edgeSig = JSON.stringify(
    edges
      .filter((e) => e.data !== undefined)
      .map((e): EdgeKey => [e.source, e.target, e.data!.value, e.data!.kind])
  )

  const dt = 0.1
  const d = days
  const compiled = useMemo(() => {
    const storeNodes: NodeKey[] = JSON.parse(nodeSig)
    const storeEdges: EdgeKey[] = JSON.parse(edgeSig)

    // [99995, 5, 0]
    const compartmentValues: number[] = []
    // { n1: 0, n2: 1, n3: 2 }
    const cIdToIdx: Record<string, number> = {}
    // set(1)
    const infectiousC = new Set<number>();
    // { n1: S, n2: I, n3: R }
    // Id -> Symbol
    const cIdSymbol: Record<string, string> = {}

    for (let i = 0; i < storeNodes.length; i++) {
      const [id, value, infectious, name] = storeNodes[i]
      compartmentValues.push(value)
      cIdToIdx[id] = i
      if (infectious) {
        infectiousC.add(i)
      }
      cIdSymbol[id] = name
    }

    // [{ from: 0, to: 1, rate: 0.3, infection: true }]
    const flowRates: { from: number, to: number, rate: number, infection: boolean }[] = []

    for (const [source, target, rate, kind] of storeEdges) {
      flowRates.push({
        from: cIdToIdx[source],
        to: cIdToIdx[target],
        rate: rate,
        infection: (kind === "Infection")
      })
    }

    return {dt: dt, days: d, cVals: compartmentValues, cIdToIdx: cIdToIdx, flowRates: flowRates, infC: infectiousC, cIdSym: cIdSymbol }
  }, [d, nodeSig, edgeSig])

  const data = useMemo(() => {
    return calculate(compiled)
  }, [compiled])

  return (
    <>
      <p className='m-5'>
        Static Sample SIR Model Graph
      </p>
      <LineChart
        style={{ width: '100%', aspectRatio: 1.618, maxWidth: 500 }}
        responsive
        data={data}
        margin={{
          top: 20,
          right: 20,
          bottom: 30,
          left: 20,
        }}
      >
        <CartesianGrid />
        {Object.keys(data[0])
        .filter((key) => key !== "day")
        .map((key) => (
          <Line key={key} type="monotone" dataKey={key} strokeWidth={2} name={key} stroke='blue' dot={false}/>
        ))}
        <XAxis dataKey="day" label={{ value: 'Time (Days)', position: 'bottom' }} />
        <YAxis width="auto" label={{ value: 'Pop', position: 'insideLeft', angle: -90 }} />
        <Legend itemSorter={null} position="top"/>
        <Tooltip />
      </LineChart>
    </>
  );
}