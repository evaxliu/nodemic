// Euler method
export default function euler_method(S: number, I: number, R: number, totalPopN: number, beta: number, gamma: number, unitOfTime_t: number, SIRPerDay: number[][]) {
  for(let i = 1; i < 160; i += unitOfTime_t) {
    const infectedArrow = (I * beta * (S/totalPopN))
    const plainArrow = (I * gamma)
    // S ← S + dS · dt
    S = S - infectedArrow
    // I ← I + dI · dt
    I = I + infectedArrow - plainArrow
    // R ← R + dR · dt
    R = R + plainArrow
    SIRPerDay.push([S, I, R, S+I+R])
  }
  return SIRPerDay
};

// RK4