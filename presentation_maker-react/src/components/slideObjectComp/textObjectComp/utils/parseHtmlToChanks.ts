import type { InlineStyle, TextChunk } from "../../../../../../types/objects";

export function parseHtmlToChunks(
    container: HTMLElement,
    baseStyle: InlineStyle
): TextChunk[] {
    const chunks: TextChunk[] = [];

    function traverse(node: Node, currentStyle: InlineStyle) {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent || "";
            if (text.length > 0) {
                chunks.push({
                    text,
                    style: { ...currentStyle },
                });
            }
            return;
        }

        if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            const tag = element.tagName.toUpperCase();

            if (tag === "BR") {
                chunks.push({
                    text: "\n",
                    style: { ...currentStyle },
                });
                return;
            }

            const nextStyle: InlineStyle = { ...currentStyle };
            if (tag === "B" || tag === "STRONG" || element.style.fontWeight === "bold" || Number(element.style.fontWeight) >= 700) {
                nextStyle.bold = true;
            }
            if (tag === "I" || tag === "EM" || element.style.fontStyle === "italic") {
                nextStyle.italic = true;
            }
            if (tag === "U" || element.style.textDecoration.includes("underline") || element.style.textDecorationLine.includes("underline")) {
                nextStyle.underline = true;
            }

            if (element.style.fontFamily) {
                nextStyle.fontFamily = element.style.fontFamily.replace(/['"]/g, "").trim() as InlineStyle["fontFamily"];
            } else if (tag === "FONT" && element.getAttribute("face")) {
                nextStyle.fontFamily = element.getAttribute("face")!.replace(/['"]/g, "").trim() as InlineStyle["fontFamily"];
            }
            if (element.style.fontSize) {
                const parsedSize = parseInt(element.style.fontSize, 10);
                if (!isNaN(parsedSize)) {
                    nextStyle.fontSize = parsedSize;
                }
            }
            if (element.style.color) {
                nextStyle.fontColor = element.style.color;
            } else if (tag === "FONT" && element.getAttribute("color")) {
                nextStyle.fontColor = element.getAttribute("color")!;
            }

            element.childNodes.forEach((child) => traverse(child, nextStyle));
        }
    }

    container.childNodes.forEach((child) => traverse(child, baseStyle));

    if (chunks.length === 0) {
        return [{ text: "", style: { ...baseStyle } }];
    }

    return chunks;
}