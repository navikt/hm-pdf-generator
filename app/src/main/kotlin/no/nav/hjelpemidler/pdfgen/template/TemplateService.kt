package no.nav.hjelpemidler.pdfgen.template

import com.github.jknack.handlebars.Handlebars
import com.github.jknack.handlebars.io.ClassPathTemplateLoader
import no.nav.hjelpemidler.localization.LOCALE_NORWEGIAN_BOKMÅL
import java.io.Writer
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.time.format.FormatStyle

class TemplateService {
    private val handlebars: Handlebars = Handlebars(ClassPathTemplateLoader("/dokumentmaler", ".hbs")).apply {
        registerHelper("markdown", MarkdownHelper)
    }

    fun compile(template: String, context: Map<String, Any?> = emptyMap(), writer: Writer) {
        val commonData = context["commonData"] as MutableMap<String, Any?>? ?: mutableMapOf()
        commonData += commonData()
        handlebars.compileInline(template).apply(context + commonData, writer)
    }

    private fun commonData(): Map<String, Any?> {
        val dagensDato = LocalDate.now().format(formatter)
        return mapOf(
            "dagensDato" to dagensDato,
        )
    }

    private val formatter: DateTimeFormatter = DateTimeFormatter
        .ofLocalizedDate(FormatStyle.MEDIUM)
        .withLocale(LOCALE_NORWEGIAN_BOKMÅL)
}
