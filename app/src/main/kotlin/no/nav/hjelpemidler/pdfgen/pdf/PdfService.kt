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
import org.apache.xmpbox.type.BadFieldValueException
import org.apache.xmpbox.xml.XmpSerializer
import org.jsoup.Jsoup
import org.jsoup.helper.W3CDom
import org.w3c.dom.Document
import java.io.ByteArrayOutputStream
import java.io.IOException
import java.io.InputStream
import java.io.OutputStream
import java.util.Calendar

class PdfService {
    private val colorProfile = IOUtils.toByteArray(PdfService::class.java.getResourceAsStream("/sRGB.icc"))

    suspend fun lagPdf(html: String): ByteArray = withContext(Dispatchers.IO) {
        val pdfOutputStream = ByteArrayOutputStream()
        val w3cDokument = W3CDom().fromJsoup(Jsoup.parse(html))
        genererPdf(w3cDokument, pdfOutputStream)
        pdfOutputStream.toByteArray()
    }

    suspend fun kombinerPdf(sources: Collection<InputStream>): ByteArray = withContext(Dispatchers.IO) {
        val pdfOutputStream = ByteArrayOutputStream()
        try {
            val merger = PDFMergerUtility()
            merger.destinationStream = pdfOutputStream
            sources.forEach(merger::addSource)
            merger.mergeDocuments(MemoryUsageSetting.setupMainMemoryOnly())
        } catch (e: IOException) {
            throw RuntimeException("Feil ved kombinering av PDF", e)
        }
        pdfOutputStream.toByteArray()
    }

    private fun genererPdf(w3cDokument: Document, outputStream: OutputStream) {
        try {
            val builder = PdfRendererBuilder().useFastMode().useFont(
                FontSupplier("SourceSansPro-Regular.ttf"),
                "Source Sans Pro",
                400,
                BaseRendererBuilder.FontStyle.NORMAL,
                true
            ).useFont(
                FontSupplier("SourceSansPro-Bold.ttf"),
                "Source Sans Pro",
                700,
                BaseRendererBuilder.FontStyle.OBLIQUE,
                true
            ).useFont(
                FontSupplier("SourceSansPro-It.ttf"), "Source Sans Pro", 400, BaseRendererBuilder.FontStyle.ITALIC, true
            ).useSVGDrawer(BatikSVGDrawer()).withW3cDocument(w3cDokument, "").buildPdfRenderer()
            builder.createPDFWithoutClosing()
            builder.pdfDocument.conform()
            builder.pdfDocument.save(outputStream)
            builder.pdfDocument.close()
        } catch (e: IOException) {
            throw RuntimeException("Feil ved generering av PDF", e)
        }
    }

    private fun PDDocument.conform() {
        val xmpMetadata = XMPMetadata.createXMPMetadata()
        val catalog = this.documentCatalog
        val calendar = Calendar.getInstance()
        val page = PDPage(PDRectangle.A4)

        try {
            val schema = xmpMetadata.createAndAddDublinCoreSchema()
            schema.addCreator("navikt/hm-pdf-generator")
            schema.addDate(calendar)

            val id = xmpMetadata.createAndAddPFAIdentificationSchema()
            id.part = 2
            id.conformance = "U"

            val serializer = XmpSerializer()
            val outputStream = ByteArrayOutputStream()
            serializer.serialize(xmpMetadata, outputStream, true)

            val pdMetadata = PDMetadata(this)
            pdMetadata.importXMPMetadata(outputStream.toByteArray())
            catalog.metadata = pdMetadata
        } catch (e: BadFieldValueException) {
            throw IllegalArgumentException(e)
        }

        val intent = PDOutputIntent(this, colorProfile.inputStream())
        intent.info = "sRGB IEC61966-2.1"
        intent.outputCondition = "sRGB IEC61966-2.1"
        intent.outputConditionIdentifier = "sRGB IEC61966-2.1"
        intent.registryName = "http://www.color.org"
        catalog.addOutputIntent(intent)
        catalog.language = "nb-NO"

        val viewerPreferences = PDViewerPreferences(page.cosObject)
        viewerPreferences.setDisplayDocTitle(true)
        catalog.viewerPreferences = viewerPreferences

        catalog.markInfo = PDMarkInfo(page.cosObject)
        catalog.structureTreeRoot = PDStructureTreeRoot()
        catalog.markInfo.isMarked = true
    }

    private class FontSupplier(val fontName: String) : FSSupplier<InputStream> {
        override fun supply(): InputStream {
            return requireNotNull(javaClass.getResourceAsStream("/fonts/$fontName"))
        }
    }
}
