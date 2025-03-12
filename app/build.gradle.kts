plugins {
    alias(libs.plugins.kotlin.jvm)
    alias(libs.plugins.ktor)
}

application {
    mainClass.set("no.nav.hjelpemidler.pdfgen.AppKt")
}

val openhtmltopdfVersion = "1.0.10"

dependencies {
    implementation(libs.kotlin.logging)
    implementation(libs.hotlibs.http)

    implementation(libs.openhtmltopdf.core)
    implementation(libs.openhtmltopdf.pdfbox)
    implementation(libs.openhtmltopdf.svg.support)
    implementation(libs.openhtmltopdf.slf4j)
    implementation(libs.jsoup)

    implementation(libs.ktor.server.core)
    implementation(libs.ktor.server.netty)
    implementation(libs.ktor.server.call.logging)
    implementation(libs.ktor.server.metrics.micrometer)

    implementation(libs.micrometer.registry.prometheus)
    implementation("io.ktor:ktor-server-core:3.1.1")
    implementation("io.ktor:ktor-server-metrics-micrometer:3.1.1")
    implementation("io.micrometer:micrometer-registry-prometheus:1.6.13")
    implementation("io.ktor:ktor-server-core:3.1.1")

    runtimeOnly(libs.jcl.over.slf4j)
}

kotlin {
    jvmToolchain(21)
}

@Suppress("UnstableApiUsage")
testing {
    suites {
        val test by getting(JvmTestSuite::class) {
            useKotlinTest(libs.versions.kotlin.asProvider())
            dependencies {
                implementation(libs.hotlibs.test)
                implementation(libs.ktor.server.test.host)
            }
        }
    }
}
