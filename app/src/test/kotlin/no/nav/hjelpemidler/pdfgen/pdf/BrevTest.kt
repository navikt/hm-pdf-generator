package no.nav.hjelpemidler.pdfgen.pdf

import no.nav.hjelpemidler.pdfgen.modell.BarnebrillerAvslagHotsak
import no.nav.hjelpemidler.pdfgen.modell.BarnebrillerAvslagHotsakBegrunnelser
import no.nav.hjelpemidler.pdfgen.modell.BarnebrillerAvslagManglendeOpplysningerHotsak
import no.nav.hjelpemidler.pdfgen.modell.BarnebrillerAvvisningDirekteoppgjor
import no.nav.hjelpemidler.pdfgen.modell.BarnebrillerAvvisningDirekteoppgjorBegrunnelser
import no.nav.hjelpemidler.pdfgen.modell.BarnebrillerInnhenteOpplysninger
import no.nav.hjelpemidler.pdfgen.modell.BarnebrillerInnvilgetHotsak
import no.nav.hjelpemidler.pdfgen.modell.JournalfortNotatHotsak
import no.nav.hjelpemidler.pdfgen.template.TemplateService
import org.junit.jupiter.api.Test
import java.io.File
import java.io.StringWriter
import java.time.LocalDate

class BrevTest {
    private fun fromResrouce(resource: String) =
        javaClass
            .inputStream(resource)
            .use { it.buffered().readAllBytes().toString(Charsets.UTF_8) }

    private val pdfService = PdfService()
    private val templateService = TemplateService()

    private fun genererPdfFraTemplateResource(resource: String, data: Any) {
        val template = fromResrouce(resource)
        val htmlWriter = StringWriter()
        templateService.compile(template, data, htmlWriter)
        val dir = File("build/test-results/pdfs")
        dir.mkdirs()
        val file = File(dir, resource.substringAfterLast("/").removeSuffix(".hbs") + ".pdf")
        pdfService.lagPdf(htmlWriter.toString(), file.outputStream())
    }

    @Test
    fun `Template barnebrillerInnvilgetHotsak`() {
        val data = BarnebrillerInnvilgetHotsak(
            sakId = "1000",
            belopMindreEnnSats = true,
            viseNavAdresse = true,
            mottattDato = LocalDate.of(2025, 7, 28),
            brevOpprettetDato = LocalDate.of(2025, 7, 28),
            bestillingsDato = LocalDate.of(2025, 7, 1),
            nesteKravdato = LocalDate.of(LocalDate.now().plusYears(1).year, 1, 1),
            barnetsFulleNavn = "Berømt Aktivitet",
            utbetalesTilNavn = "Berømt Aktivitet",
            barnetsFodselsnummer = "26848497710",
            belop = "1337,99",
            sats = 2,
            satsBelop = "2050,00",
            sfæriskStyrkeHøyre = "+4,50",
            cylinderstyrkeHøyre = "-2,50",
            sfæriskStyrkeVenstre = "+4,50",
            cylinderstyrkeVenstre = "-2,50",
        )
        genererPdfFraTemplateResource("/brev/hotsak/barnebrillerInnvilgetHotsak.bokmal.hbs", data)
        genererPdfFraTemplateResource("/brev/hotsak/barnebrillerInnvilgetHotsak.nynorsk.hbs", data)
    }

    @Test
    fun `Template barnebrillerAvslagManglendeOpplysningerHotsak`() {
        val data = BarnebrillerAvslagManglendeOpplysningerHotsak(
            sakId = "1001",
            viseNavAdresse = true,
            mottattDato = LocalDate.of(2025, 7, 28),
            brevOpprettetDato = LocalDate.of(2025, 7, 28),
            etterspurteOpplysningerBrevDatertDato = LocalDate.of(2025, 4, 1),
            barnetsFulleNavn = "Berømt Aktivitet",
            barnetsFodselsnummer = "26848497710",
            fritekstSaksbehandler = "Veldig sen å svare, nå gidder jeg ikke mer!",
        )
        genererPdfFraTemplateResource("/brev/hotsak/barnebrillerAvslagManglendeOpplysningerHotsak.bokmal.hbs", data)
        genererPdfFraTemplateResource("/brev/hotsak/barnebrillerAvslagManglendeOpplysningerHotsak.nynorsk.hbs", data)
    }

