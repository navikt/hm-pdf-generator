import "./Breveditor.less";
import { Plate, PlateContent, usePlateEditor } from "platejs/react";
import { MarkdownPlugin, remarkMdx } from "@platejs/markdown";
import { KEYS, serializeHtml, type Value } from "platejs";
import {
  createContext,
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import NavLogo from "../../assets/nav-logo.svg?react";
import {
  BoldPlugin,
  H1Plugin,
  H2Plugin,
  H3Plugin,
  H4Plugin,
  ItalicPlugin,
  UnderlinePlugin,
} from "@platejs/basic-nodes/react";
import { BrevHeaderPlugin } from "./plugins/brev-header/BrevHeaderPlugin.tsx";
import { FlytendeLinkVerktøylinjeKit } from "./plugins/flytende-link-verktøylinje/FlytendeLinkVerktøylinjeKit.tsx";
import type { History } from "@platejs/slate";
import { v4 as uuidv4 } from "uuid";
import Verktøylinje from "./verktøylinje/Verktøylinje.tsx";
import { ListPlugin } from "@platejs/list-classic/react";

export interface BreveditorContextType {
  erPlateContentFokusert: boolean;
  fokuserPlateContent: () => void;
  erVerktoylinjeFokusert: boolean;
  settVerktoylinjeFokusert: (fokus: boolean) => void;
  erBreveditorEllerVerktoylinjeFokusert: boolean;
  settBreveditorEllerVerktoylinjeFokusert: (fokus: boolean) => void;
  visMarger: boolean;
  settVisMarger: (visMarger: boolean) => void;
  onSlettBrev?: () => void;
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

export interface StateMangement {
  stateRevision: string;
  state?: {
    value: Value;
    history: History;
    // selection: EditorSelection;
  };
}

export interface Metadata {
  brukersNavn: string;
  brukersFødselsnummer: string;
  saksnummer: number;
  brevOpprettet: string;
  saksbehandlerNavn: string;
  attestantsNavn?: string;
  hjelpemiddelsentral: string;
}

const Breveditor = ({
  metadata,
  defaultValue,
  defaultMarkdown,
  onValueChange,
  state: externalStateManager,
  onStateChange,
  onSlettBrev,
}: {
  metadata: Metadata;
  defaultValue?: Value;
  defaultMarkdown?: string;
  onValueChange?: (newValue: Value, newHistory: History, html: string) => void;
  state?: StateMangement;
  onStateChange?: (newState: StateMangement) => void;
  onSlettBrev?: () => void;
}) => {
  const state = useRef<StateMangement>(
    /*externalStateManager ||*/ { stateRevision: uuidv4() },
  );
  const lock = useRef(false);

  let editor = usePlateEditor(
    {
      plugins: [
        ...[
          MarkdownPlugin.configure({
            options: {
              remarkPlugins: [remarkMdx],
            },
          }),
        ],
        ...[
          H1Plugin,
          H2Plugin,
          H3Plugin,
          H4Plugin,
          ItalicPlugin,
          UnderlinePlugin,
          BoldPlugin,
          ListPlugin.configure({
            inject: {
              targetPlugins: [...KEYS.heading, KEYS.p],
            },
          }),
          // Våre egne breveditor plugins
          ...[...FlytendeLinkVerktøylinjeKit, BrevHeaderPlugin],
        ],
      ],
      value: (editor) => {
        if (defaultValue) {
          return defaultValue;
        } else if (defaultMarkdown) {
          return editor
            .getApi(MarkdownPlugin)
            .markdown.deserialize(defaultMarkdown);
        } else {
          return [{ type: "p", children: [{ text: "" }] }] as Value;
        }
      },
    },
    [],
  );

  // Overskriv state fra external state manager når den endrer seg
  useEffect(() => {
    if (
      externalStateManager &&
      externalStateManager.stateRevision != state.current.stateRevision &&
      externalStateManager.state
    ) {
      // Midlertidig slå av onStateChange for å unngå en loop ved endring av intern state
      lock.current = true;
      setTimeout(() => {
        lock.current = false;
      }, 10);

      // Gjør endringer til lokal state
      state.current = externalStateManager;
      editor.tf.setValue(externalStateManager.state.value);
      editor.history = externalStateManager.state.history;
      // editor.selection = externalStateManager.state.selection;
    }
  }, [externalStateManager]);

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
        onSlettBrev: onSlettBrev,
      }}
    >
      <Plate
        editor={editor}
        onValueChange={async ({ value: newValue, editor }) => {
          onValueChange &&
            onValueChange(
              newValue,
              editor.history,
              await serializeHtml(editor),
            );
        }}
        onChange={({ editor: changedEditor, value: newValue }) => {
          if (onStateChange != undefined && !lock.current) {
            const constructedState: StateMangement = {
              stateRevision: uuidv4(),
              state: {
                value: newValue,
                history: changedEditor.history,
                // selection: changedEditor.selection,
              },
            };
            if (
              !state.current.state ||
              JSON.stringify(state.current.state) !=
                JSON.stringify(constructedState.state)
            ) {
              // On state-change
              state.current = constructedState;
              onStateChange && onStateChange(constructedState);
            }
          }
        }}
      >
        <div className="breveditor-container">
          <Verktøylinje />
          <div className="scrollable-pit">
            <div
              ref={editorContainerRef}
              className={
                !visMarger ? "scrollable-content zoomed" : "scrollable-content"
              }
            >
              <div
                className={!visMarger ? "content zoomed" : "content"}
                style={{
                  scale: editorContentScale,
                }}
              >
                <div className="page">
                  <div className="brev-stilark-v1">
                    <div className="header">
                      <NavLogo />
                      <dl>
                        <dt>Navn:</dt>
                        <dd>{metadata.brukersNavn}</dd>
                        <dt>Fødselsnummer:</dt>
                        <dd>{metadata.brukersFødselsnummer}</dd>
                        <dt>Saksnummer:</dt>
                        <dd>{metadata.saksnummer}</dd>
                      </dl>
                      <span>{metadata.brevOpprettet}</span>
                    </div>
                    <PlateContent
                      ref={plateContentRef}
                      onBlur={() => settPlateContentFokusertWrapped(false)}
                      onFocus={() => settPlateContentFokusertWrapped(true)}
                      placeholder="Skriv et fantastisk brev her..."
                      className="contentEditable"
                    />
                    <p>
                      Med vennlig hilsen <br />
                      {metadata.saksbehandlerNavn}
                      {metadata.attestantsNavn
                        ? `, ${metadata.attestantsNavn}`
                        : ""}{" "}
                      <br />
                      {metadata.hjelpemiddelsentral}
                    </p>
                  </div>
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
