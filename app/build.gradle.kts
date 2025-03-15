plugins {
    alias(libs.plugins.kotlin.jvm)
    alias(libs.plugins.ktor)
}

application {
    mainClass.set("no.nav.hjelpemidler.pdfgen.AppKt")
}

dependencies {
    implementation(libs.hotlibs.http)
    implementation(libs.hotlibs.logging)

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
