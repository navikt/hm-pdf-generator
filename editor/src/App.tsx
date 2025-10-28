import hotsakImg from "./assets/hotsak.png";

import "./App.css";
import { Button } from "@navikt/ds-react";
import { Brev } from "./brev/Brev.tsx";

function App() {
  return (
    <div
      style={{
        background: `url('${hotsakImg}') no-repeat`,
        backgroundSize: "100% auto",
        height: "100%",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "417.5px",
          top: "152px",
          width: "710px",
          bottom: "0px",
          background: "#242424",
        }}
      >
        <Brev sakId={1000} />
      </div>
      <div
        style={{
          position: "absolute",
          top: "500px",
          left: "10px",
          width: "100px",
        }}
      >
        <Button>Focus here</Button>
      </div>
    </div>
  );
}

export default App;
