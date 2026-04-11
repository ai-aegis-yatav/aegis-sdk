plugins {
    application
    kotlin("jvm") version "1.9.22" apply false
}

repositories {
    mavenCentral()
    maven { url = uri("https://jitpack.io") }
}

dependencies {
    // For local dev, uncomment the includeBuild line in settings.gradle.kts
    // instead to use the in-tree SDK. Otherwise this pulls from JitPack.
    implementation("com.github.ai-aegis-yatav:aegis-sdk:main-SNAPSHOT")
}

application {
    mainClass.set("ai.aegis.examples.Quickstart")
}

java {
    toolchain { languageVersion.set(JavaLanguageVersion.of(11)) }
}
