package no.nav.hjelpemidler.pdfgen.modell

import java.time.LocalDate

data class BarnebrillerInnvilgetHotsak (
    val sakId: String,
    val belopMindreEnnSats: Boolean,
    val viseNavAdresse: Boolean,
    val mottattDato: LocalDate,
    val brevOpprettetDato: LocalDate,
    val bestillingsDato: LocalDate,
    val nesteKravdato: LocalDate,
    val barnetsFulleNavn: String,
    val utbetalesTilNavn: String,
    val barnetsFodselsnummer: String,
    val belop: String,
    val sats: Int,
    val satsBelop: String,
    val sfæriskStyrkeHøyre: String,
    val cylinderstyrkeHøyre: String,
    val sfæriskStyrkeVenstre: String,
    val cylinderstyrkeVenstre: String,
)
