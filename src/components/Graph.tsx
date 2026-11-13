"use client"
import React, { useMemo } from 'react';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { compartmentColors, type CompartmentNode } from './CustomNode';
import { type FlowEdge } from './CustomEdge';
import { calculate } from '@/lib/model_equations';

interface Props { nodes: CompartmentNode[], edges: FlowEdge[], days: number }

type NodeKey = [id: string, value: number, infectious: boolean, name: string, symbol: string]
type EdgeKey = [source: string, target: string, rate: number, kind: string]

export default function Graph({nodes, edges, days} : Props) {
  // Make node and edges string because string can still be equal even if rebuilt. Doesn't recompile like objects do when rebuilt.
  // No recompile for every repositioning of compartment, performance im provement
  const nodeSig = JSON.stringify(
    nodes.map((n): NodeKey => [n.id, n.data.value, n.data.infectious, n.data.name, n.data.symbol])
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
    // { n1: Susceptible, n2: Infected, n3: Recovered }
    // Id -> Name
    const cIdName: Record<string, string> = {}
    // { n1: S, n2: I, n3: R }
    // Id -> Symbol
    const cIdSymbol: Record<string, string> = {}

    for (let i = 0; i < storeNodes.length; i++) {
      const [id, value, infectious, name, symbol] = storeNodes[i]
      compartmentValues.push(value)
      cIdToIdx[id] = i
      if (infectious) {
        infectiousC.add(i)
      }
      cIdName[id] = name
      cIdSymbol[id] = symbol
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

    return {dt: dt, days: d, cVals: compartmentValues, cIdToIdx: cIdToIdx, flowRates: flowRates, infC: infectiousC, cIdName: cIdName, cIdSym: cIdSymbol }
  }, [d, nodeSig, edgeSig])

  const data = useMemo(() => {
    return calculate(compiled)
  }, [compiled])

  return (
    <>
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
        {Object.keys(compiled.cIdName).map((id) => (
          <Line
            key={id}
            type="monotone"
            dataKey={compiled.cIdName[id]}
            strokeWidth={2}
            name={compiled.cIdName[id]}
            stroke={compartmentColors[compiled.cIdSym[id]]?.line ?? '#6b7280'}
            dot={false}
          />
        ))}
        <XAxis dataKey="day" type="number" label={{ value: 'Time (Days)', position: 'bottom' }} />
        <YAxis width="auto" label={{ value: 'Pop', position: 'insideLeft', angle: -90 }} />
        <Legend itemSorter={null} position="top"/>
        <Tooltip />
      </LineChart>
    </>
  );
}