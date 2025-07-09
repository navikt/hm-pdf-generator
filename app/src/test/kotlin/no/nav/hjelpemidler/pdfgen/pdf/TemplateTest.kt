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

    private val templateBrillerVedtakInnvilget: String = fromResrouce("/template/briller.vedtak.innvilget.hbs")

    @Test
    fun `Generer vedtak for - Du får tilskudd til briller`() {
        val req = Request(
            template = templateBrillerVedtakInnvilget,
            data = mapOf(
                "navn" to "Berømt Aktivitet",
                "fødselsnummer" to "26848497710",
                "kravDato" to "28. januar 2025",
                "beløp" to "1337,99",
                "satsnummer" to "1234",
                "høyreSfære" to "+4,50",
                "satsnummer" to "4",
                "sats" to "4550",
                "høyreCylinder" to "-2,50",
                "venstreSfære" to "+4,50",
                "venstreCylinder" to "-2,50",
                "nesteÅrstall" to LocalDate.now().plusYears(1).year.toString(),
            ),
        )
        genererPdf(req, "vedtak_innvilget.pdf")
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
