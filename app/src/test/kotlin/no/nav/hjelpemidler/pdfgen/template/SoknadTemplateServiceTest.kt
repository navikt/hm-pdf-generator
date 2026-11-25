package no.nav.hjelpemidler.pdfgen.template

import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldContain
import io.kotest.matchers.string.shouldNotContain
import no.nav.hjelpemidler.pdfgen.pdf.inputStream
import no.nav.hjelpemidler.serialization.jackson.jsonMapper
import org.jsoup.Jsoup
import org.junit.jupiter.api.Test
import tools.jackson.module.kotlin.readValue
import java.util.Base64

class SoknadTemplateServiceTest {
    private val service = SoknadTemplateService()

    @Test
    fun `current product categories attachments illustrations and contact details are preserved`() {
        val html = service.html("innsenderbehovsmelding", data("behovsmelding"))
        val document = Jsoup.parse(html)
        document.text().apply {
            shouldContain("24.11.2026")
            shouldContain("Kategoriens hjelpemiddel")
            shouldContain("Kategoriens tilbehør")
            shouldContain("Testdør")
            shouldContain("testdor.pdf")
            shouldContain("kategori.pdf")
            shouldContain("stellebord.pdf")
            shouldContain("Vedlegg til veggmontert stellebord")
            shouldContain("test@example.invalid")
            shouldContain("Opplæringsansvarlig er gjort oppmerksom")
            shouldContain("Informasjon i testsaken")
            shouldContain("Advarsel i testsaken")
            shouldContain("Inline testvarsel")
        }
        document.select("img.toalettmaal-bilde").size shouldBe 2
        document.select("#header .title").text() shouldBe "Søknad om hjelpemidler"
        document.select("tr").single { it.selectFirst("td")?.text() == "Leveringsadresse" }
            .text() shouldBe "Leveringsadresse Folkeregistrert adresse: Testveien 1, 0001 Teststed"
        html shouldContain "background: #DADE99"
    }

    @Test
    fun `shared SVG partials are embedded with the correct image type`() {
        val html = service.html("innsenderbehovsmelding", data("behovsmelding"))
        for (name in listOf("info-icon", "warning-icon")) {
            val bytes = javaClass.inputStream("/delmaler/images/$name.hbs").use { it.readAllBytes() }
            html shouldContain "data:image/svg+xml;base64,${Base64.getEncoder().encodeToString(bytes)}"
        }
    }

    @Test
    fun `only subsidy hides delivery quantity and total sections`() {
        val data = data("behovsmelding") + mapOf(
            "kunTilskuddRimeligeHjelpemidler" to true,
            "hjelpemidler" to mapOf(
                "hjelpemidler" to emptyList<Any>(),
                "tilbehør" to emptyList<Any>(),
                "totaltAntall" to 1,
                "produktkategorier" to listOf(
                    mapOf("type" to "TILSKUDD_RIMELIGE_HJELPEMIDLER", "navn" to "Tilskudd", "antall" to 1),
                ),
            ),
            "levering" to emptyMap<String, Any>(),
            "prioritet" to "NORMAL",
        )
        val ordinary = Jsoup.parse(
            service.html("innsenderbehovsmelding", data + ("kunTilskuddRimeligeHjelpemidler" to false)),
        ).text()
        ordinary shouldContain "Utlevering"
        ordinary shouldContain "1 stk."
        ordinary shouldContain "Totalt: 1 stk. inkl. tilbehør"
        Jsoup.parse(service.html("innsenderbehovsmelding", data)).text().apply {
            shouldContain("Tilskudd")
            shouldNotContain("Utlevering")
            shouldNotContain("1 stk.")
            shouldNotContain("Totalt:")
        }
    }

    @Test
    fun `brukerpassbytte preserves reason address and numeric date`() {
        Jsoup.parse(service.html("brukerpassbytte", data("brukerpassbytte"))).text().apply {
            shouldContain("24.11.2026")
            shouldContain("Testbegrunnelse")
            shouldContain("Testveien 2")
            shouldContain("26848497710")
        }
    }

    @Test
    fun `behovsmelding retains titles for all three message types`() {
        for ((type, title) in listOf(
            "SØKNAD" to "Søknad om hjelpemidler",
            "BESTILLING" to "Bestilling av hjelpemidler",
            "BYTTE" to "Bytte av hjelpemidler",
        )) {
            val document = Jsoup.parse(service.html("innsenderbehovsmelding", data("behovsmelding") + ("type" to type)))
            document.select("#header .title").text() shouldBe title
            document.title() shouldBe title
        }
    }

    @Test
    fun `brukerpassbytte retains registered address and worn-out reason`() {
        val data = data("brukerpassbytte") + mapOf(
            "utleveringsmåte" to "FOLKEREGISTRERT_ADRESSE",
            "bytteårsak" to "UTSLITT",
            "byttebegrunnelse" to null,
        )
        Jsoup.parse(service.html("brukerpassbytte", data)).text().apply {
            shouldContain("Testveien 1")
            shouldNotContain("Testveien 2")
            shouldNotContain("Testbegrunnelse")
        }
    }

    private fun data(name: String): Map<String, Any?> = javaClass.inputStream("/soknad/$name.json")
        .bufferedReader().use { jsonMapper.readValue(it.readText()) }
}
