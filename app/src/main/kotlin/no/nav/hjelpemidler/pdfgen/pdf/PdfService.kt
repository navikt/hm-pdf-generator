package no.nav.hjelpemidler.pdfgen.pdf

import com.openhtmltopdf.extend.FSSupplier
import com.openhtmltopdf.outputdevice.helper.BaseRendererBuilder
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder
import com.openhtmltopdf.svgsupport.BatikSVGDrawer
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.apache.pdfbox.io.IOUtils
import org.apache.pdfbox.io.MemoryUsageSetting
import org.apache.pdfbox.multipdf.PDFMergerUtility
import org.apache.pdfbox.pdmodel.PDDocument
import org.apache.pdfbox.pdmodel.PDPage
import org.apache.pdfbox.pdmodel.common.PDMetadata
import org.apache.pdfbox.pdmodel.common.PDRectangle
import org.apache.pdfbox.pdmodel.documentinterchange.logicalstructure.PDMarkInfo
import org.apache.pdfbox.pdmodel.documentinterchange.logicalstructure.PDStructureTreeRoot
import org.apache.pdfbox.pdmodel.graphics.color.PDOutputIntent
import org.apache.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences
import org.apache.xmpbox.XMPMetadata
import org.apache.xmpbox.xml.XmpSerializer
import org.jsoup.Jsoup
import org.jsoup.helper.W3CDom
import org.w3c.dom.Document
import java.io.ByteArrayOutputStream
import java.io.InputStream
import java.io.OutputStream
import java.util.Calendar

class PdfService {
    suspend fun lagPdf(html: String, outputStream: OutputStream) =
        withContext(Dispatchers.IO) {
            val document = W3CDom().fromJsoup(Jsoup.parse(html))
            genererPdf(document, outputStream)
        }

    suspend fun kombinerPdf(inputStreams: Iterable<InputStream>, outputStream: OutputStream) =
        withContext(Dispatchers.IO) {
            PDFMergerUtility().apply {
                inputStreams.forEach(::addSource)
                destinationStream = outputStream
                mergeDocuments(MemoryUsageSetting.setupMainMemoryOnly())
            }
        }

    private fun genererPdf(document: Document, outputStream: OutputStream) {
        PdfRendererBuilder()
            .useFastMode()
            .useFont(
                FontSupplier("SourceSansPro-Regular.ttf"),
                "Source Sans Pro",
                400,
                BaseRendererBuilder.FontStyle.NORMAL,
                true
            )
            .useFont(
                FontSupplier("SourceSansPro-Bold.ttf"),
                "Source Sans Pro",
                700,
                BaseRendererBuilder.FontStyle.OBLIQUE,
                true
            )
            .useFont(
                FontSupplier("SourceSansPro-It.ttf"),
                "Source Sans Pro",
                400,
                BaseRendererBuilder.FontStyle.ITALIC,
                true
            )
            .useSVGDrawer(BatikSVGDrawer())
            .withW3cDocument(document, "")
            .buildPdfRenderer()
            .apply {
                createPDFWithoutClosing()
                pdfDocument.apply {
                    conform(this)
                    save(outputStream)
                    close()
                }
            }
    }

    private val xmpSerializer = XmpSerializer()
    private val colorProfile = IOUtils.toByteArray(PdfService::class.java.getResourceAsStream("/sRGB.icc"))

    private fun conform(document: PDDocument) {
        val page = PDPage(PDRectangle.A4)
        document.documentCatalog.apply {
            language = "nb-NO"
            markInfo = PDMarkInfo(page.cosObject).apply { isMarked = true }
            metadata = PDMetadata(document).apply {
                val xmpMetadata = XMPMetadata.createXMPMetadata().apply {
                    createAndAddDublinCoreSchema().apply {
                        addCreator("navikt/hm-pdf-generator")
                        addDate(Calendar.getInstance())
                    }
                    createAndAddPFAIdentificationSchema().apply {
                        part = 2
                        conformance = "U"
                    }
                }

                val outputStream = ByteArrayOutputStream()
                xmpSerializer.serialize(xmpMetadata, outputStream, true)
                importXMPMetadata(outputStream.toByteArray())
            }
            structureTreeRoot = PDStructureTreeRoot()
            viewerPreferences = PDViewerPreferences(page.cosObject).apply { setDisplayDocTitle(true) }

            addOutputIntent(PDOutputIntent(document, colorProfile.inputStream()).apply {
                val profile = "sRGB IEC61966-2.1"
                info = profile
                outputCondition = profile
                outputConditionIdentifier = profile
                registryName = "http://www.color.org"
            })
        }
    }

    private class FontSupplier(val fontName: String) : FSSupplier<InputStream> {
        override fun supply(): InputStream =
            javaClass.getResourceAsStream("/fonts/$fontName") ?: error("Fant ikke font: $fontName")
    }
}
