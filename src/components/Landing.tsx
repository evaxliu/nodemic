import Link from "next/link";

export default function Landing() {
  return (
    <div className="flex flex-col md:flex-row flex-wrap gap-8 md:gap-10 max-w-6xl mx-auto px-4 sm:px-8 py-8 md:py-11 justify-between text-gray-900">
      <div className="flex flex-col items-start gap-3.5 flex-1 md:min-w-sm max-w-xl">
        <p className="font-mono font-medium text-xs tracking-wider text-slate-500">
          COMPARTMENTAL EPIDEMIC MODELS · BROWSER-NATIVE
        </p>
        <h1 className="font-sans font-semibold text-2xl md:text-3xl leading-snug tracking-tight text-balance">
          A visual editor for compartmental epidemic models.
        </h1>
        <p className="font-sans text-base/relaxed text-slate-600 text-pretty">
          Build SIR, SEIR, and custom compartment structures on a canvas: compartments are boxes, flows are arrows carrying rate parameters. The system of ODEs is solved numerically in the browser and the solution redraws as parameters change. A model&apos;s full specification — structure, parameters, and stated assumptions — is encoded in its URL, so it can be shared, opened, and forked without any installation.
        </p>
        <Link
          href="/model"
          className="bg-cyan-800 hover:bg-cyan-900 text-white font-semibold px-3 py-1.5 rounded-xs"
        >
          Open Editor
        </Link>
      </div>
      <img
        src="/preview.png"
        alt="Editor preview"
        className="object-contain w-full md:w-md max-w-full self-start"
      />
    </div>
  );
}