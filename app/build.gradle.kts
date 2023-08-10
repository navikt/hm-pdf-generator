plugins {
    id("no.nav.hjelpemidler.kotlin-application-conventions")
}

application {
    mainClass.set("no.nav.hjelpemidler.pdfgen.AppKt")
}

val openhtmltopdfVersion = "1.0.10"

dependencies {
    implementation("com.openhtmltopdf:openhtmltopdf-core:$openhtmltopdfVersion")
    implementation("com.openhtmltopdf:openhtmltopdf-pdfbox:$openhtmltopdfVersion")
    implementation("com.openhtmltopdf:openhtmltopdf-svg-support:$openhtmltopdfVersion")
    implementation("com.openhtmltopdf:openhtmltopdf-slf4j:$openhtmltopdfVersion")
    implementation("org.jsoup:jsoup:1.16.1")

    implementation("io.ktor:ktor-server-core")
    implementation("io.ktor:ktor-server-netty")
    implementation("io.ktor:ktor-server-call-logging")

    runtimeOnly("org.slf4j:jcl-over-slf4j:2.0.7")

    testImplementation("io.mockk:mockk:1.13.5")
    testImplementation("io.ktor:ktor-server-test-host")
}
