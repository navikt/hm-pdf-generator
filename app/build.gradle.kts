plugins {
    id("no.nav.hjelpemidler.kotlin-application-conventions")
}

application {
    mainClass.set("no.nav.hjelpemidler.pdfgen.AppKt")
}

dependencies {
    // PDFgen
    implementation("com.openhtmltopdf:openhtmltopdf-core:1.0.10")
    implementation("com.openhtmltopdf:openhtmltopdf-pdfbox:1.0.10")
    implementation("com.openhtmltopdf:openhtmltopdf-svg-support:1.0.10")
    implementation("org.jsoup:jsoup:1.15.3")

    // Ktor
    fun ktor(name: String) = "io.ktor:ktor-$name:2.1.3"

    // Ktor Server
    fun ktorServer(name: String) = ktor("server-$name")
    implementation(ktorServer("core"))
    implementation(ktorServer("netty"))
    implementation(ktorServer("call-logging"))

    // Ktor Client
    fun ktorClient(name: String) = ktor("client-$name")
    implementation(ktorClient("core"))

    testImplementation("io.mockk:mockk:1.13.2")
    testImplementation(ktor("server-test-host")) {
        // https://youtrack.jetbrains.com/issue/KT-46090
        exclude("org.jetbrains.kotlin", "kotlin-test-junit")
    }
}

