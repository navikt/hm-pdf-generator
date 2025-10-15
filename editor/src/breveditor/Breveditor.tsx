import "./Breveditor.css";
import "./NavBrevstandard.css";
import { Plate, PlateContent, usePlateEditor } from "platejs/react";
import { MarkdownPlugin, remarkMdx } from "@platejs/markdown";
import { BaseParagraphPlugin, KEYS } from "platejs";
import { ListPlugin } from "@platejs/list/react";
import {
  BaseH1Plugin,
  BaseH2Plugin,
  BaseH3Plugin,
  BaseH4Plugin,
  BaseHeadingPlugin,
  BaseItalicPlugin,
  BaseUnderlinePlugin,
} from "@platejs/basic-nodes";
import {
  BlockMenuPlugin,
  BlockSelectionPlugin,
} from "@platejs/selection/react";
import {
  createContext,
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import NavLogo from "./../assets/nav-logo.svg?react";
import Verktøylinje from "./verktøylinje/Verktøylinje.tsx";
import { LinkPlugin } from "@platejs/link/react";
import { BoldPlugin } from "@platejs/basic-nodes/react";

export interface BreveditorContextType {
  fokuser: () => void;
  harFokus: boolean;
  breveditorEllerVerktøylinjeHarFokus: boolean;
  settBreveditorEllerVerktøylinjeHarFokus: (harFokus: boolean) => void;
  visMarger: boolean;
  settVisMarger: (visMarger: boolean) => void;
}

export const BreveditorContext = createContext<
  BreveditorContextType | undefined
>(undefined);

export const useBreveditorContext = () => {
  const ctx = useContext(BreveditorContext);
  if (!ctx)
    console.error(
      "BreveditorContext må eksistere utenfor alle andre breveditor komponenter!",
    );
  return ctx!!;
};

const Breveditor = ({ markdown }: { markdown: string }) => {
  let editor = usePlateEditor(
    {
      plugins: [
        ...[
          MarkdownPlugin.configure({
            options: {
              plainMarks: [KEYS.suggestion, KEYS.comment],
              remarkPlugins: [remarkMdx],
            },
          }),
        ],
        ...[
          BaseH1Plugin,
          BaseH2Plugin,
          BaseH3Plugin,
          BaseH4Plugin,
          BaseParagraphPlugin,
          BaseHeadingPlugin,
          BaseItalicPlugin,
          BaseUnderlinePlugin,
          BoldPlugin,
          LinkPlugin,
          BlockMenuPlugin,
          BlockSelectionPlugin,
          ListPlugin.configure({
            inject: {
              targetPlugins: [...KEYS.heading, KEYS.p],
            },
          }),
        ],
      ],
      value: (editor) =>
        editor.getApi(MarkdownPlugin).markdown.deserialize(markdown, {
          remarkPlugins: [remarkMdx],
        }),
    },
    [],
  );

  const plateContentRef = useRef(null);
  const [visMarger, settVisMarger] = useState(true);
  const [breveditorHarFokus, settBreveditorHarFokus] = useState(false);
  const [
    breveditorEllerVerktøylinjeHarFokus,
    settBreveditorEllerVerktøylinjeHarFokus,
  ] = useState(false);

  // Skaller breveditor sitt innhold slik at Navs brevstandard sine px/pt verdier vises korrekt og propersjonalt.
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorContentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (editorContainerRef.current && editorContentRef.current) {
      let designedWidth = 794; // 595pt in px
      if (!visMarger) designedWidth = 650; // 595pt - 108pt ((64-10)*2=108)
      let actualWidth = editorContainerRef.current.clientWidth;
      let scale = actualWidth / designedWidth;
      editorContentRef.current.style.transform = `scale(${scale})`;
    }
  }, [editorContainerRef, editorContentRef, visMarger]);

  const fokuserBreveditor = useCallback(() => {
    // Har en liten timeout her for å la eventer propagere opp og ned før vi fokuserer på PlateContent igjen, hvis delay
    // er for liten så mister vi selection i Platejs editoren
    if (plateContentRef)
      setTimeout(
        () => (plateContentRef as RefObject<any>).current?.focus(),
        100,
      );
  }, [plateContentRef]);

  return (
    <BreveditorContext
      value={{
        fokuser: fokuserBreveditor,
        harFokus: breveditorHarFokus,
        breveditorEllerVerktøylinjeHarFokus:
          breveditorEllerVerktøylinjeHarFokus,
        settBreveditorEllerVerktøylinjeHarFokus:
          settBreveditorEllerVerktøylinjeHarFokus,
        visMarger: visMarger,
        settVisMarger: settVisMarger,
      }}
    >
      <Plate editor={editor}>
        <div className="editor-container-container">
          <Verktøylinje />
          <div
            style={{
              padding: "10px",
              overflowY: "auto",
              height: "100%",
            }}
          >
            <div
              ref={editorContainerRef}
              className={
                !visMarger ? "editor-container zoomed" : "editor-container"
              }
            >
              <div
                ref={editorContentRef}
                className={
                  !visMarger ? "editor-content zoomed" : "editor-content"
                }
              >
                <div className="page">
                  <div className="header">
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
                  <PlateContent
                    ref={plateContentRef}
                    onBlur={() => settBreveditorHarFokus(false)}
                    onFocus={() => {
                      settBreveditorHarFokus(true);
                      settBreveditorEllerVerktøylinjeHarFokus(true);
                    }}
                    placeholder="Skriv et fantastisk brev her..."
                    className="contentEditable"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Plate>
    </BreveditorContext>
  );
};

export default Breveditor;
