package no.nav.hjelpemidler.pdfgen.pdf

import io.ktor.http.ContentType
import io.ktor.http.content.PartData
import io.ktor.http.content.forEachPart
import io.ktor.http.content.readAllParts
import io.ktor.http.content.streamProvider
import io.ktor.server.application.call
import io.ktor.server.request.receive
import io.ktor.server.request.receiveMultipart
import io.ktor.server.response.respondBytes
import io.ktor.server.routing.Route
import io.ktor.server.routing.post
import mu.KotlinLogging

private val log = KotlinLogging.logger { }

fun Route.pdfApi(pdfService: PdfService) {
    post("/api/html-til-pdf") {
        val html = call.receive<String>()
        log.info("Fikk inn HTML: '$html'")
        val pdf = pdfService.lagPdf(html)
        call.respondBytes(pdf, ContentType.Application.Pdf)
    }

    post("/api/kombiner-til-pdf") {
        val multiPartData = call.receiveMultipart()
        val sources = multiPartData.readAllParts().mapNotNull { part ->
            when (part) {
                is PartData.FileItem -> part.streamProvider()
                else -> null
            }
        }
        val pdf = pdfService.kombinerPdf(sources)
        multiPartData.forEachPart { it.dispose() }
        call.respondBytes(pdf, ContentType.Application.Pdf)
    }
}
