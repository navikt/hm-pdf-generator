dependencyResolutionManagement {
    @Suppress("UnstableApiUsage")
    repositories {
        mavenCentral()
        maven {
            url = uri("https://github-package-registry-mirror.gc.nav.no/cached/maven-release")
        }
        maven {
            url = uri("https://maven.pkg.github.com/navikt/*")
            credentials {
                username = System.getenv("GITHUB_ACTOR")
                password = System.getenv("GITHUB_TOKEN")
            }
        }
    }
    versionCatalogs {
        create("libs") {
            from("no.nav.hjelpemidler:katalog:26.321.140539")
        }
    }
}

rootProject.name = "hm-pdf-generator"
include("app")
