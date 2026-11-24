package no.nav.hjelpemidler.pdfgen.pdf

import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldContain
import io.ktor.client.call.body
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.http.contentType
import io.ktor.http.withCharset
import io.ktor.server.testing.testApplication
import no.nav.hjelpemidler.pdfgen.main
import no.nav.hjelpemidler.serialization.jackson.jsonMapper
import org.apache.pdfbox.Loader
import org.apache.pdfbox.text.PDFTextStripper
import org.junit.jupiter.api.Test
import tools.jackson.module.kotlin.readValue
import java.io.File

class SoknadPdfApiTest {
    @Test
    fun `soknad endpoints return readable PDFs`() = testApplication {
        application { main() }
        for ((fixture, expectedPages, expectedText) in listOf(
            Triple(
                "behovsmelding",
                4,
                listOf(
                    "Søknad om hjelpemidler",
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
                val text = PDFTextStripper().getText(pdf).replace(Regex("\\s+"), " ")
                if (fixture != "barnebrille") text shouldContain "24.11.2026"
                for (expected in expectedText) {
                    text shouldContain expected
                }
            }
        }
    }

    @Test
    fun `barnebrille accepts missing optional prescription fields`() = testApplication {
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
    fun `malformed JSON does not return a successful PDF response`() = testApplication {
        application { main() }
        val response = client.post("/api/behovsmelding") {
            contentType(ContentType.Application.Json)
            setBody("{")
        }
        response.status shouldBe HttpStatusCode.BadRequest
    }

    @Test
    fun `rendering failures do not return a partial PDF response`() = testApplication {
        application { main() }
        val response = client.post("/api/brukerpassbytte") {
            contentType(ContentType.Application.Json)
            setBody(json("brukerpassbytte").replace("2026-11-24", "invalid-date"))
        }
        response.status shouldBe HttpStatusCode.InternalServerError
        response.contentType() shouldBe ContentType.Text.Plain.withCharset(Charsets.UTF_8)
    }

    private fun data(name: String): Map<String, Any?> = jsonMapper.readValue(json(name))

    private fun json(name: String): String =
        javaClass.inputStream("/soknad/$name.json").bufferedReader().use { it.readText() }
}
