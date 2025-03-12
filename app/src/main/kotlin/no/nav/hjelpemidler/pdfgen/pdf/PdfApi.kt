package no.nav.hjelpemidler.pdfgen.pdf

import io.github.oshai.kotlinlogging.KotlinLogging
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.http.content.PartData
import io.ktor.http.content.forEachPart
import io.ktor.server.request.receive
import io.ktor.server.request.receiveMultipart
import io.ktor.server.response.respond
import io.ktor.server.response.respondBytes
import io.ktor.server.routing.Route
import io.ktor.server.routing.post
import io.ktor.utils.io.ByteChannel
import io.ktor.utils.io.copyAndClose
import io.ktor.utils.io.jvm.javaio.toInputStream
import java.io.InputStream

private val log = KotlinLogging.logger { }

fun Route.pdfApi(pdfService: PdfService) {
    post("/api/html-til-pdf") {
        val html = call.receive<String>()
        val pdf = pdfService.lagPdf(html)
        call.respondBytes(pdf, ContentType.Application.Pdf)
    }

    post("/api/kombiner-til-pdf") {
        try {
            val multiPartData = call.receiveMultipart()
            val sources = mutableListOf<InputStream>()
            multiPartData.forEachPart { part ->
                if (part is PartData.FileItem) {
                    val channel = ByteChannel()
                    part.provider().copyAndClose(channel)
                    sources.add(channel.toInputStream())
                }
            }
            val pdf = pdfService.kombinerPdf(sources)
            multiPartData.forEachPart { it.dispose() }
            call.respondBytes(pdf, ContentType.Application.Pdf)
        } catch (e: Exception) {
            log.error(e) { "Feil ved kombinering av PDF-er" }
            call.respond(HttpStatusCode.InternalServerError, "Feil ved kombinering av PDF-er")
        }
    }
}
