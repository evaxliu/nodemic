'use client'
import React, { useMemo } from 'react';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { compartmentColors, type CompartmentNode } from './CustomNode';
import { type FlowEdge } from './CustomEdge';
import { calculate } from '@/lib/model_equations';

interface Props { nodes: CompartmentNode[], edges: FlowEdge[], days: number }

export type Compartment = { id: string; name: string; symbol: string; value: number; infectious: boolean }
type Flow = { from: string; to: string; rate: number; infection: 'Infection' | 'Simple' }

export default function Graph({ nodes, edges, days } : Props) {
  // Make node and edges string because string can still be equal even if rebuilt. Doesn't recompile like objects do when rebuilt.
  // No recompile for every repositioning of compartment, performance im provement
  const nodeSig = JSON.stringify(
    nodes.map((n): Compartment => ({ id: n.id, name: n.data.name, symbol: n.data.symbol, value: n.data.value, infectious: n.data.infectious}))
  )
  const edgeSig = JSON.stringify(
    edges
      .filter((e) => e.data !== undefined)
      .map((e): Flow => ({ from: e.source, to: e.target, rate: e.data!.value, infection: e.data!.kind}))
  )

  // Compile data for equations to use
  const compiled = useMemo(() => {
    // [ {id: 'n1', name: 'Susceptible', symbol: 'S', value: 99995, infectious: false} ]
    const storeNodes: Compartment[] = JSON.parse(nodeSig)
    // [ {from: 'n1', to: 'n2', rate: 0.3, infection: 'Infection'} ]
    const storeEdges: Flow[] = JSON.parse(edgeSig)

    // Init how many days the model displays
    const d = days
    // Init how many steps are taken
    const dt = 0.1

    // [{ from: 0, to: 1, rate: 0.3, infection: true }]
    const flowRates: { from: number, to: number, rate: number, infection: boolean }[] = []

    for (const edge of storeEdges) {
      flowRates.push({
        from: storeNodes.findIndex((c) => c.id === edge.from),
        to: storeNodes.findIndex((c) => c.id === edge.to),
        rate: edge.rate,
        infection: (edge.infection === 'Infection')
      })
    }

    return {dt: dt, days: d, compartments: storeNodes, flowRates: flowRates }
  }, [nodeSig, edgeSig, days])

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
        {compiled.compartments.map((c) => (
          <Line
            key={c.id}
            type='monotone'
            dataKey={c.name}
            strokeWidth={2}
            name={c.name}
            stroke={compartmentColors[c.symbol]?.line ?? '#6b7280'}
            dot={false}
          />
        ))}
        <XAxis dataKey='day' type='number' label={{ value: 'Time (Days)', position: 'bottom' }} />
        <XAxis
          dataKey="day"
          type="number"
          domain={[0, days]}
          allowDataOverflow
          label={{ value: 'Time (Days)', position: 'bottom' }}
        />
        <YAxis
          width='auto'
          label={{ value: 'Pop', position: 'insideLeft', angle: -90, }}
          tickFormatter={(value: number) => {
            if (value >= 1_000_000_000) {
              return value / 1_000_000_000 + "B";
            }
            if (value >= 1_000_000) {
              return value / 1_000_000 + "M";
            }
            if (value >= 1000) {
              return value / 1000 + "k";
            }
            return String(value);
          }}
        />
        <Legend 
          itemSorter={(item) => {
            const index = compiled.compartments.findIndex((c) => c.name === String(item.dataKey));
            return index !== -1 ? index : 999
          }}
          position='top'
        />
        <Tooltip 
          position={{ x: 500, y: 100 }}
          allowEscapeViewBox={{ x: true, y: true }}
          active
          formatter={(val) => typeof val === 'number' ? val.toFixed(2) : val}
          itemSorter={(item) => {
            const index = compiled.compartments.findIndex((c) => c.name === String(item.dataKey));
            return index !== -1 ? index : 999
          }}
        />
      </LineChart>
    </>
  );
}