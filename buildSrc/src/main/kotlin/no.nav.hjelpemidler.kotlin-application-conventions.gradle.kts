plugins {
    application
    id("no.nav.hjelpemidler.kotlin-common-conventions")
    id("com.github.johnrengelman.shadow")
}

dependencies {
    implementation("com.natpryce:konfig:1.6.10.0")
    implementation("org.apache.kafka:kafka-clients:3.3.1")
    implementation("io.micrometer:micrometer-registry-prometheus:1.10.1")
    implementation("io.github.microutils:kotlin-logging:3.0.4")
    runtimeOnly("ch.qos.logback:logback-classic:1.4.5")
    runtimeOnly("net.logstash.logback:logstash-logback-encoder:7.2") {
        exclude("com.fasterxml.jackson.core")
        exclude("com.fasterxml.jackson.dataformat")
    }
}
