plugins {
    `java-library`
    `maven-publish`
    signing
}

group = "ai.aegis"
version = "0.1.0"

java {
    sourceCompatibility = JavaVersion.VERSION_11
    targetCompatibility = JavaVersion.VERSION_11
    withJavadocJar()
    withSourcesJar()
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("com.fasterxml.jackson.core:jackson-databind:2.17.0")
    implementation("com.fasterxml.jackson.datatype:jackson-datatype-jsr310:2.17.0")

    testImplementation("org.junit.jupiter:junit-jupiter:5.10.2")
    testImplementation("org.mockito:mockito-core:5.11.0")
    testImplementation("com.github.tomakehurst:wiremock-jre8:3.0.1")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.test {
    useJUnitPlatform()
}

publishing {
    publications {
        create<MavenPublication>("mavenJava") {
            from(components["java"])
            pom {
                name.set("AEGIS SDK")
                description.set("Official Java SDK for the AEGIS Defense API")
                url.set("https://aiaegis.io")
                licenses {
                    license {
                        name.set("MIT License")
                        url.set("https://opensource.org/licenses/MIT")
                    }
                }
                developers {
                    developer {
                        id.set("aegis-team")
                        name.set("AEGIS Team")
                        email.set("aegis@yatavent.com")
                    }
                }
                scm {
                    connection.set("scm:git:git://github.com/ai-aegis-yatav/aegis-sdk.git")
                    url.set("https://github.com/ai-aegis-yatav/aegis-sdk")
                }
            }
        }
    }
}
