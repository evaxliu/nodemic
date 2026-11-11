"use client"
import React, { useMemo } from 'react';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { type CompartmentNode } from './CustomNode';
import { type FlowEdge } from './CustomEdge';

const data = [
  { day: 0, s: 600, i: 1, r: 1 },
  { day: 10, s: 500, i: 10, r: 25 },
  { day: 20, s: 300, i: 40, r: 100 },
  { day: 30, s: 200, i: 90, r: 200 },
  { day: 40, s: 100, i: 40, r: 300 },
  { day: 50, s: 25, i: 10, r: 500 },
  { day: 60, s: 10, i: 1, r: 600 },
];

// Data will be in the form of JSON

interface Props { nodes: CompartmentNode[], edges: FlowEdge[], days: number }

export default function Graph({nodes, edges, days} : Props) {
  const dt = 0.1
  const d = days
  const cachedValue = useMemo(() => {
    const data: number[] = []
    for (let i = 0; i < nodes.length; i++) {
      console.log(nodes[i])
      if (typeof nodes[i].data.value === 'number') {
        data.push(nodes[i].data.value)
      }
    }
    return data
  }, [nodes, edges])
    
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