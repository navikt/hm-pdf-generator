package no.nav.hjelpemidler.pdfgen.template

import com.github.jknack.handlebars.Handlebars.SafeString
import com.github.jknack.handlebars.Helper
import com.github.jknack.handlebars.Options
import com.github.rjeschke.txtmark.Processor

object MarkdownHelper : Helper<String> {
    override fun apply(context: String?, options: Options): Any? =
        if (context == null) {
            null
        } else {
            SafeString(Processor.process(context))
        }
}
