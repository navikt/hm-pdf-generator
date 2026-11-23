package no.nav.hjelpemidler.pdfgen.template

import com.github.jknack.handlebars.EscapingStrategy
import com.github.jknack.handlebars.Handlebars
import com.github.jknack.handlebars.Handlebars.SafeString
import com.github.jknack.handlebars.Helper
import com.github.jknack.handlebars.io.ClassPathTemplateLoader
import com.vladsch.flexmark.ext.gfm.tasklist.TaskListExtension
import com.vladsch.flexmark.html.HtmlRenderer
import com.vladsch.flexmark.parser.Parser
import no.nav.hjelpemidler.localization.LOCALE_NORWEGIAN_BOKMÅL
import no.nav.hjelpemidler.time.ZONE_ID_EUROPE_OSLO
import java.io.Writer
import java.math.BigDecimal
import java.text.NumberFormat
import java.time.Instant
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.time.format.FormatStyle
import java.util.Locale

private val extensions = listOf(TaskListExtension.create())
private val parser = Parser.builder().extensions(extensions).build()
private val renderer = HtmlRenderer.builder().extensions(extensions).build()
private val OSLO = ZoneId.of("Europe/Oslo")

private val formatter: DateTimeFormatter = DateTimeFormatter
    .ofLocalizedDate(FormatStyle.LONG)
    .withLocale(LOCALE_NORWEGIAN_BOKMÅL)

private val formaterDato = Helper<LocalDate> { context, _ ->
    formatter.format(context ?: return@Helper null)
}

// Backtick, <, >, & og anførselstegn håndteres av HTML_ENTITY, som gjør dem til entiteter markdown ikke tolker.
private val MARKDOWN_TEGN = Regex("""[\\*_\[\]()#+\-.!|~{}]""")

private val markdownHandlebars: Handlebars = Handlebars()
    .with(EscapingStrategy { verdi ->
        if (verdi == null) "" else EscapingStrategy.HTML_ENTITY.escape(verdi.toString().replace(MARKDOWN_TEGN) { "\\" + it.value })
    })
    .registerHelper("formaterDato", formaterDato)

private fun renderMarkdown(markdown: String): String =
    renderer.render(parser.parse(markdown))
        // Avkryssingsbokser som er krysset ut funker litt dårlig med openhtmltopdf, bytter de ut med
        // karakterer fra fonten som viser avkryssingsboks med og uten kryss.
        .replace(Regex("<input[^>]*checked[^>]*>"), "&#x2611;")
        .replace(Regex("<input[^>]*>"), "&#x2610;")

class TemplateService {
    private val handlebars: Handlebars = Handlebars(ClassPathTemplateLoader("/delmaler/"))
        .registerHelper("markdown", Helper<String> { context, _ ->
            SafeString(renderMarkdown(context ?: return@Helper null))
        })
        .registerHelper("formaterDato", Helper<LocalDate> { context, _ ->
            formatter.format(context ?: return@Helper null)
        })
        .registerHelper("concat", Helper<Any> { context, options ->
            "${context ?: return@Helper null} ${options.params.joinToString(" ")}".trim()
        })
        .registerHelper(
            "eq",
            Helper<Any?> { context, options ->
                if (context?.toString() == options.param<Any?>(0)?.toString()) {
                    options.fn()
                } else {
                    options.inverse()
                }
            },
        )
        .registerHelper(
            "gt",
            Helper<Comparable<Any>> { context, options ->
                val param = options.param(0) as Comparable<Any>
                if (context > param) options.fn() else options.inverse()
            },
        )



    private val dateFormatter: DateTimeFormatter = DateTimeFormatter
        .ofLocalizedDate(FormatStyle.LONG)
        .withLocale(LOCALE_NORWEGIAN_BOKMÅL)

    private val dateTimeFormatter: DateTimeFormatter = DateTimeFormatter
        .ofLocalizedDateTime(FormatStyle.SHORT)
        .withLocale(LOCALE_NORWEGIAN_BOKMÅL)

    private val kronerFormatter: NumberFormat = NumberFormat
        .getNumberInstance(LOCALE_NORWEGIAN_BOKMÅL)
        .apply { minimumFractionDigits = 2 }


    fun compile(template: String, context: Any, writer: Writer) {
        handlebars.compileInline(template).apply(context, writer)
    }
}
