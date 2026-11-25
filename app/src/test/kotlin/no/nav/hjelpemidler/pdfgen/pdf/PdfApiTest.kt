package no.nav.hjelpemidler.pdfgen.pdf

import ch.qos.logback.classic.Level
import ch.qos.logback.classic.Logger
import ch.qos.logback.classic.LoggerContext
import ch.qos.logback.classic.turbo.TurboFilter
import ch.qos.logback.core.spi.FilterReply
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldContain
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
import io.ktor.http.withCharset
import io.ktor.server.testing.testApplication
import no.nav.hjelpemidler.pdfgen.main
import no.nav.hjelpemidler.serialization.jackson.jsonMapper
import org.apache.pdfbox.Loader
import org.apache.pdfbox.text.PDFTextStripper
import org.slf4j.LoggerFactory
import org.slf4j.Marker
import tools.jackson.module.kotlin.readValue
import java.io.ByteArrayOutputStream
import java.io.File
import java.util.concurrent.ConcurrentLinkedQueue
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

    @Test
    fun `Skal lage behovsmelding brukerpassbytte og barnebrillekrav som lesbare PDF-er`() = testApplication {
        application { main() }
        for ((fixture, expectedPages, expectedText) in listOf(
            Triple(
                "behovsmelding",
                4,
                listOf(
                    "Søknad om hjelpemidler",
                    "Leveringsadresse Folkeregistrert adresse: Testveien 1, 0001 Teststed",
                    "Kategoriens hjelpemiddel",
                    "Kategoriens tilbehør",
                    "Testdør",
                    "testdor.pdf",
                    "kategori.pdf",
                    "stellebord.pdf",
                    "Vedlegg til veggmontert stellebord",
                    "test@example.invalid",
                    "Opplæringsansvarlig er gjort oppmerksom",
                    "Informasjon i testsaken",
                    "Advarsel i testsaken",
                    "Inline testvarsel",
                    "Hoftestøtter",
                ),
            ),
            Triple(
                "brukerpassbytte",
                1,
                listOf("Testbegrunnelse", "Testveien 2", "26848497710", "bekrefter"),
            ),
            Triple(
                "barnebrille",
                1,
                listOf(
                    "Tilskudd ved kjøp av briller til barn via optiker",
                    "Testbarn Testesen",
                    "26848497710",
                    "Testoptiker",
                    "123456789",
                    "Testveien 1, 0001 Teststed",
                    "1200.75",
                    "-2.5",
                    "0.75",
                    "1.25",
                    "-0.5",
                    "2026-11-24T10:15:30",
                    "2026-11-20",
                    "Testreferanse",
                    "hittil i år 2026",
                ),
            ),
        )) {
            val response = client.post("/api/$fixture") {
                contentType(ContentType.Application.Json)
                setBody(json(fixture))
            }
            response.status shouldBe HttpStatusCode.OK
            response.contentType() shouldBe ContentType.Application.Pdf
            val bytes = response.body<ByteArray>()
            File("build/test-results/pdfs").apply { mkdirs() }
                .resolve("soknad-$fixture.pdf").writeBytes(bytes)
            Loader.loadPDF(bytes).use { pdf ->
                pdf.numberOfPages shouldBe expectedPages
                pdf.documentCatalog.language shouldBe "nb"
                val text = PDFTextStripper().getText(pdf).replace(Regex("\\s+"), " ")
                if (fixture != "barnebrille") text shouldContain "24.11.2026"
                for (expected in expectedText) {
                    text shouldContain expected
                }
            }
        }
    }

    @Test
    fun `Skal lage barnebrillekrav uten valgfrie brillestyrkefelt`() = testApplication {
        application { main() }
        for (prescription in listOf(emptyMap(), mapOf("høyreSfære" to -2.5), mapOf("venstreSylinder" to null))) {
            val response = client.post("/api/barnebrille") {
                contentType(ContentType.Application.Json)
                setBody(jsonMapper.writeValueAsString(data("barnebrille") + ("brilleseddel" to prescription)))
            }
            response.status shouldBe HttpStatusCode.OK
            Loader.loadPDF(response.body<ByteArray>()).use { pdf ->
                PDFTextStripper().getText(pdf).apply {
                    shouldContain("Testbarn Testesen")
                    shouldContain("1200.75")
                    shouldContain("2026-11-20")
                }
            }
        }
    }

    @Test
    fun `Skal gi 400 ved ugyldig JSON i behovsmelding`() = testApplication {
        application { main() }
        val response = client.post("/api/behovsmelding") {
            contentType(ContentType.Application.Json)
            setBody("{")
        }
        response.status shouldBe HttpStatusCode.BadRequest
    }

    @Test
    fun `Skal gi 500 uten delvis PDF ved feil under generering av brukerpassbytte`() = testApplication {
        application { main() }
        val expectedMessages = listOf(
            "Feil under generering av PDF brukerpassbytte: HandlebarsException",
            "Feil under generering av PDF: brukerpassbytte",
        )
        val capturedMessages = ConcurrentLinkedQueue<String>()
        val loggerContext = LoggerFactory.getILoggerFactory() as LoggerContext
        val filter = object : TurboFilter() {
            override fun decide(
                marker: Marker?,
                logger: Logger,
                level: Level,
                format: String?,
                params: Array<out Any?>?,
                throwable: Throwable?,
            ): FilterReply {
                if (logger.name == "no.nav.hjelpemidler.pdfgen.pdf.PdfApi" &&
                    level == Level.ERROR && format in expectedMessages
                ) {
                    capturedMessages.add(requireNotNull(format))
                    return FilterReply.DENY
                }
                return FilterReply.NEUTRAL
            }
        }
        filter.start()
        loggerContext.addTurboFilter(filter)
        try {
            val response = client.post("/api/brukerpassbytte") {
                contentType(ContentType.Application.Json)
                setBody(json("brukerpassbytte").replace("2026-11-24", "invalid-date"))
            }
            response.status shouldBe HttpStatusCode.InternalServerError
            response.contentType() shouldBe ContentType.Text.Plain.withCharset(Charsets.UTF_8)
            capturedMessages.toList() shouldBe expectedMessages
        } finally {
            loggerContext.turboFilterList.remove(filter)
            filter.stop()
        }
    }

    private fun data(name: String): Map<String, Any?> = jsonMapper.readValue(json(name))

    private fun json(name: String): String =
        javaClass.inputStream("/soknad/$name.json").bufferedReader().use { it.readText() }

    private suspend fun lagPdf(html: String): ByteArray = ByteArrayOutputStream().use {
        pdfService.lagPdf(html, it)
        it.toByteArray()
    }
}

private fun FormBuilder.appendPdf(name: String, value: ByteArray) = append("name", value, Headers.build {
    append(HttpHeaders.ContentType, ContentType.Application.Pdf.toString())
    append(HttpHeaders.ContentDisposition, "filename=\"$name.pdf\"")
})
