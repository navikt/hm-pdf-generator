package no.nav.hjelpemidler.pdfgen.template

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.io.StringWriter

class TemplateServiceTest {
    private val templateService = TemplateService()

    @Test
    fun `eq returns true when values are equal`() {
        val writer = StringWriter()

        templateService.compile(
            "{{#eq first second}}same{{else}}different{{/eq}}",
            mapOf("first" to "abc", "second" to "abc"),
            writer,
        )

        val foo = writer.toString()
        println(foo)

        assertEquals("same", writer.toString())
    }

    @Test
    fun `eq returns false when values are different`() {
        val writer = StringWriter()

        templateService.compile(
            "{{#eq first second}}same{{else}}different{{/eq}}",
            mapOf("first" to "abc", "second" to "def"),
            writer,
        )

        assertEquals("different", writer.toString())
    }
}
