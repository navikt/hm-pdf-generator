package no.nav.hjelpemidler.pdfgen.template

import com.github.jknack.handlebars.Handlebars
import com.github.jknack.handlebars.Handlebars.SafeString
import com.github.jknack.handlebars.Helper
import com.github.jknack.handlebars.io.ClassPathTemplateLoader
import com.github.rjeschke.txtmark.Processor
import no.nav.hjelpemidler.localization.LOCALE_NORWEGIAN_BOKMÅL
import java.io.Writer
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.time.format.FormatStyle

class TemplateService {
    private val handlebars: Handlebars = Handlebars(ClassPathTemplateLoader("/delmaler/"))
        .registerHelper("markdown", Helper<String> { context, _ ->
            SafeString(Processor.process(context ?: return@Helper null))
        })
        .registerHelper("formaterDato", Helper<LocalDate> { context, _ ->
            formatter.format(context ?: return@Helper null)
        })
        .registerHelper("concat", Helper<Any> { context, options ->
            "${context ?: return@Helper null} ${options.params.joinToString(" ")}".trim()
        })

    private val formatter: DateTimeFormatter = DateTimeFormatter
        .ofLocalizedDate(FormatStyle.MEDIUM)
        .withLocale(LOCALE_NORWEGIAN_BOKMÅL)

    fun compile(template: String, context: Map<String, Any?> = emptyMap(), writer: Writer) {
        handlebars.compileInline(template).apply(context, writer)
    }
}
