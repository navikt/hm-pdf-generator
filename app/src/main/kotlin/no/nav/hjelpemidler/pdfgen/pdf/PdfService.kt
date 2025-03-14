package no.nav.hjelpemidler.pdfgen.pdf

import com.openhtmltopdf.extend.FSSupplier
import com.openhtmltopdf.outputdevice.helper.BaseRendererBuilder.FontStyle
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder
import com.openhtmltopdf.svgsupport.BatikSVGDrawer
import io.github.oshai.kotlinlogging.KotlinLogging
import org.apache.pdfbox.io.RandomAccessReadBuffer
import org.apache.pdfbox.multipdf.PDFMergerUtility
import org.jsoup.Jsoup
import org.jsoup.helper.W3CDom
import java.io.InputStream
import java.io.OutputStream

private val log = KotlinLogging.logger {}

class PdfService {
    fun lagPdf(html: String, outputStream: OutputStream) {
        log.debug { "Lager PDF, html: `$html`" }
        val document = W3CDom().fromJsoup(Jsoup.parse(html))
        PdfRendererBuilder()
            .useColorProfile(colorProfile)
            .useFastMode()
            .useFont(sourceSansBold)
            .useFont(sourceSansItalic)
            .useFont(sourceSansRegular)
            .usePdfAConformance(PdfRendererBuilder.PdfAConformance.PDFA_2_A)
            .usePdfUaAccessibility(true)
            .useSVGDrawer(BatikSVGDrawer())
            .withW3cDocument(document, null)
            .toStream(outputStream)
            .run()
    }

    fun kombinerPdf(byteArrays: Collection<ByteArray>, outputStream: OutputStream) {
        log.debug { "Kombinerer PDF, antall: ${byteArrays.size}" }
        PDFMergerUtility().apply {
            byteArrays.map(::RandomAccessReadBuffer).forEach(::addSource)
            destinationStream = outputStream
            mergeDocuments(null)
        }
    }

    private val colorProfile: ByteArray = javaClass.inputStream("/sRGB.icc").use(InputStream::readAllBytes)

    private val sourceSansRegular = Font(
        fileName = "SourceSans3-Regular.ttf",
        name = "Source Sans Pro", // NB! Font family ikke endret til "Source Sans 3"
        weight = 400,
        style = FontStyle.NORMAL,
        subset = true,
    )
    private val sourceSansBold = Font(
        fileName = "SourceSans3-Bold.ttf",
        name = "Source Sans Pro", // NB! Font family ikke endret til "Source Sans 3"
        weight = 700,
        style = FontStyle.OBLIQUE,
        subset = true,
    )
    private val sourceSansItalic = Font(
        fileName = "SourceSans3-It.ttf",
        name = "Source Sans Pro", // NB! Font family ikke endret til "Source Sans 3"
        weight = 400,
        style = FontStyle.ITALIC,
        subset = true,
    )
}

private class Font(
    val fileName: String,
    val name: String,
    val weight: Int,
    val style: FontStyle,
    val subset: Boolean = true,
) : FSSupplier<InputStream> {
    override fun supply(): InputStream = javaClass.inputStream("/fonts/$fileName")
}

private fun PdfRendererBuilder.useFont(font: Font) = useFont(font, font.name, font.weight, font.style, font.subset)

private fun Class<*>.inputStream(name: String): InputStream = getResourceAsStream(name) ?: error("Fant ikke: '$name'")
