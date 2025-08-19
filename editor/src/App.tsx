import { MDXEditor } from "@mdxeditor/editor";
import { headingsPlugin } from "@mdxeditor/editor";
import NavLogo from "./assets/nav-logo.svg?react";
// import NavLogo from "./assets/nav-logo.svg";
import hotsakImg from "./assets/hotsak.png";

import "./App.css";
import "@mdxeditor/editor/style.css";
import { useEffect, useRef } from "react";

function App() {
  const editorContainerRef = useRef(null);
  const editorContentRef = useRef(null);
  useEffect(() => {
    if (editorContainerRef.current && editorContentRef.current) {
      let designedWidth = 794; // 595pt in px
      let actualWidth = editorContainerRef.current.clientWidth;
      let scale = actualWidth / designedWidth;
      editorContentRef.current.style.transform = `scale(${scale})`;
    }
  }, [editorContainerRef, editorContentRef]);
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
          width: "690px",
          bottom: "0px",
          overflowY: "scroll",
          padding: "10px",
          background: "#242424",
        }}
      >
        <div ref={editorContainerRef} className="editor-container">
          <div ref={editorContentRef} className="editor-content">
            <div className="page">
              <div className="header">
                {/*<img src={NavLogo} />*/}
                <NavLogo />
                <dl>
                  <dt>Navn:</dt>
                  <dd>Ola Nordmann</dd>
                  <dt>Fødselsnummer:</dt>
                  <dd>26848497710</dd>
                  <dt>Saksnummer:</dt>
                  <dd>1000</dd>
                </dl>
                <span>22. Januar 2025</span>
              </div>
              <MDXEditor
                contentEditableClassName="contentEditable"
                markdown={
                  "# Du får tilskudd til briller\n\nHei\n\nVi har behandlet søknaden din om tilskudd til briller, som vi mottok 22. Januar 2025. Du får 2000 kroner fra oss for brillene som ble bestilt 01. Januar 2025. Pengene vil bli utbetalt til kontonummeret Ola Nordmann har registrert hos Nav. Hvis du lurer på noe rundt kontonummer, se informasjon på https://nav.no/kontonummer."
                }
                plugins={[headingsPlugin()]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
