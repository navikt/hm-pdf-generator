package no.nav.hjelpemidler.pdfgen.pdf

import no.nav.hjelpemidler.pdfgen.modell.BarnebrillerInnvilgetHotsak
import no.nav.hjelpemidler.pdfgen.template.TemplateService
import org.junit.jupiter.api.Test
import java.io.File
import java.io.StringWriter
import java.time.LocalDate
import kotlin.reflect.full.memberProperties

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
            mottattDato = LocalDate.of(2025, 1, 28),
            brevOpprettetDato = LocalDate.of(2025, 1, 28),
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
}
