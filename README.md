# hm-pdf-generator
Applikasjon for konvertering av html dokumenter til PDF 

# Komme i gang

Gradle brukes som byggverktøy og er bundlet inn.

```
./gradlew build
```

## Kjøre lokalt
Start applikasjonen i Idea. Kjører port 8082 hvis du kjører opp API-et lokalt. 
Overstyr `Pdfgen.api_base_url` hvis generatoren kjører på annen måte.

## PDF-er for behovsmeldinger og barnebrillekrav

`POST /api/behovsmelding` og `POST /api/brukerpassbytte` tar imot JSON fra `hm-soknad-api` og returnerer `application/pdf`.

`POST /api/barnebrille` tar imot JSON fra `hm-joark-sink` og returnerer `application/pdf`.

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan rettes mot https://github.com/orgs/navikt/teams/teamdigihot

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #digihot.
