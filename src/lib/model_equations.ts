// Euler

type calculateProps = {
  dt: number;
  days: number;
  cVals: number[];
  cIdToIdx: Record<string, number>;
  flowRates: { from: number, to: number, rate: number, infection: boolean }[];
  infC: Set<number>;
  cIdSym: Record<string, string>;
}

// Data will be in the form of Object
const sampleData = [
  { day: 0, s: 600, i: 1, r: 1 },
  { day: 10, s: 500, i: 10, r: 25 },
  { day: 20, s: 300, i: 40, r: 100 },
  { day: 30, s: 200, i: 90, r: 200 },
  { day: 40, s: 100, i: 40, r: 300 },
  { day: 50, s: 25, i: 10, r: 500 },
  { day: 60, s: 10, i: 1, r: 600 },
];

export function calculate(compiled: calculateProps) {
  const flows = compiled.flowRates
  const cIdToIdx = compiled.cIdToIdx
  const cVals = [...compiled.cVals]
  const infC = compiled.infC
  const cIdSym = compiled.cIdSym

  const data = []
  data.push(initializeData(cIdSym, cIdToIdx, cVals))
  console.log(data)

  // Calculate changes for each step - Euler
  for (let step = 0; step < compiled.days/compiled.dt; step++) {
    // Calculate total population (sum of all compartments)
    let N = 0
    for (const val of cVals) {
      N += val
    }

    // Calculate total infectious (sum of all infectious compartments)
    // Infectious total = total of all infectious compartments
    let infTotal = 0
    for (let i = 0; i < cVals.length; i++) {
      if (infC.has(i)) {
        infTotal += cVals[i]
      }
    }

    // Calculate current day based on current step
    const day = (step + 1) * compiled.dt
    console.log(day)

    // Changes to each compartment value
    // Changes subtract from source, add to target
    const change = Array<number>(cVals.length).fill(0);

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
        dCompartment = flows[i].rate * cVals[sIdx] * (infTotal / N) * compiled.dt
      } else {
        dCompartment = flows[i].rate * cVals[sIdx] * compiled.dt
      }

      // Changes subtract from source, add to target
      change[sIdx] -= dCompartment
      change[tIdx] += dCompartment
    }

    // Apply changes to vals
    for (let i = 0; i < change.length; i++) {
      cVals[i] += change[i]
    }

    // Only add data for full days, not partial days
    if ((step + 1) % Math.round(1 / compiled.dt) === 0) {
      // Data row
      const row: Record<string, number> = { day: day }

      // Compartment id -> new compartment value
      // Add to row to push to data for graphing
      for (const k in cIdToIdx) {
        const idx = cIdToIdx[k]
        row[cIdSym[k]] = cVals[idx]
        console.log(cIdSym[k])
      }
      data.push(row)
    }
  }

  return data
}

function initializeData(cIdSym: Record<string, string>, cIdToIdx: Record<string, number>, cVals: number[]) {
  const row: Record<string, number> = { day: 0 }
  for (const k in cIdToIdx) {
    const idx = cIdToIdx[k]
    row[cIdSym[k]] = cVals[idx]
  }
  return row
}