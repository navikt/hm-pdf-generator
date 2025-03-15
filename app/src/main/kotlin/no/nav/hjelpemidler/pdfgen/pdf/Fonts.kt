package no.nav.hjelpemidler.pdfgen.pdf

import com.openhtmltopdf.extend.FSSupplier
import com.openhtmltopdf.outputdevice.helper.BaseRendererBuilder.FSFontUseCase
import com.openhtmltopdf.outputdevice.helper.BaseRendererBuilder.FontStyle
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder
import no.nav.hjelpemidler.collections.enumSetOf
import java.io.InputStream

class FontFamily(
    private val name: String,
    private val location: String,
    private val fallback: Boolean = false,
    private val fonts: MutableList<Font> = mutableListOf(),
) : Iterable<Font> by fonts {
    private fun add(style: FontStyle, fileName: String) {
        fonts.add(
            Font(
                path = "$location/$fileName",
                family = name,
                weight = style.weight,
                style = style,
                fallback = fallback,
            )
        )
    }

    fun normal(fileName: String) = add(FontStyle.NORMAL, fileName)
    fun italic(fileName: String) = add(FontStyle.ITALIC, fileName)
    fun oblique(fileName: String) = add(FontStyle.OBLIQUE, fileName)
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

private val FontStyle.weight: Int
    get() = when (this) {
        FontStyle.NORMAL -> 400
        FontStyle.ITALIC -> 400
        FontStyle.OBLIQUE -> 700
    }

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

fun PdfRendererBuilder.useFontFamily(family: FontFamily): PdfRendererBuilder {
    family.forEach(::useFont)
    return this
}
