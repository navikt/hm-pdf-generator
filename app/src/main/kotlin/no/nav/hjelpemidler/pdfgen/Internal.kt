package no.nav.hjelpemidler.pdfgen

import io.ktor.http.ContentType
import io.ktor.http.withCharset
import io.ktor.server.response.respondOutputStream
import io.ktor.server.response.respondText
import io.ktor.server.routing.Route
import io.ktor.server.routing.get

fun Route.internal() {
    get("/isalive") {
        call.respondText("ALIVE", ContentType.Text.Plain)
    }
    get("/isready") {
        call.respondText("READY", ContentType.Text.Plain)
    }
    get("/metrics") {
        val contentType = ContentType.Text.Plain.withCharset(Charsets.UTF_8)
        call.respondOutputStream(contentType) {
            Metrics.registry.scrape(this, contentType.toString())
        }
    }
}
