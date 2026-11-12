
import type { TextChunk } from "../../../../../../types/objects";

function chunksToHtml(content: TextChunk[]): string {
    return content
        .map((chunk) => {
            let text = chunk.text
                .replaceAll("&", "&amp;")
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll("\n", "<br>");
            const styles: string[] = [];
            if (chunk.style.fontFamily) {
                const cleanFont = chunk.style.fontFamily.replace(/['"]/g, "");
                styles.push(`font-family: '${cleanFont}'`);
            }
            if (chunk.style.fontSize) {
                styles.push(`font-size: ${chunk.style.fontSize}px`);
            }
            if (chunk.style.fontColor) {
                styles.push(`color: ${chunk.style.fontColor}`);
            }
            if (chunk.style.bold) {
                styles.push(`font-weight: bold`);
            }
            if (chunk.style.italic) {
                styles.push(`font-style: italic`);
            }
            if (chunk.style.underline) {
                styles.push(`text-decoration: underline`);
            }
            return `<span style="${styles.join("; ")}">${text}</span>`;
        })
        .join("");
}

function placeCaretAtEnd(editor: HTMLElement) {
    editor.focus();
    const selection = window.getSelection();
    if (!selection) return;
    const range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
}

export {
    placeCaretAtEnd,
    chunksToHtml
}