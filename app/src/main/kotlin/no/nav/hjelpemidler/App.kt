package no.nav.hjelpemidler

import io.ktor.server.application.Application
import no.nav.hjelpemidler.saksbehandling.no.nav.hjelpemidler.ApplicationBuilder

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

fun Application.main() {
    with(ApplicationBuilder()) {
        configure()
    }
}
