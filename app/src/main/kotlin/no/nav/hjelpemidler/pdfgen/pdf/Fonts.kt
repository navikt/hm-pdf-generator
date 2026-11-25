package no.nav.hjelpemidler.pdfgen.pdf

import com.openhtmltopdf.extend.FSSupplier
import com.openhtmltopdf.outputdevice.helper.BaseRendererBuilder.FSFontUseCase
import com.openhtmltopdf.outputdevice.helper.BaseRendererBuilder.FontStyle
import com.openhtmltopdf.pdfboxout.PDFontSupplier
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder
import no.nav.hjelpemidler.collections.enumSetOf
import org.apache.fontbox.ttf.TTFParser
import org.apache.pdfbox.io.RandomAccessReadBuffer
import org.apache.pdfbox.pdmodel.PDDocument
import org.apache.pdfbox.pdmodel.font.PDType0Font
import java.io.InputStream

class FontFamily(
    private val name: String,
    private val location: String,
    private val fallback: Boolean = false,
    private val fonts: MutableList<Font> = mutableListOf(),
) : Iterable<Font> by fonts {
    private fun add(style: FontStyle, weight: Int, fileName: String) {
        fonts.add(
            Font(
                path = "$location/$fileName",
                family = name,
                weight = weight,
                style = style,
                fallback = fallback,
            )
        )
    }

    fun normal(fileName: String) = add(FontStyle.NORMAL, 400, fileName)
    fun bold(fileName: String) = add(FontStyle.NORMAL, 700, fileName)
    fun italic(fileName: String) = add(FontStyle.ITALIC, 400, fileName)
    fun boldItalic(fileName: String) = add(FontStyle.ITALIC, 700, fileName)
    fun oblique(fileName: String) = add(FontStyle.OBLIQUE, 700, fileName)
}

fun fontFamily(
    name: String,
    location: String,
    fallback: Boolean = false,
    block: FontFamily.() -> Unit = {},
): FontFamily = FontFamily(name, location, fallback).apply(block)

class Font(
    private val path: String,
    val family: String,
    val weight: Int,
    val style: FontStyle,
    val subset: Boolean = true,
    val fallback: Boolean = false,
) : FSSupplier<InputStream> {
    override fun supply(): InputStream = javaClass.inputStream(path)
}

fun Class<*>.inputStream(name: String): InputStream = getResourceAsStream(name) ?: error("Fant ikke: '$name'")

private fun PdfRendererBuilder.useFont(font: Font): PdfRendererBuilder =
    useFont(
        font,
        font.family,
        font.weight,
        font.style,
        font.subset,
        if (font.fallback) {
            enumSetOf(FSFontUseCase.DOCUMENT, FSFontUseCase.FALLBACK_PRE)
        } else {
            enumSetOf(FSFontUseCase.DOCUMENT)
        }
    )

fun PdfRendererBuilder.useFontFamily(family: FontFamily, fontDocument: PDDocument? = null): PdfRendererBuilder {
    family.forEach { font ->
        if (fontDocument == null) {
            useFont(font)
        } else {
            val bytes = font.supply().use(InputStream::readAllBytes)
            val trueTypeFont = TTFParser().parse(RandomAccessReadBuffer(bytes))
            fontDocument.registerTrueTypeFontForClosing(trueTypeFont)
            trueTypeFont.setEnableGsub(false)
            useFont(
                PDFontSupplier(PDType0Font.load(fontDocument, trueTypeFont, font.subset)),
                font.family,
                font.weight,
                font.style,
                font.subset,
            )
        }
    }
    return this
}
