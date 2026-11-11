import type { InlineStyle, TextChunk } from "../../../../../../types/objects";

function extractNodeStyle(element: HTMLElement, currentStyle: InlineStyle): InlineStyle {
    const style = { ...currentStyle };
    const tag = element.tagName.toUpperCase();
    const isBold = tag === "B" || tag === "STRONG" || element.style.fontWeight === "bold" 
    || Number(element.style.fontWeight) >= 700;

    const isItalic = tag === "I" || tag === "EM" || element.style.fontStyle === "italic";

    const isUnderline = tag === "U" || element.style.textDecoration.includes("underline") 

    if (isBold) style.bold = true;
    if (isItalic) style.italic = true;
    if (isUnderline) style.underline = true;
    const font = element.style.fontFamily || (tag === "FONT" ? element.getAttribute("face") : null);
    if (font) {
        style.fontFamily = font.replace(/['"]/g, "").trim() as InlineStyle["fontFamily"];
    }
    if (element.style.fontSize) {
        const size = parseInt(element.style.fontSize, 10);
        if (!isNaN(size) && size > 0 && size < 50) style.fontSize = size;
    }
    const color = element.style.color || (tag === "FONT" ? element.getAttribute("color") : null); 
    if (color) {
        style.fontColor = color;
    }
    return style;
}

function parseHtmlToChunks(
    container: HTMLElement,
    baseStyle: InlineStyle
): TextChunk[] {
    const chunks: TextChunk[] = [];

    function traverse(node: Node, style: InlineStyle) {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent || "";
            if (text) chunks.push({ text, style });
            return;
        }

        if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            const tag = element.tagName;
            if (tag === "BR") {
                chunks.push({ text: "\n", style });
                return;
            }
            const isBlock = tag === "DIV" || tag === "P";
            if (isBlock && chunks.length > 0) {
                const lastChunk = chunks[chunks.length - 1];
                if (!lastChunk.text.endsWith("\n")) {
                    chunks.push({ text: "\n", style });
                }
            }
            const nextStyle = extractNodeStyle(element, style);
            element.childNodes.forEach((child) => traverse(child, nextStyle));
            if (isBlock && chunks.length > 0) {
                const lastChunk = chunks[chunks.length - 1];
                if (!lastChunk.text.endsWith("\n")) {
                    chunks.push({ text: "\n", style: nextStyle });
                }
            }
        }
    }
    container.childNodes.forEach((child) => traverse(child, baseStyle));
    return chunks.length > 0 ? chunks : [{ text: "", style: { ...baseStyle } }];
}

export {parseHtmlToChunks}