package no.nav.hjelpemidler.pdfgen.modell

import java.time.Instant

data class SvartidsbrevJournalføring(
    val navn: String,
    val fødselsnummer: String,
    val saksnummer: String,
    val dato: Instant,
    val saksbehandler: String,
    val enhet: String,
    val verge: String? = null,
    val antallUker: String,
)
