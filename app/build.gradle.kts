plugins {
    id("no.nav.hjelpemidler.kotlin-application-conventions")
}

application {
    mainClass.set("no.nav.hjelpemidler.pdfgen.AppKt")
}

val openhtmltopdfVersion = "1.0.10"
val ktorVersion = "2.3.1"

dependencies {
    implementation("com.openhtmltopdf:openhtmltopdf-core:$openhtmltopdfVersion")
    implementation("com.openhtmltopdf:openhtmltopdf-pdfbox:$openhtmltopdfVersion")
    implementation("com.openhtmltopdf:openhtmltopdf-svg-support:$openhtmltopdfVersion")
    implementation("org.jsoup:jsoup:1.16.1")

    implementation("io.ktor:ktor-server-core:$ktorVersion")
    implementation("io.ktor:ktor-server-netty:$ktorVersion")
    implementation("io.ktor:ktor-server-call-logging:$ktorVersion")

    implementation("io.ktor:ktor-client-core:$ktorVersion")

    testImplementation("io.mockk:mockk:1.13.5")
    testImplementation("io.ktor:ktor-server-test-host:$ktorVersion")
}
