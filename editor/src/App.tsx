import NavLogo from "./assets/nav-logo.svg?react";
import hotsakImg from "./assets/hotsak.png";

import "./App.css";
import "@navikt/ds-css";
import { Box, Button, HStack, Tooltip } from "@navikt/ds-react";

import { Plate, PlateContent, usePlateEditor } from "platejs/react";
import { MarkdownPlugin, remarkMdx } from "@platejs/markdown";
import {
  BaseH1Plugin,
  BaseH2Plugin,
  BaseH3Plugin,
  BaseH4Plugin,
  BaseHeadingPlugin,
  BaseBoldPlugin,
  BaseItalicPlugin,
  BaseUnderlinePlugin,
} from "@platejs/basic-nodes";
import { KEYS, BaseParagraphPlugin, type Editor } from "platejs";
import { type ReactNode, useEffect, useRef } from "react";

function App() {
  // @ts-ignore
  const flettefelter: Record<string, string> = {
    mottaksDato: "Mottaks dato",
    beløp: "Beløp",
    brilleBestillingsdato: "Brille bestillingsdato",
    brilleSats: "Brille sats",
    brilleSatsBelop: "Brille sats beløp",
    belopUtbetales: "Beløp utbetales",
    brilleSfaeriskStyrkeHoyre: "Brille sfaerisk styrke høyre",
    brilleCylinderStyrkeHoyre: "Brille cylinder styrke høyre",
    brilleSfaeriskStyrkeVenstre: "Brille sfaerisk styrke venstre",
    brilleCylinderStyrkeVenstre: "Brille cylinder styrke venstre",
    nesteKravdato: "Neste kravdato",
  };

  // @ts-ignore
  const markdown = `
    # Du får tilskudd til briller
    
    Hei,
    
    Vi har behandlet søknaden din om tilskudd til briller, som vi mottok {{mottaksDato}}. Du får {{beløp}} kroner fra oss for brillene som ble bestilt {{brilleBestillingsdato}}. Pengene vil bli utbetalt til kontonummeret Ola Nordmann har registrert hos Nav. Hvis du lurer på noe rundt kontonummer, se informasjon på [nav.no/kontonummer](https://nav.no/kontonummer).
    
    ## Slik har vi kommet fram til hvor mye du får
    
    Det er brillestyrken din som bestemmer hvor mye du kan få i tilskudd. Ut ifra brillestyrken du har oppgitt kommer du inn under sats {{brilleSats}} (opptil {{brilleSatsBelop}} kroner). Du kan ikke få mer i tilskudd enn det brillene koster. Ifølge dokumentasjonen du har sendt oss, kostet brillene {{belopUtbetales}} kroner, og dette er beløpet du vil få utbetalt. Ifølge dokumentasjonen har ditt høyre øye sfærisk styrke {{brilleSfaeriskStyrkeHoyre}} og cylinderstyrke {{brilleCylinderStyrkeHoyre}}, og ditt venstre øye har sfærisk styrke {{brilleSfaeriskStyrkeVenstre}} og cylinderstyrke {{brilleCylinderStyrkeVenstre}}. Du kan lese mer om kravene og satsene på [nav.no/briller-til-barn](https://nav.no/briller-til-barn).
    
    ## Du kan få tilskudd til ett par briller hvert år
    
    Neste gang du kan søke om tilskudd etter denne ordningen, er for briller som bestilles etter {{nesteKravdato}}.
    
    ## Du har fått tilskudd etter et bestemt regelverk
    
    Vedtaket er gjort etter folketrygdloven § 10-7 a, jf. forskrift av 19. juli 2022 om stønad til briller til barn. Vi gjør oppmerksom på at hvis opplysningene du har gitt oss er mangelfulle eller feilaktige, kan det føre til krav om tilbakebetaling av feilutbetalt beløp.
    
    Dette er en av flere ordninger for barn som trenger briller. Ordningen dekker briller med glass, innfatning og brilletilpasning. Du kan ikke få tilskudd til synsundersøkelse eller kontaktlinser på denne ordningen. Merk at det finnes andre ordninger som kan gi rett til støtte hvis du har nedsatt syn, se [nav.no/syn](https://nav.no/syn).
    
    ## Du kan klage på vedtaket
    
    Hvis du mener vedtaket er feil, kan du klage innen seks uker fra den datoen vedtaket har kommet fram til deg. Dette følger av folketrygdlovens § 21-12. Du finner skjema og informasjon på [nav.no/klage](https://nav.no/klage). Merk at klagen vil bli behandlet med utgangspunkt i saken slik den står nå, så hvis saken mangler opplysninger, er det bedre å søke på nytt.
    
    Nav kan veilede deg på telefon om hvordan du sender en klage. Nav-kontoret ditt kan også hjelpe deg med å skrive en klage. Kontakt oss på telefon 55 55 11 11 hvis du trenger hjelp.
    
    Hvis du får medhold i klagen, kan du få dekket vesentlige utgifter som har vært nødvendige for å få endret vedtaket, for eksempel hjelp fra advokat. Du kan ha krav på fri rettshjelp etter rettshjelploven. Du kan få mer informasjon om denne ordningen hos advokater, statsforvalteren eller Nav. Du kan lese om saksomkostninger i forvaltningsloven § 36.
    
    Hvis du sender klage i posten, må du signere klagen.
    
    Mer informasjon om klagerettigheter finner du på [nav.no/klagerettigheter](https://nav.no/klagerettigheter).
    
    ## Du har rett til innsyn i saken din
    
    Du har rett til å se dokumentene i saken din. Dette følger av forvaltningsloven § 18. Kontakt oss om du vil se dokumentene i saken din. Ta kontakt på [nav.no/kontakt](https://nav.no/kontakt) eller på telefon 55 55 11 11. Du kan lese mer om innsynsretten på [nav.no/personvernerklaering](https://nav.no/personvernerklaering).
    
    Vi har dessverre ikke mulighet til å vise foresatt eller verge saken og tilhørende dokumenter på [nav.no](https://nav.no). Du kan ta kontakt med oss hvis du trenger innsyn i saken din.
    
    ## Har du spørsmål?
    
    Du finner mer informasjon på [nav.no/briller-til-barn](https://nav.no/briller-til-barn).
    
    På [nav.no/kontakt](https://nav.no/kontakt) kan du chatte eller skrive til oss.
    
    Hvis du ikke finner svar på [nav.no](https://nav.no), kan du ringe oss på telefon 55 55 11 11 hverdager 09.00-15.00.
    
    Med vennlig hilsen
    Jon Åsen, Kari Hansen
    Nav hjelpemiddelsentral Agder
  `
    .trim()
    .replace(
      /\{\{([^}]+)}}/g,
      (_) =>
        //`<Variabel variabel="${m0}" tittel="${flettefelter[m0] ?? m0}" />`,
        "",
    );

  let editor = usePlateEditor(
    {
      plugins: [
        ...[
          MarkdownPlugin.configure({
            options: {
              plainMarks: [KEYS.suggestion, KEYS.comment],
              remarkPlugins: [
                remarkMdx /*, remarkMath, remarkGfm, remarkMention*/,
              ],
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
          BaseBoldPlugin,
          BaseItalicPlugin,
          BaseUnderlinePlugin,
        ],
      ],
      //value: [{ type: "p", children: [{ text: "Hello world!" }] }],
      value: (editor) =>
        editor.getApi(MarkdownPlugin).markdown.deserialize(markdown, {
          remarkPlugins: [
            // remarkMath,
            // remarkGfm,
            remarkMdx,
            // remarkMention,
            // remarkEmoji as any,
          ],
        }),
    },
    [],
  );

  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorContentRef = useRef<HTMLDivElement>(null);
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
          width: "710px",
          bottom: "0px",
          padding: "10px",
          background: "#242424",
        }}
      >
        <div
          style={{
            position: "relative",
            left: 0,
            right: 0,
            top: "0",
            margin: "-10px",
            background: "#fff",
            border: "1px solid gray",
            borderBottom: "10px solid rgb(36, 36, 36)",
          }}
        >
          <Box className="toolbar">
            <Box className="toolbar_section">
              <HStack wrap justify={{ lg: "start", xl: "start" }}>
                <MarkButton
                  editor={editor}
                  format="bold"
                  icon={<div style={{ color: "black" }}>F</div>}
                  title="Fet"
                  //keys={fetHurtigtast}
                />
                <MarkButton
                  editor={editor}
                  format="italic"
                  icon={<i style={{ color: "black" }}>K</i>}
                  title="Kursiv"
                  //keys={fetHurtigtast}
                />
                <MarkButton
                  editor={editor}
                  format="underline"
                  icon={
                    <div
                      style={{ color: "black", textDecoration: "underline" }}
                    >
                      U
                    </div>
                  }
                  title="Underlinje"
                  //keys={fetHurtigtast}
                />
              </HStack>
            </Box>
          </Box>
        </div>
        <div
          style={{
            height: "100%",
            overflowY: "auto",
          }}
        >
          <div ref={editorContainerRef} className="editor-container">
            <div ref={editorContentRef} className="editor-content">
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
                <Plate editor={editor}>
                  <PlateContent
                    className="contentEditable"
                    placeholder="Type your amazing content here..."
                  />
                </Plate>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const isMarkActive = (editor: Editor, format: string) => {
  const marks: any = editor.api.marks();
  return marks ? marks[format] === true : false;
};

const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);
  if (format === "clear") {
    // remove all styles
    editor.tf.setNodes(
      {
        bold: false,
        italic: false,
        underline: false,
        change: false,
        light: false,
      },
      { match: Text.isText },
    );
    // make it a paragrah
    editor.tf.setNodes({ type: "paragraph", align: "left" });
  } else if (isActive) {
    editor.tf.removeMark(format);
  } else {
    editor.tf.addMark(format, true);
  }
};

const MarkButton = ({
  editor,
  format,
  icon,
  title,
  keys,
}: {
  editor: Editor;
  format: string;
  icon: ReactNode;
  title?: string;
  keys?: string[];
}) => {
  return (
    <Tooltip content={title ? title : ""} keys={keys}>
      <Button
        // active={isMarkActive(editor, format)}
        className={
          isMarkActive(editor, format) ? `menyKnapp ${format}` : `menyKnapp`
        }
        onMouseDown={(event: { preventDefault: () => void }) => {
          event.preventDefault();
          toggleMark(editor, format);
        }}
        variant="tertiary"
      >
        {icon}
      </Button>
    </Tooltip>
  );
};

export default App;
