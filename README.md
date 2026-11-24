# hm-pdf-generator
Applikasjon for konvertering av html dokumenter til PDF 

# Komme i gang

Gradle brukes som byggverktøy og er bundlet inn.

```
./gradlew build
```


## Kjøre lokalt
Start applikasjonen i Idea

## PDF-er for søknader og barnebrillekrav

`POST /api/behovsmelding` og `POST /api/brukerpassbytte` tar imot JSON og returnerer `application/pdf`.
Behovsmeldingen skal inkludere tilleggsfeltene fra `tilPdfData()` i `hm-soknad-api`, blant annet
`kunTilskuddRimeligeHjelpemidler`.

`POST /api/barnebrille` tar imot JSON fra `hm-joark-sink` og returnerer `application/pdf`.
Feltene beholdes som i tidligere løsning, også datoer, beløp og valgfrie brillestyrker.

Malene ligger i `app/src/main/resources/soknad/`. De er overført fra `hm-soknad-pdfgen`,
med samme innhold, bilder og stil. Bildene ligger samlet i `app/src/main/resources/delmaler/images/`.
`SoknadTemplateService` behandler malene separat og lager HTML. Eksisterende
`PdfService` lager PDF-ene. Fontene og fargeprofilen er felles med resten av applikasjonen.
For de migrerte malene er automatisk ligaturerstatning deaktivert i Source Sans Pro, slik at
tekstuttrekk og kopiering beholder blant annet `ft` i «bekrefter».
Små forskjeller i tegnform, linjebryting og sideskift fra den gamle løsningen er akseptable.

`SoknadTemplateServiceTest` kontrollerer malinnhold og betingede seksjoner.
`SoknadPdfApiTest` kontrollerer PDF-responser, sidetall og feilhåndtering med syntetiske JSON-eksempler
i `app/src/test/resources/soknad/`. `PdfServiceTest` kontrollerer at tekstuttrekk beholder ligaturtekst.
Testene krever ikke pikselidentiske PDF-er.

Ved migrering må generatoren deployes før `hm-soknad-api` og `hm-joark-sink`.
Kontroller deretter at ingen kall lenger går til `hm-soknad-pdfgen` før den avvikles.

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan rettes mot https://github.com/orgs/navikt/teams/teamdigihot

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #digihot.
