// Euler

import { Compartment } from '@/components/Graph';

// Data will be in the form of Object
// const sampleData = [
//   { day: 0, s: 600, i: 1, r: 1 },
//   { day: 10, s: 500, i: 10, r: 25 },
//   { day: 20, s: 300, i: 40, r: 100 },
//   { day: 30, s: 200, i: 90, r: 200 },
//   { day: 40, s: 100, i: 40, r: 300 },
//   { day: 50, s: 25, i: 10, r: 500 },
//   { day: 60, s: 10, i: 1, r: 600 },
// ];

type calculateProps = {
  dt: number;
  days: number;
  compartments: Compartment[];
  flowRates: {
      from: number;
      to: number;
      rate: number;
      infection: boolean;
  }[];
}

export function calculate(compiled: calculateProps) {
  const flows = compiled.flowRates
  const comparts = compiled.compartments

  // Current value of each compartment, same order as comparts.
  // A separate array of numbers so the math never changes the compartment objects.
  const values: number[] = []
  for (let i = 0; i < comparts.length; i++) {
    values.push(comparts[i].value)
  }

  const data = []
  data.push(initializeData(comparts))

  // Calculate changes for each step - Euler
  for (let step = 0; step < compiled.days/compiled.dt; step++) {
    // Calculate current day based on current step
    const day = (step + 1) * compiled.dt

    // Calculate total population (sum of all compartments)
    let N = 0
    // Calculate total infectious (sum of all infectious compartments)
    // Infectious total = total of all infectious compartments
    let infTotal = 0
    for (let i = 0; i < comparts.length; i++) {
      N += values[i]
      if (comparts[i].infectious) {
        infTotal += values[i]
      }
    }

    // Changes to each compartment value
    // Changes subtract from source, add to target
    const change = Array<number>(comparts.length).fill(0);

    // S→I = 0.3 × 99,995 × (5 ÷ 100,000) ≈ 1.5
    // I→R = 0.1 × 5 = 0.5
    // flow source -> flow target (infection) = flow rate * flow source pop * (infectious total / total pop)
    // flow source -> flow target (simple) = flow rate * flow source
    for (let i = 0; i < flows.length; i++) {
      // Source index
      const sIdx = flows[i].from
      // Target index
      const tIdx = flows[i].to

      // Compartment change
      let dCompartment = 0

      // Calculation infection vs not infection flow
      if (flows[i].infection) {
        let infShare = 0
        if (N > 0) {
          infShare = infTotal / N
        }
        dCompartment = flows[i].rate * values[sIdx] * (infShare) * compiled.dt
      } else {
        dCompartment = flows[i].rate * values[sIdx] * compiled.dt
      }

      // Changes subtract from source, add to target
      change[sIdx] -= dCompartment
      change[tIdx] += dCompartment
    }
    
    // Data row for graph
    const row: Record<string, number> = { day: day }
    
    // Apply changes to vals
    for (let i = 0; i < change.length; i++) {
      values[i] += change[i]
      row[comparts[i].name] = values[i]
    }

    // Only add data for full days, not partial days
    if ((step + 1) % Math.round(1 / compiled.dt) === 0) {
      data.push(row)
    }
  }

  return data
}

function initializeData(comparts: Compartment[]) {
  const row: Record<string, number> = { day: 0 }
  for (let i = 0; i < comparts.length; i++) {
    row[comparts[i].name] = comparts[i].value
  }
  return row
}