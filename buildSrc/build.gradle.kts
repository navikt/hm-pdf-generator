plugins {
    `kotlin-dsl`
}

repositories {
    gradlePluginPortal()
}

dependencies {
    implementation("org.jetbrains.kotlin:kotlin-gradle-plugin:1.7.21")
    implementation("com.diffplug.spotless:spotless-plugin-gradle:6.11.0")
    implementation("gradle.plugin.com.github.johnrengelman:shadow:7.1.2")
}
