package no.nav.hjelpemidler.pdfgen.modell

import java.time.LocalDate

data class BarnebrillerInnvilgetHotsak(
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

data class BarnebrillerAvslagManglendeOpplysningerHotsak(
    val sakId: String,
    val viseNavAdresse: Boolean,
    val mottattDato: LocalDate,
    val brevOpprettetDato: LocalDate,
    val etterspurteOpplysningerBrevDatertDato: LocalDate,
    val barnetsFulleNavn: String,
    val barnetsFodselsnummer: String,
    val fritekstSaksbehandler: String,
)

data class BarnebrillerAvslagHotsakBegrunnelser (
    val avslagEksisterendeVedtak: Boolean? = false,
    val avslagOver18: Boolean? = false,
    val avslagIkkeMedlem: Boolean? = false,
    val avslagForLavBrillestyrke: Boolean? = false,
    val avslagBestillingsdatoEldreEnn6Mnd: Boolean? = false,
    val avslagIkkeBestiltHosOptiker: Boolean? = false,
    val avslagBrilleglass: Boolean? = false,
    val avslagAbonnement: Boolean? = false,
)

data class BarnebrillerAvslagHotsak(
    val sakId: String,
    val viseNavAdresse: Boolean,
    val mottattDato: LocalDate,
    val brevOpprettetDato: LocalDate,
    val bestillingsDato: LocalDate? = null,
    val forrigeBrilleDato: LocalDate? = null,
    val barnetsFornavn: String,
    val barnetsFulleNavn: String,
    val barnetsFodselsnummer: String,
    val sfæriskStyrkeHøyre: String,
    val cylinderstyrkeHøyre: String,
    val sfæriskStyrkeVenstre: String,
    val cylinderstyrkeVenstre: String,
    val begrunnelser: BarnebrillerAvslagHotsakBegrunnelser,
)

data class BarnebrillerInnhenteOpplysninger(
    val sakId: String,
    val viseNavAdresse: Boolean,
    val mottattDato: LocalDate? = null,
    val brevOpprettetDato: LocalDate,
    val barnetsFulleNavn: String,
    val barnetsFodselsnummer: String,
    val fritekstSaksbehandler: String,
)

data class JournalfortNotatHotsak(
    val sakId: String,
    val brevOpprettetDato: LocalDate,
    val brukersFulleNavn: String,
    val brukersFodselsnummer: String,
    val saksbehandlersEnhetsnavn: String,
    val tittel: String,
    val innholdMarkdown: String,
)

data class BarnebrillerAvvisningDirekteoppgjorBegrunnelser (
    val avslagEksisterendeVedtak: Boolean? = false,
    val avslagOver18: Boolean? = false,
    val avslagIkkeMedlem: Boolean? = false,
    val avslagForLavBrillestyrke: Boolean? = false,
    val avslagBestillingsdatoEldreEnn6Mnd: Boolean? = false,
    val avslagIkkeBestiltHosOptiker: Boolean? = false,
    val avslagBrilleglass: Boolean? = false,
    val avslagAbonnement: Boolean? = false,
)

data class BarnebrillerAvvisningDirekteoppgjor(
    val sakId: String,
    val viseNavAdresse: Boolean,
    val mottattDato: LocalDate? = null,
    val brevOpprettetDato: LocalDate,
    val barnetsFulleNavn: String,
    val barnetsFodselsnummer: String,
    val fritekstSaksbehandler: String,
    val begrunnelser: BarnebrillerAvvisningDirekteoppgjorBegrunnelser,
)
