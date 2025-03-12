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
            from("no.nav.hjelpemidler:katalog:25.069.123444")
            library("jcl-over-slf4j", "org.slf4j", "jcl-over-slf4j").versionRef("slf4j")
            library("jsoup", "org.jsoup:jsoup:1.18.3")
            val openhtmltopdf = version("openhtmltopdf", "1.0.10")
            library("openhtmltopdf-core", "com.openhtmltopdf", "openhtmltopdf-core").versionRef(openhtmltopdf)
            library("openhtmltopdf-pdfbox", "com.openhtmltopdf", "openhtmltopdf-pdfbox").versionRef(openhtmltopdf)
            library("openhtmltopdf-svg-support", "com.openhtmltopdf", "openhtmltopdf-svg-support").versionRef(openhtmltopdf)
            library("openhtmltopdf-slf4j", "com.openhtmltopdf", "openhtmltopdf-slf4j").versionRef(openhtmltopdf)
        }
    }
}

rootProject.name = "hm-pdf-generator"
include("app")
