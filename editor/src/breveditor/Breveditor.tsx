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
  createContext,
  type RefObject,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import NavLogo from "./../assets/nav-logo.svg?react";
import Verktøylinje from "./verktøylinje/Verktøylinje.tsx";
import { LinkPlugin } from "@platejs/link/react";
import { BoldPlugin } from "@platejs/basic-nodes/react";
import { LinkElement } from "./hjelpere/LinkElement.tsx";
import { LinkFlytendeVerktøylinje } from "./hjelpere/LinkFlytendeVerktøylinje.tsx";

export interface BreveditorContextType {
  erPlateContentFokusert: boolean;
  fokuserPlateContent: () => void;
  erVerktoylinjeFokusert: boolean;
  settVerktoylinjeFokusert: (fokus: boolean) => void;
  erBreveditorEllerVerktoylinjeFokusert: boolean;
  settBreveditorEllerVerktoylinjeFokusert: (fokus: boolean) => void;
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

const Breveditor = ({
  templateMarkdown: markdown,
  onChange,
}: {
  templateMarkdown: string;
  onChange?: (markdown: string) => void;
}) => {
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
          LinkPlugin.configure({
            render: {
              node: LinkElement,
              afterEditable: () => <LinkFlytendeVerktøylinje />,
            },
            options: {
              allowedSchemes: ["http", "https"],
              transformInput: (url) => {
                if (!/^[^:]+:\/\//.test(url)) return `http://${url}`;
                return url;
              },
            },
          }),
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

  // Sett opp breveditor-context state
  const [erPlateContentFokusert, settPlateContentFokusert] = useState(false);
  const [erVerktoylinjeFokusert, settVerktoylinjeFokusert] = useState(false);
  const [
    erBreveditorEllerVerktoylinjeFokusert,
    settBreveditorEllerVerktoylinjeFokusert,
  ] = useState(false);
  const [visMarger, settVisMarger] = useState(true);

  const settPlateContentFokusertWrapped = useCallback(
    (b: boolean) => {
      settPlateContentFokusert(b);
      settBreveditorEllerVerktoylinjeFokusert(b || erVerktoylinjeFokusert);
    },
    [settPlateContentFokusert, erVerktoylinjeFokusert],
  );

  const settVerktoylinjeFokusertWrapped = useCallback(
    (b: boolean) => {
      settVerktoylinjeFokusert(b);
      settBreveditorEllerVerktoylinjeFokusert(b || erPlateContentFokusert);
    },
    [settVerktoylinjeFokusert, erPlateContentFokusert],
  );

  const plateContentRef = useRef(null);
  const fokuserPlateContent = useCallback(() => {
    if (plateContentRef)
      // Har en liten timeout her for å la eventer propagere opp og ned før vi fokuserer på PlateContent igjen, hvis delay
      // er for liten så mister vi selection i Platejs editoren
      setTimeout(
        () => (plateContentRef as RefObject<any>).current?.focus(),
        100,
      );
  }, [plateContentRef]);

  // Skallér breveditor sitt innhold slik at Navs brevstandard sine px/pt verdier vises korrekt og propersjonalt.
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const [editorContentScale, setEditorContentScale] = useState(1.0);
  useLayoutEffect(() => {
    if (editorContainerRef.current) {
      let designedWidth = 794; // 595pt in px
      if (!visMarger) designedWidth = 650; // 595pt - 108pt ((64-10)*2=108)
      let actualWidth = editorContainerRef.current.clientWidth;
      let scale = actualWidth / designedWidth;
      if (editorContentScale != scale) {
        console.log("updating editor content scale");
        setEditorContentScale(scale);
      }
    }
  }, [visMarger]);

  return (
    <BreveditorContext
      value={{
        erPlateContentFokusert: erPlateContentFokusert,
        fokuserPlateContent: fokuserPlateContent,
        erVerktoylinjeFokusert: erVerktoylinjeFokusert,
        settVerktoylinjeFokusert: settVerktoylinjeFokusertWrapped,
        erBreveditorEllerVerktoylinjeFokusert:
          erBreveditorEllerVerktoylinjeFokusert,
        settBreveditorEllerVerktoylinjeFokusert:
          settBreveditorEllerVerktoylinjeFokusert,
        visMarger: visMarger,
        settVisMarger: settVisMarger,
      }}
    >
      <Plate
        editor={editor}
        onValueChange={(_) =>
          onChange &&
          onChange(
            editor.getApi(MarkdownPlugin).markdown.serialize({
              remarkPlugins: [remarkMdx],
            }),
          )
        }
      >
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
                className={
                  !visMarger ? "editor-content zoomed" : "editor-content"
                }
                style={{
                  scale: editorContentScale,
                }}
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
                    onBlur={() => settPlateContentFokusertWrapped(false)}
                    onFocus={() => settPlateContentFokusertWrapped(true)}
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
