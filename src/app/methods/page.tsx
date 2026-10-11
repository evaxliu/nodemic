import Landing from "@/components/Landing";
import NavBar from "@/components/NavBar";
import Image from "next/image";
import Link from "next/link";

const equations = [
  { variable: "S", rightSide: "−βSI" },
  { variable: "I", rightSide: "βSI − γI" },
  { variable: "R", rightSide: "γI" },
];

export default function Methods() {
  return (
    <div className="flex flex-col">
      <NavBar />
      <div className="flex flex-col md:flex-row flex-wrap gap-8 md:gap-10 max-w-6xl mx-auto px-4 sm:px-8 py-8 md:py-11 justify-between text-gray-900">
        <div className="flex flex-col items-start gap-3.5 flex-1 md:min-w-sm max-w-xl">
          <p className="font-mono font-medium text-xs tracking-wider text-slate-500">
            Simple deterministic models
          </p>
          <h1 className="font-semibold text-2xl md:text-3xl leading-snug tracking-tight text-balance">
            SIR model
          </h1>
          <p className="text-base/relaxed text-slate-600 text-pretty">
            The SIR model sorts a closed population into three groups: susceptible
            (<i><b>S</b></i>), infected (<i><b>I</b></i>), and recovered
            (<i><b>R</b></i>). Kermack and McKendrick introduced it in 1927, and most
            compartmental models build on it <a href="#ref-1">[1]</a>.
          </p>

          <p className="text-base/relaxed text-slate-600 text-pretty">
            Susceptible individuals become infected at a per-capita rate{" "}
            <i><b>βI</b></i>, so infection spreads faster as more people are infected.
            Infected individuals recover at a per-capita rate <i><b>γ</b></i>{" "}
            <a href="#ref-2">[2]</a>.
          </p>

          <h2 className="font-sans font-semibold text-xl">Equations</h2>
          <div className="flex flex-col gap-2 w-full text-center italic text-slate-600">
            {equations.map((equation) => (
              <p key={equation.variable}>
                <span className="inline-flex flex-col items-center align-middle">
                  <span className="border-b border-current px-1">d{equation.variable}</span>
                  <span className="px-1">dt</span>
                </span>{" "}
                = {equation.rightSide}
              </p>
            ))}
          </div>

          <ol className="text-base/relaxed text-slate-600 list-decimal pl-5">
            <li id="ref-1">
              Kermack WO, McKendrick AG. A contribution to the mathematical theory of
              epidemics. Proc R Soc A. 1927;115(772):700-721.{" "}
              <a href="https://doi.org/10.1098/rspa.1927.0118">doi:10.1098/rspa.1927.0118</a>
            </li>
            <li id="ref-2">
              Frost S. SIR model. Epirecipes Epicookbook. 2018.{" "}
              <a href="https://epirecip.es/epicookbook/chapters/sir/intro">epirecip.es</a>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
