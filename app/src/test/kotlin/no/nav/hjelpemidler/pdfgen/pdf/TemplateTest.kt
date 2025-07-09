package no.nav.hjelpemidler.pdfgen.pdf

import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.bodyAsBytes
import io.ktor.http.isSuccess
import kotlinx.coroutines.runBlocking
import no.nav.hjelpemidler.http.createHttpClient
import org.junit.jupiter.api.Test
import java.io.File
import java.time.LocalDate

class TemplateTest {
    private fun fromResrouce(resource: String) =
        javaClass
        .inputStream(resource)
        .use { it.buffered().readAllBytes().toString(Charsets.UTF_8) }
        // Openhtmltopdf interprets raw newlines as <br/>, lets strip them away
        .replace(Regex("\\s*\n\\s*"), " ")

    private val templateBarnebrillerInnvilgetHotsakBokmaal = fromResrouce("/template/barnebrillerInnvilgetHotsak.bokmaal.hbs")
    private val templateBarnebrillerInnvilgetHotsakNynorsk = fromResrouce("/template/barnebrillerInnvilgetHotsak.nynorsk.hbs")

    @Test
    fun `Template barnebrillerInnvilgetHotsak`() {
        val req = Request(
            template = templateBarnebrillerInnvilgetHotsakBokmaal,
            data = mapOf(
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
            ),
        )
        genererPdf(req, "barnebrillerInnvilgetHotsak.bokmaal.pdf")
        genererPdf(req.copy(template = templateBarnebrillerInnvilgetHotsakNynorsk), "barnebrillerInnvilgetHotsak.nynorsk.pdf")
    }

    private data class Request(val template: String, val data: Map<String, Any?>? = null)

    private fun genererPdf(req: Request, filename: String) {
        val client = createHttpClient() {
            expectSuccess = false
        }

        val pdf = runBlocking {
            val resp = client.post("http://localhost:8082/api/template") {
                header("Accept", "application/pdf")
                header("Content-Type", "application/json")
                setBody(req)
            }
            if (!resp.status.isSuccess()) throw RuntimeException("Feilet i produsere test-søknad: status=${resp.status}")
            resp.bodyAsBytes()
        }

        val dir = File("build/test-results/pdfs")
        dir.mkdirs()

        val file = File(dir, filename)
        file.writeBytes(pdf)
    }
}