    @Test
    fun `Template barnebrillerAvslagHotsak`() {
        val data = BarnebrillerAvslagHotsak(
            sakId = "1002",
            viseNavAdresse = true,
            mottattDato = LocalDate.of(2025, 7, 28),
            brevOpprettetDato = LocalDate.of(2025, 7, 28),
            bestillingsDato = LocalDate.of(2025, 7, 1),
            forrigeBrilleDato = LocalDate.of(2025, 4, 1),
            barnetsFornavn = "Berømt",
            barnetsFulleNavn = "Berømt Aktivitet",
            barnetsFodselsnummer = "26848497710",
            sfæriskStyrkeHøyre = "+4,50",
            cylinderstyrkeHøyre = "-2,50",
            sfæriskStyrkeVenstre = "+4,50",
            cylinderstyrkeVenstre = "-2,50",
            begrunnelser = BarnebrillerAvslagHotsakBegrunnelser(
                avslagEksisterendeVedtak = true,
                avslagOver18 = true,
                avslagIkkeMedlem = true,
                avslagForLavBrillestyrke = true,
                avslagBestillingsdatoEldreEnn6Mnd = true,
                avslagIkkeBestiltHosOptiker = true,
                avslagBrilleglass = true,
                avslagAbonnement = true,
            ),
        )
        genererPdfFraTemplateResource("/brev/hotsak/barnebrillerAvslagHotsak.bokmal.hbs", data)
        genererPdfFraTemplateResource("/brev/hotsak/barnebrillerAvslagHotsak.nynorsk.hbs", data)
    }

    @Test
    fun `Template barnebrillerInnhenteOpplysninger`() {
        val data = BarnebrillerInnhenteOpplysninger(
            sakId = "1003",
            viseNavAdresse = true,
            mottattDato = LocalDate.of(2025, 7, 28),
            brevOpprettetDato = LocalDate.of(2025, 7, 28),
            barnetsFulleNavn = "Berømt Aktivitet",
            barnetsFodselsnummer = "26848497710",
            fritekstSaksbehandler = "Fortell meg mere!",
        )
        genererPdfFraTemplateResource("/brev/hotsak/barnebrillerInnhenteOpplysninger.bokmal.hbs", data)
        genererPdfFraTemplateResource("/brev/hotsak/barnebrillerInnhenteOpplysninger.nynorsk.hbs", data)
    }

