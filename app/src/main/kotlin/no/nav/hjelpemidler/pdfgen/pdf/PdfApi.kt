package no.nav.hjelpemidler.pdfgen.pdf

import io.github.oshai.kotlinlogging.KotlinLogging
import io.github.oshai.kotlinlogging.coroutines.withLoggingContextAsync
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.http.content.PartData
import io.ktor.http.content.asFlow
import io.ktor.server.request.accept
import io.ktor.server.request.receive
import io.ktor.server.request.receiveMultipart
import io.ktor.server.request.receiveText
import io.ktor.server.response.respond
import io.ktor.server.response.respondOutputStream
import io.ktor.server.response.respondTextWriter
import io.ktor.server.routing.Route
import io.ktor.server.routing.post
import io.ktor.utils.io.toByteArray
import kotlinx.coroutines.flow.filterIsInstance
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.toList
import no.nav.hjelpemidler.logging.secureError
import no.nav.hjelpemidler.pdfgen.template.TemplateService
import java.io.StringWriter

private val log = KotlinLogging.logger { }

fun Route.pdfApi(pdfService: PdfService, templateService: TemplateService) {
    post("/api/html-til-pdf") {
        val html = call.receiveText()
        try {
            call.respondOutputStream(ContentType.Application.Pdf) {
                pdfService.lagPdf(html, this)
            }
        } catch (e: Exception) {
            val message = "Feil under generering av PDF"
            log.error(e) { message }
            withLoggingContextAsync("html" to html) { log.secureError(e) { message } }
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

    post("/api/template") {
        try {
            data class Request(val template: String, val data: Map<String, Any> = mapOf())
            val req = call.receive<Request>()

            val acceptContentType = call.request.accept()?.let { ContentType.parse(it) } ?: ContentType.Text.Html
            when (acceptContentType) {
                ContentType.Text.Html -> {
                    call.respondTextWriter(ContentType.Text.Html) {
                        templateService.compile(req.template, req.data, this)
                    }
                }

                else -> {
                    call.respondOutputStream(ContentType.Application.Pdf) {
                        val writer = StringWriter()
                        templateService.compile(req.template, req.data, writer)
                        pdfService.lagPdf(writer.toString(), this)
                    }
                }
            }
        } catch (e: Exception) {
            log.error(e) { e.message }
            call.respond(HttpStatusCode.InternalServerError, "Feil under generering fra template")
        }

        /*try {
            val templateParts = call.receiveMultipart().asFlow()
                .filterIsInstance<PartData.FormItem>()
                .mapNotNull { partData ->
                    val templatePart = when (partData.contentType) {
                        ContentType.Text.Html,
                        ContentTypeHandlebarsTemplate,
                            -> TemplatePart.Template(partData.value)

                        ContentType.Application.Json,
                            -> TemplatePart.Data(jsonToValue(partData.value))

                        else -> null
                    }
                    partData.dispose()
                    templatePart
                }
                .toList()

            val template = templateParts.filterIsInstance<TemplatePart.Template>().single()
            val data = templateParts.filterIsInstance<TemplatePart.Data>().single()

            val acceptContentType = call.request.accept()?.let { ContentType.parse(it) } ?: ContentType.Text.Html
            when (acceptContentType) {
                ContentType.Text.Html -> {
                    call.respondTextWriter(ContentType.Text.Html) {
                        templateService.compile(template.value, data.value, this)
                    }
                }

                ContentType.Application.Pdf -> {
                    call.respondOutputStream(ContentType.Application.Pdf) {
                        val writer = StringWriter()
                        templateService.compile(template.value, data.value, writer)
                        pdfService.lagPdf(writer.toString(), this)
                    }
                }
            }
        } catch (e: Exception) {
            val message = "Fail!"
            log.error(e) { message }
            call.respond(HttpStatusCode.InternalServerError, message)
        }*/
    }
}

sealed interface TemplatePart {
    class Template(val value: String) : TemplatePart
    class Data(val value: Map<String, Any?>) : TemplatePart
}

val ContentTypeHandlebarsTemplate: ContentType = ContentType.parse("text/x-handlebars-template")
