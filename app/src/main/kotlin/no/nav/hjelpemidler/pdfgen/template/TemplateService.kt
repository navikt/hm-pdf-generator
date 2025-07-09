package no.nav.hjelpemidler.pdfgen.template

import com.github.jknack.handlebars.Handlebars
import com.github.jknack.handlebars.io.ClassPathTemplateLoader
import no.nav.hjelpemidler.localization.LOCALE_NORWEGIAN_BOKMÅL
import java.io.Writer
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.time.format.FormatStyle

class TemplateService {
    fun compile(template: String, context: Map<String, Any?> = emptyMap(), writer: Writer) {
        handlebars.compileInline(template).apply(deepMerge(commonData(), context), writer)
    }

    private fun commonData(): Map<String, Any?> {
        val dagensDato = LocalDate.now().format(formatter)
        return mapOf(
            "commonData" to mapOf(
                "dagensDato" to dagensDato,
            ),
        )
    }

    private val handlebars: Handlebars = Handlebars(ClassPathTemplateLoader("/dokumentmaler", ".hbs")).apply {
        registerHelper("markdown", MarkdownHelper)
    }

    private val formatter: DateTimeFormatter = DateTimeFormatter
        .ofLocalizedDate(FormatStyle.MEDIUM)
        .withLocale(LOCALE_NORWEGIAN_BOKMÅL)

    private fun deepMerge(map1: Map<String, Any?>, map2: Map<String, Any?>): Map<String, Any?> {
        val result = map1.toMutableMap()
        map2.forEach { (key, value) ->
            if (result.containsKey(key)) {
                val existingValue = result[key]
                if (existingValue is Map<*, *> && value is Map<*, *>) {
                    // Recursively merge nested maps
                    @Suppress("UNCHECKED_CAST")
                    result[key] = deepMerge(existingValue as Map<String, Any?>, value as Map<String, Any?>)
                } else {
                    // Overwrite or apply custom logic for non-map values
                    result[key] = value
                }
            } else {
                result[key] = value
            }
        }
        return result
    }
}
