package no.nav.hjelpemidler.pdfgen.pdf

import io.kotest.assertions.throwables.shouldThrow
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
import org.intellij.lang.annotations.Language
import java.io.ByteArrayInputStream
import kotlin.test.Test

class PdfApiTest {
    private val pdfService = PdfService()

    @Language("HTML")
    private val html = """<html><body>test</body></html>"""

    @Test
    fun `skal konvertere html til pdf`() = testApplication {
        val response = client.post("/api/html-til-pdf") {
            setBody(html)
        }

        response.status shouldBe HttpStatusCode.OK
        response.contentType() shouldBe ContentType.Application.Pdf
    }

    @Test
    fun `skal kombinere til pdf`() = testApplication {
        val pdf = pdfService.lagPdf(html)
        val response = client.submitFormWithBinaryData("/api/kombiner-til-pdf", formData {
            appendPdf("pdf1", pdf)
            appendPdf("pdf2", pdf)
            appendPdf("pdf3", pdf)
        })

        response.status shouldBe HttpStatusCode.OK
        response.contentType() shouldBe ContentType.Application.Pdf

        val kombinertPdf = pdfService.kombinerPdf(
            listOf(
                ByteArrayInputStream(pdf),
                ByteArrayInputStream(pdf),
                ByteArrayInputStream(pdf),
            )
        )

        val body = response.body<ByteArray>()
        body.size shouldBe kombinertPdf.size
    }

    @Test
    fun `skal kombinere til pdf med feil`() = testApplication {
        shouldThrow<RuntimeException> {
            client.submitFormWithBinaryData("/api/kombiner-til-pdf", formData {
                appendPdf("pdf", ByteArray(0))
            })
        }
    }

    private fun FormBuilder.appendPdf(name: String, value: ByteArray) = append("name", value, Headers.build {
        append(HttpHeaders.ContentType, ContentType.Application.Pdf.toString())
        append(HttpHeaders.ContentDisposition, "filename=\"$name.pdf\"")
    })
}
