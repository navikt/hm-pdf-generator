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
        // Openhtmltopdf interprets raw newlines as <br/>, lets strip them away
        .replace(Regex("\\s*\n\\s*"), " ")

    private val pdfService = PdfService()
    private val templateService = TemplateService()

    private val templateBarnebrillerInnvilgetHotsakBokmaal = fromResrouce("/template/barnebrillerInnvilgetHotsak.bokmaal.hbs")
    private val templateBarnebrillerInnvilgetHotsakNynorsk = fromResrouce("/template/barnebrillerInnvilgetHotsak.nynorsk.hbs")

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
            "sats" to "Sats 2",
            "satsBelop" to "2050,00",
            "sfæriskStyrkeHøyre" to "+4,50",
            "cylinderstyrkeHøyre" to "-2,50",
            "sfæriskStyrkeVenstre" to "+4,50",
            "cylinderstyrkeVenstre" to "-2,50",
            "nesteKravdato" to LocalDate.now().plusYears(1).year.toString(),
            "bunntekst" to "Saksnummer 1000",
        )
        genererPdf("barnebrillerInnvilgetHotsak.bokmaal.pdf", templateBarnebrillerInnvilgetHotsakBokmaal, data)
        genererPdf("barnebrillerInnvilgetHotsak.nynorsk.pdf", templateBarnebrillerInnvilgetHotsakNynorsk, data)
    }

    private fun genererPdf(filename: String, template: String, data: Map<String, Any?>? = null) {
        val htmlWriter = StringWriter()
        templateService.compile(template, data ?: mapOf(), htmlWriter)

        val dir = File("build/test-results/pdfs")
        dir.mkdirs()

        val file = File(dir, filename)
        pdfService.lagPdf(htmlWriter.toString(), file.outputStream())
    }
}
