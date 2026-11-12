"use client"
import React, { useMemo } from 'react';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { type CompartmentNode } from './CustomNode';
import { type FlowEdge } from './CustomEdge';
import { calculate } from '@/lib/model_equations';

// Data will be in the form of JSON
const data = [
  { day: 0, s: 600, i: 1, r: 1 },
  { day: 10, s: 500, i: 10, r: 25 },
  { day: 20, s: 300, i: 40, r: 100 },
  { day: 30, s: 200, i: 90, r: 200 },
  { day: 40, s: 100, i: 40, r: 300 },
  { day: 50, s: 25, i: 10, r: 500 },
  { day: 60, s: 10, i: 1, r: 600 },
];

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

    for (let i = 0; i < nodes.length; i++) {
      compartmentValues.push(nodes[i].data.value)
      cIdToIdx[nodes[i].id] = i
      if (nodes[i].data.infectious) {
        infectiousC.add(i)
      }
    }

    // [{ from: n1, to: n2, rate: 0.3, infection: true }]
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

    return {dt: dt, days: d, cVals: compartmentValues, cIdToIdx: cIdToIdx, flowRates: flowRates, infC: infectiousC }
  }, [d, nodes, edges])

  calculate(compiled)
    
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
        <Line type="monotone" dataKey="s" strokeWidth={2} name="S" stroke='blue' dot={false}/>
        <Line type="monotone" dataKey="i" strokeWidth={2} name="I" stroke='red' dot={false}/>
        <Line type="monotone" dataKey="r" strokeWidth={2} name="R" stroke='green' dot={false}/>
        <XAxis dataKey="day" label={{ value: 'Time (Days)', position: 'bottom' }} />
        <YAxis width="auto" label={{ value: 'Pop', position: 'insideLeft', angle: -90 }} />
        <Legend itemSorter={null} position="top"/>
        <Tooltip />
      </LineChart>
    </>
  );
}