package no.nav.hjelpemidler.pdfgen

import io.ktor.server.application.Application

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

fun Application.main() {
    with(ApplicationBuilder()) {
        configure()
    }
}
