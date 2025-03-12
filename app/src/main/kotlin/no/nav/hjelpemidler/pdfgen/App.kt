package no.nav.hjelpemidler.pdfgen

import com.openhtmltopdf.slf4j.Slf4jLogger
import com.openhtmltopdf.util.XRLog
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.metrics.micrometer.MicrometerMetrics
import io.ktor.server.plugins.calllogging.CallLogging
import io.ktor.server.request.path
import io.ktor.server.routing.routing
import no.nav.hjelpemidler.pdfgen.pdf.PdfService
import no.nav.hjelpemidler.pdfgen.pdf.pdfApi
import org.slf4j.event.Level

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

fun Application.main() {
    XRLog.setLoggerImpl(Slf4jLogger())

    val pdfService = PdfService()

    install(CallLogging) {
        level = Level.INFO
        filter { call -> call.request.path().startsWith("/api") }
    }

    install(MicrometerMetrics) {
        registry = Metrics.registry
    }

    routing {
        internal()
        pdfApi(pdfService)
    }
}
