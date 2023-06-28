package no.nav.hjelpemidler.pdfgen.pdf

import io.ktor.server.application.call
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.post
import mu.KotlinLogging

private val log = KotlinLogging.logger { }

fun Route.pdfApi(pdfService: PdfService) {
    post("/api/html-til-pdf") {
        val html = call.receive<String>()

        log.info("Fikk html: '$html'")
        val lagPdf: ByteArray = pdfService.lagPdf(html)

        call.respond(lagPdf)
    }
}
