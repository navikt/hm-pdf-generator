package no.nav.hjelpemidler.pdfgen.pdf

import io.github.oshai.kotlinlogging.KotlinLogging
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.http.content.PartData
import io.ktor.http.content.asFlow
import io.ktor.server.request.receiveMultipart
import io.ktor.server.request.receiveText
import io.ktor.server.response.respond
import io.ktor.server.response.respondOutputStream
import io.ktor.server.routing.Route
import io.ktor.server.routing.post
import io.ktor.utils.io.toByteArray
import kotlinx.coroutines.flow.filterIsInstance
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.toList

private val log = KotlinLogging.logger { }

fun Route.pdfApi(pdfService: PdfService) {
    post("/api/html-til-pdf") {
        try {
            val html = call.receiveText()
            call.respondOutputStream(ContentType.Application.Pdf) {
                pdfService.lagPdf(html, this)
            }
        } catch (e: Exception) {
            val message = "Feil under generering av PDF"
            log.error(e) { message }
            call.respond(HttpStatusCode.InternalServerError, message)
        }
    }

    post("/api/kombiner-til-pdf") {
        try {
            val byteArrays = call.receiveMultipart().asFlow()
                .filterIsInstance<PartData.FileItem>()
                .map { partData ->
                    val byteArray = partData.provider().toByteArray()
                    partData.dispose()
                    byteArray
                }
                .toList()
            call.respondOutputStream(ContentType.Application.Pdf) {
                pdfService.kombinerPdf(byteArrays, this)
            }
        } catch (e: Exception) {
            val message = "Feil under kombinering av PDF-er"
            log.error(e) { message }
            call.respond(HttpStatusCode.InternalServerError, message)
        }
    }
}
