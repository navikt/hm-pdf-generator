package no.nav.hjelpemidler.pdfgen.pdf

import io.kotest.matchers.shouldBe
import org.apache.pdfbox.Loader
import org.apache.pdfbox.text.PDFTextStripper
import org.junit.jupiter.api.Test
import java.io.ByteArrayOutputStream

class PdfServiceTest {
    @Test
    fun `fonts without substitution preserve ligature text in all font styles and repeated renders`() {
        val pdfService = PdfService()
        val expected = "Hoftestøtter bekrefter kaffe fisk flaske"
        val html = """
            <html><head><style>body { font-family: 'Source Sans Pro'; }</style></head>
            <body><p>$expected</p><p><b>$expected</b></p><p><i>$expected</i></p>
            <p><b><i>$expected</i></b></p></body></html>
        """.trimIndent()
        repeat(2) {
            val output = ByteArrayOutputStream()
            pdfService.lagPdf(html, output, fontSubstitution = false)
            Loader.loadPDF(output.toByteArray()).use { pdf ->
                PDFTextStripper().getText(pdf).trim().lines() shouldBe List(4) { expected }
            }
        }
    }
}
