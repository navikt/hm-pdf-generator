package no.nav.hjelpemidler.saksbehandling.no.nav.hjelpemidler

import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.plugins.callloging.CallLogging
import io.ktor.server.request.path
import io.ktor.server.routing.routing
import no.nav.hjelpemidler.saksbehandling.internal
import no.nav.hjelpemidler.saksbehandling.no.nav.hjelpemidler.pdf.PdfService
import no.nav.hjelpemidler.saksbehandling.no.nav.hjelpemidler.pdf.pdfApi
import org.slf4j.event.Level

internal class ApplicationBuilder() {
    private val pdfService = PdfService()

    fun Application.configure() {
        install(CallLogging) {
            level = Level.DEBUG
            filter { call -> call.request.path().startsWith("/api") }
        }

        routing {
            internal()
            pdfApi(pdfService)
        }
    }
}
