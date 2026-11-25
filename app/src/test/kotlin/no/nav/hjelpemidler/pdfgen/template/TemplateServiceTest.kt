package no.nav.hjelpemidler.pdfgen.template

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.io.StringWriter
import java.time.Instant

class TemplateServiceTest {
    private val templateService = TemplateService()

    @Test
    fun `concat joins the existing template values`() {
        val writer = StringWriter()

        templateService.compile(
            "{{concat first second}}",
            mapOf("first" to "abc", "second" to "def"),
            writer,
        )

        assertEquals("abc def", writer.toString())
    }

    @Test
    fun `existing templates still escape HTML values`() {
        val writer = StringWriter()

        templateService.compile(
            "{{value}}",
            mapOf("value" to "<b>test</b>"),
            writer,
        )

        assertEquals("&lt;b&gt;test&lt;/b&gt;", writer.toString())
    }

    @Test
    fun `formaterInstant uses the date in Oslo in winter and summer`() {
        for ((instant, expected) in listOf(
            "2026-11-16T23:30:00Z" to "17. november 2026",
            "2026-06-16T22:30:00Z" to "17. juni 2026",
        )) {
            val writer = StringWriter()

            templateService.compile(
                "{{formaterInstant dato}}",
                mapOf("dato" to Instant.parse(instant)),
                writer,
            )

            assertEquals(expected, writer.toString())
        }
    }
}
