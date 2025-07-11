package no.nav.hjelpemidler.pdfgen.pdf

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

    private fun genererPdfFraTemplateResource(resource: String, data: Map<String, Any?>? = null) {
        val template = fromResrouce(resource)

        val htmlWriter = StringWriter()
        templateService.compile(template, data ?: mapOf(), htmlWriter)

        val dir = File("build/test-results/pdfs")
        dir.mkdirs()

        val file = File(dir, resource.substringAfterLast("/").removeSuffix(".hbs") + ".pdf")
        pdfService.lagPdf(htmlWriter.toString(), file.outputStream())
    }

    @Test
    fun `Template barnebrillerInnvilgetHotsak`() {
        val data = mapOf(
            "belopMindreEnnSats" to true,
            "viseNavAdresse" to true,
            "mottattDato" to LocalDate.of(2025, 1, 28),
            "brevOpprettetDato" to LocalDate.of(2025, 1, 28),
            "bestillingsDato" to LocalDate.of(2025, 7, 1),
            "nesteKravdato" to LocalDate.now().plusYears(1).year.toString(),
            "saksnr" to "1000",
            "barnetsFulleNavn" to "Berømt Aktivitet",
            "utbetalesTilNavn" to "Berømt Aktivitet",
            "barnetsFodselsnummer" to "26848497710",
            "belop" to "1337,99",
            "sats" to "2",
            "satsBelop" to "2050,00",
            "sfæriskStyrkeHøyre" to "+4,50",
            "cylinderstyrkeHøyre" to "-2,50",
            "sfæriskStyrkeVenstre" to "+4,50",
            "cylinderstyrkeVenstre" to "-2,50",
        )
        genererPdfFraTemplateResource("/brev/hotsak/barnebrillerInnvilgetHotsak.bokmaal.hbs", data)
        genererPdfFraTemplateResource("/brev/hotsak/barnebrillerInnvilgetHotsak.nynorsk.hbs", data)
    }
}
