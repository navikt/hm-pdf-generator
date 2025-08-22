import { MDXEditor } from "@mdxeditor/editor";
import { headingsPlugin } from "@mdxeditor/editor";
import NavLogo from "./assets/nav-logo.svg?react";
import hotsakImg from "./assets/hotsak.png";

import "./App.css";
import "@mdxeditor/editor/style.css";
import { useEffect, useRef } from "react";

function App() {
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

  const markdown = `
    # Du får tilskudd til briller
    
    Hei,
    
    Vi har behandlet søknaden din om tilskudd til briller, som vi mottok 22. Januar 2025. Du får 2000 kroner fra oss for brillene som ble bestilt 01. Januar 2025. Pengene vil bli utbetalt til kontonummeret Ola Nordmann har registrert hos Nav. Hvis du lurer på noe rundt kontonummer, se informasjon på https://nav.no/kontonummer.
    
    ## Slik har vi kommet fram til hvor mye du får
    
    Det er brillestyrken din som bestemmer hvor mye du kan få i tilskudd. Ut ifra brillestyrken du har oppgitt kommer du inn under sats {{sats}} (opptil {{satsBelop}} kroner). {{#if belopMindreEnnSats}}Du kan ikke få mer i tilskudd enn det brillene koster. Ifølge dokumentasjonen du har sendt oss, kostet brillene {{belop}} kroner, og dette er beløpet du vil få utbetalt.{{/if}} Ifølge dokumentasjonen har ditt høyre øye sfærisk styrke {{sfæriskStyrkeHøyre}} og cylinderstyrke {{cylinderstyrkeHøyre}}, og ditt venstre øye har sfærisk styrke {{sfæriskStyrkeVenstre}} og cylinderstyrke {{cylinderstyrkeVenstre}}. Du kan lese mer om kravene og satsene på nav.no/briller-til-barn.
    
    ## Du kan få tilskudd til ett par briller hvert år
    
    Neste gang du kan søke om tilskudd etter denne ordningen, er for briller som bestilles etter {{formaterDato nesteKravdato}}.
    
    ## Du har fått tilskudd etter et bestemt regelverk
    
    Vedtaket er gjort etter folketrygdloven §10-7 a, jf. forskrift av 19. juli 2022 om stønad til briller til barn. Vi gjør oppmerksom på at hvis opplysningene du har gitt oss er mangelfulle eller feilaktige, kan det føre til krav om tilbakebetaling av feilutbetalt beløp.
    
    Dette er en av flere ordninger for barn som trenger briller. Ordningen dekker briller med glass, innfatning og brilletilpasning. Du kan ikke få tilskudd til synsundersøkelse eller kontaktlinser på denne ordningen. Merk at det finnes andre ordninger som kan gi rett til støtte hvis du har nedsatt syn, se nav.no/syn.
    
    ## Du kan klage på vedtaket
    
    Hvis du mener vedtaket er feil, kan du klage innen seks uker fra den datoen vedtaket har kommet fram til deg. Dette følger av [sett inn lovhenvisning]. Du finner skjema og informasjon på nav.no/klage. {{#if klageManglendeOpplysninger}}Merk at klagen vil bli behandlet med utgangspunkt i saken slik den står nå, så hvis saken mangler opplysninger, er det bedre å søke på nytt.{{/if}}
        
    Nav kan veilede deg på telefon om hvordan du sender en klage. Nav-kontoret ditt kan også hjelpe deg med å skrive en klage. Kontakt oss på telefon 55 55 33 33 \\<34\\> hvis du trenger hjelp.
    
    Hvis du får medhold i klagen, kan du få dekket vesentlige utgifter som har vært nødvendige for å få endret vedtaket, for eksempel hjelp fra advokat. Du kan ha krav på fri rettshjelp etter rettshjelploven. Du kan få mer informasjon om denne ordningen hos advokater, statsforvalteren eller Nav. Du kan lese om saksomkostninger i forvaltningsloven § 36.
    
    Hvis du sender klage i posten, må du signere klagen.
    
    Mer informasjon om klagerettigheter finner du på nav.no/klagerettigheter.
    
    ## Du har rett til innsyn i saken din
    
    Du har rett til å se dokumentene i saken din. Dette følger av forvaltningsloven § 18. Kontakt oss om du vil se dokumentene i saken din. Ta kontakt på nav.no/kontakt eller på telefon 55 55 33 33 \\<34\\>. Du kan lese mer om innsynsretten på nav.no/personvernerklaering.
    
    Vi har dessverre ikke mulighet til å vise foresatt eller verge saken og tilhørende dokumenter på nav.no. Du kan ta kontakt med oss hvis du trenger innsyn i saken din.
    
    ## Har du spørsmål?
    
    Du finner mer informasjon på nav.no/briller-til-barn.
    
    På nav.no/kontakt kan du chatte eller skrive til oss.
    
    Hvis du ikke finner svar på nav.no, kan du ringe oss på telefon 55 55 33 33 \\<34\\> hverdager 09.00-15.00.
    
    Med vennlig hilsen
    Nav hjelpemiddelsentral Agder
    55 55 11 11
    Skytterheia 1, 4790 LILLESAND
  `.trim();

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
                markdown={markdown}
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
