import hotsakImg from "./assets/hotsak.png";

import "./App.css";
import { Button } from "@navikt/ds-react";
import { TabSynkronisertBreveditor } from "./breveditor/TabSynkronisertBreveditor.tsx";

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
  const template = `
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
  `
    .trim()
    .replace(
      /\{\{([^}]+)}}/g,
      (_) =>
        //`<Variabel variabel="${m0}" tittel="${flettefelter[m0] ?? m0}" />`,
        "",
    );

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
        <TabSynkronisertBreveditor
          metadata={{
            brukersNavn: "Ola Nordmann",
            brukersFødselsnummer: "26848497710",
            saksnummer: 1000,
            brevOpprettet: "1. Januar 2025",
            saksbehandlerNavn: "Jon Åsen",
            // attestantsNavn: "Kari Hansen",
            hjelpemiddelsentral: "Nav hjelpemiddelsentral Agder",
          }}
          defaultMarkdown={template}
          onValueChange={(newValue, history, html) => {
            console.log("App.tsx: onValueChange", {
              value: newValue,
              history: history,
              html,
              stylesheet_version: "v1",
              brevutkast_id: 1000,
            });
          }}
        />
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
