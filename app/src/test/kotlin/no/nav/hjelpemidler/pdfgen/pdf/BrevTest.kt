package no.nav.hjelpemidler.pdfgen.pdf

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

    private inline fun <reified T> genererPdfFraTemplateResource(resource: String, data: T)
        = genererPdfFraTemplateResource(resource, data::class.memberProperties.associate { prop -> prop.name to prop.call(data) })

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
        data class BrevData (
            val belopMindreEnnSats: Boolean, // " to true,
            val viseNavAdresse: Boolean, // " to true,
            val mottattDato: LocalDate, // " to LocalDate.of(2025, 1, 28),
            val brevOpprettetDato: LocalDate, // " to LocalDate.of(2025, 1, 28),
            val bestillingsDato: LocalDate, // " to LocalDate.of(2025, 7, 1),
            val nesteKravdato: LocalDate, // " to LocalDate.of(LocalDate.now().plusYears(1).year, 1, 1),
            val sakId: Long, // " to 1000,
            val barnetsFulleNavn: String, // " to "Berømt Aktivitet",
            val utbetalesTilNavn: String, // " to "Berømt Aktivitet",
            val barnetsFodselsnummer: String, // " to "26848497710",
            val belop: String, // " to "1337,99",
            val sats: Int, // " to 2,
            val satsBelop: String, // " to "2050,00",
            val sfæriskStyrkeHøyre: String, // " to "+4,50",
            val cylinderstyrkeHøyre: String, // " to "-2,50",
            val sfæriskStyrkeVenstre: String, // " to "+4,50",
            val cylinderstyrkeVenstre: String, // " to "-2,50",
        )
        val data = BrevData(
            belopMindreEnnSats = true,
            viseNavAdresse = true,
            mottattDato = LocalDate.of(2025, 1, 28),
            brevOpprettetDato = LocalDate.of(2025, 1, 28),
            bestillingsDato = LocalDate.of(2025, 7, 1),
            nesteKravdato = LocalDate.of(LocalDate.now().plusYears(1).year, 1, 1),
            sakId = 1000,
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
