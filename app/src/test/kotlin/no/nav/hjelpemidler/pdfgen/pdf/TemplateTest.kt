package no.nav.hjelpemidler.pdfgen.pdf

import no.nav.hjelpemidler.pdfgen.template.TemplateService
import org.junit.jupiter.api.Test
import java.io.File
import java.io.StringWriter
import java.time.LocalDate

class TemplateTest {
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
            "brevOpprettetDato" to "28. januar 2025",
            "barnetsFulleNavn" to "Berømt Aktivitet",
            "barnetsFodselsnummer" to "26848497710",
            "mottattDato" to "28. januar 2025",
            "belop" to "1337,99",
            "bestillingsDato" to "1. juli 2025",
            "utbetalesTilNavn" to "Berømt Aktivitet",
            "sats" to "2",
            "satsBelop" to "2050,00",
            "sfæriskStyrkeHøyre" to "+4,50",
            "cylinderstyrkeHøyre" to "-2,50",
            "sfæriskStyrkeVenstre" to "+4,50",
            "cylinderstyrkeVenstre" to "-2,50",
            "nesteKravdato" to LocalDate.now().plusYears(1).year.toString(),
            "bunntekst" to "Saksnummer 1000",
            "belopMindreEnnSats" to true,
            "viseNavAdresse" to true,
            "viseNavAdresseHot" to false,
        )
        genererPdfFraTemplateResource("/template/barnebrillerInnvilgetHotsak.bokmaal.hbs", data)
        genererPdfFraTemplateResource("/template/barnebrillerInnvilgetHotsak.nynorsk.hbs", data)
    }
}
