dependencyResolutionManagement {
    @Suppress("UnstableApiUsage")
    repositories {
        mavenCentral()
        maven {
            url = uri("https://maven.pkg.github.com/navikt/*")
            credentials {
                username = System.getenv("GITHUB_ACTOR")
                password = System.getenv("GITHUB_TOKEN")
            }
        }
        maven {
            url = uri("https://github-package-registry-mirror.gc.nav.no/cached/maven-release")
        }
    }
    versionCatalogs {
        create("libs") {
            from("no.nav.hjelpemidler:katalog:25.071.130447")

            library("jcl-over-slf4j", "org.slf4j", "jcl-over-slf4j").versionRef("slf4j")

            val jsoup = version("jsoup", "1.19.1")
            library("jsoup", "org.jsoup", "jsoup").versionRef(jsoup)

            val openhtmltopdf = version("openhtmltopdf", "1.1.24")
            listOf(
                "openhtmltopdf-core",
                "openhtmltopdf-pdfbox",
                "openhtmltopdf-slf4j",
                "openhtmltopdf-svg-support",
            ).forEach {
                library(it, "io.github.openhtmltopdf", it).versionRef(openhtmltopdf)
            }
        }
    }
}

rootProject.name = "hm-pdf-generator"
include("app")
