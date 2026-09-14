
export default function Landing() {
  return (
    <div className="">
      <p>COMPARTMENTAL EPIDEMIC MODELS · BROWSER-NATIVE</p>
      <h1>
        A visual editor for compartmental epidemic models.
      </h1>
      <p>
        Build SIR, SEIR, and custom compartment structures on a canvas: compartments are boxes, flows are arrows carrying rate parameters. The system of ODEs is solved numerically in the browser and the solution redraws as parameters change. A model's full specification — structure, parameters, and stated assumptions — is encoded in its URL, so it can be shared, opened, and forked without any installation.
      </p>
    </div>
  );
}