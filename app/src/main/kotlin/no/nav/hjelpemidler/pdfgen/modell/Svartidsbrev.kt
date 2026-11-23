package no.nav.hjelpemidler.pdfgen.modell

import java.time.Instant
import java.time.LocalDate

data class SvartidsbrevJournalføring(
    val navn: String,
    val fødselsnummer: String,
    val saksnummer: String,
    val dato: Instant,
    val mottattDato: LocalDate,
    val saksbehandler: String,
    val enhet: String,
    val verge: String? = null,
    val antallUker: String,
    // Kotlin lager getteren getårsak, mens Handlebars leter etter getÅrsak.
    @get:JvmName("getÅrsak")
    val årsak: String,
)
