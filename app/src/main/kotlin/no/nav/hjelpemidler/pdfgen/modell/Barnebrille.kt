package no.nav.hjelpemidler.pdfgen.modell

import com.fasterxml.jackson.annotation.JsonAlias
import java.math.BigDecimal
import java.time.LocalDate
import java.time.LocalDateTime

data class Barnebrille (
    val fnr: String,
    val orgnr: String,
    val brukersNavn: String,
    val orgNavn: String,
    val orgAdresse: String,
    val brilleseddel: Brilleseddel,
    val bestillingsdato: LocalDate,
    val bestillingsår: Int = bestillingsdato.year,
    val bestillingsreferanse: String,
    val beløp: BigDecimal,

    @JsonAlias("opprettetDato")
    val opprettet: LocalDateTime,
)

data class Brilleseddel(
    val høyreSfære: String,
    val høyreSylinder: String,
    val venstreSfære: String,
    val venstreSylinder: String,
)