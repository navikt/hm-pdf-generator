package no.nav.hjelpemidler.pdfgen.pdf

import com.openhtmltopdf.extend.impl.FSDefaultCacheStore
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder.PdfAConformance
import com.openhtmltopdf.svgsupport.BatikSVGDrawer
import io.github.oshai.kotlinlogging.KotlinLogging
import io.github.oshai.kotlinlogging.withLoggingContext
import no.nav.hjelpemidler.logging.secureDebug
import org.apache.pdfbox.io.RandomAccessReadBuffer
import org.apache.pdfbox.multipdf.PDFMergerUtility
import org.jsoup.Jsoup
import org.jsoup.helper.W3CDom
import org.w3c.dom.Document
import java.io.InputStream
import java.io.OutputStream
import kotlin.text.replace

private val log = KotlinLogging.logger {}

class PdfService {
    fun lagPdf(html: String, outputStream: OutputStream) {
        log.debug { "Lager PDF" }
        withLoggingContext("html" to html) { log.secureDebug { "Lager PDF" } }

        // openhtmltopdf interprets raw newlines as <br/>, lets strip them away to make it work as html was intended
        val sanitizedHtml = html
            // Remove newlines, carriage returns, and tabs
            .replace(Regex("[\\n\\r\\t]"), "")
            // Remove leading/trailing whitespace inside tags (e.g. "<div>  text  </div>" -> "<div>text</div>")
            .replace(Regex(">(\\s+)([^<])"), ">$2")   // Remove leading whitespace inside a tag
            .replace(Regex("([^>])(\\s+)<"), "$1<")   // Remove trailing whitespace inside a tag
            // Collapse multiple spaces between words (optional, safer)
            .replace(Regex(" {2,}"), " ")
            .trim()

        val document = parseHtml(sanitizedHtml)
        PdfRendererBuilder()
            .useFastMode()
            .useColorProfile(colorProfile)
            .useFontFamily(sourceSans3)
            .useFontFamily(sourceSansPro)
            .useCacheStore(PdfRendererBuilder.CacheStore.PDF_FONT_METRICS, cacheStore)
            .usePdfAConformance(PdfAConformance.PDFA_2_A)
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

    private fun parseHtml(html: String): Document = W3CDom().fromJsoup(Jsoup.parse(html))

    private val cacheStore = FSDefaultCacheStore()
    private val colorProfile = javaClass.inputStream("/sRGB.icc").use(InputStream::readAllBytes)

    private val sourceSans3 = fontFamily(name = "Source Sans 3", location = "/fonts/source-sans-3", fallback = true) {
        normal("SourceSans3-Regular.ttf")
        italic("SourceSans3-It.ttf")
        oblique("SourceSans3-Bold.ttf")
    }

    private val sourceSansPro = fontFamily(name = "Source Sans Pro", location = "/fonts/source-sans-pro") {
        normal("SourceSansPro-Regular.ttf")
        italic("SourceSansPro-It.ttf")
        oblique("SourceSansPro-Bold.ttf")
    }
}
