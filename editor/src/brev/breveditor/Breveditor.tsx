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
import { TabSyncPlugin } from "./plugins/tab-sync/TabSyncPlugin.tsx";
import { FlytendeLinkVerktøylinjeKit } from "./plugins/flytende-link-verktøylinje/FlytendeLinkVerktøylinjeKit.tsx";
import type { History } from "@platejs/slate";
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
  lagrerEndringer: boolean | { error: string };
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
  value: Value;
  valueAsHtml: string;
  history: History;
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
  brevId,
  metadata,
  templateMarkdown,
  initialState,
  onStateChange,
  onLagreBrev,
  onSlettBrev,
}: {
  brevId?: string;
  metadata: Metadata;
  templateMarkdown?: string;
  initialState?: StateMangement;
  onStateChange?: (newState: StateMangement) => void;
  onLagreBrev?: (newState: StateMangement) => Promise<void>;
  onSlettBrev?: () => void;
}) => {
  const state = useRef<StateMangement | undefined>(undefined);
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
              targetPlugins: [KEYS.p],
            },
          }),
          // Våre egne breveditor plugins
          ...[
            ...FlytendeLinkVerktøylinjeKit,
            TabSyncPlugin.configure({
              options: {
                brevId,
              },
            }),
          ],
        ],
      ],
      value: (editor) => {
        if (templateMarkdown) {
          return editor
            .getApi(MarkdownPlugin)
            .markdown.deserialize(templateMarkdown);
        } else if (initialState?.value != undefined) {
          editor.history = initialState.history;
          return initialState.value;
        } else {
          return [{ type: "h1", children: [{ text: "" }] }] as Value;
        }
      },
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

  const [lagrerEndringer, setLagrerEndringer] = useState<
    boolean | { error: string }
  >(false);
  const debounceLagring = useRef<number | undefined>(undefined);

  // Desperat forsøk på å lagre brev når nettleseren lukkes i tilfelle debounce ikke er over
  // (vil ikke alltid funke, men kanskje bedre enn ingenting...)
  const erAlleEndringerLagret = useRef(true);
  useEffect(() => {
    const listener = async (ev: BeforeUnloadEvent) => {
      if (onLagreBrev && !erAlleEndringerLagret.current) {
        ev.preventDefault();
        return (ev.returnValue =
          "Nå var du litt rask til å lukke fanen og alle endringene i brevet er ikke lagret enda. Er du sikker?");
      }
    };
    window.addEventListener("beforeunload", listener);
    return () => {
      window.removeEventListener("beforeunload", listener);
    };
  }, []);

  // Stopp debounce / retry etter dismount av brevkomponenten
  useEffect(() => {
    return () => {
      clearTimeout(debounceLagring.current);
    };
  }, []);

  const kallOnLagreBrevMedDebounceOgRetry = (
    constructedState: StateMangement,
  ) => {
    if (onLagreBrev) {
      erAlleEndringerLagret.current = false;
      clearTimeout(debounceLagring.current); // Kanseller pågående timere, enten de var startet på enste linjer eller i retry nedenfor
      debounceLagring.current = setTimeout(async () => {
        setLagrerEndringer(true); // Vis at vi forsøker å lagre
        await onLagreBrev(constructedState)
          .catch((e) => {
            setLagrerEndringer({ error: e.toString() }); // Vis at vi feilet
            debounceLagring.current = setTimeout(
              () => kallOnLagreBrevMedDebounceOgRetry(constructedState), // Try, try again...
              2000,
            );
            throw e; // Hopp over then blokken under
          })
          .then(() => {
            setLagrerEndringer(false);
            erAlleEndringerLagret.current = true;
          })
          .catch(() => {
            /* Ignorer exception... */
          });
      }, 500);
    }
  };

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
        lagrerEndringer,
      }}
    >
      <Plate
        editor={editor}
        onChange={async ({ editor: changedEditor, value: newValue }) => {
          if (
            (onStateChange != undefined || onLagreBrev) &&
            !editor.getPlugin(TabSyncPlugin).options.onChangeLocked
          ) {
            const constructedState: StateMangement = {
              value: newValue,
              valueAsHtml: await serializeHtml(editor),
              history: changedEditor.history,
            };
            if (
              !state.current ||
              JSON.stringify(state.current) != JSON.stringify(constructedState)
            ) {
              // On state-change
              state.current = constructedState;
              onStateChange && onStateChange(constructedState);
              kallOnLagreBrevMedDebounceOgRetry(constructedState);
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