    @Test
    fun `Template journalfortNotatHotsak`() {
        val data = JournalfortNotatHotsak(
            sakId = "1004",
            brevOpprettetDato = LocalDate.of(2025, 7, 28),
            brukersFulleNavn = "Berømt Aktivitet",
            brukersFodselsnummer = "26848497710",
            saksbehandlersEnhetsnavn = "Nav Hjelpemiddelsentral Tromsø",
            tittel = "Eksempelnotat",
            innholdMarkdown = """
                **Lorem ipsum dolor sit amet**, consectetur adipiscing elit. Donec porttitor sollicitudin egestas. Etiam auctor scelerisque massa id suscipit. Vestibulum libero magna, tristique sed massa ut, lobortis pretium nulla. Etiam luctus nibh augue, vel dictum diam bibendum tincidunt. Ut sed nulla sapien. Vestibulum lacinia porta nibh, in hendrerit erat rutrum sed. Aliquam augue ex, porta at massa ut, tincidunt aliquet urna. In porta nibh quis magna semper mollis. Donec pellentesque est vel libero tempor, bibendum laoreet lorem pellentesque. Quisque nunc justo, pretium sit amet turpis ut, interdum euismod sem. Vestibulum vel mauris nibh. Aenean malesuada leo eros. Nulla eget turpis justo. Donec massa nunc, ultrices vitae sodales ut, vulputate non tortor. Phasellus interdum eu eros quis efficitur. Duis congue condimentum sem eu lacinia.
                
                *Aenean ultrices velit vel vehicula viverra. Nunc sagittis at erat eget malesuada. Suspendisse potenti. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis quis sapien eu nulla rutrum lacinia. Suspendisse tincidunt ipsum vel tempor dignissim. Nulla nisi quam, venenatis ut magna a, commodo venenatis sapien. Donec at urna commodo, mollis tellus eu, vehicula arcu. Donec id enim at sem facilisis varius. Duis in lobortis mauris, vel suscipit lectus. Nunc non metus nec nisl elementum convallis ac consequat mauris. Curabitur pretium erat ipsum, eget cursus odio luctus in. Praesent malesuada sem vitae condimentum facilisis.*
                
                Praesent et mollis mi, vel efficitur mauris. Morbi eu tellus felis. Sed vel tristique dui. Morbi venenatis est non arcu aliquet dignissim. Phasellus hendrerit purus ligula, ac interdum nisi feugiat vel. Sed semper sapien et pretium pretium. Sed vitae leo lorem.
                
                Fusce semper arcu ut quam auctor, id ultricies neque auctor. Aenean aliquam metus ut dui porta, at laoreet augue porttitor. Duis nec porttitor felis, vel viverra erat. Morbi aliquet dolor id cursus placerat. Aenean pulvinar consectetur urna non consequat. Morbi tempus cursus eros, vestibulum convallis sem sodales id. Praesent convallis bibendum velit, id dignissim metus ornare ac. Praesent ante diam, porttitor non fringilla vitae, sodales eu mi. Curabitur porttitor nec erat id tincidunt. Aenean ac turpis leo. Vestibulum dapibus elit vel urna venenatis, vitae varius ligula varius. Aliquam interdum dui dui, vel suscipit dolor condimentum id.
                
                ### Formating tests:
                
                **Hey**
                
                *itallics*
                
                ***Heyitalics***
                
                <u>Underlinitcious</u>
                
                Unordered list items:
                * Bullet 0
                * Bullet 1

                Ordered list items:
                1. Item 1
                2. Item 2
                3. Item 3

                Tasks:
                * [X] Task 1
                * [ ] Task 2

                Quote:
                > Lorem ipsum dolor sit amet!
                
                Qed.
            """.trimIndent()
        )
        genererPdfFraTemplateResource("/brev/hotsak/journalfortNotatHotsak.bokmal.hbs", data)
        genererPdfFraTemplateResource("/brev/hotsak/journalfortNotatHotsak.nynorsk.hbs", data)
    }

    @Test
    fun `Template barnebrillerAvvisningDirekteoppgjor`() {
        val data = BarnebrillerAvvisningDirekteoppgjor(
            sakId = "1003",
            viseNavAdresse = true,
            mottattDato = LocalDate.of(2025, 7, 28),
            brevOpprettetDato = LocalDate.of(2025, 7, 28),
            barnetsFulleNavn = "Berømt Aktivitet",
            barnetsFodselsnummer = "26848497710",
            fritekstSaksbehandler = "Fortell meg mere!",
            begrunnelser = BarnebrillerAvvisningDirekteoppgjorBegrunnelser(),
        )
        genererPdfFraTemplateResource("/brev/brille-api/barnebrillerAvvisningDirekteoppgjor.bokmal.hbs", data)
        genererPdfFraTemplateResource("/brev/brille-api/barnebrillerAvvisningDirekteoppgjor.nynorsk.hbs", data)
    }
}
