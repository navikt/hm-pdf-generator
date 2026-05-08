package no.nav.hjelpemidler.pdfgen.pdf

import com.openhtmltopdf.extend.impl.FSDefaultCacheStore
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder
import com.openhtmltopdf.svgsupport.BatikSVGDrawer
import io.github.oshai.kotlinlogging.KotlinLogging
import io.github.oshai.kotlinlogging.withLoggingContext
import no.nav.hjelpemidler.logging.teamDebug
import org.apache.pdfbox.Loader
import org.apache.pdfbox.contentstream.operator.Operator
import org.apache.pdfbox.cos.COSDictionary
import org.apache.pdfbox.cos.COSName
import org.apache.pdfbox.io.RandomAccessReadBuffer
import org.apache.pdfbox.multipdf.PDFMergerUtility
import org.apache.pdfbox.pdfparser.PDFStreamParser
import org.apache.pdfbox.pdfwriter.ContentStreamWriter
import org.apache.pdfbox.pdmodel.common.PDStream
import org.jsoup.Jsoup
import org.jsoup.helper.W3CDom
import org.w3c.dom.Document
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.io.InputStream
import java.io.OutputStream

private val log = KotlinLogging.logger {}

class PdfService {
    fun lagPdf(html: String, outputStream: OutputStream) {
        log.debug { "Lager PDF" }
        withLoggingContext("html" to html) { log.teamDebug { "Lager PDF" } }

        // openhtmltopdf interprets raw newlines as <br/>, lets strip them away to make it work as html was intended
        val sanitizedHtml = html
            // Fix from hm-brev included here
            .replace("&#x27;", "'")
            // Avoid page-breaks between link and punctuation
            .replace(Regex("""<a\b[^>]*?>[^<]*?</a>\.""", RegexOption.DOT_MATCHES_ALL)) {
                val anchor = it.value
                """<span class="no-wrap">$anchor</span>"""
            }
            .trim()

        val document = parseHtml(sanitizedHtml)
        val rawPdf = ByteArrayOutputStream()
        PdfRendererBuilder()
            .useColorProfile(colorProfile)
            .useFontFamily(sourceSans3)
            .useFontFamily(sourceSansPro)
            .useCacheStore(PdfRendererBuilder.CacheStore.PDF_FONT_METRICS, cacheStore)
            .usePdfUaAccessibility(true)
            .usePdfAConformance(PdfRendererBuilder.PdfAConformance.PDFA_2_A)
            .useSVGDrawer(BatikSVGDrawer())
            .withW3cDocument(document, "")
            .toStream(rawPdf)
            .run()

        // openhtmltopdf emits BDC marked-content with named Properties resource references
        // (/Span /PropX BDC). Apple PDFKit (used by macOS Preview and VoiceOver) only supports
        // the inline MCID form (/Span <</MCID N>> BDC), so we rewrite all pages after generation.
        rewriteBdcToInlineMcid(rawPdf.toByteArray(), outputStream)
    }

    fun kombinerPdf(byteArrays: Collection<ByteArray>, outputStream: OutputStream) {
        log.debug { "Kombinerer PDF, antall: ${byteArrays.size}" }
        PDFMergerUtility().apply {
            byteArrays.map(::RandomAccessReadBuffer).forEach(::addSource)
            destinationStream = outputStream
            mergeDocuments(null)
        }
    }

    fun toXhtml(html: String): String =
        Jsoup.parse(html).outputSettings(
            org.jsoup.nodes.Document.OutputSettings().syntax(org.jsoup.nodes.Document.OutputSettings.Syntax.xml)
        ).html()

    private fun rewriteBdcToInlineMcid(inputBytes: ByteArray, outputStream: OutputStream) {
        Loader.loadPDF(inputBytes).use { doc ->
            for (page in doc.pages) {
                val resources = page.resources ?: continue
                val propertiesDict = resources.cosObject
                    .getDictionaryObject(COSName.getPDFName("Properties")) as? COSDictionary ?: continue

                val tokens = PDFStreamParser(page).parse()
                val newTokens = ArrayList<Any>(tokens.size)

                for ((idx, token) in tokens.withIndex()) {
                    if (token is Operator && token.name == "BDC" && idx >= 2) {
                        val prop = tokens[idx - 1]
                        if (prop is COSName) {
                            val propDict = propertiesDict.getDictionaryObject(prop) as? COSDictionary
                            val mcid = propDict?.getInt(COSName.getPDFName("MCID"), -1) ?: -1
                            if (mcid >= 0) {
                                // Replace named property reference with inline MCID dict
                                newTokens.removeAt(newTokens.size - 1)
                                newTokens.add(COSDictionary().also { it.setInt(COSName.getPDFName("MCID"), mcid) })
                            }
                        }
                    }
                    newTokens.add(token)
                }

                val contentBytes = ByteArrayOutputStream().also {
                    ContentStreamWriter(it).writeTokens(newTokens)
                }.toByteArray()
                page.setContents(PDStream(doc, ByteArrayInputStream(contentBytes)))
                resources.cosObject.removeItem(COSName.getPDFName("Properties"))
            }
            // Save to an intermediate buffer — PDFBox flushes/closes internal streams
            // when the document is closed, which must happen before we write to the
            // Ktor response stream to avoid ClosedWriteChannelException.
            val buf = ByteArrayOutputStream()
            doc.save(buf)
            buf.writeTo(outputStream)
        }
    }

    private fun parseHtml(html: String): Document = W3CDom().fromJsoup(Jsoup.parse(html))

    private val cacheStore = FSDefaultCacheStore()
    private val colorProfile = javaClass.inputStream("/sRGB.icc").use(InputStream::readAllBytes)

    private val sourceSans3 = fontFamily(name = "Source Sans 3", location = "/fonts/source-sans-3", fallback = true) {
        normal("SourceSans3-Regular.ttf")
        bold("SourceSans3-Bold.ttf")
        italic("SourceSans3-It.ttf")
        boldItalic("SourceSans3-BoldIt.ttf")
    }

    private val sourceSansPro = fontFamily(name = "Source Sans Pro", location = "/fonts/source-sans-pro") {
        normal("SourceSansPro-Regular.ttf")
        bold("SourceSansPro-Bold.ttf")
        italic("SourceSansPro-It.ttf")
        boldItalic("SourceSansPro-BoldIt.ttf")
    }
}
