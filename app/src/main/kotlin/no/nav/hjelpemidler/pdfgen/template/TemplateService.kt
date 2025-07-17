package no.nav.hjelpemidler.pdfgen.template

import com.github.jknack.handlebars.Handlebars
import com.github.jknack.handlebars.Handlebars.SafeString
import com.github.jknack.handlebars.Helper
import com.github.jknack.handlebars.io.ClassPathTemplateLoader
import com.vladsch.flexmark.ext.gfm.tasklist.TaskListExtension
import com.vladsch.flexmark.html.HtmlRenderer
import com.vladsch.flexmark.parser.Parser
import no.nav.hjelpemidler.localization.LOCALE_NORWEGIAN_BOKMÅL
import java.io.Writer
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.time.format.FormatStyle

private val extensions = listOf(TaskListExtension.create())
private val parser = Parser.builder().extensions(extensions).build()
private val renderer = HtmlRenderer.builder().extensions(extensions).build()

class TemplateService {
    private val handlebars: Handlebars = Handlebars(ClassPathTemplateLoader("/delmaler/"))
        .registerHelper("markdown", Helper<String> { context, _ ->
            SafeString(context?.let {
                renderer.render(parser.parse(it))
                    // Avkryssingsbokser som er krysset ut funker litt dårlig med openhtmltopdf, bytter de ut med
                    // karakterer fra fonten som viser avkryssingsboks med og uten kryss.
                    .replace(Regex("<input[^>]*checked[^>]*>"), "&#x2611;")
                    .replace(Regex("<input[^>]*>"), "&#x2610;")
            } ?: return@Helper null)
        })
        .registerHelper("formaterDato", Helper<LocalDate> { context, _ ->
            formatter.format(context ?: return@Helper null)
        })
        .registerHelper("concat", Helper<Any> { context, options ->
            "${context ?: return@Helper null} ${options.params.joinToString(" ")}".trim()
        })

    private val formatter: DateTimeFormatter = DateTimeFormatter
        .ofLocalizedDate(FormatStyle.LONG)
        .withLocale(LOCALE_NORWEGIAN_BOKMÅL)

    fun compile(template: String, context: Any, writer: Writer) {
        handlebars.compileInline(template).apply(context, writer)
    }
}
