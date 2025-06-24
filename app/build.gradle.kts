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
    implementation(libs.hotlibs.serialization)

    implementation(libs.handlebars)
    implementation(libs.jsoup)
    implementation(libs.openhtmltopdf.core)
    implementation(libs.openhtmltopdf.pdfbox)
    implementation(libs.openhtmltopdf.slf4j)
    implementation(libs.openhtmltopdf.svg.support)

    implementation("com.github.rjeschke:txtmark:0.13")

    implementation(libs.ktor.server.call.logging)
    implementation(libs.ktor.server.core)
    implementation(libs.ktor.server.metrics.micrometer)
    implementation(libs.ktor.server.netty)

    implementation(libs.micrometer.registry.prometheus)

    runtimeOnly(libs.jclOverSlf4j)
}

java { toolchain { languageVersion.set(JavaLanguageVersion.of(21)) } }

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
