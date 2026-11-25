package no.nav.hjelpemidler.pdfgen.template

import com.github.jknack.handlebars.Context
import com.github.jknack.handlebars.Handlebars
import com.github.jknack.handlebars.Helper
import com.github.jknack.handlebars.io.ClassPathTemplateLoader
import no.nav.hjelpemidler.pdfgen.pdf.inputStream
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.Base64

class SoknadTemplateService {
    private val dateFormatter = DateTimeFormatter.ofPattern("dd.MM.yyyy")
    private val images = listOf(
        "Navlogo.png",
        "info-icon.png",
        "info-icon.hbs",
        "information-circle.png",
        "warning-icon.hbs",
        "wc-maal-gulvmontert.png",
        "wc-maal-veggmontert.png",
    ).associateWith { name ->
        val contentType = if (name.endsWith(".hbs")) "image/svg+xml" else "image/png"
        val bytes = javaClass.inputStream("/delmaler/images/$name").use { it.readAllBytes() }
        "data:$contentType;base64,${Base64.getEncoder().encodeToString(bytes)}"
    }
    private val handlebars = Handlebars(ClassPathTemplateLoader("/soknad/"))
        .registerHelper("iso_to_date", Helper<String> { date, _ ->
            date?.let { dateFormatter.format(LocalDate.parse(it, DateTimeFormatter.ISO_DATE)) } ?: ""
        })
        .registerHelper("image", Helper<String> { name, _ ->
            images[name] ?: error("Fant ikke bilde: '$name'")
        })
        .registerHelper("eq", Helper<Any?> { value, options ->
            if (value?.toString() == options.param<Any?>(0)?.toString()) options.fn() else options.inverse()
        })
        .registerHelper("gt", Helper<Number> { value, options ->
            if (value.toDouble() > options.param<Number>(0).toDouble()) options.fn() else options.inverse()
        })
        .registerHelper("any", Helper<Any?> { value, options ->
            if ((listOf(value) + options.params).any { !options.isFalsy(it) }) options.fn() else options.inverse()
        })
        .registerHelper("filter", Helper<Iterable<*>> { values, options ->
            val path = options.param<String>(0)
            val expected = options.param<String>(1)
            val buffer = options.buffer()
            values?.forEach { value ->
                if (Context.newBuilder(value).build().get(path)?.toString() == expected) {
                    buffer.append(options.fn(value))
                }
            }
            buffer
        })

    fun html(template: String, data: Map<String, Any?>): String = handlebars.compile(template).apply(data)
}
