plugins {
    id("no.nav.hjelpemidler.kotlin-common-conventions")
    id("io.ktor.plugin")
}

dependencies {
    implementation("io.micrometer:micrometer-registry-prometheus:1.11.1")
    implementation("io.github.microutils:kotlin-logging:3.0.5")
    runtimeOnly("ch.qos.logback:logback-classic:1.4.8")
    runtimeOnly("net.logstash.logback:logstash-logback-encoder:7.4") {
        exclude("com.fasterxml.jackson.core")
        exclude("com.fasterxml.jackson.dataformat")
    }
}
