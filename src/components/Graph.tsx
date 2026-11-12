"use client"
import React, { useMemo } from 'react';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { type CompartmentNode } from './CustomNode';
import { type FlowEdge } from './CustomEdge';
import { calculate } from '@/lib/model_equations';

interface Props { nodes: CompartmentNode[], edges: FlowEdge[], days: number }

export default function Graph({nodes, edges, days} : Props) {
  const dt = 0.1
  const d = days
  const compiled = useMemo(() => {
    // [99995, 5, 0]
    const compartmentValues: number[] = []

    // { n1: 0, n2: 1, n3: 2 }
    const cIdToIdx: Record<string, number> = {}

    // set(1)
    const infectiousC = new Set<number>();

    // { n1: S, n2: I, n3: R }
    // Id -> Symbol
    const cIdSymbol: Record<string, string> = {}

    for (let i = 0; i < nodes.length; i++) {
      compartmentValues.push(nodes[i].data.value)
      cIdToIdx[nodes[i].id] = i
      if (nodes[i].data.infectious) {
        infectiousC.add(i)
      }
      cIdSymbol[nodes[i].id] = nodes[i].data.name
    }

    // [{ from: 0, to: 1, rate: 0.3, infection: true }]
    const flowRates: { from: number, to: number, rate: number, infection: boolean }[] = []

    for (let i = 0; i < edges.length; i++) {
      const data = edges[i].data;
      if (data !== undefined) {
        flowRates.push({ from: cIdToIdx[edges[i].source], to: cIdToIdx[edges[i].target], rate: data.value, infection: (data.kind === "Infection") })
      }
    }

    // console.log(compartmentValues)
    // console.log(cIdToIdx)
    // console.log(flowRates)

    return {dt: dt, days: d, cVals: compartmentValues, cIdToIdx: cIdToIdx, flowRates: flowRates, infC: infectiousC, cIdSym: cIdSymbol }
  }, [d, nodes, edges])

  const data = calculate(compiled)

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