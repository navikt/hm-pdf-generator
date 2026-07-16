package no.nav.hjelpemidler.pdfgen.modell

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
    val opprettet: LocalDateTime,
)

data class Brilleseddel(
    val høyreSfære: BigDecimal,
    val høyreSylinder: BigDecimal,
    val høyreAdd: BigDecimal,
    val venstreSfære: BigDecimal,
    val venstreSylinder: BigDecimal,
    val venstreAdd: BigDecimal,
)