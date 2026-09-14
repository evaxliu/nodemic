
export default function Landing() {
  return (
    <div className="flex px-10 md:px-30 lg:px-50 py-5 gap-5">
      <div className="flex flex-col items-start p-10 w-4xl gap-4">
        <p className="font-[IBM Plex Mono]">COMPARTMENTAL EPIDEMIC MODELS · BROWSER-NATIVE</p>
        <h1 className="font-[IBM Plex Sans] font-semibold text-3xl">
          A visual editor for compartmental epidemic models.
        </h1>
        <p className="font-[IBM Plex Sans]">
          Build SIR, SEIR, and custom compartment structures on a canvas: compartments are boxes, flows are arrows carrying rate parameters. The system of ODEs is solved numerically in the browser and the solution redraws as parameters change. A model's full specification — structure, parameters, and stated assumptions — is encoded in its URL, so it can be shared, opened, and forked without any installation.
        </p>
      </div>
      <img src="/preview.png" alt="image" className="object-contain h-150 p-10" />
    </div>
  );
}