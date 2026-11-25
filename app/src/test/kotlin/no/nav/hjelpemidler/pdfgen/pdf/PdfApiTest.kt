package no.nav.hjelpemidler.pdfgen.pdf

import io.kotest.matchers.shouldBe
import io.ktor.client.call.body
import io.ktor.client.request.forms.FormBuilder
import io.ktor.client.request.forms.formData
import io.ktor.client.request.forms.submitFormWithBinaryData
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.http.ContentType
import io.ktor.http.Headers
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpStatusCode
import io.ktor.http.contentType
import io.ktor.server.testing.testApplication
import no.nav.hjelpemidler.pdfgen.main
import java.io.ByteArrayOutputStream
import kotlin.test.Test

class PdfApiTest {
    private val pdfService = PdfService()

    private val html = javaClass
        .inputStream("/html/notat.html")
        .use { it.buffered().readAllBytes().toString(Charsets.UTF_8) }

    @Test
    fun `Skal konvertere HTML til PDF`() = testApplication {
        application { main() }

        val response = client.post("/api/html-til-pdf") {
            setBody(html)
        }

        response.status shouldBe HttpStatusCode.OK
        response.contentType() shouldBe ContentType.Application.Pdf
    }

    @Test
    fun `Skal kombinere til PDF uten feil`() = testApplication {
        application { main() }

        val pdf = lagPdf(html)
        val response = client.submitFormWithBinaryData("/api/kombiner-til-pdf", formData {
            appendPdf("pdf1", pdf)
            appendPdf("pdf2", pdf)
            appendPdf("pdf3", pdf)
        })

        response.status shouldBe HttpStatusCode.OK
        response.contentType() shouldBe ContentType.Application.Pdf

        val kombinertPdf = ByteArrayOutputStream().use {
            pdfService.kombinerPdf(
                listOf(pdf, pdf, pdf),
                it
            )
            it.toByteArray()
        }

        val body = response.body<ByteArray>()
        body.size shouldBe kombinertPdf.size
    }

    private val svartidsbrevJson = """
        {
          "navn": "Berømt Aktivitet",
          "fødselsnummer": "26848497710",
          "saksnummer": "1005",
          "dato": "2026-11-17T09:00:00Z",
          "mottattDato": "2026-10-01",
          "saksbehandler": "Kari Saksbehandler",
          "enhet": "Nav Hjelpemiddelsentral Oslo",
          "antallUker": "4 uker",
          "årsak": "Vi venter på opplysninger fra kommunen."
        }
    """.trimIndent()

    @Test
    fun `Skal lage svartidsbrev som PDF`() = testApplication {
        application { main() }

        for (målform in listOf("bokmål", "nynorsk")) {
            val response = client.post("/api/brev/hotsak/svartidsbrevJournalforing/$målform") {
                contentType(ContentType.Application.Json)
                setBody(svartidsbrevJson)
            }
            response.status shouldBe HttpStatusCode.OK
            response.contentType() shouldBe ContentType.Application.Pdf
        }
    }

    @Test
    fun `Skal lage enkelt svartidsbrev som PDF uten årsak`() = testApplication {
        application { main() }

        val utenÅrsak = svartidsbrevJson.replace(",\n  \"årsak\": \"Vi venter på opplysninger fra kommunen.\"", "")
        check("årsak" !in utenÅrsak)
        for (målform in listOf("bokmål", "nynorsk")) {
            val response = client.post("/api/brev/hotsak/svartidsbrevJournalforingEnkel/$målform") {
                contentType(ContentType.Application.Json)
                setBody(utenÅrsak)
            }
            response.status shouldBe HttpStatusCode.OK
            response.contentType() shouldBe ContentType.Application.Pdf
        }
    }

    @Test
    fun `Skal gi 400 ved manglende felt i svartidsbrev`() = testApplication {
        application { main() }

        val response = client.post("/api/brev/hotsak/svartidsbrevJournalforing/bokmål") {
            contentType(ContentType.Application.Json)
            setBody(svartidsbrevJson.replace("2026-11-17T09:00:00Z", "ikke-en-dato"))
        }
        response.status shouldBe HttpStatusCode.BadRequest

        val manglerFelt = client.post("/api/brev/hotsak/svartidsbrevJournalforing/bokmål") {
            contentType(ContentType.Application.Json)
            setBody("""{"navn": "Berømt Aktivitet"}""")
        }
        manglerFelt.status shouldBe HttpStatusCode.BadRequest
    }

    @Test
    fun `Skal gi 400 ved ukjent mappe`() = testApplication {
        application { main() }

        val response = client.post("/api/brev/ukjent/svartidsbrevJournalforing/bokmål") {
            contentType(ContentType.Application.Json)
            setBody(svartidsbrevJson)
        }
        response.status shouldBe HttpStatusCode.BadRequest
    }

    private suspend fun lagPdf(html: String): ByteArray = ByteArrayOutputStream().use {
        pdfService.lagPdf(html, it)
        it.toByteArray()
    }
}

private fun FormBuilder.appendPdf(name: String, value: ByteArray) = append("name", value, Headers.build {
    append(HttpHeaders.ContentType, ContentType.Application.Pdf.toString())
    append(HttpHeaders.ContentDisposition, "filename=\"$name.pdf\"")
})
