import hotsakImg from "./assets/hotsak.png";

import "./App.css";
import Breveditor from "./breveditor/Breveditor.tsx";
import { Button } from "@navikt/ds-react";

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

  const template2 = [
    {
      children: [
        {
          text: "",
        },
      ],
      type: "brevHeader",
    },
    {
      children: [
        {
          text: "Du får tilskudd til briller",
        },
      ],
      type: "h1",
    },
    {
      children: [
        {
          text: "Hei,",
        },
      ],
      type: "p",
    },
    {
      children: [
        {
          text: "Vi har behandlet søknaden din om tilskudd til briller, som vi mottok . Du får  kroner fra oss for brillene som ble bestilt . Pengene vil bli utbetalt til kontonummeret Ola Nordmann har registrert hos Nav. Hvis du lurer på noe rundt kontonummer, se informasjon på ",
        },
        {
          children: [
            {
              text: "nav.no/kontonummer",
            },
          ],
          type: "a",
          url: "https://nav.no/kontonummer",
        },
        {
          text: ".",
        },
      ],
      type: "p",
    },
    {
      children: [
        {
          text: "Slik har vi kommet fram til hvor mye du får",
        },
      ],
      type: "h2",
    },
    {
      children: [
        {
          text: "Det er brillestyrken din som bestemmer hvor mye du kan få i tilskudd. Ut ifra brillestyrken du har oppgitt kommer du inn under sats  (opptil  kroner). Du kan ikke få mer i tilskudd enn det brillene koster. Ifølge dokumentasjonen du har sendt oss, kostet brillene  kroner, og dette er beløpet du vil få utbetalt. Ifølge dokumentasjonen har ditt høyre øye sfærisk styrke  og cylinderstyrke , og ditt venstre øye har sfærisk styrke  og cylinderstyrke . Du kan lese mer om kravene og satsene på ",
        },
        {
          children: [
            {
              text: "nav.no/briller-til-barn",
            },
          ],
          type: "a",
          url: "https://nav.no/briller-til-barn",
        },
        {
          text: ".",
        },
      ],
      type: "p",
    },
    {
      children: [
        {
          text: "Du kan få tilskudd til ett par briller hvert år",
        },
      ],
      type: "h2",
    },
    {
      children: [
        {
          text: "Neste gang du kan søke om tilskudd etter denne ordningen, er for briller som bestilles etter .",
        },
      ],
      type: "p",
    },
    {
      children: [
        {
          text: "Du har fått tilskudd etter et bestemt regelverk",
        },
      ],
      type: "h2",
    },
    {
      children: [
        {
          text: "Vedtaket er gjort etter folketrygdloven § 10-7 a, jf. forskrift av 19. juli 2022 om stønad til briller til barn. Vi gjør oppmerksom på at hvis opplysningene du har gitt oss er mangelfulle eller feilaktige, kan det føre til krav om tilbakebetaling av feilutbetalt beløp.",
        },
      ],
      type: "p",
    },
    {
      children: [
        {
          text: "Dette er en av flere ordninger for barn som trenger briller. Ordningen dekker briller med glass, innfatning og brilletilpasning. Du kan ikke få tilskudd til synsundersøkelse eller kontaktlinser på denne ordningen. Merk at det finnes andre ordninger som kan gi rett til støtte hvis du har nedsatt syn, se ",
        },
        {
          children: [
            {
              text: "nav.no/syn",
            },
          ],
          type: "a",
          url: "https://nav.no/syn",
        },
        {
          text: ".",
        },
      ],
      type: "p",
    },
    {
      children: [
        {
          text: "Du kan klage på vedtaket",
        },
      ],
      type: "h2",
    },
    {
      children: [
        {
          text: "Hvis du mener vedtaket er feil, kan du klage innen seks uker fra den datoen vedtaket har kommet fram til deg. Dette følger av folketrygdlovens § 21-12. Du finner skjema og informasjon på ",
        },
        {
          children: [
            {
              text: "nav.no/klage",
            },
          ],
          type: "a",
          url: "https://nav.no/klage",
        },
        {
          text: ". Merk at klagen vil bli behandlet med utgangspunkt i saken slik den står nå, så hvis saken mangler opplysninger, er det bedre å søke på nytt.",
        },
      ],
      type: "p",
    },
    {
      children: [
        {
          text: "Nav kan veilede deg på telefon om hvordan du sender en klage. Nav-kontoret ditt kan også hjelpe deg med å skrive en klage. Kontakt oss på telefon 55 55 11 11 hvis du trenger hjelp.",
        },
      ],
      type: "p",
    },
    {
      children: [
        {
          text: "Hvis du får medhold i klagen, kan du få dekket vesentlige utgifter som har vært nødvendige for å få endret vedtaket, for eksempel hjelp fra advokat. Du kan ha krav på fri rettshjelp etter rettshjelploven. Du kan få mer informasjon om denne ordningen hos advokater, statsforvalteren eller Nav. Du kan lese om saksomkostninger i forvaltningsloven § 36.",
        },
      ],
      type: "p",
    },
    {
      children: [
        {
          text: "Hvis du sender klage i posten, må du signere klagen.",
        },
      ],
      type: "p",
    },
    {
      children: [
        {
          text: "Mer informasjon om klagerettigheter finner du på ",
        },
        {
          children: [
            {
              text: "nav.no/klagerettigheter",
            },
          ],
          type: "a",
          url: "https://nav.no/klagerettigheter",
        },
        {
          text: ".",
        },
      ],
      type: "p",
    },
    {
      children: [
        {
          text: "Du har rett til innsyn i saken din",
        },
      ],
      type: "h2",
    },
    {
      children: [
        {
          text: "Du har rett til å se dokumentene i saken din. Dette følger av forvaltningsloven § 18. Kontakt oss om du vil se dokumentene i saken din. Ta kontakt på ",
        },
        {
          children: [
            {
              text: "nav.no/kontakt",
            },
          ],
          type: "a",
          url: "https://nav.no/kontakt",
        },
        {
          text: " eller på telefon 55 55 11 11. Du kan lese mer om innsynsretten på ",
        },
        {
          children: [
            {
              text: "nav.no/personvernerklaering",
            },
          ],
          type: "a",
          url: "https://nav.no/personvernerklaering",
        },
        {
          text: ".",
        },
      ],
      type: "p",
    },
    {
      children: [
        {
          text: "Vi har dessverre ikke mulighet til å vise foresatt eller verge saken og tilhørende dokumenter på ",
        },
        {
          children: [
            {
              text: "nav.no",
            },
          ],
          type: "a",
          url: "https://nav.no",
        },
        {
          text: ". Du kan ta kontakt med oss hvis du trenger innsyn i saken din.",
        },
      ],
      type: "p",
    },
    {
      children: [
        {
          text: "Har du spørsmål?",
        },
      ],
      type: "h2",
    },
    {
      children: [
        {
          text: "Du finner mer informasjon på ",
        },
        {
          children: [
            {
              text: "nav.no/briller-til-barn",
            },
          ],
          type: "a",
          url: "https://nav.no/briller-til-barn",
        },
        {
          text: ".",
        },
      ],
      type: "p",
    },
    {
      children: [
        {
          text: "På ",
        },
        {
          children: [
            {
              text: "nav.no/kontakt",
            },
          ],
          type: "a",
          url: "https://nav.no/kontakt",
        },
        {
          text: " kan du chatte eller skrive til oss.",
        },
      ],
      type: "p",
    },
    {
      children: [
        {
          text: "Hvis du ikke finner svar på ",
        },
        {
          children: [
            {
              text: "nav.no",
            },
          ],
          type: "a",
          url: "https://nav.no",
        },
        {
          text: ", kan du ringe oss på telefon 55 55 11 11 hverdager 09.00-15.00.",
        },
      ],
      type: "p",
    },
    {
      children: [
        {
          text: "Med vennlig hilsen\nJon Åsen, Kari Hansen\nNav hjelpemiddelsentral Agder",
        },
      ],
      type: "p",
    },
  ];

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
        <Breveditor
          //templateMarkdown={template}
          templateJson={template2}
          onChange={(newValue) =>
            console.log("onChange", JSON.stringify(newValue), newValue)
          }
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
